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
Formularz kontaktowy oraz modal rezerwacji rozmowy wysyłają zgłoszenia do funkcji serverless `api/send.js`, która przekazuje je mailem przez SMTP na adres **fundacja@divideyou.com**. Wymaga to hostingu z obsługą funkcji serverless — np. **Vercel** (GitHub Pages nie obsługuje backendu).

### Wdrożenie na Vercel
1. Zaimportuj repozytorium na [vercel.com](https://vercel.com) (New Project → Import). Vercel automatycznie wykryje statyczne pliki w katalogu głównym oraz funkcję w `api/`. Build nie jest potrzebny.
2. W **Settings → Environment Variables** ustaw dane skrzynki SMTP fundacji:

   | Zmienna | Opis | Przykład |
   |---|---|---|
   | `SMTP_HOST` | host serwera SMTP | `smtp.example.com` |
   | `SMTP_PORT` | port (587 = STARTTLS, 465 = SSL) | `587` |
   | `SMTP_SECURE` | `true` dla portu 465, w innym wypadku `false` | `false` |
   | `SMTP_USER` | login skrzynki | `fundacja@divideyou.com` |
   | `SMTP_PASS` | hasło skrzynki | `••••••` |
   | `MAIL_TO` | odbiorca zgłoszeń (opcjonalne) | `fundacja@divideyou.com` |
   | `MAIL_FROM` | nadawca (opcjonalne) | `Strona Divideyou <fundacja@divideyou.com>` |

3. **Deploy**. Po wdrożeniu formularze będą realnie wysyłać maile. Endpoint: `POST /api/send`.

> Dane SMTP trzymaj wyłącznie w zmiennych środowiskowych Vercela — nie commituj ich do repozytorium.

## Zasoby — w pełni lokalne (offline)
Strona nie zależy od zewnętrznych sieci CDN — wszystkie zasoby są serwowane lokalnie z repozytorium:
- **Czcionki**: Google Fonts pobrane lokalnie do `assets/fonts/` (`fonts.css` + pliki `.woff2`).
- **Globus na stronie głównej**: biblioteki D3 i topojson w `assets/vendor/`, dane map w `assets/countries-110m.json`.
- **Grafiki**: w `assets/img/` (obecnie placeholdery — patrz niżej).

Panel deweloperski „Tweaki" (React/Babel) został usunięty z wersji produkcyjnej. Jedyne połączenia wychodzące to zwykłe odnośniki do stron partnerów oraz wysyłka formularzy do `/api/send`.

### Zdjęcia do podmiany
W `assets/img/` znajdują się tymczasowe placeholdery (gradienty w kolorach marki). Aby wstawić docelowe zdjęcia, podmień pliki **zachowując ich nazwy** — lista nazw, oryginalnych propozycji i miejsc użycia jest w `assets/img/ZDJECIA.md`.

© 2026 Fundacja Divideyou
