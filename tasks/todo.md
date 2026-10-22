# Tasks: Portfolio redesign and content fixes

Plan: `tasks/plan.md` · Specs: `SPEC.md`, `SPEC-redesign.md`

**Shorthands used below:**
- **Gate:** `T=~/.claude/skills/design-taste-frontend/scripts`, then `node $T/lint.mjs index.html` and `node $T/inspect.mjs index.html --out .taste-skill/after`.
- **Content grep:** the `grep` in `SPEC.md`. It must print nothing.
- **Console check:** load the page in headless Chrome, scroll to the bottom, and confirm there are 0 errors.

Every commit follows `CLAUDE.md`: a short imperative summary and no trailers.

---

## Part 1: content fixes (on `main`)

### Task 1: Resume fixes: Playwright, the InkHive address and the references

**Description:** Bring the resume in line with the answers from 2026-10-22, rebuild the PDF, and commit it together with the specs, the plan and `.gitignore`.

**Acceptance criteria:**
- [ ] Playwright is gone from the Seoul-Mate tools line and from Security & Testing.
- [ ] The InkHive heading shows the team's GitHub repo instead of `collaboard-z4sx.onrender.com`.
- [ ] References reads "Available on request." with no names, phone numbers or emails.

**Verification:**
- [ ] `grep -niE 'playwright|collaboard-z4sx|0909|0962' resume/resume.html` prints nothing.
- [ ] `pdftotext Bien_Resume.pdf - | tr -cd '\f' | wc -c` prints `1`.
- [ ] Open the PDF: every link clicks through, and nothing is cut off.

**Dependencies:** None

**Files likely touched:** `resume/resume.html`, `Bien_Resume.pdf`, plus the new `SPEC.md`, `SPEC-redesign.md`, `tasks/`, `.gitignore`

**Estimated scope:** Small

### Task 2: Live-site fixes: InkHive link and the "live on Render" stat

**Description:**
- Remove the InkHive live-demo link from the current site.
- Replace the "1 app live in production on Render" stat with a true one: **29** security tests that attack InkHive on purpose, which is part of its 127.

This holds until the redesign ships. Then publish Tasks 1 and 2 together.

**Acceptance criteria:**
- [ ] No `onrender` link remains in `index.html`.
- [ ] The stats row still has 4 true numbers, and the new one matches the InkHive card (127 tests, 29 security).
- [ ] The live site and the live PDF show the changes.

**Verification:**
- [ ] The content grep prints nothing for `index.html`.
- [ ] Console check passes.
- [ ] After `git push origin main`, `curl` the live page and PDF to confirm the changes are there.

**Dependencies:** Task 1

**Files likely touched:** `index.html`

**Estimated scope:** Small

### Task 3: `check.sh`, the one-command check (only if Erik says yes)

**Description:** One script that runs every content check in `SPEC.md` and prints PASS or FAIL for each:
- banned words and links in the site and the resume
- the resume is exactly one page
- the three suite counts add up to the 269 shown

It also runs the design gate when Node and the skill are present.

**Acceptance criteria:**
- [ ] `bash check.sh` prints one line per check and exits non-zero if any fail.
- [ ] Planting the word "Playwright" in a copy of the page makes it fail.

**Verification:**
- [ ] Run it on the current files: all pass except the design gate, which fails until the redesign is done.

**Dependencies:** Task 1

**Files likely touched:** `check.sh`, `SPEC.md` (the Commands section points to it), `README.md`

**Estimated scope:** Small

### Checkpoint 0: published
- [ ] The live site and resume pass the content grep and the one-page check.

---

## Part 2, Phase 1: foundation (branch `redesign`)

### Task 4: New foundation, with all content in the new order

**Description:**
- Create the `redesign` branch.
- Replace the whole visual layer of `index.html`: TikTok Sans as the only font, the Teal on paper tokens with dark tokens under `[data-theme="dark"]` only, the five type steps, one pair of outer margins, and square corners.
- Make the nav a plain bar: the wordmark, Work, Skills, About and Contact, the theme toggle, and a Resume button.
- Lay out *all* real content in the new section order (Hero, Work, Proof, Skills, About, Contact, Footer) as plain readable markup, each section with its heading.
- Add the phone as a `tel:` link in Contact.
- Remove the old CSS and JS, keeping the helpers, the theme code and the year.

