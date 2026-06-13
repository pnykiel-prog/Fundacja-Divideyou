// Menu mobilne (hamburger) — budowane z istniejących linków nagłówka,
// dzięki czemu ścieżki są poprawne na każdej podstronie. Dołączane na każdej stronie.
(function () {
  var wrap = document.querySelector('header.site .wrap');
  if (!wrap) return;

  var nav = wrap.querySelector('nav');
  var contactBtn = wrap.querySelector('.btn-primary');

  // zbierz linki: z nawigacji + z paska górnego (bez duplikatów po tekście)
  var links = [];
  var seen = {};
  function add(a) {
    if (!a) return;
    var text = (a.textContent || '').trim();
    var href = a.getAttribute('href');
    if (!text || !href) return;
    var key = text.toLowerCase();
    if (seen[key]) return;
    seen[key] = true;
    links.push({ text: text, href: href });
  }
  if (nav) nav.querySelectorAll('a').forEach(add);
  document.querySelectorAll('.util .wrap a').forEach(add);

  // przycisk hamburger
  var btn = document.createElement('button');
  btn.className = 'nav-toggle';
  btn.type = 'button';
  btn.setAttribute('aria-label', 'Otwórz menu');
  btn.setAttribute('aria-expanded', 'false');
  btn.innerHTML = '<span></span><span></span><span></span>';
  wrap.appendChild(btn);

  // panel menu
  var panel = document.createElement('div');
  panel.className = 'mobile-nav';
  var html = '<div class="mobile-nav-inner" role="dialog" aria-label="Menu">' +
    '<button class="mobile-nav-close" type="button" aria-label="Zamknij menu">×</button><nav>';
  links.forEach(function (l) {
    html += '<a href="' + l.href + '">' + l.text + '</a>';
  });
  if (contactBtn) {
    html += '<a class="btn btn-primary" href="' + contactBtn.getAttribute('href') + '">Skontaktuj się <span class="ar">→</span></a>';
  }
  html += '</nav></div>';
  panel.innerHTML = html;
  document.body.appendChild(panel);

  var inner = panel.querySelector('.mobile-nav-inner');

  function open() {
    panel.classList.add('open');
    btn.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function close() {
    panel.classList.remove('open');
    btn.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  btn.addEventListener('click', function () {
    panel.classList.contains('open') ? close() : open();
  });
  panel.querySelector('.mobile-nav-close').addEventListener('click', close);
  panel.addEventListener('click', function (e) { if (e.target === panel) close(); });
  inner.addEventListener('click', function (e) { if (e.target.closest('a')) close(); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && panel.classList.contains('open')) close();
  });
  // zamknij menu po powrocie do widoku desktopowego
  window.matchMedia('(min-width: 981px)').addEventListener('change', function (e) {
    if (e.matches) close();
  });
})();
