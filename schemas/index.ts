import { campaignMap } from "./campaignMap";
import { campaignDispatch } from "./campaignDispatch";
import { dispatchComment } from "./dispatchComment";
import { dispatchImage } from "./dispatchImage";
import { leadStory } from "./leadStory";
import { siteSettings } from "./siteSettings";

export const schemaTypes = [
  dispatchImage,
  siteSettings,
  leadStory,
  campaignMap,
  campaignDispatch,
  dispatchComment,
];
