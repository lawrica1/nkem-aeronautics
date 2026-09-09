import { prisma } from "../../config/prisma.js";
import { HttpError } from "../../shared/errors/HttpError.js";

export async function listPublished() {
  return prisma.newsPost.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: "desc" },
    take: 50,
  });
}

export async function listAdmin() {
  return prisma.newsPost.findMany({ orderBy: { publishedAt: "desc" } });
}

export async function create(body) {
  if (!body.title) throw new HttpError(400, "title is required.");
  if (!body.body) throw new HttpError(400, "body is required.");

  return prisma.newsPost.create({
    data: {
      title: body.title,
      category: body.category === "industry" ? "industry" : "company",
      summary: body.summary || "",
      body: body.body,
      imageUrl: body.imageUrl || null,
      isPublished: body.isPublished !== false,
      publishedAt: body.publishedAt ? new Date(body.publishedAt) : new Date(),
    },
  });
}

export async function update(id, body) {
  const data = {};
  for (const key of ["title", "category", "summary", "body", "imageUrl", "isPublished"]) {
    if (body[key] !== undefined) data[key] = body[key];
  }
  if (body.publishedAt !== undefined) data.publishedAt = new Date(body.publishedAt);

  const post = await prisma.newsPost.update({ where: { id }, data }).catch(() => null);
  if (!post) throw new HttpError(404, "News post not found.");
  return post;
}
