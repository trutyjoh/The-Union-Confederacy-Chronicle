import { defineArrayMember, defineField, defineType } from "sanity";

const HeadlineIcon = () => "📰";

export const leadStory = defineType({
  name: "leadStory",
  title: "Lead Story",
  type: "document",
  icon: HeadlineIcon,
  description:
    "One complete front-page story containing the label, headline, subheadline, byline, and article text.",
  groups: [
    { name: "story", title: "Lead Story", default: true },
    { name: "filing", title: "Filing & Archive" },
  ],
  fields: [
    defineField({
      name: "status",
      title: "Story status",
      type: "string",
      description:
        "Choose Current for the front page or Archived to retain the complete story in the Lead Story Archive.",
      group: "filing",
      initialValue: "current",
      options: {
        layout: "radio",
        list: [
          { title: "Current — displayed on the front page", value: "current" },
          { title: "Archived — retained in the Lead Story Archive", value: "archived" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "label",
      title: "Lead story label",
      type: "string",
      description: "Example: Latest Intelligence or From the Field",
      group: "story",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "title",
      title: "Lead story headline",
      type: "string",
      group: "story",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "subheadline",
      title: "Lead story subheadline",
      type: "text",
      rows: 3,
      group: "story",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "byline",
      title: "Lead story byline",
      type: "string",
      group: "story",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Story address",
      type: "slug",
      group: "filing",
      options: { source: "title" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "body",
      title: "Lead story text — complete article",
      type: "array",
      group: "story",
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
      group: "filing",
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
        title: title || "Untitled lead story",
        subtitle: `${status === "archived" ? "Archived" : "Current"} · ${subtitle || "No subheadline"}`,
      };
    },
  },
});
