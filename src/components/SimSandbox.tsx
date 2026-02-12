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
        {simMode === 'fv-tvd' && <TVDSandbox />}
        {simMode === 'fv-scheme-compare' && <SchemeCompareSandbox />}
        {simMode === 'stability-cfl' && <CFLSandbox />}
        {simMode === 'stability-peclet' && <PecletSandbox />}
        {simMode === '2d-scalar' && <ScalarTransport2DSandbox />}
        {simMode === '2d-navier-stokes' && <CavitySandbox />}
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
    <div className="flex h-full min-h-0">
      <aside className="w-48 shrink-0 border-r border-gray-800/50 overflow-y-auto p-3 space-y-3">
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
      </aside>
      <div className="flex-1 flex flex-col min-w-0 min-h-0">
        <div className="flex-1 min-h-0 p-1">
          {plotData ? (
            <Plot data={plotData.traces}
              layout={{ ...PLOT_LAYOUT_BASE, xaxis: { ...PLOT_LAYOUT_BASE.xaxis, title: { text: 'x' } }, yaxis: { ...PLOT_LAYOUT_BASE.yaxis, title: { text: 'T' }, range: [-0.1, 1.2] } } as Plotly.Layout}
              config={PLOT_CONFIG} useResizeHandler style={{ width: '100%', height: '100%' }} />
          ) : (
            <PlaceholderMsg icon="flame" text="Space drücken oder Starten" />
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
    <div className="flex h-full min-h-0">
      <aside className="w-52 shrink-0 border-r border-gray-800/50 overflow-y-auto p-3 space-y-3">
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
    <div className="flex h-full min-h-0">
      <aside className="w-48 shrink-0 border-r border-gray-800/50 overflow-y-auto p-3 space-y-3">
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
    <div className="flex h-full min-h-0">
      <aside className="w-48 shrink-0 border-r border-gray-800/50 overflow-y-auto p-3 space-y-3">
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
      </aside>
      <div className="flex-1 flex flex-col min-w-0 min-h-0">
        <div className="flex-1 min-h-0 p-1"><FVMPlot /></div>
        {(state.history?.snapshots.length ?? 0) > 0 && <FVMPlaybackBar />}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   5. TVD SANDBOX — Flux limiters
═══════════════════════════════════════════════════════════════════ */
function TVDSandbox() {
  const { state, dispatch, runSimulation } = useSimulation();

  useEffect(() => { dispatch({ type: 'SET_PARAM', key: 'gamma', value: 0 }); }, [dispatch]);

  const tvd: { v: SchemeName; l: string }[] = [
    { v: 'TVD-minmod', l: 'minmod' }, { v: 'TVD-vanLeer', l: 'van Leer' }, { v: 'TVD-superbee', l: 'Superbee' },
  ];

  return (
    <div className="flex h-full min-h-0">
      <aside className="w-48 shrink-0 border-r border-gray-800/50 overflow-y-auto p-3 space-y-3">
        <div className="text-[11px] font-semibold text-rose-400 mb-1 flex items-center gap-1.5"><Icon name="shield" className="text-rose-400" size={13} /> TVD-Limiter</div>
        <SelectField label="Limiter" value={state.scheme} options={tvd.map(s => ({ v: s.v, l: s.l }))}
          onChange={v => dispatch({ type: 'SET_SCHEME', scheme: v as SchemeName })} />
        <div>
          <span className="text-[10px] text-gray-500">Vergleich</span>
          <select value={state.compareScheme ?? ''} onChange={e => dispatch({ type: 'SET_COMPARE_SCHEME', scheme: e.target.value ? e.target.value as SchemeName : null })}
            className="w-full bg-gray-800/60 border border-gray-700/50 rounded px-2 py-1 text-[11px] text-gray-300 mt-0.5">
            <option value="">— kein —</option>
            <option value="UDS">UDS</option><option value="CDS">CDS</option>
            {tvd.filter(s => s.v !== state.scheme).map(s => <option key={s.v} value={s.v}>{s.l}</option>)}
          </select>
        </div>
        <SelectField label="IC" value={state.ic.type}
          options={[{ v: 'step', l: 'Sprung' }, { v: 'gaussian', l: 'Gauß' }, { v: 'sine', l: 'Sinus' }]}
          onChange={v => dispatch({ type: 'SET_IC', ic: { ...state.ic, type: v as InitialConditionType } })} />
        <Slider label="CFL" value={state.cfl} min={0.1} max={1.0} step={0.05} onChange={v => dispatch({ type: 'SET_PARAM', key: 'cfl', value: v })} color="rose" />
        <RunBtn onClick={runSimulation} hasResult={state.hasRun} />
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
    <div className="flex h-full min-h-0">
      <aside className="w-48 shrink-0 border-r border-gray-800/50 overflow-y-auto p-3 space-y-3">
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
    <div className="flex h-full min-h-0">
      <aside className="w-48 shrink-0 border-r border-gray-800/50 overflow-y-auto p-3 space-y-3">
        <div className="text-[11px] font-semibold text-amber-400 mb-1 flex items-center gap-1.5"><Icon name="clock" className="text-amber-400" size={13} /> CFL-Bedingung</div>
        <BigNumber value={state.cfl.toFixed(2)} label="CFL = |u|·Δt/Δx" ok={state.cfl <= 1} />
        <Slider label="CFL" value={state.cfl} min={0.1} max={2.0} step={0.05} onChange={v => dispatch({ type: 'SET_PARAM', key: 'cfl', value: v })} color="amber" warn={state.cfl > 1} />
        <Slider label="u" value={state.u} min={0.1} max={3} step={0.1} onChange={v => dispatch({ type: 'SET_PARAM', key: 'u', value: v })} color="amber" />
        <Slider label="N" value={state.N} min={20} max={200} step={10} onChange={v => dispatch({ type: 'SET_PARAM', key: 'N', value: v })} color="amber" />
        <div className="text-[10px] text-gray-600">Δt = {state.dt.toExponential(2)}, Δx = {state.grid.dx.toFixed(4)}</div>
        <RunBtn onClick={runSimulation} hasResult={state.hasRun} />
        {state.diverged && <div className="text-[10px] text-red-400 bg-red-900/20 rounded p-1.5"><Icon name="explosion" className="text-red-400 inline-block mr-1" size={11} />Instabil! CFL &gt; 1</div>}
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
    <div className="flex h-full min-h-0">
      <aside className="w-48 shrink-0 border-r border-gray-800/50 overflow-y-auto p-3 space-y-3">
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

  if (!plotData) return <PlaceholderMsg icon="bar-chart" text="Space drücken oder Starten" />;

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
    <div className="flex h-full min-h-0">
      <aside className="w-48 shrink-0 border-r border-gray-800/50 overflow-y-auto p-3 space-y-3">
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
            <PlaceholderMsg icon="map" text="Space drücken oder Starten" />
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
   10. CAVITY SANDBOX — Lid-Driven Cavity (SIMPLE-like solver)
   A simplified 2D incompressible Navier-Stokes solver
═══════════════════════════════════════════════════════════════════ */

interface CavityResult {
  u: Float64Array;   // x-velocity
  v: Float64Array;   // y-velocity
  p: Float64Array;   // pressure
  Nx: number;
  Ny: number;
  Lx: number;
  Ly: number;
  converged: boolean;
  residuals: number[];
}

function solveCavity(
  Nx: number, Ny: number, Re: number, uLid: number, nIter: number, alpha: number
): CavityResult {
  const Lx = 1, Ly = 1;
  const dx = Lx / Nx, dy = Ly / Ny;
  const n = Nx * Ny;
  const nu = uLid * Lx / Re;

  // Staggered-like approach on collocated grid with pressure correction
  const u = new Float64Array(n);
  const v = new Float64Array(n);
  const p = new Float64Array(n);
  const uStar = new Float64Array(n);
  const vStar = new Float64Array(n);
  const pp = new Float64Array(n); // pressure correction
  const residuals: number[] = [];

  const dt = Math.min(0.25 * dx * dx / nu, 0.5 * dx / uLid);
  const idx = (i: number, j: number) => j * Nx + i;

  for (let iter = 0; iter < nIter; iter++) {
    // --- Momentum predictor (explicit) ---
    for (let j = 1; j < Ny - 1; j++) {
      for (let i = 1; i < Nx - 1; i++) {
        const c = idx(i, j);
        const uP = u[c], vP = v[c];
        const uE = u[idx(i + 1, j)], uW = u[idx(i - 1, j)];
        const uN = u[idx(i, j + 1)], uS = u[idx(i, j - 1)];
        const vE = v[idx(i + 1, j)], vW = v[idx(i - 1, j)];
        const vN = v[idx(i, j + 1)], vS = v[idx(i, j - 1)];

        // Convection (UDS) + Diffusion
        const duConv = uP * (uP - uW) / dx + vP * (uP - uS) / dy;
        const duDiff = nu * ((uE - 2 * uP + uW) / (dx * dx) + (uN - 2 * uP + uS) / (dy * dy));
        const dpx = (p[idx(i + 1, j)] - p[idx(i - 1, j)]) / (2 * dx);

        const dvConv = uP * (vP - vW) / dx + vP * (vP - vS) / dy;
        const dvDiff = nu * ((vE - 2 * vP + vW) / (dx * dx) + (vN - 2 * vP + vS) / (dy * dy));
        const dpy = (p[idx(i, j + 1)] - p[idx(i, j - 1)]) / (2 * dy);

        uStar[c] = uP + dt * (-duConv + duDiff - dpx);
        vStar[c] = vP + dt * (-dvConv + dvDiff - dpy);
      }
    }

    // Apply BCs to uStar, vStar
    for (let i = 0; i < Nx; i++) {
      uStar[idx(i, 0)] = 0; vStar[idx(i, 0)] = 0;   // bottom no-slip
      uStar[idx(i, Ny - 1)] = uLid; vStar[idx(i, Ny - 1)] = 0; // top lid
    }
    for (let j = 0; j < Ny; j++) {
      uStar[idx(0, j)] = 0; vStar[idx(0, j)] = 0;   // left
      uStar[idx(Nx - 1, j)] = 0; vStar[idx(Nx - 1, j)] = 0; // right
    }

    // --- Pressure correction (Poisson) ---
    pp.fill(0);
    for (let pIter = 0; pIter < 30; pIter++) {
      for (let j = 1; j < Ny - 1; j++) {
        for (let i = 1; i < Nx - 1; i++) {
          const c = idx(i, j);
          const div = (uStar[idx(i + 1, j)] - uStar[idx(i - 1, j)]) / (2 * dx)
            + (vStar[idx(i, j + 1)] - vStar[idx(i, j - 1)]) / (2 * dy);
          const rhs = div / dt;
          pp[c] = alpha * (
            (pp[idx(i + 1, j)] + pp[idx(i - 1, j)]) / (dx * dx) +
            (pp[idx(i, j + 1)] + pp[idx(i, j - 1)]) / (dy * dy) -
            rhs
          ) / (2 / (dx * dx) + 2 / (dy * dy))
            + (1 - alpha) * pp[c];
        }
      }
      // Zero-gradient BC for pressure
      for (let i = 0; i < Nx; i++) {
        pp[idx(i, 0)] = pp[idx(i, 1)];
        pp[idx(i, Ny - 1)] = pp[idx(i, Ny - 2)];
      }
      for (let j = 0; j < Ny; j++) {
        pp[idx(0, j)] = pp[idx(1, j)];
        pp[idx(Nx - 1, j)] = pp[idx(Nx - 1 > 0 ? Nx - 2 : 0, j)];
      }
    }

    // --- Correct velocities and pressure ---
    for (let j = 1; j < Ny - 1; j++) {
      for (let i = 1; i < Nx - 1; i++) {
        const c = idx(i, j);
        u[c] = uStar[c] - dt * (pp[idx(i + 1, j)] - pp[idx(i - 1, j)]) / (2 * dx);
        v[c] = vStar[c] - dt * (pp[idx(i, j + 1)] - pp[idx(i, j - 1)]) / (2 * dy);
        p[c] += 0.3 * pp[c];
      }
    }

    // Apply velocity BCs again
    for (let i = 0; i < Nx; i++) {
      u[idx(i, 0)] = 0; v[idx(i, 0)] = 0;
      u[idx(i, Ny - 1)] = uLid; v[idx(i, Ny - 1)] = 0;
    }
    for (let j = 0; j < Ny; j++) {
      u[idx(0, j)] = 0; v[idx(0, j)] = 0;
      u[idx(Nx - 1, j)] = 0; v[idx(Nx - 1, j)] = 0;
    }

    // Residual check
    let res = 0;
    for (let j = 1; j < Ny - 1; j++) {
      for (let i = 1; i < Nx - 1; i++) {
        const c = idx(i, j);
        const div = (u[idx(i + 1, j)] - u[idx(i - 1, j)]) / (2 * dx)
          + (v[idx(i, j + 1)] - v[idx(i, j - 1)]) / (2 * dy);
        res += div * div;
      }
    }
    residuals.push(Math.sqrt(res / n));
    if (residuals[residuals.length - 1] < 1e-6) {
      return { u, v, p, Nx, Ny, Lx, Ly, converged: true, residuals };
    }
  }

  return { u, v, p, Nx, Ny, Lx, Ly, converged: false, residuals };
}

function CavitySandbox() {
  const [Nx, setNx] = useState(30);
  const [Re, setRe] = useState(100);
  const [nIter, setNIter] = useState(500);
  const [result, setResult] = useState<CavityResult | null>(null);
  const [computing, setComputing] = useState(false);
  const [vizMode, setVizMode] = useState<'speed' | 'pressure' | 'vorticity'>('speed');

  const run = useCallback(() => {
    setComputing(true);
    // Run async to not block UI
    setTimeout(() => {
      const res = solveCavity(Nx, Nx, Re, 1.0, nIter, 1.2);
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
    const { u, v, p, Nx: nx, Ny: ny, Lx: lx, Ly: ly } = result;
    const dx = lx / nx, dy = ly / ny;
    const x = Array.from({ length: nx }, (_, i) => (i + 0.5) * dx);
    const y = Array.from({ length: ny }, (_, j) => (j + 0.5) * dy);
    const z: number[][] = [];

    for (let j = 0; j < ny; j++) {
      const row: number[] = [];
      for (let i = 0; i < nx; i++) {
        const c = j * nx + i;
        if (vizMode === 'speed') {
          row.push(Math.sqrt(u[c] * u[c] + v[c] * v[c]));
        } else if (vizMode === 'pressure') {
          row.push(p[c]);
        } else {
          // Vorticity ∂v/∂x - ∂u/∂y
          const dvdx = i > 0 && i < nx - 1 ? (v[j * nx + i + 1] - v[j * nx + i - 1]) / (2 * dx) : 0;
          const dudy = j > 0 && j < ny - 1 ? (u[(j + 1) * nx + i] - u[(j - 1) * nx + i]) / (2 * dy) : 0;
          row.push(dvdx - dudy);
        }
      }
      z.push(row);
    }

    return { z, x, y };
  }, [result, vizMode]);

  return (
    <div className="flex h-full min-h-0">
      <aside className="w-48 shrink-0 border-r border-gray-800/50 overflow-y-auto p-3 space-y-3">
        <div className="text-[11px] font-semibold text-violet-400 mb-1 flex items-center gap-1.5">
          <Icon name="spiral" className="text-violet-400" size={13} /> Lid-Driven Cavity
        </div>
        <Slider label="N (pro Achse)" value={Nx} min={15} max={60} step={5} onChange={setNx} color="violet" />
        <Slider label="Reynolds Re" value={Re} min={10} max={1000} step={10} onChange={setRe} color="violet" />
        <Slider label="Iterationen" value={nIter} min={100} max={3000} step={100} onChange={setNIter} color="violet" />
        <SelectField label="Anzeige" value={vizMode}
          options={[{ v: 'speed', l: 'Geschwindigkeit' }, { v: 'pressure', l: 'Druck' }, { v: 'vorticity', l: 'Wirbelstärke' }]}
          onChange={v => setVizMode(v as 'speed' | 'pressure' | 'vorticity')} />
        <button onClick={run} disabled={computing}
          className={`w-full py-2 rounded-lg font-semibold text-xs transition-colors ${
            computing ? 'bg-gray-700 text-gray-500' : 'bg-violet-600 hover:bg-violet-500 text-white'
          }`}>
          {computing ? 'Berechne...' : result ? '↻ Neustart' : '▶ Starten'}
        </button>
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
                colorscale: vizMode === 'vorticity' ? 'RdBu' : 'Viridis',
                colorbar: { thickness: 12, len: 0.8, tickfont: { size: 9, color: '#6b7280' } },
                reversescale: vizMode === 'vorticity',
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
            <PlaceholderMsg icon="spiral" text="Space drücken oder Starten" />
          )}
        </div>
      </div>
    </div>
  );
}
