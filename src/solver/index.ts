export { createGrid1D, createGrid2D } from './grid';
export type { Grid1D, Grid2D } from './grid';

export { createField1D, createField2D, idx2D, initField1D, initField2D } from './fields';
export type { ScalarField1D, ScalarField2D, InitialConditionType, IC1DParams, IC2DType } from './fields';

export { computeFaceValue, diffusiveFaceFlux, convectionStencil } from './schemes';
export type { SchemeName } from './schemes';

export { applyBC1D, defaultBC1D, lidDrivenCavityBC } from './boundaryConditions';
export type { BC1D, BC1DType, BC2D, BC2DType } from './boundaryConditions';

export { computeMaxDt, cflNumber, pecletNumber } from './timeIntegration';
export type { TimeScheme } from './timeIntegration';

export {
  step1DConvection, step1DConvectionDiffusion,
  runSimulation1D, step2DScalarTransport
} from './solvers';
export type { SolverResult1D, SimulationHistory1D, SimConfig1D, SimConfig2D } from './solvers';

export { l2Norm, lInfNorm, totalMass, fieldIsValid, fieldMax } from './diagnostics';

export { editableBlocks, compileUserCode } from './editableCode';
export type { EditableBlock } from './editableCode';

export { presets1D } from './presets';
export type { Preset1D } from './presets';
