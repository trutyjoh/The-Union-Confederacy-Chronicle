import { defineField, defineType } from "sanity";

export const dispatchComment = defineType({
  name: "dispatchComment",
  title: "Reader Comment",
  type: "document",
  fields: [
    defineField({
      name: "status",
      title: "Moderation status",
      type: "string",
      initialValue: "pending",
      options: {
        layout: "radio",
        list: [
          { title: "Pending — awaiting review", value: "pending" },
          { title: "Approved — visible on newspaper", value: "approved" },
          { title: "Rejected — not suitable for publication", value: "rejected" },
          { title: "Archived — retained but hidden", value: "archived" },
        ],
      },
      description:
        "Only Approved comments may be published. Leave Pending or Rejected comments as drafts; unpublish a live comment before archiving it.",
      validation: (rule) =>
        rule.required().custom((value) =>
          value === "approved"
            ? true
            : "Only approved reader comments may be published.",
        ),
    }),
    defineField({
      name: "dispatch",
      title: "Dispatch",
      type: "reference",
      to: [{ type: "campaignDispatch" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "authorName",
      title: "Reader name",
      type: "string",
      validation: (rule) => rule.required().min(2).max(60),
    }),
    defineField({
      name: "message",
      title: "Comment",
      type: "text",
      rows: 7,
      validation: (rule) => rule.required().min(10).max(1500),
    }),
    defineField({
      name: "submittedAt",
      title: "Submitted at",
      type: "datetime",
      readOnly: true,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "editorReply",
      title: "Editor's reply",
      type: "text",
      rows: 5,
      description: "Optional reply displayed beneath an approved comment.",
    }),
    defineField({
      name: "submissionFingerprint",
      title: "Submission fingerprint",
      type: "string",
      hidden: true,
      readOnly: true,
    }),
  ],
  orderings: [
    {
      title: "Newest submissions",
      name: "newestSubmissions",
      by: [{ field: "submittedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      authorName: "authorName",
      dispatchTitle: "dispatch.title",
      status: "status",
      submittedAt: "submittedAt",
    },
    prepare({ authorName, dispatchTitle, status, submittedAt }) {
      const statusLabel =
        status === "approved"
          ? "Approved"
          : status === "rejected"
            ? "Rejected"
            : status === "archived"
              ? "Archived"
              : "Pending";
      const date = submittedAt
        ? new Date(submittedAt).toLocaleDateString("en-US")
        : "Undated";

      return {
        title: `${authorName || "Anonymous reader"} on ${dispatchTitle || "Unknown dispatch"}`,
        subtitle: `${statusLabel} · ${date}`,
      };
    },
  },
});
