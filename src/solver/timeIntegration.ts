/**
 * timeIntegration.ts — Explicit time-stepping methods (Euler, RK2)
 */

export type TimeScheme = 'euler' | 'rk2';

/**
 * Compute the maximum stable time step from the CFL constraint.
 *   dt ≤ CFL * dx / |u|
 * For convection-diffusion: dt ≤ min(CFL*dx/|u|, dx²/(2Γ))
 */
export function computeMaxDt(
  dx: number,
  u: number,
  cfl: number,
  gamma: number = 0
): number {
  let dt = cfl * dx / Math.max(Math.abs(u), 1e-30);
  if (gamma > 0) {
    const dtDiff = 0.4 * dx * dx / (2 * gamma);  // stability limit for diffusion
    dt = Math.min(dt, dtDiff);
  }
  return dt;
}

/** CFL number from given parameters */
export function cflNumber(u: number, dt: number, dx: number): number {
  return Math.abs(u) * dt / dx;
}

/** Peclet number (cell) */
export function pecletNumber(u: number, dx: number, gamma: number): number {
  if (gamma === 0) return Infinity;
  return Math.abs(u) * dx / gamma;
}
