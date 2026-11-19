# Erik Samuel Bien — Portfolio

Personal portfolio site: **https://thatguyKire.github.io/PORTFOLIO/**

- `index.html` — the site's content (no build step; it opens straight from disk)
- `css/site.css` — every style
- `js/site.js` — every script
- `assets/` — the three badge images, taken from each badge's public Credly record
- `assets/playit/` — the nine PlayIT screens in the site's Showcase, rendered by the app's own screenshot tests (the `*_phone.png` files they write to `app/build/outputs/roborazzi/` in the team repo), resized to 548 × 1188 WebP
- `Erik_Samuel_Bien_Resume.pdf` — current resume
- `resume/resume.html` — resume source; print it to PDF to regenerate `Erik_Samuel_Bien_Resume.pdf`
- `check.sh` — run `bash check.sh` before committing; it checks the content rules in `SPEC.md` and the design gate
- `check-gaps.mjs` — used by `check.sh`: the design gate's blank-gap rule run over the whole page, which is longer than the 12 screens the gate photographs
