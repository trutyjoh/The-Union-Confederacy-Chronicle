import fallbackContent from "@/content/chronicle.json";
import { sanityFetch } from "@/lib/sanity";

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
};

export type ChronicleContent = {
  settings: ChronicleSettings;
  dispatches: CampaignDispatch[];
};

const chronicleQuery = `{
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
  }
}`;

export async function getChronicleContent(): Promise<ChronicleContent> {
  const fallback = fallbackContent as ChronicleContent;
  try {
    const { data: content } = await sanityFetch({ query: chronicleQuery });

    const typedContent = content as ChronicleContent;
    if (!typedContent?.settings || !typedContent.dispatches) return fallback;
    return typedContent;
  } catch {
    return fallback;
  }
}
