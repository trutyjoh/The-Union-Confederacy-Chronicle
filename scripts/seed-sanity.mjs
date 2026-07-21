import { readFileSync } from "node:fs";
import { createClient } from "@sanity/client";

const projectId = process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_TOKEN;
const printOnly = process.argv.includes("--print");

if (!printOnly && (!projectId || !token)) {
  throw new Error("SANITY_PROJECT_ID and SANITY_API_TOKEN are required to seed content.");
}

const source = JSON.parse(
  readFileSync(new URL("../content/chronicle.json", import.meta.url), "utf8"),
);

const key = (prefix, index) => `${prefix}-${String(index + 1).padStart(2, "0")}`;
const keyed = (items, prefix) => items.map((item, index) => ({ ...item, _key: key(prefix, index) }));
const toBlocks = (paragraphs, prefix) =>
  paragraphs.map((text, index) => ({
    _type: "block",
    _key: key(prefix, index),
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: `${key(prefix, index)}-span`,
        text,
        marks: [],
      },
    ],
  }));

const settings = {
  _id: "siteSettings",
  _type: "siteSettings",
  ...source.settings,
  telegrams: keyed(source.settings.telegrams, "telegram"),
  leadBody: toBlocks(source.settings.leadBody, "lead"),
  ledger: keyed(source.settings.ledger, "ledger"),
  archive: keyed(source.settings.archive, "archive"),
};

const dispatches = source.dispatches.map((dispatch) => ({
  _id: `campaignDispatch-${dispatch.slug}`,
  _type: "campaignDispatch",
  ...dispatch,
  slug: { _type: "slug", current: dispatch.slug },
  body: toBlocks(dispatch.body, dispatch.slug),
}));

if (printOnly) {
  console.log(JSON.stringify([settings, ...dispatches]));
  process.exit(0);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2026-07-21",
  useCdn: false,
});

const transaction = client.transaction().createOrReplace(settings);
for (const dispatch of dispatches) transaction.createOrReplace(dispatch);

await transaction.commit();
console.log(`Seeded Chronicle settings and ${dispatches.length} campaign dispatches.`);
