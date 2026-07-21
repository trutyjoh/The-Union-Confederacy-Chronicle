import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { presentationTool } from "sanity/presentation";
import { structureTool } from "sanity/structure";
import { presentationResolve } from "./sanity/presentation/resolve";
import { structure } from "./sanity/structure";
import { schemaTypes } from "./schemas";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "uo48c7q4";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const previewOrigin =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://the-union-confederacy-chronicle.vercel.app";

export default defineConfig({
  name: "default",
  title: "Union & Confederacy Chronicle",
  basePath: "/studio",
  projectId,
  dataset,
  plugins: [
    structureTool({ structure }),
    presentationTool({
      resolve: presentationResolve,
      previewUrl: {
        origin: previewOrigin,
        previewMode: { enable: "/api/draft-mode/enable" },
      },
    }),
    visionTool(),
  ],
  schema: { types: schemaTypes },
});
