'use client';

import React, { useEffect, useRef, useState } from 'react';
import katex from 'katex';

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   FormulaJourney — ONE formula morphing through CFD discretisation.

   Shows a single centered formula that transforms step-by-step as the
   user scrolls through the roadmap. Changed parts glow in colour.

   Three method tracks:
     • FVM  — Finite-Volumen-Methode  (control volume integration)
     • FDM  — Finite-Differenzen       (Taylor / difference quotients)
     • FEM  — Finite-Elemente          (weak form / shape functions)

   Each has 8 stages from continuous PDE → solved system.
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

/* ═══════════════════════════════════════════════════════════════════
   FVM — Finite-Volumen-Methode
   ═══════════════════════════════════════════════════════════════════ */
const FVM_STAGES: Stage[] = [
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
  {
    label: 'Zeitdiskretisierung',
    stepLabel: 'Zeit',
    formula: `V_P\\, ${tc(C.emerald, '\\frac{\\phi_P^{n+1} - \\phi_P^{\\,n}}{\\Delta t}')} \\;+\\; \\sum_f u_f\\,\\phi_f\\,A_f \\;=\\; \\sum_f \\Gamma_f\\!\\left(\\frac{\\partial \\phi}{\\partial x}\\right)_{\\!f} A_f`,
    annotation: '∂/∂t → Euler vorwärts: (φ_new − φ_old) / Δt.',
    color: C.emerald,
  },
  {
    label: 'Face-Werte interpolieren',
    stepLabel: 'Schema',
    formula: `V_P\\,\\frac{\\phi_P^{n+1} - \\phi_P^{\\,n}}{\\Delta t} \\;+\\; \\sum_f \\dot{m}_f\\, ${tc(C.rose, '\\underbrace{\\phi_f}_{\\text{Schema!}}')} \\;=\\; \\sum_f \\Gamma_f A_f\\, ${tc(C.rose, '\\frac{\\phi_E - \\phi_P}{d_{PE}}')}`,
    annotation: 'φ_f muss interpoliert werden → UDS / CDS / TVD.',
    color: C.rose,
  },
  {
    label: 'Koeffizienten sammeln',
    stepLabel: 'Koeffizienten',
    formula: `${tc(C.sky, 'a_P')}\\,\\phi_P \\;=\\; ${tc(C.sky, 'a_W')}\\,\\phi_W \\;+\\; ${tc(C.sky, 'a_E')}\\,\\phi_E \\;+\\; ${tc(C.sky, 'b_P')}`,
    annotation: 'Alles umordnen → eine Gleichung pro Zelle.',
    color: C.sky,
  },
  {
    label: 'Gleichungssystem lösen',
    stepLabel: 'Lösen!',
    formula: `${tc(C.orange, '\\mathbf{A}')}\\,\\vec{\\phi} = \\vec{b} \\;\\;\\Rightarrow\\;\\; ${tc(C.orange, '\\begin{bmatrix} a_P & a_E & 0 \\\\ a_W & a_P & a_E \\\\ 0 & a_W & a_P \\end{bmatrix}')} \\begin{bmatrix} \\phi_1 \\\\ \\phi_2 \\\\ \\phi_3 \\end{bmatrix} = \\begin{bmatrix} b_1 \\\\ b_2 \\\\ b_3 \\end{bmatrix}`,
    annotation: 'Alle Zellen zusammen → lösen. Fertig!',
    color: C.orange,
  },
];

/* ═══════════════════════════════════════════════════════════════════
   FDM — Finite-Differenzen-Methode
   ═══════════════════════════════════════════════════════════════════ */
