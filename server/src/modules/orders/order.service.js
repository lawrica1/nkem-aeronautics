import { prisma } from "../../config/prisma.js";
import { env } from "../../config/env.js";
import { HttpError } from "../../shared/errors/HttpError.js";
import { nextReceiptNumber } from "../logbooks/counter.model.js";
import { sendEmail } from "../notifications/email.service.js";
import { createNotification } from "../notifications/notification.service.js";
import { ORDER_STATUS, ORDER_STATUS_VALUES, PAYMENT_METHODS } from "./order.constants.js";
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
    .catch(() => null);
  if (!order) throw new HttpError(404, "Order not found.");
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
  }

  const updated = await prisma.order.findUnique({ where: { id }, include: ORDER_INCLUDE });
  return serializeOrder(updated);
}

async function sendReceiptEmail(user, order, receipt) {
  const items = await prisma.orderItem.findMany({ where: { orderId: order.id }, include: { product: true } });
  const format = (amount) => `${amount.toLocaleString("fr-CM")} XAF`;
  const rows = items
    .map((item) => `<tr><td>${item.product.name} &times; ${item.quantity}</td><td style="text-align:right">${format(item.unitPrice * item.quantity)}</td></tr>`)
    .join("");

  const html = `
    <p>Hi ${user.name || "there"},</p>
    <p>Thanks for your order. Receipt <strong>${receipt.receiptNumber}</strong> for <strong>${format(order.totalAmount)}</strong> is confirmed.</p>
    <table cellpadding="6" style="border-collapse:collapse;width:100%;max-width:480px">${rows}</table>
    <p><a href="${env.clientOrigin}/receipts/${order.id}">View and print your receipt</a></p>
    <p>— Nkem Aeronautics Ltd</p>
  `;

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
