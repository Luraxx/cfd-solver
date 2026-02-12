'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import katex from 'katex';
import { quizBank, QuizQuestion, SingleChoiceQ, MultiSelectQ, TrueFalseQ, TextInputQ, FormulaSelectQ } from '@/curriculum/quizData';
import Icon from '@/components/Icons';

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   QuizPanel — Supports 5 question types:
     single-choice, multi-select, true-false, text-input, formula-select
   Can receive questions directly (standalone mode) or via lessonId.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

interface Props {
  lessonId?: string;
  /** Direct questions for standalone quiz mode */
  questions?: QuizQuestion[];
  /** Title shown in standalone mode */
  title?: string;
}

export default function QuizPanel({ lessonId, questions: directQuestions, title }: Props) {
  const allQuestions = useMemo(() => {
    if (directQuestions && directQuestions.length > 0) return directQuestions;
    if (lessonId && quizBank[lessonId]) return quizBank[lessonId].questions;
    return [];
  }, [lessonId, directQuestions]);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, unknown>>({});
  const [confirmed, setConfirmed] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    setCurrentIdx(0);
    setAnswers({});
    setConfirmed(false);
    setScore(0);
    setFinished(false);
  }, [lessonId, directQuestions]);

  if (allQuestions.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Icon name="help-circle" className="text-gray-700 mx-auto mb-2" size={28} />
          <p className="text-xs text-gray-600">Noch keine Fragen verfügbar.</p>
        </div>
      </div>
    );
  }

  const q = allQuestions[currentIdx];
  const total = allQuestions.length;
  const currentAnswer = answers[currentIdx];

  const answerIsCorrect = (): boolean => confirmed && checkAnswer(q, currentAnswer);

  const canConfirm = (): boolean => {
    if (currentAnswer === undefined || currentAnswer === null) return false;
    if (q.type === 'multi-select' && Array.isArray(currentAnswer) && currentAnswer.length === 0) return false;
    if (q.type === 'text-input' && typeof currentAnswer === 'string' && currentAnswer.trim() === '') return false;
    return true;
  };

  const handleConfirm = () => {
    if (!canConfirm()) return;
    setConfirmed(true);
    if (checkAnswer(q, currentAnswer)) setScore(s => s + 1);
  };

  const handleNext = () => {
    if (currentIdx < total - 1) {
      setCurrentIdx(i => i + 1);
      setConfirmed(false);
    } else {
      setFinished(true);
    }
  };

  const restart = () => {
    setCurrentIdx(0);
    setAnswers({});
    setConfirmed(false);
    setScore(0);
    setFinished(false);
  };

  const setAnswer = (val: unknown) => setAnswers(prev => ({ ...prev, [currentIdx]: val }));

  /* ── Finished screen ───────────────────────────────────────── */
  if (finished) {
    const pct = Math.round((score / total) * 100);
    const great = pct >= 80;
    return (
      <div className="flex items-center justify-center h-full px-6">
          <div className="max-w-md w-full text-center">
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
    <div className="flex items-start justify-center h-full px-6 py-10 overflow-y-auto">
      <div className="max-w-2xl w-full">
        {title && <h2 className="text-sm font-bold text-gray-300 mb-4">{title}</h2>}

        {/* Progress */}
        <div className="flex items-center gap-2 mb-6">
          <span className="text-[10px] text-gray-600 font-mono">{currentIdx + 1}/{total}</span>
          <div className="flex-1 h-1 bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-cyan-500 transition-all duration-300 rounded-full" style={{ width: `${((currentIdx + 1) / total) * 100}%` }} />
          </div>
          <span className="text-[10px] text-gray-600 font-mono">{score} richtig</span>
        </div>

        {/* Type badge */}
        <div className="mb-3"><TypeBadge type={q.type} /></div>

        {/* Question text */}
        <h3 className="text-sm font-semibold text-gray-200 mb-2 leading-relaxed">
          <QuizOptionText text={q.question} />
        </h3>

        {q.formula && <KatexBlock formula={q.formula} />}

        {/* ── Answer area ──────────────────────────────────────── */}
        <div className="mt-4">
          {(q.type === 'single-choice' || q.type === 'formula-select') && (
            <SingleChoiceAnswers q={q as SingleChoiceQ | FormulaSelectQ} selected={currentAnswer as number | undefined} confirmed={confirmed} onSelect={setAnswer} />
          )}
          {q.type === 'multi-select' && (
            <MultiSelectAnswers q={q as MultiSelectQ} selected={(currentAnswer as number[] | undefined) ?? []} confirmed={confirmed}
              onToggle={(idx) => {
                const prev = (currentAnswer as number[] | undefined) ?? [];
                setAnswer(prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]);
              }} />
          )}
          {q.type === 'true-false' && (
            <TrueFalseAnswers q={q as TrueFalseQ} selected={currentAnswer as boolean | undefined} confirmed={confirmed} onSelect={setAnswer} />
          )}
          {q.type === 'text-input' && (
            <TextInputAnswer q={q as TextInputQ} value={(currentAnswer as string | undefined) ?? ''} confirmed={confirmed} onChange={setAnswer} onSubmit={handleConfirm} />
          )}
        </div>

        {/* Explanation */}
        {confirmed && q.explanation && (
          <div className={`mt-4 border-l-2 pl-3 py-2 text-[11px] leading-relaxed rounded-r ${
            answerIsCorrect() ? 'border-l-emerald-500 bg-emerald-500/5 text-emerald-300/80' : 'border-l-red-500 bg-red-500/5 text-red-300/80'
          }`}>
            <span className="font-semibold">{answerIsCorrect() ? 'Richtig!' : 'Falsch.'}</span>{' '}
            <QuizOptionText text={q.explanation} />
          </div>
        )}

        {/* Action button */}
        <div className="mt-5 flex justify-end">
          {!confirmed ? (
            <button onClick={handleConfirm} disabled={!canConfirm()}
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

/* ════════════════════════════════════════════════════════════════
   ANSWER COMPONENTS
   ════════════════════════════════════════════════════════════════ */

function SingleChoiceAnswers({ q, selected, confirmed, onSelect }: {
  q: SingleChoiceQ | FormulaSelectQ; selected?: number; confirmed: boolean; onSelect: (i: number) => void;
}) {
  return (
    <div className="space-y-2">
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
          <button key={i} disabled={confirmed} onClick={() => onSelect(i)}
            className={`w-full text-left px-3 py-2.5 rounded-lg border text-[12px] transition-colors flex items-start gap-2 ${style}`}>
            <span className="text-gray-600 font-mono shrink-0 mt-px">{String.fromCharCode(65 + i)}.</span>
            <span className="flex-1"><QuizOptionText text={opt} /></span>
            {confirmed && isCorrect && <Icon name="check" size={14} className="text-emerald-400 shrink-0 mt-0.5" />}
            {confirmed && isSelected && !isCorrect && <Icon name="x" size={14} className="text-red-400 shrink-0 mt-0.5" />}
          </button>
        );
      })}
    </div>
  );
}

