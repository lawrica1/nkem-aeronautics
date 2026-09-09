import * as quoteService from "./quote.service.js";

export async function create(req, res) {
  res.status(201).json(await quoteService.create(req.body));
}

export async function listAdmin(_req, res) {
  res.json(await quoteService.listAdmin());
}

export async function update(req, res) {
  res.json(await quoteService.update(req.params.id, req.body));
}
