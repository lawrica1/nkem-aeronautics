import * as telemetryService from "./telemetry.service.js";

export async function ingest(req, res) {
  res.status(201).json(await telemetryService.ingest(req.body));
}

export async function listForDrone(req, res) {
  res.json(await telemetryService.listForDrone(req.params.droneId));
}

export async function listForOperation(req, res) {
  res.json(await telemetryService.listForOperation(req.params.operationId, req.user));
}
