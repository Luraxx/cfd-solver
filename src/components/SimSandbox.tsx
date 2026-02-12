'use client';

import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useSimulation } from '@/context/SimulationContext';
import type { SchemeName, InitialConditionType } from '@/solver';
import type { SimMode } from '@/curriculum/curriculum';
import { solveHeat1D, initHeatGaussian, initHeatStep, heatMaxDt, fdStencils } from '@/solver/fdm';
import type { HeatConfig, HeatResult } from '@/solver/fdm';
import { createGrid2D, createField2D, initField2D, idx2D, step2DScalarTransport } from '@/solver';
import type { Grid2D, SimConfig2D, IC2DType } from '@/solver';
import { fieldIsValid } from '@/solver/diagnostics';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import Icon from '@/components/Icons';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   SimSandbox — Tailored interactive sandboxes per lesson.

   Each simMode gets its own focused sandbox that only shows
   the parameters relevant to that specific topic.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

interface Props {
  simMode: SimMode;
}

export default function SimSandbox({ simMode }: Props) {
  if (simMode === 'none') {
    return (
      <div className="flex items-center justify-center h-full text-gray-600">
        <div className="text-center">
          <Icon name="book" className="text-gray-700 mx-auto mb-2" size={28} />
          <p className="text-xs text-gray-700">Theorie-Lektion — lies die Schritte links.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="flex-1 min-h-0">
        {simMode === 'fd-1d-heat' && <HeatSandbox />}
        {simMode === 'fd-stencil-explorer' && <StencilExplorer />}
        {simMode === 'fv-1d-convection' && <ConvectionSandbox />}
        {simMode === 'fv-1d-convection-diffusion' && <ConvDiffSandbox />}
        {(simMode === 'fv-tvd' || simMode === 'fv-scheme-compare') && <SchemeCompareSandbox />}
        {simMode === 'stability-cfl' && <CFLSandbox />}
        {simMode === 'stability-peclet' && <PecletSandbox />}
        {simMode === '2d-scalar' && <ScalarTransport2DSandbox />}
        {simMode === '2d-navier-stokes' && <CavitySandbox />}
        {simMode === 'algo-iterative' && <JacobiGSSandbox />}
        {simMode === 'comp-sod-tube' && <SodTubeSandbox />}
        {simMode === 'comp-normal-shock' && <NormalShockSandbox />}
        {simMode === 'turb-energy-spectrum' && <EnergySpectrumSandbox />}
        {simMode === 'turb-channel-loglaw' && <ChannelLogLawSandbox />}
        {simMode === 'twophase-vof-1d' && <VOF1DSandbox />}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Shared UI helpers
──────────────────────────────────────────────────────────────── */

function Slider({ label, value, min, max, step, onChange, color = 'cyan', suffix, warn }:
  { label: string; value: number; min: number; max: number; step: number;
    onChange: (v: number) => void; color?: string; suffix?: string; warn?: boolean }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-0.5">
        <span className="text-[11px] text-gray-500">{label}</span>
        <span className={`text-[11px] font-mono ${warn ? 'text-red-400 font-bold' : 'text-gray-400'}`}>
          {typeof value === 'number' && value % 1 === 0 ? value : value.toFixed(3)}{suffix ?? ''}
        </span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(+e.target.value)}
        className={`w-full accent-${color}-500`} />
    </div>
  );
}

function RunBtn({ onClick, hasResult }: { onClick: () => void; hasResult: boolean }) {
  return (
    <button onClick={onClick}
      className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-semibold text-xs transition-colors">
      {hasResult ? '↻ Neustart' : '▶ Starten'}
    </button>
  );
}

function StatusBadge({ label, ok }: { label: string; ok: boolean }) {
  return (
    <span className={`text-[10px] px-1.5 py-0.5 rounded ${ok ? 'bg-emerald-900/40 text-emerald-400' : 'bg-red-900/40 text-red-400 font-bold'}`}>
      {label}
    </span>
  );
}

function FormulaBox({ tex, label }: { tex: string; label?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) {
      try {
        katex.render(tex, ref.current, { displayMode: true, throwOnError: false });
      } catch { /* */ }
    }
  }, [tex]);
  return (
    <div className="border border-gray-800 rounded-md bg-gray-900/60 px-3 py-2 space-y-0.5">
      {label && <span className="text-[9px] text-gray-600 uppercase tracking-wider block">{label}</span>}
      <div ref={ref} className="text-gray-300 overflow-x-auto [&_.katex-display]:!my-0 [&_.katex]:text-[13px]" />
    </div>
  );
}

/* LaTeX formula strings — use String.raw to preserve backslashes */
const TEX_HEAT = String.raw`\frac{\partial T}{\partial t} = \alpha \, \frac{\partial^2 T}{\partial x^2}`;
const TEX_CONV = String.raw`\frac{\partial \phi}{\partial t} + u \frac{\partial \phi}{\partial x} = 0`;
const TEX_CONVDIFF = String.raw`\frac{\partial \phi}{\partial t} + u \frac{\partial \phi}{\partial x} = \Gamma \frac{\partial^2 \phi}{\partial x^2}`;
const TEX_CFL = String.raw`\text{CFL} = \frac{|u| \, \Delta t}{\Delta x} \leq 1`;
const TEX_PE = String.raw`\text{Pe} = \frac{|u| \, \Delta x}{\Gamma}`;
const TEX_SCALAR2D = String.raw`\frac{\partial \phi}{\partial t} + \nabla \!\cdot\! (\vec{u}\phi) = \Gamma \nabla^2 \phi`;
const TEX_CAVITY = String.raw`\nabla^2 \psi = -\omega, \quad \frac{D\omega}{Dt} = \nu \nabla^2 \omega`;
const TEX_JACOBI = String.raw`A\mathbf{x} = \mathbf{b}, \quad x_i^{(k+1)} = \frac{1}{a_{ii}}\!\left(b_i - \sum_{j \neq i} a_{ij} x_j^{(k)}\right)`;
const TEX_SOD = String.raw`\frac{\partial \mathbf{U}}{\partial t} + \frac{\partial \mathbf{F}}{\partial x} = 0`;
const TEX_SHOCK = String.raw`\frac{p_2}{p_1} = 1 + \frac{2\gamma}{\gamma+1}(M_1^2 - 1)`;
const TEX_ENERGY = String.raw`E(k) = C_K \, \varepsilon^{2/3} \, k^{-5/3}`;
const TEX_LOGLAW = String.raw`u^+ = \tfrac{1}{\kappa} \ln y^+ + B`;
const TEX_VOF = String.raw`\frac{\partial \alpha}{\partial t} + u \frac{\partial \alpha}{\partial x} = 0`;

const PLOT_LAYOUT_BASE: Partial<Plotly.Layout> = {
  autosize: true,
  margin: { l: 45, r: 15, t: 8, b: 35 },
  paper_bgcolor: 'transparent',
  plot_bgcolor: '#0d1117',
  font: { color: '#6b7280', size: 10 },
  xaxis: { gridcolor: '#1f2937', zerolinecolor: '#374151' },
  yaxis: { gridcolor: '#1f2937', zerolinecolor: '#374151' },
  showlegend: true,
  legend: { x: 0.01, y: 0.99, bgcolor: 'rgba(0,0,0,0.4)', font: { size: 9, color: '#9ca3af' } },
};

const PLOT_CONFIG: Partial<Plotly.Config> = { responsive: true, displayModeBar: false };

