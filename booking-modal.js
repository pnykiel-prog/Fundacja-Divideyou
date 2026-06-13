/* ============================================================
   booking-modal.js — "Umów rozmowę" popup with slot booking
   Plain JS. Loaded site-wide. Intercepts any link/button whose
   text matches "umów ... rozmowę" or has [data-booking].
   ============================================================ */
(function () {
  if (window.__bookingModalInit) return;
  window.__bookingModalInit = true;

  var SLOTS = ['9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];

  function todayISO() {
    var d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 10);
  }

  var overlay = document.createElement('div');
  overlay.className = 'booking-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Umów 15-minutową rozmowę');

  var slotsHtml = SLOTS.map(function (s, i) {
    return '<span class="opt' + (i === 0 ? ' sel' : '') + '" data-slot="' + s + '">' + s + '</span>';
  }).join('');

  overlay.innerHTML =
    '<div class="booking-card">' +
      '<button class="bk-close" type="button" aria-label="Zamknij">\u00d7</button>' +
      '<div class="bk-form-wrap">' +
        '<div class="bk-head">' +
          '<span class="bk-eyebrow">Rozmowa 15 minut</span>' +
          '<h3>Um\u00f3w rozmow\u0119 na konkretny termin</h3>' +
          '<p class="bk-sub">Wybierz dzie\u0144 i godzin\u0119 \u2014 oddzwonimy lub po\u0142\u0105czymy si\u0119 online. Potwierdzenie wy\u015blemy mailem.</p>' +
        '</div>' +
        '<form class="form bk-body" id="bkForm" onsubmit="return false;" style="border:none;box-shadow:none;padding-top:18px;padding-bottom:28px;background:transparent;">' +
          '<div class="bk-row2">' +
            '<div class="field"><label for="bkName">Imi\u0119 i nazwisko</label><input id="bkName" type="text" placeholder="Jan Kowalski" required/></div>' +
            '<div class="field"><label for="bkOrg">Organizacja</label><input id="bkOrg" type="text" placeholder="Gmina / firma / NGO"/></div>' +
          '</div>' +
          '<div class="bk-row2">' +
            '<div class="field"><label for="bkEmail">E-mail</label><input id="bkEmail" type="email" placeholder="jan@przyklad.pl" required/></div>' +
            '<div class="field"><label for="bkPhone">Telefon (opcjonalnie)</label><input id="bkPhone" type="tel" placeholder="+48 600 000 000"/></div>' +
          '</div>' +
          '<div class="bk-row2">' +
            '<div class="field"><label for="bkDate">Preferowany dzie\u0144</label><input id="bkDate" type="date"/></div>' +
            '<div class="field"><label for="bkMode">Forma</label><select id="bkMode"><option>Telefon</option><option>Wideo (online)</option></select></div>' +
          '</div>' +
          '<div class="field"><label>Preferowana godzina</label><div class="bk-slots" id="bkSlots">' + slotsHtml + '</div></div>' +
          '<button class="btn btn-primary bk-submit" type="submit">Zarezerwuj termin <span class="ar">\u2192</span></button>' +
          '<p class="bk-privacy">Rezerwuj\u0105c termin akceptujesz polityk\u0119 prywatno\u015bci i przetwarzanie danych (RODO).</p>' +
        '</form>' +
      '</div>' +
      '<div class="bk-done" id="bkDone" style="display:none;">' +
        '<div class="bk-check">\u2713</div>' +
        '<h3>Termin zarezerwowany</h3>' +
        '<p>Dzi\u0119kujemy! Potwierdzimy spotkanie mailowo. Je\u015bli termin b\u0119dzie wymaga\u0142 zmiany \u2014 zaproponujemy najbli\u017cszy mo\u017cliwy.</p>' +
        '<div class="bk-recap" id="bkRecap"></div>' +
      '</div>' +
    '</div>';

  document.body.appendChild(overlay);

  var card = overlay.querySelector('.booking-card');
  var dateInput = overlay.querySelector('#bkDate');
  dateInput.min = todayISO();
  dateInput.value = todayISO();

  var selectedSlot = SLOTS[0];
  overlay.querySelector('#bkSlots').addEventListener('click', function (e) {
    var opt = e.target.closest('.opt');
    if (!opt) return;
    this.querySelectorAll('.opt').forEach(function (o) { o.classList.remove('sel'); });
    opt.classList.add('sel');
    selectedSlot = opt.getAttribute('data-slot');
  });

  function open() {
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    var n = overlay.querySelector('#bkName');
    if (n) setTimeout(function () { n.focus(); }, 60);
  }
  function close() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  overlay.querySelector('.bk-close').addEventListener('click', close);
  overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && overlay.classList.contains('open')) close(); });

  overlay.querySelector('#bkForm').addEventListener('submit', function () {
    var name = (overlay.querySelector('#bkName').value || '').trim();
    var email = (overlay.querySelector('#bkEmail').value || '').trim();
    var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!name || !emailOk) {
      [overlay.querySelector('#bkName'), overlay.querySelector('#bkEmail')].forEach(function (f) {
        if (!f.value.trim()) { f.style.borderColor = '#b04a3a'; f.addEventListener('input', function once(){ f.style.borderColor=''; f.removeEventListener('input', once); }); }
      });
      return;
    }
    var d = overlay.querySelector('#bkDate').value;
    var mode = overlay.querySelector('#bkMode').value;
    var nice = d;
    try {
      nice = new Date(d + 'T00:00:00').toLocaleDateString('pl-PL', { weekday: 'long', day: 'numeric', month: 'long' });
    } catch (e) {}

    var submitBtn = overlay.querySelector('.bk-submit');
    var original = submitBtn ? submitBtn.innerHTML : '';
    if (submitBtn) { submitBtn.disabled = true; submitBtn.innerHTML = 'Rezerwuj\u0119\u2026'; }

    fetch('/api/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        formType: 'booking',
        name: name,
        org: (overlay.querySelector('#bkOrg').value || '').trim(),
        email: email,
        phone: (overlay.querySelector('#bkPhone').value || '').trim(),
        date: nice,
        slot: selectedSlot,
        mode: mode
      })
    }).then(function (r) {
      return r.json().catch(function () { return { ok: r.ok }; });
    }).then(function (data) {
      if (!data || !data.ok) throw new Error((data && data.error) || 'err');
      overlay.querySelector('#bkRecap').textContent = nice + ', godz. ' + selectedSlot + ' \u00b7 ' + mode;
      overlay.querySelector('.bk-form-wrap').style.display = 'none';
      overlay.querySelector('#bkDone').style.display = 'block';
    }).catch(function (err) {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = (err && err.message && err.message !== 'err') ? err.message : 'B\u0142\u0105d \u2014 spr\u00f3buj ponownie';
        setTimeout(function () { submitBtn.innerHTML = original; }, 3500);
      }
    });
  });

  // intercept booking triggers anywhere on the page
  document.addEventListener('click', function (e) {
    var el = e.target.closest('a, button');
    if (!el) return;
    var txt = (el.textContent || '').toLowerCase();
    var isBooking = el.hasAttribute('data-booking') || (txt.indexOf('um\u00f3w') !== -1 && txt.indexOf('rozmow') !== -1);
    if (isBooking) {
      e.preventDefault();
      open();
    }
  }, true);
})();
