import { defineField, defineType } from "sanity";

export const dispatchImage = defineType({
  name: "dispatchImage",
  title: "Dispatch Image",
  type: "image",
  options: { hotspot: true },
  fields: [
    defineField({
      name: "alt",
      title: "Accessibility description",
      type: "string",
      description: "Briefly describe what the image shows.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "caption",
      title: "Newspaper caption",
      type: "string",
    }),
    defineField({
      name: "placement",
      title: "Placement",
      type: "string",
      initialValue: "wide",
      options: {
        list: [
          { title: "Wide — across both text columns", value: "wide" },
          { title: "Column — one text column", value: "column" },
          { title: "Left — text wraps on the right", value: "left" },
          { title: "Right — text wraps on the left", value: "right" },
        ],
      },
    }),
    defineField({
      name: "treatment",
      title: "Print treatment",
      type: "string",
      initialValue: "newspaper",
      options: {
        list: [
          { title: "Newspaper engraving", value: "newspaper" },
          { title: "Sepia photograph", value: "sepia" },
          { title: "Original color", value: "original" },
        ],
      },
    }),
  ],
  preview: {
    select: { title: "caption", subtitle: "alt", media: "asset" },
    prepare: ({ title, subtitle, media }) => ({
      title: title || "Dispatch image",
      subtitle,
      media,
    }),
  },
});
