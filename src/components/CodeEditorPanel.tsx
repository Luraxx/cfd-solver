'use client';

import React, { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useSimulation, editableBlocks, compileUserCode } from '@/context/SimulationContext';

// Dynamic import for Monaco to avoid SSR issues
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

export default function CodeEditorPanel() {
  const { state, dispatch } = useSimulation();
  const activeBlock = editableBlocks.find((b) => b.id === state.activeCodeBlockId) ?? editableBlocks[0];

  const [code, setCode] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    editableBlocks.forEach((b) => { init[b.id] = b.defaultCode; });
    return init;
  });

  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const currentCode = code[activeBlock.id] ?? activeBlock.defaultCode;

  const handleApply = useCallback(() => {
    const { fn, error } = compileUserCode(currentCode, activeBlock.id);
    if (error) {
      setFeedback({ type: 'error', msg: error });
      dispatch({ type: 'SET_CODE_ERROR', id: activeBlock.id, error });
    } else {
      setFeedback({ type: 'success', msg: '✓ Code kompiliert und angewendet!' });
      dispatch({ type: 'SET_CODE_ERROR', id: activeBlock.id, error: null });
      dispatch({ type: 'SET_CUSTOM_FN', id: activeBlock.id, fn: fn ?? null });
      setTimeout(() => setFeedback(null), 3000);
    }
  }, [currentCode, activeBlock.id, dispatch]);

  const handleReset = useCallback(() => {
    setCode((prev) => ({ ...prev, [activeBlock.id]: activeBlock.defaultCode }));
    dispatch({ type: 'SET_CODE_ERROR', id: activeBlock.id, error: null });
    dispatch({ type: 'SET_CUSTOM_FN', id: activeBlock.id, fn: null });
    setFeedback({ type: 'success', msg: 'Auf Standard zurückgesetzt.' });
    setTimeout(() => setFeedback(null), 2000);
  }, [activeBlock, dispatch]);

  return (
    <div className="flex flex-col h-full bg-gray-900 rounded-lg overflow-hidden">
      {/* Header with block selector */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-700 bg-gray-800/50">
        <div className="flex items-center gap-2">
          <span className="text-cyan-400 text-sm font-bold">💻 Code</span>
          <select
            className="bg-gray-700 border border-gray-600 rounded text-xs p-1 text-gray-200"
            value={activeBlock.id}
            onChange={(e) => dispatch({ type: 'SET_CODE_BLOCK', id: e.target.value })}
          >
            {editableBlocks.map((b) => (
              <option key={b.id} value={b.id}>{b.title}</option>
            ))}
          </select>
        </div>
        <div className="flex gap-1">
          <button
            onClick={handleReset}
            className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded"
            title="Auf Standard zurücksetzen"
          >
            ↺ Reset
          </button>
          <button
            onClick={handleApply}
            className="px-3 py-1 text-xs bg-green-700 hover:bg-green-600 rounded font-bold"
          >
            ▶ Apply
          </button>
        </div>
      </div>

      {/* Description */}
      <div className="px-3 py-2 bg-gray-800/30 border-b border-gray-700">
        <p className="text-xs text-gray-400 whitespace-pre-line">{activeBlock.description}</p>
        <p className="text-xs text-gray-500 mt-1 font-mono">{activeBlock.signature}</p>
      </div>

      {/* Monaco Editor */}
      <div className="flex-1 min-h-0">
        <MonacoEditor
          height="100%"
          language="javascript"
          theme="vs-dark"
          value={currentCode}
          onChange={(value) => {
            setCode((prev) => ({ ...prev, [activeBlock.id]: value ?? '' }));
            setFeedback(null);
          }}
          options={{
            fontSize: 13,
            lineNumbers: 'on',
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            tabSize: 2,
            automaticLayout: true,
            padding: { top: 8 },
            renderLineHighlight: 'line',
            bracketPairColorization: { enabled: true },
            suggest: { showKeywords: true },
          }}
        />
      </div>

      {/* Feedback bar */}
      {feedback && (
        <div
          className={`px-3 py-2 text-xs font-medium border-t ${
            feedback.type === 'error'
              ? 'bg-red-900/50 border-red-700 text-red-300'
              : 'bg-green-900/50 border-green-700 text-green-300'
          }`}
        >
          {feedback.msg}
        </div>
      )}
    </div>
  );
}
