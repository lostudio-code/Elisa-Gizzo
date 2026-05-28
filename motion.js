/* ============================================================
   motion.js — production motion layer
   - rAF-throttled scroll handler (single update tick)
   - IntersectionObserver-driven reveals with stagger
   - Hero entrance choreography + word-by-word title reveal
   - Subtle parallax for hero, image frames, and footer
   - 3D pointer tilt on service cards
   - Scroll progress rail
   - Animated stat counters
   - Honors prefers-reduced-motion
   ============================================================ */
(function () {
  'use strict';

  var prm =
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- Hero title word splitter ----------
  // Idempotent: returns silently if the element is already split.
  // The Tweaks panel calls this again whenever the headline text is swapped.
  function splitHeroTitle() {
    var el = document.querySelector('.hero-title');
    if (!el) return;
    if (el.querySelector('.hl')) return; // already split

    var raw = el.innerHTML;
    var lines = raw.split(/<br\s*\/?\s*>/i);
    var idx = 0;

    var out = lines
      .map(function (line) {
        // Decode the line's text content
        var tmp = document.createElement('span');
        tmp.innerHTML = line;
        var text = (tmp.textContent || '').replace(/\u00a0/g, ' ');
        var parts = text.split(/(\s+)/); // keep whitespace runs
        var inner = parts
          .map(function (p) {
            if (!p) return '';
            if (/^\s+$/.test(p)) return '&nbsp;';
            var delay = (idx++ * 70 + 60).toFixed(0);
            return (
              '<span class="hw"><span style="--word-delay:' +
              delay +
              'ms">' +
              escapeHtml(p) +
              '</span></span>'
            );
          })
          .join('');
        return '<span class="hl">' + inner + '</span>';
      })
      .join('');

    el.innerHTML = out;
    el.classList.remove('reveal-in');
    // Two RAFs so the browser commits the initial state before transitioning.
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        el.classList.add('reveal-in');
      });
    });
  }

  function escapeHtml(s) {
    return s
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  window.__splitHeroTitle = splitHeroTitle;

  // ---------- SVG arc draw ----------
  function setupArcs() {
    document.querySelectorAll('.hero-arc').forEach(function (svg) {
      svg.querySelectorAll('path').forEach(function (p) {
        var len = 0;
        try {
          len = p.getTotalLength();
        } catch (e) {
          len = 2400;
        }
        p.style.setProperty('--len', len);
        p.style.strokeDasharray = String(len);
        p.style.strokeDashoffset = String(len);
      });
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          svg.classList.add('draw');
        });
      });
    });
  }

  // ---------- Reveal observer ----------
  var revealIO = null;
  function setupReveals() {
    if (!('IntersectionObserver' in window)) {
      document
        .querySelectorAll('.reveal')
        .forEach(function (el) { el.classList.add('in'); });
      return;
    }
    revealIO = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            // Animate any [data-counter] on or inside the revealed target.
            var counters = [];
            if (e.target.dataset && e.target.dataset.counter) {
              counters.push(e.target);
            }
            e.target.querySelectorAll &&
              e.target.querySelectorAll('[data-counter]').forEach(function (c) {
                counters.push(c);
              });
            counters.forEach(function (c) {
              if (!c.dataset.counterDone) {
                c.dataset.counterDone = '1';
                // Start from zero only at the moment we animate — layout was
                // stable up until now using the static target text.
                var raw = c.dataset.counter;
                var suffix = c.dataset.counterSuffix || '';
                var decimals = (raw.split('.')[1] || '').length;
                c.textContent = (0).toFixed(decimals) + suffix;
                animateCounter(c);
              }
            });
            revealIO.unobserve(e.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: '0px 0px -8% 0px' }
    );

    var SELECTORS = [
      '.section .eyebrow',
      '.section .h-display',
      '.section .lead',
      '.section .btn',
      '.about-photo',
      '.about-meta .stat',
      '.story-photo',
      '.story-text > *',
      '.svc-card',
      '.step',
      '.philosophy-inner .label',
      '.philosophy-body',
      '.quote blockquote',
      '.quote .attr',
      '.cta h2',
      '.cta-side > *',
      '.faq-head > *',
      '.faq-item',
      '.process-head h2',
      '.process-head p',
      '.footer-top > div > *',
      '.footer-meta > div',
    ];

    SELECTORS.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (el) {
        if (el.classList.contains('reveal')) return;
        el.classList.add('reveal');
      });
    });

    // Stagger groups
    staggerGroup('.services-grid', '.svc-card', 110);
    staggerGroup('.process-steps', '.step', 140);
    staggerGroup('.about-meta', '.stat', 110);
    staggerGroup('.faq-list', '.faq-item', 60);
    staggerGroup('.footer-meta', 'div', 90);
    staggerGroup('.story-text', '*', 90);
    staggerGroup('.cta-side', '*', 90);

    // Stagger within text columns (eyebrow → h2 → lead → btn)
    document.querySelectorAll('.section, .cta, .faq').forEach(function (block) {
      var seq = block.querySelectorAll(
        ':scope > .section-head .eyebrow, :scope > .section-head .h-display, :scope > .section-head .lead'
      );
      seq.forEach(function (el, i) {
        el.style.setProperty('--reveal-delay', i * 100 + 'ms');
      });
    });

    // Now observe everything tagged
    document
      .querySelectorAll('.reveal')
      .forEach(function (el) { revealIO.observe(el); });
  }

  function staggerGroup(parentSel, childSel, step) {
    document.querySelectorAll(parentSel).forEach(function (parent) {
      var children = parent.querySelectorAll(childSel);
      children.forEach(function (c, i) {
        // Don't clobber an existing delay
        if (!c.style.getPropertyValue('--reveal-delay')) {
          c.style.setProperty('--reveal-delay', i * step + 'ms');
        }
      });
    });
  }

  // ---------- Stat counters ----------
  function animateCounter(el) {
    var target = parseFloat(el.dataset.counter);
    if (isNaN(target)) return;
    var suffix = el.dataset.counterSuffix || '';
    var decimals = (el.dataset.counter.split('.')[1] || '').length;
    var dur = 1400;
    var start = performance.now();
    function step(now) {
      var t = Math.min(1, (now - start) / dur);
      var eased = 1 - Math.pow(1 - t, 3);
      var val = target * eased;
      el.textContent = val.toFixed(decimals) + suffix;
      if (t < 1) requestAnimationFrame(step);
      else el.textContent = target.toFixed(decimals) + suffix;
    }
    requestAnimationFrame(step);
  }

  function prepCounters() {
    document.querySelectorAll('[data-counter]').forEach(function (el) {
      // Stash the original target text so we can restore/skip animation as needed.
      if (!el.dataset.counterOriginal) {
        el.dataset.counterOriginal = el.textContent;
      }
    });
  }

  // ---------- Parallax engine ----------
  var parallaxTargets = [];

  function registerParallax() {
    parallaxTargets.length = 0;

    var hero = document.querySelector('.hero');
    var heroBg = document.getElementById('heroBg');
    var heroArc = document.querySelector('.hero-arc');
    var heroTitle = document.querySelector('.hero-title');
    var heroBody = document.querySelector('.hero-body');

    if (hero && heroBg)
      parallaxTargets.push({
        kind: 'hero-bg',
        el: heroBg,
        container: hero,
        speed: 0.35,
      });
    if (hero && heroArc)
      parallaxTargets.push({
        kind: 'translate',
        el: heroArc,
        container: hero,
        speed: 0.55,
      });
    if (hero && heroTitle)
      parallaxTargets.push({
        kind: 'translate',
        el: heroTitle,
        container: hero,
        speed: 0.12,
      });
    if (hero && heroBody)
      parallaxTargets.push({
        kind: 'translate',
        el: heroBody,
        container: hero,
        speed: -0.05,
      });

    document.querySelectorAll('.parallax-frame').forEach(function (frame) {
      var img = frame.querySelector('img');
      if (img)
        parallaxTargets.push({
          kind: 'frame-img',
          el: img,
          container: frame,
          speed: 0.25,
        });
    });

    var footer = document.querySelector('.footer');
    if (footer)
      parallaxTargets.push({
        kind: 'footer-bg',
        el: footer,
        container: footer,
        speed: 0.35,
      });

    var process = document.querySelector('.process');
    if (process)
      parallaxTargets.push({
        kind: 'process-bg',
        el: process,
        container: process,
        speed: 0.35,
      });
  }

  var ticking = false;
  var heroEntranceT = 1; // 0 at entrance start, 1 when done
  var heroEntranceStart = 0;

  function startHeroEntrance() {
    heroEntranceT = 0;
    heroEntranceStart = 0;
    requestAnimationFrame(tickHeroEntrance);
  }
  function tickHeroEntrance(now) {
    if (!heroEntranceStart) heroEntranceStart = now;
    var t = Math.min(1, (now - heroEntranceStart) / 1700);
    heroEntranceT = 1 - Math.pow(1 - t, 3);
    update();
    if (t < 1) requestAnimationFrame(tickHeroEntrance);
  }
  function onScroll() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }

  function update() {
    ticking = false;
    var vh = window.innerHeight || document.documentElement.clientHeight;
    var scrollY = window.scrollY || window.pageYOffset;

    // Scroll rail
    var doc = document.documentElement;
    var max = doc.scrollHeight - vh;
    var pct = max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0;
    if (scrollRail) scrollRail.style.setProperty('--p', (pct * 100).toFixed(2) + '%');

    // Parallax targets
    for (var i = 0; i < parallaxTargets.length; i++) {
      var p = parallaxTargets[i];
      var rect = p.container.getBoundingClientRect();
      if (rect.bottom < -200 || rect.top > vh + 200) continue;

      var center = rect.top + rect.height / 2;
      // Normalized -1..1ish — 0 means container centered on viewport.
      var progress = (center - vh / 2) / (vh + rect.height / 2);

      if (p.kind === 'hero-bg') {
        // Move down as we scroll, slight scale + extra zoom during entrance
        var ty = -progress * 120 * p.speed;
        var entranceBoost = 0.10 * (1 - heroEntranceT);
        var scale = 1.08 + entranceBoost;
        p.el.style.transform =
          'translate3d(0,' + ty.toFixed(2) + 'px,0) scale(' + scale.toFixed(3) + ')';
      } else if (p.kind === 'translate') {
        var ty2 = -progress * 100 * p.speed;
        p.el.style.transform =
          'translate3d(0,' + ty2.toFixed(2) + 'px,0)';
      } else if (p.kind === 'frame-img') {
        var ty3 = -progress * 80 * p.speed;
        p.el.style.setProperty('--py', ty3.toFixed(2) + 'px');
      } else if (p.kind === 'footer-bg') {
        var ty4 = -progress * 140 * p.speed;
        p.el.style.setProperty('--footer-py', ty4.toFixed(2) + 'px');
      } else if (p.kind === 'process-bg') {
        var ty5 = -progress * 140 * p.speed;
        p.el.style.setProperty('--process-py', ty5.toFixed(2) + 'px');
      }
    }
  }

  // ---------- Service card tilt ----------
  function setupTilt() {
    var cards = document.querySelectorAll('.svc-card');
    cards.forEach(function (card) {
      var raf = 0;
      var rect = null;

      function onEnter() {
        rect = card.getBoundingClientRect();
        card.classList.add('tilt');
        card.style.setProperty('--lift', '-8px');
      }
      function onMove(e) {
        if (!rect) rect = card.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width;
        var y = (e.clientY - rect.top) / rect.height;
        var rx = (0.5 - y) * 8; // deg
        var ry = (x - 0.5) * 10;
        var bx = (x - 0.5) * 12;
        var by = (y - 0.5) * 12;
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(function () {
          card.style.setProperty('--rx', rx.toFixed(2) + 'deg');
          card.style.setProperty('--ry', ry.toFixed(2) + 'deg');
          card.style.setProperty('--bx', bx.toFixed(2) + 'px');
          card.style.setProperty('--by', by.toFixed(2) + 'px');
        });
      }
      function onLeave() {
        rect = null;
        if (raf) cancelAnimationFrame(raf);
        card.classList.remove('tilt');
        card.style.setProperty('--rx', '0deg');
        card.style.setProperty('--ry', '0deg');
        card.style.setProperty('--bx', '0px');
        card.style.setProperty('--by', '0px');
        card.style.setProperty('--lift', '0px');
      }
      card.addEventListener('pointerenter', onEnter);
      card.addEventListener('pointermove', onMove);
      card.addEventListener('pointerleave', onLeave);
    });
  }

  // ---------- Scroll progress rail ----------
  var scrollRail = null;
  function setupRail() {
    scrollRail = document.createElement('div');
    scrollRail.className = 'scroll-rail';
    scrollRail.setAttribute('aria-hidden', 'true');
    document.body.appendChild(scrollRail);
  }

  // ---------- Boot ----------
  function init() {
    if (prm) {
      document.body.classList.add('reduced-motion', 'loaded');
      // Still split title so tweak swaps stay consistent — but with no motion classes,
      // the words render in place.
      splitHeroTitle();
      document
        .querySelectorAll('.hero-arc')
        .forEach(function (s) { s.classList.add('draw'); });
      return;
    }

    setupRail();
    splitHeroTitle();
    setupArcs();
    prepCounters();
    setupReveals();
    setupTilt();
    registerParallax();

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', function () {
      registerParallax();
      onScroll();
    });

    // Reveal hero
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        document.body.classList.add('loaded');
        startHeroEntrance();
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
