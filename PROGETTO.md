# Sito Web di Firenze - Documentazione Progetto

## 📋 Panoramica
Progetto didattico per la creazione di un sito web istituzionale dedicato a **Firenze**, la città dell'arte e capitale della Toscana. Il sito utilizza **Bootstrap 5** come framework CSS, **HTML5** per la struttura semantica e **JavaScript vanilla** per l'interattività.

---

## 🏗️ Struttura del Progetto

```
progetto-tpsi/
├── index.html              # Homepage principale
├── assets/
│   ├── css/
│   │   └── style.css       # Stili personalizzati
│   └── js/
│       └── script.js       # Logica JavaScript
├── PROGETTO.md             # Questa documentazione
└── README.md               # Requisiti del progetto
```

---

## 🎯 Caratteristiche Implementate (Fase 1 & Inizio Fase 2)

### 1. **Navbar Responsiva**
- Navigation bar sticky con branding "Firenze"
- Menu responsive che si chiude automaticamente su mobile
- Effetto underline sui link al passaggio del mouse e durante lo scroll
- Collegamento automatico del link attivo in base alla sezione visibile

### 2. **Hero Section**
- Sfondo gradient accattivante (grigio-blu)
- Pattern decorativo SVG
- Testo principale con animazioni fade-in progressive
- Due pulsanti CTA (Call-to-Action):
  - **"Scopri di più"** (giallo/warning - primario)
  - **"Le Attrazioni"** (contorno chiaro - secondario)
- Design mobile-first e completamente responsivo

### 3. **Sezione Introduttiva**
- Layout a due colonne (immagine + testo)
- Titolo "La Città dell'Arte"
- Descrizione sintetica di Firenze
- Lista con evidenziazione di 4 punti chiave:
  - Patrimonio UNESCO
  - Numero di musei
  - Centro storico
  - Culla del Rinascimento
- Effetto hover su elementi della lista

### 4. **Footer**
- Informazioni di copyright
- Testo di attributo del progetto

### 5. **Sezione Storia**
- Timeline cronologica (fondazione romana → medioevo → rinascimento → granducato → unità → alluvione → era contemporanea)
- Animazione reveal on-scroll (IntersectionObserver)
- Struttura semantica (ol + li)
- Design responsive con colonna centrale

---

## 🎨 Design System

### Colori
- **Primary**: `#1f2937` (Grigio scuro)
- **Warning/Accent**: `#fbbf24` (Giallo dorato)
- **Text Primary**: `#111827` (Quasi nero)
- **Text Secondary**: `#6b7280` (Grigio)

### Tipografia
- **Font Stack**: System UI (Apple San Francisco, Segoe UI, Helvetica Neue)
- **Scale**: 1.25x modulare
- **Uso**: Massimo due pesi (400 normal, 600+ bold)

### Spaziatura
- **Griglia**: 8px
- **Container Max Width**: Bootstrap lg (1140px)
- **Gaps**: Multili di 0.5rem (4px, 8px, 12px, etc.)

### Animazioni
- `fadeInDown` - Elementi che scendono (hero title)
- `fadeInUp` - Elementi che salgono (CTA, description)
- Transizioni smooth (0.3s ease) su hover
- Scroll parallax leggero sulla hero section

---

## 📱 Responsività

### Breakpoint Principali
- **Desktop** (≥992px): Layout completo con immagine e testo a fianco
- **Tablet** (768px-991px): Adattamento layout con ridimensionamento
- **Mobile** (< 576px): Stack verticale, pulsanti a larghezza piena

---

## ⚙️ Tecnologie Utilizzate

| Tecnologia | Versione | Utilizzo |
|-----------|----------|---------|
| HTML5 | - | Struttura semantica |
| CSS3 | - | Styling e animazioni |
| JavaScript | ES6+ | Interattività |
| Bootstrap | 5.3.0 | Framework responsive |

---

## 🚀 Funzionalità JavaScript

1. **Gestione Navbar Attiva**
   - Tracking della sezione visibile durante scroll
   - Aggiornamento automatico del link attivo
   - Chiusura automatica menu mobile dopo clic

2. **Scroll Smooth**
   - Scroll comportamento smooths per anchor links
   - Offset di 80px per navbar sticky

3. **Effetti Parallax**
   - Background position leggero sulla hero section

---

## 📝 Prossimi Passi Suggeriti

### Fase 2 - Sezioni Aggiuntive
- [x] Sezione "Storia" con timeline
- [ ] Sezione "Attrazioni" con card grid
- [ ] Sezione "Quando Visitare" con info stagionali

### Fase 3 - Funzionalità Avanzate
- [ ] Galleria lightbox per immagini
- [ ] Form contatti con validazione
- [x] Mappa interattiva (Leaflet) centrata su Piazza del Duomo (zoom consentito, nessun movimento)
- [ ] Filter/ricerca attrazioni

### Fase 4 - Ottimizzazione
- [ ] Lazy loading immagini
- [ ] Minificazione asset
- [ ] Testing responsività
- [ ] Accessibilità (WCAG)
- [ ] SEO ottimizzazione

---

## 👥 Sviluppo Collaborativo

Struttura suggerita per i ruoli:
- **Developer 1**: Sezioni storia e timeline
- **Developer 2**: Sezione attrazioni con gallery
- **Developer 3**: Form contatti e mappa
- **Capo Progetto**: Coordinamento, review PR, deployment

Ogni membro deve fare almeno una **Pull Request** significativa.

---

## 📌 Note Importanti

- Il sito è completamente semantico e accessibile
- Nessuna dipendenza non necessaria
- CSS modularizzato e commentato
- JavaScript vanilla senza jQuery
- Compatibile con browser moderni (Chrome, Firefox, Safari, Edge)

---

**Ultimo Aggiornamento**: Novembre 2025

