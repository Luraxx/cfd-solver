'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import katex from 'katex';

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   FormulaJourney — ONE formula morphing through CFD discretisation.

   Two method tracks:  FVM · FDM
   Sub-options:        Zeitintegration · Konvektionsschema / FD-Stencil

   8 stages from continuous PDE → solved system,
   with formulas adapting to every combination of choices.
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

const tc = (color: string, tex: string) => `\\textcolor{${color}}{${tex}}`;

interface Stage {
  label: string;
  stepLabel: string;
  formula: string;
  annotation: string;
  color: string;
}

type MethodKey = 'FVM' | 'FDM';
type TimeKey = 'euler-exp' | 'euler-imp' | 'crank-nic';
type FVMScheme = 'UDS' | 'CDS' | 'TVD';
type FDMScheme = 'upwind' | 'central' | 'forward';

/* ═══════════════════════════════════════════════════════════════════
   EARLY STAGES (0-3) — depend on method only
   ═══════════════════════════════════════════════════════════════════ */

const FVM_EARLY: Stage[] = [
  {
    label: 'Kontinuierliche PDE',
    stepLabel: 'Start',
    formula: `\\frac{\\partial \\phi}{\\partial t} + \\frac{\\partial}{\\partial x}(u\\phi) = \\frac{\\partial}{\\partial x}\\!\\left(\\Gamma \\frac{\\partial \\phi}{\\partial x}\\right)`,
    annotation: 'Die exakte Transportgleichung — so sieht Physik aus.',
    color: C.white,
  },
  {
    label: 'Über Kontrollvolumen integrieren',
    stepLabel: 'Integrieren',
    formula: `${tc(C.cyan, '\\int_V')} \\frac{\\partial \\phi}{\\partial t}\\,${tc(C.cyan, 'dV')} \\;+\\; ${tc(C.cyan, '\\int_V')} \\frac{\\partial}{\\partial x}(u\\phi)\\,${tc(C.cyan, 'dV')} \\;=\\; ${tc(C.cyan, '\\int_V')} \\frac{\\partial}{\\partial x}\\!\\left(\\Gamma \\frac{\\partial \\phi}{\\partial x}\\right)${tc(C.cyan, 'dV')}`,
    annotation: 'Jeden Term über ein Kontrollvolumen V integrieren.',
    color: C.cyan,
  },
  {
    label: 'Gauß\'scher Satz',
    stepLabel: 'Gauß',
    formula: `\\int_V \\frac{\\partial \\phi}{\\partial t}\\,dV \\;+\\; ${tc(C.violet, '\\oint_S')} (u\\phi)\\,${tc(C.violet, '\\vec{n}\\,dA')} \\;=\\; ${tc(C.violet, '\\oint_S')} \\Gamma\\frac{\\partial \\phi}{\\partial x}\\,${tc(C.violet, '\\vec{n}\\,dA')}`,
    annotation: 'Volumenintegrale → Oberflächenintegrale (Gauß).',
    color: C.violet,
  },
  {
    label: 'Diskrete Summe über Faces',
    stepLabel: 'Diskretisieren',
    formula: `${tc(C.amber, 'V_P')}\\frac{\\partial \\phi_P}{\\partial t} \\;+\\; ${tc(C.amber, '\\sum_f')} u_f\\,\\phi_f\\,${tc(C.amber, 'A_f')} \\;=\\; ${tc(C.amber, '\\sum_f')} \\Gamma_f\\!\\left(\\frac{\\partial \\phi}{\\partial x}\\right)_{\\!f} ${tc(C.amber, 'A_f')}`,
    annotation: 'Integrale werden zu Summen über die Faces f.',
    color: C.amber,
  },
];

