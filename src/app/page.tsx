'use client';

import { SimProvider } from '@/context/SimulationContext';
import ParameterPanel from '@/components/ParameterPanel';
import PlotPanel from '@/components/PlotPanel';
import TabPanel from '@/components/TabPanel';

export default function Home() {
  return (
    <SimProvider>
      <div className="flex flex-col h-screen overflow-hidden bg-gray-950">
        {/* Header */}
        <header className="flex items-center justify-between px-4 py-2 border-b border-gray-800 bg-gray-900/80 backdrop-blur shrink-0">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold text-cyan-400">
              🌊 CFD Lab
            </h1>
            <span className="text-xs text-gray-500 hidden sm:inline">
              Finite-Volumen-Methoden interaktiv lernen
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="px-2 py-0.5 rounded bg-cyan-900/30 text-cyan-400 font-mono">
              Milestone A
            </span>
            <span>1D Konvektion</span>
          </div>
        </header>

        {/* Main layout: 3-column */}
        <div className="flex flex-1 min-h-0 overflow-hidden">
          {/* Left: Parameters */}
          <aside className="w-72 shrink-0 border-r border-gray-800 overflow-y-auto">
            <ParameterPanel />
          </aside>

          {/* Center: Plot + Tab panel */}
          <main className="flex-1 flex flex-col min-w-0 min-h-0">
            {/* Plot area */}
            <div className="flex-1 min-h-0 p-2">
              <PlotPanel />
            </div>
          </main>

          {/* Right: Formulas / Code / Stencil / Diagnostics */}
          <aside className="w-[420px] shrink-0 border-l border-gray-800 min-h-0">
            <TabPanel />
          </aside>
        </div>
      </div>
    </SimProvider>
  );
}
