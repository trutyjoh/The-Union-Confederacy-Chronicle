import {
  defineLocations,
  type PresentationPluginOptions,
} from "sanity/presentation";

export const presentationResolve: PresentationPluginOptions["resolve"] = {
  locations: {
    siteSettings: defineLocations({
      select: { title: "mastheadMain" },
      resolve: (document) => ({
        locations: [
          {
            title: document?.title || "Chronicle front page",
            href: "/",
          },
        ],
      }),
    }),
    leadStory: defineLocations({
      select: { title: "title", slug: "slug.current" },
      resolve: (document) => ({
        locations: [
          {
            title: document?.title || "Headline story",
            href: document?.slug ? `/headlines/${document.slug}` : "/#latest",
          },
          { title: "Front-page headline", href: "/#latest" },
          { title: "Headline archive", href: "/headlines" },
        ],
      }),
    }),
    campaignDispatch: defineLocations({
      select: { title: "title", slug: "slug.current" },
      resolve: (document) => ({
        locations: [
          {
            title: document?.title || "Campaign dispatch",
            href: document?.slug ? `/dispatches/${document.slug}` : "/",
          },
          { title: "Chronicle front page", href: "/" },
        ],
      }),
    }),
    campaignMap: defineLocations({
      select: { title: "title" },
      resolve: (document) => ({
        locations: [
          {
            title: document?.title || "Campaign map",
            href: "/#map-room",
          },
        ],
      }),
    }),
  },
};