const FDM_STAGES: Stage[] = [
  {
    label: 'Kontinuierliche PDE',
    stepLabel: 'Start',
    formula: `\\frac{\\partial \\phi}{\\partial t} + u\\frac{\\partial \\phi}{\\partial x} = \\Gamma \\frac{\\partial^2 \\phi}{\\partial x^2}`,
    annotation: 'Die exakte Transportgleichung in nicht-konservativer Form.',
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
    annotation: 'Differenzenquotienten in die PDE am Gitterpunkt i einsetzen.',
    color: C.amber,
  },
  {
    label: 'Zeitdiskretisierung',
    stepLabel: 'Zeit',
    formula: `${tc(C.emerald, '\\frac{\\phi_i^{n+1} - \\phi_i^{\\,n}}{\\Delta t}')} + u\\,\\frac{\\phi_{i+1}^n - \\phi_{i-1}^n}{2\\Delta x} = \\Gamma\\,\\frac{\\phi_{i+1}^n - 2\\phi_i^n + \\phi_{i-1}^n}{\\Delta x^2}`,
    annotation: '∂/∂t → Euler vorwärts. Alles zum Zeitschritt n bekannt.',
    color: C.emerald,
  },
  {
    label: 'Stencil wählen',
    stepLabel: 'Schema',
    formula: `\\frac{\\phi_i^{n+1} - \\phi_i^n}{\\Delta t} + u\\, ${tc(C.rose, '\\underbrace{\\frac{\\phi_i^n - \\phi_{i-1}^n}{\\Delta x}}_{\\text{Upwind!}}')} = \\Gamma\\,\\frac{\\phi_{i+1}^n - 2\\phi_i^n + \\phi_{i-1}^n}{\\Delta x^2}`,
    annotation: 'Upwind, zentral oder höhere Ordnung — bei FDM freie Wahl.',
    color: C.rose,
  },
  {
    label: 'Koeffizienten sammeln',
    stepLabel: 'Koeffizienten',
    formula: `${tc(C.sky, '\\phi_i^{n+1}')} = ${tc(C.sky, 'c_W')}\\,\\phi_{i-1}^n + ${tc(C.sky, 'c_P')}\\,\\phi_i^n + ${tc(C.sky, 'c_E')}\\,\\phi_{i+1}^n`,
    annotation: 'Umstellen → explizite Update-Formel pro Gitterpunkt.',
    color: C.sky,
  },
  {
    label: 'Gleichungssystem lösen',
    stepLabel: 'Lösen!',
    formula: `${tc(C.orange, '\\vec{\\phi}^{\\,n+1}')} = ${tc(C.orange, '\\mathbf{C}')}\\,\\vec{\\phi}^{\\,n} \\;\\Rightarrow\\; ${tc(C.orange, '\\begin{bmatrix} \\phi_1 \\\\ \\phi_2 \\\\ \\phi_3 \\end{bmatrix}^{\\!n+1}')} \\!=\\! ${tc(C.orange, '\\begin{bmatrix} c_P & c_E & 0 \\\\ c_W & c_P & c_E \\\\ 0 & c_W & c_P \\end{bmatrix}')} \\begin{bmatrix} \\phi_1 \\\\ \\phi_2 \\\\ \\phi_3 \\end{bmatrix}^{\\!n}`,
    annotation: 'Explizit: nur Matrix-Vektor-Produkt. Implizit: LGS lösen.',
    color: C.orange,
  },
];

/* ═══════════════════════════════════════════════════════════════════
   FEM — Finite-Elemente-Methode
   ═══════════════════════════════════════════════════════════════════ */
