# Edu-Linux CBL Platform — Obecný Návrh Aplikace

**Verze:** 1.0  
**Cílová skupinka:** 4. ročník SPŠ EI Ostrava (GNU/Linux Debian, 60 hodin)  
**Metodika:** Challenge-Based Learning (CBL)  
**Datum:** 2026-08-31

---

## 1. Vize a Cíle

### Vize
Interaktivní, modulární e-learningová platforma, která zapojuje studenty do praktického řešení výzev pomocí CBL metodiky, s důrazem na kontinuální reflexi, dokumentaci a sdílení znalostí.

### Cíle
- Poskytnout studentům strukturovanou cestu od porozumění (Engage) přes průzkum (Investigate) k implementaci (Act)
- Umožnit autoreflexivní proces (Reflect) a zdokumentování výsledků
- Facilitovat spolupráci a zpětnou vazbu mezi studenty
- Agregovat údaje o pokroku třídy pro pedagoga (anonym)
- Nabídnout konzistentní, přitažlivé uživatelské rozhraní

---

## 2. Architektura Aplikace

### 2.1 Úrovně

```
┌─────────────────────────────────────────────┐
│  INDEX.HTML — Hub & Progress Tracker       │  (Úvodní stránka)
├─────────────────────────────────────────────┤
│  KAPITOLA (1.1–1.11)                       │  (12 modulů)
│  ├─ Engage (Výzva)                         │
│  ├─ Investigate (Zkoumání)                 │
│  ├─ Act (Řešení)                           │
│  ├─ Reflect (Reflexe)                      │
│  └─ Sources (Zdroje)                       │
├─────────────────────────────────────────────┤
│  INTERAKTIVNÍ KOMPONENTY                   │
│  ├─ Quizzes (MC + open-ended)             │
│  ├─ Checklists (progress tracking)        │
│  ├─ Source Collections (tabulated)        │
│  ├─ Teacher Feedback Widget                │
│  └─ Reflection Journal (open)             │
└─────────────────────────────────────────────┘
```

### 2.2 Tok dat

```
Student otevře kapitolu
         ↓
Engage → Investigate → Act → Reflect → Sources
  ↓          ↓          ↓       ↓         ↓
[Big Idea] [Q&A]    [Impl]  [Essay]   [Links]
           [Quiz]   [Check]
              ↓
         ✓ Answers sent to Google Forms
         ✓ Teacher sees anonymized stats
```

---

## 3. Strukturální Komponenty

### 3.1 Index (Hub)

| Prvek | Funkce |
|-------|--------|
| **Header** | Název školy, logo EI, nadpis projektu |
| **Progress Tiles** | 12 barevných dlaždic (1:1 mapování kapitol) — cyklická 12-barevná paleta |
| **Status Indikátor** | ✓ Dokončeno / ⧖ Rozpracováno / ○ Neuvedeno |
| **Motivační Text** | Krátký popis CBL přístupu |
| **Footer** | Datum aktualizace, kontakt pedagoga |

**Součást:** `index.html`

### 3.2 Kapitola (Jednotná Šablona)

#### 3.2.1 Header
- **Logo EI** (levý roh, 40×40px)
- **Název kapitoly** (centrální, bold, 1.8em)
- **Číslo a trvání** (1.1 · 5 hodin)

#### 3.2.2 Sticky Subnav
- **5 sekcí** (Výzva / Zkoumání / Řešení / Reflexe / Zdroje)
- **Scrollspy** — zvýrazní aktivní sekci dle scroll pozice
- **Anchor linky** pro přímý skok

#### 3.2.3 Engage (Výzva)
| Prvek | Obsah |
|-------|-------|
| **Big Idea** | 1–2 věty „co máš naučit" |
| **Essential Question** | Jedna klíčová otázka, která vede výzvou |
| **Challenge** | Konkrétní, praktická úloha (5–10 řádků) |
| **Master Challenge Note** | Jak se váže na celoroční projekt |