**Acceptance criteria:**
- [ ] **Content checklist:** nothing from the old page is lost.
  - all 8 projects, with their facts, tests and repo links
  - every skill and the project it maps to
  - the 3 badges with their Credly links, and education
  - email, GitHub, LinkedIn and the resume link
- [ ] One font family, TikTok Sans, with no italic or monospace anywhere. The computed `font-stretch` reaches 150% on the display style.
- [ ] Light by default even with the system set to dark. The toggle switches to dark and survives a reload.

**Verification:**
- [ ] Run the gate. Record the fails; only the ones from blueprints not built yet may remain.
- [ ] Content grep and console check pass.
- [ ] Screenshot at 390 and 1440px.

**Dependencies:** Checkpoint 0

**Files likely touched:** `index.html`

**Estimated scope:** Medium (one file, largest rewrite)

### Task 5: Hero: the monument name with an app screen between ERIK and BIEN

**Description:** Build the hero to the "Photograph for a letter" blueprint.
- **Desktop and tablet:** **ERIK [screen] BIEN** on one line at about 10.5vw, spanning 78–88% of the width, at the vertical centre. The frame is a landscape crop of one app screen, built in HTML with `data-ui`, one cap-height tall and about 1.6em wide.
- **Phone:** the name stacks on two lines at about 19vw, and the screen becomes a full-width 3:2 frame between them.
- Along the bottom edge: the supporting sentence and a "See the work" button of at least 44px, with the Resume link beside it.

**Acceptance criteria:**
- [ ] The `h1` is one line at 1440 and 768px and two lines at 390px, with no sideways overflow at any width.
- [ ] A stranger can tell who this is, what he does and what to click from the first screen.
- [ ] The gate reports no hero fails: headline lines, eyebrow, title and off-centre. It counts the frame as a picture.

**Verification:**
- [ ] Run the gate and read the three fold screenshots.
- [ ] Measure the `h1` width as a share of the viewport at 1440, 1024 and 768px.

**Dependencies:** Task 4

**Files likely touched:** `index.html`

**Estimated scope:** Small

### Checkpoint A: first screen review
- [ ] Show Erik the hero at 390, 768 and 1440px, light and dark.
- [ ] Erik approves the direction before the sections are built.

---

## Part 2, Phase 2: sections

### Task 6: Work stage, with the tearing title, and the LabaLink and Seoul-Mate panels

**Description:** Build the "Title torn at the seam" stage.
- **Layout:** each project gets a sticky 100svh stage split at 50vw into two tall `data-ui` panels. The project title sits on the seam, set twice in one heading (the second copy `aria-hidden`), with each copy clipped to its half.
- **Motion:** while the project crosses the stage, the left panel and half-title travel up and the right ones travel down, meeting when the project is centred. This runs in the one rAF loop.
- **Below the title:** what the project is, the year, and its repo link.
- **Panels in this task:**
  - LabaLink: the Android app (QR start and wallet) beside the attendant dashboard.
  - Seoul-Mate: the staff stock toggle beside the phone menu in Korean.

**Acceptance criteria:**
- [ ] The halves line up exactly when the project is centred and visibly tear before and after it.
- [ ] With reduced motion the halves stay aligned and projects change by crossfade. On a phone the two strips keep the tear with no sideways scroll.
- [ ] Panel facts match the real apps (the same facts the old mock-ups showed), and the repo links work.

**Verification:**
- [ ] Run the gate with no new fails. A long-pin warning is fixed or defended in one sentence.
- [ ] Screenshots of the stage at 0%, 50% and 100% of each project, at 390 and 1440px.

**Dependencies:** Checkpoint A

**Files likely touched:** `index.html`

**Estimated scope:** Medium

### Task 7: PlayIT and InkHive panels, and the "Also built" list

**Description:**
- **PlayIT:** a phonics activity screen with the Marungko letter, sound caption and large touch targets, beside the Blend It word builder.
- **InkHive:** the teacher's board with per-student draw permissions, beside a student joining by code or QR. There is no live link.
- **Also built:** TaskFlow MVC, Hotel Management System, Blog Platform and MangaReader as a plain list after the stage (name, one line and language), with no cards.

**Acceptance criteria:**
- [ ] All four projects work in the stage the same way.
- [ ] The "Also built" list has every item and link from before.
- [ ] No outlined boxes, shadows or card grid.

**Verification:**
- [ ] Gate, console check, and screenshots at three widths.

**Dependencies:** Task 6

**Files likely touched:** `index.html`

