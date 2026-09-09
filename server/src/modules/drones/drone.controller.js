import * as droneService from "./drone.service.js";

export async function list(_req, res) {
  res.json(await droneService.list());
}

export async function create(req, res) {
  res.status(201).json(await droneService.create(req.body));
}

export async function update(req, res) {
  res.json(await droneService.update(req.params.id, req.body));
}
