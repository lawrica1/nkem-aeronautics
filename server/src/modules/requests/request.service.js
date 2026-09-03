import { prisma } from "../../config/prisma.js";
import { HttpError } from "../../shared/errors/HttpError.js";
import { REQUEST_STATUS, REQUEST_STATUS_VALUES } from "./request.constants.js";
import { serializeRequest } from "./request.serializer.js";

export async function listForUser(user) {
  const requests = await prisma.serviceRequest.findMany({
    where: { userId: user.id },
    include: { files: { orderBy: { createdAt: "asc" } } },
    orderBy: { createdAt: "desc" },
  });
  return requests.map(serializeRequest);
}

export async function createForUser(user, body) {
  if (!body.service) throw new HttpError(400, "service is required.");

  const request = await prisma.serviceRequest.create({
    data: {
      userId: user.id,
      service: body.service,
      description: body.description || "",
      location: body.location || user.address || "",
      region: body.region || user.region || "",
      firm: user.firm,
      status: REQUEST_STATUS.SUBMITTED,
    },
  });

  if (Array.isArray(body.fileAssetIds) && body.fileAssetIds.length > 0) {
    await prisma.fileAsset.updateMany({
      where: { id: { in: body.fileAssetIds }, ownerId: user.id },
      data: { serviceRequestId: request.id },
    });
  }

  return serializeRequest(request);
}

export async function listForAdmin({ status, firm } = {}) {
  const requests = await prisma.serviceRequest.findMany({
    where: {
      ...(status && { status }),
      ...(firm && { firm }),
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          surname: true,
          email: true,
          telephone: true,
          identificationNumber: true,
          sector: true,
          crop: true,
          firm: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return requests.map((request) => ({ ...serializeRequest(request), user: request.user }));
}

export async function updateStatus(id, body) {
  if (!REQUEST_STATUS_VALUES.includes(body.status)) {
    throw new HttpError(400, "A valid request status is required.");
  }

  const request = await prisma.serviceRequest
    .update({
      where: { id },
      data: { status: body.status, adminNotes: body.adminNotes || "" },
    })
    .catch(() => null);

  if (!request) throw new HttpError(404, "Service request not found.");
  return serializeRequest(request);
}
