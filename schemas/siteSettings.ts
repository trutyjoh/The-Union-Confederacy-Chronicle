import { defineField, defineType } from "sanity";

const requiredString = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: "string",
    validation: (rule) => rule.required(),
  });

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Newspaper Settings",
  type: "document",
  fields: [
    defineField({ name: "volume", title: "Volume and issue", type: "string" }),
    defineField({ name: "priceLine", title: "Price line", type: "string" }),
    defineField({ name: "issueDate", title: "Issue date", type: "string" }),
    requiredString("kicker", "Masthead kicker"),
    requiredString("mastheadPrefix", "Small masthead prefix"),
    requiredString("mastheadMain", "Main masthead title"),
    requiredString("mastheadSuffix", "Small masthead suffix"),
    requiredString("motto", "Motto"),
    defineField({
      name: "telegrams",
      title: "Telegraphic summary",
      type: "array",
      of: [
        {
          type: "object",
          name: "telegram",
          fields: [
            { name: "location", title: "Location", type: "string" },
            { name: "text", title: "Report", type: "string" },
          ],
          preview: { select: { title: "location", subtitle: "text" } },
        },
      ],
    }),
    defineField({
      name: "editorPurpose",
      title: "Editor's purpose",
      type: "text",
      rows: 4,
    }),
    defineField({ name: "leadLabel", title: "Lead story label", type: "string" }),
    requiredString("leadTitle", "Lead story headline"),
    defineField({ name: "leadSubhead", title: "Lead story subheadline", type: "text", rows: 3 }),
    defineField({ name: "leadByline", title: "Lead story byline", type: "string" }),
    defineField({
      name: "leadBody",
      title: "Lead story text",
      type: "array",
      of: [{ type: "block" }],
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "unionStrategicWill", title: "Union strategic will", type: "string" }),
    defineField({ name: "confederateStrategicWill", title: "Confederate strategic will", type: "string" }),
    defineField({
      name: "ledger",
      title: "War ledger",
      type: "array",
      of: [
        {
          type: "object",
          name: "ledgerEntry",
          fields: [
            { name: "label", title: "Label", type: "string" },
            { name: "value", title: "Value", type: "string" },
          ],
          preview: { select: { title: "label", subtitle: "value" } },
        },
      ],
    }),
    defineField({
      name: "mapImage",
      title: "Campaign map image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "mapReferenceUrl",
      title: "Fallback map URL",
      type: "url",
      description: "Used until a map image is uploaded above.",
    }),
    defineField({ name: "mapAlt", title: "Map accessibility description", type: "string" }),
    defineField({ name: "mapCaption", title: "Map caption", type: "text", rows: 3 }),
    defineField({
      name: "archive",
      title: "Campaign archive",
      type: "array",
      of: [
        {
          type: "object",
          name: "archiveEntry",
          fields: [
            { name: "number", title: "Issue number", type: "string" },
            { name: "title", title: "Issue title", type: "string" },
            { name: "anchor", title: "Optional page anchor", type: "string" },
            {
              name: "status",
              title: "Status",
              type: "string",
              options: {
                list: [
                  { title: "Published", value: "published" },
                  { title: "Planned", value: "planned" },
                  { title: "Forthcoming", value: "forthcoming" },
                ],
              },
            },
          ],
          preview: { select: { title: "title", subtitle: "number" } },
        },
      ],
    }),
    defineField({ name: "footerLine", title: "Footer line", type: "string" }),
  ],
  preview: {
    prepare: () => ({ title: "The Union & Confederacy Chronicle" }),
  },
});
