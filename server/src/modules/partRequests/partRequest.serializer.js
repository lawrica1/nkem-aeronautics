import { PART_REQUEST_STATUS_LABELS } from "./partRequest.constants.js";

export function serializePartRequest(request) {
  return {
    id: request.id,
    description: request.description,
    status: request.status,
    statusLabel: PART_REQUEST_STATUS_LABELS[request.status] || request.status,
    adminNotes: request.adminNotes,
    files: request.files?.map((f) => ({ id: f.id, url: f.url, mimeType: f.mimeType, originalName: f.originalName })) ?? [],
    user: request.user
      ? { id: request.user.id, name: request.user.name, surname: request.user.surname, email: request.user.email }
      : undefined,
    createdAt: request.createdAt?.toISOString(),
    updatedAt: request.updatedAt?.toISOString(),
  };
}
