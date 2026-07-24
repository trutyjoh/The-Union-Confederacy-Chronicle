import fallbackContent from "@/content/chronicle.json";
import { defineQuery } from "next-sanity";
import { draftMode } from "next/headers";
import { fetchFreshPublished, sanityFetch } from "@/lib/sanity";

export type RichBody = string[] | Array<Record<string, unknown>>;

export type DispatchImage = {
  _key?: string;
  _type?: "dispatchImage";
  asset?: {
    _id?: string;
    _ref?: string;
    url?: string;
    metadata?: {
      lqip?: string;
      dimensions?: { width?: number; height?: number };
    };
  };
  alt?: string;
  caption?: string;
  placement?: "wide" | "column" | "left" | "right";
  treatment?: "newspaper" | "sepia" | "original";
  crop?: Record<string, number>;
  hotspot?: Record<string, number>;
};

export type Telegram = { _key?: string; location: string; text: string };
export type LedgerEntry = { _key?: string; label: string; value: string };
export type ArchiveEntry = {
  _key?: string;
  number: string;
  title: string;
  anchor?: string;
  status?: string;
};

export type ChronicleSettings = {
  mastheadTypeface: "fell" | "blackletter" | "caslon";
  headlineTypeface: "old-standard" | "clarendon" | "cormorant";
  bodyTypeface: "caslon" | "baskerville" | "old-standard";
  volume: string;
  priceLine: string;
  issueDate: string;
  kicker: string;
  mastheadPrefix: string;
  mastheadMain: string;
  mastheadSuffix: string;
  motto: string;
  telegrams: Telegram[];
  editorPurpose: string;
  leadLabel: string;
  leadTitle: string;
  leadSubhead: string;
  leadByline: string;
  leadBody: RichBody;
  unionStrategicWill: string;
  confederateStrategicWill: string;
  ledger: LedgerEntry[];
  mapReferenceUrl: string;
  mapAlt: string;
  mapCaption: string;
  mapUnionHighlights?: string;
  mapConfederateHighlights?: string;
  archive: ArchiveEntry[];
  footerLine: string;
};

export type CampaignDispatch = {
  _id?: string;
  status: "current" | "working" | "archived";
  slug: string;
  eyebrow: string;
  campaignDate: string;
  title: string;
  dek: string;
  featuredImage?: DispatchImage;
  body: RichBody;
  note: string;
  sortOrder: number;
  comments?: ReaderComment[];
};

export type CampaignMap = {
  _id: string;
  status: "current" | "archived";
  title: string;
  campaignDate: string;
  image?: DispatchImage;
  imageUrl?: string;
  alt?: string;
  caption?: string;
  unionHighlights?: string;
  confederateHighlights?: string;
  sortOrder: number;
};

export type LeadStory = {
  _id: string;
  status: "current" | "archived";
  slug: string;
  label: string;
  title: string;
  subheadline: string;
  byline: string;
  body: RichBody;
  sortOrder: number;
};

export type ReaderComment = {
  _id: string;
  authorName: string;
  message: string;
  submittedAt: string;
  editorReply?: string;
};

export type ChronicleContent = {
  settings: ChronicleSettings;
  dispatches: CampaignDispatch[];
  archivedDispatches: CampaignDispatch[];
  campaignMaps: CampaignMap[];
  leadStories: LeadStory[];
};

const chronicleQuery = defineQuery(/* groq */ `{
  "settings": *[_type == "siteSettings"][0]{
    _id,
    "mastheadTypeface": coalesce(mastheadTypeface, "fell"),
    "headlineTypeface": coalesce(headlineTypeface, "old-standard"),
    "bodyTypeface": coalesce(bodyTypeface, "caslon"),
    volume,
    priceLine,
    issueDate,
    kicker,
    mastheadPrefix,
    mastheadMain,
    mastheadSuffix,
    motto,
    telegrams[]{_key, location, text},
    editorPurpose,
    leadLabel,
    leadTitle,
    leadSubhead,
    leadByline,
    leadBody,
    unionStrategicWill,
    confederateStrategicWill,
    ledger[]{_key, label, value},
    "mapReferenceUrl": coalesce(mapImage.asset->url, mapReferenceUrl),
    mapAlt,
    mapCaption,
    mapUnionHighlights,
    mapConfederateHighlights,
    archive[]{_key, number, title, anchor, status},
    footerLine
  },
  "dispatches": *[_type == "campaignDispatch" && coalesce(status, "current") == "current"] | order(sortOrder asc, campaignDate asc){
    _id,
    "status": coalesce(status, "current"),
    "slug": slug.current,
    eyebrow,
    campaignDate,
    title,
    dek,
    featuredImage{
      ...,
      asset->{_id, url, metadata{lqip, dimensions{width, height}}}
    },
    body[]{
      ...,
      _type == "dispatchImage" => {
        ...,
        asset->{_id, url, metadata{lqip, dimensions{width, height}}}
      }
    },
    note,
    sortOrder
  },
  "archivedDispatches": *[_type == "campaignDispatch" && status == "archived"] | order(sortOrder asc, campaignDate asc, _id asc){
    _id,
    "status": coalesce(status, "archived"),
    "slug": slug.current,
    eyebrow,
    campaignDate,
    title,
    dek,
    sortOrder
  },
  "campaignMaps": *[_type == "campaignMap" && status in ["current", "archived"]] | order(sortOrder desc, campaignDate desc, _createdAt desc){
    _id,
    status,
    title,
    campaignDate,
    image{
      ...,
      asset->{_id, url, metadata{lqip, dimensions{width, height}}}
    },
    "imageUrl": image.asset->url,
    unionHighlights,
    confederateHighlights,
    sortOrder
  },
  "leadStories": *[_type == "leadStory" && coalesce(status, "current") in ["current", "archived"]] | order(sortOrder desc, _updatedAt desc){
    _id,
    "status": coalesce(status, "current"),
    "slug": slug.current,
    label,
    title,
    subheadline,
    byline,
    body[]{
      ...,
      _type == "dispatchImage" => {
        ...,
        asset->{_id, url, metadata{lqip, dimensions{width, height}}}
      }
    },
    sortOrder
  }
}`);

