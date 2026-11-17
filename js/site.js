(function () {
  'use strict';
  var root = document.documentElement;
  var RM = matchMedia('(prefers-reduced-motion: reduce)').matches;

  function $(s, el) { return (el || document).querySelector(s); }
  function $$(s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); }

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

  /* ---------- the menu, below 1024px: a full-screen sheet ---------- */
  // A section link closes the sheet over the section it has already scrolled to, then focus moves to that
  // section, so the next Tab carries on from there rather than from the bar at the top.
  var menu = $('#menu'), menuBtn = $('.menu-btn');
  if (menu && root.classList.contains('has-menu')) {
    var closeMenu = function (then) { if (menu.open) menu.close(); if (then) then(); };
    menuBtn.addEventListener('click', function () { menu.showModal(); menuBtn.setAttribute('aria-expanded', 'true'); });
    $('.menu-close', menu).addEventListener('click', function () { closeMenu(); });
    menu.addEventListener('close', function () { menuBtn.setAttribute('aria-expanded', 'false'); });
    $$('a[href^="#"]', menu).forEach(function (a) {
      a.addEventListener('click', function (e) {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        var target = document.getElementById(a.getAttribute('href').slice(1));
        if (!target) return;
        e.preventDefault();
        closeMenu(function () {
          if (location.hash === a.hash) target.scrollIntoView(); else location.hash = a.hash;
          if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
          target.focus({ preventScroll: true });
        });
      });
    });
    // the sheet belongs to the narrow bar; widening past it puts the links back and closes the sheet
    var wideMq = matchMedia('(min-width: 1024px)');
    var onWide = function () { if (wideMq.matches) closeMenu(); };
    if (wideMq.addEventListener) wideMq.addEventListener('change', onWide); else wideMq.addListener(onWide);
  }

  var yr = $('#yr');
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---------- copy email ---------- */
  var copyBtn = $('.copy');
  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      var done = function () { copyBtn.textContent = 'Copied'; setTimeout(function () { copyBtn.textContent = 'Copy email'; }, 1600); };
      if (navigator.clipboard) navigator.clipboard.writeText(copyBtn.getAttribute('data-copy')).then(done, function () {});
    });
  }

  /* ---------- hero: the name is dealt like Blend It's tiles, never in the answer's order ---------- */
  // PlayIT's Blend It deals a word's tiles in any order but the right one (Erik's fix). The name arrives the
  // same way: each word's letters are dealt as tiles, held a beat, then slide into place, and the tiles fade
  // once the word is whole. "Deal again" deals a new order. Screen readers get the plain name throughout,
  // and without the script the name is simply there.
  var name = $('.name'), dealBtn = $('.deal');
  if (name && dealBtn) {
    var words = $$('.word', name).map(function (w) { return { el: w, text: w.getAttribute('data-word'), tiles: [] }; });
    // split a word into one tile per letter; at rest it is plain text again
    var makeTiles = function (w) {
      w.el.textContent = '';
      w.tiles = w.text.split('').map(function (c) {
        var t = document.createElement('span');
        t.className = 'tile';
        t.textContent = c;
        w.el.appendChild(t);
        return t;
      });
    };
    // an order of the letters that never spells the word
    var dealOrder = function (text) {
      var order = text.split('').map(function (c, i) { return i; });
      if (text.length < 2 || text.split('').every(function (c) { return c === text[0]; })) return order;
      do {
        for (var i = order.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = order[i]; order[i] = order[j]; order[j] = t; }
      } while (order.map(function (i) { return text[i]; }).join('') === text);
      return order;
    };
    var timers = [];
    var deal = function () {
      timers.forEach(clearTimeout);
      timers = [];
      name.classList.add('is-dealt');
      words.forEach(function (w) {
        makeTiles(w);
        var home = w.tiles.map(function (t) { return t.offsetLeft; });
        // lay the tiles out in the dealt order to measure where each lands, then put them back in the
        // word's order and push each one to its dealt place, so only transforms ever move
        var order = dealOrder(w.text);
        order.forEach(function (i) { w.el.appendChild(w.tiles[i]); });
        var dealt = w.tiles.map(function (t) { return t.offsetLeft; });
        w.tiles.forEach(function (t) { w.el.appendChild(t); });
        w.tiles.forEach(function (t, i) { t.style.transform = 'translate3d(' + (dealt[i] - home[i]) + 'px, 0, 0)'; });
      });
      timers.push(setTimeout(function () {
        words.forEach(function (w) { w.tiles.forEach(function (t) { t.classList.add('go'); t.style.transform = ''; }); });
      }, RM ? 900 : 700));
      timers.push(setTimeout(function () { name.classList.remove('is-dealt'); }, RM ? 900 : 1450));
      timers.push(setTimeout(function () { words.forEach(function (w) { w.el.textContent = w.text; w.tiles = []; }); }, RM ? 950 : 2000));
    };
    dealBtn.hidden = false;
    dealBtn.addEventListener('click', deal);
    // measure once the face has loaded, or the tiles would be placed for the fallback font's widths
    var first = false;
    var start = function () { if (!first) { first = true; deal(); } };
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(start);
    setTimeout(start, 1500);
  }

  /* ---------- the bar takes the field of the chapter beneath it ---------- */
  // A thin line across the bar's middle is watched: whichever chapter crosses it gives the bar its colours,
  // with a 300ms cross-fade in the CSS. The chapters' own colours never change.
  var bar = $('.bar');
  if (bar && 'IntersectionObserver' in window) {
    var under = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) bar.setAttribute('data-chapter', e.target.getAttribute('data-chapter')); });
    }, { rootMargin: '-3% 0px -96% 0px' });
    $$('.chapter').forEach(function (c) { under.observe(c); });
  }

  /* ---------- showcase: a strip of real screens that runs off the screen edges ---------- */
  // The strip scrolls by itself (swipe, trackpad, arrow keys, its own bar); the two arrows move it a
  // screenful for a mouse that only has a wheel. Each screen is watched for being wholly in view, 16px
  // clear of the screen edges: its caption shows only then, so words are never cut by the edge, and an
  // arrow rests while the first or the last screen is whole.
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

  /* ---------- entrances: each section's parts arrive once, in reading order ---------- */
  // A group is watched; when its top passes 90% of the screen its parts arrive, 80ms apart and four steps
  // at most. A part is an element, or [element, manner]: "chars" rises a letter at a time from behind its
  // baseline, "reel" opens a strip of pictures like a shutter, and no manner rises 24px. The marks come off
  // once they have played, so the page is left exactly as it was built.
  if (!RM && 'IntersectionObserver' in window) {
    root.classList.add('motion');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
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
    };
    // A heading is split into letters for its rise. Screen readers get the whole heading from its label
    // meanwhile, and the plain text comes back when the rise is over.
    var split = function (el) {
      var text = el.textContent, n = 0, box = document.createElement('span');
      el.inText = text;
      el.setAttribute('aria-label', text);
      box.setAttribute('aria-hidden', 'true');
      text.split(' ').forEach(function (word, wi) {
        if (wi) box.appendChild(document.createTextNode(' '));
        var w = document.createElement('span');
        w.className = 'wd';
        word.split('').forEach(function (c) {
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
      if (!box || box.getBoundingClientRect().top < innerHeight) return;
      box.inParts = parts.map(function (p) { return p && p.nodeType ? [p, ''] : p; }).filter(function (p) { return p && p[0]; }).map(function (p, i) {
        var el = p[0], kind = p[1];
        if (kind === 'chars') split(el);
        el.setAttribute('data-in', kind);
        el.style.setProperty('--i', Math.min(i, 3));
        return el;
      });
      io.observe(box);
    };
    enter($('.names'), [$('.names'), $('.names-note')]);
    $$('.proj').forEach(function (p) { enter(p, [[$('.proj-h', p), 'chars'], $('.proj-what', p), $('.proj-meta', p), $('.proj-points', p)]); });
    $$('.show').forEach(function (s) { enter(s, [$('.wide', s), [$('.show-h', s), 'chars'], $('.show-say', s), [$('.reel', s), 'reel']]); });
    enter($('.also'), [[$('.also-h'), 'chars'], $('.also-list')]);
    enter($('.stack-head'), [[$('.stack-h'), 'chars'], $('.stack-head p')]);
    enter($('.groups'), $$('.group'));
    var rows = $$('.about-row');
    enter(rows[0], [[$('.about-h'), 'chars'], $('.facts'), $('.about-para')]);
    enter(rows[1], [$('.about-word')].concat($$('.rec')));
    enter($('.contact-in'), [$('.contact-say'), $('.email'), $('.corners')]);
    enter($('.foot'), [$('.foot-cols'), $('.wordmark')]);
  }
})();