**Estimated scope:** Medium

### Task 8: Proof: the test-name band and Try to break it

**Description:**
- **The band:** a full-bleed teal band of real test names, cropped at both edges and drifting left on a 40-second loop that pauses under reduced motion.
- **Under it:** the sentence about the 269 tests.
- **Try to break it:** seven attack choices, each showing the guard and its real test (the table in `SPEC-redesign.md`) with its project and "passed", announced to screen readers with `aria-live`.
- **Without JS:** the attacks show as a plain list with their tests.

**Acceptance criteria:**
- [ ] Every test name on screen is copied exactly from the old page's `SUITES` data.
- [ ] Try to break it works by tap and by keyboard, with visible focus.
- [ ] Without JS, everything is readable as a list.

**Verification:**
- [ ] Grep each shown test name against the old `SUITES` data.
- [ ] Keyboard-only run-through, then a reload with JS disabled.
- [ ] Gate.

**Dependencies:** Task 4

**Files likely touched:** `index.html`

**Estimated scope:** Medium

### Task 9: Skills: STACK and the six bars

**Description:**
- **STACK:** one giant word in a 520–640px column, sized in container units so it fills the column edge to edge.
- **The bars:** six filled `details` bars below it: Languages, Backend, Frontend & Mobile, Data, Cloud & AI, Security & Testing, and Tools. Each opens to list its skills with the project that uses each one, right-aligned. The first bar is open.

**Acceptance criteria:**
- [ ] STACK spans the column at 390, 768 and 1440px with no overflow.
- [ ] Every skill from the old skill map is present with its project, and Playwright appears nowhere.
- [ ] The bars open and close by keyboard and by tap.

**Verification:**
- [ ] Gate, console check, keyboard check.

**Dependencies:** Task 4

**Files likely touched:** `index.html`

**Estimated scope:** Small

### Task 10: About: side facts, paragraph and badges

