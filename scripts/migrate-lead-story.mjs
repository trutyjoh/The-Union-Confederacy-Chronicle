import { getCliClient } from "sanity/cli";

const client = getCliClient({ apiVersion: "2026-07-21" });

const existingLeadStory = await client.fetch(
  '*[_type == "leadStory"][0]{_id, title}',
);

if (existingLeadStory?._id) {
  console.log(`Lead Story already exists: ${existingLeadStory.title}`);
  process.exit(0);
}

const settings = await client.fetch(
  `*[_id == "siteSettings"][0]{
    leadLabel,
    leadTitle,
    leadSubhead,
    leadByline,
    leadBody
  }`,
);

if (!settings?.leadTitle || !settings?.leadBody?.length) {
  throw new Error("The legacy Lead Story fields were not found in Newspaper Settings.");
}

const slug = settings.leadTitle
  .toLowerCase()
  .normalize("NFKD")
  .replace(/[\u0300-\u036f]/g, "")
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-|-$/g, "");

const created = await client.create({
  _type: "leadStory",
  status: "current",
  label: settings.leadLabel || "Lead Story",
  title: settings.leadTitle,
  subheadline: settings.leadSubhead || "",
  byline: settings.leadByline || "By the Editor",
  slug: { _type: "slug", current: slug || "current-lead-story" },
  body: settings.leadBody,
  sortOrder: 100,
});

console.log(`Created combined Lead Story: ${created.title} (${created._id})`);
