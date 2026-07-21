import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the Chronicle newspaper", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /The Union &amp; Confederacy Chronicle/i);
  assert.match(html, /War Erupts Across the Republic/i);
  assert.match(html, /Campaign Dispatches/i);
  assert.match(html, /Open the Editor/i);
});

test("keeps Sanity content and schema in editable source files", async () => {
  const [page, client, config, content] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../lib/chronicle.ts", import.meta.url), "utf8"),
    readFile(new URL("../sanity.config.ts", import.meta.url), "utf8"),
    readFile(new URL("../content/chronicle.json", import.meta.url), "utf8"),
  ]);

  assert.match(page, /getChronicleContent/);
  assert.match(page, /href="\/studio"/);
  assert.match(client, /campaignDispatch/);
  assert.match(config, /schemaTypes/);
  assert.match(content, /Smoke Above Manassas/);
});

test("configures Sanity Presentation and secure Draft Mode", async () => {
  const [config, layout, enableRoute, locations] = await Promise.all([
    readFile(new URL("../sanity.config.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/api/draft-mode/enable/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../sanity/presentation/resolve.ts", import.meta.url), "utf8"),
  ]);

  assert.match(config, /presentationTool/);
  assert.match(config, /previewMode/);
  assert.match(layout, /VisualEditing/);
  assert.match(layout, /SanityLive/);
  assert.match(enableRoute, /defineEnableDraftMode/);
  assert.match(locations, /campaignDispatch/);
});

test("offers curated period typography menus", async () => {
  const [schema, page, layout] = await Promise.all([
    readFile(new URL("../schemas/siteSettings.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(schema, /mastheadTypeface/);
  assert.match(schema, /headlineTypeface/);
  assert.match(schema, /bodyTypeface/);
  assert.match(schema, /Unifraktur/);
  assert.match(schema, /Clarendon-style/);
  assert.match(page, /type-masthead-/);
  assert.match(layout, /Libre_Caslon_Text/);
});

test("supports featured and inline dispatch images", async () => {
  const [dispatchSchema, imageSchema, schemaIndex, page] = await Promise.all([
    readFile(new URL("../schemas/campaignDispatch.ts", import.meta.url), "utf8"),
    readFile(new URL("../schemas/dispatchImage.ts", import.meta.url), "utf8"),
    readFile(new URL("../schemas/index.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(dispatchSchema, /featuredImage/);
  assert.match(dispatchSchema, /defineArrayMember\(\{ type: "dispatchImage" \}\)/);
  assert.match(imageSchema, /hotspot: true/);
  assert.match(imageSchema, /Accessibility description/);
  assert.match(schemaIndex, /dispatchImage/);
  assert.match(page, /portableTextComponents/);
  assert.match(page, /createImageUrlBuilder/);
});
