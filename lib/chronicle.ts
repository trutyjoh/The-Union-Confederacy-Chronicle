import { createClient } from "next-sanity";
import fallbackContent from "@/content/chronicle.json";

export type RichBody = string[] | Array<Record<string, unknown>>;

export type Telegram = { location: string; text: string };
export type LedgerEntry = { label: string; value: string };
export type ArchiveEntry = {
  number: string;
  title: string;
  anchor?: string;
  status?: string;
};

export type ChronicleSettings = {
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
  slug: string;
  eyebrow: string;
  campaignDate: string;
  title: string;
  dek: string;
  body: RichBody;
  note: string;
  sortOrder: number;
};

export type ChronicleContent = {
  settings: ChronicleSettings;
  dispatches: CampaignDispatch[];
};

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "uo48c7q4";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2026-07-21",
  useCdn: true,
});

const chronicleQuery = `{
  "settings": *[_type == "siteSettings"][0]{
    volume,
    priceLine,
    issueDate,
    kicker,
    mastheadPrefix,
    mastheadMain,
    mastheadSuffix,
    motto,
    telegrams[]{location, text},
    editorPurpose,
    leadLabel,
    leadTitle,
    leadSubhead,
    leadByline,
    leadBody,
    unionStrategicWill,
    confederateStrategicWill,
    ledger[]{label, value},
    "mapReferenceUrl": coalesce(mapImage.asset->url, mapReferenceUrl),
    mapAlt,
    mapCaption,
    archive[]{number, title, anchor, status},
    footerLine
  },
  "dispatches": *[_type == "campaignDispatch"] | order(sortOrder asc, campaignDate asc){
    "slug": slug.current,
    eyebrow,
    campaignDate,
    title,
    dek,
    body,
    note,
    sortOrder
  }
}`;

export async function getChronicleContent(): Promise<ChronicleContent> {
  const fallback = fallbackContent as ChronicleContent;
  try {
    const content = await client.fetch<ChronicleContent>(
      chronicleQuery,
      {},
      { next: { revalidate: 60 } },
    );

    if (!content?.settings || !content.dispatches?.length) return fallback;
    return content;
  } catch {
    return fallback;
  }
}
