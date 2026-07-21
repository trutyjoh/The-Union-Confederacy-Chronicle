import { defineEnableDraftMode } from "next-sanity/draft-mode";
import { sanityClient } from "@/lib/sanity";

const readToken =
  process.env.SANITY_API_READ_TOKEN || process.env.SANITY_API_TOKEN;

export const { GET } = defineEnableDraftMode({
  client: sanityClient.withConfig({ token: readToken }),
});
