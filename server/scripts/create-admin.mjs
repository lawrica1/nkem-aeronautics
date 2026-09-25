import bcrypt from "bcryptjs";
import { prisma, disconnectDb } from "../src/config/prisma.js";
import { ROLES, SECTORS } from "../src/modules/platform/platform.constants.js";

const [, , email, password, name = "Nkem Administrator"] = process.argv;

if (!email || !password) {
  console.error('Usage: node scripts/create-admin.mjs <email> <password> ["name"]');
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
