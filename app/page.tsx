import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Union & Confederacy Chronicle",
  description: "A field journal of a GMT Games U.S. Civil War campaign.",
};

const dispatches = [
  {
    id: "western",
    eyebrow: "Western Theater",
    date: "Summer, 1861 · Turn One",
    title: "The Rivers Will Decide It",
    dek: "Washington places its first great wager upon the Cumberland and Tennessee, while Richmond trusts distance, weather, and the loyalty of Kentucky.",
    body: [
      "The opening hands made the temper of both governments plain. The Union gathered strength at Cairo and Cincinnati, intending to turn the great waterways into blue highways. Confederate councils answered by reinforcing Nashville and the Mississippi line rather than seeking an early, theatrical battle.",
      "Political control proved the day's true currency. Missouri wavered, Kentucky watched, and every rail junction suddenly seemed worth a brigade. No capital has fallen, yet the geography of the war has already begun to narrow the choices of both presidents.",
    ],
    note: "Player's note: I resisted a premature drive on Richmond. The western river net looks slower on the first turn—and much more dangerous by the third.",
  },
  {
    id: "manassas",
    eyebrow: "Dispatch From Virginia",
    date: "Summer, 1861 · Action Round Four",
    title: "Smoke Above Manassas",
    dek: "A sharp engagement checks Federal enthusiasm outside Washington; neither army possesses the strength for a decision.",
    body: [
      "The Army of Northeastern Virginia crossed with confidence and retired in disorder. Johnston's gray columns arrived at the needed hour, but attrition and the threatened Federal reinforcement at Washington kept the victors from pursuit.",
      "The result is less a triumph than a warning. The Confederacy holds the field; the Union still holds the men, rails, and time. Richmond's correspondents celebrate. This editor merely records that both armies now know the cost of a bad die differential.",
    ],
    note: "Rules desk: Battle resolved on the CRT after interception and leader modifiers. The result shifted Strategic Will, but did not break the Union position.",
  },
];

const ledger = [
  ["Turn", "Summer 1861"],
  ["Action Cycle", "4 of 5"],
  ["Union SW", "93 (-7)"],
  ["Confederate SW", "97 (-3)"],
  ["Blockade", "Level 0"],
  ["Emancipation", "Not yet possible"],
];

export default function Home() {
  return (
    <main className="page-shell">
      <div className="newspaper">
        <header className="masthead" id="top">
          <div className="utility-line">
            <span>Vol. I · No. 1</span>
            <span>Price: One Campaign Point</span>
            <span>Tuesday, July 21, 2026</span>
          </div>
          <p className="kicker">A Campaign Journal of GMT Games&apos; The U.S. Civil War</p>
          <h1><span>The</span> Union &amp; Confederacy <span>Chronicle</span></h1>
          <div className="motto"><span>✦</span> All the News the Telegraph Can Carry <span>✦</span></div>
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
              <li><b>Washington.</b> New levies ordered to the western forts.</li>
              <li><b>Richmond.</b> Cabinet reports confidence in Virginia.</li>
              <li><b>Cairo.</b> Gunboats expected before the next action round.</li>
              <li><b>St. Louis.</b> Missouri remains the object of both armies.</li>
            </ul>
            <div className="ornament">❦</div>
            <h3>Editor&apos;s Purpose</h3>
            <p>This journal records decisions, reverses, rules questions, and the small stories that emerge during a complete campaign.</p>
          </aside>

          <article className="lead-story">
            <p className="section-label">Extra! · First Campaign Report</p>
            <h2>War Erupts Across the Republic</h2>
            <p className="subhead">Lincoln Calls for Volunteers; Richmond Marshals Its Forces—A Long Contest Is Feared</p>
            <p className="byline">By the Editor, Special Correspondent at the Gaming Table</p>
            <div className="story-columns">
              <p className="dropcap">Hostilities have commenced. From the white hexes of the loyal states to the green country of the seceded South, counters are assembling and rail lines hum with movement. The first Strategy Cards have been dealt; every hand contains a promise and a trap.</p>
              <p>For this campaign I command both governments in turn, preserving each side&apos;s intentions in a sealed notebook. The Union must use its greater strength without squandering its Strategic Will. The Confederacy must make space and time do the work that industry cannot.</p>
              <p>The map, reproduced from the digital play module, immediately tells the central story: rivers enter the Confederacy like roads; the Appalachian wall divides theaters; Washington and Richmond sit dangerously near one another. Every march is therefore political as well as military.</p>
            </div>
          </article>

          <aside className="ledger" id="ledger">
            <p className="section-label">Official Returns</p>
            <h2>The War Ledger</h2>
            <div className="score-seals" aria-label="Strategic will scores">
              <div><span>U.S.</span><strong>93</strong></div>
              <div><span>C.S.</span><strong>97</strong></div>
            </div>
            <table><tbody>{ledger.map(([label, value]) => <tr key={label}><th>{label}</th><td>{value}</td></tr>)}</tbody></table>
            <p className="smallprint">Illustrative opening position. Replace these values after each session in <code>app/page.tsx</code>.</p>
          </aside>
        </section>

        <section className="map-room" id="map-room">
          <div className="section-rule"><span>The Map Room</span></div>
          <div className="map-frame">
            <img src="https://raw.githubusercontent.com/trutyjoh/The-Union-Confederacy-Chronicle/main/public/us-civil-war-map.jpg" alt="Map board for GMT Games' The U.S. Civil War, showing the Eastern and Western theaters" />
          </div>
          <p className="caption">The national theater of operations. Map artwork from the locally available U.S. Civil War digital game material; used here as a campaign reference.</p>
        </section>

        <section className="dispatch-section">
          <div className="section-rule"><span>Campaign Dispatches</span></div>
          <div className="dispatch-grid">
            {dispatches.map((post) => (
              <article className="dispatch" id={post.id} key={post.id}>
                <p className="section-label">{post.eyebrow}</p>
                <h2>{post.title}</h2>
                <p className="post-date">{post.date}</p>
                <p className="subhead">{post.dek}</p>
                <div className="body-copy">{post.body.map((p) => <p key={p}>{p}</p>)}</div>
                <blockquote>{post.note}</blockquote>
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
            <li><a href="#latest"><span>No. 1</span> Summer 1861: The Guns Speak</a></li>
            <li><span><span>No. 2</span> Summer 1861: Rivers &amp; Rails</span></li>
            <li><span><span>No. 3</span> Fall 1861: Forthcoming</span></li>
          </ol>
        </section>

        <footer>
          <p>Printed for the private campaign record · One game, two governments, innumerable decisions</p>
          <a href="#top">Return to the Masthead ↑</a>
        </footer>
      </div>
    </main>
  );
}
