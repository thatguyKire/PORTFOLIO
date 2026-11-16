# Design gate: warnings in force

`inspect.mjs` at 1440, 768 and 390 gives 0 FAIL and 4 WARN for the current design (2026-11-16, after Try to break it was removed). Each is defended here. The redesign replaces this file; the five rounds of critique that led here are in git history (`git log -p -- tasks/critique.md`).

1. **size-count**: 11 font sizes. Each display line (the name, the project titles, STACK, the email and KIRE) is fitted to its own box by measurement, so each has its own size.
2. **no-footage**: no video. Erik chose no found imagery; the hero's cycling app screen is the moving picture.
3. **side-scroll**: PlayIT's Showcase strip scrolls sideways on purpose. The next screen is cut by the edge to say so, two arrows sit beside its heading for a mouse, and it has its own bar.
4. **empty-middle**: measured across the Proof band's moving line and the Showcase screens waiting off screen to the right. Nothing on screen has a hole.

Known and accepted: Korean text in the Seoul-Mate screens falls back to the system font, as TikTok Sans has no Hangul.
