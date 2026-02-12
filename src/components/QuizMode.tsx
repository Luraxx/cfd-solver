'use client';

import React, { useState, useMemo } from 'react';
import { quizBank, QUIZ_TOPICS, VORLESUNG_UNITS, getVorlesungUnit, QuizQuestion } from '@/curriculum/quizData';
import QuizPanel from '@/components/QuizPanel';

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   QuizMode — Standalone quiz practice page.
   User picks a topic (or "All/Mix"), then runs through questions.
   "Vorlesung" expands into unit sub-selection.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

interface Props {
  onBack: () => void;
}

export default function QuizMode({ onBack }: Props) {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  /** Which vorlesung units are selected (null = show unit picker) */
  const [selectedUnits, setSelectedUnits] = useState<Set<string> | null>(null);
  const [questionCount, setQuestionCount] = useState<number>(15);

  // Gather all questions from the bank
  const allBankQuestions = useMemo(() => {
    return Object.values(quizBank).flatMap(lq => lq.questions);
  }, []);

  // All vorlesung questions
  const allVorlesungQuestions = useMemo(() => {
    return allBankQuestions.filter(q => q.tag === 'vorlesung');
  }, [allBankQuestions]);

  // Count per unit
  const unitCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const u of VORLESUNG_UNITS) counts[u.num] = 0;
    for (const q of allVorlesungQuestions) {
      const unum = getVorlesungUnit(q);
      if (unum && counts[unum] !== undefined) counts[unum]++;
    }
    return counts;
  }, [allVorlesungQuestions]);

  // Resolve questions for the selected topic
  const topicQuestions = useMemo(() => {
    if (!selectedTopic) return [];

    let pool: QuizQuestion[] = [];

    if (selectedTopic === 'vorlesung') {
      if (!selectedUnits) return []; // still picking units
      pool = allVorlesungQuestions.filter(q => {
        const unum = getVorlesungUnit(q);
        return unum ? selectedUnits.has(unum) : false;
      });
    } else {
      const topic = QUIZ_TOPICS.find(t => t.id === selectedTopic);
      if (!topic) return [];
      if (topic.id === 'alle') {
        pool = [...allBankQuestions];
      } else {
        for (const lid of topic.lessonIds) {
          if (quizBank[lid]) pool.push(...quizBank[lid].questions);
        }
      }
    }

    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, questionCount);
  }, [selectedTopic, selectedUnits, questionCount, allBankQuestions, allVorlesungQuestions]);

  // Count available questions per topic
  const topicCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const t of QUIZ_TOPICS) {
      if (t.id === 'alle') {
        counts[t.id] = allBankQuestions.length;
      } else if (t.id === 'vorlesung') {
        counts[t.id] = allVorlesungQuestions.length;
      } else {
        let n = 0;
        for (const lid of t.lessonIds) {
          if (quizBank[lid]) n += quizBank[lid].questions.length;
        }
        counts[t.id] = n;
      }
    }
    return counts;
  }, [allBankQuestions, allVorlesungQuestions]);

  // ── Back button helper ──────────────────────────────────────
  const BackBtn = ({ onClick, title }: { onClick: () => void; title: string }) => (
    <button onClick={onClick}
      className="p-1.5 -ml-1 rounded hover:bg-gray-800 text-gray-500 hover:text-gray-300 transition-colors"
      title={title}>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  );

  // ── Active quiz ─────────────────────────────────────────────
  if (selectedTopic && topicQuestions.length > 0) {
    const topic = QUIZ_TOPICS.find(t => t.id === selectedTopic);
    const subtitle = selectedTopic === 'vorlesung' && selectedUnits
      ? selectedUnits.size === VORLESUNG_UNITS.length
        ? 'Alle Units'
        : [...selectedUnits].sort().map(n => `Unit ${n}`).join(', ')
      : undefined;

    return (
      <div className="h-screen w-screen bg-gray-950 flex flex-col overflow-hidden">
        <header className="shrink-0 flex items-center h-11 px-3 border-b border-gray-800/60 bg-gray-950/80 backdrop-blur-sm z-20">
          <BackBtn onClick={() => { setSelectedTopic(null); setSelectedUnits(null); }} title="Zurück zur Themenwahl" />
          <span className="ml-2 text-xs text-gray-400 font-medium">{topic?.title ?? 'Quiz'}</span>
          {subtitle && <span className="ml-1.5 text-[10px] text-gray-600">— {subtitle}</span>}
          <span className="ml-2 text-[10px] text-gray-600">{topicQuestions.length} Fragen</span>
        </header>
        <div className="flex-1 min-h-0">
          <QuizPanel questions={topicQuestions} title={topic?.title} />
        </div>
      </div>
    );
  }

  // ── Vorlesung unit picker ───────────────────────────────────
  if (selectedTopic === 'vorlesung' && !selectedUnits) {
    // local toggle state for checkboxes
    return <VorlesungUnitPicker
      unitCounts={unitCounts}
      questionCount={questionCount}
      onStart={(units) => setSelectedUnits(units)}
      onBack={() => setSelectedTopic(null)}
    />;
  }

  // ── Topic picker ────────────────────────────────────────────
  return (
    <div className="h-screen w-screen bg-gray-950 flex flex-col overflow-hidden">
      <header className="shrink-0 flex items-center h-11 px-3 border-b border-gray-800/60 bg-gray-950/80 backdrop-blur-sm z-20">
        <BackBtn onClick={onBack} title="Zurück zur Karte" />
        <span className="ml-2 text-xs font-bold text-gray-300 tracking-wide uppercase">Quiz-Trainer</span>
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-6 py-10">
          <h1 className="text-xl font-bold text-white mb-1">Quiz-Trainer</h1>
          <p className="text-xs text-gray-500 mb-8">Wähle ein Thema und teste dein Wissen. Fragen werden zufällig gemischt.</p>

          {/* Question count selector */}
          <div className="flex items-center gap-3 mb-6">
            <span className="text-[11px] text-gray-500">Anzahl Fragen:</span>
            {[10, 15, 20, 30].map(n => (
              <button key={n} onClick={() => setQuestionCount(n)}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                  questionCount === n ? 'bg-cyan-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}>
                {n}
              </button>
            ))}
            <button onClick={() => setQuestionCount(Infinity)}
              className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                questionCount === Infinity ? 'bg-cyan-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}>
              Alle
            </button>
          </div>

          {/* Topic grid */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {QUIZ_TOPICS.map(topic => {
              const count = topicCounts[topic.id] ?? 0;
              const disabled = count === 0;
              return (
                <button key={topic.id}
                  disabled={disabled}
                  onClick={() => {
                    if (!disabled) {
                      setSelectedTopic(topic.id);
                      if (topic.id !== 'vorlesung') setSelectedUnits(null);
                    }
                  }}
                  className={`text-left p-4 rounded-xl border transition-all duration-200 group ${
                    disabled
                      ? 'border-gray-800/40 opacity-40 cursor-not-allowed'
                      : 'border-gray-800 hover:border-cyan-600/40 hover:bg-gray-900/50'
                  } ${topic.id === 'alle' ? 'col-span-2 lg:col-span-3 border-cyan-900/40 bg-cyan-950/20' : ''}
                    ${topic.id === 'vorlesung' ? 'col-span-2 lg:col-span-3 border-amber-900/40 bg-amber-950/10' : ''}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="min-w-0">
                      <h3 className={`text-sm font-semibold transition-colors ${
                        topic.id === 'vorlesung'
                          ? 'text-amber-200 group-hover:text-amber-100'
                          : 'text-gray-200 group-hover:text-cyan-300'
                      }`}>
                        {topic.title}
                        {topic.id === 'vorlesung' && (
                          <span className="ml-2 text-[10px] font-normal text-amber-400/60">14 Units wählbar</span>
                        )}
                      </h3>
                      <p className="text-[11px] text-gray-500 mt-0.5">{topic.description}</p>
                    </div>
                    <span className={`text-[10px] font-mono shrink-0 ml-2 mt-0.5 ${
                      count > 0 ? 'text-gray-500' : 'text-gray-700'
                    }`}>
                      {count} Fragen
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   VorlesungUnitPicker — Select which units to include
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function VorlesungUnitPicker({
  unitCounts,
  questionCount,
  onStart,
  onBack,
}: {
  unitCounts: Record<string, number>;
  questionCount: number;
  onStart: (units: Set<string>) => void;
  onBack: () => void;
}) {
  const [checked, setChecked] = useState<Set<string>>(
    new Set(VORLESUNG_UNITS.map(u => u.num))
  );

  const toggle = (num: string) => {
    setChecked(prev => {
      const next = new Set(prev);
      if (next.has(num)) next.delete(num);
      else next.add(num);
      return next;
    });
  };

  const selectAll = () => setChecked(new Set(VORLESUNG_UNITS.map(u => u.num)));
  const selectNone = () => setChecked(new Set());

  const totalSelected = VORLESUNG_UNITS.reduce(
    (sum, u) => sum + (checked.has(u.num) ? (unitCounts[u.num] ?? 0) : 0), 0
  );

  const effectiveCount = questionCount === Infinity ? totalSelected : Math.min(questionCount, totalSelected);

  return (
    <div className="h-screen w-screen bg-gray-950 flex flex-col overflow-hidden">
      <header className="shrink-0 flex items-center h-11 px-3 border-b border-gray-800/60 bg-gray-950/80 backdrop-blur-sm z-20">
        <button onClick={onBack}
          className="p-1.5 -ml-1 rounded hover:bg-gray-800 text-gray-500 hover:text-gray-300 transition-colors"
          title="Zurück zur Themenwahl">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <span className="ml-2 text-xs font-bold text-amber-300 tracking-wide uppercase">Vorlesungsfragen — Units wählen</span>
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-6 py-8">
          <p className="text-xs text-gray-500 mb-4">Wähle die Vorlesungs-Units aus, aus denen Fragen gezogen werden sollen.</p>

          {/* Select all / none */}
          <div className="flex items-center gap-3 mb-5">
            <button onClick={selectAll}
              className="px-2.5 py-1 rounded text-[11px] font-medium bg-gray-800 text-gray-400 hover:bg-gray-700 transition-colors">
              Alle auswählen
            </button>
            <button onClick={selectNone}
              className="px-2.5 py-1 rounded text-[11px] font-medium bg-gray-800 text-gray-400 hover:bg-gray-700 transition-colors">
              Keine
            </button>
            <span className="text-[11px] text-gray-600 ml-auto">
              {checked.size} / {VORLESUNG_UNITS.length} Units · {totalSelected} Fragen
            </span>
          </div>

          {/* Unit checkboxes */}
          <div className="space-y-1.5 mb-8">
            {VORLESUNG_UNITS.map(u => {
              const count = unitCounts[u.num] ?? 0;
              const isChecked = checked.has(u.num);
              return (
                <button
                  key={u.id}
                  onClick={() => toggle(u.num)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border text-left transition-all duration-150 ${
                    isChecked
                      ? 'border-amber-700/50 bg-amber-950/20'
                      : 'border-gray-800/60 bg-gray-900/30 opacity-60'
                  } hover:opacity-100`}
                >
                  {/* Checkbox */}
                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                    isChecked ? 'border-amber-500 bg-amber-600' : 'border-gray-600 bg-transparent'
                  }`}>
                    {isChecked && (
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M2 5L4.5 7.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>

                  {/* Unit label */}
                  <span className="text-[11px] font-mono text-gray-500 shrink-0 w-8">
                    {u.num}
                  </span>
                  <span className={`text-xs flex-1 min-w-0 truncate ${isChecked ? 'text-gray-200' : 'text-gray-500'}`}>
                    {u.title}
                  </span>
                  <span className="text-[10px] font-mono text-gray-600 shrink-0">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Start button */}
          <button
            disabled={checked.size === 0}
            onClick={() => onStart(checked)}
            className={`w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
              checked.size > 0
                ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-900/30'
                : 'bg-gray-800 text-gray-600 cursor-not-allowed'
            }`}
          >
            {checked.size > 0
              ? `Quiz starten · ${effectiveCount} Frage${effectiveCount !== 1 ? 'n' : ''}`
              : 'Mindestens 1 Unit auswählen'}
          </button>
        </div>
      </div>
    </div>
  );
}
