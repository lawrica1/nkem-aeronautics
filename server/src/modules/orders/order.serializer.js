import { ORDER_STATUS_LABELS } from "./order.constants.js";

export function serializeOrder(order) {
  return {
    id: order.id,
    status: order.status,
    statusLabel: ORDER_STATUS_LABELS[order.status] || order.status,
    channel: order.channel,
    totalAmount: order.totalAmount,
    notes: order.notes,
    items: order.items?.map((item) => ({
      id: item.id,
      productId: item.productId,
      productName: item.product?.name ?? "Unknown product",
      quantity: item.quantity,
      unitPrice: item.unitPrice,
    })) ?? [],
    payments: order.payments?.map((p) => ({
      id: p.id,
      amount: p.amount,
      method: p.method,
      reference: p.reference,
      createdAt: p.createdAt?.toISOString(),
    })) ?? [],
    receipt: order.receipt
      ? { id: order.receipt.id, receiptNumber: order.receipt.receiptNumber, issuedAt: order.receipt.issuedAt?.toISOString() }
      : null,
    user: order.user
      ? { id: order.user.id, name: order.user.name, surname: order.user.surname, email: order.user.email }
      : undefined,
    createdAt: order.createdAt?.toISOString(),
    updatedAt: order.updatedAt?.toISOString(),
  };
}
