# Plan: Auto-publish to Bluesky on New Blog Post

## Decisions

- **Post text:** `Check out my new post: "{title}" — {url}`
- **Link posts:** Embed card always links to the blog post URL (redirects to external); no special handling
- **`workflow_dispatch`:** Skip the announce step entirely (no `before` SHA available)
- **Frontmatter parsing:** Add `gray-matter` as a dev dependency

---

## Files to Create / Modify

| File | Action |
|------|--------|
| `scripts/announce-post.mjs` | **Create** — Node.js script that parses frontmatter and posts to Bluesky |
| `.github/workflows/deploy.yml` | **Modify** — add `announce` job that `needs: deploy` |
| `package.json` | **Modify** — add `gray-matter` to devDependencies |

---

## Tasks

### 1. Install `gray-matter`

```
pnpm add -D gray-matter
```

### 2. Create `scripts/announce-post.mjs`

The script:

1. Reads file paths from `process.argv` (passed by the workflow)
2. For each file, uses `gray-matter` to parse frontmatter (`title`, `summary`, `redirect_link`)
3. Derives the blog URL from the filename:
   - `src/content/blog/YYYY-MM-DD-slug.md` → `https://blog.iamjkahn.com/posts/YYYY/MM/slug`
4. Authenticates with AT Protocol using `BLUESKY_HANDLE` + `BLUESKY_APP_PASSWORD` env vars
5. Calls `agent.post()` with:
   - `text`: `Check out my new post: "{title}"`
   - `embed`: `app.bsky.embed.external` with `uri` = blog post URL, `title`, `description` = `summary ?? ""`
6. Logs success/failure per post; exits with code 1 on any error

The script reuses `@atproto/api` (already installed) — no new runtime dependencies.

### 3. Modify `.github/workflows/deploy.yml`

Add a second job `announce` after `deploy`:

```yaml
announce:
  needs: deploy
  runs-on: ubuntu-latest
  if: github.event_name == 'push'   # skip workflow_dispatch
  permissions:
    contents: read
  steps:
    - uses: actions/checkout@v4
      with:
        fetch-depth: 2              # need parent commit for diff

    - uses: pnpm/action-setup@v4
      with:
        version: 10

    - uses: actions/setup-node@v4
      with:
        node-version: "22"
        cache: "pnpm"

    - run: pnpm install

    - name: Detect new posts
      id: diff
      run: |
        NEW=$(git diff --name-only --diff-filter=A \
          ${{ github.event.before }} ${{ github.sha }} \
          -- 'src/content/blog/*.md')
        echo "files=$NEW" >> $GITHUB_OUTPUT

    - name: Announce on Bluesky
      if: steps.diff.outputs.files != ''
      run: node scripts/announce-post.mjs ${{ steps.diff.outputs.files }}
      env:
        BLUESKY_HANDLE: ${{ secrets.BLUESKY_HANDLE }}
        BLUESKY_APP_PASSWORD: ${{ secrets.BLUESKY_APP_PASSWORD }}
```

Edge case: if `github.event.before` is the null SHA (`0000000000000000000000000000000000000000`, first push to branch), `git diff` returns an error. The Detect step will guard with a check and output empty files in that case.

### 4. Add GitHub Actions secrets

Manual step (done in GitHub UI):
- `BLUESKY_HANDLE` → `iamjkahn.com`
- `BLUESKY_APP_PASSWORD` → same app password used in Cloudflare Workers secrets

---

## Out of Scope

- Announcing modified/deleted posts
- Open Graph image in the embed card (requires fetching the page; not worth it)
- Retries on Bluesky API failure (GitHub Actions can be re-run manually)
