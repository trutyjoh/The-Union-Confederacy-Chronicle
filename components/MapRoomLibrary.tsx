"use client";

/* The legacy fallback map may be hosted outside Next.js image allowlists. */
/* eslint-disable @next/next/no-img-element */

import { stegaClean } from "@sanity/client/stega";
import { createImageUrlBuilder } from "@sanity/image-url";
import { useState } from "react";
import type { CampaignMap } from "@/lib/chronicle";
import { dataset, projectId } from "@/lib/sanity-config";

const imageBuilder = createImageUrlBuilder({ projectId, dataset });

function mapImageUrl(map: CampaignMap, width: number, height?: number) {
  if (map.image?.asset) {
    const builder = imageBuilder.image(map.image).width(width).auto("format");
    return height ? builder.height(height).fit("crop").url() : builder.fit("max").url();
  }

  return stegaClean(map.imageUrl || "");
}

export function MapRoomLibrary({
  currentMap,
  archivedMaps,
}: {
  currentMap: CampaignMap;
  archivedMaps: CampaignMap[];
}) {
  const [selectedId, setSelectedId] = useState(currentMap._id);
  const selectedMap =
    [currentMap, ...archivedMaps].find((map) => map._id === selectedId) || currentMap;
  const viewingArchive = selectedMap._id !== currentMap._id;

  return (
    <>
      <div className="map-room__display" aria-live="polite">
        <div className="map-room__heading">
          <div>
            <p className="section-label">{viewingArchive ? "From the Map Library" : "Current Campaign Position"}</p>
            <h3>{selectedMap.title}</h3>
            <p className="map-room__date">{selectedMap.campaignDate}</p>
          </div>
          {viewingArchive ? (
            <button className="return-button map-return" type="button" onClick={() => setSelectedId(currentMap._id)}>
              ← Return to Current Map
            </button>
          ) : null}
        </div>
        <div className="map-frame">
          <img src={mapImageUrl(selectedMap, 1800)} alt={selectedMap.image?.alt || selectedMap.alt || ""} />
        </div>
        <p className="caption">{selectedMap.image?.caption || selectedMap.caption}</p>
      </div>

      <section className="map-library" aria-labelledby="map-library-heading">
        <div className="map-library__heading">
          <p className="section-label">Positions Filed for Reference</p>
          <h3 id="map-library-heading">Map Room Library</h3>
          <p>Select an archived position to display it above. Maps are filed newest to oldest.</p>
        </div>
        {archivedMaps.length ? (
          <div className="map-library__grid">
            {archivedMaps.map((map) => {
              const selected = map._id === selectedMap._id;
              return (
                <button
                  className={`map-card${selected ? " map-card--selected" : ""}`}
                  type="button"
                  aria-pressed={selected}
                  key={map._id}
                  onClick={() => setSelectedId(map._id)}
                >
                  <img src={mapImageUrl(map, 520, 260)} alt="" />
                  <span className="map-card__date">{map.campaignDate}</span>
                  <strong>{map.title}</strong>
                  <span>{map.image?.caption || map.caption || "View this archived campaign position."}</span>
                </button>
              );
            })}
          </div>
        ) : (
          <p className="map-library__empty">No archived maps have yet been added to the library.</p>
        )}
      </section>
    </>
  );
}
