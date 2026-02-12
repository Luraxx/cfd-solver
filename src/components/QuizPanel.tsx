'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import katex from 'katex';
import { quizBank, QuizQuestion } from '@/curriculum/quizData';
import Icon from '@/components/Icons';

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   QuizPanel — Multiple-choice / formula-select / definition quiz
   for each lesson. Shows one question at a time, scores at end.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

interface Props {
  lessonId: string;
}

export default function QuizPanel({ lessonId }: Props) {
  const quiz = quizBank[lessonId];
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  // Reset when lesson changes
  useEffect(() => {
    setCurrentIdx(0);
    setSelected(null);
    setConfirmed(false);
    setScore(0);
    setFinished(false);
  }, [lessonId]);

  if (!quiz || quiz.questions.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Icon name="help-circle" className="text-gray-700 mx-auto mb-2" size={28} />
          <p className="text-xs text-gray-600">Noch keine Fragen für diese Lektion.</p>
        </div>
      </div>
    );
  }

  const q = quiz.questions[currentIdx];
  const total = quiz.questions.length;

  const handleConfirm = () => {
    if (selected === null) return;
    setConfirmed(true);
    if (selected === q.correctIndex) setScore(s => s + 1);
  };

  const handleNext = () => {
    if (currentIdx < total - 1) {
      setCurrentIdx(i => i + 1);
      setSelected(null);
      setConfirmed(false);
    } else {
      setFinished(true);
    }
  };

  const restart = () => {
    setCurrentIdx(0);
    setSelected(null);
    setConfirmed(false);
    setScore(0);
    setFinished(false);
  };

  if (finished) {
    const pct = Math.round((score / total) * 100);
    const great = pct >= 80;
    return (
      <div className="flex items-center justify-center h-full px-6">
        <div className="max-w-sm w-full text-center">
          <div className={`text-5xl font-bold mb-2 ${great ? 'text-emerald-400' : 'text-amber-400'}`}>{pct}%</div>
          <p className="text-sm text-gray-400 mb-1">{score} von {total} richtig</p>
          <p className="text-xs text-gray-600 mb-6">
            {great ? 'Sehr gut! Du hast das Thema verstanden.' : 'Lies die Theorie nochmal und versuche es erneut.'}
          </p>
          <button onClick={restart}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium rounded-lg transition-colors">
            Nochmal versuchen
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start justify-center h-full px-6 py-10">
      <div className="max-w-lg w-full">
        {/* Progress */}
        <div className="flex items-center gap-2 mb-6">
          <span className="text-[10px] text-gray-600 font-mono">{currentIdx + 1}/{total}</span>
          <div className="flex-1 h-1 bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-cyan-500 transition-all duration-300 rounded-full" style={{ width: `${((currentIdx + 1) / total) * 100}%` }} />
          </div>
        </div>

        {/* Question type badge */}
        <div className="mb-3">
          <span className={`text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${
            q.type === 'multiple-choice' ? 'bg-cyan-900/40 text-cyan-400' :
            q.type === 'formula-select' ? 'bg-violet-900/40 text-violet-400' :
            'bg-amber-900/40 text-amber-400'
          }`}>
            {q.type === 'multiple-choice' ? 'Multiple Choice' : q.type === 'formula-select' ? 'Formel wählen' : 'Definition'}
          </span>
        </div>

        {/* Question text */}
        <h3 className="text-sm font-semibold text-gray-200 mb-2 leading-relaxed">{q.question}</h3>

        {/* Optional formula in question */}
        {q.formula && <KatexBlock formula={q.formula} />}

        {/* Options */}
        <div className="space-y-2 mt-4">
          {q.options.map((opt, i) => {
            const isCorrect = i === q.correctIndex;
            const isSelected = i === selected;
            let style = 'border-gray-800 hover:border-gray-700 text-gray-400';
            if (confirmed) {
              if (isCorrect) style = 'border-emerald-500/60 bg-emerald-900/20 text-emerald-300';
              else if (isSelected && !isCorrect) style = 'border-red-500/60 bg-red-900/20 text-red-300';
              else style = 'border-gray-800/50 text-gray-600';
            } else if (isSelected) {
              style = 'border-cyan-500/60 bg-cyan-900/15 text-cyan-300';
            }

            return (
              <button key={i}
                disabled={confirmed}
                onClick={() => setSelected(i)}
                className={`w-full text-left px-3 py-2.5 rounded-lg border text-[12px] transition-colors ${style}`}
              >
                <span className="text-gray-600 font-mono mr-2">{String.fromCharCode(65 + i)}.</span>
                <QuizOptionText text={opt} />
              </button>
            );
          })}
        </div>

        {/* Explanation after confirm */}
        {confirmed && q.explanation && (
          <div className="mt-4 border-l-2 border-l-cyan-500 bg-cyan-500/5 pl-3 py-2 text-[11px] text-cyan-300/80 leading-relaxed rounded-r">
            <QuizOptionText text={q.explanation} />
          </div>
        )}

        {/* Action button */}
        <div className="mt-5 flex justify-end">
          {!confirmed ? (
            <button onClick={handleConfirm} disabled={selected === null}
              className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-800 disabled:text-gray-600 text-white text-xs font-medium rounded-lg transition-colors">
              Überprüfen
            </button>
          ) : (
            <button onClick={handleNext}
              className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium rounded-lg transition-colors">
              {currentIdx < total - 1 ? 'Nächste Frage' : 'Ergebnis anzeigen'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Helpers ──────────────────────────────────────────────────── */

function KatexBlock({ formula }: { formula: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) {
      try { katex.render(formula, ref.current, { displayMode: true, throwOnError: false }); } catch { /* */ }
    }
  }, [formula]);
  return <div ref={ref} className="my-2 px-3 py-2 bg-gray-900/50 rounded-lg overflow-x-auto text-sm" />;
}

function QuizOptionText({ text }: { text: string }) {
  // Support inline KaTeX with $...$
  const parts = text.split(/(\$[^$]+\$)/g);
  return (
    <>
      {parts.map((p, i) => {
        if (p.startsWith('$') && p.endsWith('$')) {
          return <InlineKatex key={i} tex={p.slice(1, -1)} />;
        }
        if (p.startsWith('**') && p.endsWith('**')) {
          return <strong key={i} className="font-semibold">{p.slice(2, -2)}</strong>;
        }
        return <React.Fragment key={i}>{p}</React.Fragment>;
      })}
    </>
  );
}

function InlineKatex({ tex }: { tex: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (ref.current) {
      try { katex.render(tex, ref.current, { displayMode: false, throwOnError: false }); } catch { /* */ }
    }
  }, [tex]);
  return <span ref={ref} className="mx-0.5" />;
}
