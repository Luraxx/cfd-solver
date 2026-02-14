'use client';

import React, { useEffect, useRef, useState } from 'react';
import katex from 'katex';

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   FormulaJourney — ONE formula morphing through CFD discretisation.

   Shows a single centered formula that transforms step-by-step as the
   user scrolls through the roadmap. Changed parts glow in colour.

   Stages:
     0. Continuous PDE            (Transportgleichung)
     1. Integrate over CV         (Kontrollvolumen)
     2. Gauss → surface integrals
     3. Discrete sum over faces
     4. Time discretisation       (Euler forward)
     5. Face interpolation        (Schema einsetzen)
     6. Collect coefficients      (a_P, a_W, a_E)
     7. Matrix system             (Aφ = b)
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

// Helper: wrap text in \textcolor
const tc = (color: string, tex: string) => `\\textcolor{${color}}{${tex}}`;

interface Stage {
  label: string;
  stepLabel: string;
  formula: string;
  annotation: string;
  color: string;
}

const STAGES: Stage[] = [
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

const TOTAL = STAGES.length;

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
        const scale = Math.max(0.55, containerW / contentW);
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
  const clampedProgress = Math.max(0, Math.min(1, scrollProgress));
  const rawIndex = clampedProgress * (TOTAL - 1);
  const activeIndex = Math.max(0, Math.min(Math.round(rawIndex), TOTAL - 1));
  const stage = STAGES[activeIndex];

  // Track previous index for fade animation
  const [displayed, setDisplayed] = useState(0);
  const [fading, setFading] = useState(false);
  const prevIndex = useRef(0);

  useEffect(() => {
    if (activeIndex !== prevIndex.current) {
      setFading(true);
      const t = setTimeout(() => {
        setDisplayed(activeIndex);
        setFading(false);
      }, 200);
      prevIndex.current = activeIndex;
      return () => clearTimeout(t);
    }
  }, [activeIndex]);

  const shown = STAGES[displayed];

  return (
    <div className="flex flex-col items-center select-none">
      {/* ── Step indicator dots ──────────────────────────── */}
      <div className="flex items-center gap-1.5 mb-3">
        {STAGES.map((s, i) => (
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
    </div>
  );
}