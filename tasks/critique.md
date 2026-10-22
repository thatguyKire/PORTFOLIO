# Design critique

Format from the design skill's `references/critique.md`, judged on the inspector's screenshots only.

## Round 1 (2026-10-22, static page, before the motion layer)

Gate: `lint.mjs` 0 FAIL 0 WARN. `inspect.mjs` 0 FAIL, 3 WARN at 1440, 768 and 390.

```
ROUND 1
Seen in one second: ERIK BIEN in huge wide capitals, with a small app screen set between the words.
Idea (one sentence): Erik's own name, which his handle thatguyKire spells backwards, is the monument:
  ERIK BIEN opens the page, KIRE closes it, and each project name tears at its own word seam (LABA|LINK).
Live thing: Try to break it. Pick an attack and see the guard and the real test that stops it;
  a random attack is shown on each visit.
Layout words by section: hero=monument / work=pinned split stage / details=rows /
  proof=full-bleed band + split / skills=split / about=table rows / contact=statement / footer=wordmark
Scores: design 7.5 · usability 8 · creativity 8 · content 8 → overall 7.8
Caps applied: none. The inspector counts the 8 interface panels and 3 badge images as pictures;
  there are no photographs, by Erik's choice.
Top three problems (most visible first), each with the screenshot it shows in and the fix:
1. tablet-page-01: on a 768×1024 tablet the hero name is 80px tall on a 1024px screen, so about 60%
   of the first screen is empty ground. Fix: use the stacked word, screen, word composition below 900px,
   with a 2:1 screen between 600 and 899px so it fits the first screen.
2. desktop-page-03: Try to break it and Skills are two 5:7 splits in a row (list | panel, word | bars),
   and the verdict panel is stretched to the list's height, leaving a dead lower third inside the box.
   Fix: stack Try to break it (heading row, the attacks as one wrapping line of choices, then the
   verdict full width with BLOCKED on the left and the explanation on the right).
3. mobile-page-01: in the phone work stage the panels' text renders at about 6px and the middle 40% of
   each strip is empty teal, so the stage reads thin. Fix: scale the panel UI up on phones and pull the
   top and bottom blocks closer to the edges.
```

Fixes made: the hero stacks as word, screen, word below 900px (2:1 screen on tablets); Try to break it
is stacked, with the attacks as one wrapping line of choices and BLOCKED beside its explanation in a
full-width panel; phone panel text is set at about 9px with the blocks pulled toward the strip edges,
and the join code no longer wraps.

## Round 2 (2026-10-22, static page, before the motion layer)

Gate: `lint.mjs` 0 FAIL 0 WARN. `inspect.mjs` 0 FAIL, 3 WARN at 1440, 768 and 390.

```
ROUND 2
Seen in one second: ERIK BIEN, on a tablet now as ERIK / app screen / BIEN filling the first screen.
Idea (one sentence): unchanged from round 1.
Live thing: unchanged; the verdict now reads as one composed panel, BLOCKED beside the proof.
Layout words by section: hero=monument / work=pinned split stage / details=rows /
  proof=full-bleed band + stacked choices and panel / skills=split / about=table rows /
  contact=statement / footer=wordmark
Scores: design 8 · usability 8 · creativity 8 · content 8 → overall 8.0
Caps applied: none.
Remaining, none of which a stranger would name first:
1. Nothing moves yet apart from the band and the stage; the motion layer is Task 12.
2. The phone stage keeps a band of plain teal around the title on each strip; it holds the title
   and the line under it, so it reads as the stage's quiet middle rather than a hole.
3. Warnings defended: 10 font sizes (each display line is fitted to its own box by measurement),
   no video (Erik chose no found imagery), and an "empty middle" measured across the band's moving line.
```

## Round 3 (2026-10-22, the full name and the motion layer)

Gate: `lint.mjs` 0 FAIL 0 WARN. `inspect.mjs` 0 FAIL, 3 WARN at 1440, 768 and 390 (run with
`--allow blank-gap`; `check-gaps.mjs` runs that rule over the whole page and finds no blank stretch).
Moving elements: 81 at 1440, 84 at 768, 68 at 390.

```
ROUND 3
Seen in one second: ERIK in huge wide capitals with a live LabaLink screen beside it, SAMUEL BIEN
  fitted under both; on a phone ERIK / screen / SAMUEL BIEN.
Idea (one sentence): unchanged; the full name now opens the page and KIRE still closes it.
Live thing: Try to break it, unchanged; BLOCKED now drops behind its baseline while the attack is
  tried and rises when the guard holds.
Motion: the name rises from behind its baselines and the screen opens from ERIK's side, settled by
  1.2s; the screen then pushes through the four apps every 4s, each with one beat of its own (the
  washer timer counts down, the sold-out tag stamps, the tiles blend in, the stroke draws). Sections
  enter once in reading order, with headings, STACK, the email and KIRE rising from a mask. Buttons
  roll their label, attack choices grow their square, bars turn + into ×.
Layout words by section: unchanged from round 2.
Scores: design 8.5 · usability 8 · creativity 8.5 · content 8 → overall 8.3
Caps applied: none.
Remaining, none of which a stranger would name first:
1. The three defended warnings: 12 font sizes (each display line is fitted to its own box by
   measurement), no video (Erik chose no found imagery; the cycling app screen is the moving picture),
   and an "empty middle" measured across the band's moving line.
2. The page runs 13 screens on desktop and 15 on a phone, about four of them the work stage, which
   holds one project per screen.
3. Korean text in the Seoul-Mate screens falls back to the system font, as TikTok Sans has no Hangul.
```
