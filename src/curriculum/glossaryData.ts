/**
 * glossaryData.ts — Notation glossary for formula symbols
 *
 * Master dictionary of all mathematical symbols used across the curriculum,
 * plus per-lesson mappings so the glossary shows only relevant symbols.
 */

export interface GlossaryEntry {
  /** KaTeX string for the symbol */
  symbol: string;
  /** Short name (German) */
  name: string;
  /** One-line explanation (German) */
  description: string;
  /** Optional SI unit */
  unit?: string;
}

// ═══════════════════════════════════════════════════════════════
// MASTER GLOSSARY — all symbols used anywhere in the curriculum
// ═══════════════════════════════════════════════════════════════

export const GLOSSARY: Record<string, GlossaryEntry> = {
  // ── Grundgrößen ──────────────────────────────────────────
  phi: {
    symbol: '\\phi',
    name: 'Phi',
    description: 'Allgemeine transportierte Größe (Temperatur, Konzentration, Geschwindigkeit …)',
  },
  T: {
    symbol: 'T',
    name: 'Temperatur',
    description: 'Temperaturfeld',
    unit: 'K',
  },
  p: {
    symbol: 'p',
    name: 'Druck',
    description: 'Druckfeld',
    unit: 'Pa',
  },
  u: {
    symbol: 'u',
    name: 'Geschwindigkeit (x)',
    description: 'Geschwindigkeitskomponente in x-Richtung bzw. skalare Advektionsgeschwindigkeit',
    unit: 'm/s',
  },
  v: {
    symbol: 'v',
    name: 'Geschwindigkeit (y)',
    description: 'Geschwindigkeitskomponente in y-Richtung',
    unit: 'm/s',
  },
  u_vec: {
    symbol: '\\mathbf{u}',
    name: 'Geschwindigkeitsvektor',
    description: 'Geschwindigkeitsfeld als Vektor',
    unit: 'm/s',
  },

  // ── Materialeigenschaften ────────────────────────────────
  rho: {
    symbol: '\\rho',
    name: 'Dichte',
    description: 'Massendichte des Fluids',
    unit: 'kg/m³',
  },
  mu: {
    symbol: '\\mu',
    name: 'Dynamische Viskosität',
    description: 'Widerstand des Fluids gegen Scherung',
    unit: 'Pa·s',
  },
  nu: {
    symbol: '\\nu',
    name: 'Kinematische Viskosität',
    description: 'ν = μ/ρ — Verhältnis aus Viskosität und Dichte',
    unit: 'm²/s',
  },
  Gamma: {
    symbol: '\\Gamma',
    name: 'Diffusionskoeffizient',
    description: 'Steuert die Stärke der Diffusion (z.B. Wärmeleitfähigkeit, Stoffdiffusivität)',
    unit: 'm²/s',
  },
  alpha: {
    symbol: '\\alpha',
    name: 'Temperaturleitfähigkeit',
    description: 'Thermische Diffusivität: α = λ/(ρcₚ)',
    unit: 'm²/s',
  },
  S_phi: {
    symbol: 'S_\\phi',
    name: 'Quellterm',
    description: 'Quell- oder Senkenterm in der Transportgleichung',
  },

  // ── Diskretisierung ──────────────────────────────────────
  Dx: {
    symbol: '\\Delta x',
    name: 'Gitterweite',
    description: 'Abstand zwischen zwei Gitterpunkten / Zellzentren',
    unit: 'm',
  },
  Dt: {
    symbol: '\\Delta t',
    name: 'Zeitschritt',
    description: 'Zeitliche Schrittweite der Simulation',
    unit: 's',
  },
  n_step: {
    symbol: 'n',
    name: 'Zeitschritt-Index',
    description: 'Oberer Index — aktueller diskreter Zeitpunkt',
  },
  i_idx: {
    symbol: 'i',
    name: 'Gitterindex (x)',
    description: 'Laufindex für Gitterpunkte/Zellen in x-Richtung',
  },
  j_idx: {
    symbol: 'j',
    name: 'Gitterindex (y)',
    description: 'Laufindex für Gitterpunkte/Zellen in y-Richtung',
  },
  x_P: {
    symbol: 'x_P',
    name: 'Zellzentrum',
    description: 'Position des Zellzentrums (P = Point)',
  },
  x_f: {
    symbol: 'x_f',
    name: 'Face-Position',
    description: 'Position der Zellfläche (f = face)',
  },

  // ── Operatoren ───────────────────────────────────────────
  partial: {
    symbol: '\\partial',
    name: 'Partielle Ableitung',
    description: 'Ableitung nach einer Variablen bei festgehaltenen anderen',
  },
  nabla: {
    symbol: '\\nabla',
    name: 'Nabla-Operator',
    description: 'Gradient (∇φ), Divergenz (∇·u) oder Laplace (∇²φ)',
  },
  O_order: {
    symbol: '\\mathcal{O}(\\Delta x^n)',
    name: 'Ordnung',
    description: 'Abschneidefehler — gibt an, wie schnell der Fehler mit Verfeinerung sinkt',
  },

  // ── FVM-spezifisch ───────────────────────────────────────
  F_f: {
    symbol: 'F_f',
    name: 'Face-Fluss',
    description: 'Massenfluss (ρuA) durch eine Zellfläche',
  },
  A_f: {
    symbol: 'A_f',
    name: 'Flächeninhalt',
    description: 'Fläche eines Cell-Face',
    unit: 'm²',
  },
  phi_f: {
    symbol: '\\phi_f',
    name: 'Face-Wert',
    description: 'Interpolierter Wert von φ an der Zellfläche',
  },
  a_P: {
    symbol: 'a_P',
    name: 'Zentralkoeffizient',
    description: 'Stencil-Koeffizient der Zelle selbst (P = Point)',
  },
  a_W: {
    symbol: 'a_W',
    name: 'West-Koeffizient',
    description: 'Stencil-Koeffizient des linken Nachbarn',
  },
  a_E: {
    symbol: 'a_E',
    name: 'Ost-Koeffizient',
    description: 'Stencil-Koeffizient des rechten Nachbarn',
  },
  n_normal: {
    symbol: '\\mathbf{n}',
    name: 'Normalenvektor',
    description: 'Nach außen gerichteter Einheitsnormalenvektor einer Fläche',
  },

  // ── Schemata ─────────────────────────────────────────────
  psi_r: {
    symbol: '\\psi(r)',
    name: 'Limiter-Funktion',
    description: 'TVD-Limiter — begrenzt Gradienten um Oszillationen zu vermeiden',
  },
  r_ratio: {
    symbol: 'r',
    name: 'Gradientenverhältnis',
    description: 'Verhältnis aufeinanderfolgender Gradienten (Upwind-Ratio)',
  },

  // ── Dimensionslose Kennzahlen ────────────────────────────
  Pe: {
    symbol: '\\text{Pe}',
    name: 'Peclet-Zahl',
    description: 'Pe = |u|Δx/Γ — Verhältnis Konvektion zu Diffusion',
  },
  CFL: {
    symbol: '\\text{CFL}',
    name: 'Courant-Zahl',
    description: 'CFL = |u|Δt/Δx — Maß für zeitliche Stabilität',
  },
  Re: {
    symbol: '\\text{Re}',
    name: 'Reynolds-Zahl',
    description: 'Re = ρuL/μ — Verhältnis Trägheits- zu Reibungskräften',
  },
  Ma: {
    symbol: '\\text{Ma}',
    name: 'Mach-Zahl',
    description: 'Ma = u/a — Verhältnis Strömungsgeschwindigkeit zu Schallgeschwindigkeit',
  },

  // ── Inkompressibel / Navier-Stokes ───────────────────────
  omega_relax: {
    symbol: '\\omega',
    name: 'Relaxationsfaktor',
    description: 'Unterrelaxationsparameter (0 < ω ≤ 1) zur Stabilisierung iterativer Löser',
  },
  p_prime: {
    symbol: "p'",
    name: 'Druckkorrektur',
    description: 'Korrekturfeld im SIMPLE-Algorithmus',
    unit: 'Pa',
  },

  // ── Zeitintegration ──────────────────────────────────────
  RHS: {
    symbol: '\\text{RHS}',
    name: 'Rechte Seite',
    description: 'Diskretisierte rechte Seite der Transportgleichung (Flüsse + Quellen)',
  },
  r_fourier: {
    symbol: 'r',
    name: 'Fourier-Zahl',
    description: 'r = αΔt/Δx² — Maß für diffusive Stabilität',
  },
  G: {
    symbol: 'G',
    name: 'Verstärkungsfaktor',
    description: 'Amplitudenverhältnis |φⁿ⁺¹/φⁿ| in der Von-Neumann-Analyse',
  },

  // ── Kompressible Strömung ────────────────────────────────
  E: {
    symbol: 'E',
    name: 'Totale Energie',
    description: 'Spezifische Gesamtenergie des Fluids',
    unit: 'J/kg',
  },
  a_sound: {
    symbol: 'a',
    name: 'Schallgeschwindigkeit',
    description: 'Lokale Schallgeschwindigkeit a = √(γp/ρ)',
    unit: 'm/s',
  },
  gamma: {
    symbol: '\\gamma',
    name: 'Isentropenexponent',
    description: 'Verhältnis der spezifischen Wärmekapazitäten cₚ/cᵥ (Luft ≈ 1.4)',
  },
  U_cons: {
    symbol: '\\mathbf{U}',
    name: 'Konservativer Zustandsvektor',
    description: 'U = (ρ, ρu, ρE)ᵀ — Vektor der Erhaltungsgrößen',
  },
  F_flux: {
    symbol: '\\mathbf{F}',
    name: 'Flussvektor',
    description: 'F(U) — physikalischer Flussvektor der Euler-Gleichungen',
  },
  S_star: {
    symbol: 'S',
    name: 'Wellengeschwindigkeit',
    description: 'Signalgeschwindigkeit im Riemann-Problem (S_L, S_R, S*)',
    unit: 'm/s',
  },

  // ── Turbulenz ────────────────────────────────────────────
  k: {
    symbol: 'k',
    name: 'Turb. kin. Energie',
    description: 'Turbulente kinetische Energie k = ½⟨u′ᵢu′ᵢ⟩',
    unit: 'm²/s²',
  },
  epsilon: {
    symbol: '\\varepsilon',
    name: 'Dissipationsrate',
    description: 'Rate, mit der turbulente Energie in Wärme dissipiert',
    unit: 'm²/s³',
  },
  omega_turb: {
    symbol: '\\omega',
    name: 'Spezif. Dissipation',
    description: 'Spezifische Dissipationsrate ω = ε/k',
    unit: '1/s',
  },
  mu_t: {
    symbol: '\\mu_t',
    name: 'Turbulente Viskosität',
    description: 'Wirbelviskosität im RANS-Modell',
    unit: 'Pa·s',
  },
  y_plus: {
    symbol: 'y^+',
    name: 'Dimensionsloser Wandabstand',
    description: 'y⁺ = yuτ/ν — bestimmt die Gitterauflösung nahe der Wand',
  },
  u_tau: {
    symbol: 'u_\\tau',
    name: 'Schubspannungsgeschwindigkeit',
    description: 'uτ = √(τ_w/ρ) — Referenzgeschwindigkeit an der Wand',
    unit: 'm/s',
  },
  tau_w: {
    symbol: '\\tau_w',
    name: 'Wandschubspannung',
    description: 'Tangentiale Scherkraft pro Fläche an der Wand',
    unit: 'Pa',
  },

  // ── Zweiphasen ───────────────────────────────────────────
  alpha_vof: {
    symbol: '\\alpha',
    name: 'Volumenfraktion (VOF)',
    description: 'Anteil der Phase 1 in einer Zelle (0 = Phase 2, 1 = Phase 1)',
  },
  psi_ls: {
    symbol: '\\psi',
    name: 'Level-Set-Funktion',
    description: 'Vorzeichenbehaftete Abstandsfunktion zur Phasengrenzfläche',
    unit: 'm',
  },
  sigma: {
    symbol: '\\sigma',
    name: 'Oberflächenspannung',
    description: 'Grenzflächenspannung zwischen zwei Phasen',
    unit: 'N/m',
  },
  kappa_curv: {
    symbol: '\\kappa',
    name: 'Krümmung',
    description: 'Mittlere Krümmung der Phasengrenzfläche',
    unit: '1/m',
  },
};

