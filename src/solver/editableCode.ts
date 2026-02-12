/**
 * editableCode.ts — Default editable code blocks for the Monaco editor
 *
 * Each block is a self-contained function that the user can modify.
 * At runtime we compile it with `new Function(...)` inside a sandbox.
 */

export interface EditableBlock {
  id: string;
  title: string;
  description: string;
  defaultCode: string;
  /** The function signature that the user's code must export */
  signature: string;
}

export const editableBlocks: EditableBlock[] = [
  {
    id: 'faceInterpolation',
    title: 'Face Interpolation (φ_f)',
    description:
      'Berechne den Wert φ an der Zellfläche i+½.\n' +
      'Eingabe: phi (Array), i (linker Zellindex), u_f (Geschwindigkeit an Fläche), N (Zellanzahl).\n' +
      'Rückgabe: interpolierter Wert φ_f.',
    defaultCode: `// Upwind Differencing Scheme (UDS)
// φ_f = φ_P  wenn u ≥ 0  (Information kommt von links)
// φ_f = φ_E  wenn u < 0  (Information kommt von rechts)
function computeFaceValue(phi, i, u_f, N) {
  // Sichere Zugriffsfunktion (Randbegrenzung)
  const get = (idx) => phi[Math.max(0, Math.min(N - 1, idx))];

  if (u_f >= 0) {
    // Upwind: nimm den Wert der stromaufwärts liegenden Zelle
    return get(i);
  } else {
    // Downwind: nimm den Wert der stromabwärts liegenden Zelle
    return get(i + 1);
  }
}`,
    signature: 'computeFaceValue(phi, i, u_f, N) → number',
  },
  {
    id: 'fluxComputation',
    title: 'Konvektiver Flux (F)',
    description:
      'Berechne den konvektiven Flux F = u · φ_f an einer Zellfläche.\n' +
      'Eingabe: u (Geschwindigkeit), phiFace (interpolierter Flächenwert).\n' +
      'Rückgabe: Flux F.',
    defaultCode: `// Konvektiver Flux: F = u · φ_f
// Dies ist die Kern-Formel der Finite-Volumen-Methode:
// ∫ (u·φ) · n dA  ≈  u_f · φ_f · ΔA
function computeFlux(u, phiFace) {
  return u * phiFace;
}`,
    signature: 'computeFlux(u, phiFace) → number',
  },
  {
    id: 'timeStep',
    title: 'Zeitschritt-Update',
    description:
      'Berechne φ_P^{n+1} aus dem alten Wert und den Flüssen.\n' +
      'Eingabe: phiOld (alter Wert), fluxRight, fluxLeft, dt, dx.\n' +
      'Rückgabe: neuer Wert φ_P^{n+1}.',
    defaultCode: `// Expliziter Euler-Zeitschritt (konservative Form)
// φ_P^{n+1} = φ_P^n − (Δt/Δx) · (F_{i+½} − F_{i-½})
//
// Dies kommt direkt aus der Integralform:
// d/dt ∫_V φ dV = −∮ (u·φ) · n dA
function timeStepUpdate(phiOld, fluxRight, fluxLeft, dt, dx) {
  return phiOld - (dt / dx) * (fluxRight - fluxLeft);
}`,
    signature: 'timeStepUpdate(phiOld, fluxRight, fluxLeft, dt, dx) → number',
  },
  {
    id: 'diffusiveFlux',
    title: 'Diffusiver Flux',
    description:
      'Berechne den diffusiven Flux an einer Zellfläche.\n' +
      'Eingabe: phiP, phiE (Zellwerte), gamma (Diffusionskoeffizient), dx.\n' +
      'Rückgabe: diffusiver Flux.',
    defaultCode: `// Diffusiver Flux: F_diff = Γ · (φ_E − φ_P) / Δx
// Aus dem Fickschen Gesetz / Fourier:
// q = −Γ · ∇φ  →  F_diff = −Γ · (dφ/dx)_f ≈ Γ·(φ_E−φ_P)/Δx
function diffusiveFlux(phiP, phiE, gamma, dx) {
  return gamma * (phiE - phiP) / dx;
}`,
    signature: 'diffusiveFlux(phiP, phiE, gamma, dx) → number',
  },
];

/**
 * Validate and compile user code into a callable function.
 * Returns the function or an error message.
 */
export function compileUserCode(
  code: string,
  blockId: string
): { fn: Function | null; error: string | null } {
  try {
    // Extract function name from the block
    const block = editableBlocks.find(b => b.id === blockId);
    if (!block) return { fn: null, error: 'Block nicht gefunden.' };

    // Wrap in a module-like scope and return the function
    const wrapped = `
      "use strict";
      ${code}
      return typeof computeFaceValue !== 'undefined' ? computeFaceValue
           : typeof computeFlux !== 'undefined' ? computeFlux
           : typeof timeStepUpdate !== 'undefined' ? timeStepUpdate
           : typeof diffusiveFlux !== 'undefined' ? diffusiveFlux
           : null;
    `;

    const factory = new Function(wrapped);
    const fn = factory();

    if (typeof fn !== 'function') {
      return { fn: null, error: 'Keine gültige Funktion gefunden. Stelle sicher, dass deine Funktion den richtigen Namen hat.' };
    }

    // Basic smoke test
    if (blockId === 'faceInterpolation') {
      const testPhi = new Float64Array([0, 1, 2, 3, 4]);
      const result = fn(testPhi, 2, 1.0, 5);
      if (typeof result !== 'number' || !isFinite(result)) {
        return { fn: null, error: `Funktion gibt keinen gültigen Wert zurück (got: ${result})` };
      }
    }

    return { fn, error: null };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return { fn: null, error: `Kompilierungsfehler: ${msg}` };
  }
}
