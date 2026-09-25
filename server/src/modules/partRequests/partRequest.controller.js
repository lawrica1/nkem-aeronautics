import * as partRequestService from "./partRequest.service.js";

export async function createMine(req, res) {
  res.status(201).json(await partRequestService.createForUser(req.user, req.body));
}

export async function listMine(req, res) {
  res.json(await partRequestService.listForUser(req.user));
}

export async function listAdmin(req, res) {
  res.json(await partRequestService.listForAdmin(req.query));
}

export async function update(req, res) {
  res.json(await partRequestService.update(req.params.id, req.body));
}
