# Research: Auto-publish to Bluesky on New Blog Post

## Goal

When a new blog post is pushed to `main` on GitHub, automatically publish an
announcement post to Bluesky via AT Protocol.

---

## Current State

### Deployment Pipeline

`.github/workflows/deploy.yml` triggers on `push` to `main` and runs:

1. Checkout → pnpm install → `pnpm run build` → `wrangler deploy`

Single job named `deploy`. No post-deploy notification step exists today.

### Bluesky Integration

`@atproto/api ^0.18.21` is already a production dependency. `src/lib/bluesky.ts`
shows the auth pattern:

```ts
const session = new CredentialSession(new URL("https://bsky.social"))
await session.login({ identifier: BLUESKY_HANDLE, password: BLUESKY_APP_PASSWORD })
const agent = new Agent(session)
```

Credentials come from environment variables (`BLUESKY_HANDLE`,
`BLUESKY_APP_PASSWORD`). In production these are Cloudflare Workers secrets. They
are **not** currently stored in GitHub Actions secrets.

### Content Schema

Frontmatter fields (`src/content.config.ts`):

- `title` (required)
- `date` (required, ISO date)
- `author` (optional)
- `summary` (optional)
- `redirect_link` (optional URL — link posts pointing to external content)

### URL Derivation

Filename: `YYYY-MM-DD-slug.md`
URL: `https://blog.iamjkahn.com/posts/YYYY/MM/slug`

The day component is stripped. Example:
`2025-09-11-seamlessly-connect-stripe-events-to-frontend.md`
→ `/posts/2025/09/seamlessly-connect-stripe-events-to-frontend`

---

## Implementation Options

### Option A: New GitHub Actions job after `deploy`

Add a second job (`announce`) that `needs: deploy`. It:

1. Detects newly-added `.md` files in `src/content/blog/` via `git diff`
2. Parses their YAML frontmatter
3. Calls AT Protocol to post

**Pros:** Clean separation; only runs if deploy succeeded; no infra changes.
**Cons:** Needs `BLUESKY_HANDLE` + `BLUESKY_APP_PASSWORD` added to GitHub Actions
secrets (these already exist in Cloudflare Workers secrets but must be copied over).

### Option B: Step appended to existing `deploy` job

Same logic as A but as additional steps at the end of the `deploy` job rather than
a separate job.

**Pros:** Slightly simpler YAML; reuses already-installed pnpm/node context.
**Cons:** Announce runs on build/deploy failures if not gated; slightly messier
separation of concerns.

### Option C: Cloudflare Worker webhook triggered by GitHub

A separate Worker endpoint receives a GitHub webhook payload, checks for new posts,
and posts to Bluesky.

**Pros:** No GitHub secrets needed for Bluesky creds.
**Cons:** Significant new infrastructure; overkill.

**Recommendation: Option A** — separate job keeps concerns clean, only fires after
a successful deploy, and is easy to maintain.

---

## Detecting New Posts

Git diff in the workflow:

```bash
git diff --name-only --diff-filter=A ${{ github.event.before }} ${{ github.sha }} \
  -- 'src/content/blog/*.md'
```

- `--diff-filter=A` → only Added files (not modified/renamed)
- Compares the before-push SHA to the current SHA

Edge cases:

- **First push ever** (`github.event.before` is all-zeros): need to guard against
  this; treat as no new posts or compare against an empty tree.
- **Multiple posts in one commit**: script handles each file independently.
- **`workflow_dispatch`**: no `before` SHA; skip announce or require manual input.

---

## Posting to Bluesky

`agent.post()` creates a new post. For a rich announcement with a link card we use
an **external embed**:

```ts
await agent.post({
  text: `New post: "${title}"\n\n${summary ?? ""}`,
  embed: {
    $type: "app.bsky.embed.external",
    external: {
      uri: postUrl,
      title,
      description: summary ?? "",
    },
  },
  langs: ["en"],
})
```

For link posts (`redirect_link` set), the embed URI would be the external URL
rather than the blog's own post page — or we could link to both.

Character limit on Bluesky is 300 graphemes. The text needs to fit. A safe template:

```
New post: "{title}"

{summary — truncated to fit}

{url}
```

We can omit the URL from the `text` if it's already in the embed card, keeping the
text clean.

---

## Frontmatter Parsing

No `gray-matter` in the project. Options:

1. **Add `gray-matter`** (battle-tested, well-typed) — small dev dependency.
2. **Use Node's built-in** with a simple regex to extract the YAML block and
   `JSON.parse` / manual parse — fragile.
3. **Use `js-yaml`** — another common choice, but adds a dep.

`gray-matter` is the cleanest choice. Alternatively, since the frontmatter fields
we need (`title`, `summary`, `redirect_link`) are simple strings, a targeted regex
extraction is viable and avoids a new dependency.

---

## Script Location

A self-contained Node.js script at `scripts/announce-post.mjs`. It:

- Accepts a list of new `.md` file paths (from the workflow via args or stdin)
- Parses frontmatter
- Derives the post URL
- Authenticates with AT Protocol
- Posts to Bluesky

The workflow passes the detected file list to the script.

---

## Secrets Required in GitHub Actions

| Secret name            | Value                               |
| ---------------------- | ----------------------------------- |
| `BLUESKY_HANDLE`       | `iamjkahn.com` (same as Cloudflare) |
| `BLUESKY_APP_PASSWORD` | Bluesky app password (same as CF)   |

These must be added to the repo's GitHub Actions secrets (Settings → Secrets →
Actions). They already exist as Cloudflare Workers secrets.

---

## Open Questions for User

1. **Post text format** — what should the Bluesky message look like? E.g.:
   JAK > `Check out my new post: "{title}" — {url}`

2. **Link posts** (`redirect_link` set) — should these be announced differently?
   JAK > No, I would like the embed card to link through the blog which will redirect to the external link. I would like to get tracking in my analytics that someone linked through to the post on another site.

3. **`workflow_dispatch` behavior** — if the workflow is triggered manually (not by
   a push), should it skip the announce step or allow manual override?
   JAK > Skip the announce step

4. **`gray-matter` dependency** — okay to add, or prefer a regex approach to keep
   deps lean?
   JAK > Yes, add gray-matter back in
