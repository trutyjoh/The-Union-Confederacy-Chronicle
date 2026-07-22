import { campaignDispatch } from "./campaignDispatch";
import { dispatchComment } from "./dispatchComment";
import { dispatchImage } from "./dispatchImage";
import { siteSettings } from "./siteSettings";

export const schemaTypes = [
  dispatchImage,
  siteSettings,
  campaignDispatch,
  dispatchComment,
];
