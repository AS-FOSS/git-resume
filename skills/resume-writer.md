# Resume Writer — Content Guidelines

How to write and edit resume content (bullets, the summary line, new entries)
so it reads as professional and parses cleanly through an ATS. Applies any
time content in `template/*.tex` is being written or changed — not just to
the original author's content.

This file is meant to be swappable: replace it with your own style guide, or
drop additional files into `skills/`, if you want different conventions
(seniority level, industry, tone, an academic-CV format, etc.). `AGENTS.md`
only points here — it doesn't assume this exact content.

## Structure & format

- Keep the single-column, plain-text layout. Don't add a sidebar,
  multi-column body, or table-based page skeleton — ATS parsers read by text
  position on the page, and two-column "designer" layouts are the single
  most common cause of resume content getting dropped or interleaved out of
  order.
- Never turn resume text into an image (no screenshots, no rasterized
  bullet lists) — everything an ATS should read needs to be real, selectable
  text. Everything in this template already is, except the logo icons, which
  are purely decorative.
- Keep standard section names (`Experience`, `Education`, `Projects`,
  `Skills`, `Certifications`) — ATS section-detection keys off common
  headings, so don't rename them to something clever.
- One page is the target for this template's density; two is the ceiling for
  most experience levels. If content grows, cut lower-impact bullets before
  shrinking the font below ~10pt or tightening margins past readability.
- Reverse-chronological order (newest first) within every section.
- One consistent date format everywhere — this template uses
  `Mon YYYY -- Mon YYYY` / `Mon YYYY -- Present`. Don't mix in other formats
  for new entries.

## Bullets

- Lead with a strong action verb — past tense for past roles, present tense
  for the current one (`Designed`, `Built`, `Reduced`, `Owned` — not
  `Responsible for` or `Helped with`).
- Quantify impact wherever the number genuinely exists: scale (`80M+
  records`), time saved, cost or latency reduced, percentage improved. A
  bullet with a number beats a bullet describing a responsibility.
- One idea per bullet, ideally one line and two at most. Cut filler
  (`various`, `numerous`, `responsible for`).
- No first-person pronouns (`I`, `my`).
- Keep the summary line (the untitled paragraph right under the header) to
  2–3 sentences, and quantified/specific rather than generic — "Data
  Engineer with 3+ years..." beats "hardworking, results-driven
  professional."

## Keywords — this is what actually gets a resume shortlisted

- Mirror the terminology of the job postings being targeted. If a posting
  says "data pipelines," don't rely only on a synonym like "ETL workflows"
  even if a human would read them as equivalent.
- Repeat a key technology or skill across more than one place if it's true
  and central to the story — in a bullet's prose, in that job's
  `\stackline`, and again in the `Skills` table. This template already does
  that; preserve the pattern when customizing.
- Spell out acronyms at least once if target roles might screen for either
  form (`ML` vs. `machine learning`).

## Notes specific to this template's LaTeX

- The contact-line icons (`\faPhone`, `\faEnvelope`, `\faLinkedin`,
  `\faMapMarker*`) are decorative FontAwesome glyphs, not text content. Some
  ATS text extraction is thrown off by an icon glyph sitting directly
  against the next character — keep the existing `\ ` space after each
  icon, and never make an icon the *only* way a piece of information
  (phone, email) is conveyed.
- A link's visible label is what gets read, not its `href`.
  `\href{https://github.com/...}{\faGithub\ GitHub}` shows "GitHub" as
  text — the literal URL is invisible to a plain-text or ATS read. If a URL
  should be text-searchable (recruiters and some ATS both grep resumes),
  show it as visible text too, e.g. `\href{...}{github.com/you}` rather
  than a link labeled with just a word.
- Keep `\iconentry` icons as logos only — never make an image the sole
  carrier of information (a title, a date, a skill name); put that in the
  text arguments instead, exactly as the current entries do.
- The `Skills` table (`tabularx`) is a simple two-column key → value
  layout, which extracts cleanly. Don't turn it into a decorative grid or
  icon-only skill badges — that would hide the skill names from any parser
  that isn't rendering the PDF visually.
