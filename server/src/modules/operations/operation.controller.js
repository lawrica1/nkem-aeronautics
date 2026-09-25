import * as operationService from "./operation.service.js";

export async function assign(req, res) {
  res.status(201).json(await operationService.assign(req.body));
}

export async function update(req, res) {
  res.json(await operationService.update(req.params.id, req.body));
}

export async function attachMedia(req, res) {
  res.json(await operationService.attachMedia(req.params.id, req.user, req.body));
}

export async function addReview(req, res) {
  res.status(201).json(await operationService.addReview(req.params.id, req.user, req.body));
}

export async function listMine(req, res) {
  res.json(await operationService.listForPilot(req.user));
}

export async function updateAsPilot(req, res) {
  res.json(await operationService.updateAsPilot(req.params.id, req.user, req.body));
}
