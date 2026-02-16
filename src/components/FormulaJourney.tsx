'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import katex from 'katex';

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   FormulaJourney — ONE formula morphing through CFD discretisation.

   Two method tracks:  FVM · FDM
   Sub-options:        Konvektionsschema / FD-Stencil · Zeitintegration

   8 stages from continuous PDE → solved system.
   Order: Early(4) → Schema/Stencil(1) → Zeit(1) → Late(2)

   Fixes applied:
   1. FVM uses multi-D ∇ notation throughout, (u⃗φ)·n⃗ in Gauß
   2. FVM uses ṁ_f = ρ(u⃗·n⃗)_f A_f consistently, includes S_φ
   3. Schema/Stencil before Zeitdiskretisierung (φ_f defined first)
   4. FDM "Einsetzen" stage depends on selected stencil
   5. FDM Zeit uses L(φ) operator notation
   6. Crank-Nicolson with clean R / L definition
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const C = {
  cyan:    '#22d3ee',
  violet:  '#a78bfa',
  amber:   '#fbbf24',
  emerald: '#34d399',
  rose:    '#fb7185',
  sky:     '#38bdf8',
  orange:  '#fb923c',
  white:   '#e2e8f0',
};

const tc = (color: string, tex: string) =>
  `\\textcolor{${color}}{\\htmlClass{fj-new}{${tex}}}`;

interface DerivStep {
  title: string;
  tex: string;
  note?: string;
}

interface Stage {
  label: string;
  stepLabel: string;
  formula: string;
  annotation: string;
  color: string;
  derivation?: DerivStep[];
  byDim?: Partial<Record<DimKey, { formula?: string; annotation?: string }>>;
}

type MethodKey = 'FVM' | 'FDM';
type TimeKey = 'euler-exp' | 'euler-imp' | 'crank-nic';
type FVMScheme = 'UDS' | 'CDS' | 'TVD';
type FDMScheme = 'backward' | 'central' | 'forward';
type DimKey = '1D' | '2D' | '3D' | 'allg';

/* ═══════════════════════════════════════════════════════════════════
   FVM EARLY STAGES (0-3) — multi-D, ∇ notation, ṁ_f, + Quelle
   ═══════════════════════════════════════════════════════════════════ */

