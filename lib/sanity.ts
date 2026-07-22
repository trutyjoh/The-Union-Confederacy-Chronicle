import { createClient } from "next-sanity";
import { defineLive } from "next-sanity/live";
import { dataset, projectId } from "@/lib/sanity-config";

export { dataset, projectId } from "@/lib/sanity-config";

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
