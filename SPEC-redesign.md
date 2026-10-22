# Spec: Portfolio redesign

Module id: `redesign` · Status: approved 2026-10-22 · Rules: everything in `SPEC.md` still applies

## Objective

The site reads as machine-made. Erik spotted the italic serif headline. A measured pass on 2026-10-22 found more:

- **Inspector:** 16 fails and 10 warnings at 1440, 768 and 390px. The results are saved in `.taste-skill/before/`.
- **Source lint:** 50 fails and 22 warnings.

| What the tools found on the current site | Where |
|---|---|
| Italic serif accent words in 4 headlines, and 3 typefaces | hero, section headings |
| A pill label above the name, and small caps labels above every heading | "Open to internship opportunities", "Toolkit", "Learning" |
| Monospace captions | school, city and class year line |
| Index numbers | "01 / 04" … "04 / 04" |
| 22 boxes with 1px outlines, hairline dividers, dot-grid gradients | project demos, stats, marquee |
| Shadows on cards at rest | project cards |
| The cream-and-terracotta palette, plus violet | whole page |
| Emoji used as UI | ✎ ✦ ✓ |
| 58 pieces of text under 13px, and 22 font sizes | everywhere |
| No real pictures (0) | whole page |

**Goal:** rebuild the look and the motion of `index.html`, keeping all the real content. The new page should feel designed for Erik and nobody else, and it must pass the design gate with zero fails.

**Skills that drive the work:**
- `design-taste-frontend`: the art direction, the gate and the critique.
- `frontend-ui-engineering`: accessibility, states and production quality.
- `incremental-implementation`: building one section at a time and checking each.

## The direction

Dealt by the design tool on 2026-10-22, seed `105366155`. The full sheet is saved in `.taste-skill/direction.json`.

**Direction: the name as a monument.** The name is set so large it becomes the structure of the first screen. Everything after it is calm and smaller, so the contrast holds.

Why this one over the other two dealt options:
- *Contact sheet* needs dozens of real pictures, and the project doesn't have them.
- *Type-only statement* is closest to the current hero, a big sentence, which is the look being replaced.
- The monument can carry something only Erik has (see The idea).

| | |
|---|---|
| **Type** | **TikTok Sans**, one variable family. The display is weight 800, stretched to 150% width, in capitals with tight tracking. Body text is normal width at weight 400. **No italics anywhere, no serif, no monospace.** |
| **Type sizes** | Five only: the monument, section heading (28–40px), lead (20–26px), body (17–19px), small (13–14px). |
| **Colour** | **Teal on paper.** Ground `#f7f9f8`, surface `#ebf0ee`, ink `#06525c`, soft ink `#2f737d`. Teal is used for every word and shape, with no black. The accent is the same teal filled solid, on the one button and the inverted closing band. |
| **Dark mode** | Dark by default, whatever the visitor's system setting: the same roles inverted, deep teal `#05333a` ground and paper-white `#eef5f3` text. The toggle switches to light (teal on paper) and remembers the choice. |
| **Shape** | Square corners everywhere. One button style: solid teal, square, 44px tall or more. |
| **Frame** | One pair of tight outer margins (20–32px) on every section. Sections are 120–240px apart on desktop. |

## The idea

> On this page, **Erik's own name, which his handle *thatguyKire* spells backwards,** becomes **the monument**. **ERIK SAMUEL BIEN** opens the page at full width, and **KIRE** closes it at full width in the footer, linking to the GitHub where the code lives.

**Competitor test:** put any other student's name in that sentence and it stops working. The reversal only belongs to Erik.

**The one live thing: "Try to break it."** The site's main claim is that Erik tests his apps by attacking them.
- The visitor picks an attack. The page shows the guard that stops it and the real test that proves it, with its real name, its project and "passed".
- Every attack maps to a real test. These names are already in the current page's data, copied from the repos:

