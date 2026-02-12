'use client';

import React, { useEffect, useRef } from 'react';
import katex from 'katex';
import { useSimulation } from '@/context/SimulationContext';
import { convectionStencil } from '@/solver';

function K({ tex }: { tex: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (ref.current) katex.render(tex, ref.current, { throwOnError: false });
  }, [tex]);
  return <span ref={ref} />;
}

export default function StencilPanel() {
  const { state } = useSimulation();
  const { scheme, u, cfl, dt, grid } = state;

  const stencil = convectionStencil(scheme, u, grid.dx, dt);

  // Visual stencil cells
  const cells = [
    { label: 'W', coeff: stencil.aW, pos: 'i-1' },
    { label: 'P', coeff: stencil.aP, pos: 'i' },
    { label: 'E', coeff: stencil.aE, pos: 'i+1' },
  ];

  return (
    <div className="flex flex-col h-full bg-gray-900 rounded-lg overflow-hidden">
      <div className="px-4 py-2 border-b border-gray-700">
        <h2 className="text-sm font-bold text-cyan-400">🔲 Diskretisierungsstern</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Visual stencil */}
        <div className="flex justify-center items-center gap-1">
          {cells.map((cell) => (
            <div
              key={cell.label}
              className={`flex flex-col items-center p-3 rounded border-2 min-w-[70px] ${
                cell.label === 'P'
                  ? 'border-cyan-400 bg-cyan-900/30'
                  : Math.abs(cell.coeff) > 1e-10
                  ? 'border-yellow-500 bg-yellow-900/20'
                  : 'border-gray-600 bg-gray-800'
              }`}
            >
              <span className="text-xs text-gray-400">{cell.pos}</span>
              <span className="text-lg font-bold text-white">{cell.label}</span>
              <span className={`text-sm font-mono ${
                Math.abs(cell.coeff) > 1e-10 ? 'text-yellow-300' : 'text-gray-500'
              }`}>
                {cell.coeff.toFixed(4)}
              </span>
              <span className="text-xs text-gray-500">
                <K tex={`a_${cell.label}`} />
              </span>
            </div>
          ))}
        </div>

        {/* Arrows */}
        <div className="flex justify-center items-center text-gray-500 text-xs">
          <span>← Fluss F_{'{i-½}'}</span>
          <span className="mx-8">Zelle P</span>
          <span>Fluss F_{'{i+½}'} →</span>
        </div>

        {/* Matrix form */}
        <div className="bg-gray-800 p-3 rounded">
          <p className="text-xs text-gray-400 mb-2">Matrixform (Update-Gleichung):</p>
          <div className="text-center">
            <K tex={`\\phi_P^{n+1} = a_W \\phi_W + a_P \\phi_P + a_E \\phi_E`} />
          </div>
          <p className="text-xs text-gray-500 mt-2 font-mono">{stencil.description}</p>
        </div>

        {/* Coefficients table */}
        <div className="bg-gray-800 p-3 rounded">
          <p className="text-xs text-gray-400 mb-2">Koeffizienten:</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-500 text-xs">
                <th className="text-left py-1">Koeffizient</th>
                <th className="text-right py-1">Wert</th>
                <th className="text-right py-1">Formel</th>
              </tr>
            </thead>
            <tbody className="font-mono">
              <tr>
                <td className="py-1"><K tex="a_W" /></td>
                <td className="text-right text-yellow-300">{stencil.aW.toFixed(6)}</td>
                <td className="text-right text-gray-500 text-xs">
                  {scheme === 'UDS' && u >= 0 ? 'c' : scheme === 'CDS' ? 'c/2' : '—'}
                </td>
              </tr>
              <tr>
                <td className="py-1"><K tex="a_P" /></td>
                <td className="text-right text-cyan-300">{stencil.aP.toFixed(6)}</td>
                <td className="text-right text-gray-500 text-xs">
                  {scheme === 'UDS' && u >= 0 ? '1−c' : scheme === 'CDS' ? '1' : '—'}
                </td>
              </tr>
              <tr>
                <td className="py-1"><K tex="a_E" /></td>
                <td className="text-right text-yellow-300">{stencil.aE.toFixed(6)}</td>
                <td className="text-right text-gray-500 text-xs">
                  {scheme === 'UDS' && u >= 0 ? '0' : scheme === 'CDS' ? '−c/2' : '—'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Key numbers */}
        <div className="bg-gray-800 p-3 rounded space-y-1">
          <p className="text-xs text-gray-400 mb-1">Kennzahlen:</p>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">CFL:</span>
            <span className={cfl <= 1 ? 'text-green-400' : 'text-red-400'}>{cfl.toFixed(4)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Δt:</span>
            <span className="text-gray-200">{dt.toExponential(3)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Δx:</span>
            <span className="text-gray-200">{grid.dx.toExponential(3)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Σ Koeff.:</span>
            <span className={Math.abs(stencil.aW + stencil.aP + stencil.aE - 1) < 1e-10
              ? 'text-green-400' : 'text-red-400'}>
              {(stencil.aW + stencil.aP + stencil.aE).toFixed(6)}
              {Math.abs(stencil.aW + stencil.aP + stencil.aE - 1) < 1e-10 ? ' ✓' : ' ⚠'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