**Description:**
- **Side facts:** From Masbate City, Studying BSIT at CIT-U Cebu City, Graduating 2027.
- **The paragraph:** a five-line paragraph from the 34% line.
- **The record:** the 3 badges with their real images in `assets/` (two AWS PNGs from `Desktop\CERTIFICATE`, and IBM's from its Credly page), each with its date and a "Verify on Credly" link, plus the relevant coursework.

**Acceptance criteria:**
- [ ] Each badge image has width, height and alt, is under about 200 KB, and links to the right Credly page.
- [ ] Dates and hours match the resume.

**Verification:**
- [ ] Click every Credly link.
- [ ] Gate, then check that the picture count includes the badges.

**Dependencies:** Task 4

**Files likely touched:** `index.html`, `assets/aws-cloud-foundations.png`, `assets/aws-genai-foundations.png`, `assets/ibm-ai-fundamentals.png`

**Estimated scope:** Small

### Task 11: Contact (the email as display type) and the KIRE footer

**Description:**
- **Contact:** the full screen inverts to teal. `eriksamuelbien@gmail.com` is one line of display type fitted margin to margin, as a mailto link that takes the accent on hover. On a phone it breaks after the @.
- **In the contact corners:** a sentence on what to write about; the phone (`tel:`) and city; and GitHub, LinkedIn and Resume.
- **Footer:** **KIRE** at full width, cropped at the bottom edge (not the top, which the gate fails), linking to github.com/thatguyKire. Below it: Masbate City and Cebu City, the section links, the © line and back to top.

**Acceptance criteria:**
- [ ] The email fits on one line from 768px up and two lines on a phone, with no overflow.
- [ ] The mailto, tel and social links all work.
- [ ] The KIRE link opens Erik's GitHub.

**Verification:**
- [ ] Gate, console check, and click every link.

**Dependencies:** Task 4

**Files likely touched:** `index.html`

**Estimated scope:** Small

### Checkpoint B: the whole page, without motion
- [x] The gate reports 0 FAIL at 1440, 768 and 390px. A "page barely moves" fail is allowed until Task 12.
- [x] First critique round written in the critique format. The top three problems are fixed.
- [x] Erik reviews the full-page screenshots (asked for Samuel in the name).

---

## Part 2, Phase 3: motion

### Task 12: Motion layer: shutter, screen cycling, entrances and control feedback

**Description:**
- **Signature:** the hero frame opens from one edge with a clip-path shutter over about 1.1s while the screen inside settles from 112% to 100%. It runs once.
- **The hero frame:** it then cycles slowly through the four app screens.
- **Entrances:** every section's heading, then text, then picture rise 16–32px with opacity, 60–90ms apart, once.
- **Controls:** press, hover and focus states on every button, link, bar and attack choice.
- **Rules:** transform and opacity only, in the one rAF loop or IntersectionObserver.

**Acceptance criteria:**
- [x] The gate counts at least 8 moving elements (target 16) and no motion fails. (81 at 1440, 84 at 768, 68 at 390)
- [x] With reduced motion there is no travel and all content is visible. With JS off all content is visible.
- [x] No layout shift from any entrance. (transforms, opacity and clip-path only; button sizes match with and without the label roll)

**Verification:**
- [x] Gate, plus screenshots with reduced motion and with JS disabled.

**Dependencies:** Checkpoint B

**Files likely touched:** `index.html`

**Estimated scope:** Medium

---

## Part 2, Phase 4: finish

### Task 13: Gate, critique and regression

**Description:** The final pass.
- Lint and inspect until there are 0 FAIL.
- Read every screenshot.
- Run up to three critique rounds, fixing the top three each time.
- Run the full `SPEC.md` checklist: console, 375px, 1366×768, themes, reduced motion, print, keyboard, and every link that worked before.
- Measure first-load weight.
- Update `README.md` for `assets/`.
- Write the before-and-after table into `SPEC-redesign.md`.

**Acceptance criteria:**
- [x] `lint.mjs` and `inspect.mjs` both report 0 FAIL, and every warning is fixed or defended in one sentence.
- [x] Every success criterion in both specs passes, and first load is under 1.5 MB. (about 310 KB; SPEC.md #11, the live URL, is checked in Task 14)
- [x] The critique for the last round is written down.

**Verification:**
- [x] The command outputs and screenshots, listed in the report to Erik.

**Dependencies:** Task 12

**Files likely touched:** `index.html`, `README.md`, `SPEC-redesign.md`

**Estimated scope:** Medium

### Task 14: Ship: merge to `main`, push, check live

**Description:** Fast-forward `main` to `redesign`, push, and confirm GitHub Pages serves the new page.

**Acceptance criteria:**
- [x] The live URL serves the redesign.
- [x] The resume download, the Credly links and the repo links work on the live site.

**Verification:**
- [x] `curl` the live page for a new-page string.
- [x] Console check on the live URL.

**Dependencies:** Task 13, and Erik's go-ahead at Checkpoint C

**Files likely touched:** none (git only)

**Estimated scope:** Small

### Checkpoint C: ready to ship
- [x] Erik has seen the finished page and says merge (2026-10-22: "you can merge it to main since i like this design better"). `main` was fast-forwarded to `faa7ac7` and pushed the same day.

## Phase 5: Upgrade

Erik, 2026-10-22: "the design is kind feel like too empty like on the background and the motion design is kind of bland too".

### Task 15: Fuller grounds
- [x] Colour by chapter, hard cuts: Proof (band and Try) on paper, Skills on a brighter teal field, Contact and footer stay paper. Both themes, AA contrast in each.
- [x] Each project in the details gets its own app screen under its name, showing that note's first claim.
- Verify: screenshots at 1440, 768 and 390 in both themes; inspector 0 FAIL.

### Task 16: A live work stage
- [x] When a project arrives on the stage its screens deal in row by row and play one beat: LabaLink's timer runs, Seoul-Mate's toggle flips and the menu's 품절 stamps a moment later, PlayIT's tiles drop into their slots, InkHive's strokes draw.
- Verify: slow-motion film of the stage; nothing hidden under reduced motion.

### Task 17: Entrances that differ with the content
- [x] Short headings rise letter by letter; the skill bars slide out from the left; the verdict panel opens; note pictures open like a shutter; the About paragraph fills with ink as it is read; lists arrive row by row.
- Verify: entrance film; screen readers still get whole headings; reduced motion shows the finished page.

### Task 18: Scroll moments
- [ ] The name pulls apart as the hero leaves; the test band answers the scroll's speed; BLOCKED stamps down and strikes the attempt through; the footer reads ERIK and swaps its letters into KIRE as it arrives.
- Verify: film of each moment; reduced motion and no-JS show the finished page.

### Task 19: Gate and ship
- [ ] check.sh all PASS, no console errors, no sideways scroll from 320 to 1440, print still whole.
- [ ] Merge to `main`, push, confirm the live page.