const FVM_EARLY: Stage[] = [
  {
    label: 'Kontinuierliche Transportgleichung',
    stepLabel: 'Start',
    formula: `\\frac{\\partial (\\rho\\phi)}{\\partial t} + \\nabla\\!\\cdot\\!(\\rho\\,\\vec{u}\\,\\phi) = \\nabla\\!\\cdot\\!(\\Gamma\\,\\nabla\\phi) + S_\\phi`,
    annotation: 'Die allgemeine Transportgleichung — mit ρ in transientem und konvektivem Term.',
    color: C.white,
    byDim: {
      '1D': { formula: `\\frac{\\partial(\\rho\\phi)}{\\partial t} + \\frac{\\partial(\\rho u\\phi)}{\\partial x} = \\frac{\\partial}{\\partial x}\\!\\left(\\Gamma\\frac{\\partial\\phi}{\\partial x}\\right) + S_\\phi`, annotation: '1D-Transportgleichung — eine Raumrichtung x.' },
      '2D': { formula: `\\frac{\\partial(\\rho\\phi)}{\\partial t} + \\frac{\\partial(\\rho u\\phi)}{\\partial x} + \\frac{\\partial(\\rho v\\phi)}{\\partial y} = \\frac{\\partial}{\\partial x}\\!\\left(\\Gamma\\frac{\\partial\\phi}{\\partial x}\\right) + \\frac{\\partial}{\\partial y}\\!\\left(\\Gamma\\frac{\\partial\\phi}{\\partial y}\\right) + S_\\phi`, annotation: '2D-Transportgleichung — Konvektion und Diffusion in x und y.' },
      '3D': { formula: `\\frac{\\partial(\\rho\\phi)}{\\partial t} + \\frac{\\partial(\\rho u\\phi)}{\\partial x} + \\frac{\\partial(\\rho v\\phi)}{\\partial y} + \\frac{\\partial(\\rho w\\phi)}{\\partial z} = \\frac{\\partial}{\\partial x}\\!\\left(\\Gamma\\frac{\\partial\\phi}{\\partial x}\\right) + \\frac{\\partial}{\\partial y}\\!\\left(\\Gamma\\frac{\\partial\\phi}{\\partial y}\\right) + \\frac{\\partial}{\\partial z}\\!\\left(\\Gamma\\frac{\\partial\\phi}{\\partial z}\\right) + S_\\phi`, annotation: '3D-Transportgleichung — alle drei Raumrichtungen.' },
    },
    derivation: [
      { title: 'Massenerhaltung (Kontinuität)',
        tex: '\\frac{\\partial \\rho}{\\partial t} + \\nabla\\!\\cdot\\!(\\rho\\,\\vec{u}) = 0',
        note: 'Masse kann weder erzeugt noch vernichtet werden.' },
      { title: 'Impulserhaltung (Navier-Stokes)',
        tex: '\\frac{\\partial (\\rho\\,\\vec{u})}{\\partial t} + \\nabla\\!\\cdot\\!(\\rho\\,\\vec{u}\\otimes\\vec{u}) = -\\nabla p + \\nabla\\!\\cdot\\!\\boldsymbol{\\tau} + \\rho\\,\\vec{g}',
        note: 'Newton II auf ein Fluidelement: Trägheit = Druck + Reibung + Schwerkraft.' },
      { title: 'Energieerhaltung',
        tex: '\\frac{\\partial (\\rho\\,e)}{\\partial t} + \\nabla\\!\\cdot\\!(\\rho\\,e\\,\\vec{u}) = -\\nabla\\!\\cdot\\!\\vec{q} + \\Phi + \\dot{Q}',
        note: 'e = spez. Energie, q = Wärmefluss (Fourier), Φ = Dissipation.' },
      { title: 'Allgemeine Transportgleichung',
        tex: '\\frac{\\partial (\\rho\\phi)}{\\partial t} + \\underbrace{\\nabla\\!\\cdot\\!(\\rho\\,\\vec{u}\\,\\phi)}_{\\text{Konvektion}} = \\underbrace{\\nabla\\!\\cdot\\!(\\Gamma\\,\\nabla\\phi)}_{\\text{Diffusion}} + \\underbrace{S_\\phi}_{\\text{Quelle}}',
        note: 'φ = 1 → Kontinuität, φ = u → Impuls, φ = T → Energie. Γ = Diffusionskoeffizient.' },
    ],
  },
  {
    label: 'Über Kontrollvolumen integrieren',
    stepLabel: 'Integrieren',
    formula: `${tc(C.cyan, '\\int_V')} \\frac{\\partial (\\rho\\phi)}{\\partial t}\\,${tc(C.cyan, 'dV')} + ${tc(C.cyan, '\\int_V')} \\nabla\\!\\cdot\\!(\\rho\\,\\vec{u}\\,\\phi)\\,${tc(C.cyan, 'dV')} = ${tc(C.cyan, '\\int_V')} \\nabla\\!\\cdot\\!(\\Gamma\\,\\nabla\\phi)\\,${tc(C.cyan, 'dV')} + ${tc(C.cyan, '\\int_V')} S_\\phi\\,${tc(C.cyan, 'dV')}`,
    annotation: 'Jeden Term über ein Kontrollvolumen V integrieren.',
    color: C.cyan,
    byDim: {
      '1D': { formula: `${tc(C.cyan, '\\int_{x_w}^{x_e}')} \\frac{\\partial(\\rho\\phi)}{\\partial t}\\,${tc(C.cyan, 'dx')} + ${tc(C.cyan, '\\int_{x_w}^{x_e}')} \\frac{\\partial(\\rho u\\phi)}{\\partial x}\\,${tc(C.cyan, 'dx')} = ${tc(C.cyan, '\\int_{x_w}^{x_e}')} \\frac{\\partial}{\\partial x}\\!\\left(\\Gamma\\frac{\\partial\\phi}{\\partial x}\\right)${tc(C.cyan, 'dx')} + ${tc(C.cyan, '\\int_{x_w}^{x_e}')} S_\\phi\\,${tc(C.cyan, 'dx')}`, annotation: 'Integration über ein 1D-Kontrollvolumen [x_w, x_e].' },
      '2D': { formula: `${tc(C.cyan, '\\int_A')} \\frac{\\partial (\\rho\\phi)}{\\partial t}\\,${tc(C.cyan, 'dA')} + ${tc(C.cyan, '\\int_A')} \\left(\\frac{\\partial(\\rho u\\phi)}{\\partial x} + \\frac{\\partial(\\rho v\\phi)}{\\partial y}\\right)${tc(C.cyan, 'dA')} = ${tc(C.cyan, '\\int_A')} \\left(\\frac{\\partial}{\\partial x}(\\Gamma\\frac{\\partial\\phi}{\\partial x}) + \\frac{\\partial}{\\partial y}(\\Gamma\\frac{\\partial\\phi}{\\partial y})\\right)${tc(C.cyan, 'dA')} + ${tc(C.cyan, '\\int_A')} S_\\phi\\,${tc(C.cyan, 'dA')}`, annotation: 'Integration über ein 2D-Kontrollvolumen (Fläche A). Konvektion + Diffusion in x und y.' },
      '3D': { formula: `${tc(C.cyan, '\\int_V')} \\frac{\\partial (\\rho\\phi)}{\\partial t}\\,${tc(C.cyan, 'dV')} + ${tc(C.cyan, '\\int_V')} \\left(\\frac{\\partial(\\rho u\\phi)}{\\partial x} + \\frac{\\partial(\\rho v\\phi)}{\\partial y} + \\frac{\\partial(\\rho w\\phi)}{\\partial z}\\right)${tc(C.cyan, 'dV')} = ${tc(C.cyan, '\\int_V')} \\left(\\sum_k \\frac{\\partial}{\\partial x_k}(\\Gamma\\frac{\\partial\\phi}{\\partial x_k})\\right)${tc(C.cyan, 'dV')} + ${tc(C.cyan, '\\int_V')} S_\\phi\\,${tc(C.cyan, 'dV')}`, annotation: 'Integration über ein 3D-Kontrollvolumen (Hexaeder). Alle drei Raumrichtungen.' },
    },
    derivation: [
      { title: 'Warum integrieren?',
        tex: '\\text{PDE gilt punktweise} \\;\\Rightarrow\\; \\text{Integration} \\Rightarrow \\text{gilt im Mittel über } V',
        note: 'Die FVM basiert auf der Integralform — dadurch automatisch konservativ.' },
      { title: 'Volumenintegral aufteilen',
        tex: '\\int_V \\frac{\\partial(\\rho\\phi)}{\\partial t}\\,dV + \\int_V \\nabla\\!\\cdot\\!(\\rho\\vec{u}\\phi)\\,dV = \\int_V \\nabla\\!\\cdot\\!(\\Gamma\\nabla\\phi)\\,dV + \\int_V S_\\phi\\,dV',
        note: 'Linearität des Integrals: jeden Term einzeln integrieren.' },
      { title: 'Zeitterm vereinfachen',
        tex: '\\int_V \\frac{\\partial(\\rho\\phi)}{\\partial t}\\,dV \\approx \\frac{\\partial}{\\partial t}(\\rho_P\\,\\phi_P\\,V_P)',
        note: 'Bei inkompressiblem Fluid und festem Gitter: ρ_P V_P = const.' },
    ],
  },
  {
    label: 'Gauß\u2019scher Divergenzsatz',
    stepLabel: 'Gauß',
    formula: `\\int_V \\frac{\\partial (\\rho\\phi)}{\\partial t}\\,dV + ${tc(C.violet, '\\oint_S')} \\rho\\,\\phi\\,(\\vec{u}${tc(C.violet, '\\cdot\\vec{n}')})\\,${tc(C.violet, 'dA')} = ${tc(C.violet, '\\oint_S')} \\Gamma\\,(\\nabla\\phi${tc(C.violet, '\\cdot\\vec{n}')})\\,${tc(C.violet, 'dA')} + \\int_V S_\\phi\\,dV`,
    annotation: 'Divergenz-Integrale → Oberflächenintegrale. Konvektion: ρφ(u⃗·n⃗), Diffusion: Γ(∇φ·n⃗).',
    color: C.violet,
    byDim: {
      '1D': { formula: `\\rho_P V_P\\frac{\\partial\\phi_P}{\\partial t} + ${tc(C.violet, '\\left[\\rho u\\phi\\right]_{x_w}^{x_e}')} = ${tc(C.violet, '\\left[\\Gamma\\frac{\\partial\\phi}{\\partial x}\\right]_{x_w}^{x_e}')} + \\int_{x_w}^{x_e} S_\\phi\\,dx`, annotation: 'In 1D = Hauptsatz der Analysis: ∫ ∂F/∂x dx = F(x_e) − F(x_w).' },
      '2D': { formula: `\\int_A \\frac{\\partial (\\rho\\phi)}{\\partial t}\\,dA + ${tc(C.violet, '\\oint_C')} \\rho\\,\\phi\\,(\\vec{u}${tc(C.violet, '\\cdot\\hat{n}')})\\,${tc(C.violet, 'dl')} = ${tc(C.violet, '\\oint_C')} \\Gamma\\,(\\nabla\\phi${tc(C.violet, '\\cdot\\hat{n}')})\\,${tc(C.violet, 'dl')} + \\int_A S_\\phi\\,dA`, annotation: 'Gauß in 2D: 4 Kanten (e, w, n, s). Linienintegral ∮_C über den Rand.' },
      '3D': { formula: `\\int_V \\frac{\\partial (\\rho\\phi)}{\\partial t}\\,dV + ${tc(C.violet, '\\oint_S')} \\rho\\,\\phi\\,(\\vec{u}${tc(C.violet, '\\cdot\\vec{n}')})\\,${tc(C.violet, 'dA')} = ${tc(C.violet, '\\oint_S')} \\Gamma\\,(\\nabla\\phi${tc(C.violet, '\\cdot\\vec{n}')})\\,${tc(C.violet, 'dA')} + \\int_V S_\\phi\\,dV`, annotation: 'Gauß in 3D: 6 Flächen (e, w, n, s, t, b). Oberflächenintegral ∮_S.' },
    },
    derivation: [
      { title: 'Gauß\u2019scher Divergenzsatz',
        tex: '\\int_V \\nabla\\!\\cdot\\!\\vec{F}\\,dV = \\oint_S \\vec{F}\\cdot\\vec{n}\\,dA',
        note: 'Gilt für jedes stetig differenzierbare Vektorfeld F⃗ und geschlossene Fläche S.' },
      { title: 'Anwendung auf Konvektion',
        tex: '\\int_V \\nabla\\!\\cdot\\!(\\rho\\vec{u}\\phi)\\,dV = \\oint_S \\rho\\,\\phi\\,(\\vec{u}\\cdot\\vec{n})\\,dA',
        note: 'F⃗ = ρu⃗φ → der konvektive Fluss durch die Oberfläche.' },
      { title: 'Anwendung auf Diffusion',
        tex: '\\int_V \\nabla\\!\\cdot\\!(\\Gamma\\nabla\\phi)\\,dV = \\oint_S \\Gamma\\,(\\nabla\\phi\\cdot\\vec{n})\\,dA',
        note: 'F⃗ = Γ∇φ → der diffusive Fluss (Fourier/Fick).' },
      { title: 'Physikalische Bedeutung',
        tex: '\\text{Volumenänderung} = \\text{Nettofluss durch Ränder}',
        note: 'Das ist der Kern der FVM: Was rein fließt minus was raus fließt = Änderung im Volumen.' },
    ],
  },
  {
    label: 'Diskrete Summe über Faces',
    stepLabel: 'Diskretisieren',
    formula: `${tc(C.amber, '\\rho_P V_P')}\\frac{\\partial \\phi_P}{\\partial t} + ${tc(C.amber, '\\sum_f')} \\dot{m}_f\\,\\phi_f = ${tc(C.amber, '\\sum_f')} \\Gamma_f A_f\\,(\\nabla\\phi\\!\\cdot\\!\\vec{n})_f + S_{\\phi,P}\\,${tc(C.amber, 'V_P')}`,
    annotation: 'ṁ_f = ρ_f (u⃗·n⃗)_f A_f — der Massenfluss durch Face f.',
    color: C.amber,
    byDim: {
      '1D': { formula: `${tc(C.amber, '\\rho_P \\Delta x')}\\frac{\\partial \\phi_P}{\\partial t} + \\dot{m}_e\\,\\phi_e - \\dot{m}_w\\,\\phi_w = \\Gamma_e\\frac{\\phi_E - \\phi_P}{\\delta x} - \\Gamma_w\\frac{\\phi_P - \\phi_W}{\\delta x} + S_{\\phi,P}\\,${tc(C.amber, '\\Delta x')}`, annotation: '2 Faces: e (rechts), w (links). V_P = Δx, A_f = 1.' },
      '2D': { formula: `${tc(C.amber, '\\rho_P V_P')}\\frac{\\partial \\phi_P}{\\partial t} + ${tc(C.amber, '\\sum_{f \\in \\{e,w,n,s\\}}')} \\dot{m}_f\\,\\phi_f = ${tc(C.amber, '\\sum_{f \\in \\{e,w,n,s\\}}')} \\Gamma_f A_f\\,(\\nabla\\phi\\!\\cdot\\!\\vec{n})_f + S_{\\phi,P}\\,${tc(C.amber, 'V_P')}`, annotation: '4 Faces: e, w, n, s. Summe über alle Ränder der 2D-Zelle.' },
      '3D': { formula: `${tc(C.amber, '\\rho_P V_P')}\\frac{\\partial \\phi_P}{\\partial t} + ${tc(C.amber, '\\sum_{f \\in \\{e,w,n,s,t,b\\}}')} \\dot{m}_f\\,\\phi_f = ${tc(C.amber, '\\sum_{f \\in \\{e,w,n,s,t,b\\}}')} \\Gamma_f A_f\\,(\\nabla\\phi\\!\\cdot\\!\\vec{n})_f + S_{\\phi,P}\\,${tc(C.amber, 'V_P')}`, annotation: '6 Faces: e, w, n, s, t, b. Hexaeder-Kontrollvolumen.' },
    },
    derivation: [
      { title: 'Oberflächenintegral → Summe',
        tex: '\\oint_S \\rho\\,\\phi\\,(\\vec{u}\\cdot\\vec{n})\\,dA \\approx \\sum_f \\rho_f\\,\\phi_f\\,(\\vec{u}\\cdot\\vec{n})_f\\,A_f',
        note: 'Mittelpunktsregel: Wert am Face-Zentrum × Fläche.' },
      { title: 'Massenfluss definieren',
        tex: '\\dot{m}_f \\equiv \\rho_f\\,(\\vec{u}\\cdot\\vec{n})_f\\,A_f',
        note: 'ṁ_f > 0: Fluss verlässt die Zelle. ṁ_f < 0: Fluss kommt rein.' },
      { title: 'Diffusiver Fluss',
        tex: '\\Gamma_f A_f (\\nabla\\phi\\cdot\\vec{n})_f \\approx \\Gamma_f A_f \\frac{\\phi_E - \\phi_P}{d_{PE}}',
        note: 'Zentraler Differenzenquotient zwischen P und E.' },
      { title: 'Quellterm',
        tex: '\\int_V S_\\phi\\,dV \\approx S_{\\phi,P}\\,V_P',
        note: 'Quellterm im Zellzentrum ausgewertet × Zellvolumen.' },
    ],
  },
];

/* ═══════════════════════════════════════════════════════════════════
   FDM EARLY STAGES (0-2 fixed, stage 3 depends on stencil choice)
   ═══════════════════════════════════════════════════════════════════ */