#### 3.2.4 Investigate (Zkoumání)
| Prvek | Obsah |
|-------|-------|
| **Guiding Questions** | 3–5 otázek vedoucích k hledání |
| **Verified Sources** | Kolapsibilní sekce se zdroji (screenshot/quote/link) |
| **Interactive Quiz** | 3–5 kontrolních otázek (MC + otevřené) |
| **Feedback** | Korektní/chybné odpovědi se vysvětlením |

#### 3.2.5 Act (Řešení)
| Podfáze | Obsah |
|---------|-------|
| **Solution Concept** | Návrh řešení (sketch, plán, design) — ☐ Checklist |
| **Solution Development** | Implementace s iterací — ☐ Checklist |
| **Implementation & Eval** | Finalizace, testování, uložení — ☐ Checklist |
| **Progress Bar** | Vizuální indikátor % dokončení |
| **ARTIFACT** | Pojmenování výstupu (co se odevzdává) |

#### 3.2.6 Reflect (Reflexe)
| Prvek | Obsah |
|-------|-------|
| **Open Questions** | 3–4 reflexivní otázky (co ses naučil, co by sis přál, kde je spojitost) |
| **Journal Field** | Textarea pro písemný záznam myšlenek |
| **Peer Review Prompt** | Volitelné: sdílení s ostatními (GitHub/disk tým) |

#### 3.2.7 Sources (Zdroje)
| Sloupec | Obsah |
|--------|-------|
| **Odkaz** | URL nebo lokální cesta |
| **Typ** | Video / Článek / Tutoriál / Dokumentace / Nástroj |
| **Poznámka** | Krátký popis a relevance |
| **Autor** | Jméno nebo institucí |

---

## 4. Interaktivní Komponenty

### 4.1 Quiz (Investigate Phase)

```
┌─────────────────────────────┐
│ Question N of M              │
├─────────────────────────────┤
│ Question text               │
│                             │
│ ◉ Option A                  │
│ ○ Option B                  │
│ ○ Option C                  │
│                             │
│ [Submit]                    │
├─────────────────────────────┤
│ ✓ Correct! Explanation...   │ (or ✗ Incorrect)
└─────────────────────────────┘
```

**Funkce:**
- Lehký, přehledný design
- Vysvětlení správné odpovědi
- Sčítání bodů (pro učitele)
- Možnost vrátit se a opravit

### 4.2 Checklist (Act Phase)

```
☐ Vytvořit návrh schématu
☐ Porovnat s jinou skupinou
☑ Zapracovat zpětnou vazbu
☐ Finalizovat a uložit

Progress: ████████░░ 75%
```

**Funkce:**
- Klikací toggle ☐→☑
- Strikethrough po zaškrtnutí
- Reálný čítač % hotovosti
- Opticky odděleno od ostatního obsahu (šedý box, border-left)

### 4.3 Teacher Submission Widget

```
┌──────────────────────────────┐
│ Teacher Anonymous Stats      │
├──────────────────────────────┤
│ Vyplnit URL Google Forms:    │
│ [________________] [Save]    │
│                              │
│ % A (Easy): __ %             │
│ % B (Medium): __ %           │
│ % C (Hard): __ %             │
│ % D (Very Hard): __ %        │
│                              │
│ [Submit Class Results]       │
└──────────────────────────────┘
```

**Funkce:**
- Skryté, objeví se po vstupu URL
- Anonymní — žádné jméno
- Procenta agregovaná ze 4 bloků testu
- Posílá do Google Forms (automaticky)

### 4.4 Source Table

```
┌──────┬─────────┬──────────────┬──────────┐
│ Odkaz│ Typ     │ Poznámka     │ Autor    │
├──────┼─────────┼──────────────┼──────────┤
│ [...] │ Video   │ Debian setup │ Linux... │
│ [...] │ Článek  │ TCP/IP basics│ RFC...   │
└──────┴─────────┴──────────────┴──────────┘
```

**Funkce:**
- Tabulka se scrollem na mobilě (overflow-x: auto)
- Klikatelné odkazy
- Tříděno logicky (nejdůležitější nahoře)

---

## 5. Tok Uživatele (User Journey)

### 5.1 Student — Prvnímu Kontaktu

