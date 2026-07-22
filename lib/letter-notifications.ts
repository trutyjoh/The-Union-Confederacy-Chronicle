const DEFAULT_NOTIFICATION_RECIPIENT = "strifegames@gmail.com";
const DEFAULT_NOTIFICATION_SENDER =
  "The Union & Confederacy Chronicle <onboarding@resend.dev>";
const DEFAULT_SITE_URL = "https://the-union-confederacy-chronicle.vercel.app";

type LetterNotification = {
  commentId: string;
  authorName: string;
  message: string;
  dispatchTitle: string;
  dispatchSlug: string;
  submittedAt: string;
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function siteUrl() {
  try {
    return new URL(process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL);
  } catch {
    return new URL(DEFAULT_SITE_URL);
  }
}

export async function sendLetterNotification({
  commentId,
  authorName,
  message,
  dispatchTitle,
  dispatchSlug,
  submittedAt,
}: LetterNotification) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { sent: false, reason: "not-configured" as const };

  const baseUrl = siteUrl();
  const dispatchUrl = new URL(`/dispatches/${encodeURIComponent(dispatchSlug)}`, baseUrl);
  const moderationUrl = new URL("/studio/structure/pendingLetters", baseUrl);
  const recipient =
    process.env.LETTER_NOTIFICATION_TO || DEFAULT_NOTIFICATION_RECIPIENT;
  const sender = process.env.LETTER_NOTIFICATION_FROM || DEFAULT_NOTIFICATION_SENDER;
  const safeAuthor = escapeHtml(authorName);
  const safeMessage = escapeHtml(message).replaceAll("\n", "<br />");
  const safeDispatchTitle = escapeHtml(dispatchTitle);
  const formattedDate = new Date(submittedAt).toLocaleString("en-US", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "America/Chicago",
  });

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": `letter-notification-${commentId.replace(/^drafts\./, "")}`,
    },
    body: JSON.stringify({
      from: sender,
      to: [recipient],
      subject: `Letter to the Editor awaiting review — ${dispatchTitle}`,
      text: [
        "A new Letter to the Editor requires attention.",
        "",
        `Dispatch: ${dispatchTitle}`,
        `Reader: ${authorName}`,
        `Submitted: ${formattedDate}`,
        "",
        message,
        "",
        `Review pending letters: ${moderationUrl.toString()}`,
        `View the dispatch: ${dispatchUrl.toString()}`,
      ].join("\n"),
      html: `
        <div style="font-family: Georgia, 'Times New Roman', serif; color: #241b13; line-height: 1.5;">
          <p style="margin: 0 0 8px; text-transform: uppercase; letter-spacing: .12em; font: 700 11px Arial, sans-serif; color: #7b241c;">The Union &amp; Confederacy Chronicle</p>
          <h1 style="margin: 0 0 18px; font-size: 26px;">A Letter to the Editor Requires Attention</h1>
          <p><strong>Dispatch:</strong> ${safeDispatchTitle}<br />
          <strong>Reader:</strong> ${safeAuthor}<br />
          <strong>Submitted:</strong> ${escapeHtml(formattedDate)}</p>
          <div style="margin: 20px 0; padding: 16px; border: 1px solid #80684e; background: #f0e2bd;">
            ${safeMessage}
          </div>
          <p><a href="${moderationUrl.toString()}">Review pending letters in Sanity Studio</a></p>
          <p><a href="${dispatchUrl.toString()}">View the associated dispatch</a></p>
        </div>
      `,
    }),
  });

  if (!response.ok) {
    throw new Error(`Email service returned status ${response.status}.`);
  }

  return { sent: true as const };
}
