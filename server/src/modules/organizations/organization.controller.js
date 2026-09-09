import * as organizationService from "./organization.service.js";

export async function list(_req, res) {
  res.json(await organizationService.list());
}

export async function create(req, res) {
  res.status(201).json(await organizationService.create(req.body));
}

export async function update(req, res) {
  res.json(await organizationService.update(req.params.id, req.body));
}
