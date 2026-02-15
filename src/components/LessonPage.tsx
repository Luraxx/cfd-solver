'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import katex from 'katex';
import { findNode, getNextLesson, getPrevLesson, getBreadcrumb } from '@/curriculum/curriculum';
import { lessonContents, LearningStep } from '@/curriculum/lessonContent';
import { quizBank } from '@/curriculum/quizData';
import type { SimMode } from '@/curriculum/curriculum';
import SimSandbox from '@/components/SimSandbox';
import QuizPanel from '@/components/QuizPanel';
import Icon, { HighlightIcon } from '@/components/Icons';
import NotationGlossary from '@/components/NotationGlossary';
import dynamic from 'next/dynamic';

const FaceInterpolationGraphic = dynamic(() => import('@/components/FaceInterpolationGraphic'), { ssr: false });
const MeshTypesViz = dynamic(() => import('@/components/MeshTypesViz'), { ssr: false });

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   LessonPage — Full-screen lesson experience.

   Flow for interactive lessons:
     1. Theory full-width (read the text)
     2. Click "Simulation starten" → split view (text left, sim right)
     3. Click "Weiter" → next lesson
   
   User can toggle between full-text / split / full-sim at any time.
   Spacebar: advances to sim → next lesson (or next lesson directly for theory-only).
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

type ViewMode = 'theory' | 'split' | 'sim' | 'quiz';

interface Props {
  lessonId: string;
  onBack: () => void;
  onNavigate: (lessonId: string) => void;
  onComplete: (lessonId: string) => void;
}

