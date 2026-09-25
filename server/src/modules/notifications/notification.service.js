import { prisma } from "../../config/prisma.js";
import { HttpError } from "../../shared/errors/HttpError.js";
import { sendEmail } from "./email.service.js";

export async function createNotification(userId, { type, title, body = "", link = null }) {
  return prisma.notification.create({ data: { userId, type, title, body, link } });
}

export async function notify(userId, notification, emailSubject, emailHtml) {
  await createNotification(userId, notification);

  if (emailSubject) {
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { email: true } });
    if (user?.email) await sendEmail(user.email, emailSubject, emailHtml);
  }
}

export async function listForUser(user) {
  return prisma.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
}

export async function markRead(id, user) {
  const result = await prisma.notification.updateMany({
    where: { id, userId: user.id },
    data: { isRead: true },
  });
  if (result.count === 0) throw new HttpError(404, "Notification not found.");
}

export async function markAllRead(user) {
  await prisma.notification.updateMany({
    where: { userId: user.id, isRead: false },
    data: { isRead: true },
  });
}
