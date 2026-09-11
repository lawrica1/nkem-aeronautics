import { prisma } from "../../config/prisma.js";
import { HttpError } from "../../shared/errors/HttpError.js";

// Mirrors the client's catalogue tabs (client/src/lib/catalog.js CATALOG_SECTORS), plus
// "general" for customer-service messages submitted from the Contact page (no catalogue tab).
const QUOTE_SECTORS = ["agricultural", "wildlife", "realestate", "evtol", "general"];

export async function create(body) {
  if (!body.sector || !QUOTE_SECTORS.includes(body.sector)) {
    throw new HttpError(400, "A valid sector is required.");
  }
  if (!body.email) throw new HttpError(400, "email is required.");
  if (!body.message) throw new HttpError(400, "message is required.");

  return prisma.quoteRequest.create({
    data: {
      sector: body.sector,
      name: body.name || null,
      email: body.email,
      whatsapp: body.whatsapp || null,
      company: body.company || null,
      targetCountry: body.targetCountry,
      interestedProduct: body.interestedProduct || null,
      interestedIn: body.interestedIn || null,
      message: body.message,
    },
  });
}

export async function listAdmin() {
  return prisma.quoteRequest.findMany({ orderBy: { createdAt: "desc" } });
}

export async function update(id, body) {
  const data = {};
  for (const key of ["status", "adminNotes"]) {
    if (body[key] !== undefined) data[key] = body[key];
  }

  const quote = await prisma.quoteRequest.update({ where: { id }, data }).catch(() => null);
  if (!quote) throw new HttpError(404, "Quote request not found.");
  return quote;
}
