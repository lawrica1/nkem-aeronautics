import * as newsService from "./news.service.js";

export async function list(_req, res) {
  res.json(await newsService.listPublished());
}

export async function listAdmin(_req, res) {
  res.json(await newsService.listAdmin());
}

export async function create(req, res) {
  res.status(201).json(await newsService.create(req.body));
}

export async function update(req, res) {
  res.json(await newsService.update(req.params.id, req.body));
}

export async function remove(req, res) {
  await newsService.remove(req.params.id);
  res.status(204).end();
}
