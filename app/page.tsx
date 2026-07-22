import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { stegaClean } from "@sanity/client/stega";
import { createImageUrlBuilder } from "@sanity/image-url";
import Image from "next/image";
import type { PortableTextBlock } from "sanity";
import {
  getChronicleContent,
  type DispatchImage as DispatchImageValue,
  type RichBody,
} from "@/lib/chronicle";
import { CommentForm } from "@/components/CommentForm";
import { dataset, projectId } from "@/lib/sanity";

const imageBuilder = createImageUrlBuilder({ projectId, dataset });

function DispatchImage({
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
        sizes={featured || placement === "wide" ? "(max-width: 900px) 100vw, 560px" : "(max-width: 640px) 100vw, 280px"}
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

function StoryBody({ body, className }: { body: RichBody; className: string }) {
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

function formatCommentDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
}

export default async function Home() {
  const { settings, dispatches } = await getChronicleContent();
  const typographyClasses = [
    `type-masthead-${stegaClean(settings.mastheadTypeface || "fell")}`,
    `type-headline-${stegaClean(settings.headlineTypeface || "old-standard")}`,
    `type-body-${stegaClean(settings.bodyTypeface || "caslon")}`,
  ].join(" ");

  return (
    <main className="page-shell">
      <div className={`newspaper ${typographyClasses}`}>
        <header className="masthead" id="top">
          <div className="utility-line">
            <span>{settings.volume}</span>
            <span>{settings.priceLine}</span>
            <span>{settings.issueDate}</span>
          </div>
          <p className="kicker">{settings.kicker}</p>
          <h1>
            <span>{settings.mastheadPrefix}</span> {settings.mastheadMain}{" "}
            <span>{settings.mastheadSuffix}</span>
          </h1>
          <div className="motto">
            <span>✦</span> {settings.motto} <span>✦</span>
          </div>
          <nav aria-label="Newspaper sections">
            <a href="#latest">Latest Dispatch</a>
            <a href="#ledger">War Ledger</a>
            <a href="#map-room">Map Room</a>
            <a href="#archive">Campaign Archive</a>
          </nav>
        </header>

        <section className="lead-grid" id="latest">
          <aside className="side-column">
            <p className="section-label">This Edition</p>
            <h2>Telegraphic Summary</h2>
            <ul className="telegrams">
              {settings.telegrams.map((item) => (
                <li key={item._key || `${stegaClean(item.location)}-${stegaClean(item.text)}`}>
                  <b>{item.location}</b> {item.text}
                </li>
              ))}
            </ul>
            <div className="ornament">❦</div>
            <h3>Editor&apos;s Purpose</h3>
            <p>{settings.editorPurpose}</p>
          </aside>

          <article className="lead-story">
            <p className="section-label">{settings.leadLabel}</p>
            <h2>{settings.leadTitle}</h2>
            <p className="subhead">{settings.leadSubhead}</p>
            <p className="byline">{settings.leadByline}</p>
            <StoryBody body={settings.leadBody} className="story-columns" />
          </article>

          <aside className="ledger" id="ledger">
            <p className="section-label">Official Returns</p>
            <h2>The War Ledger</h2>
            <div className="score-seals" aria-label="Strategic will scores">
              <div>
                <span>U.S.</span>
                <strong>{settings.unionStrategicWill}</strong>
              </div>
              <div>
                <span>C.S.</span>
                <strong>{settings.confederateStrategicWill}</strong>
              </div>
            </div>
            <table>
              <tbody>
                {settings.ledger.map(({ label, value }) => (
                  <tr key={stegaClean(label)}>
                    <th>{label}</th>
                    <td>{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="smallprint">
              Campaign values and reports are now maintained in the Sanity editor at <code>/studio</code>.
            </p>
          </aside>
        </section>

        <section className="map-room" id="map-room">
          <div className="section-rule">
            <span>The Map Room</span>
          </div>
          <div className="map-frame">
            <img src={stegaClean(settings.mapReferenceUrl)} alt={settings.mapAlt} />
          </div>
          <p className="caption">{settings.mapCaption}</p>
        </section>

        <section className="dispatch-section">
          <div className="section-rule">
            <span>Campaign Dispatches</span>
          </div>
          <div className="dispatch-grid">
            {dispatches.map((post) => (
              <article className="dispatch" id={stegaClean(post.slug)} key={post._id || stegaClean(post.slug)}>
                <p className="section-label">{post.eyebrow}</p>
                <h2>{post.title}</h2>
                <p className="post-date">{post.campaignDate}</p>
                <p className="subhead">{post.dek}</p>
                <DispatchImage value={post.featuredImage} featured />
                <StoryBody body={post.body} className="body-copy" />
                {post.note ? <blockquote>{post.note}</blockquote> : null}
                {post._id ? (
                  <section className="reader-comments" aria-labelledby={`comments-${stegaClean(post.slug)}`}>
                    <div className="reader-comments__heading">
                      <p className="section-label">Public Correspondence</p>
                      <h3 id={`comments-${stegaClean(post.slug)}`}>Letters to the Editor</h3>
                    </div>
                    {post.comments?.length ? (
                      <ol className="comment-list">
                        {post.comments.map((comment) => (
                          <li key={comment._id}>
                            <p className="comment-list__meta">
                              <strong>{comment.authorName}</strong>
                              <span>{formatCommentDate(comment.submittedAt)}</span>
                            </p>
                            <p>{comment.message}</p>
                            {comment.editorReply ? (
                              <div className="editor-reply">
                                <strong>The Editor Replies:</strong> {comment.editorReply}
                              </div>
                            ) : null}
                          </li>
                        ))}
                      </ol>
                    ) : (
                      <p className="comment-list__empty">No letters have yet been selected for publication.</p>
                    )}
                    <CommentForm dispatchId={post._id} dispatchTitle={stegaClean(post.title)} />
                  </section>
                ) : null}
              </article>
            ))}
          </div>
        </section>

        <section className="archive" id="archive">
          <div>
            <p className="section-label">Filed for Posterity</p>
            <h2>Campaign Archive</h2>
          </div>
          <ol>
            {settings.archive.map((entry) => (
              <li key={entry._key || `${stegaClean(entry.number)}-${stegaClean(entry.title)}`}>
                {entry.anchor ? (
                  <a href={`#${stegaClean(entry.anchor)}`}>
                    <span>{entry.number}</span> {entry.title}
                  </a>
                ) : (
                  <span>
                    <span>{entry.number}</span> {entry.title}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </section>

        <footer>
          <p>{settings.footerLine}</p>
          <div className="footer-links">
            <a href="/studio">Open the Editor</a>
            <a href="#top">Return to the Masthead ↑</a>
          </div>
        </footer>
      </div>
    </main>
  );
}
