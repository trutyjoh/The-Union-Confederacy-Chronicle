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
    campaignDispatch: defineLocations({
      select: { title: "title", slug: "slug.current" },
      resolve: (document) => ({
        locations: [
          {
            title: document?.title || "Campaign dispatch",
            href: document?.slug ? `/#${document.slug}` : "/",
          },
          { title: "Chronicle front page", href: "/" },
        ],
      }),
    }),
  },
};
