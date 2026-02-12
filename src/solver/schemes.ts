/**
 * schemes.ts — Convective flux interpolation schemes
 *
 * Each scheme computes the face value φ_f from the cell values around the face.
 *
 * Nomenclature (1D, face between cells i and i+1):
 *   φ_W = φ[i-1],  φ_P = φ[i],  φ_E = φ[i+1],  φ_EE = φ[i+2]
 *   u_f  = velocity at the face
 *
 * The exported `computeFaceValue` is the main entry point.
 */

export type SchemeName = 'UDS' | 'CDS' | 'TVD-minmod' | 'TVD-vanLeer' | 'TVD-superbee';

// ── helpers ────────────────────────────────────────────────────────

function minmod(a: number, b: number): number {
  if (a * b <= 0) return 0;
  return Math.abs(a) < Math.abs(b) ? a : b;
}

function vanLeer(r: number): number {
  if (r <= 0) return 0;
  return (2 * r) / (1 + r);
}

function superbee(r: number): number {
  if (r <= 0) return 0;
  return Math.max(Math.min(2 * r, 1), Math.min(r, 2));
}

// ── Face value computation ─────────────────────────────────────────

/**
 * Compute the interpolated face value φ_f for the face **between cell i and i+1**.
 *
 * @param phi    full field array
 * @param i      index of the "left" cell of the face
 * @param u_f    velocity at the face (sign determines upwind direction)
 * @param scheme name of the interpolation scheme
 * @param N      total number of cells (for bounds checking)
 * @returns      interpolated face value
 */
export function computeFaceValue(
  phi: Float64Array,
  i: number,
  u_f: number,
  scheme: SchemeName,
  N: number
): number {
  // Clamp helpers for boundary safety
  const get = (idx: number) => phi[Math.max(0, Math.min(N - 1, idx))];

  switch (scheme) {
    // ── Upwind Differencing Scheme ─────────────────────────────────
    case 'UDS': {
      // φ_f = φ_upwind
      return u_f >= 0 ? get(i) : get(i + 1);
    }

    // ── Central Differencing Scheme ────────────────────────────────
    case 'CDS': {
      // φ_f = 0.5 * (φ_P + φ_E)
      return 0.5 * (get(i) + get(i + 1));
    }

    // ── TVD schemes (slope-limiter form) ───────────────────────────
    case 'TVD-minmod':
    case 'TVD-vanLeer':
    case 'TVD-superbee': {
      // upwind cell U, downwind cell D, and further-upwind cell UU
      let phiU: number, phiD: number, phiUU: number;
      if (u_f >= 0) {
        phiU  = get(i);
        phiD  = get(i + 1);
        phiUU = get(i - 1);
      } else {
        phiU  = get(i + 1);
        phiD  = get(i);
        phiUU = get(i + 2);
      }

      const denom = phiD - phiU;
      const r = Math.abs(denom) < 1e-30
        ? 1.0
        : (phiU - phiUU) / denom;

      let psi: number;
      if (scheme === 'TVD-minmod') {
        psi = Math.max(0, minmod(1, r));
      } else if (scheme === 'TVD-vanLeer') {
        psi = vanLeer(r);
      } else {
        psi = superbee(r);
      }

      // φ_f = φ_U + 0.5 * ψ(r) * (φ_D − φ_U)
      return phiU + 0.5 * psi * (phiD - phiU);
    }

    default:
      return 0.5 * (get(i) + get(i + 1));
  }
}

/**
 * Return the discrete stencil coefficients (aW, aP, aE) for pure convection
 * with a uniform grid.
 *
 * These are shown in the StencilPanel so the user can inspect the matrix.
 */
export function convectionStencil(
  scheme: SchemeName,
  u: number,
  dx: number,
  dt: number
): { aW: number; aP: number; aE: number; description: string } {
  const c = u * dt / dx; // CFL number
  switch (scheme) {
    case 'UDS': {
      if (u >= 0) {
        // φ_P^{n+1} = φ_P^n − c (φ_P^n − φ_W^n)
        return {
          aW: c,
          aP: 1 - c,
          aE: 0,
          description: `UDS (u>0): φ_P^{n+1} = ${(1 - c).toFixed(3)} φ_P + ${c.toFixed(3)} φ_W`,
        };
      } else {
        return {
          aW: 0,
          aP: 1 + c,
          aE: -c,
          description: `UDS (u<0): φ_P^{n+1} = ${(1 + c).toFixed(3)} φ_P + ${(-c).toFixed(3)} φ_E`,
        };
      }
    }
    case 'CDS': {
      return {
        aW: c / 2,
        aP: 1,
        aE: -c / 2,
        description: `CDS: φ_P^{n+1} = φ_P − (c/2)(φ_E − φ_W)  [c=${c.toFixed(3)}]`,
      };
    }
    default:
      return { aW: 0, aP: 1, aE: 0, description: `${scheme}: coefficients depend on local gradient ratio r` };
  }
}

// ── Diffusive flux  ────────────────────────────────────────────────

/**
 * Compute the diffusive face flux contribution: Γ/dx * (φ_E − φ_P).
 * Returns the flux value (already ×Area for 1D, i.e. per unit area).
 */
export function diffusiveFaceFlux(
  phi: Float64Array,
  i: number,
  gamma: number,
  dx: number,
  N: number
): number {
  const phiP = phi[Math.max(0, Math.min(N - 1, i))];
  const phiE = phi[Math.max(0, Math.min(N - 1, i + 1))];
  return gamma / dx * (phiE - phiP);
}
