import { createClient, type SanityClient } from "next-sanity";
import { NextResponse } from "next/server";
import { dataset, projectId } from "@/lib/sanity";

export const runtime = "nodejs";

const MAX_REQUEST_BYTES = 10_000;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1_000;
const RATE_LIMIT_MAXIMUM = 3;

let writeClient: SanityClient | null = null;

function getWriteClient() {
  const token = process.env.SANITY_API_WRITE_TOKEN;
  if (!token) return null;

  if (!writeClient) {
    writeClient = createClient({
      projectId,
      dataset,
      apiVersion: "2026-07-22",
      useCdn: false,
      perspective: "raw",
      token,
    });
  }

  return writeClient;
}

function json(message: string, status: number) {
  return NextResponse.json({ message }, { status });
}

function normalize(value: unknown) {
  return typeof value === "string" ? value.trim().replace(/\r\n?/g, "\n") : "";
}

async function fingerprintFor(request: Request, secret: string) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const address = forwarded || request.headers.get("x-real-ip") || "unknown";
  const bytes = new TextEncoder().encode(`${secret}:${address}`);
  const digest = await crypto.subtle.digest("SHA-256", bytes);

  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function POST(request: Request) {
  const requestLength = Number(request.headers.get("content-length") || "0");
  if (requestLength > MAX_REQUEST_BYTES) return json("That letter is too large to submit.", 413);

  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) {
    return json("This submission did not come from the Chronicle.", 403);
  }

  if (!request.headers.get("content-type")?.startsWith("application/json")) {
    return json("The letter must be submitted from the Chronicle form.", 415);
  }

  let body: Record<string, unknown>;
  try {
    const bodyText = await request.text();
    if (new TextEncoder().encode(bodyText).byteLength > MAX_REQUEST_BYTES) {
      return json("That letter is too large to submit.", 413);
    }
    body = JSON.parse(bodyText) as Record<string, unknown>;
  } catch {
    return json("The letter could not be read.", 400);
  }

  // Honeypot fields are invisible to readers. Respond successfully without storing bot submissions.
  if (normalize(body.company)) {
    return json("Thank you. Your letter is awaiting editorial review.", 201);
  }

  const startedAt = Number(body.startedAt);
  const elapsed = Date.now() - startedAt;
  if (!Number.isFinite(startedAt) || elapsed < 3_000 || elapsed > 2 * 60 * 60 * 1_000) {
    return json("Please reload the page and try your letter again.", 400);
  }

  const dispatchId = normalize(body.dispatchId);
  const authorName = normalize(body.authorName);
  const message = normalize(body.message);

  if (!dispatchId || dispatchId.startsWith("drafts.")) {
    return json("That dispatch is not available for comments.", 400);
  }
  if (authorName.length < 2 || authorName.length > 60) {
    return json("Please provide a name between 2 and 60 characters.", 400);
  }
  if (message.length < 10 || message.length > 1500) {
    return json("Please write between 10 and 1,500 characters.", 400);
  }

  const client = getWriteClient();
  const token = process.env.SANITY_API_WRITE_TOKEN;
  if (!client || !token) {
    return json("Reader letters are temporarily unavailable. Please try again later.", 503);
  }

  try {
    const dispatch = await client.fetch<{ _id: string } | null>(
      `*[_type == "campaignDispatch" && _id == $dispatchId && coalesce(status, "current") == "current"][0]{_id}`,
      { dispatchId },
    );
    if (!dispatch?._id) return json("That dispatch is not available for comments.", 404);

    const submissionFingerprint = await fingerprintFor(request, token);
    const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_MS).toISOString();
    const recentSubmissions = await client.fetch<number>(
      `count(*[_type == "dispatchComment" && submissionFingerprint == $submissionFingerprint && submittedAt > $windowStart])`,
      { submissionFingerprint, windowStart },
    );
    if (recentSubmissions >= RATE_LIMIT_MAXIMUM) {
      return json("Too many letters were submitted recently. Please try again in a few minutes.", 429);
    }

    await client.create({
      _id: `drafts.comment-${crypto.randomUUID()}`,
      _type: "dispatchComment",
      status: "pending",
      dispatch: { _type: "reference", _ref: dispatch._id },
      authorName,
      message,
      submittedAt: new Date().toISOString(),
      submissionFingerprint,
    });

    return json("Thank you. Your letter is awaiting editorial review.", 201);
  } catch {
    return json("The letter could not be delivered. Please try again later.", 500);
  }
}