/* ─────────────────────────────────────────────────────────────────
   Animated playback hook (shared by standalone sandboxes)
──────────────────────────────────────────────────────────────── */
function usePlayback(snapCount: number) {
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(60);
  const ref = useRef({ playing, idx, speed, snapCount });
  ref.current = { playing, idx, speed, snapCount };
  const animRef = useRef<number | null>(null);
  const lastRef = useRef(0);

  useEffect(() => {
    if (!playing || snapCount === 0) {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      return;
    }
    const tick = (now: number) => {
      const s = ref.current;
      if (!s.playing) return;
      if (now - lastRef.current >= s.speed) {
        lastRef.current = now;
        if (s.idx >= s.snapCount - 1) { setPlaying(false); return; }
        setIdx(p => p + 1);
      }
      animRef.current = requestAnimationFrame(tick);
    };
    lastRef.current = performance.now();
    animRef.current = requestAnimationFrame(tick);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [playing, snapCount]);

  const reset = useCallback(() => { setIdx(0); setPlaying(false); }, []);
  return { idx, setIdx, playing, setPlaying, speed, setSpeed, reset };
}

/* ═══════════════════════════════════════════════════════════════════
   1. HEAT SANDBOX (FDM 1D)
   Focus: α, Fourier number, stability
═══════════════════════════════════════════════════════════════════ */
function HeatSandbox() {
  const [N, setN] = useState(50);
  const [alpha, setAlpha] = useState(0.01);
  const [fourierTarget, setFourierTarget] = useState(0.4);
  const [icType, setIcType] = useState<'gaussian' | 'step'>('gaussian');
  const [nSteps, setNSteps] = useState(200);
  const [result, setResult] = useState<HeatResult | null>(null);
  const L = 1.0;
  const dx = L / N;
  const dtMax = heatMaxDt(dx, alpha);
  const dt = dtMax * fourierTarget / 0.5;
  const fourier = (alpha * dt) / (dx * dx);

  const pb = usePlayback(result?.snapshots.length ?? 0);

  const run = useCallback(() => {
    const T0 = icType === 'gaussian' ? initHeatGaussian(N, L, L / 2, 0.05) : initHeatStep(N, L, L * 0.4, L * 0.6);
    const cfg: HeatConfig = { N, L, alpha, dt, nSteps, bcLeft: 'fixed', bcRight: 'fixed', snapshotInterval: Math.max(1, Math.floor(nSteps / 100)) };
    const res = solveHeat1D(T0, cfg);
    setResult(res);
    pb.reset();
    requestAnimationFrame(() => pb.setPlaying(true));
  }, [N, alpha, dt, nSteps, icType, pb]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      const t = (e.target as HTMLElement)?.tagName;
      if (t === 'INPUT' || t === 'TEXTAREA' || t === 'SELECT') return;
      if (e.code === 'Space') { e.preventDefault(); if (!result) run(); else pb.setPlaying(p => !p); }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [run, result, pb]);

  const plotData = useMemo(() => {
    if (!result) return null;
    const snap = result.snapshots[pb.idx] ?? result.snapshots[0];
    const init = result.snapshots[0];
    const x = Array.from({ length: N }, (_, i) => (i + 0.5) * dx);
    return {
      traces: [
        { x, y: Array.from(init.T), type: 'scatter' as const, mode: 'lines' as const, name: 'T₀', line: { color: '#4b5563', dash: 'dash', width: 1.5 } },
        { x, y: Array.from(snap.T), type: 'scatter' as const, mode: 'lines' as const, name: `T (t=${snap.time.toFixed(4)})`, line: { color: '#f59e0b', width: 2.5 } },
      ] as Plotly.Data[],
      time: snap.time,
    };
  }, [result, pb.idx, N, dx]);

  return (
    <div className="flex flex-row-reverse h-full min-h-0">
      <aside className="w-48 shrink-0 border-l border-gray-800/50 overflow-y-auto p-3 space-y-3">
        <div className="text-[11px] font-semibold text-amber-400 mb-1 flex items-center gap-1.5"><Icon name="flame" className="text-amber-400" size={13} /> FDM Wärmeleitung</div>
        <div>
          <span className="text-[10px] text-gray-500">IC</span>
          <select value={icType} onChange={e => setIcType(e.target.value as 'gaussian' | 'step')}
            className="w-full bg-gray-800/60 border border-gray-700/50 rounded px-2 py-1 text-[11px] text-gray-300 mt-0.5">
            <option value="gaussian">Gauß-Puls</option>
            <option value="step">Stufe</option>
          </select>
        </div>
        <Slider label="N (Punkte)" value={N} min={10} max={200} step={1} onChange={setN} color="amber" />
        <Slider label="α (Diffusivität)" value={alpha} min={0.001} max={0.1} step={0.001} onChange={setAlpha} color="amber" />
        <Slider label="Fourier r" value={fourierTarget} min={0.05} max={0.8} step={0.01} onChange={setFourierTarget} color="amber" warn={fourier > 0.5} />
        <div className="flex items-center gap-1">
          <StatusBadge label={`r = ${fourier.toFixed(3)}`} ok={fourier <= 0.5} />
        </div>
        <Slider label="Zeitschritte" value={nSteps} min={50} max={2000} step={50} onChange={setNSteps} color="amber" />
        <RunBtn onClick={run} hasResult={!!result} />
        {result?.diverged && <div className="text-[10px] text-red-400 bg-red-900/20 rounded p-1.5"><Icon name="alert-triangle" className="text-red-400 inline-block mr-1" size={11} />Divergenz! r &gt; 0.5</div>}
        <FormulaBox tex={TEX_HEAT} label="PDE" />
      </aside>
      <div className="flex-1 flex flex-col min-w-0 min-h-0">
        <div className="flex-1 min-h-0 p-1">
          {plotData ? (
            <Plot data={plotData.traces}
              layout={{ ...PLOT_LAYOUT_BASE, xaxis: { ...PLOT_LAYOUT_BASE.xaxis, title: { text: 'x' } }, yaxis: { ...PLOT_LAYOUT_BASE.yaxis, title: { text: 'T' }, range: [-0.1, 1.2] } } as Plotly.Layout}
              config={PLOT_CONFIG} useResizeHandler style={{ width: '100%', height: '100%' }} />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center space-y-4">
                <svg width="220" height="120" viewBox="0 0 220 120" className="mx-auto">
                  {/* Stab */}
                  <rect x="20" y="45" width="180" height="30" rx="3" fill="none" stroke="#4b5563" strokeWidth="1.5" />
                  {/* Temperaturverlauf — Sinuskurve */}
                  <path d="M20,60 Q65,30 110,60 Q155,90 200,60" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="5 3" />
                  {/* T=0 links, T=0 rechts */}
                  <text x="12" y="65" textAnchor="end" fill="#6b7280" fontSize="9">T=0</text>
                  <text x="208" y="65" textAnchor="start" fill="#6b7280" fontSize="9">T=0</text>
                  {/* Gitterpunkte */}
                  {[20,50,80,110,140,170,200].map(cx => <circle key={cx} cx={cx} cy={60} r="2" fill="#f59e0b" opacity="0.6" />)}
                  {/* Pfeile für Wärmefluss */}
                  <text x="110" y="105" textAnchor="middle" fill="#6b7280" fontSize="9">← Wärmeleitung →</text>
                  <text x="110" y="25" textAnchor="middle" fill="#f59e0b" fontSize="9">T₀ = sin(πx)</text>
                </svg>
                <div>
                  <p className="text-xs text-gray-400 font-medium">1D Wärmeleitung (explizit)</p>
                  <p className="text-[10px] text-gray-600 mt-1">Anfangsverteilung diffundiert über Zeit — Fourier-Zahl bestimmt Stabilität</p>
                  <p className="text-[10px] text-gray-600 mt-1"><kbd className="px-1 py-0.5 bg-gray-800 rounded text-gray-400">Space</kbd> oder Starten</p>
                </div>
              </div>
            </div>
          )}
        </div>
        {result && (
          <div className="flex items-center gap-2 px-3 py-1.5 border-t border-gray-800/60 text-xs shrink-0">
            <button onClick={() => pb.setPlaying(p => !p)}
              className="w-7 h-7 flex items-center justify-center rounded bg-gray-800 hover:bg-gray-700 text-gray-300 text-[11px]">
              {pb.playing ? '⏸' : '▶'}
            </button>
            <input type="range" min={0} max={Math.max(0, (result?.snapshots.length ?? 1) - 1)} value={pb.idx}
              onChange={e => { pb.setPlaying(false); pb.setIdx(+e.target.value); }}
              className="flex-1 accent-amber-500" />
            <span className="text-gray-600 font-mono w-20 text-right text-[10px]">t={plotData?.time.toFixed(4) ?? '0'}</span>
            <select value={pb.speed} onChange={e => pb.setSpeed(+e.target.value)}
              className="bg-gray-800 border border-gray-700/50 rounded px-1 py-0.5 text-[10px] text-gray-400">
              <option value={120}>0.5×</option><option value={60}>1×</option><option value={30}>2×</option><option value={15}>4×</option>
            </select>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   2. STENCIL EXPLORER
   Focus: FD stencil visualization on sin(2πx)
═══════════════════════════════════════════════════════════════════ */
function StencilExplorer() {
  const [stencilKey, setStencilKey] = useState('central-1');
  const [evalPoint, setEvalPoint] = useState(0.5);
  const stencil = fdStencils[stencilKey];
  const N = 50;
  const dx = 1.0 / N;
  const f = (x: number) => Math.sin(2 * Math.PI * x);
  const fPrime = (x: number) => 2 * Math.PI * Math.cos(2 * Math.PI * x);
  const fPrimePrime = (x: number) => -4 * Math.PI * Math.PI * Math.sin(2 * Math.PI * x);
  const exactDeriv = stencil.derivOrder === 1 ? fPrime(evalPoint) : fPrimePrime(evalPoint);
  const fdApprox = stencil.weights.reduce((sum, w, k) => sum + w * f(evalPoint + stencil.offsets[k] * dx), 0) / (dx ** stencil.derivOrder);
  const error = Math.abs(fdApprox - exactDeriv);

  const formulaRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (formulaRef.current && stencil) {
      try { katex.render(stencil.formula, formulaRef.current, { displayMode: true, throwOnError: false }); } catch { /* */ }
    }
  }, [stencil]);

  const xArr = Array.from({ length: N + 1 }, (_, i) => i * dx);
  const yArr = xArr.map(f);
  const stencilX = stencil.offsets.map(o => evalPoint + o * dx);
  const stencilY = stencilX.map(f);

  return (
    <div className="flex flex-row-reverse h-full min-h-0">
      <aside className="w-52 shrink-0 border-l border-gray-800/50 overflow-y-auto p-3 space-y-3">
        <div className="text-[11px] font-semibold text-violet-400 mb-1 flex items-center gap-1.5"><Icon name="hexagon" className="text-violet-400" size={13} /> FD-Stencil Explorer</div>
        <div>
          <span className="text-[10px] text-gray-500">Stencil</span>
          <select value={stencilKey} onChange={e => setStencilKey(e.target.value)}
            className="w-full bg-gray-800/60 border border-gray-700/50 rounded px-2 py-1 text-[11px] text-gray-300 mt-0.5">
            {Object.entries(fdStencils).map(([k, s]) => (
              <option key={k} value={k}>{s.type} (d{s.derivOrder})</option>
            ))}
          </select>
        </div>
        <Slider label="Punkt x₀" value={evalPoint} min={0.1} max={0.9} step={0.01} onChange={setEvalPoint} color="violet" />
        <div ref={formulaRef} className="bg-gray-900/50 rounded p-2 overflow-x-auto text-[11px]" />
        <div className="text-[11px] space-y-1">
          <div className="flex justify-between text-gray-500"><span>Ordnung:</span><span className="text-violet-400">{stencil.order}</span></div>
          <div className="flex justify-between text-gray-500"><span>FD-Wert:</span><span className="text-gray-300 font-mono">{fdApprox.toFixed(6)}</span></div>
          <div className="flex justify-between text-gray-500"><span>Exakt:</span><span className="text-gray-300 font-mono">{exactDeriv.toFixed(6)}</span></div>
          <div className="flex justify-between text-gray-500"><span>Fehler:</span><span className="text-amber-400 font-mono">{error.toExponential(2)}</span></div>
        </div>
        <div className="text-[10px] text-gray-600">
          Gewichte: {stencil.offsets.map((o, i) => `[${o >= 0 ? '+' : ''}${o}]→${stencil.weights[i]}`).join(', ')}
        </div>
      </aside>
      <div className="flex-1 min-h-0 p-1">
        <Plot
          data={[
            { x: xArr, y: yArr, type: 'scatter', mode: 'lines', name: 'f(x) = sin(2πx)', line: { color: '#6b7280', width: 1.5 } },
            { x: stencilX, y: stencilY, type: 'scatter', mode: 'markers', name: 'Stencil-Punkte',
              marker: { color: '#8b5cf6', size: 10, symbol: 'diamond' } },
            { x: [evalPoint], y: [f(evalPoint)], type: 'scatter', mode: 'markers', name: 'x₀',
              marker: { color: '#f59e0b', size: 12, symbol: 'circle' } },
          ] as Plotly.Data[]}
          layout={{ ...PLOT_LAYOUT_BASE, xaxis: { ...PLOT_LAYOUT_BASE.xaxis, title: { text: 'x' } }, yaxis: { ...PLOT_LAYOUT_BASE.yaxis, title: { text: 'f(x)' } } } as Plotly.Layout}
          config={PLOT_CONFIG} useResizeHandler style={{ width: '100%', height: '100%' }} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   3. CONVECTION SANDBOX (pure convection, no diffusion)
   Focus: Scheme (UDS/CDS), IC, u, CFL
═══════════════════════════════════════════════════════════════════ */
function ConvectionSandbox() {
  const { state, dispatch, runSimulation } = useSimulation();

  useEffect(() => { dispatch({ type: 'SET_PARAM', key: 'gamma', value: 0 }); }, [dispatch]);

  const schemes: { v: SchemeName; l: string }[] = [
    { v: 'UDS', l: 'UDS (Upwind)' }, { v: 'CDS', l: 'CDS (Central)' },
  ];
  const ics: { v: InitialConditionType; l: string }[] = [
    { v: 'step', l: 'Sprung' }, { v: 'gaussian', l: 'Gauß-Puls' }, { v: 'sine', l: 'Sinus' },
  ];

  return (
    <div className="flex flex-row-reverse h-full min-h-0">
      <aside className="w-48 shrink-0 border-l border-gray-800/50 overflow-y-auto p-3 space-y-3">
        <div className="text-[11px] font-semibold text-cyan-400 mb-1 flex items-center gap-1.5"><Icon name="arrow-right" className="text-cyan-400" size={13} /> 1D Konvektion (FVM)</div>
        <SelectField label="Schema" value={state.scheme} options={schemes.map(s => ({ v: s.v, l: s.l }))}
          onChange={v => dispatch({ type: 'SET_SCHEME', scheme: v as SchemeName })} />
        <SelectField label="IC" value={state.ic.type} options={ics.map(ic => ({ v: ic.v, l: ic.l }))}
          onChange={v => dispatch({ type: 'SET_IC', ic: { ...state.ic, type: v as InitialConditionType } })} />
        <Slider label="N (Zellen)" value={state.N} min={20} max={500} step={10} onChange={v => dispatch({ type: 'SET_PARAM', key: 'N', value: v })} />
        <Slider label="u (Geschw.)" value={state.u} min={0.1} max={3} step={0.1} onChange={v => dispatch({ type: 'SET_PARAM', key: 'u', value: v })} />
        <Slider label="CFL" value={state.cfl} min={0.1} max={1.5} step={0.05} onChange={v => dispatch({ type: 'SET_PARAM', key: 'cfl', value: v })} warn={state.cfl > 1} />
        <StatusBadge label={`CFL = ${state.cfl.toFixed(2)}`} ok={state.cfl <= 1} />
        <RunBtn onClick={runSimulation} hasResult={state.hasRun} />
        {state.diverged && <DivergenceMsg />}
        <FormulaBox tex={TEX_CONV} label="PDE" />
      </aside>
      <div className="flex-1 flex flex-col min-w-0 min-h-0">
        <div className="flex-1 min-h-0 p-1"><FVMPlot /></div>
        {(state.history?.snapshots.length ?? 0) > 0 && <FVMPlaybackBar />}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   4. CONVECTION-DIFFUSION SANDBOX
   Focus: u, Γ, Peclet number, CFL
═══════════════════════════════════════════════════════════════════ */
function ConvDiffSandbox() {
  const { state, dispatch, runSimulation } = useSimulation();

  const schemes: { v: SchemeName; l: string }[] = [
    { v: 'UDS', l: 'UDS' }, { v: 'CDS', l: 'CDS' }, { v: 'TVD-minmod', l: 'TVD minmod' }, { v: 'TVD-vanLeer', l: 'TVD van Leer' },
  ];

  return (
    <div className="flex flex-row-reverse h-full min-h-0">
      <aside className="w-48 shrink-0 border-l border-gray-800/50 overflow-y-auto p-3 space-y-3">
        <div className="text-[11px] font-semibold text-emerald-400 mb-1 flex items-center gap-1.5"><Icon name="refresh" className="text-emerald-400" size={13} /> Konvektion-Diffusion</div>
        <SelectField label="Schema" value={state.scheme} options={schemes.map(s => ({ v: s.v, l: s.l }))}
          onChange={v => dispatch({ type: 'SET_SCHEME', scheme: v as SchemeName })} />
        <Slider label="u (Konvektion)" value={state.u} min={0} max={3} step={0.1} onChange={v => dispatch({ type: 'SET_PARAM', key: 'u', value: v })} color="emerald" />
        <Slider label="Γ (Diffusion)" value={state.gamma} min={0} max={0.1} step={0.001} onChange={v => dispatch({ type: 'SET_PARAM', key: 'gamma', value: v })} color="emerald" />
        <Slider label="CFL" value={state.cfl} min={0.1} max={1.5} step={0.05} onChange={v => dispatch({ type: 'SET_PARAM', key: 'cfl', value: v })} color="emerald" warn={state.cfl > 1} />
        <div className="flex flex-wrap gap-1">
          <StatusBadge label={`CFL = ${state.cfl.toFixed(2)}`} ok={state.cfl <= 1} />
          <StatusBadge label={`Pe = ${state.peclet === Infinity ? '∞' : state.peclet.toFixed(1)}`} ok={state.peclet < 2 || state.peclet === Infinity} />
        </div>
        <RunBtn onClick={runSimulation} hasResult={state.hasRun} />
        {state.diverged && <DivergenceMsg />}
        <FormulaBox tex={TEX_CONVDIFF} label="PDE" />
      </aside>
      <div className="flex-1 flex flex-col min-w-0 min-h-0">
        <div className="flex-1 min-h-0 p-1"><FVMPlot /></div>
        {(state.history?.snapshots.length ?? 0) > 0 && <FVMPlaybackBar />}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   6. SCHEME COMPARE — All schemes, comparison focused
═══════════════════════════════════════════════════════════════════ */
function SchemeCompareSandbox() {
  const { state, dispatch, runSimulation } = useSimulation();

  useEffect(() => { dispatch({ type: 'SET_PARAM', key: 'gamma', value: 0 }); }, [dispatch]);

  const all: { v: SchemeName; l: string }[] = [
    { v: 'UDS', l: 'UDS' }, { v: 'CDS', l: 'CDS' }, { v: 'TVD-minmod', l: 'minmod' },
    { v: 'TVD-vanLeer', l: 'van Leer' }, { v: 'TVD-superbee', l: 'Superbee' },
  ];

  return (
    <div className="flex flex-row-reverse h-full min-h-0">
      <aside className="w-48 shrink-0 border-l border-gray-800/50 overflow-y-auto p-3 space-y-3">
        <div className="text-[11px] font-semibold text-sky-400 mb-1 flex items-center gap-1.5"><Icon name="bar-chart" className="text-sky-400" size={13} /> Schema-Vergleich</div>
        <SelectField label="Primär" value={state.scheme} options={all.map(s => ({ v: s.v, l: s.l }))}
          onChange={v => dispatch({ type: 'SET_SCHEME', scheme: v as SchemeName })} />
        <div>
          <span className="text-[10px] text-gray-500">Vergleich</span>
          <select value={state.compareScheme ?? ''} onChange={e => dispatch({ type: 'SET_COMPARE_SCHEME', scheme: e.target.value ? e.target.value as SchemeName : null })}
            className="w-full bg-gray-800/60 border border-gray-700/50 rounded px-2 py-1 text-[11px] text-gray-300 mt-0.5">
            <option value="">— kein —</option>
            {all.filter(s => s.v !== state.scheme).map(s => <option key={s.v} value={s.v}>{s.l}</option>)}
          </select>
        </div>
        <SelectField label="IC" value={state.ic.type}
          options={[{ v: 'step', l: 'Sprung' }, { v: 'gaussian', l: 'Gauß' }, { v: 'sine', l: 'Sinus' }, { v: 'triangle', l: 'Dreieck' }]}
          onChange={v => dispatch({ type: 'SET_IC', ic: { ...state.ic, type: v as InitialConditionType } })} />
        <Slider label="N" value={state.N} min={20} max={500} step={10} onChange={v => dispatch({ type: 'SET_PARAM', key: 'N', value: v })} color="sky" />
        <Slider label="CFL" value={state.cfl} min={0.1} max={1.0} step={0.05} onChange={v => dispatch({ type: 'SET_PARAM', key: 'cfl', value: v })} color="sky" />
        <RunBtn onClick={runSimulation} hasResult={state.hasRun} />
        <FormulaBox tex={TEX_CONV} label="PDE" />
      </aside>
      <div className="flex-1 flex flex-col min-w-0 min-h-0">
        <div className="flex-1 min-h-0 p-1"><FVMPlot /></div>
        {(state.history?.snapshots.length ?? 0) > 0 && <FVMPlaybackBar />}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   7. CFL SANDBOX — Big CFL display
═══════════════════════════════════════════════════════════════════ */
function CFLSandbox() {
  const { state, dispatch, runSimulation } = useSimulation();

  useEffect(() => { dispatch({ type: 'SET_PARAM', key: 'gamma', value: 0 }); }, [dispatch]);

  return (
    <div className="flex flex-row-reverse h-full min-h-0">
      <aside className="w-48 shrink-0 border-l border-gray-800/50 overflow-y-auto p-3 space-y-3">
        <div className="text-[11px] font-semibold text-amber-400 mb-1 flex items-center gap-1.5"><Icon name="clock" className="text-amber-400" size={13} /> CFL-Bedingung</div>
        <BigNumber value={state.cfl.toFixed(2)} label="CFL = |u|·Δt/Δx" ok={state.cfl <= 1} />
        <Slider label="CFL" value={state.cfl} min={0.1} max={2.0} step={0.05} onChange={v => dispatch({ type: 'SET_PARAM', key: 'cfl', value: v })} color="amber" warn={state.cfl > 1} />
        <Slider label="u" value={state.u} min={0.1} max={3} step={0.1} onChange={v => dispatch({ type: 'SET_PARAM', key: 'u', value: v })} color="amber" />
        <Slider label="N" value={state.N} min={20} max={200} step={10} onChange={v => dispatch({ type: 'SET_PARAM', key: 'N', value: v })} color="amber" />
        <div className="text-[10px] text-gray-600">Δt = {state.dt.toExponential(2)}, Δx = {state.grid.dx.toFixed(4)}</div>
        <RunBtn onClick={runSimulation} hasResult={state.hasRun} />
        {state.diverged && <div className="text-[10px] text-red-400 bg-red-900/20 rounded p-1.5"><Icon name="explosion" className="text-red-400 inline-block mr-1" size={11} />Instabil! CFL &gt; 1</div>}
        <FormulaBox tex={TEX_CFL} label="Stabilitätskriterium" />
      </aside>
      <div className="flex-1 flex flex-col min-w-0 min-h-0">
        <div className="flex-1 min-h-0 p-1"><FVMPlot /></div>
        {(state.history?.snapshots.length ?? 0) > 0 && <FVMPlaybackBar />}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   8. PECLET SANDBOX — Peclet number front and center
═══════════════════════════════════════════════════════════════════ */
function PecletSandbox() {
  const { state, dispatch, runSimulation } = useSimulation();

  return (
    <div className="flex flex-row-reverse h-full min-h-0">
      <aside className="w-48 shrink-0 border-l border-gray-800/50 overflow-y-auto p-3 space-y-3">
        <div className="text-[11px] font-semibold text-orange-400 mb-1 flex items-center gap-1.5"><Icon name="thermometer" className="text-orange-400" size={13} /> Peclet-Zahl</div>
        <BigNumber value={state.peclet === Infinity ? '∞' : state.peclet.toFixed(1)} label="Pe = |u|·Δx/Γ"
          ok={state.peclet < 2 || state.peclet === Infinity} />
        <Slider label="u (Konvektion)" value={state.u} min={0} max={3} step={0.1} onChange={v => dispatch({ type: 'SET_PARAM', key: 'u', value: v })} color="orange" />
        <Slider label="Γ (Diffusion)" value={state.gamma} min={0} max={0.1} step={0.001} onChange={v => dispatch({ type: 'SET_PARAM', key: 'gamma', value: v })} color="orange" />
        <Slider label="N" value={state.N} min={20} max={500} step={10} onChange={v => dispatch({ type: 'SET_PARAM', key: 'N', value: v })} color="orange" />
        <Slider label="CFL" value={state.cfl} min={0.1} max={1.0} step={0.05} onChange={v => dispatch({ type: 'SET_PARAM', key: 'cfl', value: v })} color="orange" />
        <SelectField label="Schema" value={state.scheme}
          options={[{ v: 'UDS', l: 'UDS' }, { v: 'CDS', l: 'CDS' }, { v: 'TVD-minmod', l: 'TVD minmod' }, { v: 'TVD-vanLeer', l: 'TVD van Leer' }]}
          onChange={v => dispatch({ type: 'SET_SCHEME', scheme: v as SchemeName })} />
        <RunBtn onClick={runSimulation} hasResult={state.hasRun} />
        <FormulaBox tex={TEX_PE} label="Kennzahl" />
      </aside>
      <div className="flex-1 flex flex-col min-w-0 min-h-0">
        <div className="flex-1 min-h-0 p-1"><FVMPlot /></div>
        {(state.history?.snapshots.length ?? 0) > 0 && <FVMPlaybackBar />}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Placeholder components
═══════════════════════════════════════════════════════════════════ */
function ComingSoon({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center h-full text-gray-600">
      <div className="text-center">
        <Icon name="construction" className="text-gray-600 mx-auto mb-2" size={28} />
        <p className="text-xs font-medium text-gray-500">{label}</p>
        <p className="text-[10px] text-gray-700 mt-1">Wird bald interaktiv.</p>
      </div>
    </div>
  );
}

function PlaceholderMsg({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <Icon name={icon} className="text-gray-700 mx-auto mb-1" size={24} />
        <p className="text-[11px] text-gray-700">{text}</p>
      </div>
    </div>
  );
}

function DivergenceMsg() {
  return <div className="text-[10px] text-red-400 bg-red-900/20 rounded p-1.5"><Icon name="alert-triangle" className="text-red-400 inline-block mr-1" size={11} />Divergenz!</div>;
}

function BigNumber({ value, label, ok }: { value: string; label: string; ok: boolean }) {
  return (
    <div className={`text-center py-3 rounded-lg border ${ok ? 'border-emerald-500/30 bg-emerald-900/10' : 'border-red-500/50 bg-red-900/20'}`}>
      <div className="text-2xl font-bold tabular-nums" style={{ color: ok ? '#34d399' : '#f87171' }}>{value}</div>
      <div className="text-[10px] text-gray-500 mt-0.5">{label}</div>
    </div>
  );
}

function SelectField({ label, value, options, onChange }: { label: string; value: string; options: { v: string; l: string }[]; onChange: (v: string) => void }) {
  return (
    <div>
      <span className="text-[10px] text-gray-500">{label}</span>
      <select value={value} onChange={e => onChange(e.target.value)}
        className="w-full bg-gray-800/60 border border-gray-700/50 rounded px-2 py-1 text-[11px] text-gray-300 mt-0.5">
        {options.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
      </select>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Shared FVM Plot + Playback (uses SimulationContext)
──────────────────────────────────────────────────────────────── */

function FVMPlot() {
  const { state } = useSimulation();
  const { history, compareHistory, currentSnapshotIdx, grid, scheme, compareScheme, diverged } = state;

  const plotData = useMemo(() => {
    if (!history || history.snapshots.length === 0) return null;
    const x = Array.from(grid.xCell);
    const snap = history.snapshots[currentSnapshotIdx] ?? history.snapshots[history.snapshots.length - 1];
    const init = history.snapshots[0];
    const traces: Plotly.Data[] = [
      { x, y: Array.from(init.phi), type: 'scatter', mode: 'lines', name: 'IC', line: { color: '#4b5563', dash: 'dash', width: 1.5 } },
      { x, y: Array.from(snap.phi), type: 'scatter', mode: 'lines', name: `${scheme} (t=${snap.time.toFixed(4)})`, line: { color: '#06b6d4', width: 2.5 } },
    ];
    if (compareHistory && compareScheme) {
      const cs = compareHistory.snapshots[Math.min(currentSnapshotIdx, compareHistory.snapshots.length - 1)];
      if (cs) traces.push({ x, y: Array.from(cs.phi), type: 'scatter', mode: 'lines', name: `${compareScheme}`, line: { color: '#f59e0b', width: 2.5 } });
    }
    return traces;
  }, [history, compareHistory, currentSnapshotIdx, grid, scheme, compareScheme]);

  if (!plotData) return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center space-y-4">
        <svg width="220" height="130" viewBox="0 0 220 130" className="mx-auto">
          {/* Achse */}
          <line x1="20" y1="100" x2="200" y2="100" stroke="#4b5563" strokeWidth="1" />
          {/* Rechteckpuls IC */}
          <path d="M20,100 L20,100 L70,100 L70,35 L130,35 L130,100 L200,100" fill="none" stroke="#06b6d4" strokeWidth="2.5" />
          {/* Transportierte Welle (verschoben + verschmiert) */}
          <path d="M20,100 Q95,100 105,55 Q115,35 130,35 Q145,35 155,55 Q165,100 200,100" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="5 3" />
          {/* Pfeil für Transportrichtung */}
          <line x1="80" y1="20" x2="140" y2="20" stroke="#6b7280" strokeWidth="1.5" />
          <polygon points="140,16 150,20 140,24" fill="#6b7280" />
          <text x="110" y="15" textAnchor="middle" fill="#6b7280" fontSize="9">u · ∂φ/∂x</text>
          <text x="75" y="50" textAnchor="end" fill="#06b6d4" fontSize="9">IC</text>
          <text x="165" y="65" textAnchor="start" fill="#f59e0b" fontSize="9">t &gt; 0</text>
        </svg>
        <div>
          <p className="text-xs text-gray-400 font-medium">Schema-Vergleich (Konvektion/Diffusion)</p>
          <p className="text-[10px] text-gray-600 mt-1">Vergleiche UDS, CDS, TVD — numerische vs. physikalische Diffusion</p>
          <p className="text-[10px] text-gray-600 mt-1"><kbd className="px-1 py-0.5 bg-gray-800 rounded text-gray-400">Space</kbd> oder Starten</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {diverged && <div className="text-center text-[10px] text-red-400 font-bold animate-pulse pt-1">DIVERGIERT</div>}
      <Plot data={plotData}
        layout={{ ...PLOT_LAYOUT_BASE, xaxis: { ...PLOT_LAYOUT_BASE.xaxis, title: { text: 'x' } }, yaxis: { ...PLOT_LAYOUT_BASE.yaxis, title: { text: 'φ' } } } as Plotly.Layout}
        config={PLOT_CONFIG} useResizeHandler style={{ width: '100%', height: '100%' }} />
    </>
  );
}

function FVMPlaybackBar() {
  const { state, dispatch, runSimulation, togglePlayback } = useSimulation();
  const n = state.history?.snapshots.length ?? 0;
  const snap = state.history?.snapshots[state.currentSnapshotIdx];
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 border-t border-gray-800/60 text-xs shrink-0">
      <button onClick={togglePlayback}
        className="w-7 h-7 flex items-center justify-center rounded bg-gray-800 hover:bg-gray-700 text-gray-300 text-[11px]">
        {state.isRunning ? '⏳' : state.isPlaying ? '⏸' : '▶'}
      </button>
      <input type="range" min={0} max={Math.max(0, n - 1)} value={state.currentSnapshotIdx}
        onChange={e => { dispatch({ type: 'SET_PLAYING', playing: false }); dispatch({ type: 'SET_SNAPSHOT_IDX', idx: +e.target.value }); }}
        className="flex-1 accent-cyan-500" />
      <span className="text-gray-600 font-mono w-20 text-right text-[10px]">t={snap?.time.toFixed(4) ?? '0'}</span>
      <button onClick={runSimulation} disabled={state.isRunning}
        className="px-1.5 py-0.5 rounded bg-gray-800 hover:bg-gray-700 text-[10px] text-gray-500 disabled:opacity-40">↻</button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   9. 2D SCALAR TRANSPORT — Heatmap + velocity field
═══════════════════════════════════════════════════════════════════ */

function make2DVelocityField(
  Nx: number, Ny: number, Lx: number, Ly: number,
  vType: 'uniform' | 'rotating' | 'shear'
) {
  const n = Nx * Ny;
  const uField = new Float64Array(n);
  const vField = new Float64Array(n);
  const dx = Lx / Nx;
  const dy = Ly / Ny;

  for (let j = 0; j < Ny; j++) {
    for (let i = 0; i < Nx; i++) {
      const idx = j * Nx + i;
      const x = (i + 0.5) * dx;
      const y = (j + 0.5) * dy;
      switch (vType) {
        case 'uniform':
          uField[idx] = 1.0;
          vField[idx] = 0.5;
          break;
        case 'rotating': {
          const cx = Lx / 2, cy = Ly / 2;
          uField[idx] = -(y - cy);
          vField[idx] = (x - cx);
          break;
        }
        case 'shear':
          uField[idx] = Math.sin(Math.PI * y / Ly);
          vField[idx] = 0;
          break;
      }
    }
  }
  return { uField, vField };
}

interface Snapshot2D { phi: Float64Array; time: number }

function ScalarTransport2DSandbox() {
  const [Nx, setNx] = useState(50);
  const [gamma, setGamma] = useState(0.005);
  const [vType, setVType] = useState<'uniform' | 'rotating' | 'shear'>('rotating');
  const [icType, setIcType] = useState<IC2DType>('gaussian-blob');
  const [nSteps, setNSteps] = useState(300);
  const [scheme, setScheme] = useState<SchemeName>('UDS');
  const [snapshots, setSnapshots] = useState<Snapshot2D[] | null>(null);
  const pb = usePlayback(snapshots?.length ?? 0);
  const Ny = Nx;
  const Lx = 1;
  const Ly = 1;

  const run = useCallback(() => {
    const grid = createGrid2D(Nx, Ny, Lx, Ly);
    const { uField, vField } = make2DVelocityField(Nx, Ny, Lx, Ly, vType);
    let phi = initField2D(grid.xCell, grid.yCell, Lx, Ly, Nx, Ny, icType);

    // CFL-based dt
    let uMax = 0;
    for (let i = 0; i < uField.length; i++) {
      const s = Math.abs(uField[i]) + Math.abs(vField[i]);
      if (s > uMax) uMax = s;
    }
    const dt = Math.min(0.4 * grid.dx / Math.max(uMax, 1e-10), gamma > 0 ? 0.25 * grid.dx * grid.dx / gamma : 1e10);

    const config: SimConfig2D = { grid, uField, vField, dt, gamma, scheme, nSteps, snapshotInterval: 1 };
    const snaps: Snapshot2D[] = [{ phi: new Float64Array(phi), time: 0 }];
    let time = 0;

    const interval = Math.max(1, Math.floor(nSteps / 120));
    for (let step = 1; step <= nSteps; step++) {
      phi = step2DScalarTransport(phi, config);
      time += dt;
      if (!fieldIsValid(phi)) {
        snaps.push({ phi: new Float64Array(phi), time });
        break;
      }
      if (step % interval === 0 || step === nSteps) {
        snaps.push({ phi: new Float64Array(phi), time });
      }
    }
    setSnapshots(snaps);
    pb.reset();
    requestAnimationFrame(() => pb.setPlaying(true));
  }, [Nx, Ny, gamma, vType, icType, nSteps, scheme, pb]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      const t = (e.target as HTMLElement)?.tagName;
      if (t === 'INPUT' || t === 'TEXTAREA' || t === 'SELECT') return;
      if (e.code === 'Space') { e.preventDefault(); if (!snapshots) run(); else pb.setPlaying(p => !p); }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [run, snapshots, pb]);

  const plotData = useMemo(() => {
    if (!snapshots) return null;
    const snap = snapshots[pb.idx] ?? snapshots[0];
    // Convert flat array to 2D z matrix (row j = y, col i = x)
    const z: number[][] = [];
    for (let j = 0; j < Ny; j++) {
      const row: number[] = [];
      for (let i = 0; i < Nx; i++) {
        row.push(snap.phi[j * Nx + i]);
      }
      z.push(row);
    }
    const dx = Lx / Nx;
    const dy = Ly / Ny;
    const x = Array.from({ length: Nx }, (_, i) => (i + 0.5) * dx);
    const y = Array.from({ length: Ny }, (_, j) => (j + 0.5) * dy);
    return { z, x, y, time: snap.time };
  }, [snapshots, pb.idx, Nx, Ny]);

  return (
    <div className="flex flex-row-reverse h-full min-h-0">
      <aside className="w-48 shrink-0 border-l border-gray-800/50 overflow-y-auto p-3 space-y-3">
        <div className="text-[11px] font-semibold text-sky-400 mb-1 flex items-center gap-1.5">
          <Icon name="map" className="text-sky-400" size={13} /> 2D Skalartransport
        </div>
        <SelectField label="Geschwindigkeitsfeld" value={vType}
          options={[{ v: 'rotating', l: 'Rotation' }, { v: 'uniform', l: 'Uniform' }, { v: 'shear', l: 'Scherung' }]}
          onChange={v => setVType(v as 'uniform' | 'rotating' | 'shear')} />
        <SelectField label="IC" value={icType}
          options={[{ v: 'gaussian-blob', l: 'Gauß-Blob' }, { v: 'step-x', l: 'Stufe (x)' }, { v: 'diagonal', l: 'Diagonal' }]}
          onChange={v => setIcType(v as IC2DType)} />
        <SelectField label="Schema" value={scheme}
          options={[{ v: 'UDS', l: 'UDS' }, { v: 'CDS', l: 'CDS' }]}
          onChange={v => setScheme(v as SchemeName)} />
        <Slider label="N (pro Achse)" value={Nx} min={20} max={100} step={5} onChange={setNx} color="sky" />
        <Slider label="Γ (Diffusion)" value={gamma} min={0} max={0.05} step={0.001} onChange={setGamma} color="sky" />
        <Slider label="Zeitschritte" value={nSteps} min={50} max={1000} step={50} onChange={setNSteps} color="sky" />
        <RunBtn onClick={run} hasResult={!!snapshots} />
        <FormulaBox tex={TEX_SCALAR2D} label="PDE" />
      </aside>
      <div className="flex-1 flex flex-col min-w-0 min-h-0">
        <div className="flex-1 min-h-0 p-1">
          {plotData ? (
            <Plot
              data={[{
                z: plotData.z,
                x: plotData.x,
                y: plotData.y,
                type: 'heatmap',
                colorscale: 'Viridis',
                zmin: 0,
                zmax: 1,
                colorbar: { thickness: 12, len: 0.8, tickfont: { size: 9, color: '#6b7280' } },
              }] as Plotly.Data[]}
              layout={{
                ...PLOT_LAYOUT_BASE,
                xaxis: { ...PLOT_LAYOUT_BASE.xaxis, title: { text: 'x' }, scaleanchor: 'y' },
                yaxis: { ...PLOT_LAYOUT_BASE.yaxis, title: { text: 'y' } },
              } as Plotly.Layout}
              config={PLOT_CONFIG}
              useResizeHandler
              style={{ width: '100%', height: '100%' }}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center space-y-4">
                <svg width="180" height="180" viewBox="0 0 180 180" className="mx-auto">
                  {/* Grid */}
                  {[0,1,2,3,4,5,6].map(i => <line key={`v${i}`} x1={25+i*22} y1={20} x2={25+i*22} y2={152} stroke="#374151" strokeWidth="0.5" />)}
                  {[0,1,2,3,4,5,6].map(j => <line key={`h${j}`} x1={25} y1={20+j*22} x2={157} y2={20+j*22} stroke="#374151" strokeWidth="0.5" />)}
                  {/* Gausssche Hügel als Kreis */}
                  <circle cx="60" cy="86" r="20" fill="none" stroke="#06b6d4" strokeWidth="2" />
                  <circle cx="60" cy="86" r="10" fill="#06b6d4" opacity="0.15" />
                  <circle cx="60" cy="86" r="3" fill="#06b6d4" opacity="0.5" />
                  {/* Geschwindigkeits-Pfeil */}
                  <line x1="60" y1="86" x2="120" y2="65" stroke="#f59e0b" strokeWidth="1.5" />
                  <polygon points="120,60 125,68 117,67" fill="#f59e0b" />
                  <text x="100" y="58" textAnchor="middle" fill="#f59e0b" fontSize="9">u⃗</text>
                  <text x="60" y="120" textAnchor="middle" fill="#06b6d4" fontSize="9">φ₀ (Gauß)</text>
                </svg>
                <div>
                  <p className="text-xs text-gray-400 font-medium">2D Skalartransport</p>
                  <p className="text-[10px] text-gray-600 mt-1">Gauß-Hügel wird durch Geschwindigkeitsfeld transportiert</p>
                  <p className="text-[10px] text-gray-600 mt-1"><kbd className="px-1 py-0.5 bg-gray-800 rounded text-gray-400">Space</kbd> oder Starten</p>
                </div>
              </div>
            </div>
          )}
        </div>
        {snapshots && (
          <div className="flex items-center gap-2 px-3 py-1.5 border-t border-gray-800/60 text-xs shrink-0">
            <button onClick={() => pb.setPlaying(p => !p)}
              className="w-7 h-7 flex items-center justify-center rounded bg-gray-800 hover:bg-gray-700 text-gray-300 text-[11px]">
              {pb.playing ? '⏸' : '▶'}
            </button>
            <input type="range" min={0} max={Math.max(0, snapshots.length - 1)} value={pb.idx}
              onChange={e => { pb.setPlaying(false); pb.setIdx(+e.target.value); }}
              className="flex-1 accent-sky-500" />
            <span className="text-gray-600 font-mono w-20 text-right text-[10px]">t={plotData?.time.toFixed(4) ?? '0'}</span>
            <select value={pb.speed} onChange={e => pb.setSpeed(+e.target.value)}
              className="bg-gray-800 border border-gray-700/50 rounded px-1 py-0.5 text-[10px] text-gray-400">
              <option value={120}>0.5×</option><option value={60}>1×</option><option value={30}>2×</option><option value={15}>4×</option>
            </select>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   10. CAVITY SANDBOX — Lid-Driven Cavity (Vorticity-Streamfunction)
   2D incompressible Navier-Stokes via ω-ψ formulation
═══════════════════════════════════════════════════════════════════ */

interface CavityResult {
  u: Float64Array;   // x-velocity
  v: Float64Array;   // y-velocity
  p: Float64Array;   // pressure (recovered)
  w: Float64Array;   // vorticity
  psi: Float64Array; // streamfunction
  Nx: number;
  Ny: number;
  Lx: number;
  Ly: number;
  converged: boolean;
  residuals: number[];
}

function solveCavity(
  Nx: number, Ny: number, Re: number, uLid: number, nIter: number, _alpha: number
): CavityResult {
  const Lx = 1, Ly = 1;
  const dx = Lx / (Nx - 1), dy = Ly / (Ny - 1);
  const nu = uLid * Lx / Re;
  const n = Nx * Ny;

  const w   = new Float64Array(n); // vorticity
  const psi = new Float64Array(n); // streamfunction
  const u   = new Float64Array(n); // velocity
  const v   = new Float64Array(n);
  const residuals: number[] = [];

  const idx = (i: number, j: number) => j * Nx + i;

  // Time step — can be more aggressive with upwind
  const dt = Math.min(0.25 * Re * dx * dx, 0.5 * dx / uLid, 0.25 * dx * dx / nu);

  for (let iter = 0; iter < nIter; iter++) {
    // ─── 1. Solve Poisson: ∇²ψ = -ω (GS with SOR) ───
    for (let gs = 0; gs < 50; gs++) {
      for (let j = 1; j < Ny - 1; j++) {
        for (let i = 1; i < Nx - 1; i++) {
          const c = idx(i, j);
          const psiNew = (
            (psi[idx(i + 1, j)] + psi[idx(i - 1, j)]) / (dx * dx) +
            (psi[idx(i, j + 1)] + psi[idx(i, j - 1)]) / (dy * dy) +
            w[c]
          ) / (2 / (dx * dx) + 2 / (dy * dy));
          psi[c] = psi[c] + 1.5 * (psiNew - psi[c]); // SOR ω=1.5
        }
      }
      // ψ = 0 on all boundaries (already zero-initialized, enforce again)
      for (let i = 0; i < Nx; i++) { psi[idx(i, 0)] = 0; psi[idx(i, Ny - 1)] = 0; }
      for (let j = 0; j < Ny; j++) { psi[idx(0, j)] = 0; psi[idx(Nx - 1, j)] = 0; }
    }

    // ─── 2. Recover velocities: u=∂ψ/∂y, v=−∂ψ/∂x ───
    for (let j = 1; j < Ny - 1; j++) {
      for (let i = 1; i < Nx - 1; i++) {
        const c = idx(i, j);
        u[c] = (psi[idx(i, j + 1)] - psi[idx(i, j - 1)]) / (2 * dy);
        v[c] = -(psi[idx(i + 1, j)] - psi[idx(i - 1, j)]) / (2 * dx);
      }
    }
    // Velocity BCs
    for (let i = 0; i < Nx; i++) {
      u[idx(i, 0)] = 0; v[idx(i, 0)] = 0;           // bottom
      u[idx(i, Ny - 1)] = uLid; v[idx(i, Ny - 1)] = 0; // top lid
    }
    for (let j = 0; j < Ny; j++) {
      u[idx(0, j)] = 0; v[idx(0, j)] = 0;            // left
      u[idx(Nx - 1, j)] = 0; v[idx(Nx - 1, j)] = 0;  // right
    }

    // ─── 3. Vorticity BCs (Thom's formula from no-slip) ───
    for (let i = 1; i < Nx - 1; i++) {
      // bottom wall
      w[idx(i, 0)] = -2 * psi[idx(i, 1)] / (dy * dy);
      // top wall (lid moving at uLid)
      w[idx(i, Ny - 1)] = -2 * psi[idx(i, Ny - 2)] / (dy * dy) - 2 * uLid / dy;
    }
    for (let j = 1; j < Ny - 1; j++) {
      // left wall
      w[idx(0, j)] = -2 * psi[idx(1, j)] / (dx * dx);
      // right wall
      w[idx(Nx - 1, j)] = -2 * psi[idx(Nx - 2, j)] / (dx * dx);
    }

    // ─── 4. Transport vorticity: ∂ω/∂t + u·∇ω = ν∇²ω ───
    const wOld = new Float64Array(w);
    let maxDw = 0;
    for (let j = 1; j < Ny - 1; j++) {
      for (let i = 1; i < Nx - 1; i++) {
        const c = idx(i, j);
        const uc = u[c], vc = v[c];
        const wE = wOld[idx(i + 1, j)], wW = wOld[idx(i - 1, j)];
        const wN = wOld[idx(i, j + 1)], wS = wOld[idx(i, j - 1)];
        const wC = wOld[c];

        // Upwind convection
        const dwdx = uc > 0 ? uc * (wC - wW) / dx : uc * (wE - wC) / dx;
        const dwdy = vc > 0 ? vc * (wC - wS) / dy : vc * (wN - wC) / dy;

        // Central diffusion
        const lapW = (wE - 2 * wC + wW) / (dx * dx) + (wN - 2 * wC + wS) / (dy * dy);

        w[c] = wC + dt * (-(dwdx + dwdy) + nu * lapW);
        maxDw = Math.max(maxDw, Math.abs(w[c] - wC));
      }
    }

    residuals.push(maxDw);
    if (maxDw < 1e-7) {
      return buildResult(u, v, w, psi, Nx, Ny, Lx, Ly, dx, dy, nu, true, residuals);
    }
  }

  return buildResult(u, v, w, psi, Nx, Ny, Lx, Ly, dx, dy, nu, false, residuals);
}

/** Recover pressure field from converged velocity via Poisson: ∇²p = RHS */
function buildResult(
  u: Float64Array, v: Float64Array, w: Float64Array, psi: Float64Array,
  Nx: number, Ny: number, Lx: number, Ly: number,
  dx: number, dy: number, nu: number,
  converged: boolean, residuals: number[]
): CavityResult {
  const n = Nx * Ny;
  const p = new Float64Array(n);
  const idx = (i: number, j: number) => j * Nx + i;

  // Pressure Poisson: ∇²p = -( (∂u/∂x)² + 2·∂v/∂x·∂u/∂y + (∂v/∂y)² )
  const rhs = new Float64Array(n);
  for (let j = 1; j < Ny - 1; j++) {
    for (let i = 1; i < Nx - 1; i++) {
      const c = idx(i, j);
      const dudx = (u[idx(i + 1, j)] - u[idx(i - 1, j)]) / (2 * dx);
      const dudy = (u[idx(i, j + 1)] - u[idx(i, j - 1)]) / (2 * dy);
      const dvdx = (v[idx(i + 1, j)] - v[idx(i - 1, j)]) / (2 * dx);
      const dvdy = (v[idx(i, j + 1)] - v[idx(i, j - 1)]) / (2 * dy);
      rhs[c] = -(dudx * dudx + 2 * dvdx * dudy + dvdy * dvdy);
    }
  }

  // Solve with GS (30 iterations is fine for visualization)
  for (let gs = 0; gs < 40; gs++) {
    for (let j = 1; j < Ny - 1; j++) {
      for (let i = 1; i < Nx - 1; i++) {
        const c = idx(i, j);
        p[c] = (
          (p[idx(i + 1, j)] + p[idx(i - 1, j)]) / (dx * dx) +
          (p[idx(i, j + 1)] + p[idx(i, j - 1)]) / (dy * dy) -
          rhs[c]
        ) / (2 / (dx * dx) + 2 / (dy * dy));
      }
    }
    // Neumann BCs (zero-gradient)
    for (let i = 0; i < Nx; i++) { p[idx(i, 0)] = p[idx(i, 1)]; p[idx(i, Ny - 1)] = p[idx(i, Ny - 2)]; }
    for (let j = 0; j < Ny; j++) { p[idx(0, j)] = p[idx(1, j)]; p[idx(Nx - 1, j)] = p[idx(Nx - 2, j)]; }
  }

  // Remove mean pressure
  let pMean = 0;
  for (let i = 0; i < n; i++) pMean += p[i];
  pMean /= n;
  for (let i = 0; i < n; i++) p[i] -= pMean;

  return { u, v, p, w, psi, Nx, Ny, Lx, Ly, converged, residuals };
}

function CavitySandbox() {
  const [Nx, setNx] = useState(35);
  const [Re, setRe] = useState(100);
  const [nIter, setNIter] = useState(1500);
  const [result, setResult] = useState<CavityResult | null>(null);
  const [computing, setComputing] = useState(false);
  const [vizMode, setVizMode] = useState<'speed' | 'pressure' | 'vorticity' | 'stream'>('speed');

  const run = useCallback(() => {
    setComputing(true);
    setTimeout(() => {
      const res = solveCavity(Nx, Nx, Re, 1.0, nIter, 1.5);
      setResult(res);
      setComputing(false);
    }, 20);
  }, [Nx, Re, nIter]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      const t = (e.target as HTMLElement)?.tagName;
      if (t === 'INPUT' || t === 'TEXTAREA' || t === 'SELECT') return;
      if (e.code === 'Space') { e.preventDefault(); if (!computing) run(); }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [run, computing]);

  const plotData = useMemo(() => {
    if (!result) return null;
    const { u, v, p, w, psi, Nx: nx, Ny: ny, Lx: lx, Ly: ly } = result;
    const dx = lx / (nx - 1), dy = ly / (ny - 1);
    // Plot interior cells for better color range
    const x = Array.from({ length: nx - 2 }, (_, i) => (i + 1) * dx);
    const y = Array.from({ length: ny - 2 }, (_, j) => (j + 1) * dy);
    const z: number[][] = [];

    for (let j = 1; j < ny - 1; j++) {
      const row: number[] = [];
      for (let i = 1; i < nx - 1; i++) {
        const c = j * nx + i;
        if (vizMode === 'speed') {
          row.push(Math.sqrt(u[c] * u[c] + v[c] * v[c]));
        } else if (vizMode === 'pressure') {
          row.push(p[c]);
        } else if (vizMode === 'stream') {
          row.push(psi[c]);
        } else {
          row.push(w[c]); // vorticity directly from solver
        }
      }
      z.push(row);
    }

    return { z, x, y };
  }, [result, vizMode]);

  const colorscale = vizMode === 'vorticity' ? 'RdBu' : vizMode === 'stream' ? 'Blues' : vizMode === 'pressure' ? 'RdBu' : 'Viridis';
  const useZmid = vizMode === 'vorticity' || vizMode === 'pressure';

  return (
    <div className="flex flex-row-reverse h-full min-h-0">
      <aside className="w-48 shrink-0 border-l border-gray-800/50 overflow-y-auto p-3 space-y-3">
        <div className="text-[11px] font-semibold text-violet-400 mb-1 flex items-center gap-1.5">
          <Icon name="spiral" className="text-violet-400" size={13} /> Lid-Driven Cavity
        </div>
        <Slider label="N (pro Achse)" value={Nx} min={15} max={60} step={5} onChange={setNx} color="violet" />
        <Slider label="Reynolds Re" value={Re} min={10} max={1000} step={10} onChange={setRe} color="violet" />
        <Slider label="Iterationen" value={nIter} min={200} max={5000} step={100} onChange={setNIter} color="violet" />
        <SelectField label="Anzeige" value={vizMode}
          options={[
            { v: 'speed', l: 'Geschwindigkeit' },
            { v: 'pressure', l: 'Druck' },
            { v: 'vorticity', l: 'Wirbelstärke' },
            { v: 'stream', l: 'Stromfunktion' },
          ]}
          onChange={v => setVizMode(v as 'speed' | 'pressure' | 'vorticity' | 'stream')} />
        <button onClick={run} disabled={computing}
          className={`w-full py-2 rounded-lg font-semibold text-xs transition-colors ${
            computing ? 'bg-gray-700 text-gray-500' : 'bg-violet-600 hover:bg-violet-500 text-white'
          }`}>
          {computing ? 'Berechne...' : result ? '↻ Neustart' : '▶ Starten'}
        </button>
        <FormulaBox tex={TEX_CAVITY} label="ω-ψ Formulierung" />
        {result && (
          <div className="space-y-1">
            <StatusBadge label={result.converged ? 'Konvergiert' : `${nIter} Iter.`} ok={result.converged} />
            {result.residuals.length > 0 && (
              <div className="text-[10px] text-gray-600">
                Endresiduum: {result.residuals[result.residuals.length - 1].toExponential(2)}
              </div>
            )}
          </div>
        )}
      </aside>
      <div className="flex-1 flex flex-col min-w-0 min-h-0">
        <div className="flex-1 min-h-0 p-1">
          {plotData ? (
            <Plot
              data={[{
                z: plotData.z,
                x: plotData.x,
                y: plotData.y,
                type: 'heatmap',
                colorscale,
                colorbar: { thickness: 12, len: 0.8, tickfont: { size: 9, color: '#6b7280' }, exponentformat: 'e' },
                reversescale: vizMode === 'vorticity',
                zsmooth: 'best',
                ...(useZmid ? { zmid: 0 } : {}),
              }] as Plotly.Data[]}
              layout={{
                ...PLOT_LAYOUT_BASE,
                xaxis: { ...PLOT_LAYOUT_BASE.xaxis, title: { text: 'x' }, scaleanchor: 'y', range: [-0.02, 1.02] },
                yaxis: { ...PLOT_LAYOUT_BASE.yaxis, title: { text: 'y' }, range: [-0.02, 1.02] },
                shapes: [
                  // Cavity box border
                  { type: 'rect', x0: 0, y0: 0, x1: 1, y1: 1, line: { color: '#9ca3af', width: 2 } },
                  // Lid (top wall) — thicker, highlighted
                  { type: 'line', x0: 0, y0: 1, x1: 1, y1: 1, line: { color: '#c084fc', width: 4 } },
                ],
                annotations: [
                  // Lid arrow showing movement direction
                  { x: 0.78, y: 1.04, ax: 0.22, ay: 1.04, xref: 'x', yref: 'y', axref: 'x', ayref: 'y',
                    showarrow: true, arrowhead: 3, arrowsize: 1.2, arrowwidth: 2, arrowcolor: '#c084fc' },
                  { x: 0.5, y: 1.07, xref: 'x', yref: 'y', text: `u_lid = 1`,
                    showarrow: false, font: { size: 10, color: '#c084fc' } },
                  // Wall labels
                  { x: -0.04, y: 0.5, xref: 'x', yref: 'y', text: 'Wand',
                    showarrow: false, font: { size: 9, color: '#6b7280' }, textangle: -90 },
                  { x: 1.04, y: 0.5, xref: 'x', yref: 'y', text: 'Wand',
                    showarrow: false, font: { size: 9, color: '#6b7280' }, textangle: 90 },
                  { x: 0.5, y: -0.04, xref: 'x', yref: 'y', text: 'Wand (no-slip)',
                    showarrow: false, font: { size: 9, color: '#6b7280' } },
                ],
              } as Plotly.Layout}
              config={PLOT_CONFIG}
              useResizeHandler
              style={{ width: '100%', height: '100%' }}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center space-y-4">
                {/* Mini diagram of the cavity setup */}
                <svg width="180" height="180" viewBox="0 0 180 180" className="mx-auto">
                  {/* Box */}
                  <rect x="30" y="30" width="120" height="120" fill="none" stroke="#4b5563" strokeWidth="2" />
                  {/* Lid — top wall highlighted */}
                  <line x1="30" y1="30" x2="150" y2="30" stroke="#c084fc" strokeWidth="4" />
                  {/* Lid arrow */}
                  <line x1="55" y1="20" x2="125" y2="20" stroke="#c084fc" strokeWidth="2" />
                  <polygon points="125,15 135,20 125,25" fill="#c084fc" />
                  <text x="90" y="13" textAnchor="middle" fill="#c084fc" fontSize="10">u = 1</text>
                  {/* No-slip labels */}
                  <text x="90" y="168" textAnchor="middle" fill="#6b7280" fontSize="9">no-slip</text>
                  <text x="17" y="93" textAnchor="middle" fill="#6b7280" fontSize="9" transform="rotate(-90,17,93)">no-slip</text>
                  <text x="163" y="93" textAnchor="middle" fill="#6b7280" fontSize="9" transform="rotate(90,163,93)">no-slip</text>
                  {/* Vortex hint */}
                  <ellipse cx="95" cy="82" rx="30" ry="25" fill="none" stroke="#4b556366" strokeWidth="1" strokeDasharray="4 3" />
                  <polygon points="65,79 65,72 72,79" fill="#4b556366" />
                </svg>
                <div>
                  <p className="text-xs text-gray-400 font-medium">Lid-Driven Cavity</p>
                  <p className="text-[10px] text-gray-600 mt-1">Drücke <kbd className="px-1 py-0.5 bg-gray-800 rounded text-[10px] text-gray-400">Space</kbd> oder klicke Starten</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   11. JACOBI / GAUSS-SEIDEL CONVERGENCE
   Solve -u'' = f on [0,1] with u(0)=u(1)=0
═══════════════════════════════════════════════════════════════════ */
function JacobiGSSandbox() {
  const [N, setN] = useState(32);
  const [maxIter, setMaxIter] = useState(200);
  const [result, setResult] = useState<{ jacRes: number[]; gsRes: number[] } | null>(null);

  const run = useCallback(() => {
    const n = N;
    const h = 1 / (n + 1);
    const b = Array.from({ length: n }, (_, i) => Math.sin(Math.PI * (i + 1) * h) * h * h);

    // Jacobi
    let xJ = new Float64Array(n);
    const jacRes: number[] = [];
    for (let iter = 0; iter < maxIter; iter++) {
      const xNew = new Float64Array(n);
      for (let i = 0; i < n; i++) {
        const left = i > 0 ? xJ[i - 1] : 0;
        const right = i < n - 1 ? xJ[i + 1] : 0;
        xNew[i] = (b[i] + left + right) / 2;
      }
      let rNorm = 0;
      for (let i = 0; i < n; i++) {
        const left = i > 0 ? xNew[i - 1] : 0;
        const right = i < n - 1 ? xNew[i + 1] : 0;
        const r = b[i] - (2 * xNew[i] - left - right);
        rNorm += r * r;
      }
      jacRes.push(Math.sqrt(rNorm));
      xJ = xNew;
    }

    // Gauss-Seidel
    const xG = new Float64Array(n);
    const gsRes: number[] = [];
    for (let iter = 0; iter < maxIter; iter++) {
      for (let i = 0; i < n; i++) {
        const left = i > 0 ? xG[i - 1] : 0;
        const right = i < n - 1 ? xG[i + 1] : 0;
        xG[i] = (b[i] + left + right) / 2;
      }
      let rNorm = 0;
      for (let i = 0; i < n; i++) {
        const left = i > 0 ? xG[i - 1] : 0;
        const right = i < n - 1 ? xG[i + 1] : 0;
        const r = b[i] - (2 * xG[i] - left - right);
        rNorm += r * r;
      }
      gsRes.push(Math.sqrt(rNorm));
    }

    setResult({ jacRes, gsRes });
  }, [N, maxIter]);

  const iterAxis = useMemo(() => result ? Array.from({ length: result.jacRes.length }, (_, i) => i + 1) : [], [result]);

  return (
    <div className="flex flex-row-reverse h-full">
      <aside className="w-52 shrink-0 border-l border-gray-800 p-3 flex flex-col gap-3 overflow-y-auto">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Jacobi vs. Gauss-Seidel</h3>
        <Slider label="Gitterpunkte N" value={N} min={8} max={128} step={8} onChange={setN} />
        <Slider label="Max. Iterationen" value={maxIter} min={50} max={1000} step={50} onChange={setMaxIter} />
        <RunBtn onClick={run} hasResult={!!result} />
        <FormulaBox tex={TEX_JACOBI} label="Iterationsvorschrift" />
        {result && (
          <div className="text-[10px] text-gray-500 space-y-0.5">
            <p>Jacobi final: {result.jacRes[result.jacRes.length - 1].toExponential(2)}</p>
            <p>GS final: {result.gsRes[result.gsRes.length - 1].toExponential(2)}</p>
          </div>
        )}
      </aside>
      <div className="flex-1 min-w-0 min-h-0 p-1">
        {result ? (
          <Plot
            data={[
              { x: iterAxis, y: result.jacRes, type: 'scatter', mode: 'lines', name: 'Jacobi', line: { color: '#f59e0b', width: 2 } },
              { x: iterAxis, y: result.gsRes, type: 'scatter', mode: 'lines', name: 'Gauss-Seidel', line: { color: '#06b6d4', width: 2 } },
            ] as Plotly.Data[]}
            layout={{
              ...PLOT_LAYOUT_BASE,
              xaxis: { ...PLOT_LAYOUT_BASE.xaxis, title: { text: 'Iteration' } },
              yaxis: { ...PLOT_LAYOUT_BASE.yaxis, title: { text: '||r||₂' }, type: 'log' },
            } as Plotly.Layout}
            config={PLOT_CONFIG}
            useResizeHandler
            style={{ width: '100%', height: '100%' }}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-4">
              <svg width="200" height="130" viewBox="0 0 200 130" className="mx-auto">
                {/* Achsen */}
                <line x1="30" y1="110" x2="185" y2="110" stroke="#4b5563" strokeWidth="1" />
                <line x1="30" y1="110" x2="30" y2="15" stroke="#4b5563" strokeWidth="1" />
                {/* Jacobi — langsamer */}
                <path d="M30,25 Q60,28 80,40 Q110,60 140,80 Q165,95 185,105" fill="none" stroke="#f59e0b" strokeWidth="2" />
                {/* GS — schneller */}
                <path d="M30,25 Q50,40 65,65 Q80,85 100,95 Q130,105 185,108" fill="none" stroke="#06b6d4" strokeWidth="2" />
                <text x="185" y="95" textAnchor="end" fill="#f59e0b" fontSize="9">Jacobi</text>
                <text x="135" y="100" textAnchor="end" fill="#06b6d4" fontSize="9">Gauß-Seidel</text>
                <text x="107" y="125" textAnchor="middle" fill="#6b7280" fontSize="9">Iteration →</text>
                <text x="20" y="65" textAnchor="middle" fill="#6b7280" fontSize="9" transform="rotate(-90,20,65)">||r||₂</text>
              </svg>
              <div>
                <p className="text-xs text-gray-400 font-medium">Jacobi vs. Gauß-Seidel</p>
                <p className="text-[10px] text-gray-600 mt-1">Konvergenzrate iterativer Löser für −u″ = f</p>
                <p className="text-[10px] text-gray-600 mt-1"><kbd className="px-1 py-0.5 bg-gray-800 rounded text-gray-400">Space</kbd> oder Starten</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   12. SOD SHOCK TUBE (1D Euler — Lax-Friedrichs)
═══════════════════════════════════════════════════════════════════ */
function SodTubeSandbox() {
  const [Ncells, setNcells] = useState(200);
  const [tEnd, setTEnd] = useState(0.2);
  const gamma = 1.4;

  type SodSnap = { time: number; rho: number[]; u: number[]; p: number[] };
  const [snapshots, setSnapshots] = useState<SodSnap[] | null>(null);
  const [xArr, setXArr] = useState<number[]>([]);
  const pb = usePlayback(snapshots?.length ?? 0);

  const run = useCallback(() => {
    const N = Ncells;
    const dx = 1 / N;
    const x = Array.from({ length: N }, (_, i) => (i + 0.5) * dx);

    const rho = new Float64Array(N);
    const mom = new Float64Array(N);
    const ene = new Float64Array(N);

    for (let i = 0; i < N; i++) {
      if (x[i] < 0.5) {
        rho[i] = 1.0; mom[i] = 0; ene[i] = 1.0 / (gamma - 1);
      } else {
        rho[i] = 0.125; mom[i] = 0; ene[i] = 0.1 / (gamma - 1);
      }
    }

    const pFn = (r: number, m: number, e: number) => (gamma - 1) * (e - 0.5 * m * m / r);
    const aFn = (r: number, pr: number) => Math.sqrt(gamma * pr / r);

    const snaps: SodSnap[] = [];
    const maxSnaps = 120;

    // Record IC
    snaps.push({
      time: 0,
      rho: Array.from(rho),
      u: Array.from({ length: N }, (_, i) => mom[i] / rho[i]),
      p: Array.from({ length: N }, (_, i) => pFn(rho[i], mom[i], ene[i])),
    });

    let t = 0;
    const CFL = 0.5;
    let iter = 0;
    const maxIter = 50000;
    let snapInterval = 1; // will be adjusted

    // First pass: count total iterations to determine snapshot interval
    const rhoTmp = Float64Array.from(rho);
    const momTmp = Float64Array.from(mom);
    const eneTmp = Float64Array.from(ene);
    let tTmp = 0, iterTmp = 0;
    while (tTmp < tEnd && iterTmp < maxIter) {
      let sMax = 0;
      for (let i = 0; i < N; i++) {
        const ui = momTmp[i] / rhoTmp[i];
        const pi = pFn(rhoTmp[i], momTmp[i], eneTmp[i]);
        const ai = aFn(rhoTmp[i], Math.max(pi, 1e-10));
        sMax = Math.max(sMax, Math.abs(ui) + ai);
      }
      let dt = CFL * dx / (sMax + 1e-14);
      if (tTmp + dt > tEnd) dt = tEnd - tTmp;
      const rhoN2 = new Float64Array(N);
      const momN2 = new Float64Array(N);
      const eneN2 = new Float64Array(N);
      for (let i = 1; i < N - 1; i++) {
        const pL = pFn(rhoTmp[i - 1], momTmp[i - 1], eneTmp[i - 1]);
        const pR = pFn(rhoTmp[i + 1], momTmp[i + 1], eneTmp[i + 1]);
        rhoN2[i] = 0.5 * (rhoTmp[i - 1] + rhoTmp[i + 1]) - 0.5 * dt / dx * (momTmp[i + 1] - momTmp[i - 1]);
        momN2[i] = 0.5 * (momTmp[i - 1] + momTmp[i + 1]) - 0.5 * dt / dx * ((momTmp[i + 1] * momTmp[i + 1] / rhoTmp[i + 1] + pR) - (momTmp[i - 1] * momTmp[i - 1] / rhoTmp[i - 1] + pL));
        eneN2[i] = 0.5 * (eneTmp[i - 1] + eneTmp[i + 1]) - 0.5 * dt / dx * (((eneTmp[i + 1] + pR) * momTmp[i + 1] / rhoTmp[i + 1]) - ((eneTmp[i - 1] + pL) * momTmp[i - 1] / rhoTmp[i - 1]));
      }
      rhoN2[0] = rhoN2[1]; momN2[0] = momN2[1]; eneN2[0] = eneN2[1];
      rhoN2[N - 1] = rhoN2[N - 2]; momN2[N - 1] = momN2[N - 2]; eneN2[N - 1] = eneN2[N - 2];
      rhoTmp.set(rhoN2); momTmp.set(momN2); eneTmp.set(eneN2);
      tTmp += dt; iterTmp++;
    }
    snapInterval = Math.max(1, Math.floor(iterTmp / maxSnaps));

    while (t < tEnd && iter < maxIter) {
      let sMax = 0;
      for (let i = 0; i < N; i++) {
        const ui = mom[i] / rho[i];
        const pi = pFn(rho[i], mom[i], ene[i]);
        const ai = aFn(rho[i], Math.max(pi, 1e-10));
        sMax = Math.max(sMax, Math.abs(ui) + ai);
      }
      let dt = CFL * dx / (sMax + 1e-14);
      if (t + dt > tEnd) dt = tEnd - t;

      const rhoN = new Float64Array(N);
      const momN = new Float64Array(N);
      const eneN = new Float64Array(N);

      for (let i = 1; i < N - 1; i++) {
        const pL = pFn(rho[i - 1], mom[i - 1], ene[i - 1]);
        const pR = pFn(rho[i + 1], mom[i + 1], ene[i + 1]);

        const fRhoL = mom[i - 1]; const fRhoR = mom[i + 1];
        const fMomL = mom[i - 1] * mom[i - 1] / rho[i - 1] + pL;
        const fMomR = mom[i + 1] * mom[i + 1] / rho[i + 1] + pR;
        const fEneL = (ene[i - 1] + pL) * mom[i - 1] / rho[i - 1];
        const fEneR = (ene[i + 1] + pR) * mom[i + 1] / rho[i + 1];

        rhoN[i] = 0.5 * (rho[i - 1] + rho[i + 1]) - 0.5 * dt / dx * (fRhoR - fRhoL);
        momN[i] = 0.5 * (mom[i - 1] + mom[i + 1]) - 0.5 * dt / dx * (fMomR - fMomL);
        eneN[i] = 0.5 * (ene[i - 1] + ene[i + 1]) - 0.5 * dt / dx * (fEneR - fEneL);
      }
      rhoN[0] = rhoN[1]; momN[0] = momN[1]; eneN[0] = eneN[1];
      rhoN[N - 1] = rhoN[N - 2]; momN[N - 1] = momN[N - 2]; eneN[N - 1] = eneN[N - 2];

      rho.set(rhoN); mom.set(momN); ene.set(eneN);
      t += dt;
      iter++;

      if (iter % snapInterval === 0 || t >= tEnd) {
        snaps.push({
          time: t,
          rho: Array.from(rho),
          u: Array.from({ length: N }, (_, i) => mom[i] / rho[i]),
          p: Array.from({ length: N }, (_, i) => pFn(rho[i], mom[i], ene[i])),
        });
      }
    }

    setXArr(x);
    setSnapshots(snaps);
    pb.reset();
    requestAnimationFrame(() => pb.setPlaying(true));
  }, [Ncells, tEnd, gamma, pb]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      const t = (e.target as HTMLElement)?.tagName;
      if (t === 'INPUT' || t === 'TEXTAREA' || t === 'SELECT') return;
      if (e.code === 'Space') { e.preventDefault(); if (!snapshots) run(); else pb.setPlaying(p => !p); }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [run, snapshots, pb]);

  const [plotVar, setPlotVar] = useState<'rho' | 'u' | 'p'>('rho');
  const varLabels = { rho: 'Dichte ρ', u: 'Geschwindigkeit u', p: 'Druck p' };
  const varColors = { rho: '#f59e0b', u: '#06b6d4', p: '#a78bfa' };

  const plotData = useMemo(() => {
    if (!snapshots || snapshots.length === 0) return null;
    const snap = snapshots[pb.idx] ?? snapshots[0];
    const init = snapshots[0];
    return {
      traces: [
        { x: xArr, y: init[plotVar], type: 'scatter' as const, mode: 'lines' as const, name: `${varLabels[plotVar]}₀`, line: { color: '#4b5563', dash: 'dash', width: 1.5 } },
        { x: xArr, y: snap[plotVar], type: 'scatter' as const, mode: 'lines' as const, name: `${varLabels[plotVar]} (t=${snap.time.toFixed(4)})`, line: { color: varColors[plotVar], width: 2.5 } },
      ] as Plotly.Data[],
      time: snap.time,
    };
  }, [snapshots, pb.idx, plotVar, xArr]);

  return (
    <div className="flex flex-row-reverse h-full">
      <aside className="w-52 shrink-0 border-l border-gray-800 p-3 flex flex-col gap-3 overflow-y-auto">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Sod Shock Tube</h3>
        <Slider label="Zellen N" value={Ncells} min={50} max={500} step={50} onChange={setNcells} />
        <Slider label="t_end" value={tEnd} min={0.05} max={0.4} step={0.05} onChange={setTEnd} suffix="s" />
        <RunBtn onClick={run} hasResult={!!snapshots} />
        <FormulaBox tex={TEX_SOD} label="Euler-Gleichungen" />
        <div className="space-y-1">
          <span className="text-[10px] text-gray-500">Variable:</span>
          <div className="flex gap-1">
            {(['rho', 'u', 'p'] as const).map(v => (
              <button key={v} onClick={() => setPlotVar(v)}
                className={`text-[10px] px-2 py-0.5 rounded ${plotVar === v ? 'bg-cyan-700 text-white' : 'bg-gray-800 text-gray-400'}`}>
                {v}
              </button>
            ))}
          </div>
        </div>
      </aside>
      <div className="flex-1 flex flex-col min-w-0 min-h-0">
        <div className="flex-1 min-h-0 p-1">
          {plotData ? (
            <Plot
              data={plotData.traces}
              layout={{
                ...PLOT_LAYOUT_BASE,
                xaxis: { ...PLOT_LAYOUT_BASE.xaxis, title: { text: 'x' } },
                yaxis: { ...PLOT_LAYOUT_BASE.yaxis, title: { text: varLabels[plotVar] } },
              } as Plotly.Layout}
              config={PLOT_CONFIG}
              useResizeHandler
              style={{ width: '100%', height: '100%' }}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center space-y-4">
                <svg width="220" height="120" viewBox="0 0 220 120" className="mx-auto">
                  {/* Rohr */}
                  <rect x="15" y="35" width="190" height="50" rx="3" fill="none" stroke="#4b5563" strokeWidth="1.5" />
                  {/* Membran */}
                  <line x1="110" y1="35" x2="110" y2="85" stroke="#a78bfa" strokeWidth="2" strokeDasharray="4 2" />
                  <text x="110" y="30" textAnchor="middle" fill="#a78bfa" fontSize="8">Membran</text>
                  {/* Hochdruck links */}
                  <text x="60" y="55" textAnchor="middle" fill="#f59e0b" fontSize="11" fontWeight="bold">ρ_L, p_L</text>
                  <text x="60" y="70" textAnchor="middle" fill="#6b7280" fontSize="9">Hochdruck</text>
                  {/* Niederdruck rechts */}
                  <text x="160" y="55" textAnchor="middle" fill="#06b6d4" fontSize="11" fontWeight="bold">ρ_R, p_R</text>
                  <text x="160" y="70" textAnchor="middle" fill="#6b7280" fontSize="9">Niederdruck</text>
                  {/* Wellen nach Aufreißen */}
                  <text x="45" y="105" textAnchor="middle" fill="#6b7280" fontSize="8">← Expansion</text>
                  <text x="165" y="105" textAnchor="middle" fill="#6b7280" fontSize="8">Stoß →</text>
                </svg>
                <div>
                  <p className="text-xs text-gray-400 font-medium">Sod Shock Tube</p>
                  <p className="text-[10px] text-gray-600 mt-1">Riemann-Problem: Membran reißt → Stoßwelle + Kontaktfläche + Expansion</p>
                  <p className="text-[10px] text-gray-600 mt-1"><kbd className="px-1 py-0.5 bg-gray-800 rounded text-gray-400">Space</kbd> oder Starten</p>
                </div>
              </div>
            </div>
          )}
        </div>
        {snapshots && (
          <div className="flex items-center gap-2 px-3 py-1.5 border-t border-gray-800/60 text-xs shrink-0">
            <button onClick={() => pb.setPlaying(p => !p)}
              className="w-7 h-7 flex items-center justify-center rounded bg-gray-800 hover:bg-gray-700 text-gray-300 text-[11px]">
              {pb.playing ? '⏸' : '▶'}
            </button>
            <input type="range" min={0} max={Math.max(0, (snapshots?.length ?? 1) - 1)} value={pb.idx}
              onChange={e => { pb.setPlaying(false); pb.setIdx(+e.target.value); }}
              className="flex-1 accent-amber-500" />
            <span className="text-gray-600 font-mono w-20 text-right text-[10px]">t={plotData?.time.toFixed(4) ?? '0'}</span>
            <select value={pb.speed} onChange={e => pb.setSpeed(+e.target.value)}
              className="bg-gray-800 border border-gray-700/50 rounded px-1 py-0.5 text-[10px] text-gray-400">
              <option value={120}>0.5×</option><option value={60}>1×</option><option value={30}>2×</option><option value={15}>4×</option>
            </select>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   13. NORMAL SHOCK RELATIONS
═══════════════════════════════════════════════════════════════════ */
function NormalShockSandbox() {
  const [Ma1, setMa1] = useState(2.0);
  const gamma = 1.4;

  const shock = useMemo(() => {
    const M = Ma1;
    const g = gamma;
    const pRatio = 1 + 2 * g / (g + 1) * (M * M - 1);
    const rhoRatio = (g + 1) * M * M / (2 + (g - 1) * M * M);
    const TRatio = pRatio / rhoRatio;
    const Ma2sq = (1 + (g - 1) / 2 * M * M) / (g * M * M - (g - 1) / 2);
    const Ma2 = Math.sqrt(Math.max(Ma2sq, 0));
    return { pRatio, rhoRatio, TRatio, Ma2 };
  }, [Ma1, gamma]);

  const MaRange = useMemo(() => Array.from({ length: 100 }, (_, i) => 1 + i * 0.05), []);
  const pArr = useMemo(() => MaRange.map(M => 1 + 2 * gamma / (gamma + 1) * (M * M - 1)), [MaRange, gamma]);
  const rhoArr = useMemo(() => MaRange.map(M => (gamma + 1) * M * M / (2 + (gamma - 1) * M * M)), [MaRange, gamma]);
  const TArr = useMemo(() => MaRange.map((_, i) => pArr[i] / rhoArr[i]), [MaRange, pArr, rhoArr]);

  return (
    <div className="flex flex-row-reverse h-full">
      <aside className="w-56 shrink-0 border-l border-gray-800 p-3 flex flex-col gap-3 overflow-y-auto">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Normalschock</h3>
        <Slider label="Mach-Zahl Ma₁" value={Ma1} min={1.0} max={6.0} step={0.1} onChange={setMa1} color="amber" />
        <div className="space-y-1.5 text-[11px]">
          <div className="flex justify-between"><span className="text-gray-500">p₂/p₁</span><span className="text-amber-400 font-mono">{shock.pRatio.toFixed(3)}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">ρ₂/ρ₁</span><span className="text-cyan-400 font-mono">{shock.rhoRatio.toFixed(3)}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">T₂/T₁</span><span className="text-purple-400 font-mono">{shock.TRatio.toFixed(3)}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Ma₂</span><span className="text-emerald-400 font-mono">{shock.Ma2.toFixed(4)}</span></div>
        </div>
        <FormulaBox tex={TEX_SHOCK} label="Rankine-Hugoniot" />
        <div className="text-[10px] text-gray-600 border-t border-gray-800 pt-2">
          γ = {gamma} (ideales Gas)
        </div>
      </aside>
      <div className="flex-1 min-w-0 min-h-0 p-1">
        <Plot
          data={[
            { x: MaRange, y: pArr, type: 'scatter', mode: 'lines', name: 'p₂/p₁', line: { color: '#f59e0b', width: 2 } },
            { x: MaRange, y: rhoArr, type: 'scatter', mode: 'lines', name: 'ρ₂/ρ₁', line: { color: '#06b6d4', width: 2 } },
            { x: MaRange, y: TArr, type: 'scatter', mode: 'lines', name: 'T₂/T₁', line: { color: '#a78bfa', width: 2 } },
            { x: [Ma1, Ma1], y: [0, shock.pRatio], type: 'scatter', mode: 'lines', name: `Ma₁=${Ma1}`, line: { color: '#ef4444', width: 1, dash: 'dash' }, showlegend: false },
          ] as Plotly.Data[]}
          layout={{
            ...PLOT_LAYOUT_BASE,
            xaxis: { ...PLOT_LAYOUT_BASE.xaxis, title: { text: 'Ma₁' } },
            yaxis: { ...PLOT_LAYOUT_BASE.yaxis, title: { text: 'Verhältnis' } },
          } as Plotly.Layout}
          config={PLOT_CONFIG}
          useResizeHandler
          style={{ width: '100%', height: '100%' }}
        />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   14. ENERGY SPECTRUM E(k)
═══════════════════════════════════════════════════════════════════ */
function EnergySpectrumSandbox() {
  const [ReL, setReL] = useState(1e5);
  const [filterCut, setFilterCut] = useState(0.3);

  const data = useMemo(() => {
    const eta = Math.pow(ReL, -0.75);
    const kEta = 1 / eta;
    const nPts = 300;
    const kMin = 1e-1;
    const kMax = kEta * 2;
    const k: number[] = [];
    const Ek: number[] = [];

    for (let i = 0; i < nPts; i++) {
      const ki = kMin * Math.pow(kMax / kMin, i / (nPts - 1));
      k.push(ki);
      const kp = 5;
      const A = 1.5;
      const fL = Math.pow(ki / kp, 4) / Math.pow(1 + Math.pow(ki / kp, 2), 17 / 6);
      const fEta = Math.exp(-5.2 * Math.pow(ki * eta, 1.04));
      Ek.push(A * fL * fEta);
    }

    const k53 = k.filter(ki => ki > 2 * kMin && ki < 0.3 * kEta);
    const E53 = k53.map(ki => 1.5 * Math.pow(ki, -5 / 3));
    const kCut = filterCut * kEta;

    return { k, Ek, k53, E53, kCut, kEta, eta };
  }, [ReL, filterCut]);

  return (
    <div className="flex flex-row-reverse h-full">
      <aside className="w-52 shrink-0 border-l border-gray-800 p-3 flex flex-col gap-3 overflow-y-auto">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Energiespektrum E(k)</h3>
        <div>
          <span className="text-[11px] text-gray-500">Re_L</span>
          <input type="range" min={3} max={8} step={0.5} value={Math.log10(ReL)}
            onChange={e => setReL(Math.pow(10, +e.target.value))}
            className="w-full accent-cyan-500" />
          <span className="text-[11px] text-gray-400 font-mono">{ReL.toExponential(0)}</span>
        </div>
        <Slider label="LES-Filter k_c / k_η" value={filterCut} min={0.01} max={1.0} step={0.01} onChange={setFilterCut} color="amber" />
        <div className="text-[10px] text-gray-500 space-y-0.5 border-t border-gray-800 pt-2">
          <p>η/L ≈ Re^(-3/4) = {data.eta.toExponential(2)}</p>
          <p>k_η = {data.kEta.toFixed(0)}</p>
          <p>LES löst: k &lt; {(data.kCut).toFixed(0)}</p>
        </div>
        <FormulaBox tex={TEX_ENERGY} label="Kolmogorov-Spektrum" />
      </aside>
      <div className="flex-1 min-w-0 min-h-0 p-1">
        <Plot
          data={[
            { x: data.k, y: data.Ek, type: 'scatter', mode: 'lines', name: 'E(k)', line: { color: '#06b6d4', width: 2.5 } },
            { x: data.k53, y: data.E53, type: 'scatter', mode: 'lines', name: 'k^(-5/3)', line: { color: '#6b7280', width: 1.5, dash: 'dash' } },
            { x: [data.kCut, data.kCut], y: [1e-12, 10], type: 'scatter', mode: 'lines', name: 'LES-Filter', line: { color: '#f59e0b', width: 2, dash: 'dot' } },
          ] as Plotly.Data[]}
          layout={{
            ...PLOT_LAYOUT_BASE,
            xaxis: { ...PLOT_LAYOUT_BASE.xaxis, title: { text: 'k (Wellenzahl)' }, type: 'log' },
            yaxis: { ...PLOT_LAYOUT_BASE.yaxis, title: { text: 'E(k)' }, type: 'log', range: [-12, 1] },
          } as Plotly.Layout}
          config={PLOT_CONFIG}
          useResizeHandler
          style={{ width: '100%', height: '100%' }}
        />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   15. CHANNEL LOG-LAW (turbulent wall profile)
═══════════════════════════════════════════════════════════════════ */
function ChannelLogLawSandbox() {
  const [ReTau, setReTau] = useState(1000);
  const kappa = 0.41;
  const B = 5.2;

  const data = useMemo(() => {
    const nPts = 500;
    const yPlusMax = ReTau;
    const yPlus: number[] = [];
    const uPlusVisc: number[] = [];
    const uPlusLog: number[] = [];
    const uPlusDNS: number[] = [];

    for (let i = 0; i < nPts; i++) {
      const yp = 0.1 + (yPlusMax - 0.1) * (i / (nPts - 1));
      yPlus.push(yp);
      uPlusVisc.push(yp);
      uPlusLog.push((1 / kappa) * Math.log(yp) + B);
      const uReichardt = (1 / kappa) * Math.log(1 + kappa * yp) + 7.8 * (1 - Math.exp(-yp / 11) - (yp / 11) * Math.exp(-yp / 3));
      uPlusDNS.push(uReichardt);
    }

    return { yPlus, uPlusVisc, uPlusLog, uPlusDNS };
  }, [ReTau, kappa, B]);

  return (
    <div className="flex flex-row-reverse h-full">
      <aside className="w-52 shrink-0 border-l border-gray-800 p-3 flex flex-col gap-3 overflow-y-auto">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Wandprofil u⁺(y⁺)</h3>
        <Slider label="Re_τ" value={ReTau} min={100} max={5000} step={100} onChange={setReTau} color="cyan" />
        <div className="text-[10px] text-gray-500 space-y-1 border-t border-gray-800 pt-2">
          <p className="text-amber-400">— Viskose Unterschicht (u⁺ = y⁺)</p>
          <p className="text-emerald-400">— Log-Gesetz (u⁺ = 1/κ·ln(y⁺)+B)</p>
          <p className="text-cyan-400">— Reichardt-Profil (≈ DNS)</p>
          <div className="mt-2 text-gray-600">
            <p>κ = {kappa}, B = {B}</p>
            <p>y⁺ &lt; 5: viskose Unterschicht</p>
            <p>5 &lt; y⁺ &lt; 30: Pufferschicht</p>
            <p>y⁺ &gt; 30: Log-Schicht</p>
          </div>
        </div>
        <FormulaBox tex={TEX_LOGLAW} label="Log-Gesetz" />
      </aside>
      <div className="flex-1 min-w-0 min-h-0 p-1">
        <Plot
          data={[
            { x: data.yPlus.filter(y => y <= 12), y: data.uPlusVisc.filter((_, i) => data.yPlus[i] <= 12),
              type: 'scatter', mode: 'lines', name: 'u⁺ = y⁺', line: { color: '#f59e0b', width: 2, dash: 'dash' } },
            { x: data.yPlus.filter(y => y >= 20), y: data.uPlusLog.filter((_, i) => data.yPlus[i] >= 20),
              type: 'scatter', mode: 'lines', name: 'Log-Gesetz', line: { color: '#10b981', width: 2, dash: 'dash' } },
            { x: data.yPlus, y: data.uPlusDNS,
              type: 'scatter', mode: 'lines', name: 'Reichardt (≈DNS)', line: { color: '#06b6d4', width: 2.5 } },
            { x: [5, 5], y: [0, 40], type: 'scatter', mode: 'lines', name: 'y⁺=5', line: { color: '#374151', width: 1, dash: 'dot' }, showlegend: false },
            { x: [30, 30], y: [0, 40], type: 'scatter', mode: 'lines', name: 'y⁺=30', line: { color: '#374151', width: 1, dash: 'dot' }, showlegend: false },
          ] as Plotly.Data[]}
          layout={{
            ...PLOT_LAYOUT_BASE,
            xaxis: { ...PLOT_LAYOUT_BASE.xaxis, title: { text: 'y⁺' }, type: 'log', range: [-0.5, Math.log10(ReTau)] },
            yaxis: { ...PLOT_LAYOUT_BASE.yaxis, title: { text: 'u⁺' }, range: [0, Math.max(25, (1 / kappa) * Math.log(ReTau) + B + 2)] },
          } as Plotly.Layout}
          config={PLOT_CONFIG}
          useResizeHandler
          style={{ width: '100%', height: '100%' }}
        />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   16. VOF 1D ADVECTION
═══════════════════════════════════════════════════════════════════ */
function VOF1DSandbox() {
  const [N, setN] = useState(100);
  const [nSteps, setNSteps] = useState(200);
  const [velocity, setVelocity] = useState(0.5);

  type VOFSnap = { time: number; alpha: number[] };
  const [snapshots, setSnapshots] = useState<VOFSnap[] | null>(null);
  const [xArr, setXArr] = useState<number[]>([]);
  const [alpha0, setAlpha0] = useState<number[]>([]);
  const pb = usePlayback(snapshots?.length ?? 0);

  const run = useCallback(() => {
    const dx = 1 / N;
    const u = velocity;
    const CFL = 0.5;
    const dt = CFL * dx / Math.abs(u + 1e-14);

    const alpha = new Float64Array(N);
    const a0 = new Float64Array(N);
    for (let i = 0; i < N; i++) {
      const xc = (i + 0.5) * dx;
      alpha[i] = (xc >= 0.2 && xc <= 0.4) ? 1.0 : 0.0;
      a0[i] = alpha[i];
    }

    const snaps: VOFSnap[] = [];
    const maxSnaps = 120;
    const snapInterval = Math.max(1, Math.floor(nSteps / maxSnaps));

    snaps.push({ time: 0, alpha: Array.from(alpha) });

    for (let step = 0; step < nSteps; step++) {
      const prev = Float64Array.from(alpha);
      if (u >= 0) {
        for (let i = 1; i < N; i++) {
          alpha[i] = prev[i] - u * dt / dx * (prev[i] - prev[i - 1]);
        }
        alpha[0] = prev[0] - u * dt / dx * (prev[0] - prev[N - 1]);
      } else {
        for (let i = 0; i < N - 1; i++) {
          alpha[i] = prev[i] - u * dt / dx * (prev[i + 1] - prev[i]);
        }
        alpha[N - 1] = prev[N - 1] - u * dt / dx * (prev[0] - prev[N - 1]);
      }
      for (let i = 0; i < N; i++) {
        alpha[i] = Math.max(0, Math.min(1, alpha[i]));
      }

      if ((step + 1) % snapInterval === 0 || step === nSteps - 1) {
        snaps.push({ time: (step + 1) * dt, alpha: Array.from(alpha) });
      }
    }

    const x = Array.from({ length: N }, (_, i) => (i + 0.5) * dx);
    setXArr(x);
    setAlpha0(Array.from(a0));
    setSnapshots(snaps);
    pb.reset();
    requestAnimationFrame(() => pb.setPlaying(true));
  }, [N, nSteps, velocity, pb]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      const t = (e.target as HTMLElement)?.tagName;
      if (t === 'INPUT' || t === 'TEXTAREA' || t === 'SELECT') return;
      if (e.code === 'Space') { e.preventDefault(); if (!snapshots) run(); else pb.setPlaying(p => !p); }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [run, snapshots, pb]);

  const plotData = useMemo(() => {
    if (!snapshots || snapshots.length === 0) return null;
    const snap = snapshots[pb.idx] ?? snapshots[0];
    return {
      traces: [
        { x: xArr, y: alpha0, type: 'scatter' as const, mode: 'lines' as const, name: 'α₀ (Anfang)', line: { color: '#4b5563', width: 1.5, dash: 'dash' }, fill: 'tozeroy', fillcolor: 'rgba(75,85,99,0.15)' },
        { x: xArr, y: snap.alpha, type: 'scatter' as const, mode: 'lines' as const, name: `α (t=${snap.time.toFixed(4)})`, line: { color: '#06b6d4', width: 2.5 }, fill: 'tozeroy', fillcolor: 'rgba(6,182,212,0.15)' },
      ] as Plotly.Data[],
      time: snap.time,
      mass: snap.alpha.reduce((s, v) => s + v, 0),
    };
  }, [snapshots, pb.idx, xArr, alpha0]);

  return (
    <div className="flex flex-row-reverse h-full">
      <aside className="w-52 shrink-0 border-l border-gray-800 p-3 flex flex-col gap-3 overflow-y-auto">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">VOF 1D Advektion</h3>
        <Slider label="Zellen N" value={N} min={20} max={500} step={20} onChange={setN} />
        <Slider label="Zeitschritte" value={nSteps} min={50} max={1000} step={50} onChange={setNSteps} />
        <Slider label="Geschwindigkeit u" value={velocity} min={-1.0} max={1.0} step={0.1} onChange={setVelocity} color="cyan" />
        <RunBtn onClick={run} hasResult={!!snapshots} />
        <FormulaBox tex={TEX_VOF} label="VOF-Transport" />
        {plotData && (
          <div className="text-[10px] text-gray-500 border-t border-gray-800 pt-2 space-y-0.5">
            <p>u = {velocity.toFixed(1)}</p>
            <p>Schema: Upwind (1. Ordnung)</p>
            <p>Masse₀: {alpha0.reduce((s, v) => s + v, 0).toFixed(1)}</p>
            <p>Masse: {plotData.mass.toFixed(1)}</p>
          </div>
        )}
      </aside>
      <div className="flex-1 flex flex-col min-w-0 min-h-0">
        <div className="flex-1 min-h-0 p-1">
          {plotData ? (
            <Plot
              data={plotData.traces}
              layout={{
                ...PLOT_LAYOUT_BASE,
                xaxis: { ...PLOT_LAYOUT_BASE.xaxis, title: { text: 'x' } },
                yaxis: { ...PLOT_LAYOUT_BASE.yaxis, title: { text: 'α' }, range: [-0.05, 1.15] },
              } as Plotly.Layout}
              config={PLOT_CONFIG}
              useResizeHandler
              style={{ width: '100%', height: '100%' }}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center space-y-4">
                <svg width="220" height="100" viewBox="0 0 220 100" className="mx-auto">
                  {/* Kanal */}
                  <line x1="15" y1="25" x2="205" y2="25" stroke="#4b5563" strokeWidth="1" />
                  <line x1="15" y1="75" x2="205" y2="75" stroke="#4b5563" strokeWidth="1" />
                  {/* Phase 1 — Luft */}
                  <rect x="15" y="25" width="80" height="50" fill="#1e3a5f" opacity="0.3" />
                  <text x="55" y="55" textAnchor="middle" fill="#60a5fa" fontSize="10">α=0</text>
                  <text x="55" y="68" textAnchor="middle" fill="#6b7280" fontSize="8">Luft</text>
                  {/* Interface */}
                  <line x1="95" y1="25" x2="95" y2="75" stroke="#06b6d4" strokeWidth="2.5" />
                  {/* Phase 2 — Wasser */}
                  <rect x="95" y="25" width="80" height="50" fill="#06b6d4" opacity="0.15" />
                  <text x="135" y="55" textAnchor="middle" fill="#06b6d4" fontSize="10">α=1</text>
                  <text x="135" y="68" textAnchor="middle" fill="#6b7280" fontSize="8">Wasser</text>
                  {/* Transport-Pfeil */}
                  <line x1="60" y1="88" x2="150" y2="88" stroke="#6b7280" strokeWidth="1" />
                  <polygon points="150,85 157,88 150,91" fill="#6b7280" />
                  <text x="105" y="98" textAnchor="middle" fill="#6b7280" fontSize="8">u · ∂α/∂x (VOF)</text>
                </svg>
                <div>
                  <p className="text-xs text-gray-400 font-medium">VOF 1D Advektion</p>
                  <p className="text-[10px] text-gray-600 mt-1">Volume-of-Fluid: Phasengrenze wird durch Geschwindigkeitsfeld transportiert</p>
                  <p className="text-[10px] text-gray-600 mt-1"><kbd className="px-1 py-0.5 bg-gray-800 rounded text-gray-400">Space</kbd> oder Starten</p>
                </div>
              </div>
            </div>
          )}
        </div>
        {snapshots && (
          <div className="flex items-center gap-2 px-3 py-1.5 border-t border-gray-800/60 text-xs shrink-0">
            <button onClick={() => pb.setPlaying(p => !p)}
              className="w-7 h-7 flex items-center justify-center rounded bg-gray-800 hover:bg-gray-700 text-gray-300 text-[11px]">
              {pb.playing ? '⏸' : '▶'}
            </button>
            <input type="range" min={0} max={Math.max(0, (snapshots?.length ?? 1) - 1)} value={pb.idx}
              onChange={e => { pb.setPlaying(false); pb.setIdx(+e.target.value); }}
              className="flex-1 accent-cyan-500" />
            <span className="text-gray-600 font-mono w-20 text-right text-[10px]">t={plotData?.time.toFixed(4) ?? '0'}</span>
            <select value={pb.speed} onChange={e => pb.setSpeed(+e.target.value)}
              className="bg-gray-800 border border-gray-700/50 rounded px-1 py-0.5 text-[10px] text-gray-400">
              <option value={120}>0.5×</option><option value={60}>1×</option><option value={30}>2×</option><option value={15}>4×</option>
            </select>
          </div>
        )}
      </div>
    </div>
  );
}
