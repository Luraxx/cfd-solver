/**
 * SimulationContext — Global state for the CFD learning app
 */
'use client';

import React, { createContext, useContext, useReducer, useCallback, useRef, useEffect } from 'react';
import {
  Grid1D, createGrid1D, initField1D, runSimulation1D,
  computeMaxDt, cflNumber, pecletNumber,
  SchemeName, IC1DParams, BC1D, SimConfig1D, SimulationHistory1D,
  presets1D, Preset1D, l2Norm, totalMass,
  editableBlocks, compileUserCode,
} from '@/solver';

// ── Types ──────────────────────────────────────────────────────────

export type MilestoneId = 'A' | 'B' | 'C' | 'D';

export interface SimState {
  // Parameters
  milestone: MilestoneId;
  N: number;
  L: number;
  u: number;
  gamma: number;
  cfl: number;
  dt: number;
  scheme: SchemeName;
  compareScheme: SchemeName | null;
  ic: IC1DParams;
  bc: BC1D;
  nSteps: number;
  snapshotInterval: number;

  // Derived
  grid: Grid1D;
  peclet: number;

  // Simulation state
  history: SimulationHistory1D | null;
  compareHistory: SimulationHistory1D | null;
  currentSnapshotIdx: number;
  isRunning: boolean;
  isPlaying: boolean;      // animated playback through snapshots
  playbackSpeed: number;   // ms between frames (lower = faster)
  hasRun: boolean;
  diverged: boolean;

  // Diagnostics
  l2Error: number;
  mass: number;
  initialMass: number;

  // Editable code
  activeCodeBlockId: string;
  codeErrors: Record<string, string | null>;
  customFunctions: Record<string, Function | null>;

  // Learning mode
  learningStep: number;
  activeTab: 'formulas' | 'code' | 'stencil' | 'diagnostics';

  // Active preset
  activePreset: string | null;
}

type Action =
  | { type: 'SET_PARAM'; key: string; value: unknown }
  | { type: 'SET_MILESTONE'; milestone: MilestoneId }
  | { type: 'SET_SCHEME'; scheme: SchemeName }
  | { type: 'SET_COMPARE_SCHEME'; scheme: SchemeName | null }
  | { type: 'SET_IC'; ic: IC1DParams }
  | { type: 'SET_BC'; bc: BC1D }
  | { type: 'SET_SNAPSHOT_IDX'; idx: number }
  | { type: 'RUN_SIMULATION' }
  | { type: 'SET_HISTORY'; history: SimulationHistory1D; compare?: SimulationHistory1D | null }
  | { type: 'SET_RUNNING'; running: boolean }
  | { type: 'SET_PLAYING'; playing: boolean }
  | { type: 'SET_PLAYBACK_SPEED'; speed: number }
  | { type: 'ADVANCE_SNAPSHOT' }
  | { type: 'APPLY_PRESET'; preset: Preset1D }
  | { type: 'SET_CODE_BLOCK'; id: string }
  | { type: 'SET_CODE_ERROR'; id: string; error: string | null }
  | { type: 'SET_CUSTOM_FN'; id: string; fn: Function | null }
  | { type: 'SET_LEARNING_STEP'; step: number }
  | { type: 'SET_TAB'; tab: SimState['activeTab'] }
  | { type: 'RESET' };

// ── Initial state ──────────────────────────────────────────────────

function createInitialState(): SimState {
  const N = 100, L = 1.0, u = 1.0, gamma = 0;
  const cfl = 0.5;
  const grid = createGrid1D(N, L);
  const dt = computeMaxDt(grid.dx, u, cfl, gamma);

  return {
    milestone: 'A',
    N, L, u, gamma, cfl, dt,
    scheme: 'UDS',
    compareScheme: null,
    ic: { type: 'step', stepPos: 0.2 },
    bc: { left: { type: 'periodic' }, right: { type: 'periodic' } },
    nSteps: 100,
    snapshotInterval: 10,
    grid,
    peclet: pecletNumber(u, grid.dx, gamma),
    history: null,
    compareHistory: null,
    currentSnapshotIdx: 0,
    isRunning: false,
    isPlaying: false,
    playbackSpeed: 80,
    hasRun: false,
    diverged: false,
    l2Error: 0,
    mass: 0,
    initialMass: 0,
    activeCodeBlockId: editableBlocks[0].id,
    codeErrors: {},
    customFunctions: {},
    learningStep: 0,
    activeTab: 'formulas',
    activePreset: null,
  };
}

