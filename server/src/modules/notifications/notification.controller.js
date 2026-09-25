import * as notificationService from "./notification.service.js";

export async function listMine(req, res) {
  res.json(await notificationService.listForUser(req.user));
}

export async function markRead(req, res) {
  await notificationService.markRead(req.params.id, req.user);
  res.json({ message: "Marked as read." });
}

export async function markAllRead(req, res) {
  await notificationService.markAllRead(req.user);
  res.json({ message: "All notifications marked as read." });
}