const FEM_STAGES: Stage[] = [
  {
    label: 'Kontinuierliche PDE',
    stepLabel: 'Start',
    formula: `\\frac{\\partial \\phi}{\\partial t} + \\frac{\\partial}{\\partial x}(u\\phi) = \\frac{\\partial}{\\partial x}\\!\\left(\\Gamma \\frac{\\partial \\phi}{\\partial x}\\right)`,
    annotation: 'Die exakte Transportgleichung — Ausgangspunkt.',
    color: C.white,
  },
  {
    label: 'Schwache Form',
    stepLabel: 'Gewichten',
    formula: `${tc(C.cyan, '\\int_\\Omega w')} \\!\\left[\\frac{\\partial \\phi}{\\partial t} + \\frac{\\partial(u\\phi)}{\\partial x} - \\frac{\\partial}{\\partial x}\\!\\left(\\Gamma \\frac{\\partial \\phi}{\\partial x}\\right)\\right] ${tc(C.cyan, 'd\\Omega = 0')}`,
    annotation: 'PDE mit Testfunktion w multiplizieren & integrieren.',
    color: C.cyan,
  },
  {
    label: 'Partielle Integration',
    stepLabel: 'Green',
    formula: `\\int_\\Omega \\! w\\frac{\\partial \\phi}{\\partial t}d\\Omega + \\int_\\Omega \\! w\\frac{\\partial(u\\phi)}{\\partial x}d\\Omega + ${tc(C.violet, '\\int_\\Omega \\frac{\\partial w}{\\partial x}\\Gamma\\frac{\\partial \\phi}{\\partial x}d\\Omega')} = ${tc(C.violet, '\\big[w\\Gamma\\tfrac{\\partial \\phi}{\\partial x}\\big]_\\Gamma')}`,
    annotation: 'Partielle Integration senkt die Ableitungsordnung.',
    color: C.violet,
  },
  {
    label: 'Ansatzfunktionen einsetzen',
    stepLabel: 'Ansatz',
    formula: `\\phi(x) \\approx ${tc(C.amber, '\\sum_j \\phi_j\\, N_j(x)')}, \\quad w(x) = ${tc(C.amber, 'N_i(x)')}`,
    annotation: 'φ als Linearkombination von Formfunktionen N_j.',
    color: C.amber,
  },
  {
    label: 'Element-Matrizen',
    stepLabel: 'Elemente',
    formula: `${tc(C.emerald, 'M_{ij}^e')} = \\!\\int_e \\!N_i N_j\\,dx,\\;\\; ${tc(C.emerald, 'K_{ij}^e')} = \\!\\int_e \\!\\tfrac{dN_i}{dx}\\Gamma\\tfrac{dN_j}{dx}dx \\;\\Rightarrow\\; ${tc(C.emerald, '\\mathbf{M}_e')}\\dot{\\vec{\\phi}}_e + ${tc(C.emerald, '\\mathbf{K}_e')}\\vec{\\phi}_e = \\vec{f}_e`,
    annotation: 'Massenmatrix M, Steifigkeitsmatrix K pro Element.',
    color: C.emerald,
  },
  {
    label: 'Assembly',
    stepLabel: 'Assemblieren',
    formula: `${tc(C.rose, '\\mathbf{M}')} = ${tc(C.rose, '\\sum_e')} \\mathbf{M}_e, \\;\\; ${tc(C.rose, '\\mathbf{K}')} = ${tc(C.rose, '\\sum_e')} \\mathbf{K}_e \\;\\;\\Rightarrow\\;\\; ${tc(C.rose, '\\mathbf{M}')}\\dot{\\vec{\\phi}} + ${tc(C.rose, '\\mathbf{K}')}\\vec{\\phi} = \\vec{f}`,
    annotation: 'Globale Matrizen durch Zusammenbau aller Elemente.',
    color: C.rose,
  },
  {
    label: 'Zeitdiskretisierung',
    stepLabel: 'Zeit',
    formula: `\\mathbf{M} ${tc(C.sky, '\\frac{\\vec{\\phi}^{\\,n+1} - \\vec{\\phi}^{\\,n}}{\\Delta t}')} + \\mathbf{K}\\vec{\\phi}^n = \\vec{f} \\;\\Rightarrow\\; ${tc(C.sky, '\\tfrac{\\mathbf{M}}{\\Delta t}')}\\vec{\\phi}^{n+1} = ${tc(C.sky, '\\left(\\tfrac{\\mathbf{M}}{\\Delta t} - \\mathbf{K}\\right)')}\\vec{\\phi}^n + \\vec{f}`,
    annotation: '∂/∂t diskretisieren → LGS pro Zeitschritt.',
    color: C.sky,
  },
  {
    label: 'Gleichungssystem lösen',
    stepLabel: 'Lösen!',
    formula: `${tc(C.orange, '\\tilde{\\mathbf{M}}')}\\vec{\\phi}^{\\,n+1} = \\vec{b}^n \\;\\Rightarrow\\; ${tc(C.orange, '\\begin{bmatrix} \\tilde m_{11} & \\tilde m_{12} & 0 \\\\ \\tilde m_{21} & \\tilde m_{22} & \\tilde m_{23} \\\\ 0 & \\tilde m_{32} & \\tilde m_{33} \\end{bmatrix}')} \\begin{bmatrix} \\phi_1 \\\\ \\phi_2 \\\\ \\phi_3 \\end{bmatrix}^{\\!n+1} \\!= \\begin{bmatrix} b_1 \\\\ b_2 \\\\ b_3 \\end{bmatrix}^{\\!n}`,
    annotation: 'Bandstruktur durch lokale Formfunktions-Unterstützung.',
    color: C.orange,
  },
];

/* ═══════════════════════════════════════════════════════════════════ */

type MethodKey = 'FVM' | 'FDM' | 'FEM';

