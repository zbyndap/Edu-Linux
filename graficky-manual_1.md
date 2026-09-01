# Edu-Linux CBL Platform — Grafický Manuál

**Verze:** 1.0  
**Datum:** 2026-08-31  
**Určení:** Šablona pro jednotná vizuální a tematická zpracování všech 12 kapitol

---

## I. Barevný Systém

### I.1 Primární Paleta

```
┌─────────────────┬──────────┬──────────────────┐
│ Barva           │ Kód      │ Použití           │
├─────────────────┼──────────┼──────────────────┤
│ Robot Blue      │ #47657D  │ Headlines, links, │
│                 │          │ nav, semantic OK  │
├─────────────────┼──────────┼──────────────────┤
│ Electric Green  │ #DBF02A  │ CTA, highlights, │
│                 │          │ accent, emphasis │
├─────────────────┼──────────┼──────────────────┤
│ Neutral Light   │ #F5F5F5  │ Card bg, subtle  │
│                 │          │ contrast areas   │
├─────────────────┼──────────┼──────────────────┤
│ Neutral Dark    │ #2C2C2C  │ Body text,       │
│                 │          │ borders, depth   │
└─────────────────┴──────────┴──────────────────┘
```

### I.2 Sémantické Barvy

```
✓ Correct      #52C41A  (zelená, lehce nasycená)
✗ Incorrect    #F5222D  (červená, jasná)
⚠ Warning      #FAAD14  (oranžová, viditelná)
ℹ Info         #1890FF  (modrá, osvěžující)
```

### I.3 Aplikace v Komponentách

#### Engage Card
- **Header bg:** `#47657D` (Robot Blue)
- **Text:** `#FFF` (white)
- **Border:** `1px solid #47657D`
- **Shadow:** `0 2px 8px rgba(71,101,125,0.12)`

#### Quiz Button — Default
- **bg:** `#F5F5F5` (Neutral Light)
- **border:** `1px solid #D0D0D0`
- **text:** `#2C2C2C` (Neutral Dark)
- **hover:** `bg → #E8E8E8`

#### Quiz Button — Selected
- **bg:** `#DBF02A` (Electric Green)
- **border:** `1px solid #DBF02A`
- **text:** `#2C2C2C`
- **shadow:** `0 4px 12px rgba(219,240,42,0.3)`

#### Quiz Button — Correct
- **bg:** `#52C41A` (Green)
- **text:** `#FFF`
- **icon:** ✓ (white check)

#### Quiz Button — Incorrect
- **bg:** `#F5222D` (Red)
- **text:** `#FFF`
- **icon:** ✗ (white cross)

#### Checklist Item — Unchecked
- **bg:** `#FFF`
- **border-left:** `4px solid #DBF02A`
- **text:** `#2C2C2C`
- **checkbox:** `input[type="checkbox"]` unchecked

#### Checklist Item — Checked
- **bg:** `#F5F5F5`
- **border-left:** `4px solid #52C41A`
- **text:** `#999` (strike-through)
- **checkbox:** checked

#### Progress Bar
- **bg container:** `#E8E8E8`
- **filled:** `linear-gradient(90deg, #47657D, #DBF02A)`
- **height:** `8px`
- **border-radius:** `4px`

#### Sticky Nav — Active Item
- **text:** `#DBF02A` (Electric Green, bold)
- **border-bottom:** `2px solid #DBF02A`
- **bg:** transparent

#### Sticky Nav — Inactive Item
- **text:** `#47657D` (Robot Blue, regular)
- **border-bottom:** none
- **hover:** `text → #DBF02A`

### I.4 Dark Mode (Future)

Když se přidá `data-theme="dark"` nebo `prefers-color-scheme: dark`:

```css
--color-bg-primary:   #1A1A1A
--color-bg-card:      #2C2C2C
--color-text-primary: #F5F5F5
--color-text-secondary: #B8B8B8
--color-accent:       #DBF02A (zůstává)
--color-primary:      #5B8AAD (lehčí Robot Blue pro čitelnost)
```

