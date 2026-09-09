export function serializeOperation(operation) {
  if (!operation) return null;

  return {
    id: operation.id,
    serviceRequestId: operation.serviceRequestId,
    scheduledAt: operation.scheduledAt?.toISOString() ?? null,
    chemical: operation.chemical,
    region: operation.region,
    comments: operation.comments,
    results: operation.results,
    pilot: operation.pilot
      ? { id: operation.pilot.id, name: operation.pilot.name, droneTypes: operation.pilot.droneTypes }
      : null,
    drone: operation.drone
      ? { id: operation.drone.id, name: operation.drone.name, model: operation.drone.model }
      : null,
    review: operation.review
      ? { id: operation.review.id, rating: operation.review.rating, comment: operation.review.comment }
      : null,
    files: operation.files?.map((f) => ({ id: f.id, url: f.url, mimeType: f.mimeType, originalName: f.originalName })) ?? [],
    telemetry: operation.telemetry?.map((t) => ({
      id: t.id,
      latitude: t.latitude,
      longitude: t.longitude,
      altitude: t.altitude,
      heading: t.heading,
      speed: t.speed,
      recordedAt: t.recordedAt?.toISOString(),
    })) ?? [],
    createdAt: operation.createdAt?.toISOString(),
    updatedAt: operation.updatedAt?.toISOString(),
  };
}
