# Task Proposals from Codebase Review

## 1) Typo fix task
**Issue found:** The final message string in the simulated boot log is `"got you."`, which reads like an accidental lowercase/unfinished sentence compared with the rest of the scripted output style.

**Proposed task:** Update the final line to a polished sentence (for example, `"Got you."` or another intentional final message) and ensure copy style is consistent across all user-facing lines.

**Why this matters:** It improves presentation quality and avoids the appearance of an accidental typo.

**Relevant location:** `index.html` line 81 (and mirrored copy in `README.md` line 81).

---

## 2) Bug fix task
**Issue found:** Fullscreen is requested immediately on load via `document.documentElement.requestFullscreen?.();`.
In most browsers, fullscreen requires a user gesture, so this can fail and produce noisy console errors/rejected promises.

**Proposed task:** Move fullscreen behavior behind an explicit user action (e.g., "Start" button click) and handle rejection with a safe fallback UI state.

**Why this matters:** Prevents runtime errors and makes behavior compatible with browser security rules.

**Relevant location:** `index.html` line 31 (and mirrored copy in `README.md` line 31).

---

## 3) Code comment/documentation discrepancy task
**Issue found:** `README.md` currently contains a duplicate HTML document rather than project documentation.
This creates a clear mismatch between expected README purpose and actual content.

**Proposed task:** Replace `README.md` with proper docs (project purpose, how to run, behavior notes, known limitations) and remove duplicated app markup from docs.

**Why this matters:** Makes onboarding and maintenance easier; avoids doc/code divergence.

**Relevant location:** `README.md` lines 1-112.

---

## 4) Test improvement task
**Issue found:** The project has no automated tests for rendering behavior (line coloring rules and ordered output timing).

**Proposed task:** Add lightweight browser-based tests (e.g., Playwright) that verify:
- log lines render in order,
- color classes are applied for warning/security/started states,
- ellipsis lines get the `dim` class,
- script completes all lines.

**Why this matters:** Prevents regressions when changing copy, classification rules, or animation timing logic.

**Relevant location:** Rendering logic in `index.html` lines 87-106.
