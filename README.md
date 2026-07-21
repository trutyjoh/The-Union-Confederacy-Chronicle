# The Union & Confederacy Chronicle

An American Civil War newspaper-style campaign journal for GMT Games' *The U.S. Civil War*.

## Edit in Cursor

- Open this repository as a folder in Cursor.
- Edit campaign dispatches, scores, archive entries, and other page content in `app/page.tsx`.
- Edit the newspaper layout, typography, colors, and responsive rules in `app/globals.css`.
- Replace or update game imagery in `public/`.

## Run locally

```bash
pnpm install
pnpm dev
```

Then open `http://localhost:3000`.

## Production build

```bash
pnpm build
pnpm start
```

The standard scripts use Next.js for GitHub/Vercel deployment. The `sites:*` scripts retain compatibility with the Codex Sites build.
