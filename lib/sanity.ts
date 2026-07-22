import { createClient } from "next-sanity";
import { defineLive } from "next-sanity/live";
import type { QueryParams } from "@sanity/client";
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

/**
 * Fetch public content directly from Sanity's API and refresh it at least once
 * per minute. This prevents a published document from being hidden behind a
 * stale deployment-time response when no browser was open to receive the live
 * invalidation event.
 */
export function fetchFreshPublished<T>(
  query: string,
  params: QueryParams = {},
): Promise<T> {
  return sanityClient
    .withConfig({
      useCdn: false,
      perspective: "published",
      stega: false,
    })
    .fetch<T>(query, params, {
      next: { revalidate: 60, tags: ["chronicle-published-content"] },
    });
}
