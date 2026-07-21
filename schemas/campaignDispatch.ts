import { defineField, defineType } from "sanity";

export const campaignDispatch = defineType({
  name: "campaignDispatch",
  title: "Campaign Dispatch",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Headline",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Page anchor",
      type: "slug",
      options: { source: "title" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "eyebrow",
      title: "Theater or dateline",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "campaignDate",
      title: "Campaign date / turn",
      type: "string",
      description: "Example: Summer, 1861 · Action Round Four",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "dek",
      title: "Subheadline",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "body",
      title: "Dispatch text",
      type: "array",
      of: [{ type: "block" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "note",
      title: "Player or rules note",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "sortOrder",
      title: "Display order",
      type: "number",
      initialValue: 100,
    }),
  ],
  orderings: [
    {
      title: "Campaign order",
      name: "campaignOrder",
      by: [{ field: "sortOrder", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "title", subtitle: "campaignDate" },
  },
});
