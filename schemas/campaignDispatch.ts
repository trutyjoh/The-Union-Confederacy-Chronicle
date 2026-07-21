import { defineArrayMember, defineField, defineType } from "sanity";

export const campaignDispatch = defineType({
  name: "campaignDispatch",
  title: "Campaign Dispatch",
  type: "document",
  fields: [
    defineField({
      name: "status",
      title: "Dispatch status",
      type: "string",
      description:
        "Current dispatches appear on the newspaper. Working drafts and archived dispatches remain safely in Studio but stay off the public site.",
      initialValue: "current",
      options: {
        layout: "radio",
        list: [
          { title: "Current — visible on newspaper", value: "current" },
          { title: "Working draft — hidden from newspaper", value: "working" },
          { title: "Archived — retained but hidden", value: "archived" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
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
      name: "featuredImage",
      title: "Featured image",
      type: "dispatchImage",
      description: "Optional image displayed beneath the subheadline.",
    }),
    defineField({
      name: "body",
      title: "Dispatch text",
      type: "array",
      of: [
        defineArrayMember({ type: "block" }),
        defineArrayMember({ type: "dispatchImage" }),
      ],
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
    select: { title: "title", campaignDate: "campaignDate", status: "status" },
    prepare({ title, campaignDate, status }) {
      const statusLabel =
        status === "archived"
          ? "Archived"
          : status === "working"
            ? "Working draft"
            : "Current";

      return {
        title,
        subtitle: `${statusLabel} · ${campaignDate ?? "Undated"}`,
      };
    },
  },
});
