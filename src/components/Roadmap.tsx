'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { curriculum, LessonNode, getAllLessons } from '@/curriculum/curriculum';
import Icon from '@/components/Icons';
import FormulaJourney from '@/components/FormulaJourney';

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Roadmap — a vertical learning path, like a subway / skill-tree.

   Each category = a "station" on the main trunk line.
   Lessons branch off each station as clickable cards.

   No SVG. No pan/zoom. Just a smooth‑scrolling div.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

interface Props {
  onOpen: (lessonId: string) => void;
  completed: Set<string>;
  onOpenFullSim: () => void;
  onOpenQuiz: () => void;
}

// Accent colour palette per category index
const COLORS = [
  { bg: 'bg-cyan-500/10',   border: 'border-cyan-500/40',   text: 'text-cyan-400',   dot: 'bg-cyan-400',  glow: 'shadow-cyan-500/20' },
  { bg: 'bg-violet-500/10', border: 'border-violet-500/40', text: 'text-violet-400', dot: 'bg-violet-400', glow: 'shadow-violet-500/20' },
  { bg: 'bg-amber-500/10',  border: 'border-amber-500/40',  text: 'text-amber-400',  dot: 'bg-amber-400',  glow: 'shadow-amber-500/20' },
  { bg: 'bg-emerald-500/10', border: 'border-emerald-500/40', text: 'text-emerald-400', dot: 'bg-emerald-400', glow: 'shadow-emerald-500/20' },
  { bg: 'bg-rose-500/10',   border: 'border-rose-500/40',   text: 'text-rose-400',   dot: 'bg-rose-400',   glow: 'shadow-rose-500/20' },
  { bg: 'bg-sky-500/10',    border: 'border-sky-500/40',    text: 'text-sky-400',    dot: 'bg-sky-400',    glow: 'shadow-sky-500/20' },
  { bg: 'bg-orange-500/10', border: 'border-orange-500/40', text: 'text-orange-400', dot: 'bg-orange-400', glow: 'shadow-orange-500/20' },
  { bg: 'bg-pink-500/10',   border: 'border-pink-500/40',   text: 'text-pink-400',   dot: 'bg-pink-400',   glow: 'shadow-pink-500/20' },
];

export default function Roadmap({ onOpen, completed, onOpenFullSim, onOpenQuiz }: Props) {
  const categories = curriculum.children ?? [];
  const allLessons = getAllLessons();
  const total = allLessons.filter(l => l.available).length;
  const done = completed.size;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  // ── Scroll progress for FormulaJourney ────────────────────
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const maxScroll = el.scrollHeight - el.clientHeight;
    if (maxScroll <= 0) { setScrollProgress(0); return; }
    setScrollProgress(Math.min(1, el.scrollTop / maxScroll));
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <div ref={scrollRef} className="h-dvh w-screen overflow-y-auto overflow-x-hidden bg-gray-950 roadmap-scroll">
      {/* ── subtle background dots ─────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

      {/* ── Floating formula journey (desktop, sticky) ─────── */}
      <div className="hidden lg:block fixed right-[6vw] top-0 bottom-0 w-[28vw] z-20 pointer-events-none">
        <div className="absolute top-1/2 -translate-y-1/2 w-full px-1">
          <FormulaJourney scrollProgress={scrollProgress} />
        </div>
      </div>

      {/* ── Fixed header bar (stationary) ─────────────────── */}
      <div className="fixed top-0 left-0 right-0 z-30 bg-gray-950/80 backdrop-blur-md border-b border-gray-800/50">
        <div className="flex items-center py-2.5 px-4 sm:px-6">
          {/* center: title + start + progress (absolute center) */}
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-3">
            <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-white">
              CFD Lab
            </h1>
            <button
              onClick={() => { const first = allLessons.find(l => l.available && !completed.has(l.id)); if (first) onOpen(first.id); }}
              className="px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 text-[11px] font-medium hover:bg-cyan-500/30 transition-colors"
            >
              Starten &rarr;
            </button>
            <div className="hidden sm:flex items-center gap-2 w-28">
              <div className="flex-1 h-1 rounded-full bg-gray-800 overflow-hidden">
                <div className="h-full bg-cyan-500 rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${pct}%` }} />
              </div>
              <span className="text-[10px] text-gray-600 tabular-nums">{done}/{total}</span>
            </div>
          </div>

          {/* right: toggle group — same style as lesson view toggles */}
          <div className="ml-auto flex items-center gap-0.5 bg-gray-900/80 rounded-lg p-0.5">
            <button
              onClick={onOpenFullSim}
              title="Simulations-Labor"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-gray-500 hover:text-gray-300 hover:bg-gray-800/60 transition-colors text-[11px] font-medium"
            >
              <Icon name="chart-line" className="text-cyan-400" size={13} />
              <span className="hidden sm:inline">Sim-Lab</span>
            </button>
            <button
              onClick={onOpenQuiz}
              title="Quiz-Trainer"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-gray-500 hover:text-gray-300 hover:bg-gray-800/60 transition-colors text-[11px] font-medium"
            >
              <Icon name="help-circle" className="text-amber-400" size={13} />
              <span className="hidden sm:inline">Quiz</span>
            </button>
          </div>
        </div>
      </div>

      {/* spacer for fixed header */}
      <div className="h-14" />

      {/* ── vertical path ──────────────────────────────────── */}
      <div className="relative z-10 lg:w-[64vw] max-w-3xl mx-auto lg:mx-0 lg:ml-[8vw] pb-32">
        {/* trunk line */}
        <div className="absolute left-[15px] sm:left-[23px] top-0 bottom-0 w-px bg-gradient-to-b from-gray-800 via-gray-800 to-transparent ml-6" />

        {categories.map((cat, ci) => (
          <StationBlock
            key={cat.id}
            cat={cat}
            color={COLORS[ci % COLORS.length]}
            onOpen={onOpen}
            completed={completed}
            index={ci}
          />
        ))}

      </div>


    </div>
  );
}

