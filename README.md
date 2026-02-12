# CFD Lab — Interaktiv CFD lernen

Eine vollständige Lern-Webapp zum interaktiven Verstehen von **Computational Fluid Dynamics (CFD)**. 12 Kapitel, 44 Lektionen, 15 Live-Simulationen und über 440 Quiz-Fragen — alles im Browser, kein Backend nötig.

## Quick Start

```bash
npm install
npm run dev
# → http://localhost:3000
```

## Features

- **Curriculum mit Skill-Tree**: 12 Kapitel von Grundlagen bis Zweiphasenströmungen, dargestellt als interaktive Roadmap
- **44 Lektionen** mit Theorie (KaTeX-Formeln), interaktiver Simulation und Quiz pro Lektion
- **15 Live-Simulationen** — alle im Browser berechenbar mit Plotly.js-Visualisierung
- **Quiz-System** mit 5 Fragetypen (Single-Choice, Multi-Select, True/False, Texteingabe, Formel-Auswahl) und über 440 Fragen
- **Editierbare Code-Blöcke** — Solver-Funktionen direkt im Monaco Editor bearbeiten und testen
- **Notations-Glossar** mit allen CFD-Symbolen und Definitionen

## Curriculum (12 Kapitel)

| # | Kapitel | Lektionen |
|---|---------|-----------|
| 1 | Grundlagen | 4 |
| 2 | Finite-Differenzen-Methode (FDM) | 3 |
| 3 | Finite-Volumen-Methode (FVM) | 4 |
| 4 | Diskretisierungsschemata | 4 |
| 5 | Stabilität & Kennzahlen | 3 |
| 6 | Konvektion-Diffusion | 2 |
| 7 | 2D Erweiterung | 2 |
| 8 | Inkompressible Strömung | 3 |
| 9 | Lösungsalgorithmen | 4 |
| 10 | Kompressible Strömungen | 4 |
| 11 | Turbulenzmodellierung | 7 |
| 12 | Zweiphasenströmungen | 4 |

## Simulationen

| Simulation | Gruppe | Beschreibung |
|------------|--------|--------------|
| 1D Wärmeleitung | FDM | Expliziter Euler, Fourier-Zahl, Stabilitätsgrenze |
| Stencil-Explorer | FDM | FD-Stencils (zentral, forward, backward) auf sin(2πx) |
| 1D Konvektion | FVM | UDS/CDS mit Zeitanimation und Fehlerplots |
| Konvektion-Diffusion | FVM | Peclet-Zahl-abhängig, Diffusionsterm Γ·∂²φ/∂x² |
| Schema-Vergleich & TVD | FVM | Alle Schemata (UDS, CDS, TVD-Limiter) nebeneinander |
| CFL-Analyse | Stabilität | CFL-Zahl interaktiv variieren, Instabilität beobachten |
| Péclet-Analyse | Stabilität | Konvektion vs. Diffusion dominiert |
| 2D Skalartransport | 2D | Gauß-Hügel in uniformem Geschwindigkeitsfeld |
| Lid-Driven Cavity | 2D / NS | Wirbelstärke-Stromfunktion (ω-ψ), 4 Visualisierungsmodi |
| Jacobi vs. Gauss-Seidel | Algorithmen | Konvergenzvergleich iterativer Löser (Log-Plot) |
| Normalschock-Relationen | Kompressibel | Stoßbeziehungen als Funktion der Mach-Zahl |
| Sod Shock Tube | Kompressibel | Riemann-Problem mit Lax-Friedrichs, animierter Zeitverlauf |
| Energiespektrum E(k) | Turbulenz | Kolmogorov -5/3 Kaskade, LES-Filter |
| Wandgesetz u⁺(y⁺) | Turbulenz | Viskose Unterschicht, Log-Schicht, Reichardt-Profil |
| 1D VOF-Advektion | Zweiphasen | Volume-of-Fluid Transport mit Animation und Geschwindigkeitsregler |

## Architektur

