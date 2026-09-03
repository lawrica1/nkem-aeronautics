import * as requestService from "./request.service.js";

export async function listMine(req, res) {
  res.json(await requestService.listForUser(req.user));
}

export async function createMine(req, res) {
  res.status(201).json(await requestService.createForUser(req.user, req.body));
}

export async function listAdmin(req, res) {
  res.json(await requestService.listForAdmin(req.query));
}

export async function updateAdminStatus(req, res) {
  res.json(await requestService.updateStatus(req.params.id, req.body));
}