const FDM_EARLY: Stage[] = [
  {
    label: 'Kontinuierliche PDE',
    stepLabel: 'Start',
    formula: `\\frac{\\partial \\phi}{\\partial t} + u\\frac{\\partial \\phi}{\\partial x} = \\Gamma \\frac{\\partial^2 \\phi}{\\partial x^2}`,
    annotation: 'Die Transportgleichung in nicht-konservativer Form.',
    color: C.white,
  },
  {
    label: 'Taylor-Reihe aufstellen',
    stepLabel: 'Taylor',
    formula: `\\phi(x\\!+\\!\\Delta x) = \\phi(x) + ${tc(C.cyan, '\\Delta x\\,\\phi\' + \\tfrac{\\Delta x^2}{2}\\,\\phi\'\' + \\tfrac{\\Delta x^3}{6}\\,\\phi\'\'\' + \\cdots')}`,
    annotation: 'Die Taylor-Entwicklung ist die Basis aller FD-Stencils.',
    color: C.cyan,
  },
  {
    label: 'Differenzenquotienten',
    stepLabel: 'Differenzen',
    formula: `\\frac{\\partial \\phi}{\\partial x}\\bigg|_i \\!\\approx ${tc(C.violet, '\\frac{\\phi_{i+1} - \\phi_{i-1}}{2\\Delta x}')}\\,,\\;\\; \\frac{\\partial^2 \\phi}{\\partial x^2}\\bigg|_i \\!\\approx ${tc(C.violet, '\\frac{\\phi_{i+1} - 2\\phi_i + \\phi_{i-1}}{\\Delta x^2}')}`,
    annotation: 'Ableitungen durch Differenzenquotienten ersetzen.',
    color: C.violet,
  },
  {
    label: 'In PDE einsetzen',
    stepLabel: 'Einsetzen',
    formula: `\\frac{\\partial \\phi_i}{\\partial t} + u\\,${tc(C.amber, '\\frac{\\phi_{i+1} - \\phi_{i-1}}{2\\Delta x}')} = \\Gamma\\,${tc(C.amber, '\\frac{\\phi_{i+1} - 2\\phi_i + \\phi_{i-1}}{\\Delta x^2}')}`,
    annotation: 'Differenzenquotienten in die PDE am Gitterpunkt i.',
    color: C.amber,
  },
];

/* ═══════════════════════════════════════════════════════════════════
   TIME STAGES (4) — depend on method + timeKey
   ═══════════════════════════════════════════════════════════════════ */

const FVM_TIME: Record<TimeKey, Stage> = {
  'euler-exp': {
    label: 'Euler explizit',
    stepLabel: 'Zeit',
    formula: `V_P ${tc(C.emerald, '\\frac{\\phi_P^{n+1} - \\phi_P^{\\,n}}{\\Delta t}')} + \\sum_f \\dot{m}_f \\phi_f${tc(C.emerald, '^{\\,n}')} = \\sum_f \\Gamma_f A_f \\!\\left(\\frac{\\partial\\phi}{\\partial x}\\right)_{\\!f}${tc(C.emerald, '^{\\,n}')}`,
    annotation: 'Räumliche Terme zum bekannten Zeitschritt n. Einfach, aber CFL: Δt ≤ Δx/u.',
    color: C.emerald,
  },
  'euler-imp': {
    label: 'Euler implizit',
    stepLabel: 'Zeit',
    formula: `V_P ${tc(C.emerald, '\\frac{\\phi_P^{n+1} - \\phi_P^{\\,n}}{\\Delta t}')} + \\sum_f \\dot{m}_f \\phi_f${tc(C.emerald, '^{n+1}')} = \\sum_f \\Gamma_f A_f \\!\\left(\\frac{\\partial\\phi}{\\partial x}\\right)_{\\!f}${tc(C.emerald, '^{n+1}')}`,
    annotation: 'Räumliche Terme zum unbekannten n+1 → immer stabil, braucht aber LGS.',
    color: C.emerald,
  },
  'crank-nic': {
    label: 'Crank-Nicolson',
    stepLabel: 'Zeit',
    formula: `V_P \\frac{\\phi_P^{n+1} - \\phi_P^{\\,n}}{\\Delta t} = ${tc(C.emerald, '\\tfrac{1}{2}\\bigl[R(\\phi^n) + R(\\phi^{n+1})\\bigr]')}`,
    annotation: 'R = alle räumlichen Terme. Mittelwert aus n und n+1 → 2. Ordnung in t.',
    color: C.emerald,
  },
};