// ═══════════════════════════════════════════════════════════════
// PER-LESSON SYMBOL MAPPING
// Each lesson lists which glossary keys are relevant.
// ═══════════════════════════════════════════════════════════════

export const LESSON_SYMBOLS: Record<string, string[]> = {
  // ── 1. Grundlagen ──────────────────────────────────────────
  'basics-what-is-cfd': [
    'phi', 'nabla', 'partial', 'Dx',
  ],
  'basics-pdes': [
    'phi', 'u', 'Gamma', 'S_phi', 'nabla', 'partial', 'Pe', 'Dx', 'Dt', 'u_vec',
  ],
  'basics-discretization-idea': [
    'phi', 'Dx', 'Dt', 'partial', 'i_idx', 'n_step', 'RHS',
  ],
  'basics-mesh': [
    'Dx', 'i_idx', 'x_P', 'x_f',
  ],

  // ── 2. FDM ─────────────────────────────────────────────────
  'fdm-taylor': [
    'Dx', 'partial', 'O_order', 'i_idx',
  ],
  'fdm-stencils': [
    'Dx', 'partial', 'i_idx', 'O_order',
  ],
  'fdm-1d-heat': [
    'T', 'alpha', 'Dx', 'Dt', 'i_idx', 'n_step', 'r_fourier', 'partial',
  ],

  // ── 3. FVM ─────────────────────────────────────────────────
  'fvm-concept': [
    'phi', 'nabla', 'n_normal', 'A_f', 'F_f', 'u_vec', 'Gamma',
  ],
  'fvm-face-interpolation': [
    'phi', 'phi_f', 'a_P', 'a_W', 'a_E', 'F_f',
  ],
  'fvm-1d-convection': [
    'phi', 'u', 'Dx', 'Dt', 'phi_f', 'F_f', 'a_P', 'a_W', 'a_E', 'n_step',
  ],
  'fvm-fvm-vs-fdm': [
    'phi', 'nabla', 'partial', 'Dx', 'F_f', 'A_f', 'n_normal',
  ],

  // ── 4. Schemata ────────────────────────────────────────────
  'schemes-uds': [
    'phi', 'phi_f', 'u', 'Pe', 'a_P', 'a_W', 'a_E',
  ],
  'schemes-cds': [
    'phi', 'phi_f', 'Pe', 'O_order',
  ],
  'schemes-tvd': [
    'phi', 'phi_f', 'psi_r', 'r_ratio', 'Pe',
  ],
  'schemes-compare': [
    'phi', 'phi_f', 'Pe', 'psi_r', 'r_ratio', 'O_order',
  ],

  // ── 5. Stabilität ──────────────────────────────────────────
  'stability-cfl': [
    'CFL', 'u', 'Dx', 'Dt',
  ],
  'stability-peclet': [
    'Pe', 'u', 'Dx', 'Gamma',
  ],
  'stability-vonneumann': [
    'G', 'Dt', 'Dx', 'CFL', 'r_fourier',
  ],

  // ── 6. Konvektion-Diffusion ────────────────────────────────
  'convdiff-1d': [
    'phi', 'u', 'Gamma', 'Pe', 'Dx', 'Dt', 'partial', 'phi_f',
  ],
  'convdiff-peclet-effect': [
    'Pe', 'u', 'Gamma', 'Dx', 'phi',
  ],

  // ── 7. 2D ──────────────────────────────────────────────────
  '2d-grid': [
    'Dx', 'i_idx', 'j_idx',
  ],
  '2d-scalar': [
    'phi', 'u', 'v', 'Gamma', 'Dx', 'Dt', 'nabla', 'i_idx', 'j_idx',
  ],

  // ── 8. Inkompressibel ──────────────────────────────────────
  'incomp-ns': [
    'u_vec', 'u', 'v', 'p', 'rho', 'mu', 'nu', 'nabla', 'partial', 'Re',
  ],
  'incomp-simple': [
    'u_vec', 'p', 'p_prime', 'omega_relax', 'rho', 'nabla',
  ],
  'incomp-cavity': [
    'u', 'v', 'p', 'Re', 'nu', 'Dx',
  ],

  // ── 9. Algorithmen ─────────────────────────────────────────
  'algo-linear-systems': [
    'a_P', 'a_W', 'a_E', 'phi',
  ],
  'algo-iterative': [
    'a_P', 'a_W', 'a_E', 'phi', 'omega_relax',
  ],
  'algo-multigrid': [
    'phi', 'Dx',
  ],
  'algo-underrelaxation': [
    'phi', 'omega_relax',
  ],

  // ── 10. Kompressibel ───────────────────────────────────────
  'comp-euler': [
    'rho', 'u', 'p', 'E', 'gamma', 'U_cons', 'F_flux', 'nabla', 'partial',
  ],
  'comp-riemann': [
    'rho', 'u', 'p', 'a_sound', 'S_star', 'U_cons', 'F_flux',
  ],
  'comp-godunov': [
    'U_cons', 'F_flux', 'Dx', 'Dt', 'S_star',
  ],
  'comp-shocktube': [
    'rho', 'u', 'p', 'E', 'gamma', 'Ma', 'a_sound',
  ],

  // ── 11. Turbulenz ──────────────────────────────────────────
  'turb-intro': [
    'Re', 'u', 'nu', 'rho', 'mu',
  ],
  'turb-rans': [
    'u_vec', 'mu_t', 'k', 'epsilon', 'Re', 'rho',
  ],
  'turb-ke': [
    'k', 'epsilon', 'mu_t', 'rho', 'nu',
  ],
  'turb-kw-sst': [
    'k', 'omega_turb', 'mu_t', 'rho', 'nu',
  ],
  'turb-les': [
    'Dx', 'mu_t', 'k', 'rho',
  ],
  'turb-dns': [
    'Re', 'Dx', 'Dt', 'nu',
  ],
  'turb-wall': [
    'y_plus', 'u_tau', 'tau_w', 'rho', 'nu',
  ],

  // ── 12. Zweiphasen ─────────────────────────────────────────
  'twophase-intro': [
    'rho', 'mu', 'alpha_vof', 'sigma',
  ],
  'twophase-vof': [
    'alpha_vof', 'u_vec', 'nabla', 'partial', 'Dt',
  ],
  'twophase-levelset': [
    'psi_ls', 'u_vec', 'nabla', 'partial', 'Dt',
  ],
  'twophase-surface-tension': [
    'sigma', 'kappa_curv', 'rho', 'p', 'nabla',
  ],
};
