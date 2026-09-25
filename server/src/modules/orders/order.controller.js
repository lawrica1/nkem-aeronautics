import * as orderService from "./order.service.js";

export async function createMine(req, res) {
  res.status(201).json(await orderService.createForUser(req.user, req.body));
}

export async function listMine(req, res) {
  res.json(await orderService.listForUser(req.user));
}

export async function createAdmin(req, res) {
  res.status(201).json(await orderService.createForAdmin(req.body));
}

export async function listAdmin(req, res) {
  res.json(await orderService.listForAdmin(req.query));
}

export async function updateStatus(req, res) {
  res.json(await orderService.updateStatus(req.params.id, req.body));
}

export async function recordPayment(req, res) {
  res.status(201).json(await orderService.recordPayment(req.params.id, req.body));
}

export async function getReceipt(req, res) {
  res.json(await orderService.getReceipt(req.params.id, req.user));
}