---

## II. Typografie

### II.1 Font Stack

```css
/* Monospace (kód, terminal, příklady) */
font-family: 'JetBrains Mono', 'Courier New', monospace;

/* Display (nadpisy, titulky) */
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 
             Roboto, 'Helvetica Neue', Arial, sans-serif;

/* Body (odstavce, popis) */
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 
             Roboto, 'Helvetica Neue', Arial, sans-serif;
```

### II.2 Type Scale

```
┌────────────┬─────────┬──────────┬──────────────────────┐
│ Role       │ Desktop │ Mobile   │ Příklad              │
├────────────┼─────────┼──────────┼──────────────────────┤
│ Hero (H1)  │ 2.4em   │ 1.8em    │ Úvod do serverů...   │
│ Section    │ 1.8em   │ 1.4em    │ Zkoumání             │
│ Subsection │ 1.3em   │ 1.1em    │ Solution Concept     │
│ Body       │ 1.0em   │ 0.95em   │ Běžný text kapitoly  │
│ Small      │ 0.875em │ 0.85em   │ Popis zdroje, pozn.  │
│ Monospace  │ 0.95em  │ 0.9em    │ <code>, terminál     │
└────────────┴─────────┴──────────┴──────────────────────┘
```

### II.3 Line Height & Spacing

```css
/* Běžný text — čitelnost */
line-height: 1.6;       /* 160% */
letter-spacing: 0px;

/* Nadpisy — kompaktní */
line-height: 1.2;       /* 120% */
letter-spacing: -0.02em;

/* Monospace — kód */
line-height: 1.5;
letter-spacing: 0px;
```

### II.4 Font Weight Palette

```
Light    (300): Secundární text, disabled items
Regular  (400): Body text, běžné obsahu
Medium   (500): Legenda, label, menší nadpisy
Semi-bold (600): Subsection headings, emphasis
Bold     (700): Section headings, h2/h3
```

### II.5 Praktické Příklady

#### H1 — Chapter Title
```css
font-size: 2.4em;
font-weight: 700;
line-height: 1.2;
color: #47657D;
margin: 0 0 0.5em 0;
```
*Příklad: "1 Úvod do serverových služeb"*

#### H2 — Section Heading
```css
font-size: 1.8em;
font-weight: 700;
line-height: 1.2;
color: #47657D;
margin: 2em 0 1em 0;
```
*Příklad: "Výzva"*

#### H3 — Subsection Heading
```css
font-size: 1.3em;
font-weight: 600;
color: #2C2C2C;
margin: 1.5em 0 0.75em 0;
```
*Příklad: "Solution Concept"*

#### Body Text
```css
font-size: 1em;
font-weight: 400;
line-height: 1.6;
color: #2C2C2C;
max-width: 65ch;  /* čitelné — max 65 znaků na řádek */
margin: 0 0 1em 0;
```

#### Button Text
```css
font-size: 1em;
font-weight: 600;
line-height: 1.2;
text-transform: capitalize;  /* "Submit" → "Submit" */
letter-spacing: 0.5px;
```

#### Code / Terminal
```css
font-family: 'JetBrains Mono', monospace;
font-size: 0.95em;
line-height: 1.5;
color: #2C2C2C;
background: #F5F5F5;
padding: 0.2em 0.4em;
border-radius: 3px;
```

---

## III. Komponenty

### III.1 Card (Engage / Investigate)

#### Struktura HTML
```html
<div class="card">
  <div class="card-header">
    <h2>Název karty</h2>
  </div>
  <div class="card-body">
    <p>Obsah karty...</p>
  </div>
</div>
```

