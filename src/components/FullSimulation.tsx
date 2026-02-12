'use client';

import React, { useState } from 'react';
import { useSimulation } from '@/context/SimulationContext';
import ParameterPanel from '@/components/ParameterPanel';
import PlotPanel from '@/components/PlotPanel';
import TabPanel from '@/components/TabPanel';
import SimSandbox from '@/components/SimSandbox';
import Icon from '@/components/Icons';
import type { SimMode } from '@/curriculum/curriculum';

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   FullSimulation — Simulations-Labor.
   Multi-mode sandbox with all available simulations.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

interface SimOption {
  mode: SimMode | 'fvm-advanced';
  label: string;
  icon: string;
  group: string;
}

const SIM_OPTIONS: SimOption[] = [
  // FVM Advanced (uses the old 3-panel layout)
  { mode: 'fvm-advanced', label: 'FVM Konvektion-Diffusion', icon: 'chart-line', group: 'FVM' },
  // FDM
  { mode: 'fd-1d-heat', label: '1D Wärmeleitung (FDM)', icon: 'flame', group: 'FDM' },
  { mode: 'fd-stencil-explorer', label: 'Stencil-Explorer', icon: 'grid-square', group: 'FDM' },
  // FVM
  { mode: 'fv-1d-convection', label: '1D Konvektion', icon: 'arrow-right', group: 'FVM' },
  { mode: 'fv-1d-convection-diffusion', label: 'Konvektion-Diffusion', icon: 'arrows-h', group: 'FVM' },
  { mode: 'fv-scheme-compare', label: 'Schema-Vergleich & TVD', icon: 'bar-chart', group: 'FVM' },
  // Stabilität
  { mode: 'stability-cfl', label: 'CFL-Analyse', icon: 'clock', group: 'Stabilität' },
  { mode: 'stability-peclet', label: 'Péclet-Analyse', icon: 'scale', group: 'Stabilität' },
  // 2D
  { mode: '2d-scalar', label: '2D Skalartransport', icon: 'hexagon', group: '2D' },
  { mode: '2d-navier-stokes', label: 'Lid-Driven Cavity', icon: 'spiral', group: '2D / NS' },
  // Algorithmen
  { mode: 'algo-iterative', label: 'Jacobi vs. Gauss-Seidel', icon: 'repeat', group: 'Algorithmen' },
  // Kompressibel
  { mode: 'comp-normal-shock', label: 'Normalschock-Relationen', icon: 'zap', group: 'Kompressibel' },
  { mode: 'comp-sod-tube', label: 'Sod Shock Tube', icon: 'explosion', group: 'Kompressibel' },
  // Turbulenz
  { mode: 'turb-energy-spectrum', label: 'Energiespektrum E(k)', icon: 'wind', group: 'Turbulenz' },
  { mode: 'turb-channel-loglaw', label: 'Wandgesetz u⁺(y⁺)', icon: 'thermometer', group: 'Turbulenz' },
  // Zweiphasen
  { mode: 'twophase-vof-1d', label: '1D VOF-Advektion', icon: 'droplet', group: 'Zweiphasen' },
];

interface Props {
  onBack: () => void;
}

export default function FullSimulation({ onBack }: Props) {
  const [activeMode, setActiveMode] = useState<SimMode | 'fvm-advanced'>('fvm-advanced');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const activeOption = SIM_OPTIONS.find(o => o.mode === activeMode) ?? SIM_OPTIONS[0];

  // Group options
  const groups = [...new Set(SIM_OPTIONS.map(o => o.group))];

  return (
    <div className="h-screen w-screen bg-gray-950 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="shrink-0 flex items-center h-10 px-3 border-b border-gray-800/60 bg-gray-950/80 backdrop-blur-sm z-20">
        <button onClick={onBack}
          className="p-1.5 -ml-1 rounded hover:bg-gray-800 text-gray-500 hover:text-gray-300 transition-colors"
          title="Zurück">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="block">
            <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <span className="ml-2 text-[11px] text-gray-400 font-medium">Simulations-Labor</span>

        {/* Active sim name */}
        <div className="ml-4 flex items-center gap-1.5">
          <Icon name={activeOption.icon} className="text-cyan-400" size={14} />
          <span className="text-[11px] text-cyan-400 font-medium">{activeOption.label}</span>
        </div>

        <div className="ml-auto flex items-center gap-2">
          {activeMode === 'fvm-advanced' && (
            <span className="text-[10px] text-gray-600">Space = Play/Pause</span>
          )}
          <button onClick={() => setSidebarOpen(p => !p)}
            className="p-1.5 rounded hover:bg-gray-800 text-gray-500 hover:text-gray-300 transition-colors"
            title={sidebarOpen ? 'Menü ausblenden' : 'Menü einblenden'}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </header>

      {/* Main area */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Left: Simulation picker sidebar */}
        {sidebarOpen && (
          <aside className="w-52 shrink-0 border-r border-gray-800/50 overflow-y-auto bg-gray-950">
            <div className="p-2 space-y-3">
              {groups.map(group => (
                <div key={group}>
                  <div className="text-[10px] text-gray-600 uppercase tracking-wider font-medium px-2 mb-1">{group}</div>
                  {SIM_OPTIONS.filter(o => o.group === group).map(opt => (
                    <button
                      key={opt.mode}
                      onClick={() => setActiveMode(opt.mode)}
                      className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-left text-[11px] transition-colors ${
                        activeMode === opt.mode
                          ? 'bg-cyan-950/60 text-cyan-400 border border-cyan-800/50'
                          : 'text-gray-400 hover:bg-gray-800/60 hover:text-gray-200 border border-transparent'
                      }`}
                    >
                      <Icon name={opt.icon} size={13} className={activeMode === opt.mode ? 'text-cyan-400' : 'text-gray-600'} />
                      <span className="truncate">{opt.label}</span>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </aside>
        )}

        {/* Content area */}
        {activeMode === 'fvm-advanced' ? (
          /* Classic 3-column FVM layout */
          <div className="flex flex-1 min-h-0 overflow-hidden">
            <aside className="w-60 shrink-0 border-r border-gray-800/50 overflow-y-auto">
              <ParameterPanel />
            </aside>
            <div className="flex-1 min-w-0 min-h-0 p-1">
              <PlotPanel />
            </div>
            <aside className="w-[340px] shrink-0 border-l border-gray-800/50 min-h-0">
              <TabPanel />
            </aside>
          </div>
        ) : (
          /* SimSandbox for all other modes */
          <div className="flex-1 min-w-0 min-h-0">
            <SimSandbox simMode={activeMode as SimMode} />
          </div>
        )}
      </div>
    </div>
  );
}

