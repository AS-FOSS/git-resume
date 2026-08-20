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

Write your resume in LaTeX and push it. GitHub Actions compiles it into a PDF, attaches it to a release, and updates a hosted page where you can flip through every version you've pushed. Nothing gets committed back to the repo.

Live demo: [as-foss.github.io/git-resume](https://as-foss.github.io/git-resume/) · [demo video](https://www.youtube.com/watch?v=CiZllBuUCZ4)

## Quick start

1. Hit **Use this template** or fork, then clone your copy. Want it private? See [Public or private?](#public-or-private).
2. Put your resume in `template/`: replace the `.tex` and drop any logos into `template/icons/`.
3. Edit `template/resume.yml`:
   ```yaml
   variant: general
   label: General
   author: "Your Name"
   template: "YourResume.tex"
   output: "YourName_Resume"   # optional
   ```
4. Set your name in the `.tex` file. It's hardcoded in the header; `resume.yml` won't change it.
5. Push to `main`.

> [!NOTE]
> Enable Pages once per repo: Settings → Pages → Source: GitHub Actions. Your copy won't have it on by default.

## Public or private?

Forking keeps you in the fork network, so you can pull updates from this repo. For a private copy, use **Use this template** instead. Two trade-offs: you leave the fork network (no more updates from this repo), and GitHub Pages needs a paid plan (Pro or higher) on private repositories.

## Variants

One branch, one resume. `main` is your default; `resume/<something>` is a tailored version for one application. Each branch carries its own `resume.yml`:

```yaml
variant: facebook-de
label: Facebook Data Engineer
author: "Your Name"
template: "Resume.tex"
output: "YourName_Facebook_DE"
```

Push the branch and it builds on its own, with its own tags and its own entry in the viewer. Editing one variant never touches another.

## Editing with AI

You don't have to write LaTeX by hand. Point a free coding agent like [opencode](https://opencode.ai) at the repo and ask it to update your resume. Read `skills/` first: it holds optional writing guidance (ATS-friendliness, tone, template macros) for humans and agents alike. Swap in your own style guide if you want different rules.

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