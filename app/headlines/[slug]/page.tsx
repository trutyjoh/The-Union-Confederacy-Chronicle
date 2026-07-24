import { stegaClean } from "@sanity/client/stega";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StoryBody } from "@/components/StoryContent";
import { getChronicleContent, getLeadStory } from "@/lib/chronicle";

type HeadlinePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: HeadlinePageProps): Promise<Metadata> {
  const { slug } = await params;
  const story = await getLeadStory(slug, { stega: false });

  if (!story) return { title: "Headline Not Found" };

  return {
    title: `${story.title} | The Union & Confederacy Chronicle`,
    description: story.subheadline,
  };
}

export default async function HeadlinePage({ params }: HeadlinePageProps) {
  const { slug } = await params;
  const [story, { settings }] = await Promise.all([
    getLeadStory(slug),
    getChronicleContent(),
  ]);

  if (!story) notFound();

  const isArchived = stegaClean(story.status) === "archived";
  const returnHref = isArchived ? "/headlines" : "/#latest";
  const returnLabel = isArchived
    ? "Return to Headline Archive"
    : "Return to the Front Page";
  const typographyClasses = [
    `type-masthead-${stegaClean(settings.mastheadTypeface || "fell")}`,
    `type-headline-${stegaClean(settings.headlineTypeface || "old-standard")}`,
    `type-body-${stegaClean(settings.bodyTypeface || "caslon")}`,
  ].join(" ");

  return (
    <main className="page-shell">
      <div className={`newspaper headline-edition ${typographyClasses}`}>
        <header className="masthead dispatch-masthead" id="top">
          <div className="utility-line">
            <span>{settings.volume}</span>
            <Link href={returnHref}>← {returnLabel}</Link>
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
            <span>✦</span> {isArchived ? "Headline Archive" : "Lead Story"} <span>✦</span>
          </div>
        </header>

        <article className="headline-detail">
          <p className="section-label">{story.label}</p>
          <h2>{story.title}</h2>
          <p className="subhead">{story.subheadline}</p>
          <p className="byline">{story.byline}</p>
          <StoryBody body={story.body} className="headline-full-copy" />
        </article>

        <div className="dispatch-return">
          <Link className="return-button" href={returnHref}>
            ← {returnLabel}
          </Link>
          <a href="#top">Return to the Masthead ↑</a>
        </div>
      </div>
    </main>
  );
}