| Attack | Project | Real test |
|---|---|---|
| Send a tampered login token | LabaLink | `tamperedAndRevokedTokensAreRejected` |
| Keep guessing a password | InkHive | `test_lockout_after_five_failures_even_with_right_password` |
| Upload a web page renamed as a photo | InkHive | `test_html_disguised_as_image_rejected` |
| Fake a Stripe payment | LabaLink | `forgedWebhooksAreRejected` |
| Flood the whiteboard with messages | InkHive | `test_flooding_is_capped_and_garbage_ignored` |
| Sign up as an admin | InkHive | `test_cannot_sign_up_as_admin` |
| Type SQL into the menu search | Seoul-Mate | "treats markup and SQL as plain text that matches nothing" |

- It works with a thumb on a phone. Without JavaScript it shows as a plain list.

## The page, claim by claim

Each section exists because it proves one claim. The blueprint is the section layout the design tool dealt for that slot.

| # | Section | Claim | Proof on the page | Blueprint |
|---|---|---|---|---|
| 1 | **Hero** | Erik builds web and Android apps and tests them until they hold. | The full name in two lines, each fitted margin to margin: **ERIK [screen]**, then **SAMUEL BIEN**. A screen from his own apps fills the rest of the first line and changes from app to app. On phones and portrait tablets it stacks: ERIK, the screen, SAMUEL BIEN. Below it, one sentence: *"4th-year IT student who builds web and Android apps, then tries to break them. Open to internships."* One button, "See the work", and a Resume link. | Photograph for a letter |
| 2 | **Work** | Four real apps, each shown by its own interface. | A pinned stage per project with two tall panels. The project title sits on the seam between them in giant capitals. As you scroll, the left half travels up and the right half travels down, so the title "tears" and lines up again when the project is centred. Under each title: what it is, the year, and its repo link. Then "Also built" as a plain list: TaskFlow MVC, Hotel Management System, Blog Platform and MangaReader. | Title torn at the seam |
| 3 | **Proof** | It isn't done until the tests have tried to break it. | A full-width teal band of real test names, cropped by both screen edges and drifting slowly left. Under it: *"Real names from the 269 tests across LabaLink, InkHive and Seoul-Mate. All passing."* Then **Try to break it**. | Names running off the edges |
| 4 | **Skills** | The stack is used, not listed. | One giant word, **STACK**, filling the column edge to edge. Under it, six bars that open in place: Languages, Backend, Frontend & Mobile, Data, Cloud & AI, Security & Testing, and Tools. Each skill appears with the project that uses it, aligned right where a menu would show the price. | Giant word, filled bar rows |
| 5 | **About** | A real student with real, verifiable training. | Side facts: From Masbate City · Studying BSIT at CIT-U, Cebu City · Graduating 2027. Next to them, a short paragraph about how Erik works. Below, the record: the 3 badges with their real badge images, dates and Credly links, plus the relevant coursework. | Side facts, wide paragraph |
| 6 | **Contact** | Easy to reach. | The full screen inverts to teal. `eriksamuelbien@gmail.com` is set as one line of display type, and the whole line is a mailto link. In the corners: the phone number with the city, and GitHub, LinkedIn and Resume. | The email as display type |
| 7 | **Footer** | The page closes on the handle. | **KIRE** at full width, cropped at the bottom edge, linking to github.com/thatguyKire. Under it: Masbate City and Cebu City, the section links, "© 2026 Erik Samuel L. Bien", back to top, and the credit line for any found pictures. | Name first, places under it |

### What stays

All real content stays:
- the 4 main projects and the 4 smaller ones, with every repo link
- the test numbers and the skill-to-project mapping
- the 3 badges with their Credly links, and education
- email, GitHub, LinkedIn and the resume download

Behaviour that stays: the dark mode toggle, reduced-motion support, print styles, the no-build setup and having no JS library.

### What goes

