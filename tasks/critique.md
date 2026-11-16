# Design gate and critique

The current design (`SPEC-redesign.md`, 2026-11-16). Earlier rounds are in git history: `git log -p -- tasks/critique.md`.

## Warnings in force

`lint.mjs`: 0 FAIL, 0 WARN. `inspect.mjs` at 1440, 768 and 390: 0 FAIL, 3 WARN, each defended:

1. **no-footage**: no video. There is no honest clip of this subject; the moving thing on the first screen is the name being dealt.
2. **side-scroll**: PlayIT's strip of nine screens scrolls sideways on purpose. The next screen is cut by the edge to say so, two arrows sit beside its heading for a mouse, and it has its own bar.
3. **empty-middle**: the inspector reads the strip's screens waiting off screen to the right (x 2107 and beyond) as a gap from the screen's edge. Nothing on screen has a hole.

## Round 1 (2026-11-16, the new design)

Before: the monument design, 0 FAIL, 4 WARN, 11 font sizes, 12 screens on desktop. After: 0 FAIL, 3 WARN, 6 font sizes (five steps and the fitted email), 10 screens.

```
ROUND 1
Seen in one second: "Erik Bien" across a calm sage field, pale then dark, with what he does and
  "See the work" at the foot, and the next chapter already showing below.
Idea: the name is dealt like Blend It's tiles, never in the right order (Erik's own PlayIT fix).
Live thing: Deal again.
Layout words by section: hero=full-width statement, work=names paragraph then rows of thirds,
  proof=table, stack=two-ended rows in three columns, about=34% line, contact=display email,
  footer=wordmark.
Found and fixed while building:
1. The name was invisible to the layout probe: one-letter tiles are skipped, so the first screen read
   as 67% empty. The tiles now exist only while a deal plays; at rest the name is plain text.
2. A short last bullet ("…, all passing.") read as a label over the next project's heading at 768.
   It now says how far Seoul-Mate is: 8 of its 11 build steps.
3. Rows of a short heading at the left and points from column 7 left the middle third empty. The
   points now start at column 5, a third of the way across.
4. The next section's first line waited hidden at the foot of the first screen. A group already on
   screen at load now skips its entrance.
5. Printing showed only the sections that had been scrolled to. Waiting parts now print as they are.
Remaining:
1. LabaLink, Seoul-Mate and InkHive have no real screens yet, so only PlayIT has pictures.
2. The project order still waits on Erik (SPEC-redesign decision 3).
```
