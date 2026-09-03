import jwt from "jsonwebtoken";
import { env, requireEnv } from "../../config/env.js";
import { prisma } from "../../config/prisma.js";
import { HttpError } from "../errors/HttpError.js";

export function signUserToken(user) {
  return jwt.sign(
    { sub: user.id, role: user.role, sector: user.sector },
    requireEnv("JWT_SECRET", env.jwtSecret),
    { expiresIn: "30d" },
  );
}

export function signAdminToken(admin) {
  return jwt.sign(
    { sub: admin.id, role: "admin", aud: "admin" },
    requireEnv("JWT_SECRET", env.jwtSecret),
    { expiresIn: "12h" },
  );
}

export function verifyToken(token) {
  return jwt.verify(token, requireEnv("JWT_SECRET", env.jwtSecret));
}

export async function requireUser(req, _res, next) {
  try {
    const authHeader = req.get("authorization") || "";
    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
      throw new HttpError(401, "Missing or invalid Authorization header.");
    }

    const payload = verifyToken(token);
    const user = await prisma.user.findUnique({ where: { id: payload.sub } });

    if (!user || !user.isVerified) {
      throw new HttpError(401, "Account not found or not verified.");
    }

    req.user = user;
    return next();
  } catch (error) {
    return next(error instanceof HttpError ? error : new HttpError(401, "Invalid or expired token."));
  }
}

export function requireRole(...roles) {
  return (req, _res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new HttpError(403, "You do not have permission to access this resource."));
    }
    return next();
  };
}
