import { Prisma } from "@prisma/client";
import { prisma } from "../../config/prisma.js";
import { HttpError } from "../../shared/errors/HttpError.js";

export async function list({ sector, q, application } = {}, { includeInactive = false } = {}) {
  return prisma.product.findMany({
    where: {
      ...(sector && { sector }),
      ...(!includeInactive && { active: true }),
      ...(application && { applications: { has: application } }),
      ...(q && {
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { type: { contains: q, mode: "insensitive" } },
          { model: { contains: q, mode: "insensitive" } },
        ],
      }),
    },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });
}

export async function getBySlug(slug) {
  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product || !product.active) throw new HttpError(404, "Product not found.");
  return product;
}

const EXTRA_FIELDS = [
  "slug",
  "description",
  "specs",
  "images",
  "featureBadges",
  "applications",
  "highlight",
  "tags",
  "crops",
  "service",
  "family",
  "sortOrder",
  "tagline",
  "keyFigures",
  "compare",
  "thirdParty",
];

export const slugify = (text) =>
  String(text)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "product";

// Products get a page address from their name (e.g. "NKM-AGR-600" → nkm-agr-600), made unique.
async function uniqueSlug(name) {
  const base = slugify(name);
  for (let n = 1; ; n += 1) {
    const slug = n === 1 ? base : `${base}-${n}`;
    if (!(await prisma.product.findUnique({ where: { slug }, select: { id: true } }))) return slug;
  }
}

export async function create(body) {
  if (!body.name) throw new HttpError(400, "name is required.");
  if (!body.sector) throw new HttpError(400, "sector is required.");

  const data = {
    sector: body.sector,
    name: body.name,
    type: body.type || null,
    model: body.model || null,
    price: body.price !== undefined && body.price !== "" ? Number(body.price) : null,
    availability: body.availability || "",
  };
  for (const key of EXTRA_FIELDS) {
    if (body[key] !== undefined) data[key] = body[key];
  }
  if (data.sortOrder !== undefined) data.sortOrder = Number(data.sortOrder) || 0;
  if (data.family === "") data.family = null;
  data.slug = data.slug ? slugify(data.slug) : await uniqueSlug(data.name);

  return prisma.product.create({ data });
}

export async function update(id, body) {
  const data = {};
  for (const key of ["sector", "name", "type", "model", "availability", "active", ...EXTRA_FIELDS]) {
    if (body[key] !== undefined) data[key] = body[key];
  }
  if (data.sortOrder !== undefined) data.sortOrder = Number(data.sortOrder) || 0;
  if (data.family === "") data.family = null;
  if (body.price !== undefined) {
    data.price = body.price === "" || body.price === null ? null : Number(body.price);
  }

  const product = await prisma.product.update({ where: { id }, data }).catch((err) => {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") return null;
    throw err;
  });
  if (!product) throw new HttpError(404, "Product not found.");
  return product;
}
