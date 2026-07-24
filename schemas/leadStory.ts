import { defineArrayMember, defineField, defineType } from "sanity";

const HeadlineIcon = () => "📰";

export const leadStory = defineType({
  name: "leadStory",
  title: "Headline Story",
  type: "document",
  icon: HeadlineIcon,
  fields: [
    defineField({
      name: "status",
      title: "Headline status",
      type: "string",
      description:
        "The newest Current story appears beneath the newspaper menu. Archived stories remain available in the Headline Archive.",
      initialValue: "current",
      options: {
        layout: "radio",
        list: [
          { title: "Current — displayed on the front page", value: "current" },
          { title: "Archived — retained in the headline archive", value: "archived" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "label",
      title: "Lead story label",
      type: "string",
      description: "Example: Latest Intelligence or From the Field",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "title",
      title: "Lead story headline",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "subheadline",
      title: "Lead story subheadline",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "byline",
      title: "Lead story byline",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Story address",
      type: "slug",
      options: { source: "title" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "body",
      title: "Lead story text",
      type: "array",
      of: [
        defineArrayMember({ type: "block" }),
        defineArrayMember({ type: "dispatchImage" }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "sortOrder",
      title: "Chronology number",
      type: "number",
      description:
        "Use a larger number for a newer story. The newest Current story is placed on the front page.",
      initialValue: 100,
      validation: (rule) => rule.required(),
    }),
  ],
  orderings: [
    {
      title: "Newest headline first",
      name: "newestHeadline",
      by: [
        { field: "sortOrder", direction: "desc" },
        { field: "_updatedAt", direction: "desc" },
      ],
    },
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "subheadline",
      status: "status",
    },
    prepare({ title, subtitle, status }) {
      return {
        title: title || "Untitled headline story",
        subtitle: `${status === "archived" ? "Archived" : "Current"} · ${subtitle || "No subheadline"}`,
      };
    },
  },
});
