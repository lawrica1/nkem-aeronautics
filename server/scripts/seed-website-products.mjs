// Loads the website catalogue into the database (insert or update by slug). Safe to re-run:
// it never deletes products, and products added in the admin are left untouched.
//   cd server && node scripts/seed-website-products.mjs
import { prisma, disconnectDb } from "../src/config/prisma.js";
import { WEBSITE_PRODUCT_ROWS } from "./website-products.mjs";

for (const row of WEBSITE_PRODUCT_ROWS) {
  const { slug, ...data } = row;
  await prisma.product.upsert({ where: { slug }, create: row, update: data });
  console.log(`✓ ${row.name}`);
}
console.log(`${WEBSITE_PRODUCT_ROWS.length} website products loaded.`);
await disconnectDb();
