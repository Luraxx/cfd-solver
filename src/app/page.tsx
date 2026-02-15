'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { SimProvider } from '@/context/SimulationContext';
import Roadmap from '@/components/Roadmap';
import LessonPage from '@/components/LessonPage';
import FullSimulation from '@/components/FullSimulation';
import QuizMode from '@/components/QuizMode';
import MeshTypesViz from '@/components/MeshTypesViz';

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Root page — three states:
   1. Roadmap (landing)
   2. LessonPage (full-screen lesson)
   3. FullSimulation (full FVM sandbox)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

type View = { kind: 'map' } | { kind: 'lesson'; id: string } | { kind: 'fullsim'; returnTo: string | null } | { kind: 'quiz' } | { kind: 'mesh' };

const STORAGE_KEY = 'cfd-lab-completed';

function loadCompleted(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return new Set(JSON.parse(raw));
  } catch { /* ignore */ }
  return new Set();
}

function saveCompleted(s: Set<string>) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify([...s])); } catch { /* ignore */ }
}

export default function Home() {
  const [view, setView] = useState<View>({ kind: 'map' });
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  useEffect(() => { setCompleted(loadCompleted()); }, []);

  const openLesson = useCallback((id: string) => setView({ kind: 'lesson', id }), []);
  const goToMap = useCallback(() => setView({ kind: 'map' }), []);

  const navigate = useCallback((id: string) => setView({ kind: 'lesson', id }), []);

  const openFullSim = useCallback((returnLessonId: string | null) => {
    setView({ kind: 'fullsim', returnTo: returnLessonId });
  }, []);

  const markComplete = useCallback((id: string) => {
    setCompleted(prev => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      saveCompleted(next);
      return next;
    });
  }, []);

  // ── Full simulation ──────────────────────────────────────────
  if (view.kind === 'fullsim') {
    return (
      <SimProvider>
        <div className="page-enter">
          <FullSimulation onBack={() => {
            if (view.returnTo) setView({ kind: 'lesson', id: view.returnTo });
            else setView({ kind: 'map' });
          }} />
        </div>
      </SimProvider>
    );
  }

  // ── Quiz trainer mode ────────────────────────────────────────
  if (view.kind === 'quiz') {
    return (
      <div className="page-enter">
        <QuizMode onBack={goToMap} />
      </div>
    );
  }

  // ── Mesh types visualization ─────────────────────────────────
  if (view.kind === 'mesh') {
    return (
      <div className="page-enter min-h-dvh bg-gray-950">
        <div className="fixed top-0 left-0 right-0 z-30 bg-gray-950/80 backdrop-blur-md border-b border-gray-800/50">
          <div className="flex items-center py-2.5 px-4 sm:px-6">
            <button onClick={goToMap} className="flex items-center gap-1.5 text-gray-500 hover:text-gray-300 text-xs transition-colors">
              ← Zurück
            </button>
            <h1 className="absolute left-1/2 -translate-x-1/2 text-lg font-bold text-white">Gittertypen</h1>
          </div>
        </div>
        <div className="pt-14">
          <MeshTypesViz />
        </div>
      </div>
    );
  }

  // ── Lesson mode ──────────────────────────────────────────────
  if (view.kind === 'lesson') {
    return (
      <SimProvider>
        <div className="page-enter">
          <LessonPage
            lessonId={view.id}
            onBack={goToMap}
            onNavigate={navigate}
            onComplete={markComplete}
          />
        </div>
      </SimProvider>
    );
  }

  // ── Roadmap (landing) ────────────────────────────────────────
  return (
    <div className="page-enter">
      <Roadmap onOpen={openLesson} completed={completed} onOpenFullSim={() => openFullSim(null)} onOpenQuiz={() => setView({ kind: 'quiz' })} onOpenMesh={() => setView({ kind: 'mesh' })} />
    </div>
  );
}
