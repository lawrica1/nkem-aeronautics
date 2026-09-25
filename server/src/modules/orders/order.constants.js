export const ORDER_STATUS = {
  PENDING_PAYMENT: "pending_payment",
  PAID: "paid",
  PROCESSING: "processing",
  READY: "ready",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
  PAYMENT_FAILED: "payment_failed",
};

export const ORDER_STATUS_VALUES = Object.values(ORDER_STATUS);

export const ORDER_STATUS_LABELS = {
  [ORDER_STATUS.PENDING_PAYMENT]: "Pending Payment",
  [ORDER_STATUS.PAID]: "Paid",
  [ORDER_STATUS.PROCESSING]: "Processing",
  [ORDER_STATUS.READY]: "Ready / Dispatched",
  [ORDER_STATUS.COMPLETED]: "Completed",
  [ORDER_STATUS.CANCELLED]: "Cancelled",
  [ORDER_STATUS.PAYMENT_FAILED]: "Payment Failed",
};

export const PAYMENT_METHODS = ["cash", "mobile_money", "bank_transfer", "card"];
