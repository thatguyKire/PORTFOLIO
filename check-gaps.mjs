// The design inspector's blank-gap rule, run over the whole page.
// The inspector photographs at most 12 screens, and this page is 13 to 15 screens long, so the section
// entrances below that point never play during its walk and their parts would read as blank. This
// scrolls each width to the very bottom with the wheel, as a visitor does, then applies the same rule
// from the skill's own library.
// Usage: node check-gaps.mjs <design-taste-frontend/scripts> <page.html>
// Exit code 0 = no blank stretch at any width.
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const [dir, file] = process.argv.slice(2);
const lib = (name) => import(pathToFileURL(resolve(dir, 'lib', name)).href);
const { Browser, sleep } = await lib('cdp.mjs');
const { layout } = await lib('probe.mjs');
const { judgeLayout } = await lib('rules.mjs');

const sizes = [[1440, 900], [768, 1024], [390, 844]];
const browser = await Browser.launch();
const found = [];
try {
  for (const [w, h] of sizes) {
    const page = await browser.newPage({ width: w, height: h, dsf: 1, mobile: w < 600 });
    await page.goto(pathToFileURL(resolve(file)).href, { settleMs: 600 });
    await page.eval('document.fonts.ready.then(() => true)');
    const height = await page.eval('document.documentElement.scrollHeight');
    await page.wheel(height + h, { step: Math.round(h / 3), pauseMs: 120 });
    await sleep(2000);
    await page.eval(`window.scrollTo({ top: 0, behavior: 'instant' })`);
    await sleep(350);
    const lay = await page.eval(layout);
    for (const f of judgeLayout(lay, { width: w })) if (f.id === 'blank-gap') found.push(`${f.level} at ${w}: ${f.message}`);
    await page.close();
  }
} finally {
  await browser.close();
}
console.log(found.length ? found.join('\n') : 'No blank stretch at 1440, 768 or 390 after scrolling the whole page.');
process.exit(found.some((f) => f.startsWith('FAIL')) ? 1 : 0);
