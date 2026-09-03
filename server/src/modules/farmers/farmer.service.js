import { serializeUser } from "../users/user.serializer.js";
import { listForUser } from "../requests/request.service.js";

export function getProfile(user) {
  return serializeUser(user);
}

export async function getLogbook(user) {
  return {
    farmer: serializeUser(user),
    requests: await listForUser(user),
    operations: [],
    reviews: [],
  };
}