const FDM_TIME: Record<TimeKey, Stage> = {
  'euler-exp': {
    label: 'Euler explizit',
    stepLabel: 'Zeit',
    formula: `${tc(C.emerald, '\\frac{\\phi_i^{n+1} - \\phi_i^{\\,n}}{\\Delta t}')} + u\\frac{\\phi_{i+1}${tc(C.emerald, '^n')} - \\phi_{i-1}${tc(C.emerald, '^n')}}{2\\Delta x} = \\Gamma\\frac{\\phi_{i+1}${tc(C.emerald, '^n')} - 2\\phi_i${tc(C.emerald, '^n')} + \\phi_{i-1}${tc(C.emerald, '^n')}}{\\Delta x^2}`,
    annotation: 'Alles zum Zeitschritt n bekannt → direktes Update. CFL beachten!',
    color: C.emerald,
  },
  'euler-imp': {
    label: 'Euler implizit',
    stepLabel: 'Zeit',
    formula: `${tc(C.emerald, '\\frac{\\phi_i^{n+1} - \\phi_i^{\\,n}}{\\Delta t}')} + u\\frac{\\phi_{i+1}${tc(C.emerald, '^{n+1}')} \\!-\\! \\phi_{i-1}${tc(C.emerald, '^{n+1}')}}{2\\Delta x} = \\Gamma\\frac{\\phi_{i+1}${tc(C.emerald, '^{n+1}')} \\!-\\! 2\\phi_i${tc(C.emerald, '^{n+1}')} \\!+\\! \\phi_{i-1}${tc(C.emerald, '^{n+1}')}}{\\Delta x^2}`,
    annotation: 'Räumliche Terme zum unbekannten n+1 → unbedingt stabil, LGS nötig.',
    color: C.emerald,
  },
  'crank-nic': {
    label: 'Crank-Nicolson',
    stepLabel: 'Zeit',
    formula: `\\frac{\\phi_i^{n+1} - \\phi_i^{\\,n}}{\\Delta t} = ${tc(C.emerald, '\\tfrac{1}{2}\\bigl[L(\\phi^n) + L(\\phi^{n+1})\\bigr]')}`,
    annotation: 'L = räumlicher Operator. Mittelwert → 2. Ordnung in t, LGS nötig.',
    color: C.emerald,
  },
};

/* ═══════════════════════════════════════════════════════════════════
   SCHEMA / STENCIL STAGES (5) — depend on method + scheme
   ═══════════════════════════════════════════════════════════════════ */

const FVM_SCHEMA: Record<FVMScheme, Stage> = {
  UDS: {
    label: 'Upwind (UDS)',
    stepLabel: 'Schema',
    formula: `${tc(C.rose, '\\phi_f = \\phi_{\\text{upwind}}')} \\;\\Rightarrow\\; \\phi_f = \\begin{cases} \\phi_P & u_f > 0 \\\\ \\phi_E & u_f < 0 \\end{cases}`,
    annotation: '1. Ordnung — stabil, robust, aber numerische Diffusion.',
    color: C.rose,
  },
  CDS: {
    label: 'Central (CDS)',
    stepLabel: 'Schema',
    formula: `${tc(C.rose, '\\phi_f = \\frac{\\phi_P + \\phi_E}{2}')} \\quad \\text{(linearer Mittelwert)}`,
    annotation: '2. Ordnung — genau, aber kann bei Pe > 2 oszillieren.',
    color: C.rose,
  },
  TVD: {
    label: 'TVD-Schema',
    stepLabel: 'Schema',
    formula: `${tc(C.rose, '\\phi_f = \\phi_P + \\tfrac{1}{2}\\,\\psi(r)\\,(\\phi_E - \\phi_P)')},\\; r = \\frac{\\phi_P - \\phi_W}{\\phi_E - \\phi_P}`,
    annotation: 'Limiter ψ(r) sichert Stabilität + Genauigkeit (minmod, van Leer …).',
    color: C.rose,
  },
};

const FDM_SCHEMA: Record<FDMScheme, Stage> = {
  upwind: {
    label: 'Upwind-Differenz',
    stepLabel: 'Stencil',
    formula: `\\frac{\\partial\\phi}{\\partial x}\\bigg|_i \\approx ${tc(C.rose, '\\frac{\\phi_i - \\phi_{i-1}}{\\Delta x}')} + \\mathcal{O}(\\Delta x)`,
    annotation: '1. Ordnung — stabil (stromaufwärts), numerische Diffusion.',
    color: C.rose,
  },
  central: {
    label: 'Zentrale Differenz',
    stepLabel: 'Stencil',
    formula: `\\frac{\\partial\\phi}{\\partial x}\\bigg|_i \\approx ${tc(C.rose, '\\frac{\\phi_{i+1} - \\phi_{i-1}}{2\\,\\Delta x}')} + \\mathcal{O}(\\Delta x^2)`,
    annotation: '2. Ordnung — genauer, aber bei starker Konvektion instabil.',
    color: C.rose,
  },
  forward: {
    label: 'Vorwärts-Differenz',
    stepLabel: 'Stencil',
    formula: `\\frac{\\partial\\phi}{\\partial x}\\bigg|_i \\approx ${tc(C.rose, '\\frac{\\phi_{i+1} - \\phi_i}{\\Delta x}')} + \\mathcal{O}(\\Delta x)`,
    annotation: '1. Ordnung — Downwind bei u > 0, oft instabil für Konvektion.',
    color: C.rose,
  },
};

