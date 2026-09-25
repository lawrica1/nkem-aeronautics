import { prisma } from "../../config/prisma.js";
import { HttpError } from "../../shared/errors/HttpError.js";

export async function list() {
  return prisma.organization.findMany({ orderBy: { name: "asc" } });
}

export async function create(body) {
  if (!body.name) throw new HttpError(400, "name is required.");

  return prisma.organization.create({
    data: {
      name: body.name,
      type: body.type || "private",
      sector: body.sector || null,
      contactName: body.contactName || null,
      contactPhone: body.contactPhone || null,
    },
  });
}

export async function update(id, body) {
  const data = {};
  for (const key of ["name", "type", "sector", "contactName", "contactPhone", "active"]) {
    if (body[key] !== undefined) data[key] = body[key];
  }

  const organization = await prisma.organization.update({ where: { id }, data }).catch(() => null);
  if (!organization) throw new HttpError(404, "Organization not found.");
  return organization;
}