function MultiSelectAnswers({ q, selected, confirmed, onToggle }: {
  q: MultiSelectQ; selected: number[]; confirmed: boolean; onToggle: (i: number) => void;
}) {
  return (
    <div className="space-y-2">
      <p className="text-[10px] text-gray-600 mb-1">Mehrere Antworten möglich</p>
      {q.options.map((opt, i) => {
        const isCorrect = q.correctIndices.includes(i);
        const isSelected = selected.includes(i);
        let style = 'border-gray-800 hover:border-gray-700 text-gray-400';
        if (confirmed) {
          if (isCorrect && isSelected) style = 'border-emerald-500/60 bg-emerald-900/20 text-emerald-300';
          else if (isCorrect && !isSelected) style = 'border-amber-500/60 bg-amber-900/10 text-amber-300';
          else if (!isCorrect && isSelected) style = 'border-red-500/60 bg-red-900/20 text-red-300';
          else style = 'border-gray-800/50 text-gray-600';
        } else if (isSelected) {
          style = 'border-cyan-500/60 bg-cyan-900/15 text-cyan-300';
        }
        return (
          <button key={i} disabled={confirmed} onClick={() => onToggle(i)}
            className={`w-full text-left px-3 py-2.5 rounded-lg border text-[12px] transition-colors flex items-start gap-2 ${style}`}>
            <span className={`w-4 h-4 mt-0.5 shrink-0 rounded border flex items-center justify-center text-[10px] ${
              isSelected ? 'border-cyan-500 bg-cyan-900/40 text-cyan-300' : 'border-gray-700'
            }`}>{isSelected && '✓'}</span>
            <span className="flex-1"><QuizOptionText text={opt} /></span>
            {confirmed && isCorrect && !isSelected && <span className="text-[9px] text-amber-400 shrink-0">fehlend</span>}
          </button>
        );
      })}
    </div>
  );
}

