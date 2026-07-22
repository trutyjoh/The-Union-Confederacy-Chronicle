import { campaignMap } from "./campaignMap";
import { campaignDispatch } from "./campaignDispatch";
import { dispatchComment } from "./dispatchComment";
import { dispatchImage } from "./dispatchImage";
import { siteSettings } from "./siteSettings";

export const schemaTypes = [
  dispatchImage,
  siteSettings,
  campaignMap,
  campaignDispatch,
  dispatchComment,
];