const FDM_EARLY_FIXED: Stage[] = [
  {
    label: 'Kontinuierliche PDE',
    stepLabel: 'Start',
    formula: `\\frac{\\partial \\phi}{\\partial t} + u\\frac{\\partial \\phi}{\\partial x} = \\Gamma \\frac{\\partial^2 \\phi}{\\partial x^2}`,
    annotation: 'Die Transportgleichung in nicht-konservativer Form (1D, u = const).',
    color: C.white,
    byDim: {
      '2D': { formula: `\\frac{\\partial \\phi}{\\partial t} + u\\frac{\\partial \\phi}{\\partial x} + v\\frac{\\partial \\phi}{\\partial y} = \\Gamma\\!\\left(\\frac{\\partial^2 \\phi}{\\partial x^2} + \\frac{\\partial^2 \\phi}{\\partial y^2}\\right)`, annotation: '2D-Konvektions-Diffusions-Gleichung mit u, v.' },
      '3D': { formula: `\\frac{\\partial \\phi}{\\partial t} + u\\frac{\\partial \\phi}{\\partial x} + v\\frac{\\partial \\phi}{\\partial y} + w\\frac{\\partial \\phi}{\\partial z} = \\Gamma\\!\\left(\\frac{\\partial^2 \\phi}{\\partial x^2} + \\frac{\\partial^2 \\phi}{\\partial y^2} + \\frac{\\partial^2 \\phi}{\\partial z^2}\\right)`, annotation: '3D mit u, v, w — drei Geschwindigkeitskomponenten.' },
      'allg': { formula: `\\frac{\\partial \\phi}{\\partial t} + \\vec{u}\\cdot\\nabla\\phi = \\Gamma\\,\\nabla^2\\phi`, annotation: 'Kompakte Vektorform. u⃗·∇φ = Konvektion, Γ∇²φ = Diffusion.' },
    },
  },
  {
    label: 'Taylor-Reihe aufstellen',
    stepLabel: 'Taylor',
    formula: `\\phi(x\\!+\\!\\Delta x) = \\phi(x) + ${tc(C.cyan, '\\Delta x\\,\\phi\' + \\tfrac{\\Delta x^2}{2}\\,\\phi\'\' + \\tfrac{\\Delta x^3}{6}\\,\\phi\'\'\' + \\cdots')}`,
    annotation: 'Die Taylor-Entwicklung ist die Basis aller FD-Stencils.',
    color: C.cyan,
    byDim: {
      '2D': { annotation: 'Taylor-Entwicklung gilt in jeder Raumrichtung (x, y) unabhängig.' },
      '3D': { annotation: 'Taylor-Entwicklung wird in x, y und z separat angewandt.' },
      'allg': { annotation: 'Basis aller FD-Stencils — gilt in jeder Koordinatenrichtung.' },
    },
    derivation: [
      { title: 'Taylor-Reihe Herleitung',
        tex: 'f(x+h) = \\sum_{k=0}^{\\infty} \\frac{h^k}{k!} f^{(k)}(x)',
        note: 'Voraussetzung: f ist unendlich oft differenzierbar.' },
      { title: 'Vorwärts-Entwicklung',
        tex: 'f(x+\\Delta x) = f(x) + \\Delta x\\,f\'(x) + \\frac{\\Delta x^2}{2}f\'\'(x) + \\frac{\\Delta x^3}{6}f\'\'\'(x) + \\cdots',
        note: 'h = +Δx einsetzen.' },
      { title: 'Rückwärts-Entwicklung',
        tex: 'f(x-\\Delta x) = f(x) - \\Delta x\\,f\'(x) + \\frac{\\Delta x^2}{2}f\'\'(x) - \\frac{\\Delta x^3}{6}f\'\'\'(x) + \\cdots',
        note: 'h = −Δx einsetzen. Beachte: ungerade Potenzen wechseln das Vorzeichen!' },
      { title: 'Subtraktion → 1. Ableitung',
        tex: 'f(x+\\Delta x) - f(x-\\Delta x) = 2\\Delta x\\,f\'(x) + \\mathcal{O}(\\Delta x^3)',
        note: '→ Zentrale Differenz: f\'(x) ≈ [f(x+Δx) − f(x−Δx)] / (2Δx), 2. Ordnung.' },
      { title: 'Addition → 2. Ableitung',
        tex: 'f(x+\\Delta x) + f(x-\\Delta x) = 2f(x) + \\Delta x^2 f\'\'(x) + \\mathcal{O}(\\Delta x^4)',
        note: '→ f\'\' ≈ [f_{i+1} − 2f_i + f_{i-1}] / Δx². Der wichtigste 3-Punkt-Stencil.' },
    ],
  },
  {
    label: 'Differenzenquotienten',
    stepLabel: 'Differenzen',
    formula: `\\frac{\\partial \\phi}{\\partial x}\\bigg|_i \\!\\approx ${tc(C.violet, '\\frac{\\Delta \\phi}{\\Delta x}')}\\,,\\quad \\frac{\\partial^2 \\phi}{\\partial x^2}\\bigg|_i \\!\\approx ${tc(C.violet, '\\frac{\\phi_{i+1} - 2\\phi_i + \\phi_{i-1}}{\\Delta x^2}')}`,
    annotation: 'Ableitungen → Differenzenquotienten. Die Stencil-Wahl bestimmt Δφ/Δx.',
    color: C.violet,
    byDim: {
      '2D': { formula: `\\frac{\\partial \\phi}{\\partial x}\\bigg|_{i,j} \\!\\approx ${tc(C.violet, '\\frac{\\Delta \\phi}{\\Delta x}')},\\; \\frac{\\partial \\phi}{\\partial y}\\bigg|_{i,j} \\!\\approx ${tc(C.violet, '\\frac{\\Delta \\phi}{\\Delta y}')},\\; \\nabla^2\\phi \\approx ${tc(C.violet, '\\frac{\\delta^2\\phi}{\\Delta x^2} + \\frac{\\delta^2\\phi}{\\Delta y^2}')}`, annotation: 'In 2D: Stencils in x- und y-Richtung. 5-Punkt-Laplace-Stencil.' },
      '3D': { formula: `\\frac{\\partial \\phi}{\\partial x_k}\\bigg|_{\\vec{i}} \\!\\approx ${tc(C.violet, '\\frac{\\Delta \\phi}{\\Delta x_k}')},\\quad \\nabla^2\\phi \\approx ${tc(C.violet, '\\sum_{k=1}^{3} \\frac{\\phi_{+e_k} - 2\\phi + \\phi_{-e_k}}{\\Delta x_k^2}')}`, annotation: 'In 3D: Stencils in x, y, z. 7-Punkt-Laplace-Stern.' },
      'allg': { formula: `\\frac{\\partial \\phi}{\\partial x_k} \\approx ${tc(C.violet, '\\frac{\\Delta \\phi}{\\Delta x_k}')},\\quad \\nabla^2\\phi \\approx ${tc(C.violet, '\\sum_k \\frac{\\delta^2\\phi}{\\Delta x_k^2}')}`, annotation: 'Stencils in jeder Koordinatenrichtung x_k.' },
    },
    derivation: [
      { title: 'Vorwärts-Differenz (Forward)',
        tex: '\\frac{df}{dx}\\bigg|_i \\approx \\frac{f_{i+1} - f_i}{\\Delta x} + \\mathcal{O}(\\Delta x)',
        note: '1. Ordnung genau. Einseitig → nur Nachbar rechts benötigt.' },
      { title: 'Rückwärts-Differenz (Backward)',
        tex: '\\frac{df}{dx}\\bigg|_i \\approx \\frac{f_i - f_{i-1}}{\\Delta x} + \\mathcal{O}(\\Delta x)',
        note: '1. Ordnung genau. Upwind bei u > 0 → gibt Stabilität!' },
      { title: 'Zentrale Differenz (Central)',
        tex: '\\frac{df}{dx}\\bigg|_i \\approx \\frac{f_{i+1} - f_{i-1}}{2\\Delta x} + \\mathcal{O}(\\Delta x^2)',
        note: '2. Ordnung genau, aber kein Upwind-Charakter → kann oszillieren.' },
      { title: '2. Ableitung (Laplace-Stencil)',
        tex: '\\frac{d^2f}{dx^2}\\bigg|_i \\approx \\frac{f_{i+1} - 2f_i + f_{i-1}}{\\Delta x^2} + \\mathcal{O}(\\Delta x^2)',
        note: 'Symmetrischer 3-Punkt-Stencil [1, −2, 1]. Immer zentrale Differenz.' },
    ],
  },
];

/** Stage 3 for FDM: "Einsetzen" depends on the selected FD stencil. */
const FDM_EINSETZEN: Record<FDMScheme, Stage> = {
  backward: {
    label: 'In PDE einsetzen (Rückwärts)',
    stepLabel: 'Einsetzen',
    formula: `\\frac{\\partial \\phi_i}{\\partial t} + u\\,${tc(C.amber, '\\frac{\\phi_i - \\phi_{i-1}}{\\Delta x}')} = \\Gamma\\,${tc(C.amber, '\\frac{\\phi_{i+1} - 2\\phi_i + \\phi_{i-1}}{\\Delta x^2}')}`,
    annotation: 'Rückwärts-Differenz für ∂φ/∂x: 1. Ordnung. Entspricht Upwind bei u > 0.',
    color: C.amber,
    byDim: {
      '2D': { formula: `\\frac{\\partial \\phi_{i,j}}{\\partial t} + u\\,${tc(C.amber, '\\frac{\\phi_{i,j} - \\phi_{i-1,j}}{\\Delta x}')} + v\\,${tc(C.amber, '\\frac{\\phi_{i,j} - \\phi_{i,j-1}}{\\Delta y}')} = \\Gamma\\,${tc(C.amber, '\\frac{\\phi_{i+1,j} - 2\\phi_{i,j} + \\phi_{i-1,j}}{\\Delta x^2}')} + \\Gamma\\,${tc(C.amber, '\\frac{\\phi_{i,j+1} - 2\\phi_{i,j} + \\phi_{i,j-1}}{\\Delta y^2}')}`, annotation: 'Rückwärts in x und y. 2D-Stencil: 5 Punkte.' },
      '3D': { formula: `\\frac{\\partial \\phi_{\\vec{i}}}{\\partial t} + \\sum_k u_k\\,${tc(C.amber, '\\frac{\\phi_{\\vec{i}} - \\phi_{\\vec{i}-e_k}}{\\Delta x_k}')} = \\sum_k \\Gamma\\,${tc(C.amber, '\\frac{\\phi_{\\vec{i}+e_k} - 2\\phi_{\\vec{i}} + \\phi_{\\vec{i}-e_k}}{\\Delta x_k^2}')}`, annotation: 'Rückwärts in jeder Richtung. e_k = Einheitsvektor.' },
      'allg': { formula: `\\frac{\\partial \\phi}{\\partial t} + \\vec{u}\\cdot${tc(C.amber, '\\nabla_h^{-}\\phi')} = \\Gamma\\,${tc(C.amber, '\\nabla_h^2\\phi')}`, annotation: '∇_h^− = diskretisierter Rückwärts-Gradient.' },
    },
  },
  central: {
    label: 'In PDE einsetzen (Zentral)',
    stepLabel: 'Einsetzen',
    formula: `\\frac{\\partial \\phi_i}{\\partial t} + u\\,${tc(C.amber, '\\frac{\\phi_{i+1} - \\phi_{i-1}}{2\\Delta x}')} = \\Gamma\\,${tc(C.amber, '\\frac{\\phi_{i+1} - 2\\phi_i + \\phi_{i-1}}{\\Delta x^2}')}`,
    annotation: 'Zentrale Differenz für ∂φ/∂x: 2. Ordnung, instabil bei hohem Pe.',
    color: C.amber,
    byDim: {
      '2D': { formula: `\\frac{\\partial \\phi_{i,j}}{\\partial t} + u\\,${tc(C.amber, '\\frac{\\phi_{i+1,j} - \\phi_{i-1,j}}{2\\Delta x}')} + v\\,${tc(C.amber, '\\frac{\\phi_{i,j+1} - \\phi_{i,j-1}}{2\\Delta y}')} = \\Gamma\\,${tc(C.amber, '\\frac{\\phi_{i+1,j} - 2\\phi_{i,j} + \\phi_{i-1,j}}{\\Delta x^2}')} + \\Gamma\\,${tc(C.amber, '\\frac{\\phi_{i,j+1} - 2\\phi_{i,j} + \\phi_{i,j-1}}{\\Delta y^2}')}`, annotation: 'Zentral in x und y. 2. Ordnung in beiden Richtungen.' },
      '3D': { formula: `\\frac{\\partial \\phi_{\\vec{i}}}{\\partial t} + \\sum_k u_k\\,${tc(C.amber, '\\frac{\\phi_{\\vec{i}+e_k} - \\phi_{\\vec{i}-e_k}}{2\\Delta x_k}')} = \\sum_k \\Gamma\\,${tc(C.amber, '\\frac{\\phi_{\\vec{i}+e_k} - 2\\phi_{\\vec{i}} + \\phi_{\\vec{i}-e_k}}{\\Delta x_k^2}')}`, annotation: 'Zentral in jeder Richtung. 2. Ordnung, aber Pe-Limit!' },
      'allg': { formula: `\\frac{\\partial \\phi}{\\partial t} + \\vec{u}\\cdot${tc(C.amber, '\\nabla_h^{c}\\phi')} = \\Gamma\\,${tc(C.amber, '\\nabla_h^2\\phi')}`, annotation: '∇_h^c = zentraler diskreter Gradient.' },
    },
  },
  forward: {
    label: 'In PDE einsetzen (Vorwärts)',
    stepLabel: 'Einsetzen',
    formula: `\\frac{\\partial \\phi_i}{\\partial t} + u\\,${tc(C.amber, '\\frac{\\phi_{i+1} - \\phi_i}{\\Delta x}')} = \\Gamma\\,${tc(C.amber, '\\frac{\\phi_{i+1} - 2\\phi_i + \\phi_{i-1}}{\\Delta x^2}')}`,
    annotation: 'Vorwärts-Differenz: Downwind bei u > 0, oft instabil.',
    color: C.amber,
    byDim: {
      '2D': { formula: `\\frac{\\partial \\phi_{i,j}}{\\partial t} + u\\,${tc(C.amber, '\\frac{\\phi_{i+1,j} - \\phi_{i,j}}{\\Delta x}')} + v\\,${tc(C.amber, '\\frac{\\phi_{i,j+1} - \\phi_{i,j}}{\\Delta y}')} = \\Gamma\\,${tc(C.amber, '\\frac{\\phi_{i+1,j} - 2\\phi_{i,j} + \\phi_{i-1,j}}{\\Delta x^2}')} + \\Gamma\\,${tc(C.amber, '\\frac{\\phi_{i,j+1} - 2\\phi_{i,j} + \\phi_{i,j-1}}{\\Delta y^2}')}`, annotation: 'Vorwärts in x und y. Downwind — oft instabil.' },
      '3D': { formula: `\\frac{\\partial \\phi_{\\vec{i}}}{\\partial t} + \\sum_k u_k\\,${tc(C.amber, '\\frac{\\phi_{\\vec{i}+e_k} - \\phi_{\\vec{i}}}{\\Delta x_k}')} = \\sum_k \\Gamma\\,${tc(C.amber, '\\frac{\\phi_{\\vec{i}+e_k} - 2\\phi_{\\vec{i}} + \\phi_{\\vec{i}-e_k}}{\\Delta x_k^2}')}`, annotation: 'Vorwärts in jeder Richtung. 1. Ordnung, Downwind.' },
      'allg': { formula: `\\frac{\\partial \\phi}{\\partial t} + \\vec{u}\\cdot${tc(C.amber, '\\nabla_h^{+}\\phi')} = \\Gamma\\,${tc(C.amber, '\\nabla_h^2\\phi')}`, annotation: '∇_h^+ = diskreter Vorwärts-Gradient.' },
    },
  },
};