// ── Reducer ────────────────────────────────────────────────────────

function reducer(state: SimState, action: Action): SimState {
  switch (action.type) {
    case 'SET_PARAM': {
      const next = { ...state, [action.key]: action.value };
      // Recompute derived values
      if (['N', 'L'].includes(action.key)) {
        next.grid = createGrid1D(next.N, next.L);
      }
      if (['N', 'L', 'u', 'cfl', 'gamma'].includes(action.key)) {
        next.grid = createGrid1D(next.N, next.L);
        next.dt = computeMaxDt(next.grid.dx, next.u, next.cfl, next.gamma);
        next.peclet = pecletNumber(next.u, next.grid.dx, next.gamma);
      }
      return next;
    }
    case 'SET_MILESTONE':
      return { ...state, milestone: action.milestone };
    case 'SET_SCHEME':
      return { ...state, scheme: action.scheme };
    case 'SET_COMPARE_SCHEME':
      return { ...state, compareScheme: action.scheme };
    case 'SET_IC':
      return { ...state, ic: action.ic };
    case 'SET_BC':
      return { ...state, bc: action.bc };
    case 'SET_SNAPSHOT_IDX':
      return { ...state, currentSnapshotIdx: action.idx };
    case 'SET_HISTORY': {
      const hist = action.history;
      const phi0 = hist.snapshots[0]?.phi;
      const phiFinal = hist.snapshots[hist.snapshots.length - 1]?.phi;
      return {
        ...state,
        history: hist,
        compareHistory: action.compare ?? null,
        hasRun: true,
        isRunning: false,
        diverged: hist.diverged,
        currentSnapshotIdx: 0,
        l2Error: phi0 && phiFinal ? l2Norm(phiFinal, phi0) : 0,
        mass: phiFinal ? totalMass(phiFinal, state.grid.dx) : 0,
        initialMass: phi0 ? totalMass(phi0, state.grid.dx) : 0,
      };
    }
    case 'SET_RUNNING':
      return { ...state, isRunning: action.running };
    case 'SET_PLAYING':
      return { ...state, isPlaying: action.playing };
    case 'SET_PLAYBACK_SPEED':
      return { ...state, playbackSpeed: action.speed };
    case 'ADVANCE_SNAPSHOT': {
      const total = state.history?.snapshots.length ?? 0;
      if (total === 0) return state;
      const nextIdx = state.currentSnapshotIdx + 1;
      if (nextIdx >= total) {
        // Reached end — stop playback
        return { ...state, isPlaying: false, currentSnapshotIdx: total - 1 };
      }
      return { ...state, currentSnapshotIdx: nextIdx };
    }
    case 'APPLY_PRESET': {
      const p = action.preset;
      const grid = createGrid1D(p.N, p.L);
      const dt = computeMaxDt(grid.dx, p.u, p.cfl, p.gamma);
      return {
        ...state,
        N: p.N, L: p.L, u: p.u, gamma: p.gamma, cfl: p.cfl, dt,
        scheme: p.scheme, ic: p.ic, bc: p.bc,
        nSteps: p.nSteps, snapshotInterval: p.snapshotInterval,
        grid,
        peclet: pecletNumber(p.u, grid.dx, p.gamma),
        history: null, compareHistory: null,
        hasRun: false, diverged: false,
        currentSnapshotIdx: 0,
        activePreset: p.name,
      };
    }
    case 'SET_CODE_BLOCK':
      return { ...state, activeCodeBlockId: action.id };
    case 'SET_CODE_ERROR':
      return { ...state, codeErrors: { ...state.codeErrors, [action.id]: action.error } };
    case 'SET_CUSTOM_FN':
      return { ...state, customFunctions: { ...state.customFunctions, [action.id]: action.fn } };
    case 'SET_LEARNING_STEP':
      return { ...state, learningStep: action.step };
    case 'SET_TAB':
      return { ...state, activeTab: action.tab };
    case 'RESET':
      return createInitialState();
    default:
      return state;
  }
}

