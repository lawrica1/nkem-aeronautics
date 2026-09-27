import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const UPDATES = [
  {
    nameContains: "ZAM-26A",
    images: [
      "/images/drones/zam-26a-2.png",
      "/images/drones/zam-26a-3.png",
      "/images/drones/zam-26a-4.png",
    ],
    removeHybrid: true,
  },
  {
    nameContains: "Large Fixed-Wing UAV",
    images: [
      "/images/drones/large-fixed-wing-2.webp",
      "/images/drones/large-fixed-wing-3.webp",
      "/images/drones/large-fixed-wing-4.webp",
      "/images/drones/large-fixed-wing-5.webp",
      "/images/drones/large-fixed-wing-6.webp",
      "/images/drones/large-fixed-wing-7.webp",
    ],
    removeHybrid: true,
  },
  {
    nameContains: "AW50G",
    images: ["/images/drones/aw50g-1.png"],
  },
  {
    nameContains: "AWV2548",
    images: ["/images/drones/awv2548-1.webp"],
  },
];

async function main() {
  for (const upd of UPDATES) {
    const product = await prisma.product.findFirst({
      where: { name: { contains: upd.nameContains, mode: "insensitive" } },
    });

    if (!product) {
      console.log(`⚠  Not found: "${upd.nameContains}" — skipping`);
      continue;
    }

    const data = { images: upd.images };

    // Remove any spec row where the key OR value mentions "hybrid" (case-insensitive)
    if (upd.removeHybrid && Array.isArray(product.specs)) {
      data.specs = product.specs.filter(
        ([key, val]) =>
          !String(key).toLowerCase().includes("hybrid") &&
          !String(val).toLowerCase().includes("hybrid")
      );
    }

    await prisma.product.update({ where: { id: product.id }, data });
    console.log(`✓  Updated "${product.name}" (${upd.images.length} image(s))`);
  }

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
