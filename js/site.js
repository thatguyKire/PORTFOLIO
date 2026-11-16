(function () {
  'use strict';
  var root = document.documentElement;
  var RM = matchMedia('(prefers-reduced-motion: reduce)').matches;

  function $(s, el) { return (el || document).querySelector(s); }
  function $$(s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  /* ---------- theme: dark unless the visitor picked light ---------- */
  // The control is a switch named "Light mode": on is the light page, off the dark one. The bar and the
  // menu each have one, and both always show the same state.
  var themeBtns = $$('.theme');
  function paintTheme() {
    themeBtns.forEach(function (b) { b.setAttribute('aria-checked', String(root.getAttribute('data-theme') === 'light')); });
  }
  themeBtns.forEach(function (b) {
    b.addEventListener('click', function () {
      var light = root.getAttribute('data-theme') !== 'light';
      if (light) root.setAttribute('data-theme', 'light'); else root.removeAttribute('data-theme');
      try { localStorage.setItem('theme', light ? 'light' : 'dark'); } catch (e) {}
      paintTheme();
    });
  });
  paintTheme();

  /* ---------- the menu, below 1024px: a modal sheet that drops from the bar ---------- */
  // A section link lifts the sheet off the section it has already scrolled to, then focus moves to that
  // section, so the next Tab carries on from there rather than from the bar at the top.
  var menu = $('#menu'), menuBtn = $('.menu-btn'), menuShut = 0;
  if (root.classList.contains('has-menu')) {
    var openMenu = function () {
      clearTimeout(menuShut);
      menu.style.setProperty('--nav-h', $('.nav').offsetHeight + 'px');
      menu.showModal();
      menuBtn.setAttribute('aria-expanded', 'true');
      // two frames, so the sheet is painted shut before it drops
      requestAnimationFrame(function () { requestAnimationFrame(function () { menu.classList.add('is-open'); }); });
    };
    var closeMenu = function (then) {
      menu.classList.remove('is-open');
      menuShut = setTimeout(function () {
        if (menu.open) menu.close();
        if (then) then();
      }, RM ? 0 : 300);
    };
    menuBtn.addEventListener('click', openMenu);
    $('.menu-close').addEventListener('click', function () { closeMenu(); });
    // Escape asks to close: play the same lift instead of vanishing
    menu.addEventListener('cancel', function (e) { e.preventDefault(); closeMenu(); });
    menu.addEventListener('close', function () { menu.classList.remove('is-open'); menuBtn.setAttribute('aria-expanded', 'false'); });
    $$('a[href^="#"]', menu).forEach(function (a) {
      a.addEventListener('click', function (e) {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        var target = document.getElementById(a.getAttribute('href').slice(1));
        if (!target) return;
        e.preventDefault();
        if (location.hash === a.hash) target.scrollIntoView(); else location.hash = a.hash;
        closeMenu(function () {
          if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
          target.focus({ preventScroll: true });
        });
      });
    });
    // the sheet belongs to the narrow bar; widening past it puts the tabs back and closes the sheet
    var wideMq = matchMedia('(min-width: 1024px)');
    var onWide = function () { if (wideMq.matches && menu.open) { clearTimeout(menuShut); menu.close(); } };
    if (wideMq.addEventListener) wideMq.addEventListener('change', onWide); else wideMq.addListener(onWide);
  }

  $('#yr').textContent = new Date().getFullYear();

  /* ---------- copy email ---------- */
  var copyBtn = $('#copy');
  copyBtn.addEventListener('click', function () {
    var done = function () { copyBtn.textContent = 'Copied'; setTimeout(function () { copyBtn.textContent = 'Copy email'; }, 1600); };
    if (navigator.clipboard) navigator.clipboard.writeText(copyBtn.getAttribute('data-copy')).then(done, function () {});
  });

  /* ---------- LabaLink's Washer 03: one clock, shown in the hero and twice on the work stage ---------- */
  // Each place that shows it asks for a tick every second while it is in view; a tick less than 0.9s
  // after the last is dropped, so the clock never runs fast when two of them are on screen.
  var washer = { secs: 42 * 60 + 18, at: 0, els: $$('[data-clock]') };
  function tickWasher() {
    var now = Date.now();
    if (now - washer.at < 900) return;
    washer.at = now;
    washer.secs = Math.max(0, washer.secs - 1);
    var t = Math.floor(washer.secs / 60) + ':' + ('0' + washer.secs % 60).slice(-2);
    washer.els.forEach(function (el) { el.textContent = t; });
  }

  /* ---------- work: the title tears at the seam as each project crosses the stage ---------- */
  // t is a project's position on the stage: -1 arriving, 0 centred, +1 leaving. The halves hold aligned
  // for |t| < 0.15 so the line under the title can be read, then tear. Projects hand over at t = ±0.5,
  // at full tear, with a short CSS fade; the first arrives and the last leaves over a longer run.
  var track = $('.track');
  var layers = $$('.layer').map(function (el) {
    // each screen's rows are numbered for the deal, the right screen a step behind the left
    $$('.pane', el).forEach(function (pane, side) {
      $$('.ui-top > *, .ui-bot > *', pane).forEach(function (row, i) { row.style.setProperty('--d', Math.min(i + side, 5)); });
    });
    return { el: el, l: $$('.pane.l, .half.l', el), r: $$('.pane.r, .half.r', el), meta: $('.layer-meta', el), live: false };
  });
  // A project is live while it is on the stage and the stage covers the middle of the screen. Each time it
  // goes live its screens deal in again; LabaLink's clock runs while it is live, wherever it sits in the order.
  var stageClock = null, clockLayer = layers.filter(function (o) { return $('[data-clock]', o.el); })[0];
  function setLive(o, live) {
    if (o.live === live) return;
    o.live = live;
    if (RM) return;
    o.el.classList.remove('deal');
    if (live) { void o.el.offsetWidth; o.el.classList.add('deal'); }
    if (o === clockLayer) runStageClock();
  }
  function runStageClock() {
    var go = !!clockLayer && clockLayer.live && !document.hidden;
    if (go && !stageClock) stageClock = setInterval(tickWasher, 1000);
    if (!go && stageClock) { clearInterval(stageClock); stageClock = null; }
  }
  document.addEventListener('visibilitychange', runStageClock);
  function tearFrame() {
    var box = track.getBoundingClientRect(), vh = innerHeight;
    var seen = box.top < vh / 2 && box.bottom > vh / 2;
    if (box.bottom < -vh || box.top > 2 * vh) { layers.forEach(function (o) { setLive(o, false); }); return; }
    var p = -box.top / (0.95 * vh), last = layers.length - 1;
    layers.forEach(function (o, i) {
      var t = p - i, edge = (i === 0 && t < 0) || (i === last && t > 0);
      var f = RM ? 0 : (t < 0 ? -1 : 1) * clamp((Math.abs(t) - 0.15) / (edge ? 0.85 : 0.35), 0, 1);
      var shown = edge || (t >= -0.5 && t < 0.5);
      o.el.classList.toggle('is-on', shown);
      setLive(o, shown && seen);
      if (!shown) return;
      // the line under the title lies in the halves' path, so it only shows while they hold aligned
      o.meta.classList.toggle('is-off', f !== 0);
      // panes travel 20svh, title halves 30svh, in opposite directions
      o.l[0].style.transform = 'translate3d(0,' + (-f * 20) + 'svh,0)';
      o.r[0].style.transform = 'translate3d(0,' + (f * 20) + 'svh,0)';
      o.l[1].style.transform = 'translate3d(0,' + (-f * 30) + 'svh,0)';
      o.r[1].style.transform = 'translate3d(0,' + (f * 30) + 'svh,0)';
    });
  }

  /* ---------- showcase: a strip of real screens that runs off the screen edges ---------- */
  // The strip scrolls by itself (swipe, trackpad, arrow keys, its own bar); the two arrows move it a
  // screenful for a mouse that only has a wheel. Each screen is watched for being wholly in view, 16px
  // clear of the screen edges: its caption shows only then, so words are never cut by the edge, and an
  // arrow rests while the first or the last screen is whole. The strip needs no scroll listener of its own.
  $$('.show').forEach(function (show) {
    var reel = $('.reel', show), btns = $$('.reel-btn', show), items = $$('li', reel), last = items.length - 1;
    if (last < 1) return;
    btns.forEach(function (b, i) {
      b.addEventListener('click', function () {
        if (b.getAttribute('aria-disabled') === 'true') return;
        // one screen and its gap, times the screens that fit whole between the margins
        var step = items[1].offsetLeft - items[0].offsetLeft, gap = step - items[0].offsetWidth;
        var room = reel.clientWidth - 2 * parseFloat(getComputedStyle(reel).paddingLeft);
        reel.scrollBy({ left: (i ? 1 : -1) * Math.max(1, Math.floor((room + gap) / step)) * step, behavior: RM ? 'auto' : 'smooth' });
      });
    });
    if (!('IntersectionObserver' in window)) return;
    var whole = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var is = e.intersectionRatio > 0.98, at = items.indexOf(e.target);
        e.target.classList.toggle('is-whole', is);
        if (btns.length > 1 && (at === 0 || at === last)) btns[at ? 1 : 0].setAttribute('aria-disabled', String(is));
      });
    }, { root: reel, rootMargin: '0px -16px', threshold: [0.98, 1] });
    items.forEach(function (li) { whole.observe(li); });
    reel.classList.add('is-live');
  });

  /* ---------- proof band: a steady reading speed whatever the names' length ---------- */
  var bandTrack = $('.band-track');
  if (bandTrack) bandTrack.style.setProperty('--band-dur', Math.round(bandTrack.scrollWidth / 2 / 110) + 's');

  /* ---------- proof band: the names run at reading speed and answer the scroll ---------- */
  // With motion on, the script takes over from the CSS loop. The names run left at 110px a second; the
  // scroll's speed is added in its own direction (scrolling back up runs them backwards) and eases off in
  // about a second. They stop under a mouse pointer, and rest off screen and in a hidden tab.
  var band = $('.band'), bandX = 0, bandKick = 0, bandLast = 0, bandSeen = false, bandHover = false, bandRaf = 0, lastScroll = scrollY;
  function bandStep(t) {
    bandRaf = 0;
    var dt = bandLast ? Math.min(t - bandLast, 64) / 1000 : 0, half = bandTrack.scrollWidth / 2;
    bandLast = t;
    bandX -= ((bandHover ? 0 : 110) + bandKick) * dt;
    bandKick *= Math.pow(0.03, dt);
    bandX %= half;
    if (bandX > 0) bandX -= half;
    bandTrack.style.transform = 'translate3d(' + bandX.toFixed(1) + 'px,0,0)';
    runBand();
  }
  function runBand() {
    if (bandSeen && !document.hidden) { if (!bandRaf) bandRaf = requestAnimationFrame(bandStep); return; }
    if (bandRaf) cancelAnimationFrame(bandRaf);
    bandRaf = 0;
    bandLast = 0;
  }
  function bandScroll() {
    var dy = scrollY - lastScroll;
    lastScroll = scrollY;
    if (bandSeen) bandKick = clamp(bandKick + dy * 6, -2000, 2000);
  }
  if (bandTrack && !RM && 'IntersectionObserver' in window) {
    bandTrack.style.animation = 'none';
    new IntersectionObserver(function (e) { bandSeen = e[0].isIntersecting; runBand(); }).observe(band);
    band.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') bandHover = true; });
    band.addEventListener('pointerleave', function () { bandHover = false; });
    document.addEventListener('visibilitychange', runBand);
  }

  /* ---------- try to break it ---------- */
  // Without JS the list shows every attack with its guard and test. With JS each attack becomes a
  // choice, and the verdict panel plays a short "trying, then blocked" beat before showing the proof.
  var attackList = $('#attacks'), verdict = $('#verdict');
  if (attackList && verdict) {
    var v = {
      tryLine: $('.v-try', verdict), guard: $('.v-guard', verdict),
      test: $('[data-v="test"]', verdict), project: $('[data-v="project"]', verdict), say: $('[data-v="say"]', verdict)
    };
    var attacks = $$('li', attackList).map(function (li) {
      var a = { name: $('.atk-name', li).textContent, guard: $('.atk-guard', li).textContent, test: $('code', li).textContent, project: li.getAttribute('data-project') };
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'atk'; b.textContent = a.name; b.setAttribute('aria-pressed', 'false');
      li.textContent = ''; li.appendChild(b);
      a.button = b;
      return a;
    });
    var beat;
    var pick = function (i, quiet) {
      var a = attacks[i];
      attacks.forEach(function (o) { o.button.setAttribute('aria-pressed', String(o === a)); });
      clearTimeout(beat);
      v.tryLine.textContent = 'You try to ' + a.name.charAt(0).toLowerCase() + a.name.slice(1) + '.';
      var land = function () {
        v.guard.textContent = a.guard;
        v.test.textContent = a.test;
        v.project.textContent = a.project;
        verdict.classList.remove('is-trying');
        if (!quiet) {
          verdict.classList.add('is-landed');
          v.say.textContent = 'Blocked. ' + a.guard + ' Proved by the test ' + a.test + ' in ' + a.project + '. Passed.';
        }
      };
      if (quiet || RM) { land(); return; }
      verdict.classList.remove('is-landed');
      verdict.classList.add('is-trying');
      beat = setTimeout(land, 520);
    };
    attacks.forEach(function (a, i) { a.button.addEventListener('click', function () { pick(i); }); });
    attackList.classList.add('is-live');
    verdict.hidden = false;
    pick(Math.floor(Math.random() * attacks.length), true);
  }

  /* ---------- hero: the screen beside ERIK runs through the four apps ---------- */
  // Every four seconds the next app pushes the last one out from the same edge; LabaLink's clock counts
  // down while it shows. None of it runs under reduced motion, and it pauses off screen or in a hidden tab.
  var crops = $$('.shot .crop');
  if (crops.length && !RM) {
    var at = 0, beats = 0, ticker = null, heroSeen = true;
    var clockAt = crops.map(function (c) { return !!$('[data-clock]', c); }).indexOf(true);
    var nextApp = function () {
      var old = crops[at];
      at = (at + 1) % crops.length;
      crops.forEach(function (c) { c.classList.remove('was-on'); });
      old.classList.remove('is-on', 'wipe');
      old.classList.add('was-on');
      crops[at].classList.add('is-on', 'wipe');
      old.addEventListener('animationend', function done(e) {
        if (e.animationName !== 'gone') return;
        old.removeEventListener('animationend', done);
        old.classList.remove('was-on');
      });
    };
    var beat = function () {
      if (at === clockAt) tickWasher();
      if (++beats % 4 === 0) nextApp();
    };
    var runApps = function () {
      var go = heroSeen && !document.hidden;
      if (go && !ticker) ticker = setInterval(beat, 1000);
      if (!go && ticker) { clearInterval(ticker); ticker = null; }
    };
    if ('IntersectionObserver' in window) new IntersectionObserver(function (e) { heroSeen = e[0].isIntersecting; runApps(); }).observe($('.shot'));
    document.addEventListener('visibilitychange', runApps);
    runApps();
  }

  /* ---------- hero: the name pulls apart as it leaves ---------- */
  // While the hero scrolls away, ERIK and its screen drift left and SAMUEL BIEN drifts right, up to 8% of
  // the line's width, locked to the scrollbar: a first tear before the work stage tears each title.
  var hero = $('.hero'), nameA = $('.name-a'), nameB = $('.name-b'), heroP = -1;
  function heroFrame() {
    if (RM) return;
    var p = clamp(scrollY / hero.offsetHeight, 0, 1);
    if (p === heroP) return;
    heroP = p;
    nameA.style.transform = p ? 'translate3d(' + (-8 * p).toFixed(2) + '%,0,0)' : '';
    nameB.style.transform = p ? 'translate3d(' + (8 * p).toFixed(2) + '%,0,0)' : '';
  }

  /* ---------- hero: Teacher and Ana draw on the board behind the name ---------- */
  // Each mark is a gesture from an InkHive session: the teacher's circle, wave, arrow and loop, Ana's tick
  // and her 1/2. Each is placed where it clears the name, the screen, the sentence and the button, and its
  // cursor's chip stays off the sentence and the button. A stroke is a bundle of bristles that lands heavy, thins as it speeds up and runs dry
  // towards the lift. It is inked into a canvas of its own in the board's colour, a step above the ground,
  // which the theme switch recolours at once. Ink is wiped from the left after a while. The clock runs only while the hero is on screen; under reduced motion the board is a still.
  var board = $('.board');
  if (board && board.firstChild.getContext) (function () {
    var canvas = board.firstChild, ctx = canvas.getContext('2d');
    var pens = $$('.pen', board).map(function (el) { return { el: el, x: 0, y: 0, on: false, job: null, hideAt: 0 }; });
    var WIPE = 800, BRISTLES = 8;
    // [whose, height as a share of width, strokes as points in a unit box]; the circle is generated
    var enso = [], i;
    for (i = 0; i <= 16; i++) enso.push([0.5 + Math.cos(2.2 + i * 0.36) * (0.46 + 0.03 * Math.sin(i * 0.44)), 0.5 + Math.sin(2.2 + i * 0.36) * (0.46 + 0.03 * Math.sin(i * 0.44))]);
    var gestures = [
      [0, 1, [enso]],
      [0, 0.32, [[[0, 0.62], [0.22, 0.2], [0.47, 0.75], [0.73, 0.25], [1, 0.58]]]],
      [0, 0.5, [[[0, 0.9], [0.4, 0.62], [0.72, 0.42], [0.98, 0.12]], [[0.79, 0.08], [0.98, 0.12], [0.9, 0.46]]]],
      [0, 0.42, [[[0, 0.78], [0.28, 0.74], [0.5, 0.6], [0.56, 0.22], [0.44, 0.12], [0.38, 0.42], [0.6, 0.8], [1, 0.7]]]],
      [1, 0.8, [[[0, 0.55], [0.3, 0.92], [1, 0.02]]]],
      [1, 0.9, [[[0.04, 0.22], [0.18, 0.04], [0.18, 0.96]], [[0.3, 0.98], [0.52, 0.02]], [[0.64, 0.26], [0.78, 0.04], [0.96, 0.2], [0.9, 0.48], [0.66, 0.94], [1, 0.92]]]]
    ];
    var W = 0, H = 0, dpr = 1, margin = 20, sMax = 200, maxLive = 4, ink = '', gone = [];
    var strokes = [], clock = 0, last = 0, raf = 0, seen = true, nextAt = 1400, turn = 0, lastG = [-1, -1], walls = [], texts = [];

    function ease(u) { return 0.5 - 0.5 * Math.cos(Math.PI * clamp(u, 0, 1)); }
    function hash(n) { var x = Math.sin(n * 127.1) * 43758.5453; return x - Math.floor(x); }
    function noise(x) { var f = Math.floor(x), u = x - f; u = u * u * (3 - 2 * u); return hash(f) + (hash(f + 1) - hash(f)) * u; }
    function hits(a, list, pad) {
      for (var k = 0; k < list.length; k++) {
        var b = list[k];
        if (a.l < b.r + pad && a.r > b.l - pad && a.t < b.b + pad && a.b > b.t - pad) return true;
      }
      return false;
    }
    // what the ink keeps clear of, in the hero's own coordinates
    function measureWalls() {
      var hb = hero.getBoundingClientRect();
      var at = function (el) { var r = el.getBoundingClientRect(); return { l: r.left - hb.left, t: r.top - hb.top, r: r.right - hb.left, b: r.bottom - hb.top }; };
      walls = $$('.name-a .ln, .name-b .rise, .shot, .hero-foot .lead, .hero-foot .btn').map(at);
      texts = $$('.hero-foot .lead, .hero-foot .btn').map(at);
    }
    function readInk() {
      var c = getComputedStyle(board).color, n = c.match(/[\d.]+/g);
      ink = c.indexOf('color(') === 0 && n ? 'rgb(' + Math.round(n[0] * 255) + ',' + Math.round(n[1] * 255) + ',' + Math.round(n[2] * 255) + ')' : c;
      strokes.forEach(tint);
    }
    // every mask is inked in the one colour; a new theme recolours what is there
    function tint(s) {
      var m = s.m;
      m.save();
      m.setTransform(1, 0, 0, 1, 0, 0);
      m.globalCompositeOperation = 'source-in';
      m.fillStyle = ink;
      m.fillRect(0, 0, s.mask.width, s.mask.height);
      m.restore();
      m.fillStyle = m.strokeStyle = ink;
      s.dirty = true;
    }

    // a smooth line through the points, resampled every 2.5px, with its length so far and its normals
    function trace(pts) {
      var dense = [], n = pts.length, k, t;
      for (i = 0; i < n - 1; i++) {
        var p0 = pts[Math.max(i - 1, 0)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(i + 2, n - 1)];
        for (k = 0; k < 16; k++) {
          t = k / 16;
          dense.push([0, 1].map(function (d) {
            return 0.5 * (2 * p1[d] + (p2[d] - p0[d]) * t + (2 * p0[d] - 5 * p1[d] + 4 * p2[d] - p3[d]) * t * t + (3 * p1[d] - p0[d] - 3 * p2[d] + p3[d]) * t * t * t);
          }));
        }
      }
      dense.push(pts[n - 1]);
      var p = [dense[0]], c = [0], acc = 0, len = 0;
      for (i = 1; i < dense.length; i++) {
        var a = dense[i - 1], b = dense[i], dx = b[0] - a[0], dy = b[1] - a[1], d = Math.sqrt(dx * dx + dy * dy), u = 2.5 - acc;
        for (; u <= d; u += 2.5) { p.push([a[0] + dx * u / d, a[1] + dy * u / d]); len += 2.5; c.push(len); }
        acc = d - (u - 2.5);
      }
      if (acc > 0.5) { p.push(dense[dense.length - 1]); len += acc; c.push(len); }
      var nm = p.map(function (q, j) {
        var a = p[Math.max(j - 1, 0)], b = p[Math.min(j + 1, p.length - 1)], dx = b[0] - a[0], dy = b[1] - a[1], d = Math.sqrt(dx * dx + dy * dy) || 1;
        return [-dy / d, dx / d];
      });
      return { p: p, c: c, n: nm, len: len, done: -1 };
    }

    // a gesture set down at a size, a slight tilt and a place where it and its chip touch nothing
    function place(g) {
      for (var tries = 0; tries < 160; tries++) {
        var s = sMax * (0.6 + Math.random() * 0.4) * Math.pow(0.82, Math.floor(tries / 40)), h = s * g[1];
        var rot = (Math.random() - 0.5) * 0.24, cos = Math.cos(rot), sin = Math.sin(rot), w = clamp(s * 0.085, 5, 22);
        var cx = margin + s / 2 + Math.random() * (W - 2 * margin - s), cy = 8 + h / 2 + Math.random() * (H - margin - 8 - h);
        var parts = g[2].map(function (pts) {
          return pts.map(function (q) { var x = (q[0] - 0.5) * s, y = (q[1] - 0.5) * h; return [cx + x * cos - y * sin, cy + x * sin + y * cos]; });
        });
        var box = { l: Infinity, t: Infinity, r: -Infinity, b: -Infinity };
        parts.forEach(function (pts) { pts.forEach(function (q) { box.l = Math.min(box.l, q[0]); box.r = Math.max(box.r, q[0]); box.t = Math.min(box.t, q[1]); box.b = Math.max(box.b, q[1]); }); });
        box = { l: Math.floor(box.l - w - 4), t: Math.floor(box.t - w - 4), r: Math.ceil(box.r + w + 4), b: Math.ceil(box.b + w + 4) };
        var reach = { l: box.l, t: box.t, r: box.r + 88, b: box.b + 34 };
        if (reach.l < margin * 0.5 || reach.t < 4 || reach.r > W - margin * 0.5 || reach.b > H - 4) continue;
        if (hits(box, walls, 10) || hits(reach, texts, 10) || hits(box, strokes.map(function (o) { return o.box; }), 16)) continue;
        var mask = document.createElement('canvas');
        mask.width = Math.ceil((box.r - box.l) * dpr); mask.height = Math.ceil((box.b - box.t) * dpr);
        var m = mask.getContext('2d');
        m.setTransform(dpr, 0, 0, dpr, -box.l * dpr, -box.t * dpr);
        m.lineCap = 'round'; m.fillStyle = m.strokeStyle = ink;
        return { parts: parts.map(trace), box: box, w: w, mask: mask, m: m, seed: Math.random() * 1000, wipeAt: 0 };
      }
      return null;
    }

    // lay the bristles down along a part, up to a length
    function inkTo(s, part, upto) {
      var P = part.p, C = part.c, N = part.n, m = s.m, j = part.done, k;
      if (j < 0) { m.beginPath(); m.arc(P[0][0], P[0][1], s.w * 0.4, 0, 2 * Math.PI); m.fill(); j = 0; s.dirty = true; }
      for (; j + 1 < P.length && C[j + 1] <= upto; j++) {
        var t = C[j] / part.len;
        var press = t < 0.1 ? 0.6 + 4 * t : t > 0.72 ? 0.82 * Math.max(0.1, 1 - (t - 0.72) / 0.28) : 1 - 0.18 * (t - 0.1) / 0.62;
        var w0 = s.w * press * (1 - 0.22 * Math.sin(Math.PI * t)), w1 = w0 * (1 - 0.004);
        for (k = 0; k < BRISTLES; k++) {
          var o = (k / (BRISTLES - 1) - 0.5) * 0.9, from = 0.35 + 0.35 * hash(s.seed + k);
          // the outer hairs run dry first, in streaks
          if (Math.abs(o) > 0.2 && t > from && noise(j / 5 + s.seed + k * 13) < (t - from) / (1 - from)) continue;
          if (t > 0.9 && noise(j / 4 + k * 7 + s.seed) < (t - 0.9) * 6) continue;
          m.lineWidth = w0 * 0.3;
          m.beginPath();
          m.moveTo(P[j][0] + N[j][0] * w0 * o, P[j][1] + N[j][1] * w0 * o);
          m.lineTo(P[j + 1][0] + N[j + 1][0] * w1 * o, P[j + 1][1] + N[j + 1][1] * w1 * o);
          m.stroke();
        }
        s.dirty = true;
      }
      part.done = j;
    }

    function put(pen, q) { pen.x = q[0]; pen.y = q[1]; pen.el.style.transform = 'translate3d(' + q[0].toFixed(1) + 'px,' + q[1].toFixed(1) + 'px,0)'; }
    function show(pen) { pen.on = true; pen.el.classList.add('is-on'); }
    function hide(pen) { pen.on = false; pen.el.classList.remove('is-on'); }
    // does the way from one point to the next pass over the name or the text?
    function crosses(a, b) {
      for (var k = 0; k <= 20; k++) {
        var x = a[0] + (b[0] - a[0]) * k / 20, y = a[1] + (b[1] - a[1]) * k / 20;
        if (hits({ l: x, t: y, r: x + 88, b: y + 34 }, walls, 6)) return true;
      }
      return false;
    }
    function pick(who) {
      var mine = [];
      gestures.forEach(function (g, k) { if (g[0] === who && k !== lastG[who]) mine.push(k); });
      lastG[who] = mine[Math.floor(Math.random() * mine.length)];
      return gestures[lastG[who]];
    }

    // a pen glides to the start (or, if that would cross the text, vanishes and reappears there), then
    // draws each part in turn, gliding between them, and rests a moment at the end
    function begin(pen, s) {
      var start = s.parts[0].p[0], glide = pen.on && !crosses([pen.x, pen.y], start), at = pen.on ? (glide ? 650 : 520) : 0;
      s.parts.forEach(function (part, k) { if (k) at += 220; part.a = at; at += clamp(200 + part.len * 1.6, 280, 1500); part.b = at; });
      pen.job = { s: s, t0: clock, glide: glide, from: [pen.x, pen.y], travel: s.parts[0].a };
      if (!pen.on) { put(pen, start); show(pen); }
    }
    function drive(pen) {
      var job = pen.job;
      if (!job) { if (pen.on && clock > pen.hideAt) hide(pen); return; }
      var t = clock - job.t0, s = job.s, parts = s.parts, start = parts[0].p[0], k, e;
      if (t < job.travel) {
        e = ease(t / job.travel);
        if (job.glide) put(pen, [job.from[0] + (start[0] - job.from[0]) * e, job.from[1] + (start[1] - job.from[1]) * e]);
        else if (t < job.travel / 2) { if (pen.on) hide(pen); } else { put(pen, start); show(pen); }
        return;
      }
      for (k = 0; k < parts.length; k++) {
        var part = parts[k];
        if (t < part.a) {
          var prev = parts[k - 1], q = prev.p[prev.p.length - 1], r = part.p[0];
          e = ease((t - prev.b) / (part.a - prev.b));
          put(pen, [q[0] + (r[0] - q[0]) * e, q[1] + (r[1] - q[1]) * e]);
          return;
        }
        if (t < part.b) { inkTo(s, part, ease((t - part.a) / (part.b - part.a)) * part.len); put(pen, part.p[part.done]); return; }
        inkTo(s, part, Infinity);
      }
      s.wipeAt = clock + 6500 + Math.random() * 2500;
      pen.job = null;
      pen.hideAt = clock + 1600;
    }

    function step() {
      if (clock >= nextAt) {
        var pen = pens[turn % pens.length];
        if (strokes.length >= maxLive) {
          // the board is full: the oldest finished mark is wiped now, and the next waits for it
          var old = strokes.filter(function (o) { return o.wipeAt > clock; })[0];
          if (old) old.wipeAt = clock;
          nextAt = clock + 500;
        } else if (!pen.job) {
          measureWalls();
          var s = place(pick(turn % pens.length));
          if (s) { strokes.push(s); begin(pen, s); }
          nextAt = clock + (s ? 1500 + Math.random() * 1300 : 700);
          turn++;
        } else turn++;
      }
      pens.forEach(drive);
      strokes = strokes.filter(function (o) {
        if (!o.wipeAt || clock < o.wipeAt + WIPE) return true;
        gone.push(o);
        return false;
      });
    }
    // only the marks that changed are repainted, each within its own box (the boxes never overlap)
    function paint() {
      gone.forEach(function (s) { ctx.clearRect(Math.round(s.box.l * dpr), Math.round(s.box.t * dpr), s.mask.width, s.mask.height); });
      gone = [];
      strokes.forEach(function (s) {
        var wiping = s.wipeAt && clock > s.wipeAt;
        if (!s.dirty && !wiping) return;
        s.dirty = false;
        var x = Math.round(s.box.l * dpr), y = Math.round(s.box.t * dpr), mw = s.mask.width, mh = s.mask.height;
        var cut = wiping ? Math.round(ease((clock - s.wipeAt) / WIPE) * mw) : 0;
        ctx.clearRect(x, y, mw, mh);
        if (cut < mw) ctx.drawImage(s.mask, cut, 0, mw - cut, mh, x + cut, y, mw - cut, mh);
      });
    }

    function size(keep) {
      var w = hero.clientWidth, d = Math.min(window.devicePixelRatio || 1, 2);
      // a phone's address bar changes only the height: keep the drawing then
      if (!keep || w !== W || d !== dpr) { strokes = []; pens.forEach(hide); pens.forEach(function (pen) { pen.job = null; }); nextAt = clock + 600; }
      W = w; H = hero.clientHeight; dpr = d;
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      margin = parseFloat(getComputedStyle(hero).paddingLeft) || 20;
      sMax = clamp(W * 0.2, 90, 320);
      maxLive = W * H > 900000 ? 5 : W * H > 450000 ? 4 : 2;
      // a resized canvas is blank: everything kept is painted again
      strokes.forEach(function (s) { s.dirty = true; });
      gone = [];
    }
    // reduced motion: a few finished marks, and the teacher's pen resting at the end of the last
    function still() {
      size();
      measureWalls();
      for (var k = 0; k < 6 && strokes.length < Math.max(2, maxLive - 1); k++) {
        var s = place(pick(k % 2));
        if (!s) continue;
        s.parts.forEach(function (part) { inkTo(s, part, Infinity); });
        strokes.push(s);
        if (k % 2 === 0) { var lp = s.parts[s.parts.length - 1].p; put(pens[0], lp[lp.length - 1]); show(pens[0]); }
      }
      paint();
    }

    // a brush reads as smoothly at 30 frames a second, at half the work
    function tick(t) {
      raf = 0;
      if (!last || t - last > 30) {
        clock += last ? Math.min(t - last, 64) : 0;
        last = t;
        step();
        paint();
      }
      run();
    }
    function run() {
      if (seen && !document.hidden) { if (!raf) raf = requestAnimationFrame(tick); return; }
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      last = 0;
    }

    readInk();
    new MutationObserver(function () { readInk(); if (RM || !raf) paint(); }).observe(root, { attributes: true, attributeFilter: ['data-theme'] });
    var resizing = 0;
    addEventListener('resize', function () {
      clearTimeout(resizing);
      resizing = setTimeout(function () { if (RM && hero.clientWidth !== W) still(); else { size(true); paint(); } }, 200);
    });
    if (RM) { if (document.fonts) document.fonts.ready.then(still); else still(); return; }
    size();
    if ('IntersectionObserver' in window) new IntersectionObserver(function (e) { seen = e[0].isIntersecting; run(); }).observe(hero);
    document.addEventListener('visibilitychange', run);
    run();
  })();

  /* ---------- footer: ERIK turns into KIRE ---------- */
  // Kire is Erik, backwards. The word arrives reading ERIK, and once it is wholly on screen its letters trade
  // places, locked to the scrollbar: the letters moving left pass over, the ones moving right pass under.
  // It reads KIRE, as built, for the last stretch of the page. The link keeps its name in its label.
  var kire = $('.kire'), kireText = null, kireLetters = [], kireP = -1;
  var kireArc = [0.3, 0.12, -0.05, -0.08];
  if (kire && !RM) {
    var src = document.createElement('span');
    src.className = 'kire-src';
    src.textContent = kire.textContent;
    kire.textContent = '';
    kire.appendChild(src);
    kireText = src.firstChild;
    kireText.nodeValue.split('').forEach(function (c) {
      var s = document.createElement('span');
      s.className = 'k';
      s.setAttribute('aria-hidden', 'true');
      s.textContent = c;
      kireLetters.push(s);
      kire.appendChild(s);
    });
    kire.classList.add('is-split');
  }
  // Each letter is laid on its own glyph of the set word (so KIRE keeps its kerning), and given the
  // distance to where it would sit in ERIK: the same letters in reverse order, each at its own advance.
  function measureKire() {
    var rg = document.createRange(), left = kire.getBoundingClientRect().left, x = [], n = kireLetters.length;
    for (var i = 0; i < n; i++) {
      rg.setStart(kireText, i);
      rg.setEnd(kireText, i + 1);
      var r = rg.getBoundingClientRect();
      x.push(r.left - left);
      if (i === n - 1) x.push(r.right - left);
    }
    for (var j = n - 1, at = x[0]; j >= 0; j--) {
      kireLetters[j].style.left = x[j].toFixed(1) + 'px';
      kireLetters[j].kDx = at - x[j];
      at += x[j + 1] - x[j];
    }
    kireP = -1;
  }
  function kireFrame() {
    if (!kireLetters.length) return;
    var vh = innerHeight, r = kire.getBoundingClientRect();
    if (r.top > 1.5 * vh && kireP === 0) return;
    // Measured in the scroll left to the end of the page: KIRE holds for the last 6% of a screen, and the
    // swap before that starts only when the word's foot is on screen with room to spare.
    var left = Math.max(0, document.documentElement.scrollHeight - vh - scrollY), hold = 0.06 * vh;
    var span = clamp(vh - (r.bottom - left) - hold - 0.04 * vh, 0.15 * vh, 0.4 * vh);
    var p = 1 - clamp((left - hold) / span, 0, 1);
    if (p === kireP) return;
    kireP = p;
    // K leads and E follows, a step apart; each letter's share of the move is linear in the scroll
    kireLetters.forEach(function (s, i) {
      var q = clamp((p - i * 0.06) / 0.82, 0, 1), rest = 1 - q;
      s.style.transform = rest ? 'translate3d(' + (s.kDx * rest).toFixed(1) + 'px,' + (-Math.sin(Math.PI * q) * kireArc[i]).toFixed(3) + 'em,0)' : '';
    });
  }
  if (kireLetters.length) {
    measureKire();
    if (document.fonts) document.fonts.ready.then(function () { measureKire(); kireFrame(); });
    addEventListener('resize', function () { measureKire(); });
  }

  /* ---------- buttons and tabs: a second copy of the label waits below and rolls up under the pointer ---------- */
  // Only the label's text is wrapped, so anything else in the control (the resume's arrow) stays as it is.
  if (!RM) $$('.btn, .nav-links a').forEach(function (b) {
    var t = Array.prototype.filter.call(b.childNodes, function (n) { return n.nodeType === 3 && n.nodeValue.trim(); })[0];
    if (!t) return;
    var roll = document.createElement('span'), a = document.createElement('span'), c = document.createElement('span');
    roll.className = 'btn-roll';
    a.textContent = c.textContent = t.nodeValue.trim();
    c.setAttribute('aria-hidden', 'true');
    roll.appendChild(a); roll.appendChild(c);
    b.replaceChild(roll, t);
  });

  /* ---------- entrances: each section's parts arrive once, in reading order, each in its own manner ---------- */
  // A group is watched; when its top passes 90% of the screen its parts arrive, 80ms apart and four steps
  // at most. A part is an element, or [element, manner]: "line" rises from behind its own baseline; "chars"
  // and "words" rise a letter or a word at a time; "open" opens a picture like a shutter, and "reel" a strip
  // of them; "bar" slides out from the left; "drop" opens a panel from the top; no manner rises 24px. The
  // marks come off once they have played, so the page is left exactly as it was built.
  if (!RM && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        e.target.classList.add('seen');
        var parts = e.target.inParts;
        parts.forEach(function (el) { el.classList.add('is-in'); });
        setTimeout(function () { parts.forEach(settle); }, 1700);
      });
    }, { rootMargin: '0px 0px -10% 0px' });
    var settle = function (el) {
      el.removeAttribute('data-in');
      el.classList.remove('is-in');
      el.style.removeProperty('--i');
      if (el.inText != null) { el.textContent = el.inText; el.removeAttribute('aria-label'); }
      var r = el.inRise;
      if (r) { while (r.firstChild) el.insertBefore(r.firstChild, r); el.removeChild(r); }
      $$('.rise', el).forEach(function (s) { s.classList.remove('rise'); s.style.removeProperty('--i'); });
    };
    // A heading is split into letters (or words) for its rise. Screen readers get the whole heading from
    // its label meanwhile, and the plain text comes back when the rise is over.
    var split = function (el, byWord) {
      var text = el.textContent, n = 0, box = document.createElement('span');
      el.inText = text;
      el.setAttribute('aria-label', text);
      box.setAttribute('aria-hidden', 'true');
      text.split(' ').forEach(function (word, wi) {
        if (wi) box.appendChild(document.createTextNode(' '));
        var w = document.createElement('span');
        w.className = 'wd';
        (byWord ? [word] : word.split('')).forEach(function (c) {
          var s = document.createElement('span');
          s.className = 'ch';
          s.textContent = c;
          s.style.setProperty('--c', n++);
          w.appendChild(s);
        });
        box.appendChild(w);
      });
      el.textContent = '';
      el.appendChild(box);
    };
    var enter = function (box, parts) {
      if (!box) return;
      box.inParts = parts.map(function (p) { return p && p.nodeType ? [p, ''] : p; }).filter(function (p) { return p && p[0]; }).map(function (p, i) {
        var el = p[0], kind = p[1];
        if (kind === 'line' && !$('.rise', el)) {
          var s = document.createElement('span');
          s.className = 'rise';
          while (el.firstChild) s.appendChild(el.firstChild);
          el.appendChild(s);
          el.inRise = s;
        }
        if (kind === 'chars' || kind === 'words') split(el, kind === 'words');
        el.setAttribute('data-in', kind);
        el.style.setProperty('--i', Math.min(i, 3));
        return el;
      });
      io.observe(box);
    };
    var rows = $$('.about-row'), email = $('.email');
    enter($('.work-head'), [[$('#work-h'), 'chars'], $('.work-head p')]);
    enter($('.notes > h3'), [[$('.notes > h3'), 'chars']]);
    $$('.note').forEach(function (n) { enter(n, [[$('.note-name', n) || $('dt', n), 'line'], [$('.note-shot', n), 'open'], $('dd', n)]); });
    // a showcase arrives on its own, when it is reached: its strip of screens opens like a shutter
    $$('.show').forEach(function (s) { enter(s, [[$('h4', s), 'chars'], $('.show-say', s), [$('.reel', s), 'reel']]); });
    enter($('.band-note'), [$('.band-note')]);
    enter($('.try-head'), [[$('#proof-h'), 'words'], $('.try-head p')]);
    enter(attackList, $$('li', attackList));
    enter(verdict, [[verdict, 'drop']]);
    // STACK rises whole: split into letters, a word this large would lose its kerning and shift when it rejoined
    enter($('.skills-word'), [[$('#skills-h'), 'line'], $('.skills-word p')]);
    enter($('.bars'), $$('.bars details').map(function (d) { return [d, 'bar']; }));
    enter(rows[0], [[$('#about-h'), 'chars'], $('.facts')]);
    enter(rows[1], [[$('h3', rows[1]), 'chars']].concat($$('.badge')));
    enter(rows[2], [[$('h3', rows[2]), 'chars']].concat($$('.course li')));
    // the address rises in its two halves, the second a step behind
    $$('span', email).forEach(function (s, i) { s.classList.add('rise'); s.style.setProperty('--i', i + 1); });
    enter($('.contact-in'), [$('.contact-say'), [email, 'line'], $('.corners')]);
    enter($('.foot-rows'), [$('.foot-rows'), $('.foot-legal')]);
    root.classList.add('motion');
  }

  /* ---------- About: the paragraph fills with ink as it is read ---------- */
  // Its words wait at 45% ink and fill in reading order as the paragraph rises from 85% to 40% of the
  // screen. It only fills, never empties, so scrolling back up doesn't dim what has been read.
  var para = $('.about-para'), paraWords = [], filled = 0;
  if (para && !RM) {
    para.textContent.trim().split(/\s+/).forEach(function (word, i, all) {
      if (!i) para.textContent = '';
      var s = document.createElement('span');
      s.className = 'w';
      s.textContent = word;
      para.appendChild(s);
      if (i < all.length - 1) para.appendChild(document.createTextNode(' '));
      paraWords.push(s);
    });
    para.classList.add('fill');
  }
  function fillFrame() {
    if (filled >= paraWords.length) return;
    var top = para.getBoundingClientRect().top, vh = innerHeight;
    var n = Math.round(clamp((0.85 * vh - top) / (0.45 * vh), 0, 1) * paraWords.length);
    for (; filled < n; filled++) paraWords[filled].classList.add('on');
  }

  /* ---------- one scroll loop for every scroll effect ---------- */
  var ticking = false;
  function frame() { ticking = false; heroFrame(); tearFrame(); bandScroll(); fillFrame(); kireFrame(); }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);
  frame();
})();
