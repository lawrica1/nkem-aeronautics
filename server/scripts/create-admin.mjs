import bcrypt from "bcryptjs";
import { prisma, disconnectDb } from "../src/config/prisma.js";
import { ROLES, SECTORS } from "../src/modules/platform/platform.constants.js";

const [, , email, nameArgument] = process.argv;
const password = process.env.ADMIN_PASSWORD;
const name = process.env.ADMIN_NAME || nameArgument || "Nkem Administrator";

if (!email || !password) {
  console.error('Usage: ADMIN_PASSWORD="..." npm run create-admin -- <email> ["name"]');
  process.exit(1);
}

if (password.length < 8) {
  console.error("ADMIN_PASSWORD must be at least 8 characters.");
  process.exit(1);
}

const passwordHash = await bcrypt.hash(password, 10);
const admin = await prisma.user.upsert({
  where: { email: email.toLowerCase() },
  create: {
    role: ROLES.ADMIN,
    sector: SECTORS.AGRICULTURE,
    accountType: "individual",
    country: "CM",
    surname: "Admin",
    name,
    telephone: "000000000",
    email: email.toLowerCase(),
    address: "Nkem Aeronautics",
    passwordHash,
    isVerified: true,
  },
  update: {
    role: ROLES.ADMIN,
    passwordHash,
    name,
    isVerified: true,
  },
});

console.log(`Admin ready: ${admin.email}`);
await disconnectDb();
