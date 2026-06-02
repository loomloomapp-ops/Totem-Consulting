/* ============================================================
   TOTEM CONSULTING — interactions
   header hide/show · burger · smooth scroll · scroll-reveal ·
   stat counters · services accordion · FAQ accordion · value tabs ·
   principles carousel · popup · form validation · Telegram
   ============================================================ */
(function () {
  'use strict';

  /* ---------- Brand preloader ----------
     Holds the brand intro for a short minimum, then dissolves once the
     page has loaded. Hard fallback guarantees it always disappears. */
  (function () {
    var pre = document.getElementById('preloader');
    if (!pre) { document.body.classList.remove('pl-active'); return; }
    var started = Date.now(), MIN = 1350, MAX = 4500, done = false;
    function reveal() {
      if (done) return; done = true;
      var wait = Math.max(0, MIN - (Date.now() - started));
      window.setTimeout(function () {
        pre.classList.add('is-leaving');
        document.body.classList.remove('pl-active'); // unlock scroll + reveal site
        var cleaned = false;
        function cleanup() {
          if (cleaned) return; cleaned = true;
          if (pre && pre.parentNode) pre.parentNode.removeChild(pre);
        }
        pre.addEventListener('transitionend', function (e) {
          if (e.target === pre && e.propertyName === 'opacity') cleanup();
        });
        window.setTimeout(cleanup, 1100); // fallback if transitionend never fires
      }, wait);
    }
    if (document.readyState === 'complete') reveal();
    else window.addEventListener('load', reveal);
    window.setTimeout(reveal, MAX); // absolute fallback regardless of load state
  })();

  /* ---------- TELEGRAM ---------- */
  var TELEGRAM_BOT_TOKEN = ''; // токен від @BotFather
  var TELEGRAM_CHAT_ID   = ''; // chat_id (напр. через @userinfobot)

  function sendToTelegram(data) {
    var text =
      'Нова заявка — TOTEM CONSULTING\n\n' +
      'Імʼя: ' + data.name + '\n' +
      'Instagram: ' + data.instagram + '\n' +
      'Телефон: ' + data.phone + '\n' +
      'Пошта: ' + data.email + '\n' +
      'Джерело: ' + (data.source || 'сайт');
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      console.warn('[TOTEM] Telegram не налаштований. Заявка:', data);
      return Promise.resolve();
    }
    return fetch('https://api.telegram.org/bot' + TELEGRAM_BOT_TOKEN + '/sendMessage', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: text })
    }).then(function (r) { if (!r.ok) throw new Error('Telegram ' + r.status); });
  }

  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  var yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Header hide/show ---------- */
  var header = $('#header'), lastScroll = 0, ticking = false;
  function onScroll() {
    var y = window.pageYOffset || document.documentElement.scrollTop;
    if (!document.body.classList.contains('menu-open')) {
      if (y > lastScroll && y > 220) header.classList.add('header--hidden');
      else header.classList.remove('header--hidden');
    }
    lastScroll = y <= 0 ? 0 : y;
    var past = y > window.innerHeight * 0.6;
    if (floatingWidget) floatingWidget.classList.toggle('show', past);
    if (stickyCta) stickyCta.classList.toggle('show', past);
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { window.requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });

  var floatingWidget = $('#floatingWidget'), stickyCta = $('#stickyCta');

  /* ---------- Burger ---------- */
  var burger = $('#burger');
  function setMenu(open) {
    document.body.classList.toggle('menu-open', open);
    if (burger) burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.style.overflow = open ? 'hidden' : '';
  }
  if (burger) burger.addEventListener('click', function () { setMenu(!document.body.classList.contains('menu-open')); });
  $$('[data-mclose]').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });

  /* ---------- Smooth scroll ---------- */
  $$('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var id = link.getAttribute('href');
      if (id === '#' || id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.pageYOffset - 78 + 1;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  /* ---------- Accordions (services + FAQ share logic) ---------- */
  function wireAccordion(items, headSel, bodySel) {
    function setOpen(item, open) {
      var body = item.querySelector(bodySel), head = item.querySelector(headSel);
      if (!body) return;
      if (open) {
        item.classList.add('open');
        if (head) head.setAttribute('aria-expanded', 'true');
        body.style.height = body.firstElementChild.offsetHeight + 'px';
      } else {
        item.classList.remove('open');
        if (head) head.setAttribute('aria-expanded', 'false');
        body.style.height = body.offsetHeight + 'px';
        body.offsetHeight; // reflow
        body.style.height = '0px';
      }
    }
    items.forEach(function (item) {
      if (item.classList.contains('open')) {
        var b = item.querySelector(bodySel);
        b.style.height = b.firstElementChild.offsetHeight + 'px';
      }
      var head = item.querySelector(headSel);
      if (head) head.addEventListener('click', function () {
        var isOpen = item.classList.contains('open');
        items.forEach(function (o) { if (o !== item) setOpen(o, false); });
        setOpen(item, !isOpen);
      });
    });
    window.addEventListener('resize', function () {
      items.forEach(function (item) {
        if (item.classList.contains('open')) {
          var b = item.querySelector(bodySel);
          b.style.height = b.firstElementChild.offsetHeight + 'px';
        }
      });
    });
  }
  wireAccordion($$('.acc-item'), '.acc-head', '.acc-body');
  wireAccordion($$('.faq-item'), '.faq-q', '.faq-a');

  /* ---------- Value tabs ---------- */
  $$('.value-tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      var group = tab.closest('.value-grid') || document;
      var id = tab.getAttribute('data-vtab');
      $$('.value-tab', group).forEach(function (t) { t.classList.toggle('active', t === tab); });
      $$('.value-panel', group).forEach(function (p) { p.classList.toggle('active', p.id === id); });
    });
  });

  /* ---------- Principles carousel ---------- */
  (function () {
    var track = $('.carousel-track');
    if (!track) return;
    var index = 0;
    function maxIndex() {
      var card = track.firstElementChild;
      if (!card) return 0;
      var cardW = card.offsetWidth + 16;
      var visible = Math.max(1, Math.floor(track.parentElement.offsetWidth / cardW));
      return Math.max(0, track.children.length - visible);
    }
    function go(i) {
      index = Math.max(0, Math.min(i, maxIndex()));
      var card = track.firstElementChild;
      var cardW = card.offsetWidth + 16;
      track.style.transform = 'translateX(' + (-index * cardW) + 'px)';
    }
    var prev = $('[data-carousel-prev]'), next = $('[data-carousel-next]');
    if (prev) prev.addEventListener('click', function () { go(index - 1); });
    if (next) next.addEventListener('click', function () { go(index + 1); });
    window.addEventListener('resize', function () { go(index); });
    // drag / swipe
    var startX = 0, dragging = false;
    track.addEventListener('pointerdown', function (e) { dragging = true; startX = e.clientX; });
    window.addEventListener('pointerup', function (e) {
      if (!dragging) return; dragging = false;
      var dx = e.clientX - startX;
      if (dx < -50) go(index + 1); else if (dx > 50) go(index - 1);
    });
  })();

  /* ---------- Stat counters ---------- */
  function animateCount(el) {
    var target = parseInt(el.getAttribute('data-count'), 10) || 0;
    var dur = 1400, start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(eased * target);
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target;
    }
    requestAnimationFrame(step);
  }

  /* ---------- Scroll reveal + counters ---------- */
  var revealEls = $$('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('in'); io.unobserve(entry.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(function (el) { io.observe(el); });

    var counters = $$('.stat-num[data-count]');
    var io2 = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { animateCount(entry.target); io2.unobserve(entry.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { io2.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
    $$('.stat-num[data-count]').forEach(function (el) { el.textContent = el.getAttribute('data-count'); });
  }

  /* ---------- Popup ---------- */
  var popup = $('#popup'), popupClose = $('#popupClose'), lastFocused = null;
  function openPopup() {
    lastFocused = document.activeElement;
    popup.classList.add('open');
    document.body.style.overflow = 'hidden';
    var first = popup.querySelector('input');
    if (first) setTimeout(function () { first.focus(); }, 300);
    document.addEventListener('keydown', onPopupKey);
  }
  function closePopup() {
    popup.classList.remove('open');
    if (!document.body.classList.contains('menu-open')) document.body.style.overflow = '';
    document.removeEventListener('keydown', onPopupKey);
    if (lastFocused) lastFocused.focus();
  }
  function onPopupKey(e) {
    if (e.key === 'Escape') closePopup();
    if (e.key === 'Tab') {
      var f = $$('input, button, a[href]', popup).filter(function (el) { return !el.disabled && el.offsetParent !== null; });
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }
  $$('[data-open-popup]').forEach(function (btn) { btn.addEventListener('click', function () { setMenu(false); openPopup(); }); });
  if (popupClose) popupClose.addEventListener('click', closePopup);
  if (popup) popup.addEventListener('click', function (e) { if (e.target === popup) closePopup(); });

  /* ---------- Forms ---------- */
  function setError(input, msg) {
    var field = input.closest('.field'); if (!field) return;
    field.classList.toggle('has-error', !!msg);
    var err = field.querySelector('[data-err]'); if (err) err.textContent = msg || '';
  }
  function validate(form) {
    var ok = true;
    var name = form.querySelector('[name="name"]'), ig = form.querySelector('[name="instagram"]'),
        phone = form.querySelector('[name="phone"]'), email = form.querySelector('[name="email"]');
    if (!name.value.trim() || name.value.trim().length < 2) { setError(name, 'Вкажіть імʼя'); ok = false; } else setError(name, '');
    if (!ig.value.trim()) { setError(ig, 'Вкажіть Instagram'); ok = false; } else setError(ig, '');
    if (phone.value.replace(/\D/g, '').length < 9) { setError(phone, 'Вкажіть коректний номер'); ok = false; } else setError(phone, '');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) { setError(email, 'Вкажіть коректну пошту'); ok = false; } else setError(email, '');
    return ok;
  }
  function wireForm(formId, successId) {
    var form = $('#' + formId), success = $('#' + successId);
    if (!form) return;
    $$('input', form).forEach(function (input) {
      input.addEventListener('input', function () { if (input.closest('.field').classList.contains('has-error')) setError(input, ''); });
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validate(form)) return;
      var btn = form.querySelector('button[type="submit"]'), label = btn ? btn.querySelector('.btn-label') : null;
      var prev = label ? label.textContent : '';
      if (label) label.textContent = 'Надсилаємо…';
      if (btn) btn.disabled = true;
      var data = {
        name: form.querySelector('[name="name"]').value.trim(),
        instagram: form.querySelector('[name="instagram"]').value.trim(),
        phone: form.querySelector('[name="phone"]').value.trim(),
        email: form.querySelector('[name="email"]').value.trim(),
        source: formId === 'popupForm' ? 'popup-форма' : 'CTA-форма'
      };
      sendToTelegram(data).catch(function (err) { console.error('[TOTEM]', err); }).then(function () {
        form.reset(); form.style.display = 'none';
        if (success) success.classList.add('show');
        if (btn) btn.disabled = false;
        if (label) label.textContent = prev;
      });
    });
  }
  wireForm('mainForm', 'mainSuccess');
  wireForm('popupForm', 'popupSuccess');

  if (popup) popup.addEventListener('transitionend', function () {
    if (!popup.classList.contains('open')) {
      var pf = $('#popupForm'), ps = $('#popupSuccess');
      if (pf && ps && ps.classList.contains('show')) { ps.classList.remove('show'); pf.style.display = ''; }
    }
  });

  onScroll();
})();