/* ═══════════════════════════════════════════════════════════════════
   LATE STAGES (6-7) — depend on method + explicit vs implicit
   ═══════════════════════════════════════════════════════════════════ */

const FVM_LATE_EXP: Stage[] = [
  {
    label: 'Explizites Update',
    stepLabel: 'Update',
    formula: `${tc(C.sky, '\\phi_P^{n+1}')} = \\phi_P^n + \\frac{\\Delta t}{V_P}\\!\\left[\\sum_f \\Gamma_f A_f \\frac{\\phi_E^n - \\phi_P^n}{d_{PE}} - \\sum_f \\dot{m}_f\\,\\phi_f^n\\right]`,
    annotation: 'Direkt berechenbar — kein Gleichungssystem nötig.',
    color: C.sky,
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
    annotation: 'Unbekannte auf beiden Seiten → gekoppeltes LGS.',
    color: C.sky,
  },
  {
    label: 'Gleichungssystem lösen',
    stepLabel: 'Lösen!',
    formula: `${tc(C.orange, '\\mathbf{A}')}\\vec{\\phi}^{n+1} \\!= \\vec{b} \\;\\Rightarrow\\; ${tc(C.orange, '\\begin{bmatrix} a_P & a_E & 0 \\\\ a_W & a_P & a_E \\\\ 0 & a_W & a_P \\end{bmatrix}')} \\begin{bmatrix} \\phi_1 \\\\ \\phi_2 \\\\ \\phi_3 \\end{bmatrix}^{\\!n+1} \\!\\!= \\begin{bmatrix} b_1 \\\\ b_2 \\\\ b_3 \\end{bmatrix}`,
    annotation: 'Tridiagonale Matrix → TDMA / iterativer Löser.',
    color: C.orange,
  },
];

const FDM_LATE_EXP: Stage[] = [
  {
    label: 'Explizites Update',
    stepLabel: 'Update',
    formula: `${tc(C.sky, '\\phi_i^{n+1}')} = ${tc(C.sky, 'c_W')}\\,\\phi_{i-1}^n + ${tc(C.sky, 'c_P')}\\,\\phi_i^n + ${tc(C.sky, 'c_E')}\\,\\phi_{i+1}^n`,
    annotation: 'Direkt berechenbar: gewichteter Durchschnitt der Nachbarn.',
    color: C.sky,
  },
  {
    label: 'Matrix-Vektor-Produkt',
    stepLabel: 'Berechnen',
    formula: `${tc(C.orange, '\\vec{\\phi}^{\\,n+1}')} = ${tc(C.orange, '\\mathbf{C}')}\\,\\vec{\\phi}^{\\,n} \\;\\Rightarrow\\; ${tc(C.orange, '\\begin{bmatrix} \\phi_1 \\\\ \\phi_2 \\\\ \\phi_3 \\end{bmatrix}^{\\!n+1}')} \\!= ${tc(C.orange, '\\begin{bmatrix} c_P & c_E & 0 \\\\ c_W & c_P & c_E \\\\ 0 & c_W & c_P \\end{bmatrix}')} \\begin{bmatrix} \\phi_1 \\\\ \\phi_2 \\\\ \\phi_3 \\end{bmatrix}^{\\!n}`,
    annotation: 'Nur Multiplikation — schnell, aber CFL-Bedingung!',
    color: C.orange,
  },
];

