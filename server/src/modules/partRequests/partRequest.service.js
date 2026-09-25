import { Prisma } from "@prisma/client";
import { prisma } from "../../config/prisma.js";
import { HttpError } from "../../shared/errors/HttpError.js";
import { PART_REQUEST_STATUS_VALUES } from "./partRequest.constants.js";
import { serializePartRequest } from "./partRequest.serializer.js";

const INCLUDE = { files: { orderBy: { createdAt: "asc" } } };

export async function createForUser(user, body) {
  if (!body.description) throw new HttpError(400, "description is required.");

  const request = await prisma.partRequest.create({
    data: { userId: user.id, description: body.description },
  });

  if (Array.isArray(body.fileAssetIds) && body.fileAssetIds.length > 0) {
    await prisma.fileAsset.updateMany({
      where: { id: { in: body.fileAssetIds }, ownerId: user.id },
      data: { partRequestId: request.id },
    });
  }

  const withFiles = await prisma.partRequest.findUnique({ where: { id: request.id }, include: INCLUDE });
  return serializePartRequest(withFiles);
}

export async function listForUser(user) {
  const requests = await prisma.partRequest.findMany({
    where: { userId: user.id },
    include: INCLUDE,
    orderBy: { createdAt: "desc" },
  });
  return requests.map(serializePartRequest);
}

export async function listForAdmin({ status } = {}) {
  const requests = await prisma.partRequest.findMany({
    where: { ...(status && { status }) },
    include: { ...INCLUDE, user: { select: { id: true, name: true, surname: true, email: true } } },
    orderBy: { createdAt: "desc" },
    take: 200,
  });
  return requests.map(serializePartRequest);
}

export async function update(id, body) {
  if (body.status !== undefined && !PART_REQUEST_STATUS_VALUES.includes(body.status)) {
    throw new HttpError(400, "A valid status is required.");
  }

  const data = {};
  if (body.status !== undefined) data.status = body.status;
  if (body.adminNotes !== undefined) data.adminNotes = body.adminNotes;

  const request = await prisma.partRequest.update({ where: { id }, data, include: INCLUDE }).catch((err) => {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") return null;
    throw err;
  });
  if (!request) throw new HttpError(404, "Part request not found.");
  return serializePartRequest(request);
}