| Removed | Replaced by |
|---|---|
| Fraunces, Inter and JetBrains Mono, and every italic accent word | TikTok Sans only |
| "Open to internship opportunities" pill, and the small labels above headings | the same information inside the hero sentence and the headings |
| "01 / 04" numbering, emoji, outlined boxes, dot grids, shadows | space, size and tone steps |
| The 4-number stats row | each number moves next to its proof: 269 in the Proof section, the badge count in About |
| The hero whiteboard ink trail ("psst, this header is a whiteboard") | the monument name and the shutter reveal |
| The 269-dot scroll-driven test run | the test-name band and Try to break it |
| The skills marquee | the test-name band, the only moving line of text on the page |
| The card grid for "Also built" | a plain list in the Work section |

## Pictures

The design tool requires **at least 4 real pictures** on the page, and 6–12 is normal. SVG drawings don't count.

There are no photos of Erik and no app screenshots yet. Found photos of places are not used. So the pictures are Erik's own interfaces, rebuilt in HTML, plus his real badge images. The design tool counts interface fragments as pictures when they carry `data-ui`.

| Where | Picture | Source |
|---|---|---|
| Hero, beside ERIK | A crop of one of his app screens in a landscape frame one cap-height tall, changing between the four apps | rebuilt in HTML |
| Work, 2 tall panels per project (8 in all) | The current mock-ups rebuilt as tall panels in each app's real look: LabaLink's Android app beside its attendant dashboard, the Seoul-Mate staff stock toggle beside the phone menu in Korean, a PlayIT phonics screen beside Blend It, and the InkHive teacher board beside a student joining by code | rebuilt in HTML |
| About | The 3 badge images. The two AWS PNGs are in `Desktop\CERTIFICATE`. IBM's comes from its Credly badge page. | Erik's own |

When Erik has a professional photo or real screenshots, they replace these with no layout change.

Rules:
- Square corners and one treatment for every picture.
- Every image has width, height and alt text. Images below the first screen use `loading="lazy"`.
- Each image is under about 200 KB, stored in `assets/`.
- A found photo is never presented as Erik's own work, place or person.
- A rebuilt mock-up is never captioned as a screenshot.

## Motion

Motion is built in two passes. The page must look finished with all motion off, then the motion layer goes on top.

| Part | What moves | Reduced motion |
|---|---|---|
| **Signature** | The hero picture opens from one edge with a clip-path shutter over about 1.1s while the photo inside settles from 112% to 100% scale. It runs once and is the page's one loud moment. | The picture is simply there |
| **Work tear** | Scroll-linked: panels move ±20% of screen height and title halves ±30%, meeting exactly when the project is centred. | The halves stay aligned and the projects crossfade |
| **Test-name band** | A slow 40-second loop drifting left | Paused |
| **Section entrances** | In every section the heading, then the text, then the picture rise 16–32px and fade in, 60–90ms apart, once. Content stays visible if the script fails. | Shown at rest |
| **Controls** | Press, hover and focus feedback on every button, link, skill bar and attack choice. The contact email line turns to the accent colour on hover. | Colour changes only |
| **Try to break it** | Choosing an attack plays a short blocked-then-passed sequence. | The result shows instantly |

**Motion rules:**
- Animate transform and opacity only.
- All scroll effects share the existing single rAF loop.
- The design inspector must count at least 8 elements that move on load and scroll; the target is 16.

## Commands

As well as the ones in `SPEC.md`:

```bash
T=~/.claude/skills/design-taste-frontend/scripts

# Source lint for generated-page tells (before: 50 FAIL)
node $T/lint.mjs index.html

# Real-browser gate at 1440, 768 and 390px, with screenshots (before: 16 FAIL)
node $T/inspect.mjs index.html --out .taste-skill/after

# Re-print the direction sheet while building
node $T/draw.mjs --show
```

## Code Style

Follow `SPEC.md`: ES5 in one IIFE, tokens on `:root`, banner comments.

