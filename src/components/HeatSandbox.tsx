'use client';

import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { solveHeat1D, initHeatGaussian, initHeatStep, heatMaxDt, HeatConfig, HeatResult } from '@/solver/fdm';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

/**
 * HeatSandbox — Standalone interactive sandbox for 1D heat conduction (FDM)
 *
 * Parameters: N, L, alpha, nSteps
 * Animated playback through time steps
 */
export default function HeatSandbox() {
  // Parameters
  const [N, setN] = useState(50);
  const [L, setL] = useState(1.0);
  const [alpha, setAlpha] = useState(0.01);
  const [nSteps, setNSteps] = useState(200);
  const [icType, setIcType] = useState<'gaussian' | 'step'>('gaussian');
  const [fourierTarget, setFourierTarget] = useState(0.4);

  // Simulation state
  const [result, setResult] = useState<HeatResult | null>(null);
  const [snapIdx, setSnapIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playSpeed, setPlaySpeed] = useState(60);

  const stateRef = useRef({ isPlaying, snapIdx, playSpeed, result });
  stateRef.current = { isPlaying, snapIdx, playSpeed, result };

  // Derived
  const dx = L / N;
  const dtMax = heatMaxDt(dx, alpha);
  const dt = dtMax * fourierTarget / 0.5; // scale so fourierTarget maps to the fourier number
  const fourier = (alpha * dt) / (dx * dx);

  // Run simulation
  const run = useCallback(() => {
    setIsPlaying(false);
    const T0 = icType === 'gaussian'
      ? initHeatGaussian(N, L, L / 2, 0.05)
      : initHeatStep(N, L, L * 0.4, L * 0.6);

    const config: HeatConfig = {
      N, L, alpha, dt, nSteps,
      bcLeft: 'fixed',
      bcRight: 'fixed',
      snapshotInterval: Math.max(1, Math.floor(nSteps / 100)),
    };

    const res = solveHeat1D(T0, config);
    setResult(res);
    setSnapIdx(0);

    // Auto-play
    requestAnimationFrame(() => setIsPlaying(true));
  }, [N, L, alpha, dt, nSteps, icType]);

  // Animated playback
  const animRef = useRef<number | null>(null);
  const lastTickRef = useRef(0);

  useEffect(() => {
    if (!isPlaying || !result) {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      return;
    }

    const tick = (now: number) => {
      const s = stateRef.current;
      if (!s.isPlaying || !s.result) return;
      if (now - lastTickRef.current >= s.playSpeed) {
        lastTickRef.current = now;
        const total = s.result.snapshots.length;
        if (s.snapIdx >= total - 1) {
          setIsPlaying(false);
          return;
        }
        setSnapIdx(prev => prev + 1);
      }
      animRef.current = requestAnimationFrame(tick);
    };
    lastTickRef.current = performance.now();
    animRef.current = requestAnimationFrame(tick);

    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [isPlaying, result]);

  // Spacebar handler
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (e.code === 'Space') {
        e.preventDefault();
        if (!stateRef.current.result) {
          run();
        } else {
          setIsPlaying(p => !p);
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [run]);

  // Plot data
  const plotData = useMemo(() => {
    if (!result) return null;
    const snap = result.snapshots[snapIdx] ?? result.snapshots[0];
    const initial = result.snapshots[0];
    const x = Array.from({ length: N }, (_, i) => (i + 0.5) * dx);

    return {
      traces: [
        {
          x, y: Array.from(initial.T),
          type: 'scatter' as const, mode: 'lines' as const,
          name: 'T₀', line: { color: '#6b7280', dash: 'dash', width: 1.5 },
        },
        {
          x, y: Array.from(snap.T),
          type: 'scatter' as const, mode: 'lines' as const,
          name: `T (t=${snap.time.toFixed(4)})`, line: { color: '#f59e0b', width: 2.5 },
        },
      ] as Plotly.Data[],
      step: snap.step,
      time: snap.time,
    };
  }, [result, snapIdx, N, dx]);

  return (
    <div className="flex h-full min-h-0">
      {/* Left: parameters */}
      <aside className="w-56 shrink-0 border-r border-gray-800 overflow-y-auto p-3 space-y-3 text-xs">
        <h3 className="text-sm font-bold text-amber-400">🔥 1D Wärmeleitung (FDM)</h3>

        {/* IC */}
        <div>
          <label className="block text-gray-400 mb-1">Anfangsbedingung</label>
          <select value={icType} onChange={e => setIcType(e.target.value as 'gaussian' | 'step')}
            className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-gray-200">
            <option value="gaussian">Gauß-Puls</option>
            <option value="step">Stufe (Block)</option>
          </select>
        </div>

        {/* N */}
        <div>
          <label className="block text-gray-400 mb-1">Gitterpunkte N = {N}</label>
          <input type="range" min={10} max={200} value={N} onChange={e => setN(+e.target.value)}
            className="w-full accent-amber-500" />
        </div>

        {/* alpha */}
        <div>
          <label className="block text-gray-400 mb-1">α = {alpha.toFixed(4)}</label>
          <input type="range" min={0.001} max={0.1} step={0.001} value={alpha}
            onChange={e => setAlpha(+e.target.value)}
            className="w-full accent-amber-500" />
        </div>

        {/* Fourier number */}
        <div>
          <label className="block text-gray-400 mb-1">
            Fourier r = {fourier.toFixed(3)}
            <span className={fourier > 0.5 ? ' text-red-400 font-bold' : ' text-green-400'}>
              {fourier > 0.5 ? ' ⚠ INSTABIL!' : ' ✓ stabil'}
            </span>
          </label>
          <input type="range" min={0.05} max={0.8} step={0.01} value={fourierTarget}
            onChange={e => setFourierTarget(+e.target.value)}
            className="w-full accent-amber-500" />
          <div className="text-[10px] text-gray-600 mt-1">
            Δt = {dt.toExponential(2)} &nbsp;|&nbsp; Δx = {dx.toFixed(4)}
          </div>
        </div>

        {/* nSteps */}
        <div>
          <label className="block text-gray-400 mb-1">Zeitschritte = {nSteps}</label>
          <input type="range" min={50} max={2000} step={50} value={nSteps}
            onChange={e => setNSteps(+e.target.value)}
            className="w-full accent-amber-500" />
        </div>

        {/* Run button */}
        <button onClick={run}
          className="w-full py-2 bg-amber-600 hover:bg-amber-500 text-white rounded font-bold transition-colors">
          {result ? '🔄 Neustart' : '▶ Simulation starten'}
        </button>
        <p className="text-[10px] text-gray-600 text-center">Leertaste = Play/Pause</p>

        {/* Info */}
        {result && result.diverged && (
          <div className="p-2 rounded bg-red-900/30 border border-red-700 text-red-300 text-[11px]">
            ⚠ Lösung divergiert! Fourier-Zahl r {'>'} 0.5 → verringere r.
          </div>
        )}
      </aside>

      {/* Center: plot */}
      <div className="flex-1 flex flex-col min-w-0 min-h-0">
        <div className="flex-1 min-h-0 p-2">
          {plotData ? (
            <Plot
              data={plotData.traces}
              layout={{
                autosize: true,
                margin: { l: 50, r: 20, t: 30, b: 40 },
                paper_bgcolor: 'transparent',
                plot_bgcolor: '#111827',
                font: { color: '#9ca3af', size: 11 },
                xaxis: { title: { text: 'x' }, gridcolor: '#1f2937', zerolinecolor: '#374151' },
                yaxis: { title: { text: 'T(x)' }, gridcolor: '#1f2937', zerolinecolor: '#374151', range: [-0.1, 1.2] },
                showlegend: true,
                legend: { x: 0.7, y: 0.95, font: { size: 10, color: '#9ca3af' }, bgcolor: 'rgba(0,0,0,0.3)' },
              }}
              config={{ responsive: true, displayModeBar: false }}
              useResizeHandler
              style={{ width: '100%', height: '100%' }}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-600">
              <div className="text-center">
                <div className="text-3xl mb-2">🔥</div>
                <p className="text-sm">Klicke &quot;Simulation starten&quot; oder drücke Space</p>
              </div>
            </div>
          )}
        </div>

        {/* Playback bar */}
        {result && (
          <div className="flex items-center gap-2 px-3 py-2 border-t border-gray-800 bg-gray-900/80 text-xs shrink-0">
            <button onClick={() => setIsPlaying(p => !p)}
              className="px-2 py-1 bg-gray-800 rounded hover:bg-gray-700 text-gray-300">
              {isPlaying ? '⏸' : '▶'}
            </button>
            <input type="range" min={0} max={(result?.snapshots.length ?? 1) - 1} value={snapIdx}
              onChange={e => { setIsPlaying(false); setSnapIdx(+e.target.value); }}
              className="flex-1 accent-amber-500" />
            <span className="text-gray-500 w-24 text-right font-mono">
              t = {result.snapshots[snapIdx]?.time.toFixed(4) ?? '0'}
            </span>
            <select value={playSpeed} onChange={e => setPlaySpeed(+e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded px-1 py-0.5 text-gray-300">
              <option value={120}>0.5×</option>
              <option value={60}>1×</option>
              <option value={30}>2×</option>
              <option value={15}>4×</option>
            </select>
          </div>
        )}
      </div>
    </div>
  );
}
