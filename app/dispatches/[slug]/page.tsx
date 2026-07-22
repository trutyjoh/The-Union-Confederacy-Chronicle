import { stegaClean } from "@sanity/client/stega";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CommentForm } from "@/components/CommentForm";
import { DispatchImage, StoryBody } from "@/components/StoryContent";
import { getCampaignDispatch, getChronicleContent } from "@/lib/chronicle";

type DispatchPageProps = {
  params: Promise<{ slug: string }>;
};

function formatCommentDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
}

export async function generateMetadata({ params }: DispatchPageProps): Promise<Metadata> {
  const { slug } = await params;
  const dispatch = await getCampaignDispatch(slug, { stega: false });

  if (!dispatch) return { title: "Dispatch Not Found" };

  return {
    title: `${dispatch.title} | The Union & Confederacy Chronicle`,
    description: dispatch.dek,
  };
}

export default async function DispatchPage({ params }: DispatchPageProps) {
  const { slug } = await params;
  const [dispatch, { settings }] = await Promise.all([
    getCampaignDispatch(slug),
    getChronicleContent(),
  ]);

  if (!dispatch) notFound();

  const typographyClasses = [
    `type-masthead-${stegaClean(settings.mastheadTypeface || "fell")}`,
    `type-headline-${stegaClean(settings.headlineTypeface || "old-standard")}`,
    `type-body-${stegaClean(settings.bodyTypeface || "caslon")}`,
  ].join(" ");

  return (
    <main className="page-shell">
      <div className={`newspaper dispatch-edition ${typographyClasses}`}>
        <header className="masthead dispatch-masthead" id="top">
          <div className="utility-line">
            <span>{settings.volume}</span>
            <Link href="/">← Return to Chronicle</Link>
            <span>{settings.issueDate}</span>
          </div>
          <p className="kicker">{settings.kicker}</p>
          <h1>
            <Link href="/">
              <span>{settings.mastheadPrefix}</span> {settings.mastheadMain}{" "}
              <span>{settings.mastheadSuffix}</span>
            </Link>
          </h1>
          <div className="motto">
            <span>✦</span> Special Dispatch <span>✦</span>
          </div>
        </header>

        <article className="dispatch dispatch-detail">
          <p className="section-label">{dispatch.eyebrow}</p>
          <h2>{dispatch.title}</h2>
          <p className="post-date">{dispatch.campaignDate}</p>
          <p className="subhead">{dispatch.dek}</p>
          <DispatchImage value={dispatch.featuredImage} featured />
          <StoryBody body={dispatch.body} className="body-copy" />
          {dispatch.note ? <blockquote>{dispatch.note}</blockquote> : null}
        </article>

        <section className="reader-comments reader-comments--page" id="letters-to-editor" aria-labelledby="letters-heading">
          <div className="reader-comments__heading">
            <p className="section-label">Public Correspondence</p>
            <h3 id="letters-heading">Letters to the Editor</h3>
          </div>
          {dispatch.comments?.length ? (
            <ol className="comment-list">
              {dispatch.comments.map((comment) => (
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
          {dispatch._id ? (
            <CommentForm dispatchId={dispatch._id} dispatchTitle={stegaClean(dispatch.title)} />
          ) : (
            <p className="comment-list__empty">Reader submissions are temporarily unavailable.</p>
          )}
        </section>

        <div className="dispatch-return">
          <Link className="return-button" href="/">
            ← Return to the Chronicle front page
          </Link>
          <a href="#top">Return to the Masthead ↑</a>
        </div>
      </div>
    </main>
  );
}
