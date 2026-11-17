import * as idCardService from "./idCard.service.js";

export async function list(_req, res) {
  res.json(await idCardService.list());
}

export async function create(req, res) {
  res.status(201).json(await idCardService.create(req.body));
}

export async function update(req, res) {
  res.json(await idCardService.update(req.params.id, req.body));
}

export async function remove(req, res) {
  await idCardService.remove(req.params.id);
  res.status(204).end();
}
