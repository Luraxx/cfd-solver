'use client';

import React from 'react';
import { useSimulation, presets1D } from '@/context/SimulationContext';
import type { SchemeName } from '@/solver';
import type { InitialConditionType } from '@/solver';
import Icon from '@/components/Icons';

const schemes: { value: SchemeName; label: string }[] = [
  { value: 'UDS', label: 'UDS (Upwind)' },
  { value: 'CDS', label: 'CDS (Central)' },
  { value: 'TVD-minmod', label: 'TVD minmod' },
  { value: 'TVD-vanLeer', label: 'TVD van Leer' },
  { value: 'TVD-superbee', label: 'TVD Superbee' },
];

const icTypes: { value: InitialConditionType; label: string }[] = [
  { value: 'step', label: 'Sprung (Step)' },
  { value: 'gaussian', label: 'Gauß-Puls' },
  { value: 'sine', label: 'Sinus' },
  { value: 'triangle', label: 'Dreieck' },
];

export default function ParameterPanel() {
  const { state, dispatch, runSimulation } = useSimulation();

  const setParam = (key: string, value: number) => {
    dispatch({ type: 'SET_PARAM', key, value });
  };

  return (
    <div className="flex flex-col gap-3 p-3 bg-gray-950 text-gray-100 overflow-y-auto text-sm">
      <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-800 pb-2 flex items-center gap-1.5">
        <Icon name="compass" className="text-cyan-500" size={13} /> Parameter
      </h2>

      {/* Presets */}
      <div>
        <label className="block text-xs text-gray-400 mb-1">Preset</label>
        <select
          className="w-full p-1.5 bg-gray-800 border border-gray-600 rounded text-sm"
          value={state.activePreset ?? ''}
          onChange={(e) => {
            const preset = presets1D.find((p) => p.name === e.target.value);
            if (preset) dispatch({ type: 'APPLY_PRESET', preset });
          }}
        >
          <option value="">— Manuell —</option>
          {presets1D.map((p) => (
            <option key={p.name} value={p.name}>
              {p.name}
            </option>
          ))}
        </select>
        {state.activePreset && (
          <p className="text-xs text-gray-500 mt-1">
            {presets1D.find((p) => p.name === state.activePreset)?.description}
          </p>
        )}
      </div>

      {/* Grid */}
      <fieldset className="border border-gray-700 rounded p-2">
        <legend className="text-xs text-gray-400 px-1">Gitter</legend>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs text-gray-500">N (Zellen)</label>
            <input
              type="number"
              min={10}
              max={1000}
              value={state.N}
              onChange={(e) => setParam('N', parseInt(e.target.value) || 10)}
              className="w-full p-1 bg-gray-800 border border-gray-600 rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500">L (Länge)</label>
            <input
              type="number"
              min={0.1}
              step={0.1}
              value={state.L}
              onChange={(e) => setParam('L', parseFloat(e.target.value) || 1)}
              className="w-full p-1 bg-gray-800 border border-gray-600 rounded text-sm"
            />
          </div>
        </div>
      </fieldset>

      {/* Physics */}
      <fieldset className="border border-gray-700 rounded p-2">
        <legend className="text-xs text-gray-400 px-1">Physik</legend>
        <div className="space-y-2">
          <div>
            <label className="block text-xs text-gray-500">u (Geschwindigkeit)</label>
            <input
              type="number"
              step={0.1}
              value={state.u}
              onChange={(e) => setParam('u', parseFloat(e.target.value) || 0)}
              className="w-full p-1 bg-gray-800 border border-gray-600 rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500">Γ (Diffusion)</label>
            <input
              type="number"
              step={0.001}
              min={0}
              value={state.gamma}
              onChange={(e) => setParam('gamma', parseFloat(e.target.value) || 0)}
              className="w-full p-1 bg-gray-800 border border-gray-600 rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500">CFL-Zahl</label>
            <input
              type="range"
              min={0.05}
              max={2.0}
              step={0.05}
              value={state.cfl}
              onChange={(e) => setParam('cfl', parseFloat(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>0.05</span>
              <span className={`font-bold ${state.cfl > 1 ? 'text-red-400' : 'text-green-400'}`}>
                CFL = {state.cfl.toFixed(2)}
              </span>
              <span>2.0</span>
            </div>
          </div>
        </div>
      </fieldset>

      {/* Scheme selection */}
      <fieldset className="border border-gray-700 rounded p-2">
        <legend className="text-xs text-gray-400 px-1">Schema</legend>
        <select
          className="w-full p-1.5 bg-gray-800 border border-gray-600 rounded text-sm"
          value={state.scheme}
          onChange={(e) => dispatch({ type: 'SET_SCHEME', scheme: e.target.value as SchemeName })}
        >
          {schemes.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>

        <div className="mt-2">
          <label className="block text-xs text-gray-500">Vergleich mit:</label>
          <select
            className="w-full p-1.5 bg-gray-800 border border-gray-600 rounded text-sm"
            value={state.compareScheme ?? ''}
            onChange={(e) =>
              dispatch({
                type: 'SET_COMPARE_SCHEME',
                scheme: e.target.value ? (e.target.value as SchemeName) : null,
              })
            }
          >
            <option value="">— Kein Vergleich —</option>
            {schemes.filter((s) => s.value !== state.scheme).map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
      </fieldset>

      {/* Initial Condition */}
      <fieldset className="border border-gray-700 rounded p-2">
        <legend className="text-xs text-gray-400 px-1">Anfangsbedingung</legend>
        <select
          className="w-full p-1.5 bg-gray-800 border border-gray-600 rounded text-sm mb-2"
          value={state.ic.type}
          onChange={(e) =>
            dispatch({ type: 'SET_IC', ic: { ...state.ic, type: e.target.value as InitialConditionType } })
          }
        >
          {icTypes.map((ic) => (
            <option key={ic.value} value={ic.value}>{ic.label}</option>
          ))}
        </select>
      </fieldset>

      {/* Time */}
      <fieldset className="border border-gray-700 rounded p-2">
        <legend className="text-xs text-gray-400 px-1">Zeit</legend>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs text-gray-500">Schritte</label>
            <input
              type="number"
              min={1}
              max={10000}
              value={state.nSteps}
              onChange={(e) => setParam('nSteps', parseInt(e.target.value) || 1)}
              className="w-full p-1 bg-gray-800 border border-gray-600 rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500">Snapshot∆</label>
            <input
              type="number"
              min={1}
              max={1000}
              value={state.snapshotInterval}
              onChange={(e) => setParam('snapshotInterval', parseInt(e.target.value) || 1)}
              className="w-full p-1 bg-gray-800 border border-gray-600 rounded text-sm"
            />
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          dt = {state.dt.toExponential(3)} · Pe = {state.peclet === Infinity ? '∞' : state.peclet.toFixed(1)}
        </p>
      </fieldset>

      {/* Run button */}
      <button
        className={`w-full py-2.5 rounded font-bold text-sm transition-colors ${
          state.isRunning
            ? 'bg-gray-600 cursor-not-allowed'
            : 'bg-cyan-600 hover:bg-cyan-500 active:bg-cyan-700'
        }`}
        disabled={state.isRunning}
        onClick={runSimulation}
      >
        {state.isRunning ? 'Rechne...' : 'Berechnen & Abspielen'}
      </button>

      <p className="text-xs text-gray-600 text-center -mt-1">
        oder <kbd className="px-1.5 py-0.5 bg-gray-700 rounded text-gray-400 font-mono">Space</kbd> drücken
      </p>

      {state.diverged && (
        <div className="bg-red-900/30 border border-red-800/50 rounded p-2 text-xs text-red-300 flex items-start gap-1.5">
          <Icon name="alert-triangle" className="text-red-400 shrink-0 mt-0.5" size={12} />
          Simulation divergiert! Versuche kleinere CFL-Zahl oder mehr Zellen.
        </div>
      )}
    </div>
  );
}
