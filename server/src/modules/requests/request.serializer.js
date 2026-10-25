import { REQUEST_STATUS_LABELS } from "./request.constants.js";
import { serializeOperation } from "../operations/operation.serializer.js";
import { serializeFileAssets } from "../storage/storage.service.js";

export async function serializeRequest(request) {
  return {
    id: request.id,
    service: request.service,
    description: request.description,
    location: request.location,
    region: request.region,
    firm: request.firm,
    status: request.status,
    statusLabel: REQUEST_STATUS_LABELS[request.status] || request.status,
    adminNotes: request.adminNotes,
    files: await serializeFileAssets(request.files),
    operation: request.operation ? await serializeOperation(request.operation) : null,
    createdAt: request.createdAt?.toISOString(),
    updatedAt: request.updatedAt?.toISOString(),
  };
}
