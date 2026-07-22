import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, { headers: { accept: "text/html" } }),
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

test("shows only the five newest active dispatches in the telegraphic summary", async () => {
  const [homePage, dispatchPage] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/dispatches/[slug]/page.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(homePage, /dispatches\.slice\(-5\)\.reverse\(\)/);
  assert.match(homePage, /id="telegraphic-summary"/);
  assert.match(homePage, /\?from=telegraphic-summary/);
  assert.match(homePage, /post\.dek/);
  assert.match(dispatchPage, /Return to Telegraphic Summary/);

  const response = await render("/dispatches/manassas?from=telegraphic-summary");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Return to Telegraphic Summary/i);
  assert.match(html, /href="\/#telegraphic-summary"/i);
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
  const [dispatchSchema, imageSchema, schemaIndex, storyContent] = await Promise.all([
    readFile(new URL("../schemas/campaignDispatch.ts", import.meta.url), "utf8"),
    readFile(new URL("../schemas/dispatchImage.ts", import.meta.url), "utf8"),
    readFile(new URL("../schemas/index.ts", import.meta.url), "utf8"),
    readFile(new URL("../components/StoryContent.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(dispatchSchema, /featuredImage/);
  assert.match(dispatchSchema, /defineArrayMember\(\{ type: "dispatchImage" \}\)/);
  assert.match(imageSchema, /hotspot: true/);
  assert.match(imageSchema, /Accessibility description/);
  assert.match(schemaIndex, /dispatchImage/);
  assert.match(storyContent, /portableTextComponents/);
  assert.match(storyContent, /createImageUrlBuilder/);
});

test("supports a chronological public dispatch archive", async () => {
  const [dispatchSchema, client, config, structure, homePage, dispatchPage] = await Promise.all([
    readFile(new URL("../schemas/campaignDispatch.ts", import.meta.url), "utf8"),
    readFile(new URL("../lib/chronicle.ts", import.meta.url), "utf8"),
    readFile(new URL("../sanity.config.ts", import.meta.url), "utf8"),
    readFile(new URL("../sanity/structure.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/dispatches/[slug]/page.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(dispatchSchema, /Dispatch status/);
  assert.match(dispatchSchema, /value: "current"/);
  assert.match(dispatchSchema, /value: "working"/);
  assert.match(dispatchSchema, /value: "archived"/);
  assert.match(client, /coalesce\(status, "current"\) == "current"/);
  assert.match(client, /"archivedDispatches"/);
  assert.match(client, /status == "archived"/);
  assert.match(client, /order\(sortOrder asc, campaignDate asc, _id asc\)/);
  assert.match(client, /in \["current", "archived"\]/);
  assert.match(config, /structureTool\(\{ structure \}\)/);
  assert.match(structure, /Current Dispatches/);
  assert.match(structure, /Working Drafts/);
  assert.match(structure, /Dispatch Archive/);
  assert.match(homePage, /ledger-archive/);
  assert.match(homePage, /archivedDispatches\.map/);
  assert.match(dispatchPage, /Return to Campaign Archive/);
});

test("supports moderated reader comments on dispatches", async () => {
  const [commentSchema, schemaIndex, structure, client, dispatchPage, form, route] = await Promise.all([
    readFile(new URL("../schemas/dispatchComment.ts", import.meta.url), "utf8"),
    readFile(new URL("../schemas/index.ts", import.meta.url), "utf8"),
    readFile(new URL("../sanity/structure.ts", import.meta.url), "utf8"),
    readFile(new URL("../lib/chronicle.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/dispatches/[slug]/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../components/CommentForm.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/api/comments/route.ts", import.meta.url), "utf8"),
  ]);

  assert.match(commentSchema, /Reader Comment/);
  assert.match(commentSchema, /Moderation status/);
  assert.match(commentSchema, /value: "pending"/);
  assert.match(commentSchema, /value: "approved"/);
  assert.match(commentSchema, /editorReply/);
  assert.match(schemaIndex, /dispatchComment/);
  assert.match(structure, /Pending Reader Comments/);
  assert.match(structure, /Approved Reader Comments/);
  assert.match(client, /status == "approved"/);
  assert.match(dispatchPage, /Letters to the Editor/);
  assert.match(form, /Submit for Review/);
  assert.match(route, /SANITY_API_WRITE_TOKEN/);
  assert.match(route, /submissionFingerprint/);
  assert.match(route, /RATE_LIMIT_MAXIMUM/);
  assert.match(route, /drafts\.comment-/);
});

test("uses compact dispatch previews and dedicated story pages", async () => {
  const [homePage, dispatchPage, client, locations] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/dispatches/[slug]/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../lib/chronicle.ts", import.meta.url), "utf8"),
    readFile(new URL("../sanity/presentation/resolve.ts", import.meta.url), "utf8"),
  ]);

  assert.match(homePage, /excerptStoryBody/);
  assert.match(homePage, /Continue Reading/);
  assert.match(homePage, /#letters-to-editor/);
  assert.match(dispatchPage, /Return to the Chronicle/);
  assert.match(dispatchPage, /CommentForm/);
  assert.match(client, /campaignDispatchQuery/);
  assert.match(client, /defineQuery/);
  assert.match(locations, /\/dispatches\/\$\{document\.slug\}/);

  const response = await render("/dispatches/manassas");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Return to the Chronicle/i);
  assert.match(html, /Letters to the Editor/i);
});
