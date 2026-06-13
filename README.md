# Fundacja Divideyou — strona WWW

Statyczna strona Fundacji Divideyou (ekonomia współdzielenia). Czysty HTML + CSS + JS, bez procesu budowania — wystarczy serwować pliki.

## Struktura
- `index.html` — strona główna
- `podstrony/` — podstrony (Obszary, Konsorcja, Projekty, Partnerstwa, Finanse, O Fundacji, Kontakt, Wiedza + artykuły, Polityka prywatności i RODO)
- `assets/` — logo, zdjęcie hero, logotypy konsorcjów
- `site.css`, `site-v2.css` — style
- `booking-modal.js` — modal rezerwacji rozmowy
- `tweaks-panel.jsx` — panel podglądowy (kolor/typografia); opcjonalny

## Uruchomienie lokalne
Otwórz `index.html` w przeglądarce, albo uruchom prosty serwer:
```
python3 -m http.server 8000
```
i wejdź na http://localhost:8000

## Publikacja na GitHub Pages
1. Utwórz repozytorium i wgraj całą zawartość tego folderu do gałęzi `main`.
2. Settings → Pages → Source: `main` / `/ (root)`.
3. Strona będzie dostępna pod adresem `https://<użytkownik>.github.io/<repo>/`.
Plik `.nojekyll` wyłącza przetwarzanie Jekyll (zalecane dla zwykłego HTML).

## Formularze kontaktowe (wysyłka e-mail przez Vercel)
Formularz kontaktowy oraz modal rezerwacji rozmowy wysyłają zgłoszenia do funkcji serverless `api/send.js`, która przekazuje je mailem przez SMTP na adres **office@divideyou.com**. Wymaga to hostingu z obsługą funkcji serverless — np. **Vercel** (GitHub Pages nie obsługuje backendu).

### Wdrożenie na Vercel
1. Zaimportuj repozytorium na [vercel.com](https://vercel.com) (New Project → Import). Vercel automatycznie wykryje statyczne pliki w katalogu głównym oraz funkcję w `api/`. Build nie jest potrzebny.
2. W **Settings → Environment Variables** ustaw dane skrzynki SMTP fundacji:

   | Zmienna | Opis | Przykład |
   |---|---|---|
   | `SMTP_HOST` | host serwera SMTP | `smtp.example.com` |
   | `SMTP_PORT` | port (587 = STARTTLS, 465 = SSL) | `587` |
   | `SMTP_SECURE` | `true` dla portu 465, w innym wypadku `false` | `false` |
   | `SMTP_USER` | login skrzynki | `office@divideyou.com` |
   | `SMTP_PASS` | hasło skrzynki | `••••••` |
   | `MAIL_TO` | odbiorca zgłoszeń (opcjonalne) | `office@divideyou.com` |
   | `MAIL_FROM` | nadawca (opcjonalne) | `Strona Divideyou <office@divideyou.com>` |

3. **Deploy**. Po wdrożeniu formularze będą realnie wysyłać maile. Endpoint: `POST /api/send`.

> Dane SMTP trzymaj wyłącznie w zmiennych środowiskowych Vercela — nie commituj ich do repozytorium.

## Zależności zewnętrzne (CDN)
Strona wczytuje czcionki Google Fonts, zdjęcia z Unsplash oraz biblioteki React/Babel/D3 z CDN (unpkg/jsDelivr) — wymaga dostępu do internetu.

© 2026 Fundacja Divideyou
