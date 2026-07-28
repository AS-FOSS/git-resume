
<p align="center">
  <img src="https://github.com/user-attachments/assets/554b1e63-044b-4c01-9b75-5f9c771af3fc" width="280" alt="Resume Build System logo" />
</p>

<p align="center">
  <strong>Fork it. Push a <code>.tex</code>. Get versioned PDFs + a live viewer — automatically.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/LaTeX-XeLaTeX-008080?style=flat-square&logo=latex&logoColor=white" alt="XeLaTeX" />
  <img src="https://img.shields.io/badge/CI-GitHub%20Actions-2088FF?style=flat-square&logo=githubactions&logoColor=white" alt="GitHub Actions" />
  <img src="https://img.shields.io/badge/Pages-GitHub%20Pages-222?style=flat-square&logo=github&logoColor=white" alt="GitHub Pages" />
  <img src="https://img.shields.io/github/stars/sadigaxund/git-resume?style=flat-square" alt="Stars" />
  <img src="https://img.shields.io/github/forks/sadigaxund/git-resume?style=flat-square" alt="Forks" />
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=flat-square" alt="MIT License" />
</p>

# git-resume

Fork it, put your resume in `template/`, push. GitHub Actions compiles it, cuts a release with the PDF attached, and updates a hosted page where you can browse every version you've pushed.

## Setup

1. Fork and clone this repo
2. Replace the `.tex` file in `template/` with your own, and drop any logos into `template/icons/`
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

> NOTE: Turn on Pages once (Settings → Pages → Source: GitHub Actions) — this is a one-time manual step, **per repo**. Forks don't inherit this setting; each fork owner must enable it themselves.

## What happens on push

One workflow handles all of it:

- Compiles `template/*.tex` with XeLaTeX (needed for the bundled fonts — plain pdflatex won't render them)
- Publishes the PDF as a release: a `latest-<variant>` tag that always points at the newest build, plus a dated `resume-<variant>-YYYY-MM-DD` tag whenever the content actually changes
- Rebuilds the GitHub Pages viewer, which reads the release list and lets you flip between every version you've published

See it in action: [sadigaxund.github.io/git-resume](https://sadigaxund.github.io/git-resume/) — two-level profile/version selector, renders PDFs inline in your browser.

Nothing is committed back to the repo. The PDF and the site are build output, not history you have to manage by hand.

## Different resumes for different applications

`main` is your default resume. If you want a different version for a specific application — say a data-engineering-flavored resume for one company — create a branch named `resume/<something>`, e.g. `resume/facebook-de`, with its own `resume.yml`:

```yaml
variant: facebook-de
label: Facebook — Data Engineer
author: "Your Name"
template: "Resume.tex"
output: "YourName_Facebook_DE"
```

Push it, and it builds and releases on its own — separate tags, separate entry in the viewer's profile dropdown. Editing one variant never touches another.

## Editing with AI

You don't have to write LaTeX by hand. Point a free coding agent like [opencode](https://opencode.ai) at the repo and ask it to update your resume. Check `skills/` first — it holds optional writing guidance (ATS-friendliness, tone, this template's macros) meant to be read before any content gets touched, by a human or an agent. Swap in your own style guide there if you want different rules.

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

## License

Fork it and use it for your own resume.
