# Implementation Plan: Portfolio redesign and content fixes

Specs: `SPEC.md` (the rules for every change) and `SPEC-redesign.md` (the new look and motion). Tasks with full acceptance criteria are in `tasks/todo.md`.

## Overview

The work comes in two parts.

**Part 1: content fixes on `main`, published straight away.** The live resume still shows Playwright, the InkHive Render address, and the references' private phone numbers and emails. The live site still links to the old InkHive deploy.

**Part 2: the redesign on a `redesign` branch.**
- `index.html` is rebuilt into the "name as a monument" design: TikTok Sans, teal on paper, ERIK … BIEN to open, KIRE to close, and Try to break it.
- It's built one section at a time. The page still works after every task.
- The live site doesn't change until Erik approves the finished page and the branch is merged.

## Architecture Decisions

- **Branch, not a second file.** The redesign is built on a `redesign` branch. GitHub Pages serves `main`, so nothing half-built goes live and there is no stray `index.new.html` on the public site.
- **Rebuild in place, content first.** The first redesign task swaps the whole visual layer (fonts, tokens, frame, nav) and lays out *all* the real content as plain, readable sections in the new order. Each later task upgrades one section to its blueprint, so nothing is lost and every step can be shipped.
- **Still first, motion second.** The page must look finished with motion off, as the design skill requires. The one exception is the pinned Work stage with the tearing title, which shapes the page's length and composition, so it is built with the Work section.
- **No libraries.** Plain HTML, CSS and ES5 in one IIFE, as `SPEC.md` says. Scroll effects share one rAF loop. The existing `$`, `$$`, `clamp`, `tween` helpers and the theme code are kept.
- **Pictures are Erik's own.**
  - The app screens are rebuilt in HTML and CSS, with `data-ui` on each panel's root so the design gate counts them as interface pictures.
  - The badges are real PNGs in `assets/`.
  - No found photos, and no bitmap mock-ups.
- **Dark is the default.** The dark tokens sit on `:root`, so no-JS visitors get dark too. The theme script sets `data-theme="light"` only when the visitor has chosen light with the toggle.

## Task List

### Part 1: content fixes (on `main`)
- [x] Task 1: Resume fixes: Playwright, the InkHive address and the references
- [x] Task 2: Live-site fixes: InkHive link and the "live on Render" stat
- [x] Task 3: `check.sh`, the one-command check (Erik said yes)

### Checkpoint 0: published
- [x] The live resume and site pass the content `grep` and the one-page check

### Part 2, Phase 1: foundation (on `redesign`)
- [x] Task 4: New foundation, with all content in the new order
- [x] Task 5: Hero: the monument name with an app screen between ERIK and BIEN

### Checkpoint A: first screen review
- [x] Erik sees the first screen at phone, tablet and desktop width, in light and dark, and approves the direction before the rest is built (approved 2026-10-22, with dark as the default)

### Part 2, Phase 2: sections
- [x] Task 6: Work stage, with the tearing title, and the LabaLink and Seoul-Mate panels
- [x] Task 7: PlayIT and InkHive panels, and the "Also built" list
- [x] Task 8: Proof: the test-name band and Try to break it
- [x] Task 9: Skills: STACK and the six bars
- [x] Task 10: About: side facts, paragraph and badges
- [x] Task 11: Contact (the email as display type) and the KIRE footer

### Checkpoint B: the whole page, without motion
- [x] `inspect.mjs` reports 0 FAIL at 1440, 768 and 390px. The motion count is the one exception, because motion comes next.
- [x] First critique round written down (tasks/critique.md, two rounds, 8.0).
- [x] Erik reviews the full page (2026-10-22: add Samuel to the name, then go on).

### Part 2, Phase 3: motion
- [x] Task 12: Motion layer: shutter, screen cycling, entrances and control feedback

### Part 2, Phase 4: finish
- [ ] Task 13: Gate, critique and regression
- [ ] Task 14: Ship: merge to `main`, push, check live

### Checkpoint C: ready to ship
- [ ] Every success criterion in both specs passes. Erik approves the merge.

## Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| TikTok Sans's width axis doesn't reach 150% from Google Fonts, so the monument looks narrow | High | Check the computed `font-stretch` and a screenshot in Task 4. Fallback: weight 900 at normal width, sized up. |
| "ERIK [screen] BIEN" overflows at tablet width | Medium | Size the line in `vw` with a clamp and measure it at 768 and 1024 in Task 5. It stacks on phones as the blueprint says. |
| The pinned, tearing Work stage stutters on phones or misbehaves with the mobile address bar | High | Built early (Task 6). Transforms only, in the one rAF loop, using `svh` units. If the phone version fails, fall back to the reduced-motion crossfade there. |
| The design gate doesn't count HTML interface panels as pictures | Medium | Confirmed in Task 5 with the hero frame, before the 8 panels are built. If it doesn't, ask Erik before changing approach. |
| The gate measures tiny text inside the app panels as page text | Low | Check in Task 5. Panel text stays 13px or more where possible, and `data-ui` marks real interface insides. |
| 8 HTML panels make the file heavy | Low | Shared panel CSS and no bitmaps. Keep `index.html` under about 200 KB (it's 116 KB now). |
| Content is lost in the rebuild | High | Task 4 has a content checklist covering every fact, number and link. Task 13 clicks every link that worked before. |
| The IBM badge image isn't on disk | Low | Take it from its Credly badge page in Task 10. If that fails, ask Erik for the image. |

## Open Questions

None. Check script approved on 2026-10-22.
