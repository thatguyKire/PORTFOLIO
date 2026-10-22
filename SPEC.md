# Spec: Erik Bien Portfolio & Resume

Status: approved 2026-10-22 (all open questions answered)
Live: https://thatguykire.github.io/PORTFOLIO/

This file holds the rules that apply to every change. `SPEC-redesign.md` covers the new look and motion and must follow these rules.

## Objective

Give recruiters and internship reviewers one place to see what Erik builds, prove it is real, and contact him.

- **Who reads it:** recruiters and internship supervisors, often on a phone, often for under a minute. Some will print the page or download the resume.
- **What they should leave with:**
  - Erik ships tested, security-minded full-stack and Android apps.
  - The projects and numbers are real and can be checked.
  - How to reach him.
- **Two outputs, kept in sync:**
  - `index.html` is the interactive site.
  - `Bien_Resume.pdf` is the one-page resume the site links to.

### Assumptions

1. The site is a static page with no build step and no framework: one `index.html`, plus an `assets/` folder for images once the redesign adds pictures.
2. GitHub Pages serves `main` from the repo root. Pushing to `main` is publishing.
3. Erik is the only editor. There is no PR review, so the checks in this spec are the review.
4. Content must be true and checkable. Every number traces back to a repo, test suite or badge.

## Tech Stack

- **Site:** HTML, CSS and vanilla JavaScript in `index.html`.
- **External requests:** fonts from Google Fonts only. No JS libraries.
- **Resume:** `resume/resume.html`, printed to PDF with headless Chrome.
- **Hosting:** GitHub Pages at `thatguyKire/PORTFOLIO`, branch `main`, root folder.

## Commands

Run these from the repo root in Git Bash. PowerShell can't find `git` on this machine.

```bash
# Preview the site (opens in the default browser; fonts need internet)
start index.html

# Rebuild the resume PDF from its HTML source
"/c/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --disable-gpu \
  --no-pdf-header-footer \
  --print-to-pdf="C:\\Users\\Erik\\Desktop\\PORTFOLIO\\Bien_Resume.pdf" \
  "file:///C:/Users/Erik/Desktop/PORTFOLIO/resume/resume.html"

# The resume must be exactly one page (prints 1)
pdftotext Bien_Resume.pdf - | tr -cd '\f' | wc -c

# Content that must never appear on the site or the resume (prints nothing)
grep -niE 'psite|student congress|playwright|codechum|collaboard-z4sx' index.html resume/resume.html

# Publish (GitHub Pages updates about a minute later)
git push origin main

# Confirm the live site has the change
curl -s https://thatguykire.github.io/PORTFOLIO/ | grep -c "<text from the change>"
```

`bash check.sh` runs the content checks above plus the design gate and prints PASS, FAIL or SKIP for each. `bash check.sh --quick` skips the design gate, which takes about a minute.

## Project Structure

```
index.html          → the site: CSS in <style>, icons as SVG <symbol>s, JS in one IIFE at the end
assets/             → pictures the site shows (added by the redesign)
resume/resume.html  → resume source (Letter size, print CSS)
Bien_Resume.pdf     → generated from resume.html; commit it with every resume change
README.md           → what each file is
CLAUDE.md           → git commit and PR rules
SPEC.md             → this file: the rules for every change
SPEC-redesign.md    → the new look and motion
check.sh            → runs every check: bash check.sh (or --quick)
tasks/              → the build plan (plan.md) and task list (todo.md)
.gitignore          → keeps the design tool's working folder (.taste-skill/) out of git
```

The current page order is Nav, Hero with stats, Projects, Proof, Skills, Credentials and Contact. `SPEC-redesign.md` replaces this order.

## Code Style

**CSS:**
- Colors come only from tokens on `:root`.
- Dark is the default, even when the visitor's system is set to light, and also without JavaScript. Light mode is opt-in: the toggle sets `data-theme="light"`, which redefines the same tokens, and the choice is remembered in `localStorage`.
- Write mobile-first `min-width` breakpoints.
- Compact one-line rules are fine.

**JS:**
- Write ES5 in one strict IIFE: `var`, `function` and `Array.prototype` helpers.
- Use the `$` and `$$` query helpers.
- Mark each feature with a `/* ---------- name ---------- */` banner.
- Comments explain *why*, not what.

```js
/* ---------- split text into letters that rise one at a time ---------- */
// Screen readers get the plain text; the animated copy is hidden from them.
function splitLetters(el) { ... }
$$('.hero .split').forEach(splitLetters);
```