#### CSS
```css
.card {
  background: #FFF;
  border: 1px solid #E0E0E0;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  padding: 1.5em;
  margin: 1.5em 0;
  transition: box-shadow 0.2s ease;
}

.card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.card-header {
  border-bottom: 2px solid #47657D;
  padding-bottom: 0.75em;
  margin-bottom: 1em;
}

.card-header h2 {
  font-size: 1.8em;
  color: #47657D;
  margin: 0;
}

.card-body {
  color: #2C2C2C;
  font-size: 1em;
  line-height: 1.6;
}
```

### III.2 Button — Primary CTA

#### HTML
```html
<button class="btn btn-primary">
  Odeslat odpovědi
</button>
```

#### CSS
```css
.btn {
  display: inline-block;
  padding: 0.75em 1.5em;
  font-size: 1em;
  font-weight: 600;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
  text-decoration: none;
}

.btn-primary {
  background: #DBF02A;
  color: #2C2C2C;
  border: 1px solid #DBF02A;
  box-shadow: 0 2px 6px rgba(219, 240, 42, 0.2);
}

.btn-primary:hover {
  background: #C8DA1F;
  box-shadow: 0 4px 12px rgba(219, 240, 42, 0.3);
}

.btn-primary:active {
  transform: scale(0.98);
}

.btn-primary:disabled {
  background: #D0D0D0;
  color: #999;
  cursor: not-allowed;
  box-shadow: none;
}
```

### III.3 Button — Secondary

#### CSS
```css
.btn-secondary {
  background: #F5F5F5;
  color: #2C2C2C;
  border: 1px solid #D0D0D0;
}

.btn-secondary:hover {
  background: #E8E8E8;
  border-color: #B0B0B0;
}
```

### III.4 Quiz Option (Radio Button)

#### HTML
```html
<label class="quiz-option">
  <input type="radio" name="question-1" value="a">
  <span class="option-text">Option A: Správná odpověď</span>
</label>
```

#### CSS
```css
.quiz-option {
  display: flex;
  align-items: center;
  padding: 1em;
  margin: 0.5em 0;
  background: #FFF;
  border: 2px solid #D0D0D0;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.quiz-option:hover {
  border-color: #47657D;
  background: #F9F9F9;
}

.quiz-option input[type="radio"] {
  margin-right: 1em;
  cursor: pointer;
  accent-color: #DBF02A;
}

.quiz-option input[type="radio"]:checked + .option-text {
  font-weight: 600;
  color: #47657D;
}

/* Výsledek — Správně */
.quiz-option.correct {
  border-color: #52C41A;
  background: #F6FFED;
}

.quiz-option.correct::before {
  content: "✓";
  color: #52C41A;
  font-weight: bold;
  margin-right: 0.5em;
}

/* Výsledek — Chybně */
.quiz-option.incorrect {
  border-color: #F5222D;
  background: #FFF2F0;
}

.quiz-option.incorrect::before {
  content: "✗";
  color: #F5222D;
  font-weight: bold;
  margin-right: 0.5em;
}
```

### III.5 Checklist

#### HTML
```html
<div class="checklist">
  <label class="checklist-item">
    <input type="checkbox" class="checklist-input">
    <span class="checklist-text">Vytvořit návrh schématu</span>
  </label>
  <label class="checklist-item">
    <input type="checkbox" class="checklist-input" checked>
    <span class="checklist-text">Porovnat s jinou skupinou</span>
  </label>
</div>

<div class="progress-container">
  <div class="progress-bar" style="width: 50%;"></div>
</div>
<p class="progress-text">Hotovost: 50%</p>
```

