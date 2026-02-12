'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import katex from 'katex';
import { findNode, getNextLesson, getPrevLesson, getBreadcrumb, LessonNode } from '@/curriculum/curriculum';
import { lessonContents, LearningStep } from '@/curriculum/lessonContent';

interface Props {
  lessonId: string;
  onNavigate: (id: string) => void;
  onMarkCompleted: (id: string) => void;
}

/**
 * LessonView renders the didactic content for the current lesson:
 *   - Breadcrumb
 *   - Step-by-step formulas/text
 *   - Next/Prev navigation
 */
export default function LessonView({ lessonId, onNavigate, onMarkCompleted }: Props) {
  const node = findNode(lessonId);
  const content = lessonContents[lessonId];
  const [currentStep, setCurrentStep] = useState(0);

  // Reset step when lesson changes
  useEffect(() => { setCurrentStep(0); }, [lessonId]);

  const nextLesson = getNextLesson(lessonId);
  const prevLesson = getPrevLesson(lessonId);
  const breadcrumb = getBreadcrumb(lessonId);

  const steps = content?.steps ?? [];
  const step = steps[currentStep];

  // Mark completed when user reads all steps
  useEffect(() => {
    if (steps.length > 0 && currentStep === steps.length - 1) {
      onMarkCompleted(lessonId);
    }
  }, [currentStep, steps.length, lessonId, onMarkCompleted]);

  if (!node) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Lektion nicht gefunden
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1 px-4 py-2 text-[11px] text-gray-500 border-b border-gray-800 shrink-0 overflow-x-auto">
        {breadcrumb?.map((n, i) => (
          <React.Fragment key={n.id}>
            {i > 0 && <span className="mx-0.5">›</span>}
            <button
              onClick={() => n.type === 'lesson' && onNavigate(n.id)}
              className={`hover:text-gray-300 transition-colors whitespace-nowrap ${
                n.id === lessonId ? 'text-cyan-400 font-medium' : ''
              }`}
            >
              {n.shortTitle}
            </button>
          </React.Fragment>
        ))}
      </div>

      {/* Lesson header */}
      <div className="px-5 py-4 border-b border-gray-800 shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{node.icon}</span>
          <div>
            <h2 className="text-lg font-bold text-gray-100">{node.title}</h2>
            <p className="text-xs text-gray-500 mt-0.5">{node.description}</p>
          </div>
        </div>
      </div>

      {/* Step content */}
      <div className="flex-1 overflow-y-auto">
        {step ? (
          <StepView step={step} />
        ) : (
          <div className="p-5 text-gray-400">
            <p>{node.description}</p>
            <p className="mt-4 text-sm">
              {node.simMode && node.simMode !== 'none'
                ? 'Nutze die interaktive Simulation rechts, um das Konzept zu erkunden.'
                : 'Diese Lektion enthält Theorie — lies die Schritte durch und gehe dann zur nächsten Lektion.'}
            </p>
          </div>
        )}
      </div>

      {/* Step dots + navigation */}
      <div className="px-4 py-3 border-t border-gray-800 shrink-0 bg-gray-900/80">
        {/* Step indicators */}
        {steps.length > 1 && (
          <div className="flex items-center justify-center gap-1.5 mb-3">
            {steps.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentStep(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === currentStep
                    ? 'bg-cyan-400 scale-125'
                    : i < currentStep
                      ? 'bg-cyan-800'
                      : 'bg-gray-700'
                }`}
                title={steps[i].title}
              />
            ))}
          </div>
        )}

        <div className="flex items-center justify-between">
          {/* Prev step / prev lesson */}
          <button
            onClick={() => {
              if (currentStep > 0) setCurrentStep(currentStep - 1);
              else if (prevLesson?.available) onNavigate(prevLesson.id);
            }}
            disabled={currentStep === 0 && !prevLesson?.available}
            className="px-3 py-1.5 text-xs rounded bg-gray-800 text-gray-300 hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            ← {currentStep > 0 ? 'Zurück' : (prevLesson?.shortTitle ?? 'Start')}
          </button>

          {/* Step count */}
          {steps.length > 0 && (
            <span className="text-[10px] text-gray-600">
              Schritt {currentStep + 1} / {steps.length}
            </span>
          )}

          {/* Next step / next lesson */}
          <button
            onClick={() => {
              if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
              else if (nextLesson?.available) onNavigate(nextLesson.id);
            }}
            disabled={currentStep >= steps.length - 1 && !nextLesson?.available}
            className={`px-3 py-1.5 text-xs rounded transition-colors ${
              currentStep < steps.length - 1
                ? 'bg-cyan-600 text-white hover:bg-cyan-500'
                : nextLesson?.available
                  ? 'bg-green-600 text-white hover:bg-green-500'
                  : 'bg-gray-800 text-gray-500 cursor-not-allowed'
            }`}
          >
            {currentStep < steps.length - 1
              ? 'Weiter →'
              : nextLesson?.available
                ? `${nextLesson.shortTitle} →`
                : 'Ende ✓'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Single step renderer ───────────────────────────────────────────

function StepView({ step }: { step: LearningStep }) {
  return (
    <div className="p-5 space-y-4">
      {/* Step title */}
      <h3 className="text-base font-semibold text-gray-100">{step.title}</h3>

      {/* Text content with basic formatting */}
      <div className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">
        <FormattedText text={step.text} />
      </div>

      {/* Formulas */}
      {step.formulas?.map((formula, i) => (
        <KatexBlock key={i} formula={formula} />
      ))}

      {/* Highlight box */}
      {step.highlight && (
        <HighlightBox type={step.highlight.type} text={step.highlight.text} />
      )}
    </div>
  );
}

// ── KaTeX block renderer ───────────────────────────────────────────

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
      } catch {
        ref.current.textContent = formula;
      }
    }
  }, [formula]);

  return (
    <div
      ref={ref}
      className="my-3 p-3 bg-gray-800/60 rounded-lg overflow-x-auto text-center"
    />
  );
}

// ── Formatted text with basic markdown-style bold ──────────────────

function FormattedText({ text }: { text: string }) {
  // Split by **bold** markers and render
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i} className="text-gray-100">{part.slice(2, -2)}</strong>;
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

// ── Highlight box ──────────────────────────────────────────────────

function HighlightBox({ type, text }: { type: 'tip' | 'warning' | 'key'; text: string }) {
  const styles = {
    tip: 'bg-green-900/20 border-green-700 text-green-300',
    warning: 'bg-yellow-900/20 border-yellow-700 text-yellow-300',
    key: 'bg-cyan-900/20 border-cyan-700 text-cyan-300',
  };
  const icons = { tip: '💡', warning: '⚠️', key: '🔑' };

  return (
    <div className={`p-3 rounded-lg border-l-4 text-sm ${styles[type]}`}>
      <span className="mr-2">{icons[type]}</span>
      <FormattedText text={text} />
    </div>
  );
}
