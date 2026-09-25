import * as pilotService from "./pilot.service.js";

export async function list(_req, res) {
  res.json(await pilotService.list());
}

export async function create(req, res) {
  res.status(201).json(await pilotService.create(req.body));
}

export async function update(req, res) {
  res.json(await pilotService.update(req.params.id, req.body));
}