#### CSS
```css
.checklist {
  background: #F5F5F5;
  border-left: 4px solid #DBF02A;
  padding: 1.5em;
  border-radius: 4px;
  margin: 1.5em 0;
}

.checklist-item {
  display: flex;
  align-items: flex-start;
  margin: 0.75em 0;
  cursor: pointer;
  font-size: 1em;
  color: #2C2C2C;
}

.checklist-item:hover {
  color: #47657D;
}

.checklist-input {
  width: 20px;
  height: 20px;
  min-width: 20px;
  margin-right: 0.75em;
  margin-top: 0.15em;
  cursor: pointer;
  accent-color: #52C41A;
}

.checklist-item.checked .checklist-text {
  text-decoration: line-through;
  color: #999;
}

.progress-container {
  background: #E8E8E8;
  height: 8px;
  border-radius: 4px;
  overflow: hidden;
  margin: 1em 0 0.5em 0;
}

.progress-bar {
  background: linear-gradient(90deg, #47657D, #DBF02A);
  height: 100%;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 0.875em;
  color: #666;
  text-align: right;
  margin: 0;
}
```

### III.6 Sticky Navigation

#### HTML
```html
<nav class="sticky-nav">
  <ul>
    <li><a href="#engage" class="nav-link active">Výzva</a></li>
    <li><a href="#investigate" class="nav-link">Zkoumání</a></li>
    <li><a href="#act" class="nav-link">Řešení</a></li>
    <li><a href="#reflect" class="nav-link">Reflexe</a></li>
    <li><a href="#sources" class="nav-link">Zdroje</a></li>
  </ul>
</nav>
```

#### CSS
```css
.sticky-nav {
  position: sticky;
  top: 0;
  background: #FFF;
  border-bottom: 1px solid #E0E0E0;
  z-index: 100;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.sticky-nav ul {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  justify-content: center;
  gap: 2em;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1em;
}

.nav-link {
  text-decoration: none;
  color: #47657D;
  font-weight: 600;
  font-size: 1em;
  padding-bottom: 0.5em;
  border-bottom: 2px solid transparent;
  transition: all 0.2s ease;
  cursor: pointer;
}

.nav-link:hover {
  color: #DBF02A;
  border-bottom-color: #DBF02A;
}

.nav-link.active {
  color: #DBF02A;
  border-bottom-color: #DBF02A;
  font-weight: 700;
}
```

### III.7 Source Table

#### HTML
```html
<table class="source-table">
  <thead>
    <tr>
      <th>Odkaz</th>
      <th>Typ</th>
      <th>Poznámka</th>
      <th>Autor</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><a href="..." target="_blank">Link text</a></td>
      <td><span class="badge badge-video">Video</span></td>
      <td>Krátký popis</td>
      <td>Linux Foundation</td>
    </tr>
  </tbody>
</table>
```

#### CSS
```css
.source-table {
  width: 100%;
  border-collapse: collapse;
  margin: 1.5em 0;
  font-size: 1em;
  overflow-x: auto;
}

.source-table th {
  background: #47657D;
  color: #FFF;
  padding: 1em;
  text-align: left;
  font-weight: 600;
  border: none;
}

.source-table td {
  padding: 1em;
  border-bottom: 1px solid #E0E0E0;
  color: #2C2C2C;
}

.source-table tr:hover {
  background: #F9F9F9;
}

.source-table a {
  color: #47657D;
  text-decoration: underline;
  font-weight: 500;
}

.source-table a:hover {
  color: #DBF02A;
}

.badge {
  display: inline-block;
  padding: 0.25em 0.75em;
  border-radius: 12px;
  font-size: 0.875em;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.badge-video {
  background: #E6F2FF;
  color: #0052CC;
}

.badge-article {
  background: #FFF7E6;
  color: #AD6800;
}

.badge-tutorial {
  background: #F6FFED;
  color: #274A00;
}

.badge-docs {
  background: #F9F0FF;
  color: #7C3AED;
}

.badge-tool {
  background: #FFE7E6;
  color: #D32F2F;
}
```

---

## IV. Spacing & Layout

### IV.1 Spacing Scale (8px Grid)

```
8px    (0.5em)  — Malé mezery (mezi prvky)
16px   (1em)    — Standartní padding (karty, sekce)
24px   (1.5em)  — Střední mezera (mezi kartami)
32px   (2em)    — Velká mezera (mezi sekcemi)
48px   (3em)    — Velmi velká (top/bottom hlavní sekcí)
```

