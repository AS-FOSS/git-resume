# Resume — Agent Knowledge

Quick orientation for an agent (or a person) working in this repo.

## Repo layout

| Path | What it is |
|---|---|
| `template/*.tex` | The resume content and layout. Compiled with XeLaTeX. |
| `template/resume.yml` | Per-branch build config: `variant`, `label`, `author`, `template`, `output` |
| `template/fonts/*.ttf` | Ubuntu font family, loaded by `fontspec` via `Path=fonts/`. Must stay in the same directory as the `.tex` file. |
| `template/icons/*` | Logos/icons referenced from the `.tex`, e.g. `\iconentry{icons/foo.png}{...}{...}` |
| `template/index.html` | Source for the Pages viewer. Copied to `public/index.html` during CI, with `{{OWNER}}`, `{{REPO}}` substituted in. |
| `.github/workflows/build-resume.yml` | The entire pipeline — compile, release, and Pages deploy — in one job, one file |
| `skills/*.md` | Optional guidance modules for content-authoring tasks. Not read by CI — see **Skills** below. |

CI never commits back to the repository. Build outputs (the compiled PDF, the
dated archive copy, the generated site) exist only as release assets or a
Pages deployment — never as git history.

## Workflow trigger

```yaml
on:
  push:
    branches:
      - main
      - 'resume/**'
    paths: ["template/**"]
  workflow_dispatch: {}
```

`permissions: contents: write, pages: write, id-token: write` (needed for releases
and the Pages OIDC deploy). `concurrency: group: build-resume, cancel-in-progress: false`
— overlapping pushes queue instead of racing each other's release edits.

## Branch-per-variant architecture

Each resume variant lives on its own branch. The branch name follows the
convention `resume/<variant-id>` (e.g. `resume/facebook-de`, `resume/amazon-sde`).
The `main` branch holds the general/default variant.

Every branch carries its own `template/resume.yml`:

```yaml
variant: facebook-de
label: Facebook — Data Engineer
author: "Sadig Akhund"
template: "Resume.tex"
output: "SadigAkhund_Facebook_DE"
```

- **`variant`** — a short slug used in release tag names (must be filesystem-safe, e.g. `facebook-de`)
- **`label`** — human-readable name shown in the viewer's profile selector
- **`template`**, **`output`**, **`author`** — same as before

When you push to any matching branch, CI builds that branch's `.tex` and
uploads the PDF to namespaced releases. Pages is deployed **only from `main`**.

## Release tags

Each variant gets its own release tag family, namespaced by variant ID:

| Tag pattern | Created | Lifecycle | Purpose |
|---|---|---|---|
| `latest-{variant}` | every run (deleted + recreated) | recreated each run to freshen `created_at` | stable link to newest PDF for this variant |
| `resume-{variant}-YYYY-MM-DD` | only when PDF content changes vs `latest-{variant}` | deleted + recreated per change; `--prerelease` | dated archival snapshot for this variant |

Examples:
- `latest-general`, `resume-general-2026-07-28`
- `latest-facebook-de`, `resume-facebook-de-2026-07-28`
- `latest-amazon-sde`, `resume-amazon-sde-2026-07-28`

Each variant's release history is independent — pushing to `resume/facebook-de`
only touches the `*-facebook-de-*` tags; `general` and `amazon-sde` releases
are never affected.

## Build steps (in order)

1. Checkout
2. Cache the `ghcr.io/xu-cheng/texlive-full` Docker image, keyed on its remote
   manifest digest, so most runs skip re-pulling the full TeX Live image
3. Read `template/resume.yml` with PyYAML → `VARIANT`, `VARIANT_LABEL`,
   `AUTHOR`, `TEMPLATE`, `OUTPUT` env vars
4. Compile `template/${TEMPLATE}` via `xu-cheng/latex-action@v3`
   (`latexmk_use_xelatex: true`, `extra_fonts: template/fonts/*.ttf`) — **must stay
   XeLaTeX**, since `fontspec` + the bundled TTFs won't work under `pdflatex`
5. Normalize the compiled PDF to `<OUTPUT>.pdf` at the repo root, and copy it into
   a build-only `Archive/<OUTPUT>_<DATE>.pdf` (gitignored — only used as a release
   asset within this run)

