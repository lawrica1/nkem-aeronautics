import { Prisma } from "@prisma/client";
import { prisma } from "../../config/prisma.js";
import { env } from "../../config/env.js";
import { HttpError } from "../../shared/errors/HttpError.js";
import { escapeHtml } from "../../shared/utils/html.js";
import { nextReceiptNumber } from "../logbooks/counter.model.js";
import { sendEmail } from "../notifications/email.service.js";
import { createNotification, notify } from "../notifications/notification.service.js";
import {
  orderConfirmation,
  orderStatusUpdate,
  adminNewOrder,
} from "../notifications/email.templates.js";
import { ORDER_STATUS, ORDER_STATUS_VALUES, ORDER_STATUS_LABELS, PAYMENT_METHODS } from "./order.constants.js";
import { serializeOrder } from "./order.serializer.js";

const ORDER_INCLUDE = { items: { include: { product: true } }, payments: true, receipt: true };

async function buildOrderItems(items) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new HttpError(400, "At least one item is required.");
  }

  const productIds = items.map((item) => item.productId);
  const products = await prisma.product.findMany({ where: { id: { in: productIds } } });
  const byId = new Map(products.map((p) => [p.id, p]));

  let totalAmount = 0;
  const rows = items.map((item) => {
    const product = byId.get(item.productId);
    if (!product) throw new HttpError(404, `Product ${item.productId} not found.`);
    if (product.price === null) {
      throw new HttpError(400, `"${product.name}" doesn't have a price yet — contact us to enquire instead.`);
    }
    const quantity = Math.max(1, Number(item.quantity) || 1);
    totalAmount += product.price * quantity;
    return { productId: product.id, quantity, unitPrice: product.price };
  });

  return { rows, totalAmount };
}

export async function createForUser(user, body) {
  const { rows, totalAmount } = await buildOrderItems(body.items);

  const order = await prisma.order.create({
    data: {
      userId: user.id,
      channel: "online",
      totalAmount,
      notes: body.notes || "",
      items: { create: rows },
    },
    include: ORDER_INCLUDE,
  });

  const itemsForEmail = order.items.map((i) => ({ name: i.product?.name || i.productId, quantity: i.quantity, unitPrice: i.unitPrice }));

  // Customer confirmation
  notify(
    user.id,
    { type: "order_placed", title: "Your order has been received", body: `Total: ${totalAmount.toLocaleString("fr-CM")} XAF`, link: "/logbook" },
    "Your order has been received — Nkem Aeronautics",
    orderConfirmation({ name: user.name, orderId: order.id, items: itemsForEmail, total: totalAmount }),
  ).catch((err) => console.error("[notify:order_placed]", err.message));

  // Admin alert
  sendEmail(
    env.adminEmail,
    `New online order — ${totalAmount.toLocaleString("fr-CM")} XAF`,
    adminNewOrder({ userName: `${user.name || ""} ${user.surname || ""}`.trim(), userEmail: user.email, orderId: order.id, items: itemsForEmail, total: totalAmount }),
  ).catch((err) => console.error("[admin-notify:new_order]", err.message));

  return serializeOrder(order);
}

export async function createForAdmin(body) {
  if (!body.userId) throw new HttpError(400, "userId is required.");
  const { rows, totalAmount } = await buildOrderItems(body.items);

  const order = await prisma.order.create({
    data: {
      userId: body.userId,
      channel: body.channel === "online" ? "online" : "on_site",
      totalAmount,
      notes: body.notes || "",
      items: { create: rows },
    },
    include: ORDER_INCLUDE,
  });

  const itemsForEmail = order.items.map((i) => ({ name: i.product?.name || i.productId, quantity: i.quantity, unitPrice: i.unitPrice }));
  const customer = await prisma.user.findUnique({ where: { id: body.userId }, select: { name: true, email: true } });

  // Customer confirmation
  if (customer) {
    notify(
      body.userId,
      { type: "order_placed", title: "An order has been created for you", body: `Total: ${totalAmount.toLocaleString("fr-CM")} XAF`, link: "/logbook" },
      "Your order has been received — Nkem Aeronautics",
      orderConfirmation({ name: customer.name, orderId: order.id, items: itemsForEmail, total: totalAmount }),
    ).catch((err) => console.error("[notify:order_placed_admin]", err.message));
  }

  return serializeOrder(order);
}

