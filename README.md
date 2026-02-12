# 🌊 CFD Lab — Interaktiv CFD lernen

Eine Lern-Webapp zum interaktiven Verstehen von Computational Fluid Dynamics (CFD). Finite-Volumen-Methoden, Diskretisierungsschemata, CFL-Bedingung und Peclet-Zahl werden durch direkte Code-Manipulation, Live-Simulation und verknüpfte Formeln erfahrbar.

## ⚡ Quick Start

```bash
npm install
npm run dev
# → http://localhost:3000
```

## 🏗 Architektur

```
src/
├── solver/                  # Rechenkern (reines TypeScript, kein UI)
│   ├── grid.ts              # Gittergenerierung (1D uniform, 2D uniform)
│   ├── fields.ts            # Skalarfelder, Anfangsbedingungen
│   ├── schemes.ts           # UDS, CDS, TVD (minmod/vanLeer/superbee)
│   ├── boundaryConditions.ts# Periodisch, Fixed, Zero-Gradient
│   ├── timeIntegration.ts   # CFL, dt-Berechnung, Peclet-Zahl
│   ├── solvers.ts           # Zeitschrittlöser (1D Konvektion, Konv.-Diff., 2D)
│   ├── diagnostics.ts       # L2/L∞ Normen, Masseerhaltung
│   ├── editableCode.ts      # Editierbare Code-Blöcke + Compiler/Validator
│   ├── presets.ts            # Vorkonfigurierte Lernszenarien
│   └── index.ts             # Re-exports
│
├── context/
│   └── SimulationContext.tsx # Globaler App-State (useReducer + Context)
│
├── components/
│   ├── ParameterPanel.tsx   # Links: Parameter, Presets, Schema-Wahl
│   ├── PlotPanel.tsx        # Mitte: φ(x) Profil mit Plotly.js + Timeline
│   ├── FormulaPanel.tsx     # Rechts/Tab: Schritt-für-Schritt Formeln (KaTeX)
│   ├── CodeEditorPanel.tsx  # Rechts/Tab: Monaco Editor für Solver-Code
│   ├── StencilPanel.tsx     # Rechts/Tab: Diskretisierungsstern aW, aP, aE
│   ├── DiagnosticsPanel.tsx # Rechts/Tab: Fehlerplots, Masse, Export
│   └── TabPanel.tsx         # Tab-Container für rechte Seite
│
└── app/
    ├── layout.tsx
    ├── globals.css
    └── page.tsx             # Hauptlayout (3-Spalten)
```

## 📚 Didaktischer Aufbau (Milestones)

### Milestone A: 1D Lineare Konvektion ✅
- **PDE:** ∂φ/∂t + u·∂φ/∂x = 0
- **Schemata:** UDS, CDS, TVD (minmod, van Leer, superbee)
- **Features:** φ(x) Profil, Zeitanimation, Fehlernorm, CFL-Anzeige
- **Code-Editor:** Face-Interpolation, Flux-Berechnung, Zeitschritt

### Milestone B: 1D Konvektion-Diffusion ✅
- **Zusatz:** Γ·∂²φ/∂x², Peclet-Zahl, Stabilität
- Umschaltbar über Γ > 0 im Parameter-Panel

### Milestone C: 2D Skalartransport (Grundgerüst)
- Solver-Kern implementiert (`step2DScalarTransport`)
- UI-Integration als nächster Schritt

### Milestone D: Inkompressible 2D (Roadmap)
- SIMPLE / Fractional-Step
- Lid-Driven Cavity

## 🎮 Editierbare Code-Blöcke

Im **Code-Tab** (Monaco Editor) können folgende Funktionen bearbeitet werden:

| Block | Funktion | Was du lernst |
|-------|----------|---------------|
| **Face Interpolation** | `computeFaceValue(phi, i, u_f, N)` | UDS vs CDS Unterschied |
| **Konvektiver Flux** | `computeFlux(u, phiFace)` | F = u·φ_f |
| **Zeitschritt-Update** | `timeStepUpdate(phiOld, fluxR, fluxL, dt, dx)` | Expliziter Euler |
| **Diffusiver Flux** | `diffusiveFlux(phiP, phiE, gamma, dx)` | Fick'sches Gesetz |

