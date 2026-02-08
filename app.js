const DEFAULT_SOURCE = {
  owner: "YOUR_GITHUB_USERNAME",
  repo: "YOUR_REPO_NAME",
  branch: "main",
  path: "data/poems.json"
};

const el = {
  grid: document.getElementById("poemsGrid"),
  status: document.getElementById("statusText"),
  search: document.getElementById("searchInput"),
  template: document.getElementById("poemCardTemplate"),
  adminButton: document.getElementById("adminButton"),
  adminDialog: document.getElementById("adminDialog"),
  adminForm: document.getElementById("adminForm"),
  adminStatus: document.getElementById("adminStatus"),
  cancelDialog: document.getElementById("cancelDialog"),
  installButton: document.getElementById("installButton")
};

let poems = [];
let deferredPrompt;

function getRawUrl(config = DEFAULT_SOURCE) {
  return `https://raw.githubusercontent.com/${config.owner}/${config.repo}/${config.branch}/${config.path}`;
}

async function loadPoems() {
  el.status.textContent = "Loading poems…";

  try {
    const response = await fetch(getRawUrl(), { cache: "no-store" });
    if (!response.ok) throw new Error(`Could not fetch poems.json (${response.status})`);
    poems = await response.json();

    if (!Array.isArray(poems)) throw new Error("poems.json must contain an array");

    renderPoems(poems);
    el.status.textContent = `${poems.length} poem(s) loaded.`;
  } catch (error) {
    el.status.textContent = `Could not load poems yet. Update app.js with your GitHub username/repo. (${error.message})`;
    poems = [];
    renderPoems(poems);
  }
}

function renderPoems(items) {
  el.grid.innerHTML = "";

  if (!items.length) {
    el.grid.innerHTML = `<article class="card poem-card"><h3>No poems yet</h3><p>Add your first poem from the Admin Upload button.</p></article>`;
    return;
  }

  for (const poem of items) {
    const node = el.template.content.firstElementChild.cloneNode(true);
    node.querySelector(".poem-title").textContent = poem.title;
    node.querySelector(".poem-meta").textContent = `Published: ${poem.date ?? "Unknown"}`;
    node.querySelector(".poem-body").textContent = poem.body;
    node.querySelector(".poem-tags").textContent = poem.tags?.length ? `#${poem.tags.join(" #")}` : "";
    el.grid.appendChild(node);
  }
}

function filterPoems(query) {
  const q = query.trim().toLowerCase();
  if (!q) return poems;

  return poems.filter((poem) => {
    const joined = [poem.title, poem.body, ...(poem.tags ?? [])].join(" ").toLowerCase();
    return joined.includes(q);
  });
}

el.search.addEventListener("input", () => {
  const filtered = filterPoems(el.search.value);
  renderPoems(filtered);
  el.status.textContent = `${filtered.length} result(s).`;
});

el.adminButton.addEventListener("click", () => {
  el.adminDialog.showModal();
  el.adminStatus.textContent = "";
});

el.cancelDialog.addEventListener("click", () => el.adminDialog.close());

async function readRepoFile({ owner, repo, branch, path, token }) {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`;
  const response = await fetch(url, {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to read file: ${response.status}. Ensure token has repo scope.`);
  }

  return response.json();
}

async function writeRepoFile({ owner, repo, branch, path, token, content, sha }) {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message: "Add poem via Poetry Cloud admin",
      content: btoa(unescape(encodeURIComponent(content))),
      sha,
      branch
    })
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Failed to write file: ${response.status} ${details}`);
  }

  return response.json();
}

el.adminForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(el.adminForm);

  const payload = {
    owner: formData.get("owner")?.trim(),
    repo: formData.get("repo")?.trim(),
    branch: formData.get("branch")?.trim(),
    path: formData.get("path")?.trim(),
    token: formData.get("token")?.trim(),
    title: formData.get("title")?.trim(),
    body: formData.get("body")?.trim(),
    tags: (formData.get("tags") || "")
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean)
  };

  if (!payload.title || !payload.body) {
    el.adminStatus.textContent = "Title and body are required.";
    return;
  }

  el.adminStatus.textContent = "Uploading poem to GitHub…";

  try {
    const file = await readRepoFile(payload);
    const decoded = decodeURIComponent(escape(atob(file.content.replace(/\n/g, ""))));
    const existing = JSON.parse(decoded);

    if (!Array.isArray(existing)) throw new Error("poems.json in repo is not an array");

    const newPoem = {
      title: payload.title,
      body: payload.body,
      tags: payload.tags,
      date: new Date().toISOString().slice(0, 10)
    };

    existing.unshift(newPoem);
    const nextContent = `${JSON.stringify(existing, null, 2)}\n`;

    await writeRepoFile({ ...payload, content: nextContent, sha: file.sha });
    el.adminStatus.textContent = "Poem uploaded successfully ✅";

    DEFAULT_SOURCE.owner = payload.owner;
    DEFAULT_SOURCE.repo = payload.repo;
    DEFAULT_SOURCE.branch = payload.branch;
    DEFAULT_SOURCE.path = payload.path;

    await loadPoems();
  } catch (error) {
    el.adminStatus.textContent = `Upload failed: ${error.message}`;
  }
});

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  deferredPrompt = event;
  el.installButton.hidden = false;
});

el.installButton.addEventListener("click", async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt = null;
  el.installButton.hidden = true;
});

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js").catch(() => {});
}

loadPoems();
