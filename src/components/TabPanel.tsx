'use client';

import React from 'react';
import { useSimulation } from '@/context/SimulationContext';

// Tab panels
import FormulaPanel from '@/components/FormulaPanel';
import CodeEditorPanel from '@/components/CodeEditorPanel';
import StencilPanel from '@/components/StencilPanel';
import DiagnosticsPanel from '@/components/DiagnosticsPanel';

type TabId = 'formulas' | 'code' | 'stencil' | 'diagnostics';

const tabs: { id: TabId; label: string; icon: string }[] = [
  { id: 'formulas', label: 'Formeln', icon: '📐' },
  { id: 'code', label: 'Code', icon: '💻' },
  { id: 'stencil', label: 'Stencil', icon: '🔲' },
  { id: 'diagnostics', label: 'Diagnostik', icon: '📈' },
];

export default function TabPanel() {
  const { state, dispatch } = useSimulation();
  const activeTab = state.activeTab;

  return (
    <div className="flex flex-col h-full bg-gray-900 rounded-lg overflow-hidden">
      {/* Tab bar */}
      <div className="flex border-b border-gray-700 bg-gray-800/50">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => dispatch({ type: 'SET_TAB', tab: tab.id })}
            className={`flex-1 py-2 px-3 text-xs font-medium transition-colors ${
              activeTab === tab.id
                ? 'text-cyan-400 border-b-2 border-cyan-400 bg-gray-900'
                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Active panel */}
      <div className="flex-1 min-h-0">
        {activeTab === 'formulas' && <FormulaPanel />}
        {activeTab === 'code' && <CodeEditorPanel />}
        {activeTab === 'stencil' && <StencilPanel />}
        {activeTab === 'diagnostics' && <DiagnosticsPanel />}
      </div>
    </div>
  );
}
