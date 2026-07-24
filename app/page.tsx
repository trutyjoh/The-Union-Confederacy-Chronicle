import { stegaClean } from "@sanity/client/stega";
import Link from "next/link";
import { MapRoomLibrary } from "@/components/MapRoomLibrary";
import { DispatchImage, excerptStoryBody, StoryBody } from "@/components/StoryContent";
import {
  getChronicleContent,
  getLegacyLeadStory,
  type CampaignMap,
} from "@/lib/chronicle";

export default async function Home() {
  const {
    settings,
    dispatches,
    archivedDispatches,
    campaignMaps,
    leadStories,
  } = await getChronicleContent();
  const telegraphicDispatches = dispatches.slice(-5).reverse();
  const managedLeadStory = leadStories.find(
    (story) => stegaClean(story.status) === "current",
  );
  const leadStory =
    managedLeadStory || (leadStories.length ? null : getLegacyLeadStory(settings));
  const managedCurrentMap = campaignMaps.find((map) => stegaClean(map.status) === "current");
  const currentMap: CampaignMap = managedCurrentMap || {
    _id: "newspaper-settings-current-map",
    status: "current",
    title: "Current Campaign Map",
    campaignDate: settings.ledger.find((entry) => stegaClean(entry.label) === "Turn")?.value || settings.issueDate,
    imageUrl: stegaClean(settings.mapReferenceUrl),
    alt: settings.mapAlt,
    caption: settings.mapCaption,
    unionHighlights: settings.mapUnionHighlights,
    confederateHighlights: settings.mapConfederateHighlights,
    sortOrder: Number.MAX_SAFE_INTEGER,
  };
  const archivedMaps = campaignMaps.filter((map) => stegaClean(map.status) === "archived");
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
          <aside className="side-column" id="telegraphic-summary">
            <p className="section-label">This Edition</p>
            <h2>Telegraphic Summary</h2>
            <ol className="telegrams dispatch-telegrams">
              {telegraphicDispatches.map((post) => (
                <li key={post._id || stegaClean(post.slug)}>
                  <Link href={`/dispatches/${encodeURIComponent(stegaClean(post.slug))}?from=telegraphic-summary`}>
                    <span className="telegram-dateline">{post.eyebrow} · {post.campaignDate}</span>
                    <strong>{post.title}</strong>
                    <span className="telegram-summary">{post.dek}</span>
                    <span className="telegram-read">Read dispatch →</span>
                  </Link>
                </li>
              ))}
            </ol>
            <div className="ornament">❦</div>
            <h3>Editor&apos;s Purpose</h3>
            <p>{settings.editorPurpose}</p>
          </aside>

          <article className="lead-story lead-story--headline">
            {leadStory ? (
              <>
                <p className="section-label">{leadStory.label}</p>
                <h2>{leadStory.title}</h2>
                <p className="subhead">{leadStory.subheadline}</p>
                <p className="byline">{leadStory.byline}</p>
                <StoryBody
                  body={excerptStoryBody(leadStory.body, 2)}
                  className="headline-excerpt"
                />
                <div className="headline-actions">
                  <Link
                    className="headline-continue"
                    href={`/headlines/${encodeURIComponent(stegaClean(leadStory.slug))}`}
                  >
                    Continue to Read <span aria-hidden="true">→</span>
                  </Link>
                  <Link href="/headlines">Headline Archive</Link>
                </div>
              </>
            ) : (
              <>
                <p className="section-label">Awaiting the Next Edition</p>
                <h2>The Editor Prepares a New Lead Story</h2>
                <p className="subhead">
                  The previous lead story has been filed in the archive.
                </p>
                <p className="headline-placeholder">
                  A new Current Lead Story may be selected in the Sanity editor.
                </p>
                <div className="headline-actions">
                  <Link href="/headlines">Read the Lead Story Archive</Link>
                </div>
              </>
            )}
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
            <section className="ledger-archive" id="archive" aria-labelledby="campaign-archive-heading">
              <p className="section-label">Filed for Posterity</p>
              <h3 id="campaign-archive-heading">Campaign Archive</h3>
              {archivedDispatches.length ? (
                <ol>
                  {archivedDispatches.map((post) => (
                    <li key={post._id || stegaClean(post.slug)}>
                      <Link href={`/dispatches/${encodeURIComponent(stegaClean(post.slug))}`}>
                        <span>{post.campaignDate}</span>
                        <strong>{post.title}</strong>
                      </Link>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="ledger-archive__empty">No dispatches have yet been filed in the archive.</p>
              )}
            </section>
          </aside>
        </section>

        <section className="map-room" id="map-room">
          <div className="section-rule">
            <span>The Map Room</span>
          </div>
          <MapRoomLibrary currentMap={currentMap} archivedMaps={archivedMaps} />
        </section>

        <section className="dispatch-section">
          <div className="section-rule">
            <span>Campaign Dispatches</span>
          </div>
          <div className="dispatch-grid">
            {dispatches.map((post) => (
              <article className="dispatch dispatch-preview" id={stegaClean(post.slug)} key={post._id || stegaClean(post.slug)}>
                <p className="section-label">{post.eyebrow}</p>
                <h2>{post.title}</h2>
                <p className="post-date">{post.campaignDate}</p>
                <p className="subhead">{post.dek}</p>
                <DispatchImage value={post.featuredImage} featured />
                <StoryBody body={excerptStoryBody(post.body)} className="dispatch-excerpt" />
                <div className="dispatch-links" aria-label={`Links for ${stegaClean(post.title)}`}>
                  <Link href={`/dispatches/${encodeURIComponent(stegaClean(post.slug))}`}>
                    Continue Reading <span aria-hidden="true">→</span>
                  </Link>
                  <Link href={`/dispatches/${encodeURIComponent(stegaClean(post.slug))}#letters-to-editor`}>
                    Letters to the Editor
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <footer>
          <p>{settings.footerLine}</p>
          <div className="footer-links">
            <Link href="/studio">Open the Editor</Link>
            <a href="#top">Return to the Masthead ↑</a>
          </div>
        </footer>
      </div>
    </main>
  );
}
