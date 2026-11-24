import { prisma } from "../../config/prisma.js";

// Country codes use ISO 3166-1 alpha-2. The counter is shared across all countries;
// the prefix just makes IDs human-readable per region.
export async function nextLogbookId(country) {
  const counter = await prisma.counter.upsert({
    where: { key: "logbookId" },
    update: { seq: { increment: 1 } },
    create: { key: "logbookId", seq: 1 },
  });

  const code = (country || "XX").toUpperCase().slice(0, 2);
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

// Affiliate referral codes, e.g. NKEM-REF-ZM-0001. One counter across countries, so a number is never reused.
export async function nextReferralCode(country) {
  const counter = await prisma.counter.upsert({
    where: { key: "referralCode" },
    update: { seq: { increment: 1 } },
    create: { key: "referralCode", seq: 1 },
  });

  return `NKEM-REF-${country}-${String(counter.seq).padStart(4, "0")}`;
}

// Company + card type + shared sequence, e.g. NKEM-DIR-0001, NKEM-EMP-0002.
// One counter for both types, so a number is never reused across them.
export async function nextEmployeeId(cardType) {
  const counter = await prisma.counter.upsert({
    where: { key: "employeeId" },
    update: { seq: { increment: 1 } },
    create: { key: "employeeId", seq: 1 },
  });

  const role = cardType === "director" ? "DIR" : "EMP";
  return `NKEM-${role}-${String(counter.seq).padStart(4, "0")}`;
}