/* ═══════════════════════════════════════════════════════════════════
   SCHEMA / STENCIL STAGES (stage 4) — define φ_f / stencil formally
   ═══════════════════════════════════════════════════════════════════ */

const FVM_SCHEMA: Record<FVMScheme, Stage> = {
  UDS: {
    label: 'Upwind (UDS)',
    stepLabel: 'Schema',
    formula: `${tc(C.rose, '\\phi_f = \\phi_{\\text{upwind}}')} \\;\\Rightarrow\\; \\phi_f = \\begin{cases} \\phi_P & \\dot{m}_f > 0 \\\\ \\phi_E & \\dot{m}_f < 0 \\end{cases}`,
    annotation: '1. Ordnung — stabil, robust, aber numerische Diffusion.',
    color: C.rose,
    derivation: [
      { title: 'Upwind-Prinzip',
        tex: '\\phi_f = \\phi_{\\text{upwind}} = \\begin{cases} \\phi_P & \\dot{m}_f > 0 \\\\ \\phi_E & \\dot{m}_f < 0 \\end{cases}',
        note: 'Wert kommt von „stromaufwärts" — physikalisch sinnvoll.' },
      { title: 'Taylor-Analyse des Fehlers',
        tex: '\\phi_f = \\phi_P + \\underbrace{\\frac{\\Delta x}{2}\\frac{\\partial \\phi}{\\partial x}}_{\\text{num. Diffusion}} + \\mathcal{O}(\\Delta x^2)',
        note: 'Der 1.-Ordnungsfehler wirkt wie ein zusätzlicher Diffusionsterm.' },
      { title: 'Numerische Diffusion',
        tex: '\\Gamma_{\\text{num}} = \\frac{\\rho\\,|u|\\,\\Delta x}{2}',
        note: 'Verschmiert Gradienten — schlecht für scharfe Fronten, gut für Stabilität.' },
    ],
  },
  CDS: {
    label: 'Central (CDS)',
    stepLabel: 'Schema',
    formula: `${tc(C.rose, '\\phi_f = \\frac{\\phi_P + \\phi_E}{2}')} \\quad \\text{(linearer Mittelwert)}`,
    annotation: '2. Ordnung — genau, aber kann bei Pe > 2 oszillieren.',
    color: C.rose,
    derivation: [
      { title: 'Lineare Interpolation',
        tex: '\\phi_f = \\frac{\\phi_P + \\phi_E}{2} + \\mathcal{O}(\\Delta x^2)',
        note: 'Mittelwert der Nachbarn — symmetrisch, 2. Ordnung.' },
      { title: 'Péclet-Zahl',
        tex: 'Pe = \\frac{\\rho\\,u\\,\\Delta x}{\\Gamma}',
        note: 'Verhältnis von Konvektion zu Diffusion.' },
      { title: 'Stabilitätsgrenze',
        tex: 'Pe \\leq 2 \\quad \\text{(sonst Oszillationen!)}',
        note: 'Bei starker Konvektion (großes Pe) → Upwind oder TVD verwenden.' },
    ],
  },
  TVD: {
    label: 'TVD-Schema',
    stepLabel: 'Schema',
    formula: `${tc(C.rose, '\\phi_f = \\phi_P + \\tfrac{1}{2}\\,\\psi(r)\\,(\\phi_E - \\phi_P)')},\\; r = \\frac{\\phi_P - \\phi_W}{\\phi_E - \\phi_P}`,
    annotation: 'Limiter ψ(r) sichert Stabilität + Genauigkeit. r-Definition gilt für ṁ_f > 0; bei ṁ_f < 0 Nachbarn tauschen.',
    color: C.rose,
    derivation: [
      { title: 'Grundidee: Upwind + Korrektur',
        tex: '\\phi_f = \\underbrace{\\phi_P}_{\\text{UDS}} + \\frac{1}{2}\\,\\psi(r)\\,(\\phi_E - \\phi_P)',
        note: 'ψ = 0 → reines Upwind, ψ = 1 → Zentraldifferenz.' },
      { title: 'Gradientenverhältnis r',
        tex: 'r = \\frac{\\phi_P - \\phi_W}{\\phi_E - \\phi_P}',
        note: 'r ≈ 1: glatte Lösung, r < 0: lokales Extremum, r ≫ 1: starker Gradient.' },
      { title: 'Bekannte Limiter',
        tex: '\\psi_{\\text{minmod}} = \\max(0, \\min(1,r)), \\quad \\psi_{\\text{Van Leer}} = \\frac{r + |r|}{1+|r|}',
        note: 'Sweby-Diagramm: alle TVD-Limiter liegen zwischen ψ=0 und ψ=2.' },
      { title: 'TVD-Bedingung',
        tex: 'TV(\\phi^{n+1}) \\leq TV(\\phi^n), \\quad TV = \\sum_i |\\phi_{i+1} - \\phi_i|',
        note: 'Total Variation Diminishing — keine neuen Extrema, keine Oszillationen.' },
    ],
  },
};

