/**
 * grid.ts — Structured grid generation for 1D and 2D finite-volume domains
 *
 * A cell-centered FV grid stores:
 *   - cell centres  x_P  (and y_P in 2D)
 *   - face positions x_f  (and y_f in 2D)
 *   - cell widths    dx   (and dy in 2D)
 *
 * Convention (1D, N cells):
 *   face:  |---f0---|---f1---|--- ... ---|---fN---|
 *   cell:     P0       P1        ...        P(N-1)
 *
 *   x_f has length N+1, x_P has length N, dx has length N.
 */

export interface Grid1D {
  N: number;        // number of cells
  L: number;        // domain length
  dx: number;       // uniform cell width  (L / N)
  xFace: number[];  // face positions,  length N+1
  xCell: number[];  // cell-centre positions, length N
}

export interface Grid2D {
  Nx: number;
  Ny: number;
  Lx: number;
  Ly: number;
  dx: number;
  dy: number;
  xFace: number[];
  yFace: number[];
  xCell: number[];
  yCell: number[];
}

/** Create a uniform 1D cell-centred grid */
export function createGrid1D(N: number, L: number): Grid1D {
  const dx = L / N;
  const xFace = Array.from({ length: N + 1 }, (_, i) => i * dx);
  const xCell = Array.from({ length: N }, (_, i) => (i + 0.5) * dx);
  return { N, L, dx, xFace, xCell };
}

/** Create a uniform 2D cell-centred grid */
export function createGrid2D(Nx: number, Ny: number, Lx: number, Ly: number): Grid2D {
  const dx = Lx / Nx;
  const dy = Ly / Ny;
  const xFace = Array.from({ length: Nx + 1 }, (_, i) => i * dx);
  const yFace = Array.from({ length: Ny + 1 }, (_, j) => j * dy);
  const xCell = Array.from({ length: Nx }, (_, i) => (i + 0.5) * dx);
  const yCell = Array.from({ length: Ny }, (_, j) => (j + 0.5) * dy);
  return { Nx, Ny, Lx, Ly, dx, dy, xFace, yFace, xCell, yCell };
}
