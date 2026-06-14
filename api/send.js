// Funkcja serverless (Vercel) — odbiera zgłoszenia z formularzy i wysyła
// je mailem przez SMTP fundacji. Konfiguracja przez zmienne środowiskowe:
//   SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS, MAIL_TO, MAIL_FROM
const nodemailer = require('nodemailer');

function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body || '{}'); } catch (e) { body = {}; }
  }
  body = body || {};

  // Honeypot — boty wypełniają ukryte pole; udajemy sukces i nic nie wysyłamy.
  // Nazwa neutralna (dy_hp), by przeglądarki nie autouzupełniały pola.
  if ((body.dy_hp || '').toString().trim()) {
    return res.status(200).json({ ok: true });
  }

  const formType = body.formType === 'booking' ? 'booking' : 'contact';
  const name = (body.name || '').toString().trim();
  const email = (body.email || '').toString().trim();
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (!name || !emailOk) {
    return res.status(400).json({ ok: false, error: 'Podaj imię i poprawny adres e-mail.' });
  }

  const fieldsOrder = formType === 'booking'
    ? [['name', 'Imię i nazwisko'], ['org', 'Organizacja'], ['email', 'E-mail'], ['phone', 'Telefon'], ['date', 'Preferowany dzień'], ['slot', 'Godzina'], ['mode', 'Forma']]
    : [['podmiot', 'Jestem z'], ['temat', 'Temat'], ['name', 'Imię i nazwisko'], ['org', 'Organizacja'], ['email', 'E-mail'], ['phone', 'Telefon'], ['msg', 'Wiadomość']];

  const lines = [];
  const htmlRows = [];
  for (const [key, label] of fieldsOrder) {
    const val = (body[key] || '').toString().trim();
    if (!val) continue;
    lines.push(label + ': ' + val);
    htmlRows.push(
      '<tr><td style="padding:4px 14px 4px 0;font-weight:600;vertical-align:top;white-space:nowrap">' +
      esc(label) + '</td><td style="padding:4px 0">' + esc(val).replace(/\n/g, '<br>') + '</td></tr>'
    );
  }

  const heading = formType === 'booking'
    ? 'Nowa rezerwacja rozmowy'
    : 'Nowe zgłoszenie z formularza kontaktowego';
  const subject = heading + ' — ' + name;

  const text = lines.join('\n') + '\n\n— Wysłano automatycznie ze strony divideyou.com';
  const html =
    '<div style="font-family:system-ui,Segoe UI,Arial,sans-serif;font-size:15px;color:#1a1a1a;line-height:1.5">' +
    '<h2 style="margin:0 0 14px;font-size:18px">' + esc(heading) + '</h2>' +
    '<table style="border-collapse:collapse">' + htmlRows.join('') + '</table>' +
    '<p style="margin-top:18px;color:#8a8a8a;font-size:12.5px">Wysłano automatycznie ze strony divideyou.com</p>' +
    '</div>';

  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const secure = process.env.SMTP_SECURE != null
    ? process.env.SMTP_SECURE === 'true'
    : port === 465;

  if (!host || !user || !pass) {
    console.error('Brak konfiguracji SMTP (SMTP_HOST / SMTP_USER / SMTP_PASS).');
    return res.status(500).json({ ok: false, error: 'Serwer poczty nie jest skonfigurowany.' });
  }

  const transporter = nodemailer.createTransport({ host, port, secure, auth: { user, pass } });
  const to = process.env.MAIL_TO || 'fundacja@divideyou.com';
  const from = process.env.MAIL_FROM || ('Strona Divideyou <' + user + '>');

  try {
    await transporter.sendMail({
      from,
      to,
      replyTo: name + ' <' + email + '>',
      subject,
      text,
      html
    });
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Błąd wysyłki maila:', err && err.message);
    return res.status(502).json({ ok: false, error: 'Nie udało się wysłać wiadomości. Spróbuj ponownie później.' });
  }
};