```
1. Otevře index.html
   └→ Vidí 12 barevných dlaždic (kapitol)
      └→ Vybere si kapitolu (dlaždici klikne)

2. Načte se kapitola (sablona-kapitoly.html s daty tématu)
   └→ Přečte Engage (Big Idea + Challenge)
      └→ Porozumí, co má dělat

3. Klikne "Zkoumání" v nav
   └→ Scrollne na Investigate sekci
      └→ Přečte guiding questions
      └→ Rozbalí verified sources
      └→ Vyplní quiz (3–5 otázek)
      └→ Dostane feedback

4. Klikne "Řešení" v nav
   └→ Vidí tři podfáze (Concept → Development → Impl&Eval)
   └→ Vyplňuje checklisty (klik na ☐)
   └→ Vidí progress bar
   └→ Vytváří artefakt (podle ARTIFACT popisu)

5. Klikne "Reflexe" v nav
   └→ Odpovídá na reflexivní otázky
   └→ Píše do journalu

6. Klikne "Zdroje" v nav
   └→ Vidí tabulku zdrojů
   └→ Může si je stáhnout/otevřít

7. Po skončení kapitoly
   └→ Dlaždice v indexu se změní na ✓ (done)
   └→ Může přejít na další kapitolu
```

### 5.2 Pedagog — Monitoring

```
1. Pedagog má odkaz na Kapitolu 0 (vstupní diagnostika)
2. Studenti vyplňují test (4 bloky A–D)
3. Po skončení se zobrazí .teacher-send widget
4. Pedagog vloží URL Google Forms (kterou sám vytvořil)
5. Aplikace sečte % skóre za každý blok
6. Odešle anonymně do Google Forms
7. Pedagog vidi agregované statistiky v Sheets
   └→ "Blok A 92%, Blok B 78%, Blok C 65%, Blok D 71%"
   └→ Ví, kde má třída slabší místa
```

---

## 6. Technické Detaily

### 6.1 Stack

| Layer | Technologie |
|-------|------------|
| **Frontend** | HTML5 + CSS3 + Vanilla JavaScript (ES6+) |
| **Styling** | CSS Custom Properties (tokens) pro konzistenci |
| **Interaktivita** | Event listeners (no framework) |
| **Data** | JS objekty v `<script>` (snadné údržbě, žádný backend potřebný) |
| **Zpětná vazba** | Google Forms (API submission) |
| **Hosting** | Statické soubory (GitHub Pages, školní server) |
| **Icons** | SVG (inline, vlastní + Font Awesome) |

### 6.2 Soubory a Struktura

```
edu-linux-platform/
├── index.html                    # Hub (12 kapitol)
├── kapitoly/
│   ├── _sablona-kapitoly.html   # Universální šablona
│   ├── 01-intro-serverovych-sluzeb.html
│   ├── 02-linux-pravo-pristup.html
│   ├── ... (až 1.11)
│   └── 00-vstupni-diagnostika.html
├── assets/
│   ├── css/
│   │   ├── variables.css         # Color & type tokens
│   │   └── global.css            # Reset + base styles
│   ├── img/
│   │   ├── logo-ei.svg
│   │   ├── pattern-watermark.svg
│   │   └── ... (chapter icons)
│   └── js/
│       ├── scrollspy.js          # Nav highlighting
│       ├── quiz-engine.js        # Quiz logic
│       └── checklist-tracker.js  # Checklist + progress
├── Metodika_CBL_Serverove_sluzby.docx
├── graficky-manual.md            # Tenhle soubor — visual guidelines
└── README.md
```

### 6.3 Responsive Design

- **Desktop (>1024px):** 2-column layout (sidebar nav + content)
- **Tablet (768–1024px):** 1 column, sticky nav top
- **Mobile (<768px):** 1 column, nav becomes hamburger/tabs

---

## 7. CBL Integrace

### 7.1 Engage Phase = Challenge
- **Cíl:** Studenty zaujmout, dát jim konkrétní výzvu
- **Komponenty:** Big Idea + Essential Question + Challenge description
- **Výstup:** Porozumění úloze; motivace začít

