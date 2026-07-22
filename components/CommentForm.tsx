"use client";

import { useState, type FormEvent } from "react";

type SubmissionState =
  | { kind: "idle"; message: "" }
  | { kind: "submitting"; message: string }
  | { kind: "success"; message: string }
  | { kind: "error"; message: string };

export function CommentForm({
  dispatchId,
  dispatchTitle,
}: {
  dispatchId: string;
  dispatchTitle: string;
}) {
  const [startedAt, setStartedAt] = useState(() => Date.now());
  const [state, setState] = useState<SubmissionState>({ kind: "idle", message: "" });

  async function submitComment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const fields = new FormData(form);

    setState({ kind: "submitting", message: "Sending your letter…" });

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          dispatchId,
          authorName: fields.get("authorName"),
          message: fields.get("message"),
          company: fields.get("company"),
          startedAt,
        }),
      });
      const result = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(result.message || "The letter could not be sent.");
      }

      form.reset();
      setStartedAt(Date.now());
      setState({
        kind: "success",
        message: result.message || "Thank you. Your letter is awaiting editorial review.",
      });
    } catch (error) {
      setState({
        kind: "error",
        message: error instanceof Error ? error.message : "The letter could not be sent.",
      });
    }
  }

  return (
    <form className="comment-form" onSubmit={submitComment}>
      <p className="comment-form__intro">
        Write to the editor concerning “{dispatchTitle}.” Letters are reviewed before publication.
      </p>
      <label>
        Your name
        <input
          name="authorName"
          type="text"
          minLength={2}
          maxLength={60}
          autoComplete="name"
          required
        />
      </label>
      <label>
        Your letter
        <textarea name="message" minLength={10} maxLength={1500} rows={5} required />
      </label>
      <label className="comment-form__trap" aria-hidden="true">
        Company
        <input name="company" type="text" tabIndex={-1} autoComplete="off" />
      </label>
      <div className="comment-form__footer">
        <button type="submit" disabled={state.kind === "submitting"}>
          {state.kind === "submitting" ? "Sending…" : "Submit for Review"}
        </button>
        <p className={`comment-form__status comment-form__status--${state.kind}`} aria-live="polite">
          {state.message}
        </p>
      </div>
    </form>
  );
}
