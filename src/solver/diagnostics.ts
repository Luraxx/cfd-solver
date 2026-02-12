/**
 * diagnostics.ts — Error norms, conservation checks, etc.
 */

/** L2 norm of (phi - ref) */
export function l2Norm(phi: Float64Array, ref: Float64Array): number {
  let sum = 0;
  for (let i = 0; i < phi.length; i++) {
    const d = phi[i] - ref[i];
    sum += d * d;
  }
  return Math.sqrt(sum / phi.length);
}

/** L∞ norm */
export function lInfNorm(phi: Float64Array, ref: Float64Array): number {
  let mx = 0;
  for (let i = 0; i < phi.length; i++) {
    mx = Math.max(mx, Math.abs(phi[i] - ref[i]));
  }
  return mx;
}

/** Total (integral) of φ over uniform grid: ∑ φ_i * dx */
export function totalMass(phi: Float64Array, dx: number): number {
  let sum = 0;
  for (let i = 0; i < phi.length; i++) sum += phi[i];
  return sum * dx;
}

/** Check for NaN / Inf in field */
export function fieldIsValid(phi: Float64Array): boolean {
  for (let i = 0; i < phi.length; i++) {
    if (!isFinite(phi[i])) return false;
  }
  return true;
}

/** Maximum absolute value in field */
export function fieldMax(phi: Float64Array): number {
  let mx = 0;
  for (let i = 0; i < phi.length; i++) mx = Math.max(mx, Math.abs(phi[i]));
  return mx;
}
