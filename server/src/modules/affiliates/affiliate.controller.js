import * as affiliateService from "./affiliate.service.js";

export async function list(_req, res) {
  res.json(await affiliateService.list());
}

export async function create(req, res) {
  res.status(201).json(await affiliateService.create(req.body));
}

export async function update(req, res) {
  res.json(await affiliateService.update(req.params.id, req.body));
}

export async function remove(req, res) {
  await affiliateService.remove(req.params.id);
  res.status(204).end();
}