**Sicherheit:**
- Code wird mit `new Function()` in Sandbox kompiliert
- Smoke-Tests validieren die Ausgabe
- Reset-Button setzt auf Default zurück
- Fehlermeldungen bei Syntaxfehlern

## 📊 Presets (Lernszenarien)

| Preset | Lehrzweck |
|--------|-----------|
| Step – UDS – stabil | Numerische Diffusion sichtbar machen |
| Step – CDS – Oszillationen | 2Δx-Wellen bei CDS |
| Gauss – UDS vs CDS | Vergleichsmodus |
| Sinus – CFL > 1 | Instabilität demonstrieren |
| Konv.-Diff. – Pe hoch | Konvektion dominiert |
| Konv.-Diff. – Pe niedrig | Diffusion dominiert |
| TVD minmod – Sprung | TVD-Schema Vorteil zeigen |
| Dreieck – Vergleich | Multi-Schema Vergleich |

## 🧮 Formel-Panel (Lernmodus)

Schritt-für-Schritt Navigation durch:
1. **Erhaltungsgleichung** (kontinuierlich)
2. **Integralform** (FVM-Herleitung)
3. **Flächeninterpolation** (Schema-abhängig)
4. **Diskrete Gleichung** (Update-Formel)
5. **Stabilitätsbedingung** (CFL, Peclet)

Alle Formeln werden mit **KaTeX** gerendert und sind mit den aktuellen Parameterwerten verknüpft.

## 🔲 Stencil-Panel

Zeigt den **Diskretisierungsstern** mit Koeffizienten:
- **aW**, **aP**, **aE** numerisch und als Formel
- Koeffizientensumme (Konservativitäts-Check)
- CFL, Δt, Δx auf einen Blick

## 📈 Diagnostik-Panel

- **L₂ und L∞ Fehler** über Zeit (Log-Plot)
- **Masseerhaltung** ∫φ dx über Zeit
- **Boundedness-Check** (Unter-/Überschwinger)
- **JSON-Export** für MATLAB/Python Nachbearbeitung

## 🔌 MATLAB/Octave Integration (Optional)

Die App exportiert Ergebnisse als JSON:
```json
{
  "x": [0.005, 0.015, ...],
  "times": [0, 0.005, ...],
  "snapshots": [{"time": 0, "phi": [...]}, ...],
  "l2Errors": [...],
  "masses": [...]
}
```

**MATLAB-Import:**
```matlab
data = jsondecode(fileread('cfd_results.json'));
plot(data.x, data.snapshots(end).phi);
xlabel('x'); ylabel('\phi');
```

**Python-Backend (Roadmap):**
Ein FastAPI-Service könnte den TypeScript-Solver durch einen Python/NumPy-Solver ersetzen:
```
POST /api/solve  →  { grid, params, scheme }  →  { snapshots }
```

## 🛠 Tech-Stack

| Lib | Zweck |
|-----|-------|
| **Next.js 16** | Framework (App Router) |
| **React 19** | UI |
| **TypeScript** | Typsicherheit |
| **Tailwind CSS 4** | Styling |
| **Monaco Editor** | Code-Editor im Browser |
| **Plotly.js** | Interaktive Plots |
| **KaTeX** | Formeln |

## 📋 Roadmap

- [ ] 2D Scalar Transport UI (Heatmap + Quiver)
- [ ] TVD-Limiter Vergleichsplot (Sweby-Diagramm)
- [ ] RK2/RK4 Zeitintegration
- [ ] SIMPLE-Algorithmus (2D inkompressibel)
- [ ] Residuen-Konvergenzplot
- [ ] Python/FastAPI Backend für schwerere Cases
- [ ] Animierter Zeitverlauf (Play/Pause)
- [ ] Mehrere Milestones als Routen/Pages
