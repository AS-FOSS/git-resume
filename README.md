<p align="center">
  <img src="https://github.com/user-attachments/assets/df86b189-4ef3-4c6e-9169-a1dda9ffc630" width="280" alt="Resume Build System logo" />
</p>

<p align="center">
  <strong>Use the template. Push a <code>.tex</code>. Get versioned PDFs + a live viewer — automatically.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/LaTeX-XeLaTeX-008080?style=flat-square&logo=latex&logoColor=white" alt="XeLaTeX" />
  <img src="https://img.shields.io/badge/CI-GitHub%20Actions-2088FF?style=flat-square&logo=githubactions&logoColor=white" alt="GitHub Actions" />
  <img src="https://img.shields.io/badge/Pages-GitHub%20Pages-222?style=flat-square&logo=github&logoColor=white" alt="GitHub Pages" />
  <img src="https://img.shields.io/github/stars/AS-FOSS/git-resume?style=flat-square" alt="Stars" />
  <img src="https://img.shields.io/github/forks/AS-FOSS/git-resume?style=flat-square" alt="Forks" />
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=flat-square" alt="MIT License" />
</p>

# git-resume

Write your resume in LaTeX, push it, and get a compiled PDF release plus a hosted viewer out of it — no manual build steps. See it in action: [as-foss.github.io/git-resume/](https://as-foss.github.io/git-resume/) or watch the [demo video](https://www.youtube.com/watch?v=CiZllBuUCZ4).

## Features

- **One push ships everything** — CI compiles, releases, and deploys the viewer. Nothing is committed back to the repo; the PDF and site are build output only.
- **Versioned PDFs** — a `latest-<variant>` release that always points at the newest build, plus dated `resume-<variant>-YYYY-MM-DD` snapshots whenever content changes.
- **Live viewer** — the Pages site reads the release list: pick a profile, flip through every published version, and render PDFs inline in the browser.
- **Per-application variants** — a `resume/<variant>` branch builds and releases independently, with its own tags and its own entry in the viewer's profile dropdown.

## Public or private?

Forking keeps you in the fork network, so you can pull updates from this repo. If you'd rather keep your resume private, hit **Use this template** (next to the star) and create the repo as private. Two trade-offs: your copy leaves the fork network, so you won't receive updates from this repository anymore, and GitHub Pages isn't available on private repositories unless you're on a paid plan (GitHub Pro or higher).

## Quick start

1. Create your copy of the repo — hit **Use this template** (next to the star) or fork it (see [Public or private?](#public-or-private)), then clone your copy
2. Replace the `.tex` file in `template/` with your resume and drop any logos into `template/icons/`
3. Edit `template/resume.yml`:
   ```yaml
   variant: general
   label: General
   author: "Your Name"
   template: "YourResume.tex"
   output: "YourName_Resume"   # optional, defaults to the .tex filename
   ```
4. Set your name inside the `.tex` file itself — it's hardcoded in the header, so `resume.yml`'s `author` field won't change it for you
5. Push to `main`

> [!NOTE]
> Enable Pages once per repo (Settings → Pages → Source: GitHub Actions). Forks and template copies don't inherit this setting; each copy owner must enable it themselves.

## Variant branches

`main` is your default resume. Want a tailored version for a specific application? Create a branch named `resume/<something>` with its own `resume.yml`:

```yaml
variant: facebook-de
label: Facebook — Data Engineer
author: "Your Name"
template: "Resume.tex"
output: "YourName_Facebook_DE"
```

Push it, and it builds and releases on its own — separate tags, separate entry in the viewer's profile dropdown. Editing one variant never touches another.

## Editing with AI

You don't have to write LaTeX by hand. Point a free coding agent like [opencode](https://opencode.ai) at the repo and ask it to update your resume. Check `skills/` first — it holds optional writing guidance (ATS-friendliness, tone, this template's macros) meant to be read before any content gets touched. Swap in your own style guide there if you want different rules.

## Layout

```
template/
  *.tex           resume content, compiled with XeLaTeX
  resume.yml      variant, label, author, template, output filename
  fonts/          font files, must stay next to the .tex
  icons/          logos referenced from the .tex
  index.html      source for the Pages viewer
skills/           optional content-writing guidance, not read by CI
.github/workflows/build-resume.yml   the whole pipeline
```