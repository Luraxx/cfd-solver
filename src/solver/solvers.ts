/**
 * solvers.ts — Time-stepping solvers for 1D and 2D scalar transport
 *
 * Milestone A: 1D pure convection  (dφ/dt + u dφ/dx = 0)
 * Milestone B: 1D convection-diffusion (dφ/dt + u dφ/dx = Γ d²φ/dx²)
 * Milestone C: 2D scalar transport
 */

import { Grid1D, Grid2D } from './grid';
import { ScalarField1D, ScalarField2D, idx2D, createField1D, createField2D } from './fields';
import { SchemeName, computeFaceValue, diffusiveFaceFlux } from './schemes';
import { BC1D, applyBC1D } from './boundaryConditions';
import { fieldIsValid } from './diagnostics';

// ── Result types ───────────────────────────────────────────────────

export interface SolverResult1D {
  phi: ScalarField1D;
  time: number;
  step: number;
  diverged: boolean;
}

export interface SimulationHistory1D {
  snapshots: { phi: Float64Array; time: number }[];
  finalStep: number;
  diverged: boolean;
}

// ── 1D Convection (Milestone A) ────────────────────────────────────

/**
 * One explicit Euler step for 1D convection:
 *   φ_i^{n+1} = φ_i^n − (dt/dx) * [F_{i+1/2} − F_{i-1/2}]
 *   where F_{i+1/2} = u * φ_f(i+1/2)       (convective flux)
 */
export function step1DConvection(
  phi: ScalarField1D,
  grid: Grid1D,
  u: number,
  dt: number,
  scheme: SchemeName,
  bc: BC1D
): ScalarField1D {
  const N = grid.N;
  const dx = grid.dx;
  const phiNew = createField1D(N);

  for (let i = 0; i < N; i++) {
    // Flux at face i+1/2
    const phiFaceR = computeFaceValue(phi, i, u, scheme, N);
    const fluxR = u * phiFaceR;

    // Flux at face i-1/2
    const iLeft = bc.left.type === 'periodic' && i === 0 ? N - 1 : i - 1;
    const phiFaceL = computeFaceValue(phi, iLeft, u, scheme, N);
    const fluxL = u * phiFaceL;

    // Conservative update: dφ/dt = -(1/dx)(F_R − F_L)
    phiNew[i] = phi[i] - (dt / dx) * (fluxR - fluxL);
  }

  applyBC1D(phiNew, bc);
  return phiNew;
}

// ── 1D Convection-Diffusion (Milestone B) ──────────────────────────

export function step1DConvectionDiffusion(
  phi: ScalarField1D,
  grid: Grid1D,
  u: number,
  dt: number,
  gamma: number,
  scheme: SchemeName,
  bc: BC1D
): ScalarField1D {
  const N = grid.N;
  const dx = grid.dx;
  const phiNew = createField1D(N);

  for (let i = 0; i < N; i++) {
    // Convective fluxes
    const phiFaceR = computeFaceValue(phi, i, u, scheme, N);
    const convFluxR = u * phiFaceR;

    const iLeft = bc.left.type === 'periodic' && i === 0 ? N - 1 : i - 1;
    const phiFaceL = computeFaceValue(phi, iLeft, u, scheme, N);
    const convFluxL = u * phiFaceL;

    // Diffusive fluxes: Γ/dx * (φ_E − φ_P) at right face
    const diffFluxR = diffusiveFaceFlux(phi, i, gamma, dx, N);
    // Γ/dx * (φ_P − φ_W) at left face
    const diffFluxL = diffusiveFaceFlux(phi, iLeft, gamma, dx, N);

    // Conservative update: dφ/dt = -(1/dx)(Fconv_R − Fconv_L) + (1/dx)(Fdiff_R − Fdiff_L)
    phiNew[i] = phi[i]
      - (dt / dx) * (convFluxR - convFluxL)
      + (dt / dx) * (diffFluxR - diffFluxL);
  }

  applyBC1D(phiNew, bc);
  return phiNew;
}