const FDM_SCHEMA: Record<FDMScheme, Stage> = {
  backward: {
    label: 'Rückwärts-Differenz',
    stepLabel: 'Stencil',
    formula: `\\frac{\\partial\\phi}{\\partial x}\\bigg|_i \\approx ${tc(C.rose, '\\frac{\\phi_i - \\phi_{i-1}}{\\Delta x}')} + \\mathcal{O}(\\Delta x)`,
    annotation: '1. Ordnung — nutzt φ_i und φ_{i−1}. Wirkt wie Upwind bei u > 0.',
    color: C.rose,
    byDim: {
      '2D': { formula: `\\frac{\\partial\\phi}{\\partial x}\\bigg|_{i,j} \\approx ${tc(C.rose, '\\frac{\\phi_{i,j} - \\phi_{i-1,j}}{\\Delta x}')},\\; \\frac{\\partial\\phi}{\\partial y}\\bigg|_{i,j} \\approx ${tc(C.rose, '\\frac{\\phi_{i,j} - \\phi_{i,j-1}}{\\Delta y}')} + \\mathcal{O}(\\Delta x, \\Delta y)`, annotation: 'Rückwärts-Differenz in x und y: 1. Ordnung in beiden Richtungen.' },
      '3D': { formula: `\\frac{\\partial\\phi}{\\partial x_k}\\bigg|_{\\vec{i}} \\approx ${tc(C.rose, '\\frac{\\phi_{\\vec{i}} - \\phi_{\\vec{i}-e_k}}{\\Delta x_k}')} + \\mathcal{O}(\\Delta x_k),\\; k = 1,2,3`, annotation: 'Rückwärts-Differenz in jeder Raumrichtung (x, y, z).' },
      'allg': { formula: `${tc(C.rose, '\\nabla_h^{-}\\phi')} = \\text{Rückwärts-Differenz},\\quad \\mathcal{O}(\\Delta x)`, annotation: 'Kompakte Notation: ∇_h^− = diskreter Rückwärts-Gradient. 1. Ordnung.' },
    },
  },
  central: {
    label: 'Zentrale Differenz',
    stepLabel: 'Stencil',
    formula: `\\frac{\\partial\\phi}{\\partial x}\\bigg|_i \\approx ${tc(C.rose, '\\frac{\\phi_{i+1} - \\phi_{i-1}}{2\\,\\Delta x}')} + \\mathcal{O}(\\Delta x^2)`,
    annotation: '2. Ordnung — genauer, aber bei starker Konvektion instabil.',
    color: C.rose,
    byDim: {
      '2D': { formula: `\\frac{\\partial\\phi}{\\partial x}\\bigg|_{i,j} \\approx ${tc(C.rose, '\\frac{\\phi_{i+1,j} - \\phi_{i-1,j}}{2\\Delta x}')},\\; \\frac{\\partial\\phi}{\\partial y}\\bigg|_{i,j} \\approx ${tc(C.rose, '\\frac{\\phi_{i,j+1} - \\phi_{i,j-1}}{2\\Delta y}')} + \\mathcal{O}(\\Delta x^2, \\Delta y^2)`, annotation: 'Zentrale Differenz in x und y: 2. Ordnung in beiden Richtungen.' },
      '3D': { formula: `\\frac{\\partial\\phi}{\\partial x_k}\\bigg|_{\\vec{i}} \\approx ${tc(C.rose, '\\frac{\\phi_{\\vec{i}+e_k} - \\phi_{\\vec{i}-e_k}}{2\\Delta x_k}')} + \\mathcal{O}(\\Delta x_k^2),\\; k = 1,2,3`, annotation: 'Zentrale Differenz in jeder Raumrichtung — 2. Ordnung.' },
      'allg': { formula: `${tc(C.rose, '\\nabla_h^{c}\\phi')} = \\text{Zentrale Differenz},\\quad \\mathcal{O}(\\Delta x^2)`, annotation: 'Kompakte Notation: ∇_h^c = zentraler diskreter Gradient. 2. Ordnung.' },
    },
  },
  forward: {
    label: 'Vorwärts-Differenz',
    stepLabel: 'Stencil',
    formula: `\\frac{\\partial\\phi}{\\partial x}\\bigg|_i \\approx ${tc(C.rose, '\\frac{\\phi_{i+1} - \\phi_i}{\\Delta x}')} + \\mathcal{O}(\\Delta x)`,
    annotation: '1. Ordnung — Downwind bei u > 0, oft instabil für Konvektion.',
    color: C.rose,
    byDim: {
      '2D': { formula: `\\frac{\\partial\\phi}{\\partial x}\\bigg|_{i,j} \\approx ${tc(C.rose, '\\frac{\\phi_{i+1,j} - \\phi_{i,j}}{\\Delta x}')},\\; \\frac{\\partial\\phi}{\\partial y}\\bigg|_{i,j} \\approx ${tc(C.rose, '\\frac{\\phi_{i,j+1} - \\phi_{i,j}}{\\Delta y}')} + \\mathcal{O}(\\Delta x, \\Delta y)`, annotation: 'Vorwärts-Differenz in x und y: 1. Ordnung.' },
      '3D': { formula: `\\frac{\\partial\\phi}{\\partial x_k}\\bigg|_{\\vec{i}} \\approx ${tc(C.rose, '\\frac{\\phi_{\\vec{i}+e_k} - \\phi_{\\vec{i}}}{\\Delta x_k}')} + \\mathcal{O}(\\Delta x_k),\\; k = 1,2,3`, annotation: 'Vorwärts-Differenz in jeder Raumrichtung — 1. Ordnung, Downwind.' },
      'allg': { formula: `${tc(C.rose, '\\nabla_h^{+}\\phi')} = \\text{Vorwärts-Differenz},\\quad \\mathcal{O}(\\Delta x)`, annotation: 'Kompakte Notation: ∇_h^+ = diskreter Vorwärts-Gradient. 1. Ordnung, Downwind.' },
    },
  },
};

/* ═══════════════════════════════════════════════════════════════════
   TIME STAGES (stage 5) — depend on method + timeKey
   Schema already chosen → φ_f / stencil is defined.
   ═══════════════════════════════════════════════════════════════════ */

const FVM_TIME: Record<TimeKey, Stage> = {
  'euler-exp': {
    label: 'Euler explizit',
    stepLabel: 'Zeit',
    formula: `\\rho_P V_P ${tc(C.emerald, '\\frac{\\phi_P^{n+1} - \\phi_P^{\\,n}}{\\Delta t}')} + \\sum_f \\dot{m}_f\\,\\phi_f${tc(C.emerald, '^{\\,n}')} = \\sum_f \\Gamma_f A_f\\,(\\nabla\\phi\\!\\cdot\\!\\vec{n})_f${tc(C.emerald, '^{\\,n}')} + S_{\\phi,P}V_P`,
    annotation: 'Räumliche Terme zum bekannten Zeitschritt n. CFL: Δt ≤ Δx/u.',
    color: C.emerald,
    byDim: {
      '1D': { formula: `\\rho_P \\Delta x ${tc(C.emerald, '\\frac{\\phi_P^{n+1} - \\phi_P^{\\,n}}{\\Delta t}')} + \\dot{m}_e\\,\\phi_e${tc(C.emerald, '^{\\,n}')} - \\dot{m}_w\\,\\phi_w${tc(C.emerald, '^{\\,n}')} = \\Gamma_e\\frac{\\phi_E^n - \\phi_P^n}{\\delta x} - \\Gamma_w\\frac{\\phi_P^n - \\phi_W^n}{\\delta x} + S_{\\phi,P}\\Delta x`, annotation: '1D: 2 Faces (e, w). CFL: Δt ≤ Δx/u.' },
      '2D': { annotation: '2D: Σ_f über 4 Faces (e, w, n, s). CFL: Δt ≤ min(Δx/u, Δy/v).' },
      '3D': { annotation: '3D: Σ_f über 6 Faces. CFL: Δt ≤ min(Δx_k/u_k).' },
    },
    derivation: [
      { title: 'Zeitableitung → Vorwärts-Differenz',
        tex: '\\frac{\\partial \\phi}{\\partial t} \\approx \\frac{\\phi^{n+1} - \\phi^n}{\\Delta t} + \\mathcal{O}(\\Delta t)',
        note: '1. Ordnung in der Zeit.' },
      { title: 'Explizit: alles bei n auswerten',
        tex: '\\phi^{n+1} = \\phi^n + \\Delta t \\cdot F(\\phi^n)',
        note: 'F = rechte Seite (Flüsse, Diffusion, Quelle). Kein LGS nötig!' },
      { title: 'CFL-Bedingung',
        tex: 'c = \\frac{u\\,\\Delta t}{\\Delta x} \\leq 1',
        note: 'Information darf pro Zeitschritt maximal eine Zelle wandern.' },
    ],
  },
  'euler-imp': {
    label: 'Euler implizit',
    stepLabel: 'Zeit',
    formula: `\\rho_P V_P ${tc(C.emerald, '\\frac{\\phi_P^{n+1} - \\phi_P^{\\,n}}{\\Delta t}')} + \\sum_f \\dot{m}_f\\,\\phi_f${tc(C.emerald, '^{n+1}')} = \\sum_f \\Gamma_f A_f\\,(\\nabla\\phi\\!\\cdot\\!\\vec{n})_f${tc(C.emerald, '^{n+1}')} + S_{\\phi,P}V_P`,
    annotation: 'Räumliche Terme zum unbekannten n+1 → immer stabil, braucht aber LGS.',
    color: C.emerald,
    byDim: {
      '1D': { formula: `\\rho_P \\Delta x ${tc(C.emerald, '\\frac{\\phi_P^{n+1} - \\phi_P^{\\,n}}{\\Delta t}')} + \\dot{m}_e\\,\\phi_e${tc(C.emerald, '^{n+1}')} - \\dot{m}_w\\,\\phi_w${tc(C.emerald, '^{n+1}')} = \\Gamma_e\\frac{\\phi_E^{n+1} - \\phi_P^{n+1}}{\\delta x} - \\Gamma_w\\frac{\\phi_P^{n+1} - \\phi_W^{n+1}}{\\delta x} + S_{\\phi,P}\\Delta x`, annotation: '1D: 2 Faces. Alle räumlichen Terme bei n+1 → tridiagonales LGS.' },
      '2D': { annotation: '2D: 4 Faces bei n+1 → pentadiagonales LGS. Immer stabil.' },
      '3D': { annotation: '3D: 6 Faces bei n+1 → 7-Band-LGS. Immer stabil.' },
    },
    derivation: [
      { title: 'Implizite Zeitdiskretisierung',
        tex: '\\frac{\\phi^{n+1} - \\phi^n}{\\Delta t} = F(\\phi^{n+1})',
        note: 'Rechte Seite wird zum NEUEN Zeitpunkt ausgewertet → unbekannt.' },
      { title: 'Umstellen → LGS',
        tex: '\\phi^{n+1} - \\Delta t \\cdot F(\\phi^{n+1}) = \\phi^n',
        note: 'φ^{n+1} steckt auf beiden Seiten → lineares Gleichungssystem.' },
      { title: 'Stabilität',
        tex: '\\text{Unbedingt stabil (A-stabil) für alle } \\Delta t',
        note: 'Kein CFL-Limit! Aber pro Zeitschritt muss ein LGS gelöst werden.' },
    ],
  },
  'crank-nic': {
    label: 'Crank-Nicolson',
    stepLabel: 'Zeit',
    formula: `\\frac{\\rho_P V_P(\\phi_P^{n+1} - \\phi_P^{\\,n})}{\\Delta t} + ${tc(C.emerald, '\\tfrac{1}{2}\\Big(R(\\phi^{n+1}) + R(\\phi^{\\,n})\\Big)')} = 0`,
    annotation: 'R = Σ ṁ_f φ_f − Σ Γ_f A_f (∇φ·n⃗)_f − S_φ V_P. Mittelwert → 2. Ordnung in t.',
    color: C.emerald,
    byDim: {
      '1D': { annotation: '1D: R hat nur 2 Face-Terme. Mittelwert aus n und n+1.' },
      '2D': { annotation: '2D: R mit 4 Faces (e,w,n,s). Trapezregel → 2. Ordnung.' },
      '3D': { annotation: '3D: R mit 6 Faces. 2. Ordnung in t, aber nicht L-stabil.' },
    },
    derivation: [
      { title: 'Trapezregel in der Zeit',
        tex: '\\int_{t^n}^{t^{n+1}} F(\\phi)\\,dt \\approx \\frac{\\Delta t}{2}\\bigl[F(\\phi^n) + F(\\phi^{n+1})\\bigr]',
        note: '2. Ordnung in Δt — Mittelwert aus explizit und implizit.' },
      { title: 'Crank-Nicolson Formel',
        tex: '\\frac{\\phi^{n+1} - \\phi^n}{\\Delta t} = \\frac{1}{2}\\bigl[F(\\phi^n) + F(\\phi^{n+1})\\bigr]',
        note: 'Kombiniert Genauigkeit (2. Ordnung) mit Stabilität (A-stabil).' },
      { title: 'Nachteil',
        tex: '\\text{Kann bei großem } \\Delta t \\text{ oszillieren (nicht L-stabil)}',
        note: 'Euler implizit dämpft besser, CN ist genauer. Trade-off.' },
    ],
  },
};