// ── Context ────────────────────────────────────────────────────────

interface SimContextValue {
  state: SimState;
  dispatch: React.Dispatch<Action>;
  runSimulation: () => void;
  togglePlayback: () => void;
  stopPlayback: () => void;
}

const SimContext = createContext<SimContextValue | null>(null);

export function SimProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, null, createInitialState);
  const stateRef = useRef(state);
  stateRef.current = state;
  const animFrameRef = useRef<number | null>(null);
  const lastTickRef = useRef<number>(0);

  // ── Animated playback loop ───────────────────────────────────────
  useEffect(() => {
    if (!state.isPlaying) {
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
      return;
    }

    const tick = (now: number) => {
      const s = stateRef.current;
      if (!s.isPlaying) return;

      if (now - lastTickRef.current >= s.playbackSpeed) {
        lastTickRef.current = now;
        dispatch({ type: 'ADVANCE_SNAPSHOT' });
      }
      animFrameRef.current = requestAnimationFrame(tick);
    };

    lastTickRef.current = performance.now();
    animFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
    };
  }, [state.isPlaying]);

  // ── Spacebar global handler ──────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Don't trigger when typing in inputs/textareas/monaco
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      const role = (e.target as HTMLElement)?.getAttribute('role');
      if (role === 'textbox' || (e.target as HTMLElement)?.closest('.monaco-editor')) return;

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlaybackRef.current();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // ── Run simulation (compute all snapshots, then auto-play) ──────
  const runSimulation = useCallback(() => {
    const s = stateRef.current;
    dispatch({ type: 'SET_RUNNING', running: true });
    dispatch({ type: 'SET_PLAYING', playing: false });

    requestAnimationFrame(() => {
      const phi0 = initField1D(s.grid.xCell, s.L, s.ic);
      const config: SimConfig1D = {
        grid: s.grid,
        u: s.u,
        dt: s.dt,
        gamma: s.gamma,
        scheme: s.scheme,
        bc: s.bc,
        nSteps: s.nSteps,
        snapshotInterval: s.snapshotInterval,
      };

      const history = runSimulation1D(phi0, config);

      let compareHistory: SimulationHistory1D | null = null;
      if (s.compareScheme) {
        const phi0c = initField1D(s.grid.xCell, s.L, s.ic);
        compareHistory = runSimulation1D(phi0c, { ...config, scheme: s.compareScheme });
      }

      dispatch({ type: 'SET_HISTORY', history, compare: compareHistory });

      // Auto-start animated playback from the beginning
      requestAnimationFrame(() => {
        dispatch({ type: 'SET_SNAPSHOT_IDX', idx: 0 });
        dispatch({ type: 'SET_PLAYING', playing: true });
      });
    });
  }, []);

  // ── Toggle play/pause ────────────────────────────────────────────
  const togglePlayback = useCallback(() => {
    const s = stateRef.current;
    if (!s.hasRun && !s.history) {
      // No simulation yet — run it
      runSimulation();
      return;
    }
    if (s.isPlaying) {
      dispatch({ type: 'SET_PLAYING', playing: false });
    } else {
      // If at the end, restart from beginning
      const total = s.history?.snapshots.length ?? 0;
      if (s.currentSnapshotIdx >= total - 1) {
        dispatch({ type: 'SET_SNAPSHOT_IDX', idx: 0 });
      }
      dispatch({ type: 'SET_PLAYING', playing: true });
    }
  }, [runSimulation]);

  const togglePlaybackRef = useRef(togglePlayback);
  togglePlaybackRef.current = togglePlayback;

  const stopPlayback = useCallback(() => {
    dispatch({ type: 'SET_PLAYING', playing: false });
  }, []);

  return (
    <SimContext.Provider value={{ state, dispatch, runSimulation, togglePlayback, stopPlayback }}>
      {children}
    </SimContext.Provider>
  );
}

export function useSimulation() {
  const ctx = useContext(SimContext);
  if (!ctx) throw new Error('useSimulation must be used within SimProvider');
  return ctx;
}

// Re-export for convenience
export { presets1D, editableBlocks, compileUserCode, cflNumber, pecletNumber };