The new token names come from the direction sheet:

```css
:root {
  --bg: #f7f9f8; --surface: #ebf0ee; --ink: #06525c; --muted: #2f737d;
  --accent: #06525c; --accent-ink: #f7f9f8;
  --step-small: clamp(0.8125rem, 0.79rem + 0.1vw, 0.875rem);
  --step-body: clamp(1.0625rem, 1rem + 0.25vw, 1.1875rem);
  --step-lead: clamp(1.25rem, 1.1rem + 0.7vw, 1.625rem);
  --step-head: clamp(2rem, 1.3rem + 3.2vw, 4rem);
}
.monument { font: 800 clamp(96px, 10.5vw, 168px)/0.9 "TikTok Sans"; font-stretch: 150%; letter-spacing: -0.04em; text-transform: uppercase; }
```

## Testing Strategy

1. **Before.** Already recorded in `.taste-skill/before/`.
2. **Per section.** Build the section, run `inspect.mjs`, look at the screenshots at all three widths, then fix.
3. **Gate.** `lint.mjs` and `inspect.mjs` both report zero fails. Every warning is fixed or defended in one sentence.
4. **Critique.** Up to three rounds using the design tool's critique format, written down, fixing the top three problems each round.
5. **Regression.** Every check in `SPEC.md`, plus clicking every link that worked before: repos, Credly, resume, mailto and tel.
6. **Keyboard.** Every link, button, skill bar and attack choice is reachable by Tab and shows a visible focus ring.

## Boundaries

**Always:**
- Adopt the dealt direction. Redraw a part only for a reason you can state, and record it here.
- Keep every real fact.
- Credit every found picture in the footer.
- Build one section at a time and check it before moving on.

**Ask first:**
- Dropping or merging any section or project.
- Using a found photo in the hero.
- Adding any library, such as GSAP or Lenis. None is planned.
- Changing any claim in the copy.

**Never:**
- Italic or serif accent words, labels above headings, monospace, index numbers, hairlines, gradients or shadows at rest.
- Fake screenshots presented as real.
- A found photo presented as Erik or his work.
- A second font family.

## Success Criteria

1. `inspect.mjs` reports **0 FAIL** at 1440, 768 and 390px. It was 16 before.
2. `lint.mjs` reports **0 FAIL**. It was 50 before.
3. The whole page uses one font family, TikTok Sans, and has no italic text.
4. In 5 seconds, a stranger looking at the first screen can say who this is, what he does and what to click.
5. At least 4 real pictures, every found one credited.
6. At least 8 moving elements, each with a reduced-motion fallback.
7. Try to break it works by tap and by keyboard, uses only real test names, and shows as a plain list without JS.
8. Every success criterion in `SPEC.md` still passes.
9. First load, with fonts and images, is under 1.5 MB.

## Decisions

Erik answered these on 2026-10-22.

| # | Question | Answer |
|---|---|---|
| 1 | Photo of Erik for the hero | None yet. Use no found city photo either. The hero frame shows his own app screens. |
| 2 | App screenshots | None. Rebuild the mock-ups as panels. |
| 3 | Remove the ink trail, the dot test run and the stats row | Yes |
| 4 | Dark mode | Dark by default; the toggle switches to light. Changed from light-by-default at the first-screen review. |
| 5 | First screen (Checkpoint A) | Direction approved |
| 6 | The full name (Checkpoint B) | Add Samuel: the hero reads ERIK [screen] / SAMUEL BIEN, and the nav, page title and social title say Erik Samuel Bien. Approved to go on to the motion layer. |
| 7 | The design gate on a long page | The inspector photographs at most 12 screens and this page is 13 to 15, so the entrances further down never play during its walk. check.sh runs it with `--allow blank-gap` and runs that same rule over the whole page in `check-gaps.mjs`, after a real wheel scroll to the bottom. |
