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

## Zależności zewnętrzne (CDN)
Strona wczytuje czcionki Google Fonts, zdjęcia z Unsplash oraz biblioteki React/Babel/D3 z CDN (unpkg/jsDelivr) — wymaga dostępu do internetu. Formularze są poglądowe (front-end) — podłącz własny backend/usługę e-mail, aby odbierać zgłoszenia.

© 2026 Fundacja Divideyou
