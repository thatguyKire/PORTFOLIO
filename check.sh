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
hits=$(grep -niE "$BANNED" index.html css/site.css js/site.js resume/resume.html)
if [ -z "$hits" ]; then pass "No banned words or links in the site or resume.html"
else fail "Banned words or links found" "$(echo "$hits" | cut -c1-120 | head -5)"; fi

if command -v pdftotext >/dev/null; then
  # 2. The PDF matches its source: a stale PDF still carries what the HTML dropped
  hits=$(pdftotext Erik_Samuel_Bien_Resume.pdf - | grep -niE "$BANNED")
  if [ -z "$hits" ]; then pass "No banned words or links in Erik_Samuel_Bien_Resume.pdf"
  else fail "Banned words or links in Erik_Samuel_Bien_Resume.pdf (rebuild it from resume.html)" "$hits"; fi

  # 3. One page
  pages=$(pdftotext Erik_Samuel_Bien_Resume.pdf - | tr -cd '\f' | wc -c)
  if [ "$pages" -eq 1 ]; then pass "Resume is one page"
  else fail "Resume is $pages pages, should be 1"; fi
else
  skip "Resume PDF checks" "pdftotext not found"
fi

# 4. The test counts the site shows match the resume's (Seoul-Mate is on the site only)
for pat in '[0-9]+ backend tests' '[0-9]+ tests \([0-9]+ security\)'; do
  site=$(grep -oE "$pat" index.html | sort -u)
  resume=$(grep -oE "$pat" resume/resume.html | sort -u)
  if [ -z "$site" ] || [ -z "$resume" ]; then fail "Could not find \"$pat\" on the site and in resume.html"
  elif [ "$site" = "$resume" ]; then pass "Test count \"$site\" is the same on the site and the resume"
  else fail "Test counts differ" "site: $site / resume: $resume"; fi
done

# 5. The design gate: source lint and the real-browser inspector
T="$HOME/.claude/skills/design-taste-frontend/scripts"
if [ "$1" = "--quick" ]; then
  skip "Design gate" "--quick"
elif ! command -v node >/dev/null || [ ! -f "$T/inspect.mjs" ]; then
  skip "Design gate" "Node or the design-taste-frontend skill not found"
else
  lint=$(node "$T/lint.mjs" index.html css/site.css js/site.js 2>&1 | grep -E '^RESULT')
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
