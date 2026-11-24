import { Prisma } from "@prisma/client";
import { prisma } from "../../config/prisma.js";
import { HttpError } from "../../shared/errors/HttpError.js";
import { nextReferralCode } from "../logbooks/counter.model.js";

const STATUSES = ["active", "paused"];
const OPTIONAL_TEXT = ["company", "phone", "notes"];

function toName(value) {
  const name = String(value ?? "").trim();
  if (!name) throw new HttpError(400, "name is required.");
  return name;
}

function toEmail(value) {
  const email = String(value ?? "").trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new HttpError(400, "email must be a valid email address.");
  return email;
}

// The admin form only offers the shared signup country list; the server just insists on an ISO alpha-2 code.
function toCountry(value) {
  const country = String(value ?? "").trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(country)) throw new HttpError(400, "country must be a 2-letter country code.");
  return country;
}

function toRate(value) {
  const rate = Number(value ?? 0);
  if (!Number.isFinite(rate) || rate < 0 || rate > 100) throw new HttpError(400, "commissionRate must be between 0 and 100.");
  return Math.round(rate * 100) / 100;
}

// Turns Prisma's "not found" / "duplicate email" errors into HTTP errors.
function mapErrors(err) {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2025") throw new HttpError(404, "Affiliate not found.");
    if (err.code === "P2002") throw new HttpError(409, "An affiliate with this email already exists.");
  }
  throw err;
}

export async function list() {
  return prisma.affiliate.findMany({ orderBy: { createdAt: "desc" } });
}

export async function create(body) {
  const country = toCountry(body.country);
  const data = {
    name: toName(body.name),
    email: toEmail(body.email),
    country,
    commissionRate: toRate(body.commissionRate),
    ...Object.fromEntries(OPTIONAL_TEXT.map((key) => [key, String(body[key] ?? "").trim()])),
  };
  return prisma.affiliate
    .create({ data: { ...data, referralCode: await nextReferralCode(country) } })
    .catch(mapErrors);
}

// referralCode is already in affiliates' hands, so it stays fixed even if their country changes.
export async function update(id, body) {
  const data = {};
  if (body.name !== undefined) data.name = toName(body.name);
  if (body.email !== undefined) data.email = toEmail(body.email);
  if (body.country !== undefined) data.country = toCountry(body.country);
  if (body.commissionRate !== undefined) data.commissionRate = toRate(body.commissionRate);
  for (const key of OPTIONAL_TEXT) if (body[key] !== undefined) data[key] = String(body[key]).trim();
  if (body.status !== undefined) {
    if (!STATUSES.includes(body.status)) throw new HttpError(400, "status must be active or paused.");
    data.status = body.status;
  }
  return prisma.affiliate.update({ where: { id }, data }).catch(mapErrors);
}

export async function remove(id) {
  await prisma.affiliate.delete({ where: { id } }).catch(mapErrors);
}
