import { prisma } from "../../config/prisma.js";

export async function nextLogbookId() {
  const counter = await prisma.counter.upsert({
    where: { key: "logbookId" },
    update: { seq: { increment: 1 } },
    create: { key: "logbookId", seq: 1 },
  });

  return `NKEM-${new Date().getFullYear()}-${String(counter.seq).padStart(6, "0")}`;
}

export async function nextReceiptNumber() {
  const counter = await prisma.counter.upsert({
    where: { key: "receiptNumber" },
    update: { seq: { increment: 1 } },
    create: { key: "receiptNumber", seq: 1 },
  });

  return `RCT-${new Date().getFullYear()}-${String(counter.seq).padStart(6, "0")}`;
}