**Motion rules:**
- Content is readable with JS off. Animations are gated behind the `.js` class on `<html>`.
- `prefers-reduced-motion: reduce` turns motion off. JS checks `RM` before animating.
- All scroll effects run through one rAF scroll loop. Don't add a scroll listener per feature.
- `@media print` turns every effect off.

**Copy:**
- Plain, specific and first-person.
- Numbers must match their source.
- Name a project's tools only if the project really uses them.

## Testing Strategy

There is no test framework. Every change is checked against this list:

| Level | What | How |
|---|---|---|
| Content | Banned words and links are absent from the site and the resume | the `grep` command above |
| Content | Numbers match their sources | 34 (LabaLink) + 127 (InkHive) + 108 (Seoul-Mate) = 269. Project and badge counts match. |
| Runtime | No console errors | headless Chrome or DevTools, page loaded and scrolled to the bottom |
| Layout | No sideways scroll and nothing clipped | widths 375, 768 and 1280px, and a 1366×768 laptop |
| Themes | Dark by default, also when the system is light. The toggle switches to light and remembers it. Both are readable. | load with the system in light and in dark, then use the toggle and reload |
| Motion | Reduced motion shows all content with no movement | emulate `prefers-reduced-motion: reduce` |
| Print | Printing gives a clean static page | print preview |
| Resume | Exactly one page, and the links click through | the `pdftotext` command, then open the PDF |
| Live | GitHub Pages serves the new version | the `curl` command after pushing |

## Boundaries

**Always:**
- Keep the site and the resume in step. The projects, the order and the badges must match.
- Rebuild `Bien_Resume.pdf` whenever `resume/resume.html` changes, and commit both files.
- Run the content `grep` and the one-page check before committing.
- Follow `CLAUDE.md`: short imperative commit messages and no trailers or attribution lines.
- Check the live site after every push.

**Ask first:**
- Adding a JS library, CDN script, build step or framework.
- Adding, removing or reordering projects, badges or sections.
- Changing any number, date or claim about a project.
- Adding personal details beyond email and phone, such as an address, photo or birthday.
- Putting the InkHive live link back. Do this only after Erik says the Render deploy is updated.
- Rewriting history or force-pushing.

**Never:**
- Mention the Cebu ICT Student Congress (PSITE), on the site or the resume.
- Mention Playwright, on the site or the resume.
- Add the CodeChum course certificates (CSIT226, CSIT228).
- Link to the InkHive Render deploy, or claim InkHive is live, until Erik says it is updated.
- Invent or round up tests, users, dates or results.
- Add trackers, analytics or third-party embeds.
- Commit anything outside this repo's files, such as screenshots or scratch scripts.

## Success Criteria

Any change is done only when all of these pass.

1. The content `grep` prints nothing.
2. The resume PDF is exactly 1 page.
3. Every number on the site and the resume matches its source.
4. The site and the resume list the same 4 projects in the same order and the same 3 badges.
5. Each Credly link opens the right badge.
6. Erik's phone number (0920 243 7737) is on the resume and in the site's contact section, as a `tel:` link.
7. There are zero console errors on load and after scrolling to the bottom, in light and dark mode.
8. There is no sideways scroll at 375px.
9. With reduced motion, all text is visible and nothing animates.
10. Print preview shows every section with no blank or hidden content.
11. The live URL serves the latest commit within a few minutes of pushing.

## Content changes waiting to be made

These come from Erik's answers on 2026-10-22. They will be tasks in the plan.

- **Resume:** remove Playwright from the Seoul-Mate tools line and from Security & Testing.
- **Resume:** remove the InkHive Render address from the InkHive heading. Show the team's GitHub repo instead.
- **Resume:** replace the References section's names, phone numbers and emails with "Available on request."
- **Site:** remove the InkHive live-demo link and the "1 app live in production on Render" stat.
- **Site:** add the phone number to the contact section.

## Decisions

| # | Question | Answer |
|---|---|---|
| 1 | Playwright on the resume | Banned there too |
| 2 | Phone number | Erik's own number goes on the resume and the site |
| 3 | CodeChum certificates | Leave them off |
| 4 | InkHive live link | Remove it until the Render deploy is updated |
| 5 | Check script | Yes: `check.sh` |
| 6 | References on the resume | "Available on request", with no names, phones or emails |
| 7 | Dark mode | Dark by default; the toggle switches to light (changed from light-by-default at the first-screen review) |

