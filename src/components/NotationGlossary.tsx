'use client';

import React, { useState, useRef, useEffect } from 'react';
import katex from 'katex';
import { GLOSSARY, LESSON_SYMBOLS } from '@/curriculum/glossaryData';

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   NotationGlossary — (?)-Button + dropdown that explains all
   formula symbols used on the current lesson page.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

interface Props {
  lessonId: string;
}

export default function NotationGlossary({ lessonId }: Props) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Resolve which symbols belong to this lesson
  const symbolKeys = LESSON_SYMBOLS[lessonId] ?? [];
  const entries = symbolKeys
    .map(k => ({ key: k, ...GLOSSARY[k] }))
    .filter(e => e.symbol); // guard against missing keys

  // Close on click-outside
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open]);

  if (entries.length === 0) return null;

  return (
    <div ref={panelRef} className="relative">
      {/* (?)-Trigger button */}
      <button
        onClick={() => setOpen(o => !o)}
        title="Notation & Symbole"
        className={`
          w-5 h-5 rounded-full text-[10px] font-bold leading-none
          flex items-center justify-center transition-all duration-200
          ${open
            ? 'bg-cyan-600 text-white ring-1 ring-cyan-400/50'
            : 'bg-gray-800 text-gray-500 hover:bg-gray-700 hover:text-gray-300'
          }
        `}
      >
        ?
      </button>

      {/* Dropdown panel */}
      {open && (
        <div
          className="
            absolute top-8 left-1/2 -translate-x-1/2 z-50
            w-[340px] max-h-[70vh] overflow-y-auto
            bg-gray-900 border border-gray-700/80 rounded-xl shadow-2xl
            backdrop-blur-md
          "
        >
          {/* Header */}
          <div className="sticky top-0 bg-gray-900/95 backdrop-blur-sm px-4 py-2.5 border-b border-gray-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-300 tracking-wide uppercase">
                Notation & Symbole
              </span>
              <span className="text-[10px] text-gray-600">
                {entries.length} Zeichen
              </span>
            </div>
          </div>

          {/* Symbol list */}
          <div className="p-2 space-y-0.5">
            {entries.map(entry => (
              <GlossaryRow
                key={entry.key}
                symbol={entry.symbol}
                name={entry.name}
                description={entry.description}
                unit={entry.unit}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Single glossary row ─────────────────────────────────────── */

function GlossaryRow({ symbol, name, description, unit }: {
  symbol: string; name: string; description: string; unit?: string;
}) {
  const symbolRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (symbolRef.current) {
      try {
        katex.render(symbol, symbolRef.current, {
          displayMode: false,
          throwOnError: false,
        });
      } catch { /* ignore */ }
    }
  }, [symbol]);

  return (
    <div className="flex items-start gap-3 px-3 py-2 rounded-lg hover:bg-gray-800/60 transition-colors group">
      {/* Symbol */}
      <span
        ref={symbolRef}
        className="shrink-0 w-12 text-center text-cyan-300 text-sm mt-0.5"
      />

      {/* Description */}
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-1.5">
          <span className="text-[12px] font-medium text-gray-200">{name}</span>
          {unit && (
            <span className="text-[10px] text-gray-600 font-mono">[{unit}]</span>
          )}
        </div>
        <p className="text-[11px] text-gray-500 leading-snug mt-0.5">{description}</p>
      </div>
    </div>
  );
}