### IV.2 Container & Width

```css
/* Maximální obsah šířka — čitelnost */
max-width: 960px;
margin: 0 auto;
padding: 0 1.5em;

/* Na mobilě */
@media (max-width: 768px) {
  padding: 0 1em;
}
```

### IV.3 Section Layout

```css
section {
  padding: 3em 0;
  border-bottom: 1px solid #E0E0E0;
}

section:last-child {
  border-bottom: none;
}

section h2 {
  margin-top: 0;
  margin-bottom: 1.5em;
}
```

---

## V. Ikonografie

### V.1 Icon Style

- **Velikost:** 24×24px (standard), 32×32px (hero), 16×16px (inline)
- **Tloušťka čáry:** 2px
- **Style:** Monochromatic (jednobarevná), clean lines
- **Formát:** SVG (inline, ne externe)
- **Barvy:** `#47657D` (primární), `#DBF02A` (accent), `#52C41A` (success), `#F5222D` (error)

### V.2 Common Icons

```
✓ Check      — správná odpověď, dokončeno
✗ Cross      — chybná odpověď, selhání
→ Arrow      — další krok, pokračování
⧖ Clock      — čas, trvání
◎ Circle     — neuvedeno, pending
🎯 Target    — cíl, výzva
📚 Books     — zdroje, literatura
💡 Bulb      — tip, nápověda
📝 Document  — dokument, poznámka
🔧 Wrench    — nástroj, implementace
```

### V.3 SVG Snippets

#### Check Icon
```xml
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#52C41A" stroke-width="2">
  <polyline points="20 6 9 17 4 12"></polyline>
</svg>
```

#### Arrow Icon
```xml
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#47657D" stroke-width="2">
  <line x1="5" y1="12" x2="19" y2="12"></line>
  <polyline points="12 5 19 12 12 19"></polyline>
</svg>
```

#### Target Icon
```xml
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#DBF02A" stroke-width="2">
  <circle cx="12" cy="12" r="10"></circle>
  <circle cx="12" cy="12" r="6"></circle>
  <circle cx="12" cy="12" r="2"></circle>
</svg>
```

---

## VI. Responsive Design

### VI.1 Breakpoints

```css
/* Mobile First */
@media (min-width: 481px) {
  /* Tablet */
}

@media (min-width: 769px) {
  /* Desktop */
}

@media (min-width: 1025px) {
  /* Large Desktop */
}
```

### VI.2 Adaptace po Breakpointech

#### Mobile (<768px)
- Font size: -5% body text
- Padding: 1em (místo 1.5em)
- Navigation: Hamburger nebo Tab-based
- Card: Full width
- Table: overflow-x: auto

#### Tablet (768–1024px)
- 2-column layout (sidebar + content)
- Font size: Standard
- Navigation: Sticky horizontal
- Cards: 2 side-by-side (pokud aplikovatelné)

#### Desktop (>1024px)
- Full layout
- Hero section možný
- Wider content (až 960px max-width)

### VI.3 Praktická Příklady

#### Flex Layout — Responzivní Cards

```css
.card-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5em;
  margin: 1.5em 0;
}

.card-grid .card {
  flex: 1 1 calc(50% - 0.75em);
  min-width: 250px;
}

@media (max-width: 768px) {
  .card-grid .card {
    flex: 1 1 100%;
  }
}
```

#### Sticky Nav — Responsive

```css
.sticky-nav ul {
  display: flex;
  flex-direction: row;
  gap: 1.5em;
  padding: 1em;
}

@media (max-width: 768px) {
  .sticky-nav ul {
    gap: 0.75em;
    padding: 0.75em;
    font-size: 0.9em;
  }

  .nav-link {
    padding: 0.5em 0.25em;
  }
}
```

---

## VII. Interakce & Motion

### VII.1 Transitions