const FDM_TIME: Record<TimeKey, Stage> = {
  'euler-exp': {
    label: 'Euler explizit',
    stepLabel: 'Zeit',
    formula: `${tc(C.emerald, '\\frac{\\phi_i^{n+1} - \\phi_i^{\\,n}}{\\Delta t}')} = L\\!\\left(\\phi${tc(C.emerald, '^{\\,n}')}\\right)`,
    annotation: 'L(φ) = −u·(D_x φ)_i + Γ·(D_xx φ)_i mit gewähltem Stencil. CFL beachten!',
    color: C.emerald,
    byDim: {
      '2D': { annotation: 'L(φ) = −u·D_x φ − v·D_y φ + Γ·(D_xx + D_yy)φ. 2D-CFL beachten!' },
      '3D': { annotation: 'L(φ) = −Σ u_k D_k φ + Γ·Σ D_kk φ. 3D-CFL: Δt ≤ min(Δx_k/u_k).' },
      'allg': { annotation: 'L(φ) = −u⃗·∇_h φ + Γ∇²_h φ. CFL in jeder Richtung prüfen!' },
    },
  },
  'euler-imp': {
    label: 'Euler implizit',
    stepLabel: 'Zeit',
    formula: `${tc(C.emerald, '\\frac{\\phi_i^{n+1} - \\phi_i^{\\,n}}{\\Delta t}')} = L\\!\\left(\\phi${tc(C.emerald, '^{n+1}')}\\right)`,
    annotation: 'Räumlicher Operator zum unbekannten n+1 → unbedingt stabil, LGS nötig.',
    color: C.emerald,
    byDim: {
      '2D': { formula: `${tc(C.emerald, '\\frac{\\phi_{i,j}^{n+1} - \\phi_{i,j}^{\\,n}}{\\Delta t}')} = L\\!\\left(\\phi${tc(C.emerald, '^{n+1}')}\\right)`, annotation: 'L(φ^{n+1}) in 2D → 5-Punkt-LGS pro Zeitschritt. Unbedingt stabil.' },
      '3D': { formula: `${tc(C.emerald, '\\frac{\\phi_{\\vec{i}}^{n+1} - \\phi_{\\vec{i}}^{\\,n}}{\\Delta t}')} = L\\!\\left(\\phi${tc(C.emerald, '^{n+1}')}\\right)`, annotation: 'L(φ^{n+1}) in 3D → 7-Punkt-LGS pro Zeitschritt. Unbedingt stabil.' },
      'allg': { annotation: 'L(φ^{n+1}) → LGS. Unbedingt stabil für jede Dimension.' },
    },
  },
  'crank-nic': {
    label: 'Crank-Nicolson',
    stepLabel: 'Zeit',
    formula: `\\frac{\\phi_i^{n+1} - \\phi_i^{\\,n}}{\\Delta t} = ${tc(C.emerald, '\\tfrac{1}{2}\\bigl[L(\\phi^{\\,n}) + L(\\phi^{n+1})\\bigr]')}`,
    annotation: 'L = räumlicher Operator (Stencil bereits gewählt). Mittelwert → 2. Ordnung in t.',
    color: C.emerald,
    byDim: {
      '2D': { formula: `\\frac{\\phi_{i,j}^{n+1} - \\phi_{i,j}^{\\,n}}{\\Delta t} = ${tc(C.emerald, '\\tfrac{1}{2}\\bigl[L(\\phi^{\\,n}) + L(\\phi^{n+1})\\bigr]')}`, annotation: 'L = 2D-Operator. Trapezregel → 2. Ordnung in t.' },
      '3D': { formula: `\\frac{\\phi_{\\vec{i}}^{n+1} - \\phi_{\\vec{i}}^{\\,n}}{\\Delta t} = ${tc(C.emerald, '\\tfrac{1}{2}\\bigl[L(\\phi^{\\,n}) + L(\\phi^{n+1})\\bigr]')}`, annotation: 'L = 3D-Operator. Crank-Nicolson in jeder Raumrichtung.' },
      'allg': { annotation: 'L = allgemeiner räumlicher Operator. Trapezregel → 2. Ordnung in t, A-stabil.' },
    },
  },
};

/* ═══════════════════════════════════════════════════════════════════
   LATE STAGES (6-7) — depend on method + explicit vs implicit
   ═══════════════════════════════════════════════════════════════════ */

const FVM_LATE_EXP: Stage[] = [
  {
    label: 'Explizites Update',
    stepLabel: 'Update',
    formula: `${tc(C.sky, '\\phi_P^{n+1}')} = \\phi_P^n + \\frac{\\Delta t}{\\rho_P V_P}\\!\\left[\\sum_f \\Gamma_f A_f \\frac{\\phi_E^n - \\phi_P^n}{d_{PE}} - \\sum_f \\dot{m}_f\\,\\phi_f^n + S_{\\phi,P}V_P\\right]`,
    annotation: 'Direkt berechenbar — kein Gleichungssystem nötig.',
    color: C.sky,
    byDim: {
      '1D': { formula: `${tc(C.sky, '\\phi_P^{n+1}')} = \\phi_P^n + \\frac{\\Delta t}{\\rho_P \\Delta x}\\!\\left[\\Gamma_e\\frac{\\phi_E^n - \\phi_P^n}{\\delta x} - \\Gamma_w\\frac{\\phi_P^n - \\phi_W^n}{\\delta x} - \\dot{m}_e\\phi_e^n + \\dot{m}_w\\phi_w^n + S_{\\phi,P}\\Delta x\\right]`, annotation: '1D: 2 Faces (e, w). Direkt berechenbar.' },
      '2D': { formula: `${tc(C.sky, '\\phi_P^{n+1}')} = \\phi_P^n + \\frac{\\Delta t}{\\rho_P V_P}\\!\\left[\\sum_{f \\in \\{e,w,n,s\\}} \\Gamma_f A_f \\frac{\\phi_\\text{nb}^n - \\phi_P^n}{d} - \\sum_{f \\in \\{e,w,n,s\\}} \\dot{m}_f\\,\\phi_f^n + S_{\\phi,P}V_P\\right]`, annotation: '2D: 4 Faces (e, w, n, s). Direkt berechenbar.' },
      '3D': { formula: `${tc(C.sky, '\\phi_P^{n+1}')} = \\phi_P^n + \\frac{\\Delta t}{\\rho_P V_P}\\!\\left[\\sum_{f \\in \\{e,w,n,s,t,b\\}} \\Gamma_f A_f \\frac{\\phi_\\text{nb}^n - \\phi_P^n}{d} - \\sum_{f} \\dot{m}_f\\,\\phi_f^n + S_{\\phi,P}V_P\\right]`, annotation: '3D: 6 Faces. Direkt berechenbar.' },
    },
  },
  {
    label: 'Matrix-Vektor-Produkt',
    stepLabel: 'Berechnen',
    formula: `${tc(C.orange, '\\vec{\\phi}^{\\,n+1}')} = ${tc(C.orange, '\\mathbf{C}')}\\,\\vec{\\phi}^{\\,n} + \\vec{d} \\quad \\text{(kein Löser nötig!)}`,
    annotation: 'Alle Zellen parallel update-bar. Schnell, aber Δt muss klein bleiben.',
    color: C.orange,
  },
];

const FVM_LATE_IMP: Stage[] = [
  {
    label: 'Koeffizienten sammeln',
    stepLabel: 'Koeffizienten',
    formula: `${tc(C.sky, 'a_P')}\\,\\phi_P^{n+1} = ${tc(C.sky, 'a_W')}\\,\\phi_W^{n+1} + ${tc(C.sky, 'a_E')}\\,\\phi_E^{n+1} + ${tc(C.sky, 'b_P')}`,
    annotation: 'Unbekannte auf beiden Seiten → gekoppeltes LGS. b_P enthält Quelle + Zeitterm.',
    color: C.sky,
    byDim: {
      '2D': { formula: `${tc(C.sky, 'a_P')}\\,\\phi_P^{n+1} = ${tc(C.sky, 'a_W')}\\,\\phi_W^{n+1} + ${tc(C.sky, 'a_E')}\\,\\phi_E^{n+1} + ${tc(C.sky, 'a_S')}\\,\\phi_S^{n+1} + ${tc(C.sky, 'a_N')}\\,\\phi_N^{n+1} + ${tc(C.sky, 'b_P')}`, annotation: '5-Punkt-Stern: P, W, E, S, N. Pentadiagonales LGS.' },
      '3D': { formula: `${tc(C.sky, 'a_P')}\\,\\phi_P^{n+1} = ${tc(C.sky, '\\sum_{\\text{nb}}')} a_{\\text{nb}}\\,\\phi_{\\text{nb}}^{n+1} + ${tc(C.sky, 'b_P')},\\quad \\text{nb} \\in \\{W,E,S,N,B,T\\}`, annotation: '7-Punkt-Stern: P, W, E, S, N, B, T.' },
      'allg': { formula: `${tc(C.sky, 'a_P')}\\,\\phi_P^{n+1} = ${tc(C.sky, '\\sum_{\\text{nb}}')} a_{\\text{nb}}\\,\\phi_{\\text{nb}}^{n+1} + ${tc(C.sky, 'b_P')}`, annotation: 'Summe über alle Nachbarzellen nb. Dünnbesetzte Matrix.' },
    },
  },
  {
    label: 'Gleichungssystem lösen',
    stepLabel: 'Lösen!',
    formula: `${tc(C.orange, '\\mathbf{A}')}\\vec{\\phi}^{n+1} \\!= \\vec{b} \\;\\Rightarrow\\; ${tc(C.orange, '\\begin{bmatrix} a_P & a_E & 0 \\\\ a_W & a_P & a_E \\\\ 0 & a_W & a_P \\end{bmatrix}')} \\begin{bmatrix} \\phi_1 \\\\ \\phi_2 \\\\ \\phi_3 \\end{bmatrix}^{\\!n+1} \\!\\!= \\begin{bmatrix} b_1 \\\\ b_2 \\\\ b_3 \\end{bmatrix}`,
    annotation: 'Tridiagonale Matrix → TDMA / iterativer Löser.',
    color: C.orange,
    byDim: {
      '2D': { annotation: 'Pentadiagonale Matrix (Bandbreite N) → iterativer Löser (Gauß-Seidel, SOR).' },
      '3D': { annotation: '7-Band-Matrix → GMRES, BiCGStab oder Multigrid.' },
      'allg': { annotation: 'Dünnbesetzte Matrix A — iterativer Löser nötig.' },
    },
  },
];