// ── Run full simulation ────────────────────────────────────────────

export interface SimConfig1D {
  grid: Grid1D;
  u: number;
  dt: number;
  gamma: number;
  scheme: SchemeName;
  bc: BC1D;
  nSteps: number;
  snapshotInterval: number; // save every N steps
}

export function runSimulation1D(
  phi0: ScalarField1D,
  config: SimConfig1D
): SimulationHistory1D {
  const snapshots: { phi: Float64Array; time: number }[] = [];
  let phi = new Float64Array(phi0);
  let time = 0;
  let diverged = false;

  snapshots.push({ phi: new Float64Array(phi), time: 0 });

  for (let step = 1; step <= config.nSteps; step++) {
    if (config.gamma > 0) {
      phi = step1DConvectionDiffusion(
        phi, config.grid, config.u, config.dt, config.gamma, config.scheme, config.bc
      );
    } else {
      phi = step1DConvection(
        phi, config.grid, config.u, config.dt, config.scheme, config.bc
      );
    }
    time += config.dt;

    if (!fieldIsValid(phi)) {
      diverged = true;
      snapshots.push({ phi: new Float64Array(phi), time });
      return { snapshots, finalStep: step, diverged };
    }

    if (step % config.snapshotInterval === 0 || step === config.nSteps) {
      snapshots.push({ phi: new Float64Array(phi), time });
    }
  }

  return { snapshots, finalStep: config.nSteps, diverged };
}

// ── 2D Scalar Transport (Milestone C) ──────────────────────────────

export interface SimConfig2D {
  grid: Grid2D;
  uField: Float64Array; // u velocity at each cell
  vField: Float64Array; // v velocity at each cell
  dt: number;
  gamma: number;
  scheme: SchemeName;
  nSteps: number;
  snapshotInterval: number;
}

export function step2DScalarTransport(
  phi: ScalarField2D,
  config: SimConfig2D
): ScalarField2D {
  const { Nx, Ny, dx, dy } = config.grid;
  const phiNew = createField2D(Nx, Ny);

  for (let j = 1; j < Ny - 1; j++) {
    for (let i = 1; i < Nx - 1; i++) {
      const idx = idx2D(i, j, Nx);
      const u = config.uField[idx];
      const v = config.vField[idx];

      // X-direction convective fluxes (simplified using row data)
      const phiE = phi[idx2D(i + 1, j, Nx)];
      const phiW = phi[idx2D(i - 1, j, Nx)];
      const phiN = phi[idx2D(i, j + 1, Nx)];
      const phiS = phi[idx2D(i, j - 1, Nx)];
      const phiP = phi[idx];

      // UDS for 2D (simple)
      let convX: number, convY: number;
      if (config.scheme === 'UDS') {
        convX = u >= 0
          ? u * (phiP - phiW) / dx
          : u * (phiE - phiP) / dx;
        convY = v >= 0
          ? v * (phiP - phiS) / dy
          : v * (phiN - phiP) / dy;
      } else {
        // CDS
        convX = u * (phiE - phiW) / (2 * dx);
        convY = v * (phiN - phiS) / (2 * dy);
      }

      // Diffusion
      const diffX = config.gamma * (phiE - 2 * phiP + phiW) / (dx * dx);
      const diffY = config.gamma * (phiN - 2 * phiP + phiS) / (dy * dy);

      phiNew[idx] = phiP + config.dt * (-convX - convY + diffX + diffY);
    }
  }

  // Copy boundary values
  for (let i = 0; i < Nx; i++) {
    phiNew[idx2D(i, 0, Nx)] = phi[idx2D(i, 0, Nx)];
    phiNew[idx2D(i, Ny - 1, Nx)] = phi[idx2D(i, Ny - 1, Nx)];
  }
  for (let j = 0; j < Ny; j++) {
    phiNew[idx2D(0, j, Nx)] = phi[idx2D(0, j, Nx)];
    phiNew[idx2D(Nx - 1, j, Nx)] = phi[idx2D(Nx - 1, j, Nx)];
  }

  return phiNew;
}
