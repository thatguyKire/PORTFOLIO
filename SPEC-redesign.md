# Spec: the design (2026-11-16)

The look and motion of the site. It follows every rule in `SPEC.md`. The previous design (the name as a monument, the torn work stage, KIRE) and its decision log are in git history: `git log -p -- SPEC-redesign.md`.

## Direction

**Type and nothing else**, dealt by the design-taste skill (seed 1249965762) and chosen by Erik from three on 2026-11-16. The first screen is only words, colour and space; pictures arrive later, large and few, and only where they are real (PlayIT's screens, the badges).

**The idea:** PlayIT's Blend It deals a word's tiles in any order but the right one; that was Erik's fix. On this page **Erik's name is dealt the same way**: its letters arrive as shuffled tiles that slide into place and fade into the plain name.

**The one live thing:** "Deal again" deals a new order, never the right one.

## Colour: mist and sage

Erik asked for colours that are "calming and doesn't hurt on the eyes but still interesting but minimalist". The palettes the skill dealt (and three redraws) were all high-contrast or loud, so the colours are Erik's brief, kept in the direction's proportions: one ground, one ink, one accent, and chapter fields.

| Role | Dark (default) | Light |
|---|---|---|
| Ground | `#1b2321` | `#eef2ef` |
| Ink | `#dfe6e1` | `#1d2724` |
| Soft ink | `#9db0a7` | `#51645c` |
| Accent (the one button) | `#a9c7b9` | `#3d6a5c` |
| The other field (Proof, Contact) | `#d9e3dd` | `#1f2926` |
| The name's field (both themes) | `#6f8f82`, with `#eef3ef` and `#17201d` as its two inks | same |

No pure black or white anywhere. Every text colour passes WCAG AA on its ground; the name's pale line is display size, where 3:1 applies.

## Type

One family, **Bricolage Grotesque** (Google Fonts, optical size on), weights 400 to 600. Five steps: small 14px, body 17 to 19px, lead 20 to 26px, head 32 to 64px, display 26vw (the name and the footer wordmark). The email address is fitted to the width. Kerning is off on the name so its letters can be tiles without moving.

## The page

| # | Section | Field | Composition |
|---|---|---|---|
| 1 | **Hero** | sage | "Erik Bien" across the width in two inks, pale then dark; the sentence bottom-left, "Deal again" and See the work bottom-right. The field holds its content, so the next chapter shows at the foot of the first screen. |
| 2 | **Work** | ground | Every project name as one paragraph at head size ("Selected work: PlayIT, LabaLink, …"), with a crop of PlayIT's real Start screen after its name. Then each project in two columns: name, what it is, role, stack and repo link on the left third; the points on the right two thirds. PlayIT's nine real screens run as a strip under its points. Then Also built. |
| 3 | **Proof** | mist | "Tested before / it ships", the 300 total, then a table: project, suite, a real test name, count. A tone step on every other project instead of lines. |
| 4 | **Stack** | ground | Two-ended rows in three columns: the skill at the left, the project at the right. |
| 5 | **About** | ground | Side facts and a wide paragraph meeting at 34% of the width; then the record: badges with their Credly links, and coursework. |
| 6 | **Contact** | mist | The email address as the display line; phone and city at the left, links at the right. |
| 7 | **Footer** | ground | Two short lists, then "Erik Bien" from margin to margin. |

The bar is fixed and takes the field of the chapter under it, so it never sits on the page as a band of another colour. Below 1024px its links fold into a full-screen menu.

## Motion

- **Signature:** the name's deal on load and on "Deal again" (transforms only).
- **Colour by chapter:** the bar cross-fades to the field beneath it in 300ms. The fields themselves never change colour.
- **Entrances:** each section's parts arrive once, 80ms apart: headings a letter at a time, the rest rising 24px, PlayIT's strip opening like a shutter. Anything already on the first screen at load is never hidden.
- **Feedback:** press on every button, hover on links and the project names.
- Reduced motion: no deal, no entrances, nothing hidden. Without JavaScript: the plain name, every part shown, no switch or "Deal again". Print: black on white, every part shown, the strip in rows of five.

## What went with the old design

The hand-built app screens (three per project), the torn work stage, the Washer 03 clock, the hero's ink canvas, the test-name band, Try to break it and the ERIK → KIRE footer. Real pictures replace drawn ones: PlayIT's nine screens and the three badges.

## Decisions

| # | Question | Answer |
|---|---|---|
| 1 | Direction (2026-11-16) | B, "Type and nothing else", from three shown on a preview page. |
| 2 | Colours | Calm and easy on the eyes: mist and sage, above. Dark stays the default with the light switch (`SPEC.md`). |
| 3 | Project order | Unchanged (PlayIT, LabaLink, Seoul-Mate, InkHive) until Erik decides whether the site follows the resume's (PlayIT, InkHive, LabaLink). |
| 4 | Gate warnings | Each defended in `tasks/critique.md`. |