### 7.2 Investigate Phase = Exploration
- **Cíl:** Podporovat průzkum, procvičit porozumění
- **Komponenty:** Guiding questions + Verified sources + Quiz
- **Výstup:** Znalost tématu; připravenost na implementaci

### 7.3 Act Phase = Implementation
- **Cíl:** Praktické řešení s iterací a evaluací
- **Komponenty:** 3× podfáze s checklisty, progress bar, ARTIFACT definice
- **Výstup:** Hotový artefakt (řešení) a zdokumentovaný proces

### 7.4 Reflect Phase = Metacognition
- **Cíl:** Zamyšlení nad tím, co se naučil a proč
- **Komponenty:** Reflexivní otázky + journal
- **Výstup:** Psaný záznam myšlenek; uvědomění si procesu

### 7.5 Continuous Threads
- **Documentation:** Checklist položky, ARTIFACT výstupy
- **Sharing:** Volitelné peer review (GitHub/disk)
- **Feedback:** Quiz vysvětlení + teacher stats

---

## 8. Brand & Visual Identity

### 8.1 Barvy
- **Primary:** Robot Blue `#47657D` (hlavní text, nav, accents)
- **Accent:** Electric Green `#DBF02A` (Call-to-action, highlights)
- **Neutral Light:** `#F5F5F5` (bg cards, subtle contrast)
- **Neutral Dark:** `#2C2C2C` (text, borders)
- **Semantic:** ✓ Green `#52C41A` (correct), ✗ Red `#F5222D` (incorrect)

### 8.2 Typografie
- **Monospace:** JetBrains Mono (kód, terminal, příklady)
- **Display:** System Sans (Robot Blue, bold)
- **Body:** System Sans (čitelné, 16px on desktop, 14px mobile)
- **Fallbacks:** -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto

### 8.3 Grafické Prvky
- **Watermark:** SVG binární pattern "01010101" (0.08 opacity, rotace 45°)
- **Borders:** Měkké stíny (box-shadow: 0 2px 8px rgba(0,0,0,0.1))
- **Icons:** SVG inline (minimalistické, monochromatické)
- **Spacing:** 8px grid (padding/margin v násobcích 8)

---

## 9. Atribuce & Kontinuita

### 9.1 Autor & Verze
- **Vytvořeno:** 2026-08-31
- **Autor:** Claude + pedagogem SPŠ EI Ostrava
- **Verzování:** Sémantické (1.0 → 1.1 → 2.0) — zaznamenat v index.html

### 9.2 Údržba
- Každá nová kapitola: duplikovat `_sablona-kapitoly.html` → přejmenovat na `0X-...html` → vyplnit JS objekty
- CSS/JS změny: globálně v `assets/css/` a `assets/js/` — aplikují se všem kapitolám
- Verze: zaznamenat v README.md a jako HTML komentář v index.html

---

## 10. Budoucí Rozšíření (Optional)

- [ ] **Leaderboard:** Body za quizzy (s motivací)
- [ ] **Dark mode:** Jednoduchý toggle `data-theme="dark"`
- [ ] **Offline mode:** Service Worker pro offline přístup
- [ ] **Multi-language:** i18n soubory (CZ/SK/EN)
- [ ] **Student Portfolio:** Shrnutí artefaktů a reflexí na jednom místě
- [ ] **Analytics:** Detailnější tracking (čas strávený, % quiz úspěšnosti)

---

## 11. Checklist — Ready-to-Deploy

- [ ] Všech 12 kapitol naplněno daty
- [ ] Google Forms vytvořena (Kapitola 0)
- [ ] CSS a JS otestovány na mobilě
- [ ] Všechny odkazy v tabulce zdrojů ověřeny
- [ ] Pedagogické revize (metodika, obsah, didaktika)
- [ ] GitHub nasazen (nebo školní server)
- [ ] Studenti mají přístup (odkaz)
- [ ] Zpětná vazba sbírána a vyhodnocena

---

**Konec obecného návrhu.**

Pro konkrétní grafický manuál a šablonu pro jednotlivá témata viz: `graficky-manual.md`
