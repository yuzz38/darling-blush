/* Darling Blush — landing scripts. © 2026 Полунин Лев */
(function () {
  'use strict';
  var d = document, root = d.documentElement;
  root.classList.add('js');

  /* header shadow + floating button */
  var hdr = d.querySelector('.hdr'), fab = d.querySelector('.fab');
  function onScroll() {
    var y = window.pageYOffset || root.scrollTop;
    hdr.classList.toggle('is-scrolled', y > 20);
    if (fab) fab.classList.toggle('is-on', y > window.innerHeight * 0.9);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* burger */
  var burger = d.getElementById('burger'), nav = d.getElementById('nav');
  function setMenu(open) {
    nav.classList.toggle('is-open', open);
    d.body.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
  }
  burger.addEventListener('click', function () { setMenu(!nav.classList.contains('is-open')); });
  nav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  d.addEventListener('keydown', function (e) { if (e.key === 'Escape') { setMenu(false); closeHs(); } });
  window.addEventListener('resize', function () { if (window.innerWidth > 960) setMenu(false); });

  /* reveal on scroll */
  var rev = d.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('is-in'); io.unobserve(x.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    rev.forEach(function (el) { io.observe(el); });
  } else rev.forEach(function (el) { el.classList.add('is-in'); });

  /* videos: play only when visible */
  var vids = d.querySelectorAll('video');
  if ('IntersectionObserver' in window) {
    var vio = new IntersectionObserver(function (en) {
      en.forEach(function (x) {
        var v = x.target;
        if (x.isIntersecting) { v.preload = 'auto'; var p = v.play(); if (p && p.catch) p.catch(function () {}); }
        else v.pause();
      });
    }, { threshold: 0.35 });
    vids.forEach(function (v) { vio.observe(v); });
  }

  /* palette swatches */
  var stage = d.querySelector('.stage__frame'), sp = d.getElementById('stagePic'), cap = d.getElementById('stageCap');
  var sws = d.querySelectorAll('.sw');
  function pick(btn) {
    if (btn.getAttribute('aria-checked') === 'true') return;
    sws.forEach(function (b) { b.setAttribute('aria-checked', b === btn ? 'true' : 'false'); });
    var n = btn.dataset.img, base = 'assets/img/' + n;
    stage.classList.add('is-swap');
    var pre = new Image();
    pre.onload = pre.onerror = function () {
      setTimeout(function () {
        sp.querySelector('source').srcset = base + '-sm.webp 480w, ' + base + '.webp 960w';
        var img = sp.querySelector('img');
        img.src = base + '-sm.jpg';
        img.alt = btn.dataset.name + ' — пример готовой вещи';
        cap.innerHTML = '<b>' + btn.dataset.name + '</b><span>' + btn.dataset.text + '</span>';
        stage.classList.remove('is-swap');
      }, 180);
    };
    pre.src = base + '-sm.jpg';
  }
  sws.forEach(function (b, i) {
    b.addEventListener('click', function () { pick(b); });
    b.addEventListener('keydown', function (e) {
      var k = e.key, j = -1;
      if (k === 'ArrowRight' || k === 'ArrowDown') j = (i + 1) % sws.length;
      if (k === 'ArrowLeft' || k === 'ArrowUp') j = (i - 1 + sws.length) % sws.length;
      if (j > -1) { e.preventDefault(); sws[j].focus(); pick(sws[j]); }
    });
  });

  /* hotspots */
  var hs = d.querySelectorAll('.hs'), hl = d.querySelectorAll('#hsList button'), info = d.getElementById('hsInfo');
  function closeHs() {
    hs.forEach(function (h) { h.classList.remove('is-open'); h.querySelector('.hs__dot').setAttribute('aria-expanded', 'false'); });
    hl.forEach(function (b) { b.classList.remove('is-on'); });
  }
  function openHs(i) {
    var was = hs[i].classList.contains('is-open');
    closeHs();
    if (was) return;
    hs[i].classList.add('is-open');
    hs[i].querySelector('.hs__dot').setAttribute('aria-expanded', 'true');
    if (hl[i]) hl[i].classList.add('is-on');
    var tip = hs[i].querySelector('.hs__tip');
    if (info) info.innerHTML = tip.innerHTML;
  }
  hs.forEach(function (h, i) { h.querySelector('.hs__dot').addEventListener('click', function (e) { e.stopPropagation(); openHs(i); }); });
  hl.forEach(function (b, i) { b.addEventListener('click', function (e) { e.stopPropagation(); openHs(i); }); });
  d.addEventListener('click', function (e) { if (!e.target.closest('.hs')) closeHs(); });

  /* reviews slider */
  var slider = d.getElementById('slider');
  if (slider) {
    var track = d.getElementById('track'), slides = track.children, dotsBox = d.getElementById('dots');
    var prev = d.getElementById('prev'), next = d.getElementById('next'), idx = 0;
    function perView() { var w = window.innerWidth; return w <= 640 ? 1 : w <= 1080 ? 2 : 3; }
    function maxIdx() { return Math.max(0, slides.length - perView()); }
    function buildDots() {
      dotsBox.innerHTML = '';
      for (var i = 0; i <= maxIdx(); i++) {
        var b = d.createElement('button');
        b.type = 'button'; b.setAttribute('aria-label', 'Перейти к отзыву ' + (i + 1));
        (function (n) { b.addEventListener('click', function () { go(n); }); })(i);
        dotsBox.appendChild(b);
      }
    }
    function go(n) {
      idx = Math.max(0, Math.min(n, maxIdx()));
      var step = slides[0].getBoundingClientRect().width + parseFloat(getComputedStyle(track).gap || 22);
      track.style.transform = 'translate3d(' + (-idx * step) + 'px,0,0)';
      prev.disabled = idx === 0; next.disabled = idx === maxIdx();
      Array.prototype.forEach.call(dotsBox.children, function (b, i) { b.setAttribute('aria-current', i === idx ? 'true' : 'false'); });
    }
    prev.addEventListener('click', function () { go(idx - 1); });
    next.addEventListener('click', function () { go(idx + 1); });
    slider.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') go(idx - 1);
      if (e.key === 'ArrowRight') go(idx + 1);
    });
    /* swipe (touch + mouse) */
    var sx = 0, sy = 0, dx = 0, drag = false, lock = null;
    function start(x, y) { sx = x; sy = y; dx = 0; drag = true; lock = null; track.style.transition = 'none'; }
    function move(x, y, e) {
      if (!drag) return;
      dx = x - sx;
      if (lock === null) lock = Math.abs(dx) > Math.abs(y - sy) ? 'x' : 'y';
      if (lock !== 'x') return;
      if (e.cancelable) e.preventDefault();
      var step = slides[0].getBoundingClientRect().width + 22;
      track.style.transform = 'translate3d(' + (-idx * step + dx) + 'px,0,0)';
    }
    function end() {
      if (!drag) return;
      drag = false; track.style.transition = '';
      if (lock === 'x' && Math.abs(dx) > 50) go(idx + (dx < 0 ? 1 : -1)); else go(idx);
    }
    track.addEventListener('touchstart', function (e) { start(e.touches[0].clientX, e.touches[0].clientY); }, { passive: true });
    track.addEventListener('touchmove', function (e) { move(e.touches[0].clientX, e.touches[0].clientY, e); }, { passive: false });
    track.addEventListener('touchend', end);
    track.addEventListener('touchcancel', end);
    track.addEventListener('mousedown', function (e) { e.preventDefault(); start(e.clientX, e.clientY); });
    window.addEventListener('mousemove', function (e) { if (drag) move(e.clientX, e.clientY, e); });
    window.addEventListener('mouseup', end);
    var rt;
    window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(function () { buildDots(); go(idx); }, 120); });
    buildDots(); go(0);
  }

  var yr = d.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();
})();
