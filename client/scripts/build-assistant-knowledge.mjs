// Builds the website assistant's catalog knowledge from the same data the site renders,
// so answers stay in step with the pages. Run from client/:  npm run build:assistant-knowledge
// Output: server/src/modules/assistant/knowledge/catalog.md (commit it with the data change).
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { SERVICES } from "../src/lib/services.js";
import { PRODUCT_FAMILIES, PRODUCT_RANGE } from "../src/lib/productRange.js";
import { FIRM_OPTIONS } from "../src/lib/firms.js";

const out = fileURLToPath(new URL("../../server/src/modules/assistant/knowledge/catalog.md", import.meta.url));

// Pull every human-readable string out of a service-page section, skipping image paths and ids.
const TEXT_KEYS = ["label", "heading", "title", "subtitle", "text", "caption", "groupIntro", "topic"];
function sectionLines(section) {
  const lines = [];
  for (const key of TEXT_KEYS) if (typeof section[key] === "string") lines.push(section[key]);
  for (const key of ["paragraphs", "points"]) {
    if (Array.isArray(section[key])) lines.push(...section[key].filter((v) => typeof v === "string"));
  }
  if (Array.isArray(section.items)) {
    for (const item of section.items) {
      if (typeof item === "string") lines.push(`- ${item}`);
      else if (item && typeof item === "object") {
        const parts = [item.title, item.text].filter((v) => typeof v === "string");
        if (parts.length) lines.push(`- ${parts.join(": ")}`);
      }
    }
  }
  return lines;
}

const md = [];
md.push("# Services", "");
for (const s of SERVICES) {
  md.push(`## ${s.title}`, `Page: /services/${s.slug}`, "", s.description, "");
  md.push("Includes:", ...s.features.map((f) => `- ${f}`), "");
  md.push(`Next step for visitors: ${s.cta} (${s.ctaHref})`, "");
  if (s.hero?.title) md.push(`Page headline: ${s.hero.title}${s.hero.description ? ` — ${s.hero.description}` : ""}`, "");
  for (const section of s.sections ?? []) {
    const lines = sectionLines(section);
    if (lines.length) md.push(...lines, "");
  }
}

md.push("# Product catalog 2026", "");
md.push("Full catalog PDF: /downloads/nkem-aeronautics-product-catalog-2026.pdf. All products: /products.", "");
for (const fam of PRODUCT_FAMILIES) {
  md.push(`## Family ${fam.code}: ${fam.name}`, `Section: /products#${fam.id}`, "", fam.intro, "");
  for (const p of PRODUCT_RANGE.filter((x) => x.family === fam.id)) {
    md.push(`### ${p.name}${p.model ? ` (model ${p.model})` : ""}`, `Page: /products/${p.slug}`, "", p.tagline);
    if (p.description) md.push("", p.description);
    md.push("", `Headline figures: ${p.keyFigures.map((k) => `${k.label} ${k.value}`).join("; ")}`);
    for (const g of p.specs) md.push(`${g.group}: ${g.rows.map(([a, b]) => `${a} ${b}`).join("; ")}`);
    md.push(`Applications: ${p.applications.join(", ")}`);
    if (p.thirdParty) md.push("Third-party product: supplied and supported by Nkem Aeronautics, not manufactured by it.");
    md.push("");
  }
}

md.push("# Firm affiliations farmers can declare at sign-up", "");
md.push(...FIRM_OPTIONS.map((f) => `- ${f.label}`), "");

writeFileSync(out, md.join("\n"));
console.log(`wrote ${out} (${md.join("\n").length} chars)`);
