/**
 * curriculum.ts — The complete learning tree for CFD
 *
 * Each node is a lesson or category. The tree defines the path
 * from zero knowledge to 2D incompressible flow.
 */

export interface LessonNode {
  id: string;
  title: string;
  shortTitle: string;         // for tree view (compact)
  icon: string;
  description: string;
  /** 'category' = folder, 'lesson' = interactive leaf */
  type: 'category' | 'lesson';
  children?: LessonNode[];
  /** Which interactive sandbox to show (maps to SimMode) */
  simMode?: SimMode;
  /** Whether this lesson is implemented yet */
  available: boolean;
}

export type SimMode =
  | 'none'
  | 'fd-1d-heat'
  | 'fd-stencil-explorer'
  | 'fv-1d-convection'
  | 'fv-1d-convection-diffusion'
  | 'fv-scheme-compare'
  | 'fv-tvd'
  | 'stability-cfl'
  | 'stability-peclet'
  | '2d-scalar'
  | '2d-navier-stokes'
  | 'algo-iterative'
  | 'comp-sod-tube'
  | 'comp-normal-shock'
  | 'turb-energy-spectrum'
  | 'turb-channel-loglaw'
  | 'twophase-vof-1d';

// ── The full curriculum tree ───────────────────────────────────────

export const curriculum: LessonNode = {
  id: 'root',
  title: 'CFD Grundlagen',
  shortTitle: 'CFD',
  icon: 'wave',
  description: 'Von Null auf CFD — Schritt für Schritt',
  type: 'category',
  available: true,
  children: [
    // ═══════════════════════════════════════════════════════════════
    // 1. GRUNDLAGEN
    // ═══════════════════════════════════════════════════════════════
    {
      id: 'basics',
      title: 'Grundlagen',
      shortTitle: 'Grundlagen',
      icon: 'book',
      description: 'Was ist CFD und warum brauchen wir numerische Methoden?',
      type: 'category',
      available: true,
      children: [
        {
          id: 'basics-what-is-cfd',
          title: 'Was ist CFD?',
          shortTitle: 'Was ist CFD?',
          icon: 'microscope',
          description: 'Überblick: Warum können wir die meisten Strömungen nicht analytisch lösen? Was macht der Computer anders?',
          type: 'lesson',
          simMode: 'none',
          available: true,
        },
        {
          id: 'basics-pdes',
          title: 'Transportgleichungen (PDEs)',
          shortTitle: 'PDEs',
          icon: 'compass',
          description: 'Konvektion, Diffusion, Quellen — die drei Grundbausteine jeder Transportgleichung.',
          type: 'lesson',
          simMode: 'none',
          available: true,
        },
        {
          id: 'basics-discretization-idea',
          title: 'Idee der Diskretisierung',
          shortTitle: 'Diskretisierung',
          icon: 'grid-square',
          description: 'Vom Kontinuum zum Gitter: Wie wird aus einer PDE ein Gleichungssystem?',
          type: 'lesson',
          simMode: 'none',
          available: true,
        },
        {
          id: 'basics-mesh',
          title: 'Gitter & Geometrie',
          shortTitle: 'Gitter',
          icon: 'building',
          description: 'Zellen, Flächen, Knoten — wie ein Rechengitter aufgebaut ist und was Δx bedeutet.',
          type: 'lesson',
          simMode: 'fd-stencil-explorer',
          available: true,
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════
    // 2. FINITE-DIFFERENZEN-METHODE (FDM)
    // ═══════════════════════════════════════════════════════════════
    {
      id: 'fdm',
      title: 'Finite-Differenzen-Methode (FDM)',
      shortTitle: 'FDM',
      icon: 'ruler',
      description: 'Die einfachste Methode: Ableitungen durch Differenzenquotienten ersetzen.',
      type: 'category',
      available: true,
      children: [
        {
          id: 'fdm-taylor',
          title: 'Taylor-Reihe & Fehlerordnung',
          shortTitle: 'Taylor',
          icon: 'hash',
          description: 'Woher kommen Vorwärts-, Rückwärts- und zentrale Differenzen? Welche Ordnung haben sie?',
          type: 'lesson',
          simMode: 'none',
          available: true,
        },
        {
          id: 'fdm-stencils',
          title: 'FD-Stencils interaktiv',
          shortTitle: 'Stencils',
          icon: 'hexagon',
          description: 'Experimentiere mit Vorwärts-, Rückwärts- und zentralen Differenzen. Sieh den Stencil und die Fehlerordnung.',
          type: 'lesson',
          simMode: 'fd-stencil-explorer',
          available: true,
        },
        {
          id: 'fdm-1d-heat',
          title: '1D Wärmeleitung (FDM)',
          shortTitle: '1D Wärme',
          icon: 'flame',
          description: 'Dein erster Solver! Löse ∂T/∂t = α ∂²T/∂x² mit explizitem Euler und FD.',
          type: 'lesson',
          simMode: 'fd-1d-heat',
          available: true,
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════
    // 3. FINITE-VOLUMEN-METHODE (FVM)
    // ═══════════════════════════════════════════════════════════════
    {
      id: 'fvm',
      title: 'Finite-Volumen-Methode (FVM)',
      shortTitle: 'FVM',
      icon: 'box',
      description: 'Die Standardmethode in CFD: Integration über Kontrollvolumen, Flüsse über Flächen.',
      type: 'category',
      available: true,
      children: [
        {
          id: 'fvm-concept',
          title: 'Kontrollvolumen & Flüsse',
          shortTitle: 'KV & Flux',
          icon: 'box',
          description: 'Was ist ein Kontrollvolumen? Wie entsteht die Integralform? Was sind Flüsse?',
          type: 'lesson',
          simMode: 'none',
          available: true,
        },
        {
          id: 'fvm-face-interpolation',
          title: 'Face-Interpolation',
          shortTitle: 'Face-Interp.',
          icon: 'arrows-h',
          description: 'Zellwerte sind bekannt — aber wir brauchen den Wert an der Fläche. Hier kommt das Schema ins Spiel.',
          type: 'lesson',
          simMode: 'fv-1d-convection',
          available: true,
        },
        {
          id: 'fvm-1d-convection',
          title: '1D Konvektion (FVM)',
          shortTitle: '1D Konv.',
          icon: 'arrow-right',
          description: 'Dein erster FVM-Solver: ∂φ/∂t + u·∂φ/∂x = 0 mit UDS und CDS.',
          type: 'lesson',
          simMode: 'fv-1d-convection',
          available: true,
        },
        {
          id: 'fvm-fvm-vs-fdm',
          title: 'FVM vs FDM — Vergleich',
          shortTitle: 'FVM vs FDM',
          icon: 'scale',
          description: 'Wann FVM, wann FDM? Konservativität, Gitterflexibilität, Stencil-Unterschiede.',
          type: 'lesson',
          simMode: 'none',
          available: true,
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════
    // 4. SCHEMATA IM DETAIL
    // ═══════════════════════════════════════════════════════════════
    {
      id: 'schemes',
      title: 'Diskretisierungsschemata',
      shortTitle: 'Schemata',
      icon: 'zap',
      description: 'UDS, CDS, TVD — wie sich die Wahl des Schemas auf Genauigkeit und Stabilität auswirkt.',
      type: 'category',
      available: true,
      children: [
        {
          id: 'schemes-uds',
          title: 'Upwind (UDS)',
          shortTitle: 'UDS',
          icon: 'arrow-left',
          description: '1. Ordnung, immer stabil, aber numerisch diffusiv. Warum?',
          type: 'lesson',
          simMode: 'fv-1d-convection',
          available: true,
        },
        {
          id: 'schemes-cds',
          title: 'Central (CDS)',
          shortTitle: 'CDS',
          icon: 'arrows-h',
          description: '2. Ordnung, aber Oszillationen bei hohem Pe. Wann geht das schief?',
          type: 'lesson',
          simMode: 'fv-1d-convection',
          available: true,
        },
        {
          id: 'schemes-tvd',
          title: 'TVD-Schemata',
          shortTitle: 'TVD',
          icon: 'shield',
          description: 'Flux-Limiter (minmod, van Leer, superbee) — das Beste aus beiden Welten.',
          type: 'lesson',
          simMode: 'fv-tvd',
          available: true,
        },
        {
          id: 'schemes-compare',
          title: 'Schema-Vergleich',
          shortTitle: 'Vergleich',
          icon: 'bar-chart',
          description: 'Alle Schemata nebeneinander mit gleicher IC. Wo verschmiert UDS? Wo oszilliert CDS?',
          type: 'lesson',
          simMode: 'fv-scheme-compare',
          available: true,
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════
    // 5. STABILITÄT & KENNZAHLEN
    // ═══════════════════════════════════════════════════════════════
    {
      id: 'stability',
      title: 'Stabilität & Kennzahlen',
      shortTitle: 'Stabilität',
      icon: 'alert-triangle',
      description: 'CFL, Peclet, Von-Neumann — wann explodiert die Lösung und warum?',
      type: 'category',
      available: true,
      children: [
        {
          id: 'stability-cfl',
          title: 'CFL-Bedingung',
          shortTitle: 'CFL',
          icon: 'clock',
          description: 'CFL = |u|Δt/Δx ≤ 1. Was passiert wenn CFL > 1? Interaktiv erleben.',
          type: 'lesson',
          simMode: 'stability-cfl',
          available: true,
        },
        {
          id: 'stability-peclet',
          title: 'Peclet-Zahl',
          shortTitle: 'Peclet',
          icon: 'thermometer',
          description: 'Pe = |u|Δx/Γ. Konvektion vs Diffusion — wann dominiert was?',
          type: 'lesson',
          simMode: 'stability-peclet',
          available: true,
        },
        {
          id: 'stability-vonneumann',
          title: 'Von-Neumann-Analyse',
          shortTitle: 'Von-Neumann',
          icon: 'trending-down',
          description: 'Warum ist CFL ≤ 1 die Stabilitätsgrenze? Fourier-Moden und Verstärkungsfaktor.',
          type: 'lesson',
          simMode: 'none',
          available: true,
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════
    // 6. KONVEKTION-DIFFUSION
    // ═══════════════════════════════════════════════════════════════
    {
      id: 'convdiff',
      title: 'Konvektion-Diffusion',
      shortTitle: 'Konv.-Diff.',
      icon: 'refresh',
      description: 'Konvektion + Diffusion zusammen — das Standardproblem der numerischen Strömungsmechanik.',
      type: 'category',
      available: true,
      children: [
        {
          id: 'convdiff-1d',
          title: '1D Konvektion-Diffusion',
          shortTitle: '1D Konv-Diff',
          icon: 'arrow-right-fire',
          description: '∂φ/∂t + u·∂φ/∂x = Γ·∂²φ/∂x². Konvektion und Diffusion im Wettbewerb.',
          type: 'lesson',
          simMode: 'fv-1d-convection-diffusion',
          available: true,
        },
        {
          id: 'convdiff-peclet-effect',
          title: 'Einfluss der Peclet-Zahl',
          shortTitle: 'Pe-Effekt',
          icon: 'bar-chart',
          description: 'Pe hoch → Konvektion dominiert. Pe niedrig → Diffusion glättet alles.',
          type: 'lesson',
          simMode: 'stability-peclet',
          available: true,
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════
    // 7. 2D ERWEITERUNG
    // ═══════════════════════════════════════════════════════════════
    {
      id: '2d',
      title: '2D Erweiterung',
      shortTitle: '2D',
      icon: 'map',
      description: 'Von 1D auf 2D: Strukturierte Gitter, Heatmaps, Vektorfelder.',
      type: 'category',
      available: true,
      children: [
        {
          id: '2d-grid',
          title: '2D Strukturiertes Gitter',
          shortTitle: '2D Gitter',
          icon: 'building',
          description: 'Wie baut man ein 2D-Gitter? i,j-Indizierung, Nachbarn, Flächen.',
          type: 'lesson',
          simMode: 'none',
          available: true,
        },
        {
          id: '2d-scalar',
          title: '2D Skalartransport',
          shortTitle: '2D Skalar',
          icon: 'map',
          description: 'Ein Skalar (z.B. Temperatur) wird durch ein vorgegebenes Geschwindigkeitsfeld transportiert.',
          type: 'lesson',
          simMode: '2d-scalar',
          available: true,
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════
    // 8. INKOMPRESSIBLE STRÖMUNG (Roadmap)
    // ═══════════════════════════════════════════════════════════════
    {
      id: 'incompressible',
      title: 'Inkompressible Strömung',
      shortTitle: 'Inkompressibel',
      icon: 'spiral',
      description: 'Navier-Stokes, Druck-Geschwindigkeits-Kopplung, SIMPLE.',
      type: 'category',
      available: true,
      children: [
        {
          id: 'incomp-ns',
          title: 'Navier-Stokes Gleichungen',
          shortTitle: 'N-S',
          icon: 'scroll',
          description: 'Die berühmtesten Gleichungen der Strömungsmechanik.',
          type: 'lesson',
          simMode: 'none',
          available: true,
        },
        {
          id: 'incomp-simple',
          title: 'SIMPLE-Algorithmus',
          shortTitle: 'SIMPLE',
          icon: 'repeat',
          description: 'Druck-Korrektur: Wie koppelt man u, v und p?',
          type: 'lesson',
          simMode: '2d-navier-stokes',
          available: true,
        },
        {
          id: 'incomp-cavity',
          title: 'Lid-Driven Cavity',
          shortTitle: 'Cavity',
          icon: 'spiral',
          description: 'Der Klassiker: Strömung in einem Hohlraum mit bewegtem Deckel.',
          type: 'lesson',
          simMode: '2d-navier-stokes',
          available: true,
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════
    // 9. LÖSUNGSALGORITHMEN
    // ═══════════════════════════════════════════════════════════════
    {
      id: 'algorithms',
      title: 'Lösungsalgorithmen',
      shortTitle: 'Algorithmen',
      icon: 'cpu',
      description: 'Lineare Gleichungssysteme, iterative Löser, Multigrid und Unterrelaxation.',
      type: 'category',
      available: true,
      children: [
        {
          id: 'algo-linear-systems',
          title: 'Lineare Gleichungssysteme in CFD',
          shortTitle: 'Lin. Systeme',
          icon: 'grid-square',
          description: 'Wie aus diskretisierten Gleichungen das System Ax = b entsteht.',
          type: 'lesson',
          simMode: 'none',
          available: true,
        },
        {
          id: 'algo-iterative',
          title: 'Jacobi & Gauss-Seidel',
          shortTitle: 'Jacobi/GS',
          icon: 'repeat',
          description: 'Die einfachsten iterativen Löser: Jacobi und Gauss-Seidel. Konvergenzvergleich.',
          type: 'lesson',
          simMode: 'algo-iterative',
          available: true,
        },
        {
          id: 'algo-multigrid',
          title: 'Multigrid-Methode',
          shortTitle: 'Multigrid',
          icon: 'layers',
          description: 'Warum ist Multigrid so schnell? V-Zyklus, Restriktion, Prolongation.',
          type: 'lesson',
          simMode: 'none',
          available: true,
        },
        {
          id: 'algo-underrelaxation',
          title: 'Unterrelaxation & Konvergenz',
          shortTitle: 'Relaxation',
          icon: 'trending-down',
          description: 'Unterrelaxation zur Stabilisierung, Residuenmonitoring, Konvergenzkriterien.',
          type: 'lesson',
          simMode: 'none',
          available: true,
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════
    // 10. KOMPRESSIBLE STRÖMUNGEN
    // ═══════════════════════════════════════════════════════════════
    {
      id: 'compressible',
      title: 'Kompressible Strömungen',
      shortTitle: 'Kompressibel',
      icon: 'zap',
      description: 'Euler-Gleichungen, Mach-Zahl, Stoßwellen, Riemann-Löser.',
      type: 'category',
      available: true,
      children: [
        {
          id: 'comp-euler',
          title: 'Euler-Gleichungen',
          shortTitle: 'Euler',
          icon: 'scroll',
          description: 'Das hyperbole Erhaltungssystem: Masse, Impuls, Energie ohne Viskosität.',
          type: 'lesson',
          simMode: 'comp-normal-shock',
          available: true,
        },
        {
          id: 'comp-riemann',
          title: 'Riemann-Problem',
          shortTitle: 'Riemann',
          icon: 'arrows-h',
          description: 'Das fundamentale Baustein: Zwei Zustände, eine Diskontinuität.',
          type: 'lesson',
          simMode: 'none',
          available: true,
        },
        {
          id: 'comp-godunov',
          title: 'Godunov & Riemann-Löser',
          shortTitle: 'Godunov',
          icon: 'shield',
          description: 'Godunovs Methode, Roe-Löser, HLL/HLLC — Flussberechnung an Zellflächen.',
          type: 'lesson',
          simMode: 'none',
          available: true,
        },
        {
          id: 'comp-shocktube',
          title: 'Sod Shock Tube',
          shortTitle: 'Shock Tube',
          icon: 'explosion',
          description: 'Der berühmte Testfall: Membranbruch in einem Rohr mit Druckunterschied.',
          type: 'lesson',
          simMode: 'comp-sod-tube',
          available: true,
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════
    // 11. TURBULENZ
    // ═══════════════════════════════════════════════════════════════
    {
      id: 'turbulence',
      title: 'Turbulenzmodellierung',
      shortTitle: 'Turbulenz',
      icon: 'wind',
      description: 'Von RANS über LES bis DNS — wie modelliert man Turbulenz?',
      type: 'category',
      available: true,
      children: [
        {
          id: 'turb-intro',
          title: 'Was ist Turbulenz?',
          shortTitle: 'Einführung',
          icon: 'wind',
          description: 'Charakteristik turbulenter Strömung, Energiekaskade, Kolmogorov-Skalen.',
          type: 'lesson',
          simMode: 'turb-energy-spectrum',
          available: true,
        },
        {
          id: 'turb-rans',
          title: 'RANS & Reynolds-Mittelung',
          shortTitle: 'RANS',
          icon: 'bar-chart',
          description: 'Reynolds-Zerlegung, gemittelte Gleichungen, Reynolds-Spannungen.',
          type: 'lesson',
          simMode: 'none',
          available: true,
        },
        {
          id: 'turb-ke',
          title: 'k-ε Modell',
          shortTitle: 'k-ε',
          icon: 'flame',
          description: 'Das meistverwendete Turbulenzmodell: zwei Gleichungen für k und ε.',
          type: 'lesson',
          simMode: 'turb-channel-loglaw',
          available: true,
        },
        {
          id: 'turb-kw-sst',
          title: 'k-ω SST Modell',
          shortTitle: 'k-ω SST',
          icon: 'shield',
          description: 'Menters SST — der Industriestandard. k-ω + k-ε geblended.',
          type: 'lesson',
          simMode: 'none',
          available: true,
        },
        {
          id: 'turb-les',
          title: 'Large Eddy Simulation (LES)',
          shortTitle: 'LES',
          icon: 'spiral',
          description: 'Große Wirbel berechnen, kleine modellieren. Smagorinsky, WALE, dynamische Modelle.',
          type: 'lesson',
          simMode: 'turb-energy-spectrum',
          available: true,
        },
        {
          id: 'turb-dns',
          title: 'Direkte Numerische Simulation',
          shortTitle: 'DNS',
          icon: 'microscope',
          description: 'Alle Skalen auflösen — warum das extrem teuer ist.',
          type: 'lesson',
          simMode: 'none',
          available: true,
        },
        {
          id: 'turb-wall',
          title: 'Wandbehandlung & y+',
          shortTitle: 'y+ & Wand',
          icon: 'thermometer',
          description: 'Logarithmisches Wandgesetz, y+, Wandfunktionen vs. Wandauflösung.',
          type: 'lesson',
          simMode: 'turb-channel-loglaw',
          available: true,
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════
    // 12. ZWEIPHASENSTRÖMUNGEN
    // ═══════════════════════════════════════════════════════════════
    {
      id: 'twophase',
      title: 'Zweiphasenströmungen',
      shortTitle: 'Zweiphasen',
      icon: 'droplet',
      description: 'VOF, Level-Set, Oberflächenspannung — Simulation von Phasengrenzen.',
      type: 'category',
      available: true,
      children: [
        {
          id: 'twophase-intro',
          title: 'Einführung Zweiphasen',
          shortTitle: 'Einführung',
          icon: 'droplet',
          description: 'Was sind Zweiphasenströmungen? Euler-Euler vs. Euler-Lagrange.',
          type: 'lesson',
          simMode: 'none',
          available: true,
        },
        {
          id: 'twophase-vof',
          title: 'Volume of Fluid (VOF)',
          shortTitle: 'VOF',
          icon: 'box',
          description: 'Volumenfüllfaktor α — die meistverwendete Methode für freie Oberflächen.',
          type: 'lesson',
          simMode: 'twophase-vof-1d',
          available: true,
        },
        {
          id: 'twophase-levelset',
          title: 'Level-Set-Methode',
          shortTitle: 'Level-Set',
          icon: 'map',
          description: 'Vorzeichenbehaftete Abstandsfunktion zur Grenzflächenverfolgung.',
          type: 'lesson',
          simMode: 'none',
          available: true,
        },
        {
          id: 'twophase-surface-tension',
          title: 'Oberflächenspannung & CSF',
          shortTitle: 'Obfl.spannung',
          icon: 'target',
          description: 'Young-Laplace, Kontinuums-Oberflächenkraft (CSF), Kapillarzahl.',
          type: 'lesson',
          simMode: 'none',
          available: true,
        },
      ],
    },
  ],
};

// ── Helper functions ───────────────────────────────────────────────

/** Flatten the tree to get all lesson nodes */
export function getAllLessons(node: LessonNode = curriculum): LessonNode[] {
  if (node.type === 'lesson') return [node];
  return (node.children ?? []).flatMap(getAllLessons);
}

/** Find a node by id */
export function findNode(id: string, node: LessonNode = curriculum): LessonNode | null {
  if (node.id === id) return node;
  for (const child of node.children ?? []) {
    const found = findNode(id, child);
    if (found) return found;
  }
  return null;
}

/** Get the breadcrumb path to a node */
export function getBreadcrumb(id: string, node: LessonNode = curriculum, path: LessonNode[] = []): LessonNode[] | null {
  if (node.id === id) return [...path, node];
  for (const child of node.children ?? []) {
    const found = getBreadcrumb(id, child, [...path, node]);
    if (found) return found;
  }
  return null;
}

/** Get the next lesson after the current one */
export function getNextLesson(currentId: string): LessonNode | null {
  const all = getAllLessons();
  const idx = all.findIndex(l => l.id === currentId);
  return idx >= 0 && idx < all.length - 1 ? all[idx + 1] : null;
}

/** Get the previous lesson */
export function getPrevLesson(currentId: string): LessonNode | null {
  const all = getAllLessons();
  const idx = all.findIndex(l => l.id === currentId);
  return idx > 0 ? all[idx - 1] : null;
}