export async function listForUser(user) {
  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    include: ORDER_INCLUDE,
    orderBy: { createdAt: "desc" },
  });
  return orders.map(serializeOrder);
}

export async function listForAdmin({ status } = {}) {
  const orders = await prisma.order.findMany({
    where: { ...(status && { status }) },
    include: {
      ...ORDER_INCLUDE,
      user: { select: { id: true, name: true, surname: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 200,
  });
  return orders.map(serializeOrder);
}

export async function updateStatus(id, body) {
  if (!ORDER_STATUS_VALUES.includes(body.status)) {
    throw new HttpError(400, "A valid order status is required.");
  }

  const order = await prisma.order
    .update({ where: { id }, data: { status: body.status }, include: ORDER_INCLUDE })
    .catch((err) => {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") return null;
      throw err;
    });
  if (!order) throw new HttpError(404, "Order not found.");

  const statusLabel = ORDER_STATUS_LABELS[order.status] || order.status;
  notify(
    order.userId,
    { type: "order_status", title: `Order update: ${statusLabel}`, body: `Order ${order.id.slice(0, 8)}`, link: "/logbook" },
    `Your order has been updated — ${statusLabel}`,
    orderStatusUpdate({ name: null, orderId: order.id, statusLabel }),
  ).catch((err) => console.error("[notify:order_status]", err.message));

  return serializeOrder(order);
}

export async function recordPayment(id, body) {
  const amount = Number(body.amount);
  if (!amount || amount <= 0) throw new HttpError(400, "A positive amount is required.");
  if (!PAYMENT_METHODS.includes(body.method)) {
    throw new HttpError(400, `method must be one of: ${PAYMENT_METHODS.join(", ")}.`);
  }

  const order = await prisma.order.findUnique({ where: { id }, include: { payments: true } });
  if (!order) throw new HttpError(404, "Order not found.");

  await prisma.payment.create({
    data: { orderId: id, amount, method: body.method, reference: body.reference || null },
  });

  const paidSoFar = order.payments.reduce((sum, p) => sum + p.amount, 0) + amount;
  const data = {};
  if (paidSoFar >= order.totalAmount && order.status === ORDER_STATUS.PENDING_PAYMENT) {
    data.status = ORDER_STATUS.PAID;
  }

  if (Object.keys(data).length > 0) {
    await prisma.order.update({ where: { id }, data });
  }

  const existingReceipt = await prisma.receipt.findUnique({ where: { orderId: id } });
  if (!existingReceipt && (data.status === ORDER_STATUS.PAID || order.status === ORDER_STATUS.PAID)) {
    const receipt = await prisma.receipt.create({ data: { orderId: id, receiptNumber: await nextReceiptNumber() } });
    const user = await prisma.user.findUnique({ where: { id: order.userId } });

    await createNotification(order.userId, {
      type: "order_paid",
      title: `Receipt ${receipt.receiptNumber} issued`,
      body: `Your order total of ${order.totalAmount.toLocaleString("fr-CM")} XAF is confirmed.`,
      link: `/receipts/${order.id}`,
    });

    if (user?.email) await sendReceiptEmail(user, order, receipt);

    // Admin alert
    sendEmail(
      env.adminEmail,
      `Receipt ${receipt.receiptNumber} issued — ${order.totalAmount.toLocaleString("fr-CM")} XAF`,
      adminNewOrder({ userName: user ? `${user.name || ""} ${user.surname || ""}`.trim() : "Unknown", userEmail: user?.email || "", orderId: order.id, items: (await prisma.orderItem.findMany({ where: { orderId: order.id }, include: { product: true } })).map((i) => ({ name: i.product?.name || i.productId, quantity: i.quantity, unitPrice: i.unitPrice })), total: order.totalAmount }),
    ).catch((err) => console.error("[admin-notify:receipt_issued]", err.message));
  }

  const updated = await prisma.order.findUnique({ where: { id }, include: ORDER_INCLUDE });
  return serializeOrder(updated);
}

async function sendReceiptEmail(user, order, receipt) {
  const items = await prisma.orderItem.findMany({ where: { orderId: order.id }, include: { product: true } });
  const itemsForEmail = items.map((i) => ({ name: i.product?.name || i.productId, quantity: i.quantity, unitPrice: i.unitPrice }));

  const BRAND_NAVY = "#0f172a";
  const BRAND_BLUE = "#2563eb";
  const BRAND_LIGHT = "#f8fafc";
  const BRAND_BORDER = "#e2e8f0";
  const TEXT_MAIN = "#1e293b";
  const TEXT_MUTED = "#64748b";
  const format = (amount) => `${amount.toLocaleString("fr-CM")} XAF`;

  const itemRows = itemsForEmail
    .map((i) => `<tr><td style="padding:8px 0;font-size:13px;color:${TEXT_MUTED};">${escapeHtml(i.name)} × ${i.quantity}</td><td style="padding:8px 0;font-size:13px;color:${TEXT_MAIN};font-weight:600;text-align:right;">${format(i.unitPrice * i.quantity)}</td></tr>`)
    .join("");

  const html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/><title>Receipt</title></head>
<body style="margin:0;padding:0;background:${BRAND_LIGHT};font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND_LIGHT};padding:32px 16px;"><tr><td align="center">
<table width="100%" style="max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid ${BRAND_BORDER};">
<tr><td style="background:${BRAND_NAVY};padding:28px 36px;">
<span style="font-size:22px;font-weight:700;color:#fff;letter-spacing:0.5px;">NKEM AERONAUTICS</span>
<div style="height:3px;background:${BRAND_BLUE};border-radius:2px;margin-top:16px;"></div>
</td></tr>
<tr><td style="padding:36px;">
<span style="display:inline-block;background:#16a34a;color:#fff;font-size:11px;font-weight:600;padding:3px 10px;border-radius:20px;text-transform:uppercase;">Receipt Confirmed</span>
<h1 style="margin:16px 0 4px;font-size:22px;font-weight:700;color:${TEXT_MAIN};">Payment Received</h1>
<p style="margin:0 0 20px;font-size:15px;color:${TEXT_MUTED};">Hi ${escapeHtml(user.name || "there")}, your payment has been confirmed.</p>
<table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid ${BRAND_BORDER};margin-top:20px;">
<tr><td style="padding:8px 0;font-size:13px;color:${TEXT_MUTED};width:40%;">Receipt Number</td><td style="padding:8px 0;font-size:13px;color:${TEXT_MAIN};font-weight:600;">${receipt.receiptNumber}</td></tr>
${itemRows}
<tr><td style="padding:8px 0;font-size:13px;color:${TEXT_MUTED};">Total</td><td style="padding:8px 0;font-size:15px;color:${BRAND_BLUE};font-weight:700;">${format(order.totalAmount)}</td></tr>
</table>
<div style="background:#eff6ff;border-left:4px solid ${BRAND_BLUE};border-radius:6px;padding:14px 18px;margin:20px 0;font-size:14px;color:${TEXT_MAIN};">Thank you for your purchase. A copy of your receipt is available in your logbook.</div>
<a href="${env.clientOrigin}/receipts/${order.id}" style="display:inline-block;background:${BRAND_BLUE};color:#fff;font-size:14px;font-weight:600;padding:12px 28px;border-radius:8px;text-decoration:none;margin-top:4px;">View &amp; Print Receipt</a>
</td></tr>
<tr><td style="background:${BRAND_LIGHT};border-top:1px solid ${BRAND_BORDER};padding:20px 36px;font-size:12px;color:${TEXT_MUTED};">
<strong style="color:${TEXT_MAIN};">Nkem Aeronautics Ltd</strong><br/>Junction of Cairo Road and Independence Avenue, Lusaka 10101, Zambia<br/>
<a href="mailto:nkem@nkemaeronautics.com" style="color:${BRAND_BLUE};text-decoration:none;">nkem@nkemaeronautics.com</a>
</td></tr>
</table></td></tr></table></body></html>`;

  await sendEmail(user.email, `Receipt ${receipt.receiptNumber} — Nkem Aeronautics`, html);
}

export async function getReceipt(orderId, user) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { ...ORDER_INCLUDE, user: { select: { id: true, name: true, surname: true, email: true, telephone: true } } },
  });
  if (!order) throw new HttpError(404, "Order not found.");
  if (order.userId !== user.id && user.role !== "admin") {
    throw new HttpError(403, "You do not have permission to view this receipt.");
  }
  if (!order.receipt) throw new HttpError(404, "No receipt has been issued for this order yet.");

  return serializeOrder(order);
}