```css
/* Standartní */
transition: all 0.2s ease;

/* Barva */
transition: background-color 0.2s ease, color 0.2s ease;

/* Transform (klik) */
transition: transform 0.1s cubic-bezier(0.34, 1.56, 0.64, 1);
```

### VII.2 Hover Effects

#### Button
```css
button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

button:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
```

#### Link
```css
a {
  transition: color 0.2s ease, text-decoration 0.2s ease;
}

a:hover {
  color: #DBF02A;
  text-decoration: underline;
}
```

### VII.3 Focus State (A11y)

```css
button:focus,
input:focus,
a:focus {
  outline: 2px solid #DBF02A;
  outline-offset: 2px;
}
```

---

## VIII. Praktické Vzory (Patterns)

### VIII.1 Tvorba Nové Kapitoly — Postup

1. **Duplikuj šablonu**
   ```
   _sablona-kapitoly.html → 01-nazev-kapitoly.html
   ```

2. **Aktualizuj metadata (v <head>)**
   ```html
   <title>1 Úvod do serverových služeb</title>
   <meta name="description" content="Praktická výzva na...">
   ```

3. **Vyplň JS objekty v <script> (na začátku)**
   ```javascript
   const TOPIC = {
     number: "1",
     title: "Úvod do serverových služeb",
     duration: "5 hodin",
     // ...
   };

   const ENGAGE = {
     bigIdea: "...",
     essentialQuestion: "...",
     challenge: "...",
     // ...
   };
   // ... atd (INVESTIGATE, QUIZ, ACT, REFLECT, SOURCES)
   ```

4. **Ověř obsah**
   - Otevři v prohlížeči
   - Zkontroluj všech 5 sekcí
   - Testuj quiz, checklist, tabulku

5. **Zaregistruj v index.html**
   ```html
   <a href="kapitoly/01-nazev-kapitoly.html" class="tile" style="...">
     <span>1</span>
     Úvod do serverových služeb
   </a>
   ```

### VIII.2 Psaní Obsahu — Stylistic Guidelines

#### Challenge Description
- **Délka:** 2–3 odstavce (100–200 slov)
- **Tone:** Direktivní, konkrétní, motivující
- **Struktura:** Jaký je problém? Co se očekává? Jaké jsou kritéria?
- **Příklad:** 
  > "Představ si, že je tvojí úlohou zmapovat všechny služby, které vaše škola potřebuje k provozu. Tvým cílem je navrhnout topologii serverů, která by tyto služby poskytovala. Zohledni bezpečnost, výkon a redundanci. Nakonec vytvoř diagram a napíšeš stručné zdůvodnění."

#### Guiding Questions
- **Počet:** 3–5 otázek
- **Styl:** Otevřené, probing, ne zavádějící
- **Příklady:**
  - "Jaké služby potřebuje školní síť?"
  - "Jak se liší fyzická a virtuální topologie?"
  - "Co znamená redundance v kontextu serverů?"

#### Quiz Question (MC)
- **Délka:** 1 věta (otázka) + 4 možnosti (A–D)
- **Správná odpověď:** Jasná, verifikovatelná
- **Vysvětlení:** Krátké (1–2 věty), vždy poskytni
- **Příklad:**
  ```
  Q: Která služba běží na portu 22?
  A. HTTP
  B. SSH ✓
  C. DNS
  D. FTP

  Vysvětlení: SSH (Secure Shell) se standardně
  spouští na portu 22 a umožňuje bezpečný
  vzdálený přístup k serveru.
  ```

#### Reflection Questions
- **Délka:** 1 otázka = 1 věta
- **Zaměření:** Metacognitive (jak se naučil), transferable (kde to využiješ)
- **Příklady:**
  - "Co jsi se naučil o tom, jak funguje síťová komunikace?"
  - "Jak bys své řešení aplikoval v reálném prostředí?"
  - "Jaké překážky ses potkal a jak ses jich zbavil?"

---

## IX. Accessibility (A11y)

### IX.1 Barevný Kontrast

