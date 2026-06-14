// Obsługa formularza kontaktowego (#contactForm) — wysyła dane do /api/send.
// Dołączany na każdej stronie. Zastępuje dawną poglądową obsługę submit.
(function () {
  var form = document.getElementById('contactForm');
  if (!form) return;

  // Honeypot na boty — ukryte pole o neutralnej nazwie (bez słów typu
  // company/website/email/url, które przeglądarki autouzupełniają).
  var hp = document.createElement('input');
  hp.type = 'text';
  hp.name = 'dy_hp';
  hp.id = 'dy_hp';
  hp.tabIndex = -1;
  hp.setAttribute('autocomplete', 'off');
  hp.setAttribute('aria-hidden', 'true');
  hp.style.cssText = 'position:absolute;left:-9999px;width:1px;height:1px;opacity:0;pointer-events:none';
  form.appendChild(hp);

  function val(id) {
    var el = document.getElementById(id);
    return el ? (el.value || '').trim() : '';
  }
  function chip(group) {
    var el = form.querySelector('.chips[data-group="' + group + '"] .opt.sel');
    return el ? el.textContent.trim() : '';
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var btn = form.querySelector('.submit');
    var original = btn ? btn.innerHTML : '';
    var name = val('name');
    var email = val('email');

    if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      if (btn) {
        btn.innerHTML = 'Uzupełnij imię i poprawny e-mail';
        setTimeout(function () { btn.innerHTML = original; }, 2500);
      }
      return;
    }

    if (btn) { btn.disabled = true; btn.innerHTML = 'Wysyłanie…'; }

    fetch('/api/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        formType: 'contact',
        podmiot: chip('podmiot'),
        temat: chip('temat'),
        name: name,
        org: val('org'),
        email: email,
        phone: val('phone'),
        msg: val('msg'),
        dy_hp: hp.value
      })
    }).then(function (r) {
      return r.json().catch(function () { return { ok: r.ok }; });
    }).then(function (data) {
      if (data && data.ok) {
        if (btn) { btn.innerHTML = 'Dziękujemy — odezwiemy się ✓'; btn.style.background = 'var(--brand-600)'; }
        form.reset();
      } else {
        throw new Error((data && data.error) || 'Błąd wysyłki — spróbuj ponownie');
      }
    }).catch(function (err) {
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = (err && err.message) ? err.message : 'Błąd wysyłki — spróbuj ponownie';
        setTimeout(function () { btn.innerHTML = original; }, 3500);
      }
    });
  });
})();
