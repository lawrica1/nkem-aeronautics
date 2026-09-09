import { prisma } from "../../config/prisma.js";
import { HttpError } from "../../shared/errors/HttpError.js";

// Hardware-agnostic ingestion: any future device/gateway integration posts here once a
// communication method is chosen. Until then, this is exercised via the admin "log a
// position" form. Device-level authentication (API key, mTLS, etc.) is intentionally not
// built yet — it depends on what the eventual hardware/gateway can actually support.
export async function ingest(body) {
  const latitude = Number(body.latitude);
  const longitude = Number(body.longitude);
  if (!body.droneId) throw new HttpError(400, "droneId is required.");
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    throw new HttpError(400, "latitude and longitude are required numbers.");
  }

  const drone = await prisma.drone.findUnique({ where: { id: body.droneId } });
  if (!drone) throw new HttpError(404, "Drone not found.");

  if (body.operationId) {
    const operation = await prisma.operation.findUnique({ where: { id: body.operationId } });
    if (!operation) throw new HttpError(404, "Operation not found.");
  }

  return prisma.droneTelemetry.create({
    data: {
      droneId: body.droneId,
      operationId: body.operationId || null,
      latitude,
      longitude,
      altitude: body.altitude !== undefined ? Number(body.altitude) : null,
      heading: body.heading !== undefined ? Number(body.heading) : null,
      speed: body.speed !== undefined ? Number(body.speed) : null,
      recordedAt: body.recordedAt ? new Date(body.recordedAt) : new Date(),
    },
  });
}

export async function listForDrone(droneId) {
  return prisma.droneTelemetry.findMany({
    where: { droneId },
    orderBy: { recordedAt: "desc" },
    take: 200,
  });
}

export async function listForOperation(operationId, user) {
  const operation = await prisma.operation.findUnique({ where: { id: operationId } });
  if (!operation) throw new HttpError(404, "Operation not found.");
  if (operation.userId !== user.id && user.role !== "admin") {
    throw new HttpError(403, "You do not have permission to view this operation's telemetry.");
  }

  return prisma.droneTelemetry.findMany({
    where: { operationId },
    orderBy: { recordedAt: "asc" },
  });
}
