import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "uo48c7q4",
    dataset: process.env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  },
});
