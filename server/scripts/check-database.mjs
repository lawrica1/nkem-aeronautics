import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const variable = process.argv[2] || "DATABASE_URL";
const connectionString = process.env[variable];

if (!connectionString) {
  console.error(`${variable} is not set.`);
  process.exit(1);
}

const previousUrl = process.env.DATABASE_URL;
process.env.DATABASE_URL = connectionString;

const prisma = new PrismaClient();

try {
  const [database] = await prisma.$queryRaw`
    SELECT
      current_database() AS database,
      current_setting('server_version') AS version
  `;
  const [tables] = await prisma.$queryRaw`
    SELECT COUNT(*)::int AS count
    FROM information_schema.tables
    WHERE table_schema = 'public'
  `;
  const [products, users, admins] = await Promise.all([
    prisma.product.count(),
    prisma.user.count(),
    prisma.user.count({ where: { role: "admin" } }),
  ]);

  console.log(
    JSON.stringify({
      connection: variable,
      database: database.database,
      version: database.version,
      publicTables: tables.count,
      products,
      users,
      admins,
    }),
  );
} finally {
  await prisma.$disconnect();
  process.env.DATABASE_URL = previousUrl;
}