```
✓ Primární text na bílém: #2C2C2C (WCAG AA ✓)
✓ Robot Blue (#47657D) na bílém: WCAG AA ✓
✓ Electric Green (#DBF02A) na tmavém: WCAG AA ✓
✗ Electric Green (#DBF02A) na bílém: WCAG AAA — NE
  → Použij pro accenty, ne pro body text
```

### IX.2 Semantic HTML

```html
<!-- Správně -->
<button>Odeslat</button>
<a href="/">Domů</a>
<h1>Úvod do serverů</h1>
<label for="quiz-a">Možnost A</label>
<input id="quiz-a" type="radio" name="q1">

<!-- Špatně (nepoužívej) -->
<div onclick="submit()">Odeslat</div>
<span style="color: blue; cursor: pointer;">Domů</span>
<div style="font-size: 2em; font-weight: bold;">Úvod</div>
```

### IX.3 Focus & Keyboard Navigation

```css
/* Viditelný focus state */
:focus-visible {
  outline: 2px solid #DBF02A;
  outline-offset: 2px;
}

/* Tab order logický */
<a href="/">Domů</a>       <!-- tab 1 -->
<button>Quiz</button>       <!-- tab 2 -->
<input type="text">         <!-- tab 3 -->
```

### IX.4 Alt Text (Obrázky & SVG)

```html
<img src="schema.png" alt="Diagram serverové topologie se čtyřmi stranami">
<svg aria-label="Checkmark icon" role="img">...</svg>
```

---

## X. Příklady & Snippets

### X.1 Kompletní Quiz Sekce (HTML)

```html
<section id="investigate" class="section">
  <h2>Zkoumání</h2>

  <div class="guiding-questions">
    <h3>Vedoucí otázky</h3>
    <ol>
      <li>Jaké služby potřebuje školní síť?</li>
      <li>Jak se liší fyzická a virtuální topologie?</li>
      <li>Co znamená redundance v kontextu serverů?</li>
    </ol>
  </div>

  <details class="sources-collapsible">
    <summary>📚 Ověřené zdroje</summary>
    <ul>
      <li>Debian dokumentace: <a href="...">Síť</a></li>
      <li>Linux Foundation: <a href="...">Serverové služby</a></li>
    </ul>
  </details>

  <div class="quiz">
    <h3>Kontrolní test</h3>
    <form id="quiz-form">
      <div class="quiz-question">
        <p><strong>1. Která služba běží na portu 22?</strong></p>
        <label class="quiz-option">
          <input type="radio" name="q1" value="a">
          <span>HTTP</span>
        </label>
        <label class="quiz-option">
          <input type="radio" name="q1" value="b">
          <span>SSH</span>
        </label>
        <label class="quiz-option">
          <input type="radio" name="q1" value="c">
          <span>DNS</span>
        </label>
        <label class="quiz-option">
          <input type="radio" name="q1" value="d">
          <span>FTP</span>
        </label>
      </div>
      <!-- Opakuj pro další otázky -->
      <button type="submit" class="btn btn-primary">Odeslat odpovědi</button>
    </form>
  </div>
</section>
```

### X.2 Kompletní Act Sekce (HTML)