/* ── Station (one category) ──────────────────────────────────── */

interface StationProps {
  cat: LessonNode;
  color: typeof COLORS[number];
  onOpen: (id: string) => void;
  completed: Set<string>;
  index: number;
}

function StationBlock({ cat, color, onOpen, completed, index }: StationProps) {
  const lessons = cat.children?.filter(c => c.type === 'lesson') ?? [];
  const doneCount = lessons.filter(l => completed.has(l.id)).length;
  const isLocked = !cat.available;

  return (
    <div className={`relative pl-10 sm:pl-16 pr-4 sm:pr-6 py-6 ${isLocked ? 'opacity-40' : ''}`}>
      {/* station dot on the trunk */}
      <div className={`absolute left-[15px] sm:left-[23px] ml-6 top-8 w-3 h-3 rounded-full ring-2 ring-gray-950 ${
        isLocked ? 'bg-gray-700' : doneCount === lessons.length && lessons.length > 0 ? 'bg-emerald-400' : color.dot
      }`} />

      {/* category label */}
      <div className="flex items-center gap-2 mb-3">
        <Icon name={cat.icon} className={isLocked ? 'text-gray-600' : color.text} size={18} />
        <h2 className={`text-sm font-semibold ${isLocked ? 'text-gray-600' : 'text-gray-200'}`}>
          {cat.title}
        </h2>
        {lessons.length > 0 && (
          <span className="text-[10px] text-gray-600 ml-auto tabular-nums">
            {doneCount}/{lessons.length}
          </span>
        )}
        {isLocked && <span className="text-[10px] text-gray-700 ml-auto">bald verfügbar</span>}
      </div>

      {/* lesson cards — horizontal row that wraps */}
      <div className="flex flex-wrap gap-2">
        {lessons.map(lesson => (
          <LessonCard
            key={lesson.id}
            lesson={lesson}
            color={color}
            isDone={completed.has(lesson.id)}
            onOpen={onOpen}
          />
        ))}
      </div>
    </div>
  );
}

/* ── Lesson card ─────────────────────────────────────────────── */

interface CardProps {
  lesson: LessonNode;
  color: typeof COLORS[number];
  isDone: boolean;
  onOpen: (id: string) => void;
}

function LessonCard({ lesson, color, isDone, onOpen }: CardProps) {
  const available = lesson.available;
  const hasInteractive = lesson.simMode && lesson.simMode !== 'none';

  return (
    <button
      disabled={!available}
      onClick={() => available && onOpen(lesson.id)}
      className={`
        group relative text-left rounded-lg border px-3 py-3 w-full sm:w-[calc(50%-4px)]
        transition-all duration-200 outline-none
        ${available
          ? `${color.bg} ${color.border} hover:shadow-lg hover:${color.glow} hover:scale-[1.02] active:scale-[0.98] cursor-pointer`
          : 'bg-gray-900/40 border-gray-800/60 cursor-not-allowed'
        }
        ${isDone ? 'ring-1 ring-emerald-500/30' : ''}
      `}
    >
      <div className="flex items-start gap-2">
        <Icon name={lesson.icon} className={`mt-0.5 ${available ? color.text : 'text-gray-600'}`} size={15} />
        <div className="min-w-0 flex-1">
          <div className={`text-xs font-medium leading-snug ${available ? color.text : 'text-gray-600'}`}>
            {lesson.shortTitle}
          </div>
          <div className="text-[10px] text-gray-500 mt-0.5 line-clamp-2 leading-relaxed">
            {lesson.description}
          </div>
        </div>
        {/* badges */}
        <div className="flex flex-col items-end gap-1 shrink-0 ml-1">
          {isDone && (
            <Icon name="check" className="text-emerald-400" size={12} />
          )}
          {hasInteractive && available && (
            <Icon name="play" className={`${color.text} opacity-60`} size={10} />
          )}
          {!available && (
            <Icon name="lock" className="text-gray-700" size={11} />
          )}
        </div>
      </div>
    </button>
  );
}