### Release upload logic

1. **SHA256 change detection** — downloads the current `latest-{variant}` PDF,
   SHA256-compares against the freshly built one. `CHANGED=1` if different, or if
   `latest-{variant}` doesn't exist yet.
2. **If changed** — delete old `resume-{variant}-YYYY-MM-DD` tag and recreate it
   with the archive PDF; then recreate `latest-{variant}` (deleted + recreated).
3. **If unchanged** — find most recent dated release for this variant and update
   notes to "Verified unchanged"; recreate `latest-{variant}` with the existing
   PDF.

The `latest-{variant}` release is **always deleted and recreated last** so its
`created_at` timestamp is always the most recent. GitHub sorts releases by
`created_at` descending, so `latest-{variant}` shows up first in the release
list and the viewer's version dropdown.

No `--latest` flag is set on any release — GitHub's repo-wide "latest release"
flag would race between variants if set, and the viewer doesn't use it.

### Pages deployment

Pages steps only run when `github.ref_name == 'main'`:
- `template/index.html` → `public/index.html`
- `sed` substitutes `{{OWNER}}`, `{{REPO}}`
- Deployed via `actions/upload-pages-artifact` + `actions/deploy-pages`

The viewer discovers all variants dynamically from the release list API —
no redeploy needed when a new variant branch is created and pushed.

## PDF viewer (template/index.html)

Two-level selector:

1. **Profile selector** (`#profileSelect`) — lists every variant discovered from
   release tags. The label comes from the `latest-{variant}` release's `name`
   field (set from `label` in `resume.yml`).
2. **Version selector** (`#versionSelect`) — shows "Latest" followed by dated
   snapshots (`YYYY-MM-DD`) for the selected profile.

### Tag parsing in JS

```js
/^latest-(.+)$/                     // → variant ID, added as "Latest" version
/^resume-(.+)-(\d{4}-\d{2}-\d{2})$/  // → variant ID + date, added as dated version
```

The greedy `(.+)` in the dated pattern correctly handles variant IDs with
embedded hyphens (e.g. `facebook-de`) by backtracking to match the fixed-width
`YYYY-MM-DD` suffix.

### PDF download fix (Chrome/Edge)

GitHub Releases serves assets with `Content-Disposition: attachment`. The
`<object>` tag's `data` attribute was previously set directly to the release
download URL — Chrome/Edge obeyed the header and downloaded; Firefox/Zen
rendered inline anyway.

The `loadVersion` function now uses:
```js
fetch(e.url).then(r => r.blob()).then(b => viewer.data = URL.createObjectURL(b))
```
A `blob:` URL carries no Content-Disposition header, so all browsers render
inline. The download button still links directly to the GitHub Releases URL.

## Customizing content

- Custom macros defined near the top of the `.tex` file: `\jobheading`,
  `\eduheading`, `\projheading`, `\iconentry`, `\plainheading`, `\subrole`,
  `\stackline`. Use these rather than hand-rolling raw LaTeX for each entry.
  Sections present: Experience, Education, Projects, Certifications, Skills.
