/**
 * fdm.ts — Finite Difference Method solvers
 *
 * FDM approximates derivatives by difference quotients at grid NODES.
 * This is the simplest method and great for learning.
 */

// ── Stencil types ──────────────────────────────────────────────────

export type FDStencilType = 'forward' | 'backward' | 'central';

export interface FDStencil {
  type: FDStencilType;
  /** Stencil weights: coefficients[offset] = weight */
  offsets: number[];
  weights: number[];
  order: number;        // truncation error order
  derivOrder: number;   // which derivative (1st, 2nd)
  formula: string;      // LaTeX formula
  taylorError: string;  // LaTeX truncation error
}

export const fdStencils: Record<string, FDStencil> = {
  'forward-1': {
    type: 'forward',
    offsets: [0, 1],
    weights: [-1, 1],
    order: 1,
    derivOrder: 1,
    formula: "\\frac{df}{dx}\\bigg|_i \\approx \\frac{f_{i+1} - f_i}{\\Delta x}",
    taylorError: "\\mathcal{O}(\\Delta x)",
  },
  'backward-1': {
    type: 'backward',
    offsets: [-1, 0],
    weights: [-1, 1],
    order: 1,
    derivOrder: 1,
    formula: "\\frac{df}{dx}\\bigg|_i \\approx \\frac{f_i - f_{i-1}}{\\Delta x}",
    taylorError: "\\mathcal{O}(\\Delta x)",
  },
  'central-1': {
    type: 'central',
    offsets: [-1, 0, 1],
    weights: [-0.5, 0, 0.5],
    order: 2,
    derivOrder: 1,
    formula: "\\frac{df}{dx}\\bigg|_i \\approx \\frac{f_{i+1} - f_{i-1}}{2\\Delta x}",
    taylorError: "\\mathcal{O}(\\Delta x^2)",
  },
  'central-2': {
    type: 'central',
    offsets: [-1, 0, 1],
    weights: [1, -2, 1],
    order: 2,
    derivOrder: 2,
    formula: "\\frac{d^2f}{dx^2}\\bigg|_i \\approx \\frac{f_{i+1} - 2f_i + f_{i-1}}{\\Delta x^2}",
    taylorError: "\\mathcal{O}(\\Delta x^2)",
  },
};

// ── 1D Heat equation solver (FDM) ─────────────────────────────────
// ∂T/∂t = α ∂²T/∂x²

export interface HeatConfig {
  N: number;
  L: number;
  alpha: number;   // thermal diffusivity
  dt: number;
  nSteps: number;
  snapshotInterval: number;
  bcLeft: 'fixed' | number;
  bcRight: 'fixed' | number;
}

export interface HeatResult {
  snapshots: { T: Float64Array; time: number; step: number }[];
  diverged: boolean;
}

export function initHeatGaussian(N: number, L: number, center?: number, sigma?: number): Float64Array {
  const T = new Float64Array(N);
  const c = center ?? 0.5 * L;
  const s = sigma ?? 0.05;
  for (let i = 0; i < N; i++) {
    const x = (i + 0.5) * L / N;
    T[i] = Math.exp(-((x - c) ** 2) / (2 * s * s));
  }
  return T;
}

export function initHeatStep(N: number, L: number, xLeft?: number, xRight?: number): Float64Array {
  const T = new Float64Array(N);
  const xl = xLeft ?? 0.3 * L;
  const xr = xRight ?? 0.7 * L;
  for (let i = 0; i < N; i++) {
    const x = (i + 0.5) * L / N;
    T[i] = (x >= xl && x <= xr) ? 1.0 : 0.0;
  }
  return T;
}

/**
 * Solve 1D heat equation with explicit Euler + central FD:
 *   T_i^{n+1} = T_i^n + α·Δt/Δx² · (T_{i+1} − 2T_i + T_{i-1})
 *
 * Stability: α·Δt/Δx² ≤ 0.5
 */
export function solveHeat1D(T0: Float64Array, config: HeatConfig): HeatResult {
  const { N, L, alpha, dt, nSteps, snapshotInterval, bcLeft, bcRight } = config;
  const dx = L / N;
  const r = alpha * dt / (dx * dx); // Fourier number (must be ≤ 0.5)

  const snapshots: { T: Float64Array; time: number; step: number }[] = [];
  let T = new Float64Array(T0);

  snapshots.push({ T: new Float64Array(T), time: 0, step: 0 });

  for (let step = 1; step <= nSteps; step++) {
    const Tnew = new Float64Array(N);

    for (let i = 1; i < N - 1; i++) {
      // Central difference for 2nd derivative
      Tnew[i] = T[i] + r * (T[i + 1] - 2 * T[i] + T[i - 1]);
    }

    // BCs
    Tnew[0] = bcLeft === 'fixed' ? 0 : bcLeft;
    Tnew[N - 1] = bcRight === 'fixed' ? 0 : bcRight;

    // Check for divergence
    let valid = true;
    for (let i = 0; i < N; i++) {
      if (!isFinite(Tnew[i])) { valid = false; break; }
    }
    if (!valid) {
      snapshots.push({ T: new Float64Array(Tnew), time: step * dt, step });
      return { snapshots, diverged: true };
    }

    T = Tnew;

    if (step % snapshotInterval === 0 || step === nSteps) {
      snapshots.push({ T: new Float64Array(T), time: step * dt, step });
    }
  }

  return { snapshots, diverged: false };
}

/** Compute max stable dt for heat equation */
export function heatMaxDt(dx: number, alpha: number, safetyFactor: number = 0.4): number {
  return safetyFactor * dx * dx / (2 * alpha);
}
