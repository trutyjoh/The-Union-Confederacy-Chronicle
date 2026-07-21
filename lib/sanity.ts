import { createClient } from "next-sanity";
import { defineLive } from "next-sanity/live";

export const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "uo48c7q4";
export const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

const readToken =
  process.env.SANITY_API_READ_TOKEN || process.env.SANITY_API_TOKEN || false;

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion: "2026-07-21",
  useCdn: true,
  perspective: "published",
  stega: { studioUrl: "/studio" },
});

export const { sanityFetch, SanityLive } = defineLive({
  client: sanityClient,
  serverToken: readToken,
  browserToken: readToken,
});
