# Poetry Cloud (GitHub Pages + Installable App)

This project gives you:

- A **public poetry app** where readers can view and search your poems.
- An **installable PWA** (works like an app on mobile/desktop).
- An **admin upload form** that lets only you push new poems to your GitHub repository through the GitHub API.

---

## 1) What is included

- `index.html` — app layout + admin dialog.
- `styles.css` — UI styles.
- `app.js` — poem loading, search, admin upload via GitHub API, install prompt.
- `data/poems.json` — your poem database.
- `manifest.webmanifest` + `service-worker.js` — installable/offline PWA behavior.
- `icons/` — app icons for installation.

---

## 2) Step-by-step: run smoothly on GitHub

## Step A — Create/prepare your repository

1. Create a GitHub repository (or use this one).
2. Make sure these files are in your repository root:
   - `index.html`
   - `app.js`
   - `styles.css`
   - `manifest.webmanifest`
   - `service-worker.js`
   - `data/poems.json`
   - `icons/icon-192.svg`
   - `icons/icon-512.svg`

## Step B — Configure your GitHub identity in the app

Open `app.js` and replace these placeholders in `DEFAULT_SOURCE`:

```js
owner: "YOUR_GITHUB_USERNAME",
repo: "YOUR_REPO_NAME",
```

Keep `branch: "main"` and `path: "data/poems.json"` unless your branch/path differs.

Commit and push this change.

## Step C — Enable GitHub Pages

1. Go to **Repository → Settings → Pages**.
2. In **Build and deployment**, choose:
   - **Source:** Deploy from a branch
   - **Branch:** `main` (or your default) and `/ (root)`
3. Save.
4. Wait for Pages to publish. Your site URL will appear (for example `https://YOUR_USERNAME.github.io/YOUR_REPO/`).

## Step D — Create a GitHub Personal Access Token for admin upload

The admin upload form writes to `data/poems.json`, so it needs a token.

1. Go to GitHub **Settings → Developer settings → Personal access tokens → Tokens (classic)**.
2. Click **Generate new token (classic)**.
3. Give it a name like `poetry-cloud-admin`.
4. Expiration: choose what you prefer.
5. Scopes:
   - `repo` (for private repos) OR
   - `public_repo` (if your repo is public)
6. Generate and copy token once.

> Important: keep the token private. Do not hardcode it into source files.

## Step E — Add poems as admin (you only)

1. Open your deployed app.
2. Click **Admin Upload**.
3. Fill:
   - GitHub Username
   - Repository Name
   - Branch (`main`)
   - Path (`data/poems.json`)
   - Personal Access Token
   - Poem title/body/tags
4. Click **Upload Poem**.
5. The app commits your poem directly to `data/poems.json` in GitHub.

## Step F — Let others install it like an app

Readers can open your site and choose:

- **Android Chrome:** browser menu → Install app
- **Desktop Chrome/Edge:** Install icon in address bar
- **iPhone Safari:** Share → Add to Home Screen

---

## 3) Local testing

Because service workers need HTTP/HTTPS (not plain file open), run a local server:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

---

## 4) Smooth-running checklist

- Keep `data/poems.json` valid JSON array.
- Use short poem titles; long poem bodies are fine.
- If upload fails, verify token scopes and branch/path.
- If install button does not show, ensure HTTPS (GitHub Pages already is HTTPS).
- If caches feel stale, bump `CACHE_NAME` in `service-worker.js`.

---

## 5) Optional improvements

- Add edit/delete actions for poems in admin mode.
- Add GitHub Actions validation for JSON format.
- Add categories, sorting, favorite poems, and dark mode.

