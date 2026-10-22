#!/usr/bin/env bash
# Runs every check in SPEC.md and prints PASS, FAIL or SKIP for each.
# Usage: bash check.sh           all checks, including the design gate (about a minute)
#        bash check.sh --quick   content checks only
cd "$(dirname "$0")" || exit 2

failed=0
pass() { printf 'PASS  %s\n' "$1"; }
fail() { printf 'FAIL  %s\n' "$1"; [ -n "$2" ] && printf '%s\n' "$2" | sed 's/^/      /'; failed=1; }
skip() { printf 'SKIP  %s (%s)\n' "$1" "$2"; }

BANNED='psite|student congress|playwright|codechum|collaboard-z4sx'

# 1. Banned content on the site and in the resume source
hits=$(grep -niE "$BANNED" index.html resume/resume.html)
if [ -z "$hits" ]; then pass "No banned words or links in index.html or resume.html"
else fail "Banned words or links found" "$(echo "$hits" | cut -c1-120 | head -5)"; fi

if command -v pdftotext >/dev/null; then
  # 2. The PDF matches its source: a stale PDF still carries what the HTML dropped
  hits=$(pdftotext Bien_Resume.pdf - | grep -niE "$BANNED")
  if [ -z "$hits" ]; then pass "No banned words or links in Bien_Resume.pdf"
  else fail "Banned words or links in Bien_Resume.pdf (rebuild it from resume.html)" "$hits"; fi

  # 3. One page
  pages=$(pdftotext Bien_Resume.pdf - | tr -cd '\f' | wc -c)
  if [ "$pages" -eq 1 ]; then pass "Resume is one page"
  else fail "Resume is $pages pages, should be 1"; fi
else
  skip "Resume PDF checks" "pdftotext not found"
fi

# 4. The suite counts on the resume add up to the total the site shows
laba=$(grep -oE '[0-9]+ backend tests' resume/resume.html | grep -oE '^[0-9]+')
ink=$(grep -oE '[0-9]+ tests \([0-9]+ security\)' resume/resume.html | grep -oE '^[0-9]+')
seoul=$(grep -oE '[0-9]+ unit tests' resume/resume.html | grep -oE '^[0-9]+')
if [ -n "$laba" ] && [ -n "$ink" ] && [ -n "$seoul" ]; then
  total=$((laba + ink + seoul))
  if grep -q "\b$total\b" index.html; then pass "Test total $laba + $ink + $seoul = $total appears on the site"
  else fail "Resume suites add up to $total, but the site never shows $total"; fi
else
  fail "Could not read the three suite counts from resume.html"
fi

# 5. The design gate: source lint and the real-browser inspector
T="$HOME/.claude/skills/design-taste-frontend/scripts"
if [ "$1" = "--quick" ]; then
  skip "Design gate" "--quick"
elif ! command -v node >/dev/null || [ ! -f "$T/inspect.mjs" ]; then
  skip "Design gate" "Node or the design-taste-frontend skill not found"
else
  lint=$(node "$T/lint.mjs" index.html 2>&1 | grep -E '^RESULT')
  case "$lint" in *" 0 FAIL"*) pass "Design lint: ${lint#RESULT: }" ;; *) fail "Design lint: ${lint#RESULT: }" ;; esac
  # The inspector walks at most 12 screens and this page is longer, so the entrances below that never
  # play during its walk. Its blank-gap rule is run instead by check-gaps.mjs over the whole page.
  insp=$(node "$T/inspect.mjs" index.html --out .taste-skill/check --allow blank-gap 2>&1 | grep -E '^RESULT')
  case "$insp" in *" 0 FAIL"*) pass "Design inspector: ${insp#RESULT: }" ;; *) fail "Design inspector: ${insp#RESULT: }" "screenshots in .taste-skill/check/" ;; esac
  gaps=$(node check-gaps.mjs "$T" index.html 2>&1)
  if [ $? -eq 0 ]; then pass "Whole page scrolled: ${gaps}"
  else fail "Blank stretches after scrolling the whole page" "$gaps"; fi
fi

exit $failed
