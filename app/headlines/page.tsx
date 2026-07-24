import { stegaClean } from "@sanity/client/stega";
import type { Metadata } from "next";
import Link from "next/link";
import { getChronicleContent } from "@/lib/chronicle";

export const metadata: Metadata = {
  title: "Headline Archive | The Union & Confederacy Chronicle",
  description: "Past front-page lead stories filed for posterity.",
};

export default async function HeadlineArchivePage() {
  const { settings, leadStories } = await getChronicleContent();
  const archivedStories = leadStories.filter(
    (story) => stegaClean(story.status) === "archived",
  );
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
            <Link href="/#latest">← Return to the Front Page</Link>
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
            <span>✦</span> Filed for Posterity <span>✦</span>
          </div>
        </header>

        <section className="headline-archive-page" aria-labelledby="headline-archive-title">
          <p className="section-label">Past Front Pages</p>
          <h2 id="headline-archive-title">Headline Archive</h2>
          <p className="headline-archive-page__intro">
            Lead stories removed from the current edition remain available here
            in newest-to-oldest order.
          </p>
          {archivedStories.length ? (
            <ol>
              {archivedStories.map((story) => (
                <li key={story._id}>
                  <p className="section-label">{story.label}</p>
                  <h3>{story.title}</h3>
                  <p>{story.subheadline}</p>
                  <p className="byline">{story.byline}</p>
                  <Link href={`/headlines/${encodeURIComponent(stegaClean(story.slug))}`}>
                    Read Archived Story <span aria-hidden="true">→</span>
                  </Link>
                </li>
              ))}
            </ol>
          ) : (
            <p className="headline-archive-page__empty">
              No headline stories have yet been placed in the archive.
            </p>
          )}
        </section>

        <div className="dispatch-return">
          <Link className="return-button" href="/#latest">
            ← Return to the Front Page
          </Link>
          <a href="#top">Return to the Masthead ↑</a>
        </div>
      </div>
    </main>
  );
}