- **The name on the PDF is hardcoded**, not templated — it's set directly in the
  `\MakeUppercase{...}` header inside the `.tex` file. `resume.yml`'s `author`
  field only feeds the CI-generated webpage title and release notes; changing
  it does **not** change the name on the compiled PDF. (Matches the open
  `TODO.md` item: "User-configurable full name" isn't wired up yet.)
- `.gitignore` uses a whitelist: everything is ignored by default, then `.tex`,
  `.sh`, icons, font `.ttf`s, and a handful of named files are explicitly
  allowed back in, with build artifacts (`.aux`, `.log`, `.synctex.gz`, etc.)
  and `Archive/` re-ignored afterward. Adding a new asset type needs an
  explicit `!` allow rule or it silently won't be tracked.

## Typography & formatting conventions

Established style rules for resume content. Follow these when adding or
editing entries so new text matches the existing layout.

**Bold keyword styling** (the visual hierarchy of keywords in bullet text):

- `\kw{single token}` — bold **slate-gray (#2F4F4F)** keyword, wrapped in
  `\mbox` so it can never hyphenate or split across lines (kills "Ter-raform"
  style breaks). Use for single-word tech terms: `\kw{Spark}`, `\kw{Trino}`.
- `\kwb{multi-word phrase}` — same bold slate-gray styling but **breakable
  at spaces**. Use for phrases: `\kwb{Kafka Schema Registry}`,
  `\kwb{80M+ customer reviews}`.
- `\tech{single token}` — bold **black** unbreakable keyword; reserved for
  entry titles and the header (`\tech{Polaris}`, the name block), not for
  body keywords.
- **Never freeze a multi-word phrase in `\mbox`** (i.e. don't use `\kw` on
  phrases). An unbreakable phrase near the end of a line overflows the
  column (a "80M+ customer reviews" phrase once produced a 31pt overfull
  `\hbox`). Phrases get `\kwb`.
- Multi-word keyword phrases that carry the emphasis (`80M+ customer
  reviews`, `18 business-critical tables`) use `\kwb`, not `\kw`.

**Layout & line breaking:**

- The preamble loads `\usepackage{microtype}` and sets
  `\emergencystretch=1.5em`; both keep justified lines clean and prevent
  orphan syllables. Do not remove them.
- The compiled document must stay **2 pages** with **no Overfull `\hbox`
  warnings** beyond ~1pt. If a new bullet creates an overfull line, prefer
  rewording or switching a `\kw` to `\kwb` over deleting content.
- Local TeX Live may lack `microtype.sty` (CI's `texlive-full` image has
  it). To compile locally, temporarily comment the `\usepackage{microtype}`
  line, build, then restore it before committing.

**History (why these exist):** keyword hyphenation ("Ter-raform") and a
dangling syllable widow on the final line of a bullet looked bad; `\kw` +
`\emergencystretch` fixed it. Labeled sentence starters ("Data Ingestion &
Resilience:", etc.) were tried in four styles (all-caps small, plain bold,
plain text, accent bold) and then removed entirely — bullets now start
directly with the description. The slate-gray keyword color was chosen to
recede behind the bold text hierarchy.

## Adding a new variant

1. Create a branch from `main`: `git checkout -b resume/<variant-id>`
2. Edit the `.tex` file with tailored content
3. Update `template/resume.yml` with the variant's `variant`, `label`, and
   (optionally) a different `output` filename
4. Push the branch — CI builds and releases that variant's PDF
5. The viewer on GitHub Pages automatically discovers the new variant from
   release tags (no redeploy needed)

## Skills

`skills/` is a plain folder of optional markdown guidance modules for
*content*-authoring tasks. Nothing in this repo's CI reads it — it exists
purely for whoever is writing or editing resume content, human or agent.

- Before writing or editing resume content (a bullet, the summary, a new
  entry), check `skills/` for anything relevant and read it first.
- This repo ships `skills/resume-writer.md` — general resume-writing and
  ATS-friendliness guidance, plus notes specific to this template's LaTeX
  macros.
- Because it's just independent files, anyone forking this repo can replace
  `resume-writer.md` with their own style guide (different tone, seniority
  level, industry conventions, academic CV rules, whatever) or add more
  files (`skills/cover-letter.md`, `skills/linkedin-summary.md`, etc.).
  AGENTS.md deliberately doesn't hardcode what's inside any of them — just
  the convention that they live in this folder and should be read before
  content work.

## Fork setup

1. `git clone` your fork
2. Replace the `.tex` in `template/` with your resume; drop any logos into
   `template/icons/`
3. Edit `template/resume.yml`:
   ```yaml
   variant: general
   label: General
   author: "Your Name"
   template: "YourResume.tex"
   output: "YourName_Resume"   # optional — defaults to the .tex filename
   ```
4. Also update the name directly inside your `.tex` file (see note above —
   `resume.yml` won't do this for you)
5. Push to `main` — CI compiles, releases, and deploys the Pages viewer. Enable
   Pages once (Settings → Pages → Source: GitHub Actions) the first time.

Note: at the very end pass the resume through the humanizer skill:
https://raw.githubusercontent.com/blader/humanizer/refs/heads/main/SKILL.md
