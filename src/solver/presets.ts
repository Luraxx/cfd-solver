/**
 * presets.ts — Ready-made configurations for learning scenarios
 */

import { SchemeName } from './schemes';
import { IC1DParams } from './fields';
import { BC1D } from './boundaryConditions';

export interface Preset1D {
  name: string;
  description: string;
  N: number;
  L: number;
  u: number;
  gamma: number;
  cfl: number;
  scheme: SchemeName;
  ic: IC1DParams;
  bc: BC1D;
  nSteps: number;
  snapshotInterval: number;
}

const periodicBC: BC1D = {
  left: { type: 'periodic' },
  right: { type: 'periodic' },
};

const fixedBC: BC1D = {
  left: { type: 'fixed', value: 1 },
  right: { type: 'fixed', value: 0 },
};

export const presets1D: Preset1D[] = [
  {
    name: 'Step – UDS – stable',
    description: 'Sprungfunktion mit Upwind, CFL=0.5. Zeigt numerische Diffusion.',
    N: 100,
    L: 1.0,
    u: 1.0,
    gamma: 0,
    cfl: 0.5,
    scheme: 'UDS',
    ic: { type: 'step', stepPos: 0.2 },
    bc: periodicBC,
    nSteps: 100,
    snapshotInterval: 10,
  },
  {
    name: 'Step – CDS – Oszillationen',
    description: 'Sprungfunktion mit Central Differencing. Zeigt Oszillationen (2Δx-Wellen).',
    N: 100,
    L: 1.0,
    u: 1.0,
    gamma: 0,
    cfl: 0.5,
    scheme: 'CDS',
    ic: { type: 'step', stepPos: 0.2 },
    bc: periodicBC,
    nSteps: 80,
    snapshotInterval: 10,
  },
  {
    name: 'Gauss – UDS vs CDS',
    description: 'Gaußpuls: UDS verschmiert, CDS schärfer aber instabiler.',
    N: 200,
    L: 1.0,
    u: 1.0,
    gamma: 0,
    cfl: 0.8,
    scheme: 'UDS',
    ic: { type: 'gaussian', gaussCenter: 0.3, gaussSigma: 0.05 },
    bc: periodicBC,
    nSteps: 150,
    snapshotInterval: 15,
  },
  {
    name: 'Sinus – CFL > 1 (instabil!)',
    description: 'Sinuswelle mit CFL=1.2 → Lösung explodiert. Zeigt CFL-Bedingung.',
    N: 80,
    L: 1.0,
    u: 1.0,
    gamma: 0,
    cfl: 1.2,
    scheme: 'UDS',
    ic: { type: 'sine' },
    bc: periodicBC,
    nSteps: 100,
    snapshotInterval: 5,
  },
  {
    name: 'Konvektion-Diffusion – Pe hoch',
    description: 'Konvektion dominiert (Pe ≫ 1). UDS stabil, CDS oszilliert.',
    N: 50,
    L: 1.0,
    u: 1.0,
    gamma: 0.001,
    cfl: 0.4,
    scheme: 'UDS',
    ic: { type: 'step', stepPos: 0.3 },
    bc: fixedBC,
    nSteps: 200,
    snapshotInterval: 20,
  },
  {
    name: 'Konvektion-Diffusion – Pe niedrig',
    description: 'Diffusion dominiert (Pe ≈ 1). Lösung wird glatt.',
    N: 50,
    L: 1.0,
    u: 0.1,
    gamma: 0.01,
    cfl: 0.4,
    scheme: 'CDS',
    ic: { type: 'step', stepPos: 0.3 },
    bc: fixedBC,
    nSteps: 500,
    snapshotInterval: 50,
  },
  {
    name: 'TVD minmod – Sprung',
    description: 'TVD-Schema begrenzt Oszillationen und bewahrt Schärfe.',
    N: 100,
    L: 1.0,
    u: 1.0,
    gamma: 0,
    cfl: 0.5,
    scheme: 'TVD-minmod',
    ic: { type: 'step', stepPos: 0.2 },
    bc: periodicBC,
    nSteps: 100,
    snapshotInterval: 10,
  },
  {
    name: 'Dreieck – Scheme-Vergleich',
    description: 'Dreieckpuls: Vergleiche UDS, CDS, TVD nebeneinander.',
    N: 150,
    L: 1.0,
    u: 1.0,
    gamma: 0,
    cfl: 0.5,
    scheme: 'UDS',
    ic: { type: 'triangle' },
    bc: periodicBC,
    nSteps: 120,
    snapshotInterval: 12,
  },
];