function TrueFalseAnswers({ q, selected, confirmed, onSelect }: {
  q: TrueFalseQ; selected?: boolean; confirmed: boolean; onSelect: (v: boolean) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="bg-gray-900/60 border border-gray-800 rounded-lg px-4 py-3 text-[12px] text-gray-300 leading-relaxed italic">
        &quot;<QuizOptionText text={q.statement} />&quot;
      </div>
      <div className="flex gap-3">
        {[true, false].map(val => {
          const isThis = selected === val;
          const isCorrectAnswer = q.correct === val;
          let style = 'border-gray-800 hover:border-gray-700 text-gray-400';
          if (confirmed) {
            if (isCorrectAnswer) style = 'border-emerald-500/60 bg-emerald-900/20 text-emerald-300';
            else if (isThis && !isCorrectAnswer) style = 'border-red-500/60 bg-red-900/20 text-red-300';
            else style = 'border-gray-800/50 text-gray-600';
          } else if (isThis) {
            style = 'border-cyan-500/60 bg-cyan-900/15 text-cyan-300';
          }
          return (
            <button key={String(val)} disabled={confirmed} onClick={() => onSelect(val)}
              className={`flex-1 px-4 py-3 rounded-lg border text-sm font-medium transition-colors ${style}`}>
              {val ? 'Wahr' : 'Falsch'}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function TextInputAnswer({ q, value, confirmed, onChange, onSubmit }: {
  q: TextInputQ; value: string; confirmed: boolean; onChange: (v: string) => void; onSubmit: () => void;
}) {
  const correct = confirmed && checkTextInput(q, value);
  return (
    <div className="space-y-2">
      {q.hint && <p className="text-[10px] text-gray-600">{q.hint}</p>}
      <div className="relative">
        <input type="text" value={value} disabled={confirmed}
          onChange={e => onChange(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') onSubmit(); }}
          placeholder="Antwort eingeben…"
          className={`w-full px-3 py-2.5 rounded-lg border text-[12px] bg-gray-900/60 outline-none transition-colors ${
            confirmed ? correct ? 'border-emerald-500/60 text-emerald-300' : 'border-red-500/60 text-red-300'
              : 'border-gray-700 text-gray-300 focus:border-cyan-500/60'
          }`} />
        {confirmed && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2">
            {correct ? <Icon name="check" size={14} className="text-emerald-400" /> : <Icon name="x" size={14} className="text-red-400" />}
          </span>
        )}
      </div>
      {confirmed && !correct && (
        <p className="text-[10px] text-gray-500">Akzeptierte Antworten: {q.acceptedAnswers.join(', ')}</p>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════ */

function checkAnswer(q: QuizQuestion, answer: unknown): boolean {
  switch (q.type) {
    case 'single-choice':
    case 'formula-select':
      return answer === q.correctIndex;
    case 'multi-select': {
      const sel = (answer as number[] | undefined) ?? [];
      return q.correctIndices.length === sel.length && q.correctIndices.every(i => sel.includes(i));
    }
    case 'true-false':
      return answer === q.correct;
    case 'text-input':
      return checkTextInput(q, answer as string);
  }
}

function checkTextInput(q: TextInputQ, answer: string): boolean {
  const norm = (answer ?? '').trim().toLowerCase();
  return q.acceptedAnswers.some(a => norm === a.toLowerCase().trim());
}

function TypeBadge({ type }: { type: QuizQuestion['type'] }) {
  const c: Record<string, { l: string; s: string }> = {
    'single-choice': { l: 'Single Choice', s: 'bg-cyan-900/40 text-cyan-400' },
    'formula-select': { l: 'Formel wählen', s: 'bg-violet-900/40 text-violet-400' },
    'multi-select': { l: 'Mehrfachauswahl', s: 'bg-indigo-900/40 text-indigo-400' },
    'true-false': { l: 'Wahr oder Falsch', s: 'bg-amber-900/40 text-amber-400' },
    'text-input': { l: 'Texteingabe', s: 'bg-emerald-900/40 text-emerald-400' },
  };
  const d = c[type] ?? { l: type, s: 'bg-gray-800 text-gray-400' };
  return <span className={`text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${d.s}`}>{d.l}</span>;
}

function KatexBlock({ formula }: { formula: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { if (ref.current) { try { katex.render(formula, ref.current, { displayMode: true, throwOnError: false }); } catch { /* */ } } }, [formula]);
  return <div ref={ref} className="my-2 px-3 py-2 bg-gray-900/50 rounded-lg overflow-x-auto text-sm" />;
}

function QuizOptionText({ text }: { text: string }) {
  const parts = text.split(/(\$[^$]+\$|\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((p, i) => {
        if (p.startsWith('$') && p.endsWith('$')) return <InlineKatex key={i} tex={p.slice(1, -1)} />;
        if (p.startsWith('**') && p.endsWith('**')) return <strong key={i} className="font-semibold">{p.slice(2, -2)}</strong>;
        return <React.Fragment key={i}>{p}</React.Fragment>;
      })}
    </>
  );
}

function InlineKatex({ tex }: { tex: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => { if (ref.current) { try { katex.render(tex, ref.current, { displayMode: false, throwOnError: false }); } catch { /* */ } } }, [tex]);
  return <span ref={ref} className="mx-0.5" />;
}