const FDM_LATE_EXP: Stage[] = [
  {
    label: 'Explizites Update',
    stepLabel: 'Update',
    formula: `${tc(C.sky, '\\phi_i^{n+1}')} = ${tc(C.sky, 'c_W')}\\,\\phi_{i-1}^n + ${tc(C.sky, 'c_P')}\\,\\phi_i^n + ${tc(C.sky, 'c_E')}\\,\\phi_{i+1}^n`,
    annotation: 'Direkt berechenbar: gewichteter Durchschnitt der Nachbarn.',
    color: C.sky,
    byDim: {
      '2D': { formula: `${tc(C.sky, '\\phi_{i,j}^{n+1}')} = ${tc(C.sky, 'c_W')}\\,\\phi_{i-1,j}^n + ${tc(C.sky, 'c_E')}\\,\\phi_{i+1,j}^n + ${tc(C.sky, 'c_S')}\\,\\phi_{i,j-1}^n + ${tc(C.sky, 'c_N')}\\,\\phi_{i,j+1}^n + ${tc(C.sky, 'c_P')}\\,\\phi_{i,j}^n`, annotation: '5-Punkt-Update: (i±1,j) und (i,j±1).' },
      '3D': { formula: `${tc(C.sky, '\\phi_{\\vec{i}}^{n+1}')} = ${tc(C.sky, '\\sum_{\\text{nb}}')} c_{\\text{nb}}\\,\\phi_{\\text{nb}}^n + ${tc(C.sky, 'c_P')}\\,\\phi_{\\vec{i}}^n`, annotation: '7-Punkt-Update: Nachbarn in jeder Richtung.' },
      'allg': { annotation: 'Gewichteter Durchschnitt aller Gitter-Nachbarn.' },
    },
  },
  {
    label: 'Matrix-Vektor-Produkt',
    stepLabel: 'Berechnen',
    formula: `${tc(C.orange, '\\vec{\\phi}^{\\,n+1}')} = ${tc(C.orange, '\\mathbf{C}')}\\,\\vec{\\phi}^{\\,n} \\;\\Rightarrow\\; ${tc(C.orange, '\\begin{bmatrix} \\phi_1 \\\\ \\phi_2 \\\\ \\phi_3 \\end{bmatrix}^{\\!n+1}')} \\!= ${tc(C.orange, '\\begin{bmatrix} c_P & c_E & 0 \\\\ c_W & c_P & c_E \\\\ 0 & c_W & c_P \\end{bmatrix}')} \\begin{bmatrix} \\phi_1 \\\\ \\phi_2 \\\\ \\phi_3 \\end{bmatrix}^{\\!n}`,
    annotation: 'Nur Multiplikation — schnell, aber CFL-Bedingung!',
    color: C.orange,
    byDim: {
      '2D': { annotation: 'C ist dünnbesetzt (5-Band). Schnell, aber 2D-CFL beachten!' },
      '3D': { annotation: 'C ist dünnbesetzt (7-Band). 3D-CFL: Σ u_k Δt/Δx_k ≤ 1.' },
      'allg': { annotation: 'Matrix-Vektor-Produkt — CFL in jeder Richtung!' },
    },
  },
];

const FDM_LATE_IMP: Stage[] = [
  {
    label: 'Koeffizienten sammeln',
    stepLabel: 'Koeffizienten',
    formula: `${tc(C.sky, 'a_P')}\\,\\phi_i^{n+1} = ${tc(C.sky, 'a_W')}\\,\\phi_{i-1}^{n+1} + ${tc(C.sky, 'a_E')}\\,\\phi_{i+1}^{n+1} + ${tc(C.sky, 'b_i')}`,
    annotation: 'Unbekannte auf beiden Seiten → LGS nötig.',
    color: C.sky,
    byDim: {
      '2D': { formula: `${tc(C.sky, 'a_P')}\\,\\phi_{i,j}^{n+1} = ${tc(C.sky, 'a_W')}\\,\\phi_{i-1,j}^{n+1} + ${tc(C.sky, 'a_E')}\\,\\phi_{i+1,j}^{n+1} + ${tc(C.sky, 'a_S')}\\,\\phi_{i,j-1}^{n+1} + ${tc(C.sky, 'a_N')}\\,\\phi_{i,j+1}^{n+1} + ${tc(C.sky, 'b_{i,j}')}`, annotation: '5-Punkt-Stern: i±1, j±1. Pentadiagonales LGS.' },
      '3D': { formula: `${tc(C.sky, 'a_P')}\\,\\phi_{\\vec{i}}^{n+1} = ${tc(C.sky, '\\sum_{\\text{nb}}')} a_{\\text{nb}}\\,\\phi_{\\text{nb}}^{n+1} + ${tc(C.sky, 'b_{\\vec{i}}')}`, annotation: '7-Punkt-Stern. Dünnbesetztes LGS.' },
      'allg': { annotation: 'Summe über alle Gitter-Nachbarn. Dünnbesetzte Matrix.' },
    },
  },
  {
    label: 'Gleichungssystem lösen',
    stepLabel: 'Lösen!',
    formula: `${tc(C.orange, '\\mathbf{A}')}\\vec{\\phi}^{n+1} \\!= \\vec{b} \\;\\Rightarrow\\; ${tc(C.orange, '\\begin{bmatrix} a_P & a_E & 0 \\\\ a_W & a_P & a_E \\\\ 0 & a_W & a_P \\end{bmatrix}')} \\begin{bmatrix} \\phi_1 \\\\ \\phi_2 \\\\ \\phi_3 \\end{bmatrix}^{\\!n+1} \\!\\!= \\begin{bmatrix} b_1 \\\\ b_2 \\\\ b_3 \\end{bmatrix}`,
    annotation: 'Tridiagonal → effizient lösbar mit TDMA.',
    color: C.orange,
    byDim: {
      '2D': { annotation: 'Pentadiagonale Matrix — iterativer Löser (Gauß-Seidel, SOR, ADI).' },
      '3D': { annotation: '7-Band-Matrix → GMRES, BiCGStab oder Multigrid.' },
      'allg': { annotation: 'Dünnbesetzte Matrix A — Bandstruktur hängt von Gitter-Topologie ab.' },
    },
  },
];

/* ── Build stage list from selections ──────────────────────────── */

function buildStages(
  method: MethodKey,
  time: TimeKey,
  fvmScheme: FVMScheme,
  fdmScheme: FDMScheme,
): Stage[] {
  const isExplicit = time === 'euler-exp';

  if (method === 'FVM') {
    const schemaStage = FVM_SCHEMA[fvmScheme];
    const timeStage = FVM_TIME[time];
    const late = isExplicit ? FVM_LATE_EXP : FVM_LATE_IMP;
    return [...FVM_EARLY, schemaStage, timeStage, ...late];
  } else {
    const einsetzen = FDM_EINSETZEN[fdmScheme];
    const schemaStage = FDM_SCHEMA[fdmScheme];
    const timeStage = FDM_TIME[time];
    const late = isExplicit ? FDM_LATE_EXP : FDM_LATE_IMP;
    return [...FDM_EARLY_FIXED, schemaStage, einsetzen, timeStage, ...late];
  }
}

/* ── Toggle option descriptors ─────────────────────────────────── */

const TIME_OPTS: { key: TimeKey; label: string }[] = [
  { key: 'euler-exp', label: 'Euler expl.' },
  { key: 'euler-imp', label: 'Euler impl.' },
  { key: 'crank-nic', label: 'Crank-Nic.' },
];
const FVM_SCHEME_OPTS: { key: FVMScheme; label: string }[] = [
  { key: 'UDS', label: 'UDS' },
  { key: 'CDS', label: 'CDS' },
  { key: 'TVD', label: 'TVD' },
];
const FDM_SCHEME_OPTS: { key: FDMScheme; label: string }[] = [
  { key: 'backward', label: 'Rückwärts' },
  { key: 'central', label: 'Zentral' },
  { key: 'forward', label: 'Vorwärts' },
];

/* ── KaTeX block renderer with auto-fit scaling ───────────────── */

/* ── Animation styles (injected once) ─────────────────────────── */
const ANIM_STYLES = `
@keyframes fjPartIn {
  0%   { opacity: 0; }
  50%  { opacity: 1; text-shadow: 0 0 10px, 0 0 3px; }
  100% { opacity: 1; text-shadow: none; }
}
@keyframes fjFormulaIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@keyframes fjStepFlash {
  0%   { opacity: 0; transform: translateY(4px); }
  20%  { opacity: 1; transform: translateY(0); }
  80%  { opacity: 1; transform: translateY(0); }
  100% { opacity: 0; transform: translateY(-4px); }
}
.fj-new {
  animation: fjPartIn 0.6s ease-out 0.15s both;
}
.fj-formula-enter {
  animation: fjFormulaIn 0.25s ease-out both;
}
.fj-step-flash {
  animation: fjStepFlash 1.2s ease-out both;
}
`;

function AnimStyles() {
  const injected = useRef(false);
  useEffect(() => {
    if (injected.current) return;
    injected.current = true;
    const s = document.createElement('style');
    s.textContent = ANIM_STYLES;
    document.head.appendChild(s);
    return () => { s.remove(); };
  }, []);
  return null;
}

