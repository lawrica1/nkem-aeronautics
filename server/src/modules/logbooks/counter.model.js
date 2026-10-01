import { prisma } from "../../config/prisma.js";

// Country codes use ISO 3166-1 alpha-2. The counter is shared across all countries;
// the prefix just makes IDs human-readable per region.
export async function nextLogbookId(country = "ZM") {
  const counter = await prisma.counter.upsert({
    where: { key: "logbookId" },
    update: { seq: { increment: 1 } },
    create: { key: "logbookId", seq: 1 },
  });

  const code = (country || "ZM").toUpperCase().slice(0, 2);
  return `NKEM-${code}-${String(counter.seq).padStart(6, "0")}`;
}

export async function nextReceiptNumber() {
  const counter = await prisma.counter.upsert({
    where: { key: "receiptNumber" },
    update: { seq: { increment: 1 } },
    create: { key: "receiptNumber", seq: 1 },
  });

  return `RCT-${new Date().getFullYear()}-${String(counter.seq).padStart(6, "0")}`;
}