const METHODS: Record<MethodKey, { label: string; stages: Stage[]; desc: string }> = {
  FVM: { label: 'FVM', stages: FVM_STAGES, desc: 'Finite Volumen' },
  FDM: { label: 'FDM', stages: FDM_STAGES, desc: 'Finite Differenzen' },
  FEM: { label: 'FEM', stages: FEM_STAGES, desc: 'Finite Elemente' },
};

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

    // Auto-scale to fit container
    requestAnimationFrame(() => {
      const outer = outerRef.current;
      const inner = innerRef.current;
      if (!outer || !inner) return;
      const katexEl = inner.querySelector('.katex-display') as HTMLElement;
      if (!katexEl) return;
      const contentW = katexEl.scrollWidth;
      const containerW = outer.clientWidth;
      if (contentW > containerW && contentW > 0) {
        const scale = Math.max(0.45, containerW / contentW);
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
  const stages = METHODS[method].stages;
  const TOTAL = stages.length;

  const clampedProgress = Math.max(0, Math.min(1, scrollProgress));
  const rawIndex = clampedProgress * (TOTAL - 1);
  const activeIndex = Math.max(0, Math.min(Math.round(rawIndex), TOTAL - 1));
  const stage = stages[activeIndex];

  // Track previous index for fade animation
  const [displayed, setDisplayed] = useState(0);
  const [fading, setFading] = useState(false);
  const prevIndex = useRef(0);
  const prevMethod = useRef<MethodKey>(method);

  useEffect(() => {
    // Reset immediately on method change
    if (method !== prevMethod.current) {
      setDisplayed(activeIndex);
      setFading(false);
      prevIndex.current = activeIndex;
      prevMethod.current = method;
      return;
    }
    if (activeIndex !== prevIndex.current) {
      setFading(true);
      const t = setTimeout(() => {
        setDisplayed(activeIndex);
        setFading(false);
      }, 200);
      prevIndex.current = activeIndex;
      return () => clearTimeout(t);
    }
  }, [activeIndex, method]);

  const shown = stages[displayed] ?? stages[0];

  return (
    <div className="flex flex-col items-center select-none">
      {/* ── Step indicator dots ──────────────────────────── */}
      <div className="flex items-center gap-1.5 mb-3">
        {stages.map((s, i) => (
          <div
            key={i}
            className={`rounded-full transition-all duration-300 ${
              i === activeIndex ? 'w-2 h-2' : 
              i < activeIndex ? 'w-1.5 h-1.5 opacity-50' : 'w-1.5 h-1.5 opacity-20'
            }`}
            style={{ backgroundColor: i <= activeIndex ? s.color : '#334155' }}
            title={s.stepLabel}
          />
        ))}
      </div>

      {/* ── Step label ──────────────────────────────────── */}
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
        <div className="flex justify-center overflow-hidden"
             style={{ fontSize: '1.15em' }}>
          <KaTeXBlock tex={shown.formula} />
        </div>
      </div>

      {/* ── Annotation ──────────────────────────────────── */}
      <div className={`mt-2.5 text-[10px] text-gray-600 text-center max-w-[280px] leading-relaxed transition-all duration-300 ${
        fading ? 'opacity-0' : 'opacity-100'
      }`}>
        {shown.annotation}
      </div>

      {/* ── Scroll hint / done badge ────────────────────── */}
      {activeIndex < TOTAL - 1 ? (
        <div className="mt-3 text-[8px] text-gray-700 opacity-50">↓ scrollen</div>
      ) : (
        <div className="mt-3 flex items-center gap-1 text-[9px] text-orange-400/70">
          <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
            <path d="M3 8.5l3 3 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Diskretisierung komplett
        </div>
      )}

      {/* ── Method switcher ─────────────────────────────── */}
      <div className="mt-5 flex items-center gap-0.5 bg-gray-900/80 rounded-lg p-0.5 pointer-events-auto">
        {(Object.keys(METHODS) as MethodKey[]).map(key => (
          <button
            key={key}
            onClick={() => setMethod(key)}
            className={`px-3 py-1 rounded-md text-[10px] font-semibold transition-all duration-200 ${
              method === key
                ? 'bg-gray-700 text-gray-200 shadow-sm'
                : 'text-gray-600 hover:text-gray-400 hover:bg-gray-800/60'
            }`}
            title={METHODS[key].desc}
          >
            {METHODS[key].label}
          </button>
        ))}
      </div>
      <div className="mt-1 text-[9px] text-gray-700 pointer-events-auto">
        {METHODS[method].desc}
      </div>
    </div>
  );
}