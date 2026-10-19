/* The Sentinel Syndicate - site behaviour (no dependencies) */
(function () {
  'use strict';
  var CFG = window.SENTINEL || {};

  /* ---------- Header & mobile menu ---------- */
  var header = document.querySelector('[data-header]');
  var toggle = document.querySelector('[data-menu-toggle]');
  var menu = document.querySelector('[data-mobile-menu]');

  if (header && header.classList.contains('site-header--overlay')) {
    var onScroll = function () { header.classList.toggle('is-scrolled', window.scrollY > 40); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  function setMenu(open) {
    if (!toggle || !menu) return;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.querySelector('[data-menu-label]').textContent = open ? 'Close' : 'Menu';
    menu.hidden = !open;
    menu.classList.toggle('is-open', open);
    header.classList.toggle('menu-open', open);
    document.body.classList.toggle('menu-locked', open);
    if (open) { var first = menu.querySelector('a'); if (first) first.focus(); }
  }
  if (toggle) {
    toggle.addEventListener('click', function () { setMenu(toggle.getAttribute('aria-expanded') !== 'true'); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') { setMenu(false); toggle.focus(); }
    });
    window.addEventListener('resize', function () { if (window.innerWidth >= 1180) setMenu(false); });
    // keep keyboard focus inside the open menu
    menu.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') return;
      var items = [toggle].concat([].slice.call(menu.querySelectorAll('a, button')));
      var i = items.indexOf(document.activeElement);
      if (e.shiftKey && i <= 0) { e.preventDefault(); items[items.length - 1].focus(); }
      else if (!e.shiftKey && i === items.length - 1) { e.preventDefault(); toggle.focus(); }
    });
  }

  /* ---------- Reveal on scroll ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- Horse directory filters ---------- */
  var filterForm = document.querySelector('[data-horse-filters]');
  if (filterForm) {
    var cards = [].slice.call(document.querySelectorAll('[data-horse]'));
    var count = document.querySelector('[data-horse-count]');
    var empty = document.querySelector('[data-no-results]');
    var applyFilters = function () {
      var q = (filterForm.q && filterForm.q.value || '').trim().toLowerCase();
      var status = filterForm.status ? filterForm.status.value : '';
      var sex = filterForm.sex ? filterForm.sex.value : '';
      var age = filterForm.age ? filterForm.age.value : '';
      var shown = 0;
      cards.forEach(function (card) {
        var ok = (!q || card.dataset.name.indexOf(q) > -1) &&
          (!status || (status === 'open' ? /^(available|racing)$/.test(card.dataset.status) : card.dataset.status === status)) &&
          (!sex || card.dataset.sex === sex) &&
          (!age || card.dataset.age === age);
        card.hidden = !ok;
        if (ok) { shown++; card.classList.add('is-in'); }
      });
      if (count) count.textContent = 'Showing ' + shown + ' of ' + cards.length + (cards.length === 1 ? ' horse' : ' horses');
      if (empty) empty.classList.toggle('is-visible', shown === 0);
    };
    filterForm.addEventListener('input', applyFilters);
    filterForm.addEventListener('submit', function (e) { e.preventDefault(); applyFilters(); });
    filterForm.addEventListener('reset', function () { setTimeout(applyFilters, 0); });
    applyFilters();
  }

  /* ---------- Pre-fill tier from ?tier= ---------- */
  var params = new URLSearchParams(window.location.search);
  if (params.get('tier')) {
    var tierSelect = document.querySelector('select[name="tier"]');
    if (tierSelect) {
      tierSelect.value = params.get('tier');
      var type = document.querySelector('select[name="enquiry_type"]');
      if (type && !type.value) type.value = 'Ownership costs and share availability';
    }
  }
  if (params.get('horse')) {
    var horseSelect = document.querySelector('select[name="horse"]');
    if (horseSelect) {
      horseSelect.value = params.get('horse');
      var t2 = document.querySelector('select[name="enquiry_type"]');
      if (t2) t2.value = 'Enquiry about a particular horse';
    }
  }

  /* ---------- Enquiry forms ---------- */
  var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  function validPhone(v) {
    var digits = v.replace(/[\s().-]/g, '');
    if (/^(\+?254|0)?[17]\d{8}$/.test(digits)) return true; // Kenyan mobile & landline formats
    return /^\+?\d{8,15}$/.test(digits); // international
  }
  function labelFor(field) {
    if (field.getAttribute('data-summary')) return field.getAttribute('data-summary');
    var l = field.querySelector('label, legend');
    return l ? l.textContent.replace('*', '').replace('(optional)', '').trim() : 'This field';
  }

  function validateField(fieldEl) {
    var group = fieldEl.getAttribute('data-group');
    var errEl = fieldEl.querySelector('[data-error]');
    var msg = '';
    var target;
    if (group) {
      target = fieldEl.querySelector('.choice-group');
      var checked = fieldEl.querySelector('input:checked');
      if (target.getAttribute('aria-required') === 'true' && !checked) msg = 'Please choose how you would like us to contact you.';
    } else {
      target = fieldEl.querySelector('input:not([type=hidden]), select, textarea');
      if (!target) return true;
      var v = target.type === 'checkbox' ? target.checked : target.value.trim();
      if (target.required && !v) {
        msg = target.type === 'checkbox' ? 'Please confirm you agree to be contacted about your enquiry.'
          : target.tagName === 'SELECT' ? 'Please select ' + labelFor(fieldEl).toLowerCase() + '.'
          : 'Please enter your ' + labelFor(fieldEl).toLowerCase() + '.';
      } else if (v && target.type === 'email' && !EMAIL.test(v)) {
        msg = 'Please enter a valid email address, for example name@example.com.';
      } else if (v && target.type === 'tel' && !validPhone(v)) {
        msg = 'Please enter a valid phone number, for example +254 712 345 678.';
      } else if (v && target.name === 'name' && v.length < 2) {
        msg = 'Please enter your full name.';
      }
    }
    if (errEl) { errEl.textContent = msg; errEl.classList.toggle('is-visible', !!msg); }
    if (target) target.setAttribute('aria-invalid', msg ? 'true' : 'false');
    return !msg;
  }

  function contactFallbackHtml() {
    var c = CFG.contact || {};
    var bits = [];
    if (c.whatsapp) bits.push('<a href="' + c.whatsapp + '" rel="noopener">WhatsApp</a>');
    if (c.phone) bits.push('call <a href="tel:' + c.phone + '">' + (c.phoneDisplay || c.phone) + '</a>');
    if (c.email) bits.push('email <a href="mailto:' + c.email + '">' + c.email + '</a>');
    return bits.length ? ' Please contact us directly: ' + bits.join(', ') + '.' : '';
  }

  function showStatus(form, type, html) {
    var s = form.querySelector('[data-form-status]');
    s.className = 'form-status form-status--' + type + ' is-visible';
    s.innerHTML = html;
    s.focus({ preventScroll: true });
    s.scrollIntoView({ block: 'center', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }

  document.querySelectorAll('[data-enquiry-form]').forEach(function (form) {
    var fields = [].slice.call(form.querySelectorAll('[data-field]'));
    var touched = false;

    fields.forEach(function (f) {
      f.addEventListener('change', function () { if (touched) validateField(f); });
      f.addEventListener('focusout', function (e) {
        var el = e.target;
        if (el.value && el.value.trim && el.value.trim()) validateField(f);
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      touched = true;
      var invalid = fields.filter(function (f) { return !validateField(f); });
      if (invalid.length) {
        showStatus(form, 'error', '<strong>Please check ' + invalid.length + (invalid.length === 1 ? ' field' : ' fields') + ':</strong><ul>' +
          invalid.map(function (f) {
            var el = f.querySelector('input:not([type=hidden]), select, textarea');
            return '<li><a href="#' + el.id + '">' + labelFor(f) + '</a></li>';
          }).join('') + '</ul>');
        return;
      }

      // Bot trap
      if (form.botcheck && form.botcheck.checked) return;

      var cfg = CFG.forms || {};
      if (!cfg.accessKey || !cfg.endpoint) {
        showStatus(form, 'info', '<strong>Online enquiries are being connected.</strong> Your details have not been sent.' + contactFallbackHtml());
        return;
      }

      var data = {};
      new FormData(form).forEach(function (v, k) { if (k !== 'botcheck') data[k] = v; });
      // send readable option labels (e.g. "Ownership · Growth (5% ownership)") rather than internal values
      form.querySelectorAll('select').forEach(function (sel) { if (sel.value) data[sel.name] = sel.options[sel.selectedIndex].text; });
      data.access_key = cfg.accessKey;
      data.subject = form.getAttribute('data-subject') + (data.name ? ' - ' + data.name : '');
      data.from_name = CFG.siteName || 'Website';
      data.page = window.location.href;

      var btn = form.querySelector('[data-submit]');
      var label = btn.textContent;
      btn.disabled = true; btn.textContent = 'Sending…';

      fetch(cfg.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data),
      })
        .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { ok: r.ok, body: j }; }); })
        .then(function (res) {
          if (!res.ok || res.body.success === false) throw new Error(res.body.message || 'Submission failed');
          var wrap = form.closest('[data-form-wrap]');
          var success = wrap.querySelector('[data-form-success]');
          form.hidden = true;
          success.classList.add('is-visible');
          success.focus();
          if (window.gtag) window.gtag('event', 'generate_lead', { form: form.getAttribute('data-subject') });
        })
        .catch(function () {
          showStatus(form, 'error', '<strong>Sorry, your enquiry could not be sent.</strong> Please check your connection and try again.' + contactFallbackHtml());
        })
        .then(function () { btn.disabled = false; btn.textContent = label; });
    });
  });

  /* ---------- Analytics consent (only when a GA4 ID is configured) ---------- */
  var banner = document.querySelector('[data-consent]');
  if (CFG.ga4 && banner) {
    var KEY = 'sentinel-consent';
    var read = function () { try { return localStorage.getItem(KEY); } catch (e) { return null; } };
    var write = function (v) { try { localStorage.setItem(KEY, v); } catch (e) { /* ignore */ } };
    var loadGa = function () {
      if (window.gtag) return;
      var s = document.createElement('script');
      s.async = true;
      s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(CFG.ga4);
      document.head.appendChild(s);
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { window.dataLayer.push(arguments); };
      window.gtag('js', new Date());
      window.gtag('config', CFG.ga4, { anonymize_ip: true });
    };
    var choice = read();
    if (choice === 'granted') loadGa();
    else if (!choice) banner.classList.add('is-visible');
    banner.querySelector('[data-consent-accept]').addEventListener('click', function () { write('granted'); banner.classList.remove('is-visible'); loadGa(); });
    banner.querySelector('[data-consent-decline]').addEventListener('click', function () { write('denied'); banner.classList.remove('is-visible'); });
    document.querySelectorAll('[data-consent-open]').forEach(function (b) {
      b.addEventListener('click', function () { banner.classList.add('is-visible'); banner.querySelector('button').focus(); });
    });
  }
})();
