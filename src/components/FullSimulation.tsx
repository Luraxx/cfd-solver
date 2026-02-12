'use client';

import React from 'react';
import { useSimulation } from '@/context/SimulationContext';
import ParameterPanel from '@/components/ParameterPanel';
import PlotPanel from '@/components/PlotPanel';
import TabPanel from '@/components/TabPanel';

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   FullSimulation — The full FVM simulation sandbox with all panels.
   Accessible via the "Zur vollständigen Simulation" button.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

interface Props {
  onBack: () => void;
}

export default function FullSimulation({ onBack }: Props) {
  return (
    <div className="h-screen w-screen bg-gray-950 flex flex-col overflow-hidden">
      {/* Minimal header */}
      <header className="shrink-0 flex items-center h-10 px-3 border-b border-gray-800/60 bg-gray-950/80 backdrop-blur-sm z-20">
        <button onClick={onBack}
          className="p-1.5 -ml-1 rounded hover:bg-gray-800 text-gray-500 hover:text-gray-300 transition-colors"
          title="Zurück">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="block">
            <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <span className="ml-2 text-[11px] text-gray-400 font-medium">Vollständige Simulation</span>
        <span className="ml-auto text-[10px] text-gray-600">Space = Play/Pause</span>
      </header>

      {/* 3-column layout */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Left: Parameters */}
        <aside className="w-60 shrink-0 border-r border-gray-800/50 overflow-y-auto">
          <ParameterPanel />
        </aside>

        {/* Center: Plot */}
        <div className="flex-1 min-w-0 min-h-0 p-1">
          <PlotPanel />
        </div>

        {/* Right: Tabs (Formulas, Code, Stencil, Diagnostics) */}
        <aside className="w-[340px] shrink-0 border-l border-gray-800/50 min-h-0">
          <TabPanel />
        </aside>
      </div>
    </div>
  );
}