function KaTeXBlock({ tex, animKey }: { tex: string; animKey: string }) {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!innerRef.current) return;
    try {
      katex.render(tex, innerRef.current, {
        displayMode: true,
        throwOnError: false,
        trust: true,
      });
    } catch { /* ignore */ }

    requestAnimationFrame(() => {
      const outer = outerRef.current;
      const inner = innerRef.current;
      if (!outer || !inner) return;
      const katexEl = inner.querySelector('.katex-display') as HTMLElement;
      if (!katexEl) return;
      const contentW = katexEl.scrollWidth;
      const containerW = outer.clientWidth;
      if (contentW > containerW && contentW > 0) {
        const scale = Math.max(0.4, containerW / contentW);
        katexEl.style.transform = `scale(${scale})`;
        katexEl.style.transformOrigin = 'center center';
      } else {
        katexEl.style.transform = '';
      }
    });
  }, [tex, animKey]);

  return (
    <div ref={outerRef} className="w-full overflow-hidden">
      <div key={animKey} ref={innerRef} className="fj-formula-enter" />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════ */

export default function FormulaJourney({ scrollProgress }: { scrollProgress: number }) {
  const [method, setMethod] = useState<MethodKey>('FVM');
  const [time, setTime] = useState<TimeKey>('euler-exp');
  const [fvmScheme, setFvmScheme] = useState<FVMScheme>('UDS');
  const [fdmScheme, setFdmScheme] = useState<FDMScheme>('backward');
  const [dim, setDim] = useState<DimKey>('allg');

  const stages = useMemo(
    () => buildStages(method, time, fvmScheme, fdmScheme),
    [method, time, fvmScheme, fdmScheme],
  );
  const TOTAL = stages.length;

  const clampedProgress = Math.max(0, Math.min(1, scrollProgress));
  const rawIndex = clampedProgress * (TOTAL - 1);
  const activeIndex = Math.max(0, Math.min(Math.round(rawIndex), TOTAL - 1));
  const stage = stages[activeIndex];

  /* Animation key — changes on every stage/option switch */
  const animKey = `${method}-${time}-${fvmScheme}-${fdmScheme}-${dim}-${activeIndex}`;

  /* Brief step-label flash during transitions */
  const [stepFlash, setStepFlash] = useState<string | null>(null);
  const prevAnimKey = useRef(animKey);
  useEffect(() => {
    if (animKey !== prevAnimKey.current) {
      setStepFlash(stage.stepLabel);
      const t = setTimeout(() => setStepFlash(null), 1200);
      prevAnimKey.current = animKey;
      return () => clearTimeout(t);
    }
  }, [animKey, stage.stepLabel]);

  /* Derivation overlay */
  const [showDeriv, setShowDeriv] = useState(false);
  // Close derivation when stage changes
  useEffect(() => { setShowDeriv(false); }, [activeIndex]);

  const shown = stage;
  const shownFormula = shown.byDim?.[dim]?.formula ?? shown.formula;
  const shownAnnotation = shown.byDim?.[dim]?.annotation ?? shown.annotation;

  /* Which sub-toggles to show — only when they change the current formula */
  const schemeStart = method === 'FVM' ? 4 : 3;
  const schemeEnd   = 5;   // hide at time-integration & later
  const showScheme  = activeIndex >= schemeStart && activeIndex < schemeEnd;
  const showTime    = activeIndex >= (method === 'FVM' ? 5 : 4);
  const schemeOpts = method === 'FVM' ? FVM_SCHEME_OPTS : FDM_SCHEME_OPTS;
  const activeScheme = method === 'FVM' ? fvmScheme : fdmScheme;
  const setScheme = (k: string) =>
    method === 'FVM'
      ? setFvmScheme(k as FVMScheme)
      : setFdmScheme(k as FDMScheme);

  return (
    <div className="h-full relative select-none">
      <AnimStyles />

      {/* ── Dimension toggle — top (hidden when stage has no dim variants) ── */}
      <div
        className={`absolute inset-x-0 flex justify-center pointer-events-auto transition-all duration-300 ${
          shown.byDim ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        style={{ top: '8%' }}
      >
        <div className="flex gap-0.5 bg-gray-900/80 rounded-md p-0.5">
          {(['1D', '2D', '3D', 'allg'] as DimKey[]).map((d) => (
            <button
              key={d}
              onClick={() => setDim(d)}
              className={`px-2 py-0.5 rounded text-[10px] font-medium transition-all duration-200 ${
                dim === d
                  ? 'bg-gray-700 text-gray-200 shadow-sm'
                  : 'text-gray-600 hover:text-gray-400'
              }`}
            >
              {d === 'allg' ? 'Allg.' : d}
            </button>
          ))}
        </div>
      </div>

      {/* ── Step indicator dots — fixed at top ────────────── */}
      <div className="absolute inset-x-0 flex justify-center" style={{ top: '15%' }}>
        <div className="flex items-center gap-1.5">
          {stages.map((s, i) => (
            <div
              key={i}
              className={`rounded-full transition-all duration-300 ${
                i === activeIndex
                  ? 'w-2 h-2'
                  : i < activeIndex
                    ? 'w-1.5 h-1.5 opacity-50'
                    : 'w-1.5 h-1.5 opacity-20'
              }`}
              style={{ backgroundColor: i <= activeIndex ? s.color : '#334155' }}
              title={s.stepLabel}
            />
          ))}
        </div>
      </div>

      {/* ── Step counter + label — fixed ──────────────────── */}
      <div className="absolute inset-x-0 flex flex-col items-center" style={{ top: '20%' }}>
        <div
          className="text-[10px] uppercase tracking-[0.15em] font-semibold mb-0.5 transition-colors duration-300"
          style={{ color: stage.color }}
        >
          {activeIndex + 1}/{TOTAL}
        </div>
        <div className="text-[13px] font-medium text-gray-300 text-center">
          {stage.label}
        </div>
      </div>

      {/* ── Step flash (brief label during transition) ─── */}
      {stepFlash && (
        <div className="absolute inset-x-0 flex justify-center" style={{ top: '30%' }}>
          <span className="fj-step-flash text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-800/80 border border-gray-700/50"
                style={{ color: stage.color }}>
            → {stepFlash}
          </span>
        </div>
      )}

      {/* ── The morphing formula — fixed center ──────────── */}
      <div className="absolute inset-x-0 flex flex-col items-center px-3" style={{ top: '38%', transform: 'translateY(-50%)' }}>
        <div className="w-full overflow-x-auto overflow-y-hidden" style={{ scrollbarWidth: 'none' }}>
          <div className="flex justify-center" style={{ fontSize: '1.1em' }}>
            <KaTeXBlock tex={shownFormula} animKey={animKey} />
          </div>
        </div>
      </div>

      {/* ── Annotation — fixed below formula ─────────────── */}
      <div className="absolute inset-x-0 flex flex-col items-center px-4" style={{ top: '53%' }}>
        <div
          className="text-[13px] text-gray-500 text-center max-w-[85%] leading-relaxed fj-formula-enter"
          key={`ann-${animKey}`}
        >
          {shownAnnotation}
        </div>
        {/* Herleitung button */}
        {shown.derivation && (
          <button
            onClick={() => setShowDeriv(d => !d)}
            className={`mt-1.5 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium transition-all duration-200 pointer-events-auto border ${
              showDeriv
                ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/40'
                : 'bg-gray-900/60 text-gray-500 border-gray-700/50 hover:text-gray-300 hover:border-gray-600'
            }`}
          >
            <svg width="10" height="10" viewBox="0 0 16 16" fill="none" className={`transition-transform duration-200 ${showDeriv ? 'rotate-90' : ''}`}>
              <path d="M5 3l6 5-6 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Herleitung
          </button>
        )}

      </div>

      {/* ── Scroll / complete hint — centered on full page ── */}
      <div className="fixed left-1/2 -translate-x-1/2 z-20 pointer-events-none" style={{ top: '55vh' }}>
        {activeIndex < TOTAL - 1 ? (
          <div className="text-[13px] text-gray-600 opacity-70 animate-pulse">↓ scrollen</div>
        ) : (
          <div className="flex items-center gap-1.5 text-[13px] text-orange-400/80">
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
              <path d="M3 8.5l3 3 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Diskretisierung komplett
          </div>
        )}
      </div>

      {/* ── Derivation overlay ────────────────────────────── */}
      {showDeriv && shown.derivation && (
        <div
          className="absolute inset-x-2 z-10 bg-gray-950/95 backdrop-blur-md border border-gray-700/50 rounded-xl shadow-2xl overflow-y-auto pointer-events-auto"
          style={{ top: '62%', bottom: '6%' }}
        >
          <div className="p-3 space-y-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wider">Herleitung</span>
              <button onClick={() => setShowDeriv(false)} className="text-gray-600 hover:text-gray-400 text-xs">✕</button>
            </div>
            {shown.derivation.map((ds: DerivStep, di: number) => (
              <div key={di} className="fj-formula-enter" style={{ animationDelay: `${di * 80}ms` }}>
                <div className="flex items-start gap-2 mb-1">
                  <span className="text-[9px] font-bold text-indigo-400/70 bg-indigo-500/10 rounded-full w-4 h-4 flex items-center justify-center shrink-0 mt-0.5">
                    {di + 1}
                  </span>
                  <span className="text-[11px] font-medium text-gray-300">{ds.title}</span>
                </div>
                <div className="ml-6 mb-1" style={{ fontSize: '0.95em' }}>
                  <KaTeXBlock tex={ds.tex} animKey={`deriv-${activeIndex}-${di}`} />
                </div>
                {ds.note && (
                  <p className="ml-6 text-[10px] text-gray-600 leading-relaxed">{ds.note}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══ Toggles — fixed position below annotation ═══ */}
      <div className="absolute inset-x-0 flex flex-col items-center gap-2 pointer-events-auto" style={{ top: '68%' }}>
        {/* ── Schema / Stencil toggle ─────────────────────── */}
        <div
          className={`transition-all duration-300 overflow-hidden ${
            showScheme ? 'opacity-100 max-h-20' : 'opacity-0 max-h-0 pointer-events-none'
          }`}
        >
          <div className="text-[9px] text-gray-700 text-center mb-0.5 tracking-wide">
            {method === 'FVM' ? 'Konvektionsschema' : 'FD-Stencil'}
          </div>
          <div className="flex gap-0.5 bg-gray-900/80 rounded-md p-0.5">
            {schemeOpts.map((o) => (
              <button
                key={o.key}
                onClick={() => setScheme(o.key)}
                className={`px-2 py-0.5 rounded text-[10px] font-medium transition-all duration-200 ${
                  activeScheme === o.key
                    ? 'bg-rose-500/20 text-rose-400'
                    : 'text-gray-600 hover:text-gray-400 hover:bg-gray-800/60'
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Time integration toggle ─────────────────────── */}
        <div
          className={`transition-all duration-300 overflow-hidden ${
            showTime ? 'opacity-100 max-h-20' : 'opacity-0 max-h-0 pointer-events-none'
          }`}
        >
          <div className="text-[9px] text-gray-700 text-center mb-0.5 tracking-wide">
            Zeitintegration
          </div>
          <div className="flex gap-0.5 bg-gray-900/80 rounded-md p-0.5">
            {TIME_OPTS.map((o) => (
              <button
                key={o.key}
                onClick={() => setTime(o.key)}
                className={`px-2 py-0.5 rounded text-[10px] font-medium transition-all duration-200 ${
                  time === o.key
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'text-gray-600 hover:text-gray-400 hover:bg-gray-800/60'
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Method toggle (always visible) ──────────────── */}
        <div>
          <div className="text-[9px] text-gray-700 text-center mb-0.5 tracking-wide">
            Verfahren
          </div>
          <div className="flex gap-0.5 bg-gray-900/80 rounded-lg p-0.5">
            {(['FVM', 'FDM'] as MethodKey[]).map((k) => (
              <button
                key={k}
                onClick={() => setMethod(k)}
                className={`px-3 py-1 rounded-md text-[11px] font-semibold transition-all duration-200 ${
                  method === k
                    ? 'bg-gray-700 text-gray-200 shadow-sm'
                    : 'text-gray-600 hover:text-gray-400 hover:bg-gray-800/60'
                }`}
              >
                {k}
              </button>
            ))}
          </div>
          <div className="mt-0.5 text-[10px] text-gray-700 text-center">
            {method === 'FVM' ? 'Finite Volumen' : 'Finite Differenzen'}
          </div>
        </div>
      </div>
    </div>
  );

}