const FDM_LATE_IMP: Stage[] = [
  {
    label: 'Koeffizienten sammeln',
    stepLabel: 'Koeffizienten',
    formula: `${tc(C.sky, 'a_P')}\\,\\phi_i^{n+1} = ${tc(C.sky, 'a_W')}\\,\\phi_{i-1}^{n+1} + ${tc(C.sky, 'a_E')}\\,\\phi_{i+1}^{n+1} + ${tc(C.sky, 'b_i')}`,
    annotation: 'Unbekannte auf beiden Seiten → LGS nötig.',
    color: C.sky,
  },
  {
    label: 'Gleichungssystem lösen',
    stepLabel: 'Lösen!',
    formula: `${tc(C.orange, '\\mathbf{A}')}\\vec{\\phi}^{n+1} \\!= \\vec{b} \\;\\Rightarrow\\; ${tc(C.orange, '\\begin{bmatrix} a_P & a_E & 0 \\\\ a_W & a_P & a_E \\\\ 0 & a_W & a_P \\end{bmatrix}')} \\begin{bmatrix} \\phi_1 \\\\ \\phi_2 \\\\ \\phi_3 \\end{bmatrix}^{\\!n+1} \\!\\!= \\begin{bmatrix} b_1 \\\\ b_2 \\\\ b_3 \\end{bmatrix}`,
    annotation: 'Tridiagonal → effizient lösbar mit TDMA.',
    color: C.orange,
  },
];

/* ── Build stage list from selections ──────────────────────────── */

function buildStages(
  method: MethodKey,
  time: TimeKey,
  fvmScheme: FVMScheme,
  fdmScheme: FDMScheme,
): Stage[] {
  const early = method === 'FVM' ? FVM_EARLY : FDM_EARLY;
  const timeStage = (method === 'FVM' ? FVM_TIME : FDM_TIME)[time];
  const schemaStage = method === 'FVM'
    ? FVM_SCHEMA[fvmScheme]
    : FDM_SCHEMA[fdmScheme];
  const isExplicit = time === 'euler-exp';
  const late = method === 'FVM'
    ? (isExplicit ? FVM_LATE_EXP : FVM_LATE_IMP)
    : (isExplicit ? FDM_LATE_EXP : FDM_LATE_IMP);
  return [...early, timeStage, schemaStage, ...late];
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
  { key: 'upwind', label: 'Upwind' },
  { key: 'central', label: 'Zentral' },
  { key: 'forward', label: 'Vorwärts' },
];

/* ── KaTeX block renderer with auto-fit scaling ───────────────── */