export default function LessonPage({ lessonId, onBack, onNavigate, onComplete }: Props) {
  const node = findNode(lessonId);
  const content = lessonContents[lessonId];
  const crumbs = getBreadcrumb(lessonId) ?? [];
  const prev = getPrevLesson(lessonId);
  const next = getNextLesson(lessonId);
  const simMode: SimMode = node?.simMode ?? 'none';
  const hasInteractive = simMode !== 'none';

  // View mode: theory-only → split → (next lesson)
  const [viewMode, setViewMode] = useState<ViewMode>('theory');

  // Detect mobile (< md breakpoint) — split view makes no sense on small screens
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia('(max-width: 767px)');
    setIsMobile(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  // On mobile, redirect split → sim (split is desktop-only)
  useEffect(() => {
    if (isMobile && viewMode === 'split') setViewMode('sim');
  }, [isMobile, viewMode]);

  // Reset view mode when lesson changes
  useEffect(() => { setViewMode('theory'); }, [lessonId]);

  // Track which step the user has scrolled to
  const [activeStep, setActiveStep] = useState(0);
  const totalSteps = content?.steps.length ?? 0;
  const theoryRef = useRef<HTMLDivElement>(null);

  // Mark complete when user reaches last step
  useEffect(() => {
    if (activeStep >= totalSteps - 1 && totalSteps > 0) {
      onComplete(lessonId);
    }
  }, [activeStep, totalSteps, lessonId, onComplete]);

  // Intersection observer for step tracking
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  useEffect(() => {
    const container = theoryRef.current;
    if (!container || totalSteps === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.getAttribute('data-step'));
            if (!isNaN(idx)) setActiveStep(idx);
          }
        }
      },
      { root: container, threshold: 0.5 }
    );

    stepRefs.current.forEach(el => { if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, [totalSteps, lessonId]);

  // Primary action: what the big button does
  const handlePrimary = useCallback(() => {
    if (hasInteractive && viewMode === 'theory') {
      // Show simulation — on mobile go straight to sim, on desktop use split
      setViewMode(isMobile ? 'sim' : 'split');
    } else {
      // Go to next lesson
      if (next && next.available) onNavigate(next.id);
    }
  }, [hasInteractive, viewMode, isMobile, next, onNavigate]);

  // Spacebar logic
  useEffect(() => {
    // When sim is visible (split or sim mode), let sandbox handle spacebar
    if (viewMode === 'split' || viewMode === 'sim') return;

    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || tag === 'BUTTON') return;
      if (e.code === 'Space') {
        e.preventDefault();
        handlePrimary();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [viewMode, handlePrimary]);

  if (!node) {
    return (
      <div className="h-screen w-screen bg-gray-950 flex items-center justify-center">
        <p className="text-gray-600">Lektion nicht gefunden.</p>
      </div>
    );
  }

  // Determine what's visible
  const showTheory = viewMode === 'theory' || viewMode === 'split';
  const showSim = hasInteractive && (viewMode === 'split' || viewMode === 'sim');
  const showQuiz = viewMode === 'quiz';
  const theoryFullWidth = viewMode === 'theory' || !hasInteractive;
  const hasQuiz = !!(quizBank[lessonId]?.questions.length);

  return (
    <div className="h-dvh w-screen bg-gray-950 flex flex-col overflow-hidden">
      {/* ── Top bar ─────────────────────────────────────────── */}
      <header className="shrink-0 flex items-center h-11 px-2 sm:px-3 border-b border-gray-800/60 bg-gray-950/80 backdrop-blur-sm z-20">
        {/* Left: Back + breadcrumb */}
        <div className="flex items-center min-w-0 shrink-0">
          <button onClick={onBack}
            className="p-2 -ml-1 rounded hover:bg-gray-800 text-gray-500 hover:text-gray-300 transition-colors"
            title="Zurück zur Karte"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="block">
              <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <div className="hidden sm:flex items-center gap-1 ml-2 text-[11px] text-gray-500 min-w-0 overflow-hidden">
            {crumbs.slice(1).map((c, i) => (
              <React.Fragment key={c.id}>
                {i > 0 && <span className="text-gray-700 mx-0.5">/</span>}
                <span className={i === crumbs.length - 2 ? 'text-gray-300 font-medium truncate' : 'truncate'}>
                  {c.shortTitle}
                </span>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Center: Step dots + Notation glossary */}
        <div className="hidden sm:flex absolute left-1/2 -translate-x-1/2 items-center gap-2">
          {totalSteps > 0 && (
            <div className="flex gap-1">
              {content!.steps.map((_, i) => (
                <div key={i} className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                  i <= activeStep ? 'bg-cyan-400' : 'bg-gray-800'
                }`} />
              ))}
            </div>
          )}
          <NotationGlossary lessonId={lessonId} />
        </div>

        {/* Right: View mode toggle (always visible) */}
        <div className="ml-auto flex items-center gap-0.5 bg-gray-900/80 rounded-lg p-0.5">
          <ToggleBtn active={viewMode === 'theory'} onClick={() => setViewMode('theory')} title="Nur Text">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 4h10M3 7h8M3 10h10M3 13h6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
          </ToggleBtn>
          {hasInteractive && (
            <>
              <ToggleBtn active={viewMode === 'split'} onClick={() => setViewMode('split')} title="Split" className="hidden md:flex">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><rect x="2" y="2" width="12" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.2" fill="none"/><path d="M8 2v12" stroke="currentColor" strokeWidth="1.2"/></svg>
              </ToggleBtn>
              <ToggleBtn active={viewMode === 'sim'} onClick={() => setViewMode('sim')} title="Nur Simulation">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M2 13l3-4 3 2 4-6 2 1" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </ToggleBtn>
            </>
          )}
          {hasQuiz && (
            <ToggleBtn active={viewMode === 'quiz'} onClick={() => setViewMode('quiz')} title="Abfrage">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.2" fill="none"/><path d="M8 10v1M8 13v0.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </ToggleBtn>
          )}
        </div>
      </header>

      {/* ── Content area ────────────────────────────────────── */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0">
        {/* Theory panel */}
        {showTheory && (
          <div
            ref={theoryRef}
            className={`overflow-y-auto py-6 sm:py-10 px-4 sm:px-8 transition-all duration-300 ${
              theoryFullWidth
                ? 'flex-1 max-w-4xl mx-auto'
                : 'flex-1 md:flex-none md:w-[520px] md:shrink-0 border-b md:border-b-0 md:border-r border-gray-800/50 max-h-[50vh] md:max-h-none'
            }`}
          >
            {/* Title */}
            <div className="mb-8">
              <Icon name={node.icon} className="text-gray-400" size={28} />
              <h1 className="mt-2 text-xl font-bold text-white leading-snug">{node.title}</h1>
              <p className="mt-1 text-xs text-gray-500">{node.description}</p>
            </div>

            {/* Steps */}
            {content?.steps.map((step, i) => (
              <div
                key={i}
                ref={el => { stepRefs.current[i] = el; }}
                data-step={i}
                className="mb-10 scroll-mt-6"
              >
                <StepBlock step={step} index={i} isActive={i === activeStep} />
              </div>
            ))}

            {/* Mesh visualization for Gitter & Geometrie lesson */}
            {lessonId === 'basics-mesh' && (
              <div className="mb-10">
                <MeshTypesViz />
              </div>
            )}

            {/* Spacer so content doesn't get hidden behind fixed bottom bar */}
            <div className="h-20" />
          </div>
        )}

        {/* Simulation panel */}
        {showSim && (
          <div className="flex-1 min-w-0 min-h-0">
            <SimSandbox simMode={simMode} />
          </div>
        )}

        {/* Quiz panel */}
        {showQuiz && (
          <div className="flex-1 min-w-0 min-h-0 overflow-y-auto">
            <QuizPanel lessonId={lessonId} />
          </div>
        )}
      </div>

      {/* ── Fixed bottom bar (outside scroll) ──────────────── */}
      <div className="shrink-0 border-t border-gray-800/60 bg-gray-950/90 backdrop-blur-sm z-20">
        <div className="flex items-center justify-between px-4 py-2.5 max-w-5xl mx-auto">
          {/* Prev */}
          <div className="w-20 sm:w-40">
            {prev && prev.available ? (
              <button onClick={() => onNavigate(prev.id)}
                className="flex items-center gap-1.5 text-[12px] text-gray-500 hover:text-gray-300 transition-colors group">
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="text-gray-600 group-hover:text-gray-400 transition-colors">
                  <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="truncate">{prev.shortTitle}</span>
              </button>
            ) : <span />}
          </div>

          {/* Primary action */}
          <div className="flex justify-end">
            {hasInteractive && viewMode === 'theory' ? (
              /* Show simulation button */
              <button onClick={handlePrimary}
                className="flex items-center gap-2 px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-[12px] font-medium transition-colors">
                <Icon name="play" className="text-white" size={12} />
                Simulation starten
                <kbd className="ml-1 text-[9px] bg-cyan-700/60 px-1 py-0.5 rounded text-cyan-200/80 hidden sm:inline">Space</kbd>
              </button>
            ) : next && next.available ? (
              /* Next lesson button */
              <button onClick={() => onNavigate(next.id)}
                className="flex items-center gap-2 px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-[12px] font-medium transition-colors">
                <span className="truncate">{next.shortTitle}</span>
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                  <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {viewMode === 'theory' && !hasInteractive && (
                  <kbd className="ml-1 text-[9px] bg-cyan-700/60 px-1 py-0.5 rounded text-cyan-200/80 hidden sm:inline">Space</kbd>
                )}
              </button>
            ) : (
              <button onClick={onBack}
                className="flex items-center gap-2 px-4 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-[12px] font-medium transition-colors">
                Zur Karte
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Toggle button for view mode ─────────────────────────────── */

function ToggleBtn({ active, onClick, title, className = '', children }: {
  active: boolean; onClick: () => void; title: string; className?: string; children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`p-1.5 rounded transition-colors ${
        active ? 'bg-gray-700 text-gray-200' : 'text-gray-600 hover:text-gray-400 hover:bg-gray-800/60'
      } ${className}`}
    >
      {children}
    </button>
  );
}

/* ── Step Block ──────────────────────────────────────────────── */

function StepBlock({ step, index, isActive }: { step: LearningStep; index: number; isActive: boolean }) {
  return (
    <div className={`transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-60'}`}>
      <h3 className="text-sm font-semibold text-gray-200 mb-2">
        <span className="text-gray-600 mr-1.5">{index + 1}.</span>
        {step.title}
      </h3>

      {/* Formulas */}
      {step.formulas?.map((f, fi) => (
        <KatexBlock key={fi} formula={f} />
      ))}

      {/* Text */}
      <div className="text-[13px] text-gray-400 leading-relaxed mt-2">
        <FormattedText text={step.text} />
      </div>

      {/* Interactive component */}
      {step.interactiveComponent === 'face-interpolation' && (
        <FaceInterpolationGraphic />
      )}

      {/* Highlight box */}
      {step.highlight && (
        <HighlightBox type={step.highlight.type} text={step.highlight.text} />
      )}
    </div>
  );
}

/* ── KaTeX block renderer ────────────────────────────────────── */

function KatexBlock({ formula }: { formula: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) {
      try {
        katex.render(formula, ref.current, {
          displayMode: true,
          throwOnError: false,
          trust: true,
        });
      } catch { /* ignore */ }
    }
  }, [formula]);

  return (
    <div ref={ref} className="my-3 px-3 py-2 bg-gray-900/50 rounded-lg overflow-x-auto text-sm" />
  );
}

/* ── Formatted text — basic markdown-like parsing ─────────── */

function FormattedText({ text }: { text: string }) {
  // Split on inline patterns  ** bold **  $ latex $  \n\n paragraphs  • bullets
  const parts = text.split(/(\*\*[^*]+\*\*|\$[^$]+\$|\n\n|\n•)/g);

  return (
    <>
      {parts.map((part, i) => {
        if (part === '\n\n') return <br key={i} />;
        if (part === '\n•') return <span key={i} className="block mt-1 pl-3 before:content-['•'] before:mr-2 before:text-gray-600" />;
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i} className="text-gray-200 font-semibold">{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('$') && part.endsWith('$')) {
          return <InlineMath key={i} tex={part.slice(1, -1)} />;
        }
        if (part.startsWith('• ')) {
          return <span key={i} className="block mt-1 pl-3">• {part.slice(2)}</span>;
        }
        return <React.Fragment key={i}>{part}</React.Fragment>;
      })}
    </>
  );
}

function InlineMath({ tex }: { tex: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (ref.current) {
      try {
        katex.render(tex, ref.current, { displayMode: false, throwOnError: false });
      } catch { /* ignore */ }
    }
  }, [tex]);
  return <span ref={ref} className="mx-0.5" />;
}

/* ── Highlight Box ───────────────────────────────────────────── */

function HighlightBox({ type, text }: { type: 'tip' | 'warning' | 'key'; text: string }) {
  const styles = {
    tip: 'border-l-cyan-500 bg-cyan-500/5 text-cyan-300/80',
    warning: 'border-l-amber-500 bg-amber-500/5 text-amber-300/80',
    key: 'border-l-violet-500 bg-violet-500/5 text-violet-300/80',
  };
  const iconColors = { tip: 'text-cyan-400', warning: 'text-amber-400', key: 'text-violet-400' };

  return (
    <div className={`mt-3 border-l-2 pl-3 py-2 text-[12px] leading-relaxed rounded-r ${styles[type]}`}>
      <HighlightIcon type={type} className={`mr-1 ${iconColors[type]} inline-block align-text-bottom`} />
      <FormattedText text={text} />
    </div>
  );
}
