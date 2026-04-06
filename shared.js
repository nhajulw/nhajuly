/* ═══════════════════════════════════════════════════════════════
   shared.js — nhajuly
   1. Theme  (localStorage, zero-flash)
   2. Cursor (smooth two-layer physics, clean minimal)
   3. Cart   (localStorage, cross-page, persistent button states)
   4. Mobile Nav
   5. Smooth scroll
═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ─────────────────────────────────────────────────────────────
     1. THEME
  ───────────────────────────────────────────────────────────── */
  var html = document.documentElement;
  html.dataset.theme = localStorage.getItem('nhajuly-theme') || 'dark';

  function syncThemeBtn(t) {
    document.querySelectorAll('.theme-icon').forEach(function(el){ el.textContent = t === 'dark' ? '☽' : '☀'; });
    document.querySelectorAll('.theme-label').forEach(function(el){ el.textContent = t === 'dark' ? 'Light' : 'Dark'; });
    var ic = document.getElementById('themeIcon');
    var lb = document.getElementById('themeLabel');
    if (ic) ic.textContent = t === 'dark' ? '☽' : '☀';
    if (lb) lb.textContent = t === 'dark' ? 'Light' : 'Dark';
  }

  document.addEventListener('DOMContentLoaded', function () {
    syncThemeBtn(html.dataset.theme);
    var btn = document.getElementById('themeBtn');
    if (btn) btn.addEventListener('click', function () {
      var n = html.dataset.theme === 'dark' ? 'light' : 'dark';
      html.dataset.theme = n;
      localStorage.setItem('nhajuly-theme', n);
      syncThemeBtn(n);
    });
  });


  /* ─────────────────────────────────────────────────────────────
     2. CURSOR — Phinger cursor theme
        #cur-phinger : wrapper, tracks mouse precisely
        #cur-arrow   : Phinger-style geometric arrow (default)
        #cur-hand    : Phinger-style pointer hand (hover)
        Theme-aware fills via CSS vars, crossfade on hover,
        scale-down on click. Direct position, no spring lag.
  ───────────────────────────────────────────────────────────── */
  var isTouch = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
  if (!isTouch) { initCursor(); }

  function initCursor() {

    /* ── Phinger Arrow SVG ─────────────────────────────────────
       Faithful Phinger-style arrow:
       - Hotspot at top-left tip (3,3)
       - Straight left edge, angled right side
       - Notch cut-in on the right for the classic Phinger shape
       - Solid fill + contrasting stroke outline
    ─────────────────────────────────────────────────────────── */
    var A = 'M3,3 L3,30 L9,24 L14,35 L17,33.5 L12,22.5 L20,22.5 Z';

    var arrowSVG =
      '<svg id="cur-arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="40" height="40">' +
        '<path stroke="var(--cur-stroke)" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round" fill="none" d="' + A + '"/>' +
        '<path class="cur-body" d="' + A + '"/>' +
      '</svg>';

    /* ── Phinger Hand / Pointer SVG ────────────────────────────
       Clean geometric pointing hand in Phinger style:
       - Extended index finger, hotspot at fingertip (13,3)
       - Rounded finger joints, natural curl on other fingers
       - Same fill/stroke system as arrow
    ─────────────────────────────────────────────────────────── */
    var H =
      'M13,3 C13,1.5 14.2,0.5 15.5,0.5 C16.8,0.5 18,1.5 18,3 ' +
      'L18,15 C19,13.8 20.5,13.4 21.8,14.2 ' +
      'C22.6,13.2 24.2,13.0 25.2,14.2 ' +
      'C26.0,13.3 27.6,13.5 28.2,15.0 ' +
      'L28.2,24 C28.2,29.5 24,34.5 18.5,34.5 L16,34.5 ' +
      'C11.5,34.5 8,31 8,26.5 L8,19.5 ' +
      'C8,17.8 9.3,16.5 11,16.5 C12.2,16.5 13.2,17.3 13.5,18.4 ' +
      'L13,3 Z';

    var handSVG =
      '<svg id="cur-hand" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="40" height="40">' +
        '<path stroke="var(--cur-stroke)" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round" fill="none" d="' + H + '"/>' +
        '<path class="cur-body" d="' + H + '"/>' +
        /* Subtle knuckle lines */
        '<line stroke="var(--cur-stroke)" stroke-width="1.1" stroke-linecap="round" opacity="0.3" x1="18" y1="17.5" x2="18" y2="22"/>' +
        '<line stroke="var(--cur-stroke)" stroke-width="1.1" stroke-linecap="round" opacity="0.3" x1="21.8" y1="17.5" x2="21.8" y2="22"/>' +
        '<line stroke="var(--cur-stroke)" stroke-width="1.1" stroke-linecap="round" opacity="0.3" x1="25.2" y1="18" x2="25.2" y2="22"/>' +
      '</svg>';

    var markup = '<div id="cur-phinger">' + arrowSVG + handSVG + '</div>';
    document.body.insertAdjacentHTML('afterbegin', markup);

    var cur = document.getElementById('cur-phinger');
    var mx = -300, my = -300;
    var visible = false;

    /* Direct 1:1 tracking — Phinger is crisp & precise, no lag */
    function tick() {
      cur.style.transform = 'translate3d(' + mx + 'px,' + my + 'px,0)';
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);

    document.addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY;
      if (!visible) { visible = true; cur.style.opacity = '1'; }
    });
    document.addEventListener('mouseleave', function () { visible = false; cur.style.opacity = '0'; });
    document.addEventListener('mouseenter', function () {
      if (mx > -100) { visible = true; cur.style.opacity = '1'; }
    });
    document.addEventListener('mousedown', function () { cur.classList.add('cur-click'); });
    document.addEventListener('mouseup',   function () { cur.classList.remove('cur-click'); });

    /* Swap to hand on interactive elements */
    document.addEventListener('DOMContentLoaded', function () {
      wireHover(document);
      new MutationObserver(function (muts) {
        muts.forEach(function (m) {
          m.addedNodes.forEach(function (n) { if (n.nodeType === 1) wireHover(n); });
        });
      }).observe(document.body, { childList: true, subtree: true });
    });

    function wireHover(root) {
      var sel = 'a,button,.btn-primary,.btn-ghost,.atc-btn,.cc-enroll,.enroll-btn,.filter-btn,.cart-item,.prod-row,.pay-row';
      (root.querySelectorAll ? root : document).querySelectorAll(sel).forEach(function (el) {
        if (el._ppWired) return;
        el._ppWired = true;
        el.addEventListener('mouseenter', function () { cur.classList.add('cur-hover'); });
        el.addEventListener('mouseleave', function () { cur.classList.remove('cur-hover'); });
      });
    }
  }


  /* ─────────────────────────────────────────────────────────────
     3. CART — localStorage, cross-page, persistent button states
  ───────────────────────────────────────────────────────────── */
  function loadCart() {
    try { return JSON.parse(localStorage.getItem('nhajuly-cart') || '[]'); }
    catch (e) { return []; }
  }
  function saveCart(c) { localStorage.setItem('nhajuly-cart', JSON.stringify(c)); }

  window._cart = loadCart();

  window.openCart = function () {
    var ov = document.getElementById('cartOverlay');
    var dr = document.getElementById('cartDrawer');
    if (ov) ov.classList.add('open');
    if (dr) dr.classList.add('open');
    document.body.style.overflow = 'hidden';
  };
  window.closeCart = function () {
    var ov = document.getElementById('cartOverlay');
    var dr = document.getElementById('cartDrawer');
    if (ov) ov.classList.remove('open');
    if (dr) dr.classList.remove('open');
    document.body.style.overflow = '';
  };

  window.addToCart = function (name, type, price, btn) {
    if (!window._cart.find(function (i) { return i.name === name; })) {
      window._cart.push({ name: name, type: type, price: price, id: Date.now() });
      saveCart(window._cart);
    }
    renderCart();
    syncAllButtons();
    openCart();
  };

  window.removeFromCart = function (id) {
    window._cart = window._cart.filter(function (i) { return i.id !== id; });
    saveCart(window._cart);
    renderCart();
    syncAllButtons();
  };

  /* Sync all add-to-cart / enroll buttons to show cart state persistently */
  window.syncAllButtons = function () {
    var cart = window._cart;
    document.querySelectorAll('[data-product-name]').forEach(function (btn) {
      var name = btn.dataset.productName;
      var inCart = cart.find(function (i) { return i.name === name; });
      var isEnroll = btn.classList.contains('cc-enroll') || btn.classList.contains('enroll-btn');
      if (inCart) {
        btn.classList.add('added');
        btn.textContent = isEnroll ? 'Enrolled ✓' : 'In Cart ✓';
      } else {
        btn.classList.remove('added');
        btn.textContent = isEnroll ? 'Enroll Now' : 'Add to Cart';
      }
    });
  };

  window.renderCart = function () {
    var cart  = window._cart;
    var el    = document.getElementById('cartItems');
    var empty = document.getElementById('cartEmpty');
    var cnt   = document.getElementById('cartCount');
    var tot   = document.getElementById('cartTotal');
    if (cnt) { cnt.textContent = cart.length; cnt.classList.toggle('has-items', cart.length > 0); }
    if (tot) tot.textContent = '$' + cart.reduce(function (a, i) { return a + i.price; }, 0);
    if (!el) return;
    if (!cart.length) {
      if (empty) empty.style.display = 'flex';
      el.innerHTML = '';
      if (empty) el.appendChild(empty);
      return;
    }
    if (empty) empty.style.display = 'none';
    el.innerHTML = '';
    cart.forEach(function (item) {
      var d = document.createElement('div');
      d.className = 'cart-item';
      d.innerHTML =
        '<div class="ci-thumb">' + item.type.slice(0, 3) + '</div>' +
        '<div class="ci-info"><div class="ci-type">' + item.type + '</div>' +
        '<div class="ci-name">' + item.name + '</div></div>' +
        '<div class="ci-price">$' + item.price + '</div>' +
        '<button class="ci-remove" onclick="removeFromCart(' + item.id + ')">✕</button>';
      el.appendChild(d);
    });
  };

  document.addEventListener('DOMContentLoaded', function () {
    window._cart = loadCart();
    renderCart();
    syncAllButtons();
  });


  /* ─────────────────────────────────────────────────────────────
     4. MOBILE NAV
  ───────────────────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    var hamburger    = document.getElementById('navHamburger');
    var mobileMenu   = document.getElementById('mobileMenu');
    var mobileClose  = document.getElementById('mobileClose');
    var mobileOverlay= document.getElementById('mobileOverlay');

    function openMenu() {
      if (mobileMenu)    mobileMenu.classList.add('open');
      if (mobileOverlay) mobileOverlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
    function closeMenu() {
      if (mobileMenu)    mobileMenu.classList.remove('open');
      if (mobileOverlay) mobileOverlay.classList.remove('open');
      document.body.style.overflow = '';
    }

    if (hamburger)     hamburger.addEventListener('click', openMenu);
    if (mobileClose)   mobileClose.addEventListener('click', closeMenu);
    if (mobileOverlay) mobileOverlay.addEventListener('click', closeMenu);
    if (mobileMenu) {
      mobileMenu.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', closeMenu);
      });
    }
  });


  /* ─────────────────────────────────────────────────────────────
     5. SMOOTH SCROLL
  ───────────────────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var t = document.querySelector(a.getAttribute('href'));
        if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
      });
    });
  });

})();
