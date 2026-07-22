import { defineField, defineType } from "sanity";

const MapIcon = () => "🗺️";

export const campaignMap = defineType({
  name: "campaignMap",
  title: "Campaign Map",
  type: "document",
  icon: MapIcon,
  fields: [
    defineField({
      name: "status",
      title: "Map status",
      type: "string",
      description:
        "The newest Current map is displayed in the Map Room. Archived maps appear in the library below it.",
      initialValue: "archived",
      options: {
        layout: "radio",
        list: [
          { title: "Current — displayed as the main map", value: "current" },
          { title: "Archived — displayed in the map library", value: "archived" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "title",
      title: "Map title",
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
      name: "image",
      title: "Map image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Accessibility description",
          type: "string",
          description: "Briefly describe the military position shown on the map.",
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "caption",
          title: "Map caption",
          type: "text",
          rows: 3,
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "sortOrder",
      title: "Chronology number",
      type: "number",
      description: "Use a larger number for a newer map. The library displays newest to oldest.",
      initialValue: 100,
      validation: (rule) => rule.required(),
    }),
  ],
  orderings: [
    {
      title: "Newest campaign position",
      name: "newestCampaignPosition",
      by: [
        { field: "sortOrder", direction: "desc" },
        { field: "campaignDate", direction: "desc" },
      ],
    },
  ],
  preview: {
    select: {
      title: "title",
      campaignDate: "campaignDate",
      status: "status",
      media: "image",
    },
    prepare({ title, campaignDate, status, media }) {
      return {
        title: title || "Untitled campaign map",
        subtitle: `${status === "current" ? "Current" : "Archived"} · ${campaignDate || "Undated"}`,
        media,
      };
    },
  },
});
