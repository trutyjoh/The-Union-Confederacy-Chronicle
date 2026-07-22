import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { stegaClean } from "@sanity/client/stega";
import { createImageUrlBuilder } from "@sanity/image-url";
import Image from "next/image";
import type { PortableTextBlock } from "sanity";
import type {
  DispatchImage as DispatchImageValue,
  RichBody,
} from "@/lib/chronicle";
import { dataset, projectId } from "@/lib/sanity-config";

const imageBuilder = createImageUrlBuilder({ projectId, dataset });

export function DispatchImage({
  value,
  featured = false,
}: {
  value?: DispatchImageValue;
  featured?: boolean;
}) {
  if (!value?.asset) return null;

  const placement = featured ? "featured" : stegaClean(value.placement || "wide");
  const treatment = stegaClean(value.treatment || "newspaper");
  const sourceWidth = value.asset.metadata?.dimensions?.width || 1200;
  const sourceHeight = value.asset.metadata?.dimensions?.height || 800;
  const requestedWidth = featured || placement === "wide" ? 1200 : 720;
  const requestedHeight = Math.round(requestedWidth * (sourceHeight / sourceWidth));
  const src = imageBuilder.image(value).width(requestedWidth).fit("max").auto("format").url();

  return (
    <figure className={`dispatch-image dispatch-image--${placement} dispatch-image--${treatment}`}>
      <Image
        src={src}
        alt={value.alt || ""}
        width={requestedWidth}
        height={requestedHeight}
        sizes={featured ? "(max-width: 900px) 100vw, 960px" : "(max-width: 640px) 100vw, 420px"}
        placeholder={value.asset.metadata?.lqip ? "blur" : "empty"}
        blurDataURL={value.asset.metadata?.lqip}
      />
      {value.caption ? <figcaption>{value.caption}</figcaption> : null}
    </figure>
  );
}

const portableTextComponents: PortableTextComponents = {
  types: {
    dispatchImage: ({ value }) => <DispatchImage value={value as DispatchImageValue} />,
  },
};

export function StoryBody({ body, className }: { body: RichBody; className: string }) {
  const isPlainText = body.every((block) => typeof block === "string");

  return (
    <div className={className}>
      {isPlainText ? (
        (body as string[]).map((paragraph) => <p key={stegaClean(paragraph)}>{paragraph}</p>)
      ) : (
        <PortableText value={body as PortableTextBlock[]} components={portableTextComponents} />
      )}
    </div>
  );
}

export function excerptStoryBody(body: RichBody, blockCount = 3): RichBody {
  return body.slice(0, blockCount) as RichBody;
}
