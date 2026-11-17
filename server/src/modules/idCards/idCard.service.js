import { Prisma } from "@prisma/client";
import { prisma } from "../../config/prisma.js";
import { HttpError } from "../../shared/errors/HttpError.js";
import { nextEmployeeId } from "../logbooks/counter.model.js";

const CARD_TYPES = ["director", "employee"];
const STATUSES = ["active", "lost", "returned"];
const TEXT_FIELDS = ["fullName", "jobTitle", "department", "country"];

function toDate(value, label) {
  const date = new Date(value);
  if (!value || Number.isNaN(date.getTime())) throw new HttpError(400, `${label} must be a valid date.`);
  return date;
}

// Photos come from /storage/uploads; only accept http(s) URLs so nothing like javascript: reaches an <img>.
function toPhotoUrl(value) {
  if (!value) return null;
  if (!/^https?:\/\//i.test(value)) throw new HttpError(400, "photoUrl must be an http(s) URL.");
  return String(value);
}

export async function list() {
  return prisma.idCard.findMany({ orderBy: { createdAt: "desc" } });
}

export async function create(body) {
  for (const key of TEXT_FIELDS) {
    if (!String(body[key] ?? "").trim()) throw new HttpError(400, `${key} is required.`);
  }
  if (!CARD_TYPES.includes(body.cardType)) throw new HttpError(400, "cardType must be director or employee.");
  const issueDate = toDate(body.issueDate, "Issue date");
  const expiryDate = toDate(body.expiryDate, "Expiry date");
  if (expiryDate <= issueDate) throw new HttpError(400, "Expiry date must be after the issue date.");

  return prisma.idCard.create({
    data: {
      employeeId: await nextEmployeeId(body.cardType),
      ...Object.fromEntries(TEXT_FIELDS.map((key) => [key, String(body[key]).trim()])),
      cardType: body.cardType,
      issueDate,
      expiryDate,
      notes: body.notes?.trim() || "",
      photoUrl: toPhotoUrl(body.photoUrl),
    },
  });
}

// employeeId and cardType are printed on the card, so they stay fixed; a wrong type means a new card.
export async function update(id, body) {
  const data = {};
  for (const key of TEXT_FIELDS) {
    if (body[key] === undefined) continue;
    if (!String(body[key]).trim()) throw new HttpError(400, `${key} cannot be empty.`);
    data[key] = String(body[key]).trim();
  }
  if (body.notes !== undefined) data.notes = String(body.notes).trim();
  if (body.photoUrl !== undefined) data.photoUrl = toPhotoUrl(body.photoUrl);
  if (body.status !== undefined) {
    if (!STATUSES.includes(body.status)) throw new HttpError(400, "status must be active, lost or returned.");
    data.status = body.status;
  }
  if (body.issueDate !== undefined) data.issueDate = toDate(body.issueDate, "Issue date");
  if (body.expiryDate !== undefined) data.expiryDate = toDate(body.expiryDate, "Expiry date");

  const card = await prisma.idCard.update({ where: { id }, data }).catch((err) => {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") return null;
    throw err;
  });
  if (!card) throw new HttpError(404, "ID card not found.");
  return card;
}

export async function remove(id) {
  const deleted = await prisma.idCard.delete({ where: { id } }).catch((err) => {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") return null;
    throw err;
  });
  if (!deleted) throw new HttpError(404, "ID card not found.");
}
