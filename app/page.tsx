import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "sanity";
import { getChronicleContent, type RichBody } from "@/lib/chronicle";

function StoryBody({ body, className }: { body: RichBody; className: string }) {
  const isPlainText = body.every((block) => typeof block === "string");

  return (
    <div className={className}>
      {isPlainText ? (
        (body as string[]).map((paragraph) => <p key={paragraph}>{paragraph}</p>)
      ) : (
        <PortableText value={body as PortableTextBlock[]} />
      )}
    </div>
  );
}

export default async function Home() {
  const { settings, dispatches } = await getChronicleContent();

  return (
    <main className="page-shell">
      <div className="newspaper">
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
                <li key={`${item.location}-${item.text}`}>
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
                  <tr key={label}>
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
            <img src={settings.mapReferenceUrl} alt={settings.mapAlt} />
          </div>
          <p className="caption">{settings.mapCaption}</p>
        </section>

        <section className="dispatch-section">
          <div className="section-rule">
            <span>Campaign Dispatches</span>
          </div>
          <div className="dispatch-grid">
            {dispatches.map((post) => (
              <article className="dispatch" id={post.slug} key={post.slug}>
                <p className="section-label">{post.eyebrow}</p>
                <h2>{post.title}</h2>
                <p className="post-date">{post.campaignDate}</p>
                <p className="subhead">{post.dek}</p>
                <StoryBody body={post.body} className="body-copy" />
                {post.note ? <blockquote>{post.note}</blockquote> : null}
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
              <li key={`${entry.number}-${entry.title}`}>
                {entry.anchor ? (
                  <a href={`#${entry.anchor}`}>
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