```html
<section id="act" class="section">
  <h2>Řešení</h2>

  <div class="solution-phase">
    <h3>Concept — Návrh řešení</h3>
    <p>Vytvořte hrubý návrh topologie serverů...</p>
    <div class="checklist">
      <label class="checklist-item">
        <input type="checkbox" class="checklist-input">
        <span>Identifikovat ≥5 služeb</span>
      </label>
      <label class="checklist-item">
        <input type="checkbox" class="checklist-input">
        <span>Načrtnout roli každého serveru</span>
      </label>
    </div>
  </div>

  <div class="solution-phase">
    <h3>Development — Implementace s iterací</h3>
    <p>Porovnejte svůj návrh s jinou skupinou...</p>
    <div class="checklist">
      <label class="checklist-item">
        <input type="checkbox" class="checklist-input">
        <span>Prezentovat návrh skupině</span>
      </label>
      <label class="checklist-item">
        <input type="checkbox" class="checklist-input">
        <span>Zapracovat zpětnou vazbu</span>
      </label>
    </div>
  </div>

  <div class="solution-phase">
    <h3>Implementation & Evaluation — Finalizace</h3>
    <p>Uloží finální verzi...</p>
    <div class="checklist">
      <label class="checklist-item">
        <input type="checkbox" class="checklist-input">
        <span>Finální diagram complete</span>
      </label>
      <label class="checklist-item">
        <input type="checkbox" class="checklist-input">
        <span>Uloženo do týmové složky</span>
      </label>
    </div>
  </div>

  <div class="progress-container">
    <div class="progress-bar" style="width: 0%;"></div>
  </div>
  <p class="progress-text">Hotovost: <span id="progress-pct">0</span>%</p>

  <div class="artifact-box">
    <h4>📦 ARTEFAKT</h4>
    <p><strong>Finální serverová topologie</strong></p>
    <p>Diagram (obrázek nebo textový popis) + stručné zdůvodnění (50–100 slov)</p>
  </div>
</section>
```

---

## XI. Checklist — Nová Kapitola

Před publikací zkontroluj:

- [ ] **Obsah**
  - [ ] Big Idea jasný a stručný
  - [ ] Challenge konkrétní a dosažitelný
  - [ ] Guiding questions 3–5 kusů
  - [ ] Quiz 3–5 otázek, všechny s vysvětlením
  - [ ] Checklist položky konkrétní, měřitelné
  - [ ] Reflection questions 3–4 kusů
  - [ ] Zdroje tabulka 4+ položek

- [ ] **Design**
  - [ ] Barvy konzistentní (Robot Blue + Electric Green)
  - [ ] Typografie správná (nadpisy bold, body regular)
  - [ ] Spacing podle 8px gridu
  - [ ] Sticky nav funguje a scrollspy je aktivní
  - [ ] Tlačítka mají hover efekt
  - [ ] Checklisty jsou klikací
  - [ ] Tabulka má correct styling

- [ ] **Responsivita**
  - [ ] Desktop (>1024px): OK
  - [ ] Tablet (768–1024px): OK
  - [ ] Mobile (<768px): OK, čitelné, tabulka scrollable

- [ ] **Přístupnost**
  - [ ] Všechny <input> mají <label>
  - [ ] Barvy mají dostatečný kontrast
  - [ ] Focus state viditelný (outline)
  - [ ] Sémantický HTML (h1–h3, button, a, form)

- [ ] **Funkčnost**
  - [ ] Odkaz v index.html vede na kapitolu
  - [ ] Progress bar počítá checklisty
  - [ ] Quiz calculates a zobrazuje výsledky
  - [ ] Všechny interaktivní prvky fungují bez JS chyb (check dev tools)

- [ ] **Metadata**
  - [ ] <title> správný (1 Název...)
  - [ ] <meta description> vyplněn
  - [ ] EI logo je přítomno v headeru

---

## XII. Versionování & Changelog

### Verze 1.0 (2026-08-31)
- **Iniciální vydání**
- Barvy, typografie, komponenty definovány
- 12-kapitola struktura s CBL mapováním
- Responsive design (mobile-first)
- Accessibility guidelines (WCAG AA)

### Jak aktualizovat manuál
1. Zvýš verzi (1.0 → 1.1)
2. Přidej řádek do Changelog
3. Aktualizuj všechny kapitoly (pokud je to CSS/JS change)
4. Commitni do Git

---

**Konec grafického manuálu.**

Používej tento dokument jako **referenci** při tvorbě obsahu pro jednotlivé kapitoly (1–11). Všechny barevné kódy, komponenty, spacing a typografické normy jsou zde definovány — stačí je aplikovat a obsah vytvořit.
