'use client';

import React, { useState, useMemo } from 'react';
import { quizBank, QUIZ_TOPICS, QuizQuestion } from '@/curriculum/quizData';
import QuizPanel from '@/components/QuizPanel';
import Icon from '@/components/Icons';

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   QuizMode — Standalone quiz practice page.
   User picks a topic (or "All/Mix"), then runs through questions.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

interface Props {
  onBack: () => void;
}

export default function QuizMode({ onBack }: Props) {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [questionCount, setQuestionCount] = useState<number>(15);

  // Gather all questions from the bank
  const allBankQuestions = useMemo(() => {
    return Object.values(quizBank).flatMap(lq => lq.questions);
  }, []);

  // Resolve questions for the selected topic
  const topicQuestions = useMemo(() => {
    if (!selectedTopic) return [];
    const topic = QUIZ_TOPICS.find(t => t.id === selectedTopic);
    if (!topic) return [];

    let pool: QuizQuestion[] = [];

    if (topic.id === 'alle') {
      pool = [...allBankQuestions];
    } else if (topic.id === 'vorlesung') {
      pool = allBankQuestions.filter(q => q.tag === 'vorlesung');
    } else {
      for (const lid of topic.lessonIds) {
        if (quizBank[lid]) pool.push(...quizBank[lid].questions);
      }
    }

    // Shuffle
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, questionCount);
  }, [selectedTopic, questionCount, allBankQuestions]);

  // Count available questions per topic
  const topicCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const t of QUIZ_TOPICS) {
      if (t.id === 'alle') {
        counts[t.id] = allBankQuestions.length;
      } else if (t.id === 'vorlesung') {
        counts[t.id] = allBankQuestions.filter(q => q.tag === 'vorlesung').length;
      } else {
        let n = 0;
        for (const lid of t.lessonIds) {
          if (quizBank[lid]) n += quizBank[lid].questions.length;
        }
        counts[t.id] = n;
      }
    }
    return counts;
  }, [allBankQuestions]);

  // ── Active quiz ─────────────────────────────────────────────
  if (selectedTopic && topicQuestions.length > 0) {
    const topic = QUIZ_TOPICS.find(t => t.id === selectedTopic);
    return (
      <div className="h-screen w-screen bg-gray-950 flex flex-col overflow-hidden">
        <header className="shrink-0 flex items-center h-11 px-3 border-b border-gray-800/60 bg-gray-950/80 backdrop-blur-sm z-20">
          <button onClick={() => setSelectedTopic(null)}
            className="p-1.5 -ml-1 rounded hover:bg-gray-800 text-gray-500 hover:text-gray-300 transition-colors"
            title="Zurück zur Themenwahl">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <span className="ml-2 text-xs text-gray-400 font-medium">{topic?.title ?? 'Quiz'}</span>
          <span className="ml-2 text-[10px] text-gray-600">{topicQuestions.length} Fragen</span>
        </header>
        <div className="flex-1 min-h-0">
          <QuizPanel questions={topicQuestions} title={topic?.title} />
        </div>
      </div>
    );
  }

  // ── Topic picker ────────────────────────────────────────────
  return (
    <div className="h-screen w-screen bg-gray-950 flex flex-col overflow-hidden">
      <header className="shrink-0 flex items-center h-11 px-3 border-b border-gray-800/60 bg-gray-950/80 backdrop-blur-sm z-20">
        <button onClick={onBack}
          className="p-1.5 -ml-1 rounded hover:bg-gray-800 text-gray-500 hover:text-gray-300 transition-colors"
          title="Zurück zur Karte">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <span className="ml-2 text-xs font-bold text-gray-300 tracking-wide uppercase">Quiz-Trainer</span>
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-6 py-10">
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
          <div className="grid grid-cols-2 gap-3">
            {QUIZ_TOPICS.map(topic => {
              const count = topicCounts[topic.id] ?? 0;
              const disabled = count === 0;
              return (
                <button key={topic.id}
                  disabled={disabled}
                  onClick={() => { if (!disabled) setSelectedTopic(topic.id); }}
                  className={`text-left p-4 rounded-xl border transition-all duration-200 group ${
                    disabled
                      ? 'border-gray-800/40 opacity-40 cursor-not-allowed'
                      : 'border-gray-800 hover:border-cyan-600/40 hover:bg-gray-900/50'
                  } ${topic.id === 'alle' ? 'col-span-2 border-cyan-900/40 bg-cyan-950/20' : ''}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-gray-200 group-hover:text-cyan-300 transition-colors">
                        {topic.title}
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
