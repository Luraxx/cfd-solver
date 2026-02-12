'use client';

import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useSimulation } from '@/context/SimulationContext';
import Icon from '@/components/Icons';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

export default function PlotPanel() {
  const { state, dispatch, runSimulation, togglePlayback } = useSimulation();
  const { history, compareHistory, currentSnapshotIdx, grid, scheme, compareScheme, diverged, isPlaying, isRunning, hasRun, playbackSpeed } = state;

  const plotData = useMemo(() => {
    if (!history || history.snapshots.length === 0) return null;

    const x = Array.from(grid.xCell);
    const snap = history.snapshots[currentSnapshotIdx] ?? history.snapshots[history.snapshots.length - 1];
    const initial = history.snapshots[0];

    const traces: Plotly.Data[] = [
      // Initial condition (dashed)
      {
        x,
        y: Array.from(initial.phi),
        type: 'scatter' as const,
        mode: 'lines' as const,
        name: 'Anfangsbedingung',
        line: { color: '#6b7280', dash: 'dash', width: 1.5 },
      },
      // Current state
      {
        x,
        y: Array.from(snap.phi),
        type: 'scatter' as const,
        mode: 'lines' as const,
        name: `${scheme} (t=${snap.time.toFixed(4)})`,
        line: { color: '#06b6d4', width: 2.5 },
      },
    ];

    // Comparison scheme
    if (compareHistory && compareScheme) {
      const cSnap = compareHistory.snapshots[Math.min(currentSnapshotIdx, compareHistory.snapshots.length - 1)];
      if (cSnap) {
        traces.push({
          x,
          y: Array.from(cSnap.phi),
          type: 'scatter' as const,
          mode: 'lines' as const,
          name: `${compareScheme} (t=${cSnap.time.toFixed(4)})`,
          line: { color: '#f59e0b', width: 2.5 },
        });
      }
    }

    return traces;
  }, [history, compareHistory, currentSnapshotIdx, grid, scheme, compareScheme]);

  const nSnapshots = history?.snapshots.length ?? 0;

  return (
<div className="flex flex-col h-full bg-gray-950 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
            <Icon name="chart-line" className="text-cyan-500" size={13} /> φ(x) Profil
          </h2>
          {diverged && (
            <span className="text-xs text-red-400 font-bold animate-pulse flex items-center gap-1">
              <Icon name="alert-triangle" size={11} /> DIVERGIERT
            </span>
        )}
      </div>

      <div className="flex-1 min-h-0">
        {plotData ? (
          <Plot
            data={plotData}
            layout={{
              autosize: true,
              margin: { l: 50, r: 20, t: 10, b: 45 },
                paper_bgcolor: 'transparent',
                plot_bgcolor: '#0d1117',
                font: { color: '#6b7280', size: 10 },
              xaxis: {
                title: { text: 'x', font: { size: 12 } },
                gridcolor: '#374151',
                zerolinecolor: '#4b5563',
              },
              yaxis: {
                title: { text: 'φ', font: { size: 12 } },
                gridcolor: '#374151',
                zerolinecolor: '#4b5563',
              },
              legend: {
                x: 0.01, y: 0.99,
                bgcolor: 'rgba(17,24,39,0.8)',
                font: { size: 10 },
              },
              showlegend: true,
            }}
            config={{
              responsive: true,
              displayModeBar: true,
              modeBarButtonsToRemove: ['lasso2d', 'select2d'],
              toImageButtonOptions: { format: 'png', width: 1200, height: 600 },
            }}
            useResizeHandler
            style={{ width: '100%', height: '100%' }}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 gap-4">
            <p className="text-sm">Drücke <kbd className="px-2 py-0.5 bg-gray-700 rounded text-gray-300 font-mono text-xs">Space</kbd> oder den Button um zu starten</p>
            <button
              onClick={runSimulation}
              disabled={isRunning}
              className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 active:bg-cyan-700 text-white rounded-lg font-bold text-sm transition-colors disabled:opacity-50"
            >
              ▶ Simulation starten
            </button>
          </div>
        )}
      </div>

      {/* Transport controls + timeline */}
      <div className="px-4 py-2 border-t border-gray-800 space-y-2">
        {/* Playback bar */}
        <div className="flex items-center gap-2">
          {/* Play/Pause button */}
          <button
            onClick={togglePlayback}
            disabled={isRunning}
            className={`w-10 h-10 flex items-center justify-center rounded-lg font-bold text-lg transition-colors shrink-0 ${
              isPlaying
                ? 'bg-yellow-600 hover:bg-yellow-500 text-white'
                : 'bg-cyan-600 hover:bg-cyan-500 text-white'
            } disabled:opacity-50`}
            title={isPlaying ? 'Pause (Space)' : hasRun ? 'Play (Space)' : 'Start (Space)'}
          >
              {isRunning ? '...' : isPlaying ? '⏸' : '▶'}
          </button>

          {/* Timeline slider */}
          <div className="flex-1 min-w-0">
            <input
              type="range"
              min={0}
              max={nSnapshots > 0 ? nSnapshots - 1 : 0}
              value={currentSnapshotIdx}
              onChange={(e) => {
                dispatch({ type: 'SET_PLAYING', playing: false });
                dispatch({ type: 'SET_SNAPSHOT_IDX', idx: parseInt(e.target.value) });
              }}
              disabled={nSnapshots === 0}
              className="w-full"
            />
          </div>

          {/* Speed control */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => dispatch({ type: 'SET_PLAYBACK_SPEED', speed: Math.min(500, playbackSpeed + 20) })}
              className="w-6 h-6 flex items-center justify-center rounded bg-gray-700 hover:bg-gray-600 text-xs"
              title="Langsamer"
            >−</button>
            <span className="text-xs text-gray-400 w-8 text-center font-mono">
              {playbackSpeed < 50 ? '4x' : playbackSpeed < 100 ? '2x' : playbackSpeed < 160 ? '1x' : playbackSpeed < 300 ? '½' : '¼'}
            </span>
            <button
              onClick={() => dispatch({ type: 'SET_PLAYBACK_SPEED', speed: Math.max(20, playbackSpeed - 20) })}
              className="w-6 h-6 flex items-center justify-center rounded bg-gray-700 hover:bg-gray-600 text-xs"
              title="Schneller"
            >+</button>
          </div>

          {/* Re-run button */}
          <button
            onClick={runSimulation}
            disabled={isRunning}
            className="px-3 h-8 rounded bg-gray-700 hover:bg-gray-600 text-xs shrink-0 disabled:opacity-50"
            title="Neu berechnen"
          >
            ↻
          </button>
        </div>

        {/* Info line */}
        <div className="flex justify-between text-xs text-gray-500">
          <span>
            {nSnapshots > 0
              ? `Snapshot ${currentSnapshotIdx + 1}/${nSnapshots}`
              : 'Keine Daten'}
          </span>
          <span>
            {history && history.snapshots[currentSnapshotIdx]
              ? `t = ${history.snapshots[currentSnapshotIdx].time.toFixed(4)}`
              : ''}
          </span>
          <span className="text-gray-600">
            Space = Play/Pause
          </span>
        </div>
      </div>
    </div>
  );
}
