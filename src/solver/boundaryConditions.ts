/**
 * boundaryConditions.ts — Apply boundary conditions to 1D / 2D fields
 */

export type BC1DType = 'periodic' | 'fixed' | 'zeroGradient';

export interface BC1D {
  left: { type: BC1DType; value?: number };
  right: { type: BC1DType; value?: number };
}

export const defaultBC1D: BC1D = {
  left:  { type: 'periodic' },
  right: { type: 'periodic' },
};

/**
 * Apply 1D boundary conditions **in-place**.
 * For periodic BCs we actually handle them differently in the flux loop,
 * but this function can patch the ghost / boundary cells after each step.
 */
export function applyBC1D(phi: Float64Array, bc: BC1D): void {
  const N = phi.length;
  if (bc.left.type === 'fixed' && bc.left.value !== undefined) {
    phi[0] = bc.left.value;
  }
  if (bc.right.type === 'fixed' && bc.right.value !== undefined) {
    phi[N - 1] = bc.right.value;
  }
  if (bc.left.type === 'periodic' && bc.right.type === 'periodic') {
    // phi[0] and phi[N-1] stay as computed; periodicity is enforced in flux.
  }
  if (bc.left.type === 'zeroGradient') {
    phi[0] = phi[1];
  }
  if (bc.right.type === 'zeroGradient') {
    phi[N - 1] = phi[N - 2];
  }
}

// ── 2D BCs (simplified) ───────────────────────────────────────────

export type BC2DType = 'fixed' | 'zeroGradient' | 'noSlip' | 'lid';

export interface BC2DSide {
  type: BC2DType;
  value?: number;
  velocity?: [number, number];
}

export interface BC2D {
  left: BC2DSide;
  right: BC2DSide;
  bottom: BC2DSide;
  top: BC2DSide;
}

export const lidDrivenCavityBC: BC2D = {
  left:   { type: 'noSlip', velocity: [0, 0] },
  right:  { type: 'noSlip', velocity: [0, 0] },
  bottom: { type: 'noSlip', velocity: [0, 0] },
  top:    { type: 'lid',    velocity: [1, 0] },
};
