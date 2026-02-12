'use client';

import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useSimulation } from '@/context/SimulationContext';
import { l2Norm, lInfNorm, totalMass } from '@/solver';
import Icon from '@/components/Icons';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

export default function DiagnosticsPanel() {
  const { state } = useSimulation();
  const { history, grid, diverged } = state;

  const diagnosticData = useMemo(() => {
    if (!history || history.snapshots.length < 2) return null;

    const initial = history.snapshots[0].phi;
    const times: number[] = [];
    const l2Errors: number[] = [];
    const lInfErrors: number[] = [];
    const masses: number[] = [];
    const maxVals: number[] = [];
    const minVals: number[] = [];

    for (const snap of history.snapshots) {
      times.push(snap.time);
      l2Errors.push(l2Norm(snap.phi, initial));
      lInfErrors.push(lInfNorm(snap.phi, initial));
      masses.push(totalMass(snap.phi, grid.dx));

      let mx = -Infinity, mn = Infinity;
      for (let i = 0; i < snap.phi.length; i++) {
        if (snap.phi[i] > mx) mx = snap.phi[i];
        if (snap.phi[i] < mn) mn = snap.phi[i];
      }
      maxVals.push(mx);
      minVals.push(mn);
    }

    return { times, l2Errors, lInfErrors, masses, maxVals, minVals };
  }, [history, grid]);

  if (!diagnosticData) {
    return (
      <div className="flex flex-col h-full bg-gray-900 rounded-lg items-center justify-center text-gray-500 text-sm">
        Starte eine Simulation um Diagnostik zu sehen.
      </div>
    );
  }

  const initialMass = diagnosticData.masses[0];
  const finalMass = diagnosticData.masses[diagnosticData.masses.length - 1];
  const massError = initialMass !== 0 ? Math.abs(finalMass - initialMass) / Math.abs(initialMass) * 100 : 0;

  return (
    <div className="flex flex-col h-full bg-gray-950 rounded-lg overflow-hidden">
      <div className="px-4 py-2 border-b border-gray-700">
        <h2 className="text-sm font-bold text-cyan-400 flex items-center gap-1.5"><Icon name="chart-line" size={13} /> Diagnostik</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-gray-800 p-2 rounded text-center">
            <p className="text-xs text-gray-500">L₂ Fehler</p>
            <p className="text-lg font-mono text-cyan-300">
              {diagnosticData.l2Errors[diagnosticData.l2Errors.length - 1].toExponential(2)}
            </p>
          </div>
          <div className="bg-gray-800 p-2 rounded text-center">
            <p className="text-xs text-gray-500">Masse Δ</p>
            <p className={`text-lg font-mono ${massError < 0.1 ? 'text-green-400' : 'text-yellow-400'}`}>
              {massError.toFixed(3)}%
            </p>
          </div>
          <div className="bg-gray-800 p-2 rounded text-center">
            <p className="text-xs text-gray-500">Status</p>
            <p className={`text-lg font-bold ${diverged ? 'text-red-400' : 'text-green-400'}`}>
              {diverged ? '💥' : '✓'}
            </p>
          </div>
        </div>

        {/* Error evolution plot */}
        <div className="h-48">
          <Plot
            data={[
              {
                x: diagnosticData.times,
                y: diagnosticData.l2Errors,
                type: 'scatter' as const,
                mode: 'lines' as const,
                name: 'L₂ Fehler',
                line: { color: '#06b6d4', width: 2 },
              },
              {
                x: diagnosticData.times,
                y: diagnosticData.lInfErrors,
                type: 'scatter' as const,
                mode: 'lines' as const,
                name: 'L∞ Fehler',
                line: { color: '#f59e0b', width: 2, dash: 'dash' },
              },
            ]}
            layout={{
              autosize: true,
              margin: { l: 45, r: 10, t: 5, b: 35 },
              paper_bgcolor: '#111827',
              plot_bgcolor: '#1f2937',
              font: { color: '#9ca3af', size: 9 },
              xaxis: { title: { text: 't', font: { size: 10 } }, gridcolor: '#374151' },
              yaxis: { title: { text: 'Fehler', font: { size: 10 } }, gridcolor: '#374151', type: 'log' },
              legend: { x: 0.01, y: 0.99, font: { size: 8 }, bgcolor: 'rgba(0,0,0,0)' },
              showlegend: true,
            }}
            config={{ responsive: true, displayModeBar: false }}
            useResizeHandler
            style={{ width: '100%', height: '100%' }}
          />
        </div>

        {/* Mass conservation plot */}
        <div className="h-40">
          <Plot
            data={[
              {
                x: diagnosticData.times,
                y: diagnosticData.masses,
                type: 'scatter' as const,
                mode: 'lines' as const,
                name: 'Masse',
                line: { color: '#10b981', width: 2 },
              },
            ]}
            layout={{
              autosize: true,
              margin: { l: 45, r: 10, t: 5, b: 35 },
              paper_bgcolor: '#111827',
              plot_bgcolor: '#1f2937',
              font: { color: '#9ca3af', size: 9 },
              xaxis: { title: { text: 't', font: { size: 10 } }, gridcolor: '#374151' },
              yaxis: { title: { text: '∫φ dx', font: { size: 10 } }, gridcolor: '#374151' },
              showlegend: false,
            }}
            config={{ responsive: true, displayModeBar: false }}
            useResizeHandler
            style={{ width: '100%', height: '100%' }}
          />
        </div>

        {/* Min/Max bounds */}
        <div className="bg-gray-800 p-2 rounded text-xs">
          <p className="text-gray-400 mb-1">Wertebereiche (Boundedness):</p>
          <div className="flex justify-between">
            <span>min(φ) = {diagnosticData.minVals[diagnosticData.minVals.length - 1].toFixed(6)}</span>
            <span>max(φ) = {diagnosticData.maxVals[diagnosticData.maxVals.length - 1].toFixed(6)}</span>
          </div>
          {(diagnosticData.minVals[diagnosticData.minVals.length - 1] < -0.01 ||
            diagnosticData.maxVals[diagnosticData.maxVals.length - 1] > 1.01) && (
            <p className="text-yellow-400 mt-1 flex items-start gap-1">
              <Icon name="alert-triangle" size={12} className="mt-0.5 shrink-0" /> Unter-/Überschwinger erkannt! Das Schema ist nicht TVD/bounded.
            </p>
          )}
        </div>

        {/* Export */}
        <button
          onClick={() => {
            const data = {
              times: diagnosticData.times,
              l2Errors: diagnosticData.l2Errors,
              masses: diagnosticData.masses,
              snapshots: history?.snapshots.map(s => ({
                time: s.time,
                phi: Array.from(s.phi),
              })),
              x: Array.from(grid.xCell),
            };
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url; a.download = 'cfd_results.json'; a.click();
            URL.revokeObjectURL(url);
          }}
          className="w-full py-1.5 bg-gray-700 hover:bg-gray-600 rounded text-xs"
        >
          📥 Export JSON (für MATLAB/Python)
        </button>
      </div>
    </div>
  );
}