```
src/
├── app/                     # Next.js App Router
│   ├── layout.tsx           # Root-Layout (dark theme)
│   ├── page.tsx             # Hauptseite mit Routing
│   └── globals.css          # Tailwind + globale Styles
│
├── components/              # React-Komponenten
│   ├── Roadmap.tsx          # Skill-Tree / Kapitel-Übersicht
│   ├── LessonPage.tsx       # Lektion: Theorie + Simulation + Quiz
│   ├── SimSandbox.tsx       # Alle 15 Simulations-Sandboxes
│   ├── FullSimulation.tsx   # Simulations-Labor (freie Auswahl)
│   ├── QuizMode.tsx         # Standalone Quiz-Modus
│   ├── QuizPanel.tsx        # Quiz-Rendering (5 Fragetypen)
│   ├── NotationGlossary.tsx # CFD-Symbolverzeichnis
│   ├── Icons.tsx            # SVG Icon-System
│   ├── PlotPanel.tsx        # Plotly-Wrapper für FVM-Plots
│   ├── ParameterPanel.tsx   # Parameter-Sidebar (FVM)
│   ├── FormulaPanel.tsx     # KaTeX Schritt-für-Schritt Formeln
│   ├── CodeEditorPanel.tsx  # Monaco Editor für Solver-Code
│   ├── StencilPanel.tsx     # FD-Stencil Visualisierung
│   ├── DiagnosticsPanel.tsx # L₂/L∞ Fehler, Masseerhaltung
│   └── TabPanel.tsx         # Tab-Container
│
├── context/
│   └── SimulationContext.tsx # Globaler FVM-State (useReducer)
│
├── curriculum/
│   ├── curriculum.ts        # 12 Kapitel, 44 Lektionen (Struktur)
│   ├── lessonContent.ts     # Theorie-Texte pro Lektion
│   ├── quizData.ts          # 440+ Quiz-Fragen (14 Themen)
│   └── glossaryData.ts      # Notations-Glossar Einträge
│
└── solver/                  # Rechenkern (reines TypeScript)
    ├── grid.ts              # Gittergenerierung (1D/2D uniform)
    ├── fields.ts            # Skalarfelder, Anfangsbedingungen
    ├── schemes.ts           # UDS, CDS, TVD (minmod/vanLeer/superbee)
    ├── boundaryConditions.ts# Periodisch, Fixed, Zero-Gradient
    ├── timeIntegration.ts   # CFL, dt-Berechnung, Peclet-Zahl
    ├── solvers.ts           # Zeitschrittlöser (1D, 2D)
    ├── fdm.ts               # FDM-Solver + Stencils
    ├── diagnostics.ts       # L₂/L∞ Normen, Masseerhaltung
    ├── editableCode.ts      # Editierbare Code-Blöcke
    ├── presets.ts            # Vorkonfigurierte Lernszenarien
    └── index.ts             # Re-exports
```

## Quiz-System

5 Fragetypen decken verschiedene Lernniveaus ab:

| Typ | Beschreibung |
|-----|--------------|
| **Single-Choice** | Eine korrekte Antwort aus mehreren Optionen |
| **Multi-Select** | Mehrere korrekte Antworten (Checkboxen) |
| **True/False** | Wahr-oder-Falsch Aussagen |
| **Texteingabe** | Freitext-Antwort mit Keyword-Matching |
| **Formel-Auswahl** | KaTeX-gerenderte Formeln als Optionen |

Der Quiz-Modus kann über die Hauptnavigation aufgerufen werden — mit Themenauswahl, einstellbarer Fragenanzahl und Sofort-Feedback.

## Tech-Stack

| Bibliothek | Version | Zweck |
|------------|---------|-------|
| Next.js | 16.1 | Framework (App Router, Turbopack) |
| React | 19.2 | UI |
| TypeScript | 5 | Typsicherheit |
| Tailwind CSS | 4 | Styling (Dark Theme) |
| Plotly.js | 3.3 | Interaktive Plots & Heatmaps |
| Monaco Editor | 4.7 | Code-Editor im Browser |
| KaTeX | 0.16 | Mathematische Formeln |
