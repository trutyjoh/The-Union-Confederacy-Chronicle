import type { StructureBuilder, StructureResolver } from "sanity/structure";

function dispatchList(
  S: StructureBuilder,
  title: string,
  filter: string,
) {
  return S.documentList()
    .title(title)
    .schemaType("campaignDispatch")
    .filter(filter);
}

function commentList(
  S: StructureBuilder,
  title: string,
  filter: string,
) {
  return S.documentList()
    .title(title)
    .schemaType("dispatchComment")
    .filter(filter)
    .defaultOrdering([{ field: "submittedAt", direction: "desc" }]);
}

function mapList(
  S: StructureBuilder,
  title: string,
  filter: string,
) {
  return S.documentList()
    .title(title)
    .schemaType("campaignMap")
    .filter(filter)
    .defaultOrdering([{ field: "sortOrder", direction: "desc" }]);
}

function headlineList(
  S: StructureBuilder,
  title: string,
  filter: string,
) {
  return S.documentList()
    .title(title)
    .schemaType("leadStory")
    .filter(filter)
    .defaultOrdering([{ field: "sortOrder", direction: "desc" }]);
}

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Chronicle Content")
    .items([
      S.listItem()
        .title("Newspaper Settings")
        .child(
          S.document()
            .schemaType("siteSettings")
            .documentId("siteSettings")
            .title("Newspaper Settings"),
        ),
      S.listItem()
        .title("Current Headline")
        .child(
          headlineList(
            S,
            "Current Headline",
            '_type == "leadStory" && coalesce(status, "current") == "current"',
          ),
        ),
      S.listItem()
        .title("Headline Archive")
        .child(
          headlineList(
            S,
            "Headline Archive",
            '_type == "leadStory" && status == "archived"',
          ),
        ),
      S.listItem()
        .title("All Headline Stories")
        .child(
          headlineList(S, "All Headline Stories", '_type == "leadStory"'),
        ),
      S.divider(),
      S.listItem()
        .title("Current Map")
        .child(
          mapList(
            S,
            "Current Map",
            '_type == "campaignMap" && status == "current"',
          ),
        ),
      S.listItem()
        .title("Map Room Library")
        .child(
          mapList(
            S,
            "Map Room Library",
            '_type == "campaignMap" && status == "archived"',
          ),
        ),
      S.listItem()
        .title("All Campaign Maps")
        .child(
          mapList(S, "All Campaign Maps", '_type == "campaignMap"'),
        ),
      S.divider(),
      S.listItem()
        .title("Current Dispatches")
        .child(
          dispatchList(
            S,
            "Current Dispatches",
            '_type == "campaignDispatch" && coalesce(status, "current") == "current"',
          ),
        ),
      S.listItem()
        .title("Working Drafts")
        .child(
          dispatchList(
            S,
            "Working Drafts",
            '_type == "campaignDispatch" && status == "working"',
          ),
        ),
      S.listItem()
        .title("Dispatch Archive")
        .child(
          dispatchList(
            S,
            "Dispatch Archive",
            '_type == "campaignDispatch" && status == "archived"',
          ),
        ),
      S.listItem()
        .title("All Dispatches")
        .child(
          dispatchList(S, "All Dispatches", '_type == "campaignDispatch"'),
        ),
      S.divider(),
      S.listItem()
        .id("pendingLetters")
        .title("Pending Reader Comments")
        .child(
          commentList(
            S,
            "Pending Reader Comments",
            '_type == "dispatchComment" && coalesce(status, "pending") == "pending"',
          ),
        ),
      S.listItem()
        .title("Approved Reader Comments")
        .child(
          commentList(
            S,
            "Approved Reader Comments",
            '_type == "dispatchComment" && status == "approved"',
          ),
        ),
      S.listItem()
        .title("Rejected & Archived Comments")
        .child(
          commentList(
            S,
            "Rejected & Archived Comments",
            '_type == "dispatchComment" && status in ["rejected", "archived"]',
          ),
        ),
      S.listItem()
        .title("All Reader Comments")
        .child(
          commentList(
            S,
            "All Reader Comments",
            '_type == "dispatchComment"',
          ),
        ),
    ]);
