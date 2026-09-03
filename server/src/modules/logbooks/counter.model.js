import { prisma } from "../../config/prisma.js";

export async function nextLogbookId() {
  const counter = await prisma.counter.upsert({
    where: { key: "logbookId" },
    update: { seq: { increment: 1 } },
    create: { key: "logbookId", seq: 1 },
  });

  return `NKEM-${new Date().getFullYear()}-${String(counter.seq).padStart(6, "0")}`;
}