const campaignDispatchQuery = defineQuery(/* groq */ `
  *[
    _type == "campaignDispatch" &&
    slug.current == $slug &&
    coalesce(status, "current") in ["current", "archived"]
  ][0]{
    _id,
    "status": coalesce(status, "current"),
    "slug": slug.current,
    eyebrow,
    campaignDate,
    title,
    dek,
    featuredImage{
      ...,
      asset->{_id, url, metadata{lqip, dimensions{width, height}}}
    },
    body[]{
      ...,
      _type == "dispatchImage" => {
        ...,
        asset->{_id, url, metadata{lqip, dimensions{width, height}}}
      }
    },
    note,
    sortOrder,
    "comments": *[
      _type == "dispatchComment" &&
      status == "approved" &&
      dispatch._ref == ^._id
    ] | order(submittedAt asc){
      _id,
      authorName,
      message,
      submittedAt,
      editorReply
    }
  }
`);

const leadStoryQuery = defineQuery(/* groq */ `
  *[
    _type == "leadStory" &&
    slug.current == $slug &&
    coalesce(status, "current") in ["current", "archived"]
  ][0]{
    _id,
    "status": coalesce(status, "current"),
    "slug": slug.current,
    label,
    title,
    subheadline,
    byline,
    body[]{
      ...,
      _type == "dispatchImage" => {
        ...,
        asset->{_id, url, metadata{lqip, dimensions{width, height}}}
      }
    },
    sortOrder
  }
`);

export function getLegacyLeadStory(settings: ChronicleSettings): LeadStory {
  return {
    _id: "newspaper-settings-lead-story",
    status: "current",
    slug: "current-headline",
    label: settings.leadLabel,
    title: settings.leadTitle,
    subheadline: settings.leadSubhead,
    byline: settings.leadByline,
    body: settings.leadBody,
    sortOrder: Number.MAX_SAFE_INTEGER,
  };
}

export async function getChronicleContent(): Promise<ChronicleContent> {
  const fallback = fallbackContent as Omit<
    ChronicleContent,
    "archivedDispatches" | "campaignMaps" | "leadStories"
  >;
  const fallbackWithArchive: ChronicleContent = {
    ...fallback,
    archivedDispatches: fallback.dispatches.filter((dispatch) => dispatch.status === "archived"),
    campaignMaps: [],
    leadStories: [],
  };
  try {
    const { isEnabled } = await draftMode();
    const content = isEnabled
      ? (await sanityFetch({ query: chronicleQuery })).data
      : await fetchFreshPublished<ChronicleContent>(chronicleQuery);

    const typedContent = content as ChronicleContent;
    if (
      !typedContent?.settings ||
      !typedContent.dispatches ||
      !typedContent.archivedDispatches ||
      !typedContent.campaignMaps ||
      !typedContent.leadStories
    ) {
      return fallbackWithArchive;
    }
    return typedContent;
  } catch {
    return fallbackWithArchive;
  }
}

export async function getCampaignDispatch(
  slug: string,
  options: { stega?: boolean } = {},
): Promise<CampaignDispatch | null> {
  const fallback = fallbackContent as Omit<
    ChronicleContent,
    "archivedDispatches" | "campaignMaps" | "leadStories"
  >;

  try {
    const { isEnabled } = await draftMode();
    const dispatch = isEnabled
      ? (
          await sanityFetch({
            query: campaignDispatchQuery,
            params: { slug },
            stega: options.stega,
          })
        ).data
      : await fetchFreshPublished<CampaignDispatch | null>(
          campaignDispatchQuery,
          { slug },
        );

    if (dispatch) return dispatch as CampaignDispatch;
  } catch {
    // The local fallback keeps dispatch routes usable when Sanity is unavailable.
  }

  return fallback.dispatches.find((dispatch) => dispatch.slug === slug) || null;
}

export async function getLeadStory(
  slug: string,
  options: { stega?: boolean } = {},
): Promise<LeadStory | null> {
  try {
    const { isEnabled } = await draftMode();
    const story = isEnabled
      ? (
          await sanityFetch({
            query: leadStoryQuery,
            params: { slug },
            stega: options.stega,
          })
        ).data
      : await fetchFreshPublished<LeadStory | null>(
          leadStoryQuery,
          { slug },
        );

    if (story) return story as LeadStory;
  } catch {
    // The Newspaper Settings fallback keeps the original lead story readable.
  }

  if (slug !== "current-headline") return null;
  const { settings } = await getChronicleContent();
  return getLegacyLeadStory(settings);
}
