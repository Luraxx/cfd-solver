/**
 * fields.ts — Scalar and vector field types + initialization helpers
 */

export type ScalarField1D = Float64Array<ArrayBuffer>;
export type ScalarField2D = Float64Array<ArrayBuffer>;  // row-major Nx * Ny

/** Create a zero-initialized 1D scalar field */
export function createField1D(N: number): ScalarField1D {
  return new Float64Array(N) as ScalarField1D;
}

/** Create a zero-initialized 2D scalar field (row-major) */
export function createField2D(Nx: number, Ny: number): ScalarField2D {
  return new Float64Array(Nx * Ny) as ScalarField2D;
}

/** 2D index helper (row-major: i varies fastest = x-direction) */
export function idx2D(i: number, j: number, Nx: number): number {
  return j * Nx + i;
}

// ── 1D Initial Conditions ──────────────────────────────────────────

export type InitialConditionType = 'step' | 'gaussian' | 'sine' | 'triangle';

export interface IC1DParams {
  type: InitialConditionType;
  /** For step: position of the discontinuity (fraction of L, default 0.3) */
  stepPos?: number;
  /** For gaussian: centre (fraction of L) and width σ */
  gaussCenter?: number;
  gaussSigma?: number;
}

export function initField1D(
  xCell: number[],
  L: number,
  params: IC1DParams
): ScalarField1D {
  const N = xCell.length;
  const phi = createField1D(N);
  const { type } = params;

  for (let i = 0; i < N; i++) {
    const x = xCell[i];
    switch (type) {
      case 'step': {
        const pos = (params.stepPos ?? 0.3) * L;
        phi[i] = x < pos ? 1.0 : 0.0;
        break;
      }
      case 'gaussian': {
        const mu = (params.gaussCenter ?? 0.5) * L;
        const sigma = (params.gaussSigma ?? 0.05) * L;
        phi[i] = Math.exp(-0.5 * ((x - mu) / sigma) ** 2);
        break;
      }
      case 'sine': {
        phi[i] = Math.sin(2 * Math.PI * x / L);
        break;
      }
      case 'triangle': {
        const mid = 0.5 * L;
        const w = 0.2 * L;
        if (Math.abs(x - mid) < w) {
          phi[i] = 1.0 - Math.abs(x - mid) / w;
        } else {
          phi[i] = 0.0;
        }
        break;
      }
    }
  }
  return phi;
}

// ── 2D Initial Conditions ──────────────────────────────────────────

export type IC2DType = 'gaussian-blob' | 'step-x' | 'diagonal';

export function initField2D(
  xCell: number[], yCell: number[],
  Lx: number, Ly: number,
  Nx: number, _Ny: number,
  type: IC2DType
): ScalarField2D {
  const phi = createField2D(Nx, yCell.length);
  for (let j = 0; j < yCell.length; j++) {
    for (let i = 0; i < Nx; i++) {
      const x = xCell[i], y = yCell[j];
      switch (type) {
        case 'gaussian-blob': {
          const cx = 0.3 * Lx, cy = 0.5 * Ly, s = 0.08 * Lx;
          phi[idx2D(i, j, Nx)] = Math.exp(
            -0.5 * (((x - cx) / s) ** 2 + ((y - cy) / s) ** 2)
          );
          break;
        }
        case 'step-x': {
          phi[idx2D(i, j, Nx)] = x < 0.3 * Lx ? 1.0 : 0.0;
          break;
        }
        case 'diagonal': {
          phi[idx2D(i, j, Nx)] = (x / Lx + y / Ly) < 0.6 ? 1.0 : 0.0;
          break;
        }
      }
    }
  }
  return phi;
}
