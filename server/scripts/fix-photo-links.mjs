// One-off repair: product, drone and news photos saved before Nov 2026 stored a signed storage link
// that expired after 15 minutes. Rewrites them to the permanent /api/storage/public/<key> address.
// Dry run by default; pass --apply to save.
//   node --env-file=.env scripts/fix-photo-links.mjs https://api.nkemaeronautics.com [--apply]
import { prisma, disconnectDb } from "../src/config/prisma.js";
import { isPublicKey, publicUrlForKey, storageKeyFromUrl } from "../src/modules/storage/storage.service.js";

const [, , apiOrigin, flag] = process.argv;
if (!/^https?:\/\/[^/]+$/.test(apiOrigin ?? "")) {
  console.error("Usage: node --env-file=.env scripts/fix-photo-links.mjs https://api.example.com [--apply]");
  process.exit(1);
}
const apply = flag === "--apply";

const fix = (url) => {
  const key = url && storageKeyFromUrl(url);
  return key && isPublicKey(key) ? publicUrlForKey(apiOrigin, key) : url;
};

let changed = 0;
const tables = [
  ["product", "images"],
  ["drone", "images"],
  ["newsPost", "imageUrl"],
];
for (const [model, field] of tables) {
  for (const row of await prisma[model].findMany({ select: { id: true, [field]: true } })) {
    const before = row[field];
    const after = Array.isArray(before) ? before.map(fix) : fix(before);
    if (JSON.stringify(after) === JSON.stringify(before)) continue;
    changed++;
    console.log(`${model} ${row.id}: ${Array.isArray(before) ? before.length : 1} link(s) fixed`);
    if (apply) await prisma[model].update({ where: { id: row.id }, data: { [field]: after } });
  }
}
console.log(`${changed} row(s) ${apply ? "updated" : "would be updated (dry run; pass --apply to save)"}.`);
await disconnectDb();