function KaTeXBlock({ tex }: { tex: string }) {
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
  }, [tex]);

  return (
    <div ref={outerRef} className="w-full overflow-hidden">
      <div ref={innerRef} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════ */

export default function FormulaJourney({ scrollProgress }: { scrollProgress: number }) {
  const [method, setMethod] = useState<MethodKey>('FVM');
  const [time, setTime] = useState<TimeKey>('euler-exp');
  const [fvmScheme, setFvmScheme] = useState<FVMScheme>('UDS');
  const [fdmScheme, setFdmScheme] = useState<FDMScheme>('upwind');

  const stages = useMemo(
    () => buildStages(method, time, fvmScheme, fdmScheme),
    [method, time, fvmScheme, fdmScheme],
  );
  const TOTAL = stages.length;

  const clampedProgress = Math.max(0, Math.min(1, scrollProgress));
  const rawIndex = clampedProgress * (TOTAL - 1);
  const activeIndex = Math.max(0, Math.min(Math.round(rawIndex), TOTAL - 1));
  const stage = stages[activeIndex];

  /* Fade animation */
  const [displayed, setDisplayed] = useState(0);
  const [fading, setFading] = useState(false);
  const prevKey = useRef('');

  useEffect(() => {
    const key = `${method}-${time}-${fvmScheme}-${fdmScheme}-${activeIndex}`;
    if (key !== prevKey.current) {
      if (prevKey.current === '') {
        setDisplayed(activeIndex);
        prevKey.current = key;
        return;
      }
      setFading(true);
      const t = setTimeout(() => {
        setDisplayed(activeIndex);
        setFading(false);
      }, 180);
      prevKey.current = key;
      return () => clearTimeout(t);
    }
  }, [activeIndex, method, time, fvmScheme, fdmScheme]);

  const shown = stages[displayed] ?? stages[0];

  /* Which sub-toggles to show */
  const showTime = activeIndex >= 4;
  const showScheme = activeIndex >= 5;
  const schemeOpts = method === 'FVM' ? FVM_SCHEME_OPTS : FDM_SCHEME_OPTS;
  const activeScheme = method === 'FVM' ? fvmScheme : fdmScheme;
  const setScheme = (k: string) =>
    method === 'FVM'
      ? setFvmScheme(k as FVMScheme)
      : setFdmScheme(k as FDMScheme);

  return (
    <div className="flex flex-col items-center select-none">
      {/* ── Step indicator dots ──────────────────────────── */}
      <div className="flex items-center gap-1.5 mb-3">
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

      {/* ── Step counter + label ─────────────────────────── */}
      <div
        className="text-[9px] uppercase tracking-[0.15em] font-semibold mb-0.5 transition-colors duration-300"
        style={{ color: stage.color }}
      >
        {activeIndex + 1}/{TOTAL}
      </div>
      <div className="text-[11px] font-medium text-gray-300 mb-3 text-center">
        {stage.label}
      </div>

      {/* ── The morphing formula ─────────────────────────── */}
      <div
        className={`transition-all duration-300 ${
          fading ? 'opacity-0 scale-[0.97]' : 'opacity-100 scale-100'
        }`}
      >
        <div className="flex justify-center overflow-hidden" style={{ fontSize: '1.1em' }}>
          <KaTeXBlock tex={shown.formula} />
        </div>
      </div>

      {/* ── Annotation ──────────────────────────────────── */}
      <div
        className={`mt-2 text-[10px] text-gray-600 text-center max-w-[280px] leading-relaxed transition-all duration-300 ${
          fading ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {shown.annotation}
      </div>

      {/* ── Scroll hint / done badge ────────────────────── */}
      {activeIndex < TOTAL - 1 ? (
        <div className="mt-2 text-[8px] text-gray-700 opacity-50">↓ scrollen</div>
      ) : (
        <div className="mt-2 flex items-center gap-1 text-[9px] text-orange-400/70">
          <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
            <path d="M3 8.5l3 3 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Diskretisierung komplett
        </div>
      )}

      {/* ═══ Sub-toggles area ═══════════════════════════════ */}
      <div className="mt-4 flex flex-col items-center gap-2 pointer-events-auto w-full">
        {/* ── Time integration toggle (stage 4+) ──────────── */}
        <div
          className={`transition-all duration-300 overflow-hidden ${
            showTime ? 'opacity-100 max-h-20' : 'opacity-0 max-h-0 pointer-events-none'
          }`}
        >
          <div className="text-[8px] text-gray-700 text-center mb-0.5 tracking-wide">
            Zeitintegration
          </div>
          <div className="flex gap-0.5 bg-gray-900/80 rounded-md p-0.5">
            {TIME_OPTS.map((o) => (
              <button
                key={o.key}
                onClick={() => setTime(o.key)}
                className={`px-2 py-0.5 rounded text-[9px] font-medium transition-all duration-200 ${
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

        {/* ── Schema / Stencil toggle (stage 5+) ──────────── */}
        <div
          className={`transition-all duration-300 overflow-hidden ${
            showScheme ? 'opacity-100 max-h-20' : 'opacity-0 max-h-0 pointer-events-none'
          }`}
        >
          <div className="text-[8px] text-gray-700 text-center mb-0.5 tracking-wide">
            {method === 'FVM' ? 'Konvektionsschema' : 'FD-Stencil'}
          </div>
          <div className="flex gap-0.5 bg-gray-900/80 rounded-md p-0.5">
            {schemeOpts.map((o) => (
              <button
                key={o.key}
                onClick={() => setScheme(o.key)}
                className={`px-2 py-0.5 rounded text-[9px] font-medium transition-all duration-200 ${
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

        {/* ── Method toggle (always visible) ──────────────── */}
        <div>
          <div className="text-[8px] text-gray-700 text-center mb-0.5 tracking-wide">
            Verfahren
          </div>
          <div className="flex gap-0.5 bg-gray-900/80 rounded-lg p-0.5">
            {(['FVM', 'FDM'] as MethodKey[]).map((k) => (
              <button
                key={k}
                onClick={() => setMethod(k)}
                className={`px-3 py-1 rounded-md text-[10px] font-semibold transition-all duration-200 ${
                  method === k
                    ? 'bg-gray-700 text-gray-200 shadow-sm'
                    : 'text-gray-600 hover:text-gray-400 hover:bg-gray-800/60'
                }`}
              >
                {k}
              </button>
            ))}
          </div>
          <div className="mt-0.5 text-[9px] text-gray-700 text-center">
            {method === 'FVM' ? 'Finite Volumen' : 'Finite Differenzen'}
          </div>
        </div>
      </div>
    </div>
  );
}
