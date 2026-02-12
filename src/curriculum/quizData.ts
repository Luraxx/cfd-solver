/**
 * quizData.ts — Quiz questions for every lesson
 *
 * Supported question types:
 *  - single-choice:  pick one correct answer (radio)
 *  - multi-select:   pick all correct answers (checkboxes)
 *  - true-false:     "Ist die Aussage wahr?" with statement
 *  - text-input:     free-text answer, checked against keywords
 *  - formula-select: pick the correct formula (single-choice variant)
 *
 * All text/formulas support KaTeX notation inside $...$
 */

import { vorlesungExtras } from './vorlesungQuestions';

/* ── Base shared fields ───────────────────────────────────────── */
interface QuizBase {
  id: string;
  question: string;
  /** Optional KaTeX formula shown below question */
  formula?: string;
  explanation: string;
  /** Optional tag for filtering (e.g. 'vorlesung') */
  tag?: string;
}

/* ── Single choice (pick exactly one) ─────────────────────────── */
export interface SingleChoiceQ extends QuizBase {
  type: 'single-choice';
  options: string[];
  correctIndex: number;
}

/* ── Multi-select (pick all that apply) ───────────────────────── */
export interface MultiSelectQ extends QuizBase {
  type: 'multi-select';
  options: string[];
  /** Indices of ALL correct options */
  correctIndices: number[];
}

/* ── True / False statement ───────────────────────────────────── */
export interface TrueFalseQ extends QuizBase {
  type: 'true-false';
  /** The statement to judge */
  statement: string;
  /** Is it true? */
  correct: boolean;
}

/* ── Free text input ──────────────────────────────────────────── */
export interface TextInputQ extends QuizBase {
  type: 'text-input';
  /** Accepted answers — match is case-insensitive, trimmed */
  acceptedAnswers: string[];
  /** Optional hint shown below input */
  hint?: string;
}

/* ── Legacy aliases for backward compat ───────────────────────── */
export interface FormulaSelectQ extends QuizBase {
  type: 'formula-select';
  options: string[];
  correctIndex: number;
}

export type QuizQuestion = SingleChoiceQ | MultiSelectQ | TrueFalseQ | TextInputQ | FormulaSelectQ;

export interface LessonQuiz {
  lessonId: string;
  questions: QuizQuestion[];
}

/** Quiz topic for standalone quiz mode */
export interface QuizTopic {
  id: string;
  title: string;
  description: string;
  /** Lesson IDs whose questions belong to this topic */
  lessonIds: string[];
}

/** Predefined quiz topics for standalone mode */
export const QUIZ_TOPICS: QuizTopic[] = [
  { id: 'grundlagen', title: 'Grundlagen', description: 'CFD, PDEs, Diskretisierung, Gitter', lessonIds: ['basics-what-is-cfd','basics-pdes','basics-discretization-idea','basics-mesh'] },
  { id: 'fdm', title: 'Finite Differenzen', description: 'Taylor, Stencils, 1D Wärmeleitung', lessonIds: ['fdm-taylor','fdm-stencils','fdm-1d-heat'] },
  { id: 'fvm', title: 'Finite Volumen', description: 'Kontrollvolumen, Face-Interpolation, Konvektion', lessonIds: ['fvm-concept','fvm-face-interpolation','fvm-1d-convection','fvm-fvm-vs-fdm'] },
  { id: 'schemata', title: 'Schemata', description: 'UDS, CDS, TVD, Vergleich', lessonIds: ['schemes-uds','schemes-cds','schemes-tvd','schemes-compare'] },
  { id: 'stabilitaet', title: 'Stabilität', description: 'CFL, Peclet, Von-Neumann', lessonIds: ['stability-cfl','stability-peclet','stability-vonneumann'] },
  { id: 'konvdiff', title: 'Konvektion-Diffusion', description: '1D Konv-Diff, Peclet-Effekt', lessonIds: ['convdiff-1d','convdiff-peclet-effect'] },
  { id: '2d', title: '2D Methoden', description: '2D Gitter & Skalartransport', lessonIds: ['2d-grid','2d-scalar'] },
  { id: 'inkompressibel', title: 'Inkompressibel', description: 'Navier-Stokes, SIMPLE, Cavity', lessonIds: ['incomp-ns','incomp-simple','incomp-cavity'] },
  { id: 'algorithmen', title: 'Algorithmen', description: 'Lineare Systeme, Iterativ, Multigrid', lessonIds: ['algo-linear-systems','algo-iterative','algo-multigrid','algo-underrelaxation'] },
  { id: 'kompressibel', title: 'Kompressibel', description: 'Euler, Riemann, Godunov, Shock Tube', lessonIds: ['comp-euler','comp-riemann','comp-godunov','comp-shocktube'] },
  { id: 'turbulenz', title: 'Turbulenz', description: 'RANS, k-ε, k-ω SST, LES, DNS, Wand', lessonIds: ['turb-intro','turb-rans','turb-ke','turb-kw-sst','turb-les','turb-dns','turb-wall'] },
  { id: 'zweiphasen', title: 'Zweiphasen', description: 'VOF, Level-Set, Oberflächenspannung', lessonIds: ['twophase-intro','twophase-vof','twophase-levelset','twophase-surface-tension'] },
  { id: 'vorlesung', title: 'Vorlesungsfragen', description: 'Fragen aus der CFD-Vorlesung', lessonIds: [] },
  { id: 'alle', title: 'Alle Fragen (Mix)', description: 'Zufällige Mischung aus allen Themen', lessonIds: [] },
];


export const quizBank: Record<string, LessonQuiz> = {

 // ═══════════════════════════════════════════════════════════════
  // 1. GRUNDLAGEN
  // ═══════════════════════════════════════════════════════════════

  'basics-what-is-cfd': {
    lessonId: 'basics-what-is-cfd',
    questions: [
      { id: 'cfd-1', type: 'text-input', question: 'Wofür steht die Abkürzung CFD?', acceptedAnswers: ['Computational Fluid Dynamics'], hint: 'Drei englische Wörter', explanation: 'CFD = Computational Fluid Dynamics — die numerische Simulation von Strömungen.' },
      { id: 'cfd-2', type: 'single-choice', question: 'Welche Gleichungen beschreiben allgemein die Strömungsmechanik?', options: ['Maxwell-Gleichungen', 'Navier-Stokes-Gleichungen', 'Schrödinger-Gleichung', 'Laplace-Gleichung'], correctIndex: 1, explanation: 'Die Navier-Stokes-Gleichungen beschreiben Impuls-, Massen- und Energieerhaltung in Strömungen.' },
      { id: 'cfd-3', type: 'single-choice', question: 'Warum brauchen wir numerische Methoden für Strömungen?', options: ['Analytische Lösungen existieren für fast alle Fälle', 'Die Navier-Stokes-Gleichungen sind nichtlinear und haben meist keine geschlossene Lösung', 'Computer sind schneller als analytische Methoden', 'Numerische Methoden sind immer genauer'], correctIndex: 1, explanation: 'Die Nichtlinearität der Navier-Stokes-Gleichungen verhindert geschlossene Lösungen für die meisten praktischen Probleme.' },
      { id: 'cfd-4', type: 'single-choice', question: 'Welche der folgenden ist KEINE Standardmethode zur Diskretisierung in CFD?', options: ['Finite-Differenzen-Methode (FDM)', 'Finite-Volumen-Methode (FVM)', 'Finite-Elemente-Methode (FEM)', 'Finite-Integral-Methode (FIM)'], correctIndex: 3, explanation: 'FDM, FVM und FEM sind die drei Standard-Diskretisierungsmethoden. FIM existiert nicht.' },
      { id: 'cfd-5', type: 'true-false', question: 'Ist folgende Aussage richtig?', statement: 'FVM ist der Standard in kommerziellen CFD-Codes wie OpenFOAM, Fluent und StarCCM+.', correct: true, explanation: 'FVM ist die dominierende Methode in kommerziellen CFD-Codes, weil sie automatisch konservativ ist.' },
      { id: 'cfd-6', type: 'true-false', question: 'Wahr oder falsch?', statement: 'Analytische Lösungen der Navier-Stokes-Gleichungen existieren für die meisten praktischen Strömungsprobleme.', correct: false, explanation: 'Falsch — analytische Lösungen existieren nur für sehr wenige Spezialfälle (z.B. Couette, Poiseuille).' },
      { id: 'cfd-7', type: 'multi-select', question: 'Welche der folgenden sind Standard-Diskretisierungsmethoden in CFD?', options: ['FDM (Finite Differenzen)', 'FVM (Finite Volumen)', 'FEM (Finite Elemente)', 'SPH (Smoothed Particle Hydrodynamics)', 'FIM (Finite Integral)'], correctIndices: [0, 1, 2], explanation: 'FDM, FVM und FEM sind die drei klassischen Methoden. SPH ist ein alternativer meshfreier Ansatz, FIM existiert nicht.' },
      { id: 'cfd-8', type: 'single-choice', question: 'Was ist das Grundprinzip der numerischen Simulation?', options: ['Gebiet in Zellen teilen und algebraische Gleichungen lösen', 'Exakte Lösung der Differentialgleichung berechnen', 'Nur die Randbedingungen auswerten', 'Experimentelle Daten interpolieren'], correctIndex: 0, explanation: 'CFD teilt das Gebiet in kleine Zellen/Punkte und löst vereinfachte algebraische Gleichungen an jedem Punkt.' },
      { id: 'cfd-9', type: 'text-input', question: 'Welche Methode ist automatisch konservativ und daher der Standard in kommerzieller CFD?', acceptedAnswers: ['FVM', 'Finite-Volumen-Methode', 'Finite Volumen Methode', 'Finite Volumen'], hint: 'Drei Buchstaben', explanation: 'Die Finite-Volumen-Methode (FVM) ist automatisch konservativ, da sie auf integralen Bilanzen basiert.' },
      { id: 'cfd-10', type: 'single-choice', question: 'Was bedeutet "konservativ" im Kontext von Diskretisierungsmethoden?', options: ['Die Methode ist besonders speichereffizient', 'Erhaltungsgrößen (Masse, Impuls, Energie) werden exakt bilanziert', 'Die Methode konvergiert besonders schnell', 'Nur positive Koeffizienten treten auf'], correctIndex: 1, explanation: 'Konservativ bedeutet, dass die diskreten Gleichungen die Erhaltungssätze (Masse, Impuls, Energie) exakt einhalten.' },
      { id: 'cfd-11', type: 'true-false', question: 'Wahr oder falsch?', statement: 'CFD kann Strömungsprobleme immer exakt lösen, wenn das Gitter fein genug ist.', correct: false, explanation: 'Falsch — CFD liefert immer Approximationen. Selbst bei sehr feinen Gittern bleiben Modellierungs- und Diskretisierungsfehler.' },
    ],
  },

  'basics-pdes': {
    lessonId: 'basics-pdes',
    questions: [
      { id: 'pde-1', type: 'formula-select', question: 'Welche Gleichung beschreibt reine Konvektion eines Skalars $\\phi$?', options: ['$\\frac{\\partial \\phi}{\\partial t} + u \\frac{\\partial \\phi}{\\partial x} = 0$', '$\\frac{\\partial \\phi}{\\partial t} = \\Gamma \\frac{\\partial^2 \\phi}{\\partial x^2}$', '$\\frac{\\partial \\phi}{\\partial t} + u \\frac{\\partial \\phi}{\\partial x} = \\Gamma \\frac{\\partial^2 \\phi}{\\partial x^2}$', '$\\nabla^2 \\phi = 0$'], correctIndex: 0, explanation: 'Reine Konvektion: $\\frac{\\partial \\phi}{\\partial t} + u \\nabla \\phi = 0$ — kein Diffusionsterm.' },
      { id: 'pde-2', type: 'single-choice', question: 'Was beschreibt der Diffusionsterm physikalisch?', options: ['Transport durch Strömungsgeschwindigkeit', 'Ausbreitung durch molekulare Mischung (Gradientendiffusion)', 'Erzeugung/Vernichtung einer Größe', 'Druckänderung entlang einer Stromlinie'], correctIndex: 1, explanation: 'Diffusion = Transport aufgrund von Konzentrationsgradienten (Ficksches Gesetz).' },
      { id: 'pde-3', type: 'single-choice', question: 'Was ist eine "hyperbolische" PDE?', options: ['Rein diffusiver Charakter', 'Wellenartige Ausbreitung (z.B. Konvektion)', 'Elliptischer Operator', 'Keine Zeitableitung'], correctIndex: 1, explanation: 'Hyperbolische PDEs: Information breitet sich mit endlicher Geschwindigkeit aus (z.B. Wellengleichung).' },
      { id: 'pde-4', type: 'text-input', question: 'Wie heißt die dimensionslose Kennzahl, die das Verhältnis von Konvektion zu Diffusion beschreibt?', acceptedAnswers: ['Peclet-Zahl', 'Peclet', 'Pe', 'Péclet-Zahl', 'Péclet'], explanation: 'Pe = |u|Δx/Γ — die Peclet-Zahl gibt an, ob Konvektion oder Diffusion dominiert.' },
      { id: 'pde-5', type: 'true-false', question: 'Wahr oder falsch?', statement: 'Die allgemeine Transportgleichung enthält Terme für zeitliche Änderung, Konvektion, Diffusion und Quellen.', correct: true, explanation: 'Korrekt: $\\frac{\\partial \\phi}{\\partial t} + \\nabla \\cdot (\\mathbf{u}\\phi) = \\nabla \\cdot (\\Gamma \\nabla \\phi) + S_\\phi$' },
      { id: 'pde-6', type: 'multi-select', question: 'Was kann $\\phi$ in der allgemeinen Transportgleichung darstellen?', options: ['Temperatur', 'Konzentration', 'Geschwindigkeitskomponente', 'Turbulente kinetische Energie', 'Die Gitterweite'], correctIndices: [0, 1, 2, 3], explanation: '$\\phi$ kann jede transportierte Größe sein: T, c, u, k usw. — aber nicht Δx.' },
      { id: 'pde-7', type: 'formula-select', question: 'Welche Gleichung beschreibt reine Diffusion?', options: ['$\\frac{\\partial \\phi}{\\partial t} = \\Gamma \\frac{\\partial^2 \\phi}{\\partial x^2}$', '$\\frac{\\partial \\phi}{\\partial t} + u \\frac{\\partial \\phi}{\\partial x} = 0$', '$\\nabla \\cdot \\mathbf{u} = 0$', '$\\rho \\frac{D\\mathbf{u}}{Dt} = -\\nabla p$'], correctIndex: 0, explanation: 'Reine Diffusion: nur Zeitableitung und 2. Ordn. Raumableitung, kein Konvektionsterm.' },
      { id: 'pde-8', type: 'single-choice', question: 'Was passiert mit einer Anfangsverteilung bei reiner Konvektion?', options: ['Sie wird geglättet', 'Sie wird ohne Formänderung transportiert', 'Sie bleibt stehen', 'Sie wird verstärkt'], correctIndex: 1, explanation: 'Bei reiner Konvektion wird das Profil als Welle mit Geschwindigkeit u verschoben: $\\phi(x,t) = \\phi_0(x - ut)$.' },
      { id: 'pde-9', type: 'single-choice', question: 'Was ist $\\Gamma$ in der Transportgleichung?', options: ['Geschwindigkeit', 'Diffusionskoeffizient', 'Dichte', 'Quellterm'], correctIndex: 1, explanation: '$\\Gamma$ ist der Diffusionskoeffizient — steuert die Stärke der Diffusion.' },
      { id: 'pde-10', type: 'true-false', question: 'Wahr oder falsch?', statement: 'Bei $\\text{Pe} \\gg 1$ dominiert die Diffusion über die Konvektion.', correct: false, explanation: 'Falsch — bei Pe >> 1 dominiert **Konvektion**, bei Pe << 1 dominiert Diffusion.' },
      { id: 'pde-11', type: 'single-choice', question: 'Welcher PDE-Typ ist die Konvektions-Diffusions-Gleichung?', options: ['Rein elliptisch', 'Rein parabolisch', 'Parabolisch (zeitabhängig) mit gemischtem Charakter', 'Rein hyperbolisch'], correctIndex: 2, explanation: 'Die Konvektions-Diffusions-Gleichung hat parabolischen Charakter mit hyperbolischen und elliptischen Anteilen.' },
    ],
  },

  'basics-discretization-idea': {
    lessonId: 'basics-discretization-idea',
    questions: [
      { id: 'disc-1', type: 'single-choice', question: 'Was versteht man unter "Diskretisierung"?', options: ['Exakte Lösung einer DGL', 'Umwandlung kontinuierlicher Gleichungen in algebraische Gleichungen', 'Berechnung von Randbedingungen', 'Wahl des Zeitschritts'], correctIndex: 1, explanation: 'Diskretisierung ersetzt das Kontinuum durch endlich viele Punkte und die PDEs durch algebraische Gleichungen.' },
      { id: 'disc-2', type: 'formula-select', question: 'Wie sieht die einfachste Vorwärtsdifferenz für $\\frac{df}{dx}$ aus?', options: ['$\\frac{f_{i+1} - f_i}{\\Delta x}$', '$\\frac{f_{i+1} - f_{i-1}}{2\\Delta x}$', '$\\frac{f_{i+1} - 2f_i + f_{i-1}}{\\Delta x^2}$', '$\\frac{f_i - f_{i-1}}{\\Delta x}$'], correctIndex: 0, explanation: 'Vorwärtsdifferenz: $(f_{i+1} - f_i)/\\Delta x$ — 1. Ordnung genau.' },
      { id: 'disc-3', type: 'true-false', question: 'Wahr oder falsch?', statement: 'Je feiner das Gitter (kleineres Δx), desto genauer wird die numerische Lösung in der Regel.', correct: true, explanation: 'Korrekt — durch Verfeinerung sinkt der Diskretisierungsfehler gemäß der Ordnung des Verfahrens.' },
      { id: 'disc-4', type: 'single-choice', question: 'Was ist der "Trunkationsfehler" (Abschneidefehler)?', options: ['Fehler durch falsche Randbedingungen', 'Fehler durch Abschneiden der Taylor-Reihe', 'Rundungsfehler des Computers', 'Fehler durch zu viele Iterationen'], correctIndex: 1, explanation: 'Der Trunkationsfehler entsteht durch Abschneiden der Taylor-Reihe bei der Approximation von Ableitungen.' },
      { id: 'disc-5', type: 'text-input', question: 'Wie heißen die drei Schritte der numerischen Lösung: Gitter erzeugen → ? → Lösen', acceptedAnswers: ['Diskretisieren', 'Diskretisierung'], hint: 'Ein Wort', explanation: 'Die drei Schritte: 1) Gitter erzeugen, 2) Diskretisieren (PDE → algebraische Gl.), 3) Lösen.' },
      { id: 'disc-6', type: 'single-choice', question: 'Was entsteht nach der Diskretisierung einer PDE?', options: ['Eine exakte Lösung', 'Ein algebraisches Gleichungssystem', 'Eine neue PDE', 'Ein analytischer Ausdruck'], correctIndex: 1, explanation: 'Nach Diskretisierung entsteht ein System algebraischer Gleichungen (z.B. $A\\phi = b$).' },
      { id: 'disc-7', type: 'true-false', question: 'Wahr oder falsch?', statement: 'Bei der expliziten Euler-Methode wird $\\phi^{n+1}$ direkt aus $\\phi^n$ berechnet, ohne ein Gleichungssystem lösen zu müssen.', correct: true, explanation: 'Korrekt — explizit Euler: $\\phi^{n+1} = \\phi^n + \\Delta t \\cdot \\text{RHS}^n$. Alle Werte auf der rechten Seite sind bekannt.' },
      { id: 'disc-8', type: 'multi-select', question: 'Welche Fehlerquellen gibt es bei numerischen Simulationen?', options: ['Trunkationsfehler (Diskretisierung)', 'Rundungsfehler (Maschinengenauigkeit)', 'Modellfehler (vereinfachte Physik)', 'Iterationsfehler (nicht konvergiert)', 'Kompilierungsfehler'], correctIndices: [0, 1, 2, 3], explanation: 'Trunkations-, Rundungs-, Modell- und Iterationsfehler sind die vier Hauptfehlerquellen. Kompilierungsfehler sind Programmierfehler.' },
      { id: 'disc-9', type: 'single-choice', question: 'Was bedeutet "konsistent" bei einem numerischen Verfahren?', options: ['Es konvergiert immer', 'Der Trunkationsfehler geht gegen 0 für Δx → 0', 'Es ist immer stabil', 'Es liefert immer positive Werte'], correctIndex: 1, explanation: 'Konsistenz: Die diskrete Gleichung nähert sich der kontinuierlichen PDE für Δx, Δt → 0.' },
      { id: 'disc-10', type: 'single-choice', question: 'Was besagt der Satz von Lax?', options: ['Konsistenz + Stabilität = Konvergenz', 'Feinere Gitter sind immer besser', 'Implizite Verfahren sind immer stabil', 'CFL < 1 ist immer nötig'], correctIndex: 0, explanation: 'Lax-Theorem: Für ein konsistentes Verfahren folgt aus Stabilität die Konvergenz.' },
    ],
  },

  'basics-mesh': {
    lessonId: 'basics-mesh',
    questions: [
      { id: 'mesh-1', type: 'single-choice', question: 'Was ist ein "strukturiertes" Gitter?', options: ['Zufällig verteilte Punkte', 'Regelmäßige Anordnung (jeder Punkt hat gleich viele Nachbarn)', 'Dreiecksgitter', 'Gitter mit lokaler Verfeinerung'], correctIndex: 1, explanation: 'Strukturierte Gitter haben eine regelmäßige i,j,k-Topologie — jeder innere Knoten hat die gleiche Nachbarstruktur.' },
      { id: 'mesh-2', type: 'true-false', question: 'Wahr oder falsch?', statement: 'Bei der FVM liegen die Unbekannten typischerweise in den Zellzentren, nicht an den Knoten.', correct: true, explanation: 'Korrekt — FVM ist cell-centered. Die Werte werden als Mittelwerte über die Zelle gespeichert.' },
      { id: 'mesh-3', type: 'single-choice', question: 'Was ist der Unterschied zwischen einem Knoten und einem Zellzentrum?', options: ['Es gibt keinen Unterschied', 'Knoten = Gitterpunkt, Zellzentrum = Mittelpunkt einer Zelle', 'Knoten sind nur am Rand', 'Zellzentren gibt es nur in 2D'], correctIndex: 1, explanation: 'Knoten sind die Ecken des Gitters, Zellzentren liegen in der Mitte jeder Zelle (relevant für FVM).' },
      { id: 'mesh-4', type: 'text-input', question: 'Wie heißt die Fläche zwischen zwei benachbarten FVM-Zellen?', acceptedAnswers: ['Face', 'Zellfläche', 'Cell Face', 'Zellface'], hint: 'Englischer CFD-Fachbegriff', explanation: 'Die Trennfläche zwischen Zellen heißt "Face" — hier werden Flüsse berechnet.' },
      { id: 'mesh-5', type: 'multi-select', question: 'Welche Gittertypen gibt es in CFD?', options: ['Strukturiert (Hex/Quad)', 'Unstrukturiert (Tet/Tri)', 'Hybrid (gemischt)', 'Zufällig', 'Adaptiv (lokal verfeinert)'], correctIndices: [0, 1, 2, 4], explanation: 'Strukturiert, unstrukturiert, hybrid und adaptiv sind gängige Gittertypen. "Zufällig" gibt es nicht.' },
      { id: 'mesh-6', type: 'formula-select', question: 'Wo liegt das Zellzentrum $x_P$ bei äquidistantem FVM-Gitter?', options: ['$x_P = (i + \\frac{1}{2}) \\Delta x$', '$x_P = i \\cdot \\Delta x$', '$x_P = (i+1) \\cdot \\Delta x$', '$x_P = i^2 \\cdot \\Delta x$'], correctIndex: 0, explanation: 'Bei äquidistantem Gitter liegt das Zellzentrum bei $x_P = (i + 1/2)\\Delta x$, also in der Mitte der Zelle.' },
      { id: 'mesh-7', type: 'single-choice', question: 'Was passiert bei einem zu groben Gitter?', options: ['Die Lösung ist exakt', 'Der Diskretisierungsfehler ist groß', 'Die Simulation divergiert immer', 'Nichts — CFD ist gitterunabhängig'], correctIndex: 1, explanation: 'Zu grobe Gitter führen zu großen Diskretisierungsfehlern — wichtige physikalische Details gehen verloren.' },
      { id: 'mesh-8', type: 'true-false', question: 'Wahr oder falsch?', statement: 'Die Gitterweite Δx muss im gesamten Gebiet gleich sein.', correct: false, explanation: 'Falsch — nicht-äquidistante und lokal verfeinerte Gitter sind üblich, z.B. fein in der Grenzschicht.' },
      { id: 'mesh-9', type: 'single-choice', question: 'Was ist eine "Gitterstudie"?', options: ['Ein Diagramm des Gitters', 'Berechnung auf mehreren Gitterfeinheiten zur Fehlerabschätzung', 'Die Wahl des Gittertyps', 'Ein Test der Randbedingungen'], correctIndex: 1, explanation: 'Eine Gitterstudie berechnet die Lösung auf mehreren Gitterfeinheiten, um zu prüfen, ob die Lösung konvergiert.' },
      { id: 'mesh-10', type: 'single-choice', question: 'Was bedeutet "y+" im Kontext von Wandgittern?', options: ['Die y-Koordinate des ersten Gitterpunkts', 'Der dimensionslose Wandabstand', 'Die Gitterweite in y-Richtung', 'Die Anzahl der Gitterpunkte'], correctIndex: 1, explanation: '$y^+ = y u_\\tau / \\nu$ — der dimensionslose Wandabstand, entscheidend für die Grenzschichtauflösung.' },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // 2. FDM
  // ═══════════════════════════════════════════════════════════════

  'fdm-taylor': {
    lessonId: 'fdm-taylor',
    questions: [
      { id: 'tay-1', type: 'formula-select', question: 'Wie lautet die Taylor-Entwicklung von $f(x+\\Delta x)$ um $x$?', options: ['$f + \\Delta x f\' + \\frac{\\Delta x^2}{2}f\'\' + \\ldots$', '$f + \\Delta x^2 f\' + \\Delta x f\'\'$', '$f - \\Delta x f\'$', '$f \\cdot e^{\\Delta x}$'], correctIndex: 0, explanation: 'Taylor: $f(x+\\Delta x) = f(x) + \\Delta x f\'(x) + \\frac{\\Delta x^2}{2}f\'\'(x) + \\ldots$' },
      { id: 'tay-2', type: 'single-choice', question: 'Welche Ordnung hat die Vorwärtsdifferenz $(f_{i+1} - f_i)/\\Delta x$?', options: ['0. Ordnung', '1. Ordnung', '2. Ordnung', '3. Ordnung'], correctIndex: 1, explanation: 'Vorwärtsdifferenz hat Ordnung 1: Fehler $\\sim \\mathcal{O}(\\Delta x)$.' },
      { id: 'tay-3', type: 'formula-select', question: 'Die zentrale Differenz für die 1. Ableitung lautet:', options: ['$\\frac{f_{i+1} - f_{i-1}}{2\\Delta x}$', '$\\frac{f_{i+1} - f_i}{\\Delta x}$', '$\\frac{f_i - f_{i-1}}{\\Delta x}$', '$\\frac{f_{i+1} + f_{i-1}}{2\\Delta x}$'], correctIndex: 0, explanation: 'Zentrale Differenz: $(f_{i+1} - f_{i-1})/(2\\Delta x)$ — 2. Ordnung genau.' },
      { id: 'tay-4', type: 'single-choice', question: 'Welche Ordnung hat die zentrale Differenz für die 1. Ableitung?', options: ['1. Ordnung', '2. Ordnung', '3. Ordnung', '4. Ordnung'], correctIndex: 1, explanation: 'CDS hat Ordnung 2 — der Fehlerterm $\\sim \\mathcal{O}(\\Delta x^2)$ entsteht durch Elimination der geraden Terme.' },
      { id: 'tay-5', type: 'true-false', question: 'Wahr oder falsch?', statement: 'Die Rückwärtsdifferenz $(f_i - f_{i-1})/\\Delta x$ hat 2. Ordnung Genauigkeit.', correct: false, explanation: 'Falsch — die Rückwärtsdifferenz hat nur 1. Ordnung, genau wie die Vorwärtsdifferenz.' },
      { id: 'tay-6', type: 'formula-select', question: 'Die zentrale Differenz für die 2. Ableitung lautet:', options: ['$\\frac{f_{i+1} - 2f_i + f_{i-1}}{\\Delta x^2}$', '$\\frac{f_{i+1} - f_{i-1}}{2\\Delta x}$', '$\\frac{f_{i+1} - f_i}{\\Delta x^2}$', '$\\frac{f_{i+1} + f_{i-1}}{\\Delta x^2}$'], correctIndex: 0, explanation: '2. Ableitung zentral: $(f_{i+1} - 2f_i + f_{i-1})/\\Delta x^2$ — ebenfalls 2. Ordnung.' },
      { id: 'tay-7', type: 'text-input', question: 'Was bedeutet $\\mathcal{O}(\\Delta x^2)$ bei einem Verfahren?', acceptedAnswers: ['2. Ordnung', 'Zweite Ordnung', '2. Ordnung genau', 'Fehler skaliert mit Delta x quadrat'], hint: 'Welche Ordnung?', explanation: '$\\mathcal{O}(\\Delta x^2)$ bedeutet 2. Ordnung — bei Halbierung von Δx sinkt der Fehler um Faktor 4.' },
      { id: 'tay-8', type: 'single-choice', question: 'Was passiert mit dem Fehler eines 2. Ordnung-Verfahrens bei Halbierung von Δx?', options: ['Halbiert sich', 'Viertelt sich', 'Achtelt sich', 'Bleibt gleich'], correctIndex: 1, explanation: 'Bei p=2: Fehler $\\sim \\Delta x^2$. Halbierung: $\\Delta x/2 \\Rightarrow (\\Delta x/2)^2 = \\Delta x^2/4$.' },
      { id: 'tay-9', type: 'multi-select', question: 'Welche Finite-Differenzen-Typen basieren auf Taylor-Entwicklung?', options: ['Vorwärtsdifferenz (FDS)', 'Rückwärtsdifferenz (BDS)', 'Zentrale Differenz (CDS)', 'Alle drei'], correctIndices: [0, 1, 2], explanation: 'Alle drei FD-Typen werden aus Taylor-Reihen abgeleitet.' },
      { id: 'tay-10', type: 'true-false', question: 'Wahr oder falsch?', statement: 'Ein Verfahren höherer Ordnung benötigt immer mehr Gitterpunkte im Stencil.', correct: true, explanation: 'Korrekt — höhere Ordnung erfordert mehr Stützstellen, um mehr Taylor-Terme eliminieren zu können.' },
    ],
  },

  'fdm-stencils': {
    lessonId: 'fdm-stencils',
    questions: [
      { id: 'sten-1', type: 'single-choice', question: 'Was ist ein "Stencil" in FDM?', options: ['Eine Randbedingung', 'Das Muster der Nachbarpunkte, die in die Approximation eingehen', 'Ein Gittertyp', 'Ein Zeitintegrationsverfahren'], correctIndex: 1, explanation: 'Ein Stencil beschreibt, welche Gitterpunkte (Nachbarn) für die Approximation einer Ableitung verwendet werden.' },
      { id: 'sten-2', type: 'single-choice', question: 'Wie viele Punkte braucht der 3-Punkt-Stencil für die 2. Ableitung?', options: ['2', '3', '5', '7'], correctIndex: 1, explanation: '3-Punkt-Stencil: $f_{i-1}$, $f_i$, $f_{i+1}$ — der klassische zentrale Differenzenstern.' },
      { id: 'sten-3', type: 'true-false', question: 'Wahr oder falsch?', statement: 'Ein breiterer Stencil führt immer zu einem stabileren Verfahren.', correct: false, explanation: 'Falsch — ein breiterer Stencil erhöht die Ordnung, aber nicht automatisch die Stabilität.' },
      { id: 'sten-4', type: 'single-choice', question: 'Was passiert am Rand des Gebiets mit dem zentralen Stencil?', options: ['Nichts besonderes', 'Es fehlen Nachbarpunkte → einseitige Differenzen oder Ghostzellen nötig', 'Der Stencil wird automatisch angepasst', 'Ränder brauchen keinen Stencil'], correctIndex: 1, explanation: 'Am Rand fehlt mindestens ein Nachbar — man braucht einseitige Differenzen, Ghostzellen oder spezielle BC-Behandlung.' },
      { id: 'sten-5', type: 'text-input', question: 'Wie nennt man fiktive Punkte außerhalb des Rechengebiets zur Stencil-Vervollständigung?', acceptedAnswers: ['Ghostzellen', 'Ghost Cells', 'Geisterzellen', 'Ghost-Zellen'], explanation: 'Ghostzellen (Ghost Cells) sind fiktive Zellen am Rand, deren Werte aus den Randbedingungen bestimmt werden.' },
      { id: 'sten-6', type: 'multi-select', question: 'Welche Stencils werden für die 1D Diffusion benötigt?', options: ['Zentrale Differenz 2. Ableitung: $[1, -2, 1]/\\Delta x^2$', 'Vorwärtsdifferenz 1. Ableitung', 'Zeitableitung (z.B. Euler)', 'Quellterm'], correctIndices: [0, 2], explanation: 'Für reine 1D Diffusion braucht man den zentralen 3-Punkt-Stencil für d²f/dx² und eine Zeitdiskretisierung.' },
      { id: 'sten-7', type: 'single-choice', question: 'Was ist der Stencil-Koeffizient $a_P$ im 3-Punkt-Schema $a_W f_{i-1} + a_P f_i + a_E f_{i+1} = \\text{RHS}$?', options: ['Der Koeffizient des linken Nachbarn', 'Der Koeffizient des Zentralpunkts', 'Der Koeffizient des rechten Nachbarn', 'Der Quellterm'], correctIndex: 1, explanation: '$a_P$ ist der Koeffizient des Zentralpunkts P (Point) — der wichtigste Koeffizient im Gleichungssystem.' },
      { id: 'sten-8', type: 'true-false', question: 'Wahr oder falsch?', statement: 'Der 5-Punkt-Stencil in 2D approximiert den Laplace-Operator $\\nabla^2 \\phi$.', correct: true, explanation: 'Korrekt — der 5-Punkt-Stencil (N, S, E, W, P) ist die Standard-Approximation des 2D Laplace-Operators.' },
      { id: 'sten-9', type: 'single-choice', question: 'Wofür steht "W" und "E" in der FVM-Nomenklatur?', options: ['Width und End', 'West und East (linker und rechter Nachbar)', 'Wert und Ergebnis', 'Wand und Einlass'], correctIndex: 1, explanation: 'W = West (linker Nachbar), E = East (rechter Nachbar) — Kompass-Notation der FVM.' },
      { id: 'sten-10', type: 'single-choice', question: 'Wie viele Nachbarn hat ein innerer Punkt im 2D 5-Punkt-Stencil?', options: ['3', '4', '5', '8'], correctIndex: 1, explanation: '4 Nachbarn (N, S, E, W) plus der Punkt selbst = 5-Punkt-Stencil, aber 4 Nachbarkoeffizienten.' },
    ],
  },

  'fdm-1d-heat': {
    lessonId: 'fdm-1d-heat',
    questions: [
      { id: 'heat-1', type: 'formula-select', question: 'Wie lautet die 1D Wärmeleitungsgleichung?', options: ['$\\frac{\\partial T}{\\partial t} = \\alpha \\frac{\\partial^2 T}{\\partial x^2}$', '$\\frac{\\partial T}{\\partial t} + u \\frac{\\partial T}{\\partial x} = 0$', '$\\nabla^2 T = 0$', '$\\rho c_p \\frac{\\partial T}{\\partial t} = -\\nabla p$'], correctIndex: 0, explanation: '1D Wärmeleitung: $\\partial T/\\partial t = \\alpha \\partial^2 T / \\partial x^2$ mit $\\alpha = k/(\\rho c_p)$.' },
      { id: 'heat-2', type: 'text-input', question: 'Wie heißt die Kennzahl $r = \\alpha \\Delta t / \\Delta x^2$?', acceptedAnswers: ['Fourier-Zahl', 'Fourier', 'Fo', 'Diffusionszahl'], explanation: '$r = \\alpha \\Delta t / \\Delta x^2$ ist die Fourier-Zahl (oder Diffusionszahl) — entscheidend für Stabilität.' },
      { id: 'heat-3', type: 'single-choice', question: 'Was ist die Stabilitätsbedingung für explizites Euler + zentrale Differenz bei 1D Wärmeleitung?', options: ['$r \\leq 1$', '$r \\leq 0.5$', '$r \\leq 2$', 'Keine Bedingung'], correctIndex: 1, explanation: 'Stabilität erfordert $r = \\alpha \\Delta t / \\Delta x^2 \\leq 0.5$ (Von-Neumann-Analyse).' },
      { id: 'heat-4', type: 'true-false', question: 'Wahr oder falsch?', statement: 'Das implizite Euler-Verfahren für die Wärmeleitungsgleichung ist unbedingt stabil.', correct: true, explanation: 'Korrekt — implizites Euler ist für die Diffusionsgleichung A-stabil (unbedingt stabil für alle Δt).' },
      { id: 'heat-5', type: 'single-choice', question: 'Was passiert bei $r > 0.5$ mit dem expliziten Euler-Verfahren?', options: ['Die Lösung wird genauer', 'Oszillationen und Divergenz', 'Die Lösung bleibt stabil', 'Der Zeitschritt wird automatisch angepasst'], correctIndex: 1, explanation: 'Bei $r > 0.5$ wird der Verstärkungsfaktor |G| > 1 → die Lösung oszilliert und divergiert.' },
      { id: 'heat-6', type: 'formula-select', question: 'Der explizite Euler-Schritt für 1D Diffusion lautet:', options: ['$T_i^{n+1} = T_i^n + r(T_{i+1}^n - 2T_i^n + T_{i-1}^n)$', '$T_i^{n+1} = T_i^n + r(T_{i+1}^{n+1} - 2T_i^{n+1} + T_{i-1}^{n+1})$', '$T_i^{n+1} = \\frac{T_{i+1}^n + T_{i-1}^n}{2}$', '$T_i^{n+1} = r \\cdot T_i^n$'], correctIndex: 0, explanation: 'Explizit Euler: alle rechte Seite auf Zeitebene $n$ ausgewertet.' },
      { id: 'heat-7', type: 'multi-select', question: 'Welche Eigenschaften hat das implizite Euler-Verfahren für Diffusion?', options: ['Unbedingt stabil', '1. Ordnung in der Zeit', 'Benötigt Lösung eines Gleichungssystems', 'Immer genauer als explizit', 'Ergibt tridiagonales Gleichungssystem in 1D'], correctIndices: [0, 1, 2, 4], explanation: 'Implizit Euler ist stabil, 1. Ordnung, erfordert LGS-Lösung (tridiagonal in 1D). Nicht automatisch genauer!' },
      { id: 'heat-8', type: 'single-choice', question: 'Was ist $\\alpha$ in der Wärmeleitungsgleichung?', options: ['Dichte', 'Temperaturleitfähigkeit (thermische Diffusivität)', 'Wärmeleitfähigkeit', 'Spezifische Wärmekapazität'], correctIndex: 1, explanation: '$\\alpha = k/(\\rho c_p)$ ist die Temperaturleitfähigkeit — gibt an, wie schnell sich Temperatur ausbreitet.' },
      { id: 'heat-9', type: 'true-false', question: 'Wahr oder falsch?', statement: 'Crank-Nicolson für die Wärmeleitungsgleichung hat 2. Ordnung Genauigkeit in der Zeit.', correct: true, explanation: 'Korrekt — Crank-Nicolson = Mittelwert aus explizit und implizit → 2. Ordnung in t.' },
      { id: 'heat-10', type: 'single-choice', question: 'Welchen Matrixtyp erzeugt die 1D implizite Diffusion?', options: ['Vollbesetzte Matrix', 'Tridiagonale Matrix', 'Diagonalmatrix', 'Obere Dreiecksmatrix'], correctIndex: 1, explanation: 'In 1D mit 3-Punkt-Stencil entsteht ein tridiagonales System — effizient lösbar mit Thomas-Algorithmus (TDMA).' },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // 3. FVM
  // ═══════════════════════════════════════════════════════════════

  'fvm-concept': {
    lessonId: 'fvm-concept',
    questions: [
      { id: 'fvmc-1', type: 'single-choice', question: 'Was ist das Grundprinzip der Finite-Volumen-Methode?', options: ['Ableitungen durch Differenzenquotienten ersetzen', 'Integrale Bilanz über Kontrollvolumen → Flüsse über Flächen', 'Schwache Formulierung mit Testfunktionen', 'Spektrale Zerlegung der Lösung'], correctIndex: 1, explanation: 'FVM basiert auf integraler Bilanz: Was in ein Kontrollvolumen rein-/rausfließt, wird über die Zellflächen bilanziert.' },
      { id: 'fvmc-2', type: 'true-false', question: 'Wahr oder falsch?', statement: 'FVM ist automatisch konservativ, weil der Fluss durch ein gemeinsames Face für beide Nachbarzellen identisch ist.', correct: true, explanation: 'Korrekt — ein Face-Fluss geht in eine Zelle rein und aus der anderen raus → exakte Bilanz.' },
      { id: 'fvmc-3', type: 'multi-select', question: 'Was muss man bei FVM an jedem Cell-Face berechnen?', options: ['Den Fluss (konvektiv + diffusiv)', 'Den Druck', 'Den interpolierten Wert von φ', 'Die exakte Lösung der PDE'], correctIndices: [0, 2], explanation: 'An jedem Face braucht man den interpolierten Wert $\\phi_f$ und daraus den Fluss (Konvektion + Diffusion).' },
      { id: 'fvmc-4', type: 'single-choice', question: 'Was ist der Unterschied zwischen FVM und FDM?', options: ['Kein Unterschied', 'FVM basiert auf Integralbilanz, FDM auf Taylor-Entwicklung', 'FDM ist immer genauer', 'FVM funktioniert nur in 1D'], correctIndex: 1, explanation: 'FVM: integrale Erhaltung über Kontrollvolumen. FDM: lokale Taylor-Entwicklung an Gitterpunkten.' },
      { id: 'fvmc-5', type: 'text-input', question: 'Wie heißt der Vektor, der senkrecht auf dem Cell-Face steht und nach außen zeigt?', acceptedAnswers: ['Normalenvektor', 'Flächennormale', 'n', 'Normalvektor'], explanation: 'Der nach außen gerichtete Einheitsnormalenvektor $\\mathbf{n}$ definiert die Richtung des Flusses durch ein Face.' },
      { id: 'fvmc-6', type: 'formula-select', question: 'Das Flächenintegral wird in FVM wie approximiert?', options: ['$\\oint (\\mathbf{u}\\phi) \\cdot \\mathbf{n} \\, dA \\approx \\sum_{\\text{Faces}} F_f \\cdot A_f$', '$\\int \\phi \\, dV = \\phi \\cdot V$', '$\\frac{d\\phi}{dx} = \\frac{\\phi_E - \\phi_W}{2\\Delta x}$', '$\\nabla^2 \\phi = 0$'], correctIndex: 0, explanation: 'FVM approximiert das Flächenintegral als Summe der Flüsse über alle Faces: $\\sum F_f A_f$.' },
      { id: 'fvmc-7', type: 'single-choice', question: 'Warum ist FVM der Standard in kommerzieller CFD?', options: ['Einfacher zu programmieren als FDM', 'Automatisch konservativ + funktioniert auf unstrukturierten Gittern', 'Immer 2. Ordnung genau', 'Braucht keinen Löser'], correctIndex: 1, explanation: 'FVM ist automatisch konservativ und flexibel bezüglich Gittertypen — ideal für komplexe Geometrien.' },
      { id: 'fvmc-8', type: 'true-false', question: 'Wahr oder falsch?', statement: 'Bei FVM wird die PDE zuerst über das Kontrollvolumen integriert und dann der Gauß-Satz angewandt.', correct: true, explanation: 'Korrekt — Integration + Gaußscher Integralsatz wandelt Volumenintegrale in Flächenintegrale um.' },
      { id: 'fvmc-9', type: 'single-choice', question: 'Was ist $A_f$ im FVM-Kontext?', options: ['Fläche einer Zelle', 'Fläche eines Cell-Face', 'Amplitude einer Welle', 'Koeffizient des Gleichungssystems'], correctIndex: 1, explanation: '$A_f$ ist der Flächeninhalt eines Cell-Face — wird zur Berechnung des Massenflusses benötigt.' },
      { id: 'fvmc-10', type: 'single-choice', question: 'Was ist $F_f$ im FVM-Kontext?', options: ['Die Face-Fläche', 'Der Massenfluss durch ein Face ($\\rho u A$)', 'Der Diffusionsfluss', 'Der Quellterm'], correctIndex: 1, explanation: '$F_f = \\rho u A_f$ ist der konvektive Massenfluss durch das Face.' },
    ],
  },

  'fvm-face-interpolation': {
    lessonId: 'fvm-face-interpolation',
    questions: [
      { id: 'fi-1', type: 'single-choice', question: 'Warum muss $\\phi_f$ am Face interpoliert werden?', options: ['Die Werte sind nur in Zellzentren bekannt, nicht auf Faces', 'Faces haben keine physikalische Bedeutung', 'Die PDE wird am Face gelöst', 'Interpolation ist optional'], correctIndex: 0, explanation: 'FVM speichert Werte in Zellzentren — am Face muss interpoliert werden, um Flüsse zu berechnen.' },
      { id: 'fi-2', type: 'formula-select', question: 'Lineare Interpolation (CDS) für den Face-Wert:', options: ['$\\phi_f = \\frac{1}{2}(\\phi_P + \\phi_E)$', '$\\phi_f = \\phi_P$', '$\\phi_f = \\phi_E$', '$\\phi_f = \\phi_P - \\phi_E$'], correctIndex: 0, explanation: 'CDS (Central Differencing Scheme): linearer Mittelwert $\\phi_f = (\\phi_P + \\phi_E)/2$.' },
      { id: 'fi-3', type: 'single-choice', question: 'Was ist das Problem bei CDS für Konvektion bei hohem Pe?', options: ['Zu langsam', 'Unphysikalische Oszillationen weil negative Koeffizienten auftreten', 'Zu diffusiv', 'Funktioniert nur in 2D'], correctIndex: 1, explanation: 'Bei $|Pe_D| > 2$ erzeugt CDS negative Koeffizienten → Oszillationen, Unboundedness.' },
      { id: 'fi-4', type: 'true-false', question: 'Wahr oder falsch?', statement: 'Das Upwind-Schema (UDS) interpoliert $\\phi_f$ immer als den Wert der stromaufwärts liegenden Zelle.', correct: true, explanation: 'Korrekt — Upwind: $\\phi_f = \\phi_P$ wenn $u > 0$, $\\phi_f = \\phi_E$ wenn $u < 0$.' },
      { id: 'fi-5', type: 'multi-select', question: 'Welche Face-Interpolationsschemata kennst du?', options: ['CDS (Central)', 'UDS (Upwind)', 'TVD (Total Variation Diminishing)', 'Spalart-Allmaras', 'QUICK'], correctIndices: [0, 1, 2, 4], explanation: 'CDS, UDS, TVD und QUICK sind Interpolationsschemata. Spalart-Allmaras ist ein Turbulenzmodell.' },
      { id: 'fi-6', type: 'single-choice', question: 'Was bestimmt die Stencil-Koeffizienten $a_W$, $a_P$, $a_E$?', options: ['Nur die Geometrie', 'Das gewählte Interpolationsschema + Gitter + Physik', 'Nur die Randbedingungen', 'Der Zeitschritt allein'], correctIndex: 1, explanation: 'Die Koeffizienten hängen vom Schema (UDS/CDS/TVD), der Gitterweite, und den physikalischen Parametern (u, Γ) ab.' },
      { id: 'fi-7', type: 'true-false', question: 'Wahr oder falsch?', statement: 'Bei UDS ist der Face-Wert immer gleich dem arithmetischen Mittel der Nachbarzellen.', correct: false, explanation: 'Falsch — das ist CDS. UDS nimmt den Wert der stromaufwärts liegenden Zelle.' },
      { id: 'fi-8', type: 'single-choice', question: 'Wann ist CDS eine gute Wahl?', options: ['Bei hohem Pe (konvektionsdominiert)', 'Bei niedrigem Pe (diffusionsdominiert)', 'Immer', 'Nie'], correctIndex: 1, explanation: 'CDS ist 2. Ordnung und gut bei $|Pe_D| \\leq 2$ (Diffusion dominiert). Bei hohem Pe → Oszillationen.' },
      { id: 'fi-9', type: 'text-input', question: 'Wie nennt man die Eigenschaft, dass ein Schema keine neuen Extrema erzeugt?', acceptedAnswers: ['Boundedness', 'Monotonie', 'Bounded', 'Monoton'], explanation: 'Boundedness/Monotonie: Das Schema erzeugt keine unphysikalischen Über-/Unterschwinger.' },
      { id: 'fi-10', type: 'single-choice', question: 'Was ist das Scarborough-Kriterium?', options: ['$|a_P| \\geq \\sum |a_{nb}|$ (diagonale Dominanz)', 'CFL < 1', 'Pe < 2', 'r < 0.5'], correctIndex: 0, explanation: 'Scarborough: diagonale Dominanz $|a_P| \\geq \\sum |a_{nb}|$ — sichert Konvergenz iterativer Löser.' },
    ],
  },

  'fvm-1d-convection': {
    lessonId: 'fvm-1d-convection',
    questions: [
      { id: 'conv-1', type: 'single-choice', question: 'Was berechnet man bei 1D FVM-Konvektion an jedem Face?', options: ['Druck', 'Konvektiven Fluss $F \\cdot \\phi_f$', 'Temperatur', 'Viskosität'], correctIndex: 1, explanation: 'An jedem Face wird der konvektive Fluss berechnet: Massenfluss × Face-Wert = $F \\cdot \\phi_f$.' },
      { id: 'conv-2', type: 'true-false', question: 'Wahr oder falsch?', statement: 'Bei reiner Konvektion (ohne Diffusion) transportiert UDS das Profil exakt ohne Verschmierung.', correct: false, explanation: 'Falsch — UDS hat numerische Diffusion (1. Ordnung), die das Profil verschmiert.' },
      { id: 'conv-3', type: 'single-choice', question: 'Was ist "numerische Diffusion"?', options: ['Physikalische Diffusion, die man simuliert', 'Künstliche Verschmierung durch das Diskretisierungsschema', 'Ein Fehler im Quellterm', 'Diffusion durch Randbedingungen'], correctIndex: 1, explanation: 'Numerische Diffusion ist ein Artefakt des Schemas (v.a. UDS) — verschmiert scharfe Fronten.' },
      { id: 'conv-4', type: 'multi-select', question: 'Welche Probleme kann CDS bei Konvektion haben?', options: ['Oszillationen bei hohem Pe', 'Unboundedness (Werte außerhalb des physikalischen Bereichs)', 'Negative Koeffizienten im Gleichungssystem', 'Zu viel numerische Diffusion'], correctIndices: [0, 1, 2], explanation: 'CDS bei hohem Pe: negative Koeffizienten → Oszillationen und Unboundedness. UDS hat dagegen zu viel num. Diffusion.' },
      { id: 'conv-5', type: 'formula-select', question: 'Die diskrete Konvektionsgleichung für Zelle P lautet:', options: ['$a_P \\phi_P = a_W \\phi_W + a_E \\phi_E + b$', '$\\phi_P = \\phi_W + \\phi_E$', '$\\nabla \\phi = 0$', '$\\phi_P^{n+1} = 0$'], correctIndex: 0, explanation: 'FVM-Diskretisierung: $a_P \\phi_P = a_W \\phi_W + a_E \\phi_E + b$ — lineares Gleichungssystem pro Zelle.' },
      { id: 'conv-6', type: 'single-choice', question: 'Was muss für die Koeffizientsumme gelten: $a_W + a_P + a_E = ?$', options: ['0', '1', 'Beliebig', '$\\Delta x$'], correctIndex: 1, explanation: 'Bei einer Transportgleichung ohne Quellterm: $a_W + a_P + a_E = 1$ (Konsistenz).' },
      { id: 'conv-7', type: 'true-false', question: 'Wahr oder falsch?', statement: 'Wenn alle Koeffizienten $a_W$, $a_P$, $a_E$ positiv sind, ist das Schema monoton.', correct: true, explanation: 'Positive Koeffizienten → keine neuen Extrema → Monotonie/Boundedness gewährleistet.' },
      { id: 'conv-8', type: 'text-input', question: 'Was ist der konvektive Massenfluss durch ein Face mit Fläche A, Geschwindigkeit u und Dichte ρ?', acceptedAnswers: ['rho u A', 'ρuA', 'rho*u*A', 'F = rho u A'], hint: 'Drei Größen multipliziert', explanation: 'Konvektiver Massenfluss: $F = \\rho u A$ — Dichte × Geschwindigkeit × Fläche.' },
      { id: 'conv-9', type: 'single-choice', question: 'Was passiert mit einer Stufenfunktion bei UDS-Konvektion über viele Zeitschritte?', options: ['Bleibt scharf', 'Wird verschmiert (numerische Diffusion)', 'Entwickelt Oszillationen', 'Verschwindet'], correctIndex: 1, explanation: 'UDS verschmiert scharfe Fronten durch numerische Diffusion — das ist der Preis für Bounded-ness.' },
      { id: 'conv-10', type: 'single-choice', question: 'Wie löst man das tridiagonale System $a_W \\phi_{i-1} + a_P \\phi_i + a_E \\phi_{i+1} = b_i$?', options: ['Gauss-Elimination', 'Thomas-Algorithmus (TDMA)', 'Newton-Verfahren', 'Bisektionsverfahren'], correctIndex: 1, explanation: 'TDMA (Thomas-Algorithmus) ist der effiziente Direktlöser für tridiagonale Systeme — O(N) Aufwand.' },
    ],
  },

  'fvm-fvm-vs-fdm': {
    lessonId: 'fvm-fvm-vs-fdm',
    questions: [
      { id: 'vvf-1', type: 'multi-select', question: 'Welche Vorteile hat FVM gegenüber FDM?', options: ['Automatisch konservativ', 'Funktioniert auf unstrukturierten Gittern', 'Immer höhere Ordnung', 'Natürliche Behandlung von Randbedingungen über Flüsse', 'Einfacher zu programmieren'], correctIndices: [0, 1, 3], explanation: 'FVM: konservativ, flexible Gitter, natürliche Fluss-BCs. Nicht immer höhere Ordnung oder einfacher.' },
      { id: 'vvf-2', type: 'true-false', question: 'Wahr oder falsch?', statement: 'FDM kann nur auf strukturierten Gittern angewandt werden.', correct: true, explanation: 'Korrekt — klassische FDM braucht eine regelmäßige i,j,k-Struktur für die Nachbarindex-Berechnung.' },
      { id: 'vvf-3', type: 'single-choice', question: 'In welchem Sinn ist FVM "konservativ"?', options: ['Es konvergiert schnell', 'Der Fluss durch ein gemeinsames Face ist identisch für beide Nachbarzellen', 'Es hat minimalen Speicherbedarf', 'Es ist immer stabil'], correctIndex: 1, explanation: 'Konservativität: Was aus einer Zelle rausfließt, fließt in die Nachbarzelle rein — exakte Bilanz.' },
      { id: 'vvf-4', type: 'single-choice', question: 'Wann liefern FVM und FDM das gleiche Gleichungssystem?', options: ['Immer', 'Nie', 'Auf äquidistantem Gitter mit gleichen Schemata', 'Nur in 3D'], correctIndex: 2, explanation: 'Auf äquidistantem Gitter mit gleichen Approximationen (z.B. CDS) ergeben FVM und FDM identische Gleichungen.' },
      { id: 'vvf-5', type: 'true-false', question: 'Wahr oder falsch?', statement: 'FDM ist einfacher zu implementieren, dafür weniger flexibel bei der Gitterwahl.', correct: true, explanation: 'Korrekt — FDM ist konzeptionell einfacher, braucht aber strukturierte Gitter.' },
      { id: 'vvf-6', type: 'single-choice', question: 'Was nutzt FVM anstelle der Taylor-Entwicklung?', options: ['Variationsrechnung', 'Integrale Bilanz + Gaußscher Integralsatz', 'Fourier-Transformation', 'Spektrale Methoden'], correctIndex: 1, explanation: 'FVM: Integration der PDE über Kontrollvolumen + Gaußscher Satz → Flächenintegrale.' },
      { id: 'vvf-7', type: 'text-input', question: 'Welchen Integralsatz wendet FVM an, um Volumen- in Flächenintegrale umzuwandeln?', acceptedAnswers: ['Gaußscher Integralsatz', 'Gauss', 'Gauß', 'Divergenzsatz', 'Gaußscher Satz'], explanation: 'Der Gaußsche Integralsatz (Divergenzsatz): $\\int_V \\nabla \\cdot \\mathbf{F} \\, dV = \\oint_A \\mathbf{F} \\cdot \\mathbf{n} \\, dA$.' },
      { id: 'vvf-8', type: 'single-choice', question: 'Was speichert FVM als primäre Unbekannte?', options: ['Knotenwerte (an Gitterecken)', 'Zellmittelwerte (in Zellzentren)', 'Face-Werte', 'Gradienten'], correctIndex: 1, explanation: 'FVM (cell-centered) speichert Zellmittelwerte $\\phi_P \\approx \\frac{1}{V}\\int_V \\phi \\, dV$.' },
      { id: 'vvf-9', type: 'multi-select', question: 'Welche Methoden werden in kommerzieller CFD-Software genutzt?', options: ['FVM (Standard)', 'FDM (selten)', 'FEM (Strukturmechanik, manche CFD-Codes)', 'SPH (Spezialanwendungen)'], correctIndices: [0, 1, 2, 3], explanation: 'Alle werden genutzt, aber FVM dominiert in der CFD-Praxis.' },
      { id: 'vvf-10', type: 'true-false', question: 'Wahr oder falsch?', statement: 'FVM erfordert immer strukturierte Gitter.', correct: false, explanation: 'Falsch — ein Hauptvorteil von FVM ist die Funktionalität auf unstrukturierten und hybriden Gittern.' },
    ],
  },

   // ═══════════════════════════════════════════════════════════════
  // 4. SCHEMATA
  // ═══════════════════════════════════════════════════════════════

  'schemes-uds': {
    lessonId: 'schemes-uds',
    questions: [
      { id: 'uds-1', type: 'single-choice', question: 'Was ist das Upwind-Schema (UDS)?', options: ['Face-Wert = Mittelwert der Nachbarn', 'Face-Wert = Wert der stromaufwärts liegenden Zelle', 'Face-Wert = Wert der stromabwärts liegenden Zelle', 'Face-Wert = 0'], correctIndex: 1, explanation: 'UDS: $\\phi_f = \\phi_{\\text{upwind}}$ — der Wert kommt von der Zelle, aus der die Strömung kommt.' },
      { id: 'uds-2', type: 'single-choice', question: 'Welche Ordnung hat UDS?', options: ['0. Ordnung', '1. Ordnung', '2. Ordnung', '3. Ordnung'], correctIndex: 1, explanation: 'UDS ist 1. Ordnung genau — der führende Fehlerterm ist proportional zu Δx.' },
      { id: 'uds-3', type: 'true-false', question: 'Wahr oder falsch?', statement: 'UDS ist unbedingt bounded (monoton), erzeugt also keine Oszillationen.', correct: true, explanation: 'Korrekt — UDS hat nur positive Koeffizienten und erfüllt die Scarborough-Bedingung.' },
      { id: 'uds-4', type: 'single-choice', question: 'Was ist der Hauptnachteil von UDS?', options: ['Instabilität', 'Starke numerische Diffusion (Verschmierung)', 'Divergenz', 'Braucht sehr feine Gitter'], correctIndex: 1, explanation: 'UDS erzeugt numerische Diffusion — scharfe Gradienten werden verschmiert.' },
      { id: 'uds-5', type: 'formula-select', question: 'Für $u > 0$ und Face e zwischen P und E: $\\phi_e = ?$', options: ['$\\phi_P$', '$\\phi_E$', '$(\\phi_P + \\phi_E)/2$', '$\\phi_P - \\phi_E$'], correctIndex: 0, explanation: 'Bei $u > 0$ liegt P stromaufwärts → $\\phi_e = \\phi_P$ (Upwind).' },
      { id: 'uds-6', type: 'multi-select', question: 'Welche Eigenschaften hat UDS?', options: ['Bounded/Monoton', '1. Ordnung', 'Numerisch diffusiv', 'Unbedingt stabil', 'Erzeugt Oszillationen'], correctIndices: [0, 1, 2, 3], explanation: 'UDS: bounded, 1. Ordnung, diffusiv, stabil. Keine Oszillationen.' },
      { id: 'uds-7', type: 'true-false', question: 'Wahr oder falsch?', statement: 'Der führende Fehlerterm von UDS wirkt wie eine künstliche Diffusion mit $\\Gamma_{\\text{num}} = \\frac{|u|\\Delta x}{2}$.', correct: true, explanation: 'Korrekt — Taylor-Analyse zeigt: UDS hat einen Fehlerterm $\\frac{|u|\\Delta x}{2} \\frac{\\partial^2 \\phi}{\\partial x^2}$.' },
      { id: 'uds-8', type: 'text-input', question: 'Was bedeutet "Upwind" wörtlich übersetzt?', acceptedAnswers: ['Windaufwärts', 'stromaufwärts', 'gegen den Wind'], hint: 'Richtung des Windes', explanation: 'Upwind = windaufwärts/stromaufwärts — Information wird aus der Richtung genommen, aus der die Strömung kommt.' },
      { id: 'uds-9', type: 'single-choice', question: 'In welcher Situation ist UDS akzeptabel genau?', options: ['Immer', 'Wenn die Strömung parallel zum Gitter ist und das Gitter fein genug', 'Nie — man sollte immer CDS nutzen', 'Nur für inkompressible Strömungen'], correctIndex: 1, explanation: 'UDS ist akzeptabel, wenn Strömung und Gitter ausgerichtet sind und Δx klein genug ist.' },
      { id: 'uds-10', type: 'single-choice', question: 'Was zeigt ein Vergleich UDS vs. CDS bei einer Stufenfunktion?', options: ['UDS schärfer, CDS verschmiert', 'UDS verschmiert, CDS oszilliert (bei hohem Pe)', 'Beide identisch', 'CDS divergiert immer'], correctIndex: 1, explanation: 'UDS verschmiert die Stufe (num. Diffusion), CDS zeigt Oszillationen bei hohem Pe (Wiggles).' },
    ],
  },

  'schemes-cds': {
    lessonId: 'schemes-cds',
    questions: [
      { id: 'cds-1', type: 'single-choice', question: 'Welche Ordnung hat CDS?', options: ['1. Ordnung', '2. Ordnung', '3. Ordnung', '0. Ordnung'], correctIndex: 1, explanation: 'CDS = Central Differencing Scheme, 2. Ordnung genau.' },
      { id: 'cds-2', type: 'formula-select', question: 'CDS-Interpolation für den Face-Wert:', options: ['$\\phi_f = \\frac{\\phi_P + \\phi_E}{2}$', '$\\phi_f = \\phi_P$', '$\\phi_f = \\frac{3\\phi_P - \\phi_W}{2}$', '$\\phi_f = \\max(\\phi_P, \\phi_E)$'], correctIndex: 0, explanation: 'CDS: $\\phi_f = (\\phi_P + \\phi_E)/2$ — linearer Mittelwert.' },
      { id: 'cds-3', type: 'true-false', question: 'Wahr oder falsch?', statement: 'CDS ist für rein konvektive Probleme bei hohem Peclet-Zahl stets oscillationsfrei.', correct: false, explanation: 'Falsch — CDS erzeugt bei $|Pe_D| > 2$ negative Koeffizienten → Oszillationen.' },
      { id: 'cds-4', type: 'single-choice', question: 'Wann hat CDS negative Koeffizienten?', options: ['Immer', 'Wenn $|Pe_D| = |\\rho u \\Delta x / \\Gamma| > 2$', 'Nie', 'Wenn Δt zu groß ist'], correctIndex: 1, explanation: 'CDS wird problematisch wenn $|Pe_D| > 2$ — dann kann $a_W$ oder $a_E$ negativ werden.' },
      { id: 'cds-5', type: 'multi-select', question: 'Welche Eigenschaften hat CDS?', options: ['2. Ordnung genau', 'Keine numerische Diffusion', 'Unbounded bei hohem Pe', 'Immer stabil', 'Am besten für diffusionsdominierte Probleme'], correctIndices: [0, 1, 2, 4], explanation: 'CDS: 2. Ordnung, keine num. Diffusion, aber unbounded bei hohem Pe. Nicht immer stabil!' },
      { id: 'cds-6', type: 'single-choice', question: 'Was ist die Ursache der CDS-Oszillationen?', options: ['Rundungsfehler', 'Negative Nichtdiagonal-Koeffizienten im Gleichungssystem', 'Zu feines Gitter', 'Falsche Randbedingungen'], correctIndex: 1, explanation: 'Negative Koeffizienten verletzen die Scarborough-Bedingung → Lösung kann oszillieren.' },
      { id: 'cds-7', type: 'true-false', question: 'Wahr oder falsch?', statement: 'CDS hat keine numerische (künstliche) Diffusion im Gegensatz zu UDS.', correct: true, explanation: 'Korrekt — der führende Fehlerterm von CDS ist dispersiv (ungerade Ordnung), nicht diffusiv.' },
      { id: 'cds-8', type: 'text-input', question: 'Ab welchem Wert der Zell-Peclet-Zahl wird CDS problematisch?', acceptedAnswers: ['2', 'Pe > 2', '|Pe| > 2'], explanation: 'Bei $|Pe_D| > 2$ erzeugt CDS negative Koeffizienten → Oszillationen möglich.' },
      { id: 'cds-9', type: 'single-choice', question: 'Was ist die Zell-Peclet-Zahl $Pe_D$?', options: ['$\\rho u \\Delta x / \\Gamma$', '$u \\Delta t / \\Delta x$', '$\\alpha \\Delta t / \\Delta x^2$', '$Re \\cdot Pr$'], correctIndex: 0, explanation: '$Pe_D = \\rho u \\Delta x / \\Gamma$ — Verhältnis von Konvektion zu Diffusion auf Zellebene.' },
      { id: 'cds-10', type: 'single-choice', question: 'Welche Lösung bieten TVD-Schemata für das CDS-UDS-Dilemma?', options: ['Immer CDS verwenden', 'Blend zwischen UDS und höherer Ordnung, begrenzt durch Limiter', 'Immer UDS verwenden', 'Gitter verfeinern bis CDS funktioniert'], correctIndex: 1, explanation: 'TVD-Schemata blenden zwischen UDS (sicher) und höherer Ordnung (genau) mittels Flux-Limiter.' },
    ],
  },

  'schemes-tvd': {
    lessonId: 'schemes-tvd',
    questions: [
      { id: 'tvd-1', type: 'text-input', question: 'Wofür steht TVD?', acceptedAnswers: ['Total Variation Diminishing'], hint: 'Drei englische Wörter', explanation: 'TVD = Total Variation Diminishing — die Totalvariation der Lösung nimmt nicht zu.' },
      { id: 'tvd-2', type: 'single-choice', question: 'Was ist das Ziel von TVD-Schemata?', options: ['Maximale Genauigkeit', '2. Ordnung Genauigkeit UND Boundedness', 'Minimaler Rechenaufwand', 'Exakte Lösung'], correctIndex: 1, explanation: 'TVD: Kombination aus hoher Ordnung (wo glatt) und Monotonie (an Diskontinuitäten).' },
      { id: 'tvd-3', type: 'single-choice', question: 'Was ist der "Flux Limiter" $\\psi(r)$?', options: ['Ein Zeitschritt-Begrenzer', 'Eine Funktion, die das Schema lokal zwischen UDS und höherer Ordnung schaltet', 'Ein Druckbegrenzer', 'Ein Gitterverfeinerungskriterium'], correctIndex: 1, explanation: 'Der Limiter $\\psi(r)$ steuert, wie viel höheren Ordnung beigemischt wird: $\\psi=0$ → UDS, $\\psi=1$ → CDS.' },
      { id: 'tvd-4', type: 'formula-select', question: 'Der Gradient-Ratio $r$ bei TVD ist definiert als:', options: ['$r = \\frac{\\phi_P - \\phi_W}{\\phi_E - \\phi_P}$', '$r = \\frac{\\phi_E - \\phi_W}{\\Delta x}$', '$r = \\frac{\\Delta t}{\\Delta x}$', '$r = Pe$'], correctIndex: 0, explanation: '$r$ = Verhältnis aufeinanderfolgender Gradienten — misst die Glattheit der Lösung.' },
      { id: 'tvd-5', type: 'multi-select', question: 'Welche bekannten TVD-Limiter gibt es?', options: ['Van Leer', 'Minmod', 'Superbee', 'QUICK', 'Van Albada'], correctIndices: [0, 1, 2, 4], explanation: 'Van Leer, Minmod, Superbee, Van Albada sind TVD-Limiter. QUICK ist ein separates 3. Ordnung-Schema.' },
      { id: 'tvd-6', type: 'true-false', question: 'Wahr oder falsch?', statement: 'Bei r < 0 (lokales Extremum) schaltet ein TVD-Schema automatisch auf UDS um.', correct: true, explanation: 'Korrekt — bei $r < 0$ ist $\\psi(r) = 0$ → reines Upwind, da ein Extremum vorliegt.' },
      { id: 'tvd-7', type: 'single-choice', question: 'Was passiert bei $r \\approx 1$ (glatte Lösung)?', options: ['UDS-Verhalten', 'CDS-Verhalten (ψ ≈ 1)', 'Schema divergiert', 'Keine Aussage möglich'], correctIndex: 1, explanation: 'Bei $r \\approx 1$ ist das Profil glatt → volle höhere Ordnung erlaubt, $\\psi \\approx 1$.' },
      { id: 'tvd-8', type: 'single-choice', question: 'Was ist das Sweby-Diagramm?', options: ['Ein Konvergenzplot', 'Ein Diagramm, das den zulässigen Bereich für TVD-Limiter zeigt', 'Ein Gitter-Diagramm', 'Ein Fehlerplot'], correctIndex: 1, explanation: 'Das Sweby-Diagramm zeigt die Region im $r$-$\\psi$-Raum, in der ein Schema TVD-Eigenschaften hat.' },
      { id: 'tvd-9', type: 'true-false', question: 'Wahr oder falsch?', statement: 'TVD-Schemata sind überall genau 2. Ordnung.', correct: false, explanation: 'Falsch — an Diskontinuitäten/Extrema reduzieren TVD-Limiter auf 1. Ordnung (UDS). Nur glatte Bereiche: 2. Ordnung.' },
      { id: 'tvd-10', type: 'single-choice', question: 'Welcher Limiter ist am diffusivsten (konservativsten)?', options: ['Superbee', 'Van Leer', 'Minmod', 'Kein Limiter (CDS)'], correctIndex: 2, explanation: 'Minmod ist der diffusivste TVD-Limiter — bleibt am nächsten an UDS, dafür am stabilsten.' },
    ],
  },

  'schemes-compare': {
    lessonId: 'schemes-compare',
    questions: [
      { id: 'scomp-1', type: 'multi-select', question: 'Ordne die Schemata nach zunehmender Genauigkeit:', options: ['UDS (1. Ordnung)', 'CDS (2. Ordnung)', 'TVD (lokal 1.-2. Ordnung)', 'QUICK (3. Ordnung)'], correctIndices: [0, 2, 1, 3], explanation: 'Genauigkeit: UDS(1) < TVD(1-2) < CDS(2) < QUICK(3). Aber CDS unbounded bei hohem Pe!' },
      { id: 'scomp-2', type: 'true-false', question: 'Wahr oder falsch?', statement: 'Höhere Ordnung ist immer besser als niedrigere Ordnung.', correct: false, explanation: 'Falsch — höhere Ordnung kann Oszillationen erzeugen. Bounded-ness ist oft wichtiger als Ordnung.' },
      { id: 'scomp-3', type: 'single-choice', question: 'Welches Schema empfiehlt sich als Standard für konvektive Strömungen?', options: ['UDS', 'CDS', 'TVD (z.B. Van Leer)', 'FTCS'], correctIndex: 2, explanation: 'TVD-Schemata bieten den besten Kompromiss: 2. Ordnung wo möglich, monoton an Diskontinuitäten.' },
      { id: 'scomp-4', type: 'single-choice', question: 'Warum wird UDS trotzdem noch verwendet?', options: ['Es ist das genaueste Schema', 'Es ist robust, stabil und dient als Fallback (z.B. in TVD bei r<0)', 'Es ist der Standard in OpenFOAM', 'Es hat keine Nachteile'], correctIndex: 1, explanation: 'UDS ist robust und stabil — TVD-Limiter fallen bei Extrema auf UDS zurück.' },
      { id: 'scomp-5', type: 'multi-select', question: 'Welche Kriterien sind bei der Schema-Wahl wichtig?', options: ['Ordnung der Genauigkeit', 'Bounded-ness (Monotonie)', 'Rechenaufwand', 'Stabilität', 'Konservativität'], correctIndices: [0, 1, 2, 3, 4], explanation: 'Alle fünf Kriterien spielen bei der Schema-Wahl eine Rolle.' },
      { id: 'scomp-6', type: 'true-false', question: 'Wahr oder falsch?', statement: 'TVD-Schemata sind teurer als UDS, weil sie den Gradient-Ratio berechnen müssen.', correct: true, explanation: 'Korrekt — TVD braucht extra Arbeit für $r$-Berechnung und Limiter-Auswertung.' },
      { id: 'scomp-7', type: 'single-choice', question: 'Was passiert wenn man CDS bei $Pe_D = 100$ verwendet?', options: ['Perfekte Lösung', 'Starke Oszillationen / Divergenz', 'Leichte Verschmierung', 'Gleich wie UDS'], correctIndex: 1, explanation: 'Bei $Pe_D = 100 \\gg 2$: CDS erzeugt stark negative Koeffizienten → Oszillationen oder Divergenz.' },
      { id: 'scomp-8', type: 'text-input', question: 'Welches Theorem besagt: "Es gibt kein lineares Schema höherer Ordnung, das gleichzeitig monoton ist"?', acceptedAnswers: ['Godunov', 'Godunovs Theorem', 'Godunov-Theorem'], hint: 'Russischer Mathematiker', explanation: 'Godunovs Theorem: Lineare monotone Schemata sind höchstens 1. Ordnung → TVD nutzt nichtlineare Limiter.' },
      { id: 'scomp-9', type: 'single-choice', question: 'Was lösen TVD-Schemata bezüglich Godunovs Theorem?', options: ['Sie widersprechen dem Theorem', 'Sie umgehen es durch nichtlineare Limiter', 'Sie sind linear und monoton', 'Sie nutzen nur 1. Ordnung'], correctIndex: 1, explanation: 'TVD-Limiter sind nichtlinear (lösungsabhängig) → Godunov gilt nicht, da es nur für lineare Schemata gilt.' },
      { id: 'scomp-10', type: 'single-choice', question: 'Was ist QUICK?', options: ['Ein TVD-Schema', 'Quadratic Upstream Interpolation for Convective Kinematics — 3. Ordnung Schema', 'Ein Zeitintegrationsverfahren', 'Ein Turbulenzmodell'], correctIndex: 1, explanation: 'QUICK = Quadratic Upstream Interpolation — nutzt 3 Punkte für 3. Ordnung Genauigkeit, aber nicht TVD.' },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // 5. STABILITÄT
  // ═══════════════════════════════════════════════════════════════

  'stability-cfl': {
    lessonId: 'stability-cfl',
    questions: [
      { id: 'cfl-1', type: 'formula-select', question: 'Wie ist die CFL-Zahl definiert?', options: ['$\\text{CFL} = \\frac{u \\Delta t}{\\Delta x}$', '$\\text{CFL} = \\frac{\\alpha \\Delta t}{\\Delta x^2}$', '$\\text{CFL} = \\frac{u \\Delta x}{\\Gamma}$', '$\\text{CFL} = \\frac{\\Delta t}{\\Delta x^2}$'], correctIndex: 0, explanation: '$\\text{CFL} = u\\Delta t / \\Delta x$ — Verhältnis der physikalischen zur numerischen Ausbreitungsgeschwindigkeit.' },
      { id: 'cfl-2', type: 'text-input', question: 'Wofür steht CFL?', acceptedAnswers: ['Courant-Friedrichs-Lewy', 'Courant Friedrichs Lewy'], explanation: 'CFL = Courant-Friedrichs-Lewy — benannt nach den drei Mathematikern, die die Bedingung 1928 formulierten.' },
      { id: 'cfl-3', type: 'single-choice', question: 'Was besagt die CFL-Bedingung für explizite Konvektionsverfahren?', options: ['CFL < 0.5', 'CFL ≤ 1', 'CFL kann beliebig sein', 'CFL > 1 für Stabilität'], correctIndex: 1, explanation: 'CFL ≤ 1: Der numerische Informationsbereich muss den physikalischen enthalten.' },
      { id: 'cfl-4', type: 'true-false', question: 'Wahr oder falsch?', statement: 'Die CFL-Bedingung gilt auch für implizite Verfahren als strikte Stabilitätsgrenze.', correct: false, explanation: 'Falsch — implizite Verfahren sind oft unbedingt stabil. CFL beeinflusst nur die Genauigkeit, nicht die Stabilität.' },
      { id: 'cfl-5', type: 'single-choice', question: 'Was bedeutet CFL > 1 physikalisch?', options: ['Die Simulation ist schnell', 'Information wandert in einem Zeitschritt weiter als eine Zelle → explizites Schema "sieht" die Info nicht', 'Das Gitter ist zu fein', 'Die Lösung ist genau'], correctIndex: 1, explanation: 'CFL > 1: Welle wandert weiter als Δx pro Zeitschritt → expliziter Stencil erfasst die Information nicht.' },
      { id: 'cfl-6', type: 'multi-select', question: 'Was kann man tun, wenn CFL > 1 bei explizitem Schema?', options: ['Δt verkleinern', 'Δx vergrößern', 'Auf implizites Schema wechseln', 'Geschwindigkeit u reduzieren (nicht sinnvoll)'], correctIndices: [0, 1, 2], explanation: 'Δt↓, Δx↑ oder implizit. Die Physik (u) kann man natürlich nicht ändern.' },
      { id: 'cfl-7', type: 'formula-select', question: 'In 2D lautet die CFL-Bedingung für explizite Konvektion:', options: ['$\\frac{|u|\\Delta t}{\\Delta x} + \\frac{|v|\\Delta t}{\\Delta y} \\leq 1$', '$\\frac{|u|\\Delta t}{\\Delta x} \\leq 1$ und $\\frac{|v|\\Delta t}{\\Delta y} \\leq 1$', '$\\frac{u^2 + v^2}{\\Delta x^2} \\Delta t \\leq 1$', '$\\max(|u|,|v|) \\cdot \\Delta t \\leq \\min(\\Delta x, \\Delta y)$'], correctIndex: 0, explanation: '2D: $\\frac{|u|\\Delta t}{\\Delta x} + \\frac{|v|\\Delta t}{\\Delta y} \\leq 1$ — strenger als in 1D.' },
      { id: 'cfl-8', type: 'single-choice', question: 'Was passiert bei CFL = 1 mit dem expliziten Upwind-Schema?', options: ['Divergenz', 'Exakte Lösung (kein numerischer Fehler)', 'Maximaler Fehler', 'Schema wird implizit'], correctIndex: 1, explanation: 'Bei CFL = 1 transportiert UDS die Lösung exakt eine Zelle pro Zeitschritt → kein Diskretisierungsfehler!' },
      { id: 'cfl-9', type: 'true-false', question: 'Wahr oder falsch?', statement: 'Die CFL-Bedingung stammt aus dem Jahr 1928.', correct: true, explanation: 'Korrekt — Courant, Friedrichs und Lewy publizierten die Bedingung 1928.' },
      { id: 'cfl-10', type: 'single-choice', question: 'Woraus besteht die CFL-Bedingung geometrisch?', options: ['Das physikalische Abhängigkeitsgebiet muss im numerischen Abhängigkeitsgebiet liegen', 'Die Zelle muss quadratisch sein', 'Der Stencil muss symmetrisch sein', 'Die Randbedingungen müssen kompatibel sein'], correctIndex: 0, explanation: 'Geometrisch: Domain of Dependence — der physikalische Einflussbereich muss vom numerischen Stencil abgedeckt werden.' },
    ],
  },

  'stability-peclet': {
    lessonId: 'stability-peclet',
    questions: [
      { id: 'pe-1', type: 'formula-select', question: 'Die Zell-Peclet-Zahl $Pe_D$ ist definiert als:', options: ['$Pe_D = \\frac{\\rho u \\Delta x}{\\Gamma}$', '$Pe_D = \\frac{u \\Delta t}{\\Delta x}$', '$Pe_D = \\frac{\\alpha \\Delta t}{\\Delta x^2}$', '$Pe_D = Re \\cdot Pr$'], correctIndex: 0, explanation: '$Pe_D = \\rho u \\Delta x / \\Gamma$ — Konvektion vs. Diffusion auf Zellebene.' },
      { id: 'pe-2', type: 'single-choice', question: 'Was bedeutet $Pe_D \\gg 1$?', options: ['Diffusion dominiert', 'Konvektion dominiert', 'Gleichgewicht', 'Instabilität'], correctIndex: 1, explanation: '$Pe_D \\gg 1$: Konvektion überwiegt Diffusion → Upwind-Schemata wichtig.' },
      { id: 'pe-3', type: 'single-choice', question: 'Welches Schema ist bei $Pe_D \\ll 1$ am besten?', options: ['UDS', 'CDS', 'TVD', 'Kein Schema nötig'], correctIndex: 1, explanation: 'Bei $Pe_D \\ll 1$ (Diffusion dominiert) ist CDS ideal: 2. Ordnung, keine Oszillationen.' },
      { id: 'pe-4', type: 'true-false', question: 'Wahr oder falsch?', statement: 'Die Peclet-Zahl ist eine lokale Größe, die sich von Zelle zu Zelle unterscheiden kann.', correct: true, explanation: 'Korrekt — Pe_D hängt von der lokalen Geschwindigkeit und Gitterweite ab.' },
      { id: 'pe-5', type: 'multi-select', question: 'Welche Parameter beeinflussen die Zell-Peclet-Zahl?', options: ['Geschwindigkeit u', 'Gitterweite Δx', 'Diffusionskoeffizient Γ', 'Zeitschritt Δt', 'Dichte ρ'], correctIndices: [0, 1, 2, 4], explanation: '$Pe_D = \\rho u \\Delta x / \\Gamma$ — der Zeitschritt Δt geht nicht ein.' },
      { id: 'pe-6', type: 'single-choice', question: 'Wie kann man $Pe_D$ reduzieren?', options: ['Gitter verfeinern (Δx ↓)', 'Größere Zeitschritte', 'Geschwindigkeit erhöhen', 'Viskosität reduzieren'], correctIndex: 0, explanation: 'Gitterverfeinerung: $\\Delta x \\downarrow \\Rightarrow Pe_D \\downarrow$ — CDS wird anwendbar.' },
      { id: 'pe-7', type: 'formula-select', question: 'Die globale Peclet-Zahl (Reynolds×Prandtl) lautet:', options: ['$Pe = Re \\cdot Pr = \\frac{UL}{\\alpha}$', '$Pe = \\frac{U\\Delta x}{\\Gamma}$', '$Pe = \\frac{\\Delta t}{\\Delta x}$', '$Pe = CFL$'], correctIndex: 0, explanation: 'Globale Peclet-Zahl: $Pe = Re \\cdot Pr = UL/\\alpha$ — charakterisiert das Gesamtproblem.' },
      { id: 'pe-8', type: 'true-false', question: 'Wahr oder falsch?', statement: 'Wenn $Pe_D = 2$, hat CDS gerade noch positive Koeffizienten.', correct: true, explanation: 'Genau bei $|Pe_D| = 2$ wird der Nachbarkoeffizient null — darüber negativ → Oszillationsgefahr.' },
      { id: 'pe-9', type: 'text-input', question: 'Welches Konzept verbindet Pe-Zahl und Schema-Wahl: CDS bei kleinem Pe, UDS bei großem Pe?', acceptedAnswers: ['Hybrid-Schema', 'Hybrid', 'Power-Law-Schema', 'Hybrid Scheme'], hint: 'Kombination zweier Schemata', explanation: 'Das Hybrid-Schema oder Power-Law-Schema schaltet zwischen CDS und UDS basierend auf Pe_D.' },
      { id: 'pe-10', type: 'single-choice', question: 'Was zeigt das "Exact Solution"-Profil bei 1D Konvektion-Diffusion für Pe → ∞?', options: ['Lineares Profil', 'Stufenprofil (Grenzschicht am Auslass)', 'Parabolisches Profil', 'Konstantes Profil'], correctIndex: 1, explanation: 'Bei Pe → ∞ verschwindet die Diffusion → scharfe Grenzschicht am Auslassrand.' },
    ],
  },

  'stability-vonneumann': {
    lessonId: 'stability-vonneumann',
    questions: [
      { id: 'vn-1', type: 'single-choice', question: 'Was ist die Grundidee der Von-Neumann-Stabilitätsanalyse?', options: ['Taylor-Entwicklung des Fehlers', 'Zerlegung des Fehlers in Fourier-Moden und Prüfung des Verstärkungsfaktors', 'Energiemethode', 'Iteration bis Konvergenz'], correctIndex: 1, explanation: 'Von-Neumann: Fehler $e_j^n = G^n e^{ik j\\Delta x}$ → Prüfe ob Verstärkungsfaktor $|G| \\leq 1$.' },
      { id: 'vn-2', type: 'formula-select', question: 'Die Stabilitätsbedingung lautet:', options: ['$|G(k)| \\leq 1$ für alle Wellenzahlen $k$', '$|G| > 1$', '$G = 0$', '$|G| = \\Delta t$'], correctIndex: 0, explanation: '$|G(k)| \\leq 1$ für alle Wellenzahlen $k$ — Fehler darf nicht wachsen.' },
      { id: 'vn-3', type: 'text-input', question: 'Wie heißt der Faktor $G$, der das Fehlerwachstum pro Zeitschritt beschreibt?', acceptedAnswers: ['Verstärkungsfaktor', 'Amplification Factor', 'G', 'Amplifikationsfaktor'], explanation: '$G$ = Verstärkungsfaktor (amplification factor) — gibt an, wie sich Fourier-Moden pro Zeitschritt entwickeln.' },
      { id: 'vn-4', type: 'single-choice', question: 'Was passiert bei $|G| > 1$?', options: ['Lösung konvergiert', 'Fehler wächst exponentiell → Instabilität', 'Lösung bleibt konstant', 'Nur Phasenverschiebung'], correctIndex: 1, explanation: 'Bei $|G| > 1$: Fehler wächst mit $|G|^n$ → nach vielen Zeitschritten Divergenz.' },
      { id: 'vn-5', type: 'true-false', question: 'Wahr oder falsch?', statement: 'Die Von-Neumann-Analyse funktioniert nur für lineare Gleichungen mit konstanten Koeffizienten.', correct: true, explanation: 'Korrekt — sie setzt Linearität und konstante Koeffizienten voraus. Für nichtlineare Probleme: nur lokal anwendbar.' },
      { id: 'vn-6', type: 'single-choice', question: 'Wie setzt man $e_j^n$ im Fourier-Ansatz an?', options: ['$e_j^n = A \\cdot n$', '$e_j^n = G^n \\cdot e^{ik j \\Delta x}$', '$e_j^n = \\sin(j\\Delta x)$', '$e_j^n = 0$'], correctIndex: 1, explanation: 'Fourier-Ansatz: $e_j^n = G^n e^{ikj\\Delta x}$ — nach n Zeitschritten wird G n-mal multipliziert.' },
      { id: 'vn-7', type: 'multi-select', question: 'Welche Ergebnisse liefert die Von-Neumann-Analyse für explizite Diffusion?', options: ['$r \\leq 0.5$ für Stabilität', '$|G| = |1 - 4r \\sin^2(k\\Delta x /2)|$', 'CFL ≤ 1', 'Unbedingte Stabilität'], correctIndices: [0, 1], explanation: 'Für explizite Diffusion: $|G| \\leq 1 \\Leftrightarrow r \\leq 0.5$. CFL ist für Konvektion; nicht unbedingt stabil.' },
      { id: 'vn-8', type: 'true-false', question: 'Wahr oder falsch?', statement: 'Implizite Verfahren haben immer $|G| \\leq 1$ für alle Δt.', correct: true, explanation: 'Korrekt (für Diffusion) — der Verstärkungsfaktor des impliziten Euler ist $1/(1+4r\\sin^2) < 1$ für alle r > 0.' },
      { id: 'vn-9', type: 'single-choice', question: 'Was ist $|G|$ für explizites Euler + CDS bei der Konvektionsgleichung?', options: ['Immer < 1', 'Immer > 1 → Schema ist unbedingt instabil!', 'Abhängig von CFL', 'Immer = 1'], correctIndex: 1, explanation: 'FTCS (Forward Time Central Space) für Konvektion ist unbedingt instabil — $|G|^2 > 1$ für alle k!' },
      { id: 'vn-10', type: 'single-choice', question: 'Welche Methode verwendet man alternativ, wenn Von-Neumann nicht anwendbar ist?', options: ['Energiemethode oder Matrix-Stabilität', 'Trial and Error', 'Nur feinere Gitter', 'Gar keine Analyse'], correctIndex: 0, explanation: 'Alternativen: Energiemethode (variabel  Koeffizienten) oder Eigenwertanalyse der Verstärkungsmatrix.' },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // 6. KONVEKTION-DIFFUSION
  // ═══════════════════════════════════════════════════════════════

  'convdiff-1d': {
    lessonId: 'convdiff-1d',
    questions: [
      { id: 'cd1-1', type: 'formula-select', question: 'Die stationäre 1D Konvektions-Diffusions-Gleichung lautet:', options: ['$\\frac{d}{dx}(\\rho u \\phi) = \\frac{d}{dx}\\left(\\Gamma \\frac{d\\phi}{dx}\\right)$', '$\\frac{\\partial \\phi}{\\partial t} = \\alpha \\frac{\\partial^2 \\phi}{\\partial x^2}$', '$\\nabla \\cdot \\mathbf{u} = 0$', '$\\rho \\frac{Du}{Dt} = -\\nabla p$'], correctIndex: 0, explanation: 'Stationäre 1D Konv.-Diff.: Konvektionsfluss = Diffusionsfluss.' },
      { id: 'cd1-2', type: 'single-choice', question: 'Was ist die exakte Lösung der stationären 1D Konv.-Diff.-Gleichung?', options: ['Linear', 'Exponentiell: $\\phi(x) = A + B \\cdot e^{Pe \\cdot x/L}$', 'Parabolisch', 'Sinusförmig'], correctIndex: 1, explanation: 'Exakte Lösung: Exponentialfunktion, abhängig von der Peclet-Zahl.' },
      { id: 'cd1-3', type: 'true-false', question: 'Wahr oder falsch?', statement: 'Bei der stationären Konvektions-Diffusions-Gleichung fällt die Zeitableitung weg.', correct: true, explanation: 'Korrekt — stationär: $\\partial/\\partial t = 0$, nur räumliche Terme bleiben.' },
      { id: 'cd1-4', type: 'single-choice', question: 'Was passiert bei UDS für 1D Konvektion-Diffusion?', options: ['Exakte Lösung', 'Numerische Diffusion → flacheres Profil als exakt', 'Oszillationen', 'Divergenz'], correctIndex: 1, explanation: 'UDS hat zusätzliche numerische Diffusion → das Profil ist flacher als die exakte Exponentialkurve.' },
      { id: 'cd1-5', type: 'multi-select', question: 'Was enthält die diskrete Gleichung $a_P \\phi_P = a_W \\phi_W + a_E \\phi_E$ bei Konv.-Diff.?', options: ['Konvektive Beiträge in $a_W$, $a_E$', 'Diffusive Beiträge in $a_W$, $a_E$', 'Quellterme in $b$', 'Randbedingungen (falls angrenzend)'], correctIndices: [0, 1, 2, 3], explanation: 'Die Koeffizienten enthalten sowohl konvektive als auch diffusive Beiträge, plus Quellterm und ggf. BC-Anteile.' },
      { id: 'cd1-6', type: 'single-choice', question: 'Was ist der "Peclet-Einfluss" auf das Lösungsprofil?', options: ['Bei hohem Pe: steiles Profil am Auslassrand', 'Bei hohem Pe: lineares Profil', 'Pe hat keinen Einfluss', 'Bei hhem Pe: sinusförmig'], correctIndex: 0, explanation: 'Hohes Pe: Konvektion dominiert → steiler Gradient am Auslassrand (Grenzschicht).' },
      { id: 'cd1-7', type: 'text-input', question: 'Wie nennt man das Schema, das exponentiell interpoliert basierend auf Pe?', acceptedAnswers: ['Exponentialschema', 'Exponential Scheme', 'Exact Scheme'], hint: 'Nutzt e-Funktionen', explanation: 'Das Exponentialschema interpoliert exakt nach der analytischen Lösung — teuer, aber optimal.' },
      { id: 'cd1-8', type: 'true-false', question: 'Wahr oder falsch?', statement: 'CDS ist für stationäre 1D Konvektion-Diffusion bei Pe=1 eine gute Wahl.', correct: true, explanation: 'Korrekt — bei Pe_D = 1 < 2 funktioniert CDS oszillationsfrei mit 2. Ordnung Genauigkeit.' },
      { id: 'cd1-9', type: 'single-choice', question: 'Was ist $D = \\Gamma / \\Delta x$ in der FVM-Diskretisierung?', options: ['Konvektiver Fluss', 'Diffusive Leitfähigkeit (Diffusion Conductance)', 'Quellterm', 'Massenfluss'], correctIndex: 1, explanation: '$D = \\Gamma/\\Delta x$ ist die diffusive Leitfähigkeit — misst die Stärke der Diffusion pro Zellbreite.' },
      { id: 'cd1-10', type: 'single-choice', question: 'Was ist $F = \\rho u$ in der FVM-Diskretisierung?', options: ['Face-Wert von φ', 'Massenfluss pro Fläche', 'Diffusionskoeffizient', 'Quellterm'], correctIndex: 1, explanation: '$F = \\rho u$ ist der Massenfluss pro Flächeneinheit.' },
    ],
  },

  'convdiff-peclet-effect': {
    lessonId: 'convdiff-peclet-effect',
    questions: [
      { id: 'cdpe-1', type: 'single-choice', question: 'Wie sieht das Profil bei $Pe = 0$ (reine Diffusion) aus?', options: ['Exponentiell', 'Linear', 'Gauß-Kurve', 'Stufenfunktion'], correctIndex: 1, explanation: 'Bei Pe = 0: keine Konvektion → lineares Profil zwischen den Randbedingungen (Fouriersche Wärmeleitung).' },
      { id: 'cdpe-2', type: 'single-choice', question: 'Was passiert mit dem Profil bei zunehmendem Pe?', options: ['Es bleibt linear', 'Es wird zunehmend zum Ausströmrand hin verschoben', 'Es wird sinusförmig', 'Es verschwindet'], correctIndex: 1, explanation: 'Steigendes Pe: Konvektion transportiert φ → steiler Gradient am Ausströmrand (Grenzschicht).' },
      { id: 'cdpe-3', type: 'true-false', question: 'Wahr oder falsch?', statement: 'Bei $Pe \\to \\infty$ wird das Profil zu einer Stufenfunktion am Ausströmrand.', correct: true, explanation: 'Korrekt — bei Pe → ∞ verschwindet die Diffusion, φ bleibt konstant bis zur dünnen Grenzschicht am Auslass.' },
      { id: 'cdpe-4', type: 'multi-select', question: 'Welche Aussagen über Pe sind korrekt?', options: ['Pe = 0 → lineares Profil', 'Pe → ∞ → Stufenfunktion', 'Pe < 0 → Grenzschicht am Einlass', 'Pe hat keinen Einfluss auf die Lösung'], correctIndices: [0, 1, 2], explanation: 'Alle drei stimmen. Negativer Pe dreht die Konvektionsrichtung um → Grenzschicht am anderen Rand.' },
      { id: 'cdpe-5', type: 'single-choice', question: 'Was zeigt ein Vergleich UDS vs. exakt bei hohem Pe?', options: ['UDS ist exakt', 'UDS verschmiert die Grenzschicht durch numerische Diffusion', 'UDS wird instabil', 'Kein Unterschied'], correctIndex: 1, explanation: 'UDS verschmiert scharfe Gradienten — bei hohem Pe ist die Grenzschicht breiter als physikalisch.' },
      { id: 'cdpe-6', type: 'single-choice', question: 'Wie viele Zellen braucht man mindestens in der Grenzschicht für gute Auflösung?', options: ['1', '3-5', '10-20', '100+'], correctIndex: 1, explanation: 'Mindestens 3-5 Zellen in der Grenzschichtdicke für vernünftige Auflösung.' },
      { id: 'cdpe-7', type: 'text-input', question: 'Wie skaliert die Grenzschichtdicke mit Pe? δ ~ L/?', acceptedAnswers: ['Pe', '1/Pe', 'L/Pe'], hint: 'Kehrwert einer Kennzahl', explanation: 'Grenzschichtdicke $\\delta \\sim L/Pe$ — je höher Pe, desto dünner die Grenzschicht.' },
      { id: 'cdpe-8', type: 'true-false', question: 'Wahr oder falsch?', statement: 'Bei negativem Pe liegt die Grenzschicht am Einströmrand.', correct: true, explanation: 'Korrekt — negativer Pe = Strömung in die andere Richtung → Grenzschicht wechselt die Seite.' },
      { id: 'cdpe-9', type: 'single-choice', question: 'Was ist der Hauptgrund für lokale Gitterverfeinerung in CFD?', options: ['Ästhetik', 'Auflösung von Grenzschichten und steilen Gradienten', 'Reduzierung der Rechenzeit', 'Einfachere Programmierung'], correctIndex: 1, explanation: 'Lokale Verfeinerung dort, wo steile Gradienten (Grenzschichten) auftreten — effizient und genau.' },
      { id: 'cdpe-10', type: 'single-choice', question: 'Was ist die "numerische Peclet-Zahl"?', options: ['Pe berechnet mit der physikalischen Viskosität', 'Pe berechnet mit effektiver (physikalischer + numerischer) Viskosität', 'Pe multipliziert mit CFL', 'Pe dividiert durch Re'], correctIndex: 1, explanation: 'Die effektive Pe-Zahl berücksichtigt die numerische Diffusion des Schemas zusätzlich zur physikalischen.' },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // 7. 2D PROBLEME
  // ═══════════════════════════════════════════════════════════════

  '2d-grid': {
    lessonId: '2d-grid',
    questions: [
      { id: '2dg-1', type: 'single-choice', question: 'Wie erweitert sich der FVM-Stencil von 1D auf 2D?', options: ['Von 3 auf 5 Punkte (N, S, E, W, P)', 'Von 3 auf 4 Punkte', 'Von 3 auf 9 Punkte', 'Bleibt bei 3 Punkten'], correctIndex: 0, explanation: '2D: 5-Punkt-Stencil mit Nachbarn Nord (N), Süd (S), Ost (E), West (W) und Zentrum (P).' },
      { id: '2dg-2', type: 'text-input', question: 'Wie heißt die Kompass-Notation für "Nord, Süd, Ost, West" in FVM?', acceptedAnswers: ['N S E W', 'NSEW', 'N, S, E, W', 'Nord Süd Ost West'], explanation: 'Kompass-Notation: N (oben), S (unten), E (rechts), W (links) — Standard in FVM.' },
      { id: '2dg-3', type: 'multi-select', question: 'Welche Faces hat eine 2D kartesische FVM-Zelle?', options: ['Nord-Face (n)', 'Süd-Face (s)', 'Ost-Face (e)', 'West-Face (w)', 'Diagonal-Face'], correctIndices: [0, 1, 2, 3], explanation: 'Eine 2D kartesische Zelle hat 4 Faces: n, s, e, w. Keine diagonalen Faces.' },
      { id: '2dg-4', type: 'formula-select', question: 'Die 2D FVM-Gleichung für Zelle P lautet:', options: ['$a_P \\phi_P = a_N \\phi_N + a_S \\phi_S + a_E \\phi_E + a_W \\phi_W + b$', '$\\phi_P = (\\phi_N + \\phi_S + \\phi_E + \\phi_W)/4$', '$\\nabla^2 \\phi = 0$', '$a_P \\phi_P = a_E \\phi_E + a_W \\phi_W$'], correctIndex: 0, explanation: '2D FVM: 5-Punkt-Stencil → $a_P\\phi_P = a_N\\phi_N + a_S\\phi_S + a_E\\phi_E + a_W\\phi_W + b$.' },
      { id: '2dg-5', type: 'single-choice', question: 'Wie wird ein 2D strukturiertes Gitter adressiert?', options: ['Nur mit einem Index i', 'Mit zwei Indizes (i, j)', 'Mit (x, y) Koordinaten', 'Zufällig'], correctIndex: 1, explanation: 'Strukturiertes 2D Gitter: (i,j)-Indexierung — i für x-Richtung, j für y-Richtung.' },
      { id: '2dg-6', type: 'single-choice', question: 'Was ist das besondere am Band der Matrix bei 2D FVM?', options: ['Tridiagonal', 'Pentadiagonal (5 Bands)', 'Vollbesetzt', 'Diagonal'], correctIndex: 1, explanation: '2D 5-Punkt-Stencil → Pentadiagonal-Matrix: Hauptdiag + 2 nahe Nebendiag + 2 weite Nebendiag.' },
      { id: '2dg-7', type: 'true-false', question: 'Wahr oder falsch?', statement: 'TDMA (Thomas-Algorithmus) kann direkt auf das 2D System angewandt werden.', correct: false, explanation: 'Falsch — TDMA funktioniert nur für tridiagonale Systeme. In 2D: Line-by-Line-TDMA oder iterative Löser.' },
      { id: '2dg-8', type: 'single-choice', question: 'Was ist "Line-by-Line TDMA"?', options: ['TDMA in einer Richtung, iterativ über die andere', 'Ein 2D-Direktlöser', 'Ein Multigrid-Verfahren', 'Ein Turbulenzmodell'], correctIndex: 0, explanation: 'Line-by-Line: TDMA zeilenweise (oder spaltenweise), Iteration über die andere Richtung.' },
      { id: '2dg-9', type: 'multi-select', question: 'Welche Löser eignen sich für das 2D FVM-System?', options: ['Gauss-Seidel', 'SOR (Successive Over-Relaxation)', 'Multigrid', 'Direkter TDMA (ohne Iteration)'], correctIndices: [0, 1, 2], explanation: 'Iterative Löser (GS, SOR, Multigrid) funktionieren in 2D. Direkter TDMA nicht, nur Line-by-Line.' },
      { id: '2dg-10', type: 'true-false', question: 'Wahr oder falsch?', statement: 'In 3D hat der Standard-FVM-Stencil 7 Punkte.', correct: true, explanation: 'Korrekt — 3D: P + N + S + E + W + T (Top) + B (Bottom) = 7-Punkt-Stencil.' },
    ],
  },

  '2d-scalar': {
    lessonId: '2d-scalar',
    questions: [
      { id: '2ds-1', type: 'single-choice', question: 'Was ändert sich bei 2D skalarer Konvektion gegenüber 1D?', options: ['Geschwindigkeit hat nur eine Komponente', 'Flüsse durch 4 Faces statt 2 → $\\phi$ von N,S,E,W nötig', 'Kein Unterschied', 'Diffusion verschwindet'], correctIndex: 1, explanation: '2D: Konvektive und diffusive Flüsse durch alle 4 Faces, Geschwindigkeit hat u- und v-Komponente.' },
      { id: '2ds-2', type: 'true-false', question: 'Wahr oder falsch?', statement: 'In 2D muss man UDS in jeder Richtung separat anwenden: x-Richtung und y-Richtung.', correct: true, explanation: 'Korrekt — in jeder Richtung wird die Upwind-Zelle basierend auf der lokalen Geschwindigkeitskomponente gewählt.' },
      { id: 'cds2-3', type: 'single-choice', question: 'Was ist "False Diffusion" in 2D bei UDS?', options: ['Physikalische Diffusion', 'Numerische Diffusion quer zur Strömungsrichtung bei schräger Strömung', 'Ein Programmierfehler', 'Diffusion am Rand'], correctIndex: 1, explanation: 'False Diffusion: UDS erzeugt numerische Diffusion senkrecht zur Strömung wenn diese schräg zum Gitter steht.' },
      { id: '2ds-4', type: 'multi-select', question: 'Wann tritt False Diffusion besonders stark auf?', options: ['Strömung steht 45° zum Gitter', 'Hohes Gitter-Peclet', 'Strömung parallel zum Gitter', 'Grobes Gitter'], correctIndices: [0, 1, 3], explanation: 'False Diffusion maximal bei 45° und hohem Pe auf grobem Gitter. Parallel zum Gitter: kein Problem.' },
      { id: '2ds-5', type: 'single-choice', question: 'Wie kann man False Diffusion reduzieren?', options: ['Nur UDS verwenden', 'Feineres Gitter, höhere Ordnung-Schemata, Gitter an Strömung ausrichten', 'Größere Zeitschritte', 'Gar nicht'], correctIndex: 1, explanation: 'False Diffusion sinkt mit feinerem Gitter, höherer Ordnung und wenn das Gitter der Strömung folgt.' },
      { id: '2ds-6', type: 'true-false', question: 'Wahr oder falsch?', statement: 'CDS hat keine False Diffusion, dafür kann es bei hohem Pe oszillieren.', correct: true, explanation: 'Korrekt — CDS hat keinen diffusiven Fehlerterm, aber den dispersiven (Oszillationen bei hohem Pe).' },
      { id: '2ds-7', type: 'single-choice', question: 'Was zeigt ein 2D Konvektionstest mit diagonaler Strömung und UDS?', options: ['Scharfe Fronten bleiben erhalten', 'Starke Verschmierung in beide Richtungen (False Diffusion)', 'Perfekte Lösung', 'Nur Verschmierung in x-Richtung'], correctIndex: 1, explanation: 'Diagonale Strömung + UDS: False Diffusion verschmiert die Lösung stark in beide Richtungen.' },
      { id: '2ds-8', type: 'text-input', question: 'Wie heißt das Phänomen, dass UDS in 2D künstliche Diffusion quer zur Strömung erzeugt?', acceptedAnswers: ['False Diffusion', 'Falsche Diffusion', 'Numerische Querdiffusion'], explanation: 'False Diffusion = künstliche Diffusion senkrecht zur Strömung bei nicht-gitter-paralleler Strömung.' },
      { id: '2ds-9', type: 'single-choice', question: 'In welchem Fall verschwindet False Diffusion bei UDS?', options: ['Nie', 'Wenn die Strömung exakt parallel zu einer Gitterachse ist', 'Bei Pe = 0', 'Bei CFL = 1'], correctIndex: 1, explanation: 'Strömung parallel zum Gitter → Upwind erfolgt exakt in Strömungsrichtung → keine Querdiffusion.' },
      { id: '2ds-10', type: 'single-choice', question: 'Welches Schema hat die geringste False Diffusion?', options: ['UDS', 'CDS', 'TVD mit gutem Limiter', 'Alle gleich'], correctIndex: 2, explanation: 'TVD-Schemata (z.B. Van Leer) haben deutlich weniger False Diffusion als UDS, und keine Oszillationen wie CDS.' },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // 8. INKOMPRESSIBLE STRÖMUNG
  // ═══════════════════════════════════════════════════════════════

  'incomp-ns': {
    lessonId: 'incomp-ns',
    questions: [
      { id: 'ins-1', type: 'formula-select', question: 'Die Kontinuitätsgleichung für inkompressible Strömung:', options: ['$\\nabla \\cdot \\mathbf{u} = 0$', '$\\frac{\\partial \\rho}{\\partial t} + \\nabla \\cdot (\\rho \\mathbf{u}) = 0$', '$\\Delta p = 0$', '$\\frac{Du}{Dt} = 0$'], correctIndex: 0, explanation: 'Inkompressibel: $\\nabla \\cdot \\mathbf{u} = 0$ — Divergenzfreiheit des Geschwindigkeitsfelds.' },
      { id: 'ins-2', type: 'single-choice', question: 'Was ist das besondere Problem bei inkompressiblen NS-Gleichungen?', options: ['Keine Zeitableitung', 'Es gibt keine direkte Gleichung für den Druck', 'Die Gleichungen sind linear', 'Keine Randbedingungen nötig'], correctIndex: 1, explanation: 'Der Druck erscheint im Impuls, hat aber keine eigene Gleichung. Er koppelt Impuls und Kontinuität.' },
      { id: 'ins-3', type: 'multi-select', question: 'Welche Terme enthält die inkompressible Impulsgleichung (x-Richtung)?', options: ['Zeitliche Änderung $\\partial(\\rho u)/\\partial t$', 'Konvektion $\\nabla \\cdot (\\rho \\mathbf{u} u)$', 'Druckgradient $-\\partial p/\\partial x$', 'Diffusion $\\mu \\nabla^2 u$', 'Quellterme (z.B. Gravitation)'], correctIndices: [0, 1, 2, 3, 4], explanation: 'Alle fünf Terme können in der Impulsgleichung auftreten.' },
      { id: 'ins-4', type: 'true-false', question: 'Wahr oder falsch?', statement: 'Der Druck in inkompressiblen Strömungen ist thermodynamisch, d.h. er bestimmt die Dichte.', correct: false, explanation: 'Falsch — der Druck ist hier ein "Lagrangescher Multiplikator", der Divergenzfreiheit erzwingt. ρ ist konstant.' },
      { id: 'ins-5', type: 'single-choice', question: 'Was passiert, wenn man p und u auf dem gleichen Gitter (co-located) speichert?', options: ['Perfekte Lösung', 'Checkerboard-Oszillationen im Druck', 'Schnellere Konvergenz', 'Keine Auswirkung'], correctIndex: 1, explanation: 'Co-located: Druck-Geschwindigkeits-Entkopplung → Schachbrettmuster (Checkerboard) im Druckfeld.' },
      { id: 'ins-6', type: 'text-input', question: 'Wie heißt die spezielle Gitteranordnung, bei der p und u auf versetzten Gittern liegen?', acceptedAnswers: ['Staggered Grid', 'Versetztes Gitter', 'Staggered'], explanation: 'Staggered Grid: u auf vertikalen Faces, v auf horizontalen Faces, p im Zellzentrum → keine Checkerboard-Probleme.' },
      { id: 'ins-7', type: 'single-choice', question: 'Wie wird auf co-located Gittern das Checkerboard-Problem gelöst?', options: ['Gar nicht — man braucht staggered', 'Rhie-Chow-Interpolation', 'Feineres Gitter', 'Nur implizite Zeitintegration'], correctIndex: 1, explanation: 'Rhie-Chow-Interpolation fügt eine Druckglättung hinzu → unterdrückt Checkerboard auf co-located Gittern.' },
      { id: 'ins-8', type: 'formula-select', question: 'Die Reynolds-Zahl ist definiert als:', options: ['$Re = \\frac{\\rho U L}{\\mu} = \\frac{U L}{\\nu}$', '$Re = \\frac{U \\Delta t}{\\Delta x}$', '$Re = \\frac{\\alpha \\Delta t}{\\Delta x^2}$', '$Re = Pe \\cdot Pr$'], correctIndex: 0, explanation: '$Re = \\rho UL/\\mu = UL/\\nu$ — Verhältnis von Trägheits- zu Reibungskräften.' },
      { id: 'ins-9', type: 'true-false', question: 'Wahr oder falsch?', statement: 'Bei $Re \\gg 1$ dominieren die viskosen Terme und die Strömung ist laminar.', correct: false, explanation: 'Falsch — bei Re >> 1 dominiert Trägheit. Hohe Re → turbulente Strömung.' },
      { id: 'ins-10', type: 'single-choice', question: 'Was sind die primären Unbekannten bei inkompressibler NS?', options: ['Temperatur und Druck', 'Geschwindigkeitskomponenten (u,v,w) und Druck p', 'Dichte und Temperatur', 'Nur Geschwindigkeit'], correctIndex: 1, explanation: 'Primäre Unbekannte: u, v, w (Geschwindigkeit) und p (Druck) — 4 Unbekannte in 3D.' },
    ],
  },

  'incomp-simple': {
    lessonId: 'incomp-simple',
    questions: [
      { id: 'simp-1', type: 'text-input', question: 'Wofür steht SIMPLE?', acceptedAnswers: ['Semi-Implicit Method for Pressure-Linked Equations', 'Semi Implicit Method for Pressure Linked Equations'], hint: 'Abkürzung für 5 Wörter', explanation: 'SIMPLE = Semi-Implicit Method for Pressure-Linked Equations (Patankar & Spalding, 1972).' },
      { id: 'simp-2', type: 'single-choice', question: 'Was ist die Grundidee von SIMPLE?', options: ['Druck und Geschwindigkeit gleichzeitig lösen', 'Predictor-Corrector: geschätztes u* → Druckkorrektur p\' → korrigiertes u', 'Nur den Druck lösen', 'Nur die Geschwindigkeit lösen'], correctIndex: 1, explanation: 'SIMPLE: 1) Löse Impuls mit geschätztem p* → u*. 2) Druckkorrektur p\' aus Kontinuität. 3) Korrigiere u,p.' },
      { id: 'simp-3', type: 'multi-select', question: 'Welche Schritte enthält ein SIMPLE-Iterationszyklus?', options: ['Impulsgleichung lösen → u*', 'Druckkorrekturgleichung lösen → p\'', 'Geschwindigkeit korrigieren', 'Druck korrigieren', 'Skalare Gleichungen lösen'], correctIndices: [0, 1, 2, 3, 4], explanation: 'SIMPLE-Zyklus: Impuls → Druckkorrektur → u-Korrektur → p-Korrektur → Skalare → Konvergenzcheck.' },
      { id: 'simp-4', type: 'true-false', question: 'Wahr oder falsch?', statement: 'SIMPLE benötigt Unterrelaxation, weil die Druckkorrektur auf einer vereinfachten Gleichung basiert.', correct: true, explanation: 'Korrekt — SIMPLE vernachlässigt Nachbaranteile in der Druckkorrektur → zu aggressive Korrektur → Unterrelaxation nötig.' },
      { id: 'simp-5', type: 'single-choice', question: 'Was ist der Unterschied zwischen SIMPLE und SIMPLEC?', options: ['SIMPLEC braucht keine Unterrelaxation für den Druck', 'SIMPLEC ist für kompressible Strömungen', 'Sie sind identisch', 'SIMPLEC ist instabil'], correctIndex: 0, explanation: 'SIMPLEC (Consistent): bessere Druckkorrektur → weniger Unterrelaxation nötig, schnellere Konvergenz.' },
      { id: 'simp-6', type: 'formula-select', question: 'Die Druckkorrekturgleichung hat die Form:', options: ['$a_P p_P\' = a_N p_N\' + a_S p_S\' + a_E p_E\' + a_W p_W\' + b\'$', '$\\nabla^2 p = 0$', '$p\' = p^* - p$', '$\\Delta p = \\rho g h$'], correctIndex: 0, explanation: 'Die Druckkorrekturgleichung ist eine diskrete Poisson-Gleichung mit Quellterm $b\'$ aus der Massenresiduum.' },
      { id: 'simp-7', type: 'single-choice', question: 'Was ist $b\'$ (Quellterm) in der Druckkorrekturgleichung?', options: ['Der Quellterm der Impulsgleichung', 'Das Massenresiduum (Verletzung der Kontinuität durch u*)', 'Ein Turbulenzterm', 'Null'], correctIndex: 1, explanation: '$b\'$ ist das Massenresiduum — misst, wie stark u* die Kontinuität verletzt.' },
      { id: 'simp-8', type: 'true-false', question: 'Wahr oder falsch?', statement: 'Bei Konvergenz von SIMPLE geht das Massenresiduum gegen null.', correct: true, explanation: 'Korrekt — bei Konvergenz: p\' → 0, b\' → 0, d.h. Kontinuität ist erfüllt.' },
      { id: 'simp-9', type: 'single-choice', question: 'Was ist PISO?', options: ['Eine Variante von SIMPLE für instationäre Probleme (2+ Korrektorschritte pro Zeitschritt)', 'Ein Turbulenzmodell', 'Ein Gittertyp', 'Ein Interpolationsschema'], correctIndex: 0, explanation: 'PISO = Pressure-Implicit with Splitting of Operators — nutzt 2+ Korrektoren pro Zeitschritt, gut für instationär.' },
      { id: 'simp-10', type: 'text-input', question: 'Welche Gleichung muss die Druckkorrektur erfüllen?', acceptedAnswers: ['Kontinuitätsgleichung', 'Massenerhaltung', 'Divergenzfreiheit', 'div u = 0'], hint: 'Erhaltung von ...?', explanation: 'Die Druckkorrektur erzwingt die Massenerhaltung: $\\nabla \\cdot \\mathbf{u} = 0$.' },
    ],
  },

  'incomp-cavity': {
    lessonId: 'incomp-cavity',
    questions: [
      { id: 'cav-1', type: 'single-choice', question: 'Was ist die Lid-Driven Cavity?', options: ['Ein Rohr mit Strömung', 'Ein geschlossener Kasten mit einer bewegten Wand (Deckel)', 'Ein offener Kanal', 'Ein Diffusor'], correctIndex: 1, explanation: 'Lid-Driven Cavity: Quadratischer Hohlraum, Deckel bewegt sich → treibt Wirbelströmung an.' },
      { id: 'cav-2', type: 'true-false', question: 'Wahr oder falsch?', statement: 'Die Lid-Driven Cavity ist ein Standard-Benchmark für inkompressible Strömungslöser.', correct: true, explanation: 'Korrekt — die Cavity ist DER klassische Benchmark (Ghia et al. 1982) für NS-Löser-Validierung.' },
      { id: 'cav-3', type: 'multi-select', question: 'Was beobachtet man in der Cavity bei steigendem Re?', options: ['Hauptwirbel füllt mehr vom Hohlraum', 'Sekundärwirbel in den Ecken werden stärker', 'Strömung wird irgendwann instationär', 'Strömung bleibt immer symmetrisch'], correctIndices: [0, 1, 2], explanation: 'Steigendes Re: größerer Hauptwirbel, stärkere Eckwirbel, ab Re ≈ 8000 instationär.' },
      { id: 'cav-4', type: 'single-choice', question: 'Welche Randbedingungen hat die Cavity?', options: ['Deckel: u = U, v = 0. Alle anderen Wände: u = v = 0 (no-slip)', 'Alle Wände: freier Abfluss', 'Einlass links, Auslass rechts', 'Periodisch'], correctIndex: 0, explanation: 'Deckel bewegt sich mit u=U, alle anderen Wände: no-slip (u=v=0).' },
      { id: 'cav-5', type: 'text-input', question: 'Wie heißt die klassische Benchmark-Publikation für die Cavity (Autoren, Jahr)?', acceptedAnswers: ['Ghia', 'Ghia et al', 'Ghia et al. 1982', 'Ghia 1982'], hint: 'Indische Forscher, 1982', explanation: 'Ghia, Ghia & Shin (1982) — die Referenz-Benchmark-Daten für die Lid-Driven Cavity.' },
      { id: 'cav-6', type: 'single-choice', question: 'Was ist die Reynolds-Zahl für die Cavity definiert als?', options: ['$Re = UL/\\nu$, mit U = Deckelgeschwindigkeit, L = Kantenlänge', '$Re = \\rho U^2/p$', '$Re = U\\Delta x/\\Gamma$', '$Re = CFL \\cdot Pe$'], correctIndex: 0, explanation: '$Re = UL/\\nu$ wobei U die Deckelgeschwindigkeit und L die Seitenlänge ist.' },
      { id: 'cav-7', type: 'true-false', question: 'Wahr oder falsch?', statement: 'In der Cavity gibt es bei niedrigem Re nur einen einzigen Wirbel.', correct: false, explanation: 'Falsch — auch bei niedrigem Re gibt es immer kleine Sekundärwirbel in den unteren Ecken.' },
      { id: 'cav-8', type: 'single-choice', question: 'Warum ist die Cavity-Ecke (Deckel-Wand) numerisch problematisch?', options: ['Dort ist keine Randbedingung definiert', 'Singularität: Geschwindigkeit springt von U auf 0 → unendlicher Gradient', 'Die Temperatur divergiert', 'Dort gibt es keine Zellen'], correctIndex: 1, explanation: 'An der Ecke springt u von U (Deckel) auf 0 (Seitenwand) → Geschwindigkeitssingularität.' },
      { id: 'cav-9', type: 'single-choice', question: 'Welcher Löser wird typischerweise für die Cavity verwendet?', options: ['Kompressibler Euler-Löser', 'Inkompressibler SIMPLE-Löser', 'Spektralmethode', 'Monte-Carlo-Simulation'], correctIndex: 1, explanation: 'Die Cavity ist ein inkompressibles Strömungsproblem → SIMPLE/PISO-basierte Löser.' },
      { id: 'cav-10', type: 'multi-select', question: 'Was vergleicht man typischerweise beim Cavity-Benchmark?', options: ['u-Profil entlang der vertikalen Mittellinie', 'v-Profil entlang der horizontalen Mittellinie', 'Wirbelposition', 'Druckverteilung'], correctIndices: [0, 1, 2], explanation: 'Klassisch: u(y) auf vertikaler und v(x) auf horizontaler Mittellinie + Wirbelzentrums-Position.' },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // 9. ALGORITHMEN / LÖSER
  // ═══════════════════════════════════════════════════════════════

  'algo-linear-systems': {
    lessonId: 'algo-linear-systems',
    questions: [
      { id: 'als-1', type: 'single-choice', question: 'Was entsteht nach der Diskretisierung einer PDE?', options: ['Eine ODE', 'Ein lineares Gleichungssystem $A\\phi = b$', 'Eine exakte Lösung', 'Ein nichtlineares System'], correctIndex: 1, explanation: 'Diskretisierung → $A\\phi = b$ mit dünnbesetzter Koeffizientenmatrix A.' },
      { id: 'als-2', type: 'multi-select', question: 'Welche Eigenschaften hat die Matrix A typischerweise in CFD?', options: ['Dünnbesetzt (sparse)', 'Diagonal dominant', 'Symmetrisch (bei Diffusion)', 'Vollbesetzt', 'Groß (Millionen Zeilen)'], correctIndices: [0, 1, 2, 4], explanation: 'CFD-Matrizen sind sparse, groß, diagonal dominant und bei reiner Diffusion symmetrisch. Nicht vollbesetzt!' },
      { id: 'als-3', type: 'single-choice', question: 'Warum nutzt man in CFD iterative statt direkte Löser?', options: ['Direkte sind ungenau', 'Speicherbedarf und Aufwand von direkten Lösern skaliert schlecht für große sparse Systeme', 'Iterative sind immer schneller', 'Direkte existieren nicht'], correctIndex: 1, explanation: 'Direkte Löser (LU, Cholesky): $O(N^2)$ Speicher, $O(N^3)$ Aufwand → bei Millionen Unbekannten unmöglich.' },
      { id: 'als-4', type: 'true-false', question: 'Wahr oder falsch?', statement: 'TDMA (Thomas-Algorithmus) ist ein direkter Löser für tridiagonale Systeme mit O(N) Aufwand.', correct: true, explanation: 'Korrekt — TDMA: Vorwärts-Elimination + Rückwärts-Substitution für tridiagonale Systeme in O(N).' },
      { id: 'als-5', type: 'text-input', question: 'Wie heißt das Matrixformat, das nur die Nicht-Null-Einträge speichert?', acceptedAnswers: ['Sparse', 'CSR', 'Compressed Sparse Row', 'Sparse Matrix'], explanation: 'Sparse-Formate (CSR, CSC, COO) speichern nur Nicht-Null-Einträge → enormer Speichergewinn.' },
      { id: 'als-6', type: 'single-choice', question: 'Was ist die Konditionszahl $\\kappa(A)$?', options: ['Anzahl der Nicht-Null-Einträge', 'Maß für die Empfindlichkeit der Lösung gegenüber Störungen', 'Die Determinante von A', 'Das Verhältnis von Konvektion zu Diffusion'], correctIndex: 1, explanation: '$\\kappa(A) = \\|A\\| \\cdot \\|A^{-1}\\|$ — große Konditionszahl → schlecht konditioniertes System.' },
      { id: 'als-7', type: 'formula-select', question: 'Die allgemeine Form eines iterativen Löser-Schritts:', options: ['$\\phi^{(k+1)} = M^{-1}(b - N\\phi^{(k)})$, wobei $A = M - N$', '$\\phi = A^{-1}b$', '$\\phi^{(k+1)} = \\phi^{(k)} + \\Delta t \\cdot \\text{RHS}$', '$\\phi = 0$'], correctIndex: 0, explanation: 'Splitting $A = M - N$: $M\\phi^{(k+1)} = N\\phi^{(k)} + b$ — M muss einfach invertierbar sein.' },
      { id: 'als-8', type: 'multi-select', question: 'Welche Direktlöser gibt es?', options: ['Gauß-Elimination', 'LU-Zerlegung', 'Cholesky (für symmetrische A)', 'TDMA (für tridiagonal)'], correctIndices: [0, 1, 2, 3], explanation: 'Alle vier sind direkte Löser — liefern die exakte Lösung in endlich vielen Schritten (bis auf Rundungsfehler).' },
      { id: 'als-9', type: 'single-choice', question: 'Was bedeutet "diagonal dominant"?', options: ['A hat nur Diagonaleinträge', '$|a_{ii}| \\geq \\sum_{j \\neq i} |a_{ij}|$ für alle i', 'Die Diagonale ist null', 'A ist orthogonal'], correctIndex: 1, explanation: 'Diagonale Dominanz: Betrag des Diagonalelements ≥ Summe der Beträge aller anderen Einträge der Zeile.' },
      { id: 'als-10', type: 'true-false', question: 'Wahr oder falsch?', statement: 'Diagonale Dominanz sichert die Konvergenz iterativer Löser wie Jacobi und Gauss-Seidel.', correct: true, explanation: 'Korrekt — diagonale Dominanz ist eine hinreichende Bedingung für die Konvergenz von Jacobi und GS.' },
    ],
  },

  'algo-iterative': {
    lessonId: 'algo-iterative',
    questions: [
      { id: 'ait-1', type: 'single-choice', question: 'Was ist der Jacobi-Löser?', options: ['Alle Unbekannten gleichzeitig mit alten Werten updaten', 'Unbekannte sequenziell mit bereits aktualisierten Werten updaten', 'Ein Direktlöser', 'Ein Multigrid-Verfahren'], correctIndex: 0, explanation: 'Jacobi: $\\phi_i^{(k+1)} = \\frac{1}{a_{ii}}(b_i - \\sum_{j\\neq i} a_{ij}\\phi_j^{(k)})$ — nutzt nur alte Werte.' },
      { id: 'ait-2', type: 'single-choice', question: 'Was unterscheidet Gauss-Seidel von Jacobi?', options: ['Gauss-Seidel nutzt bereits aktualisierte Werte innerhalb der Iteration', 'Gauss-Seidel ist ein Direktlöser', 'Kein Unterschied', 'Gauss-Seidel ist langsamer'], correctIndex: 0, explanation: 'GS: $\\phi_i^{(k+1)} = \\frac{1}{a_{ii}}(b_i - \\sum_{j<i} a_{ij}\\phi_j^{(k+1)} - \\sum_{j>i} a_{ij}\\phi_j^{(k)})$ — nutzt neue Werte sofort.' },
      { id: 'ait-3', type: 'true-false', question: 'Wahr oder falsch?', statement: 'Gauss-Seidel konvergiert typischerweise schneller als Jacobi.', correct: true, explanation: 'Korrekt — GS nutzt die neuesten Informationen sofort, was die Konvergenz meist beschleunigt.' },
      { id: 'ait-4', type: 'text-input', question: 'Wie nennt man das Konvergenzmaß, das prüft wie nah $A\\phi^{(k)} - b$ an null ist?', acceptedAnswers: ['Residuum', 'Residual', 'Residualnorm'], explanation: 'Residuum $r^{(k)} = b - A\\phi^{(k)}$ — geht gegen null bei Konvergenz.' },
      { id: 'ait-5', type: 'single-choice', question: 'Was ist SOR (Successive Over-Relaxation)?', options: ['Ein Direktlöser', 'Gauss-Seidel mit Relaxationsfaktor $\\omega$, typisch $1 < \\omega < 2$', 'Ein Multigrid-Verfahren', 'Eine Zeitintegrationsmethode'], correctIndex: 1, explanation: 'SOR: $\\phi^{(k+1)} = \\phi^{(k)} + \\omega(\\phi^{\\text{GS}} - \\phi^{(k)})$ mit $\\omega > 1$ → Überrelaxation.' },
      { id: 'ait-6', type: 'formula-select', question: 'Der optimale SOR-Relaxationsfaktor liegt im Bereich:', options: ['$1 < \\omega < 2$', '$0 < \\omega < 1$', '$\\omega > 2$', '$\\omega = 1$ (= Gauss-Seidel)'], correctIndex: 0, explanation: 'Für Überrelaxation: $1 < \\omega < 2$. Bei $\\omega = 1$: SOR = GS. Bei $\\omega \\geq 2$: divergent.' },
      { id: 'ait-7', type: 'multi-select', question: 'Welche Krylov-Verfahren werden in CFD eingesetzt?', options: ['CG (Conjugate Gradient, für symm. positiv definit)', 'BiCGSTAB (für unsymmetrische Systeme)', 'GMRES', 'TDMA'], correctIndices: [0, 1, 2], explanation: 'CG, BiCGSTAB, GMRES sind Krylov-Verfahren. TDMA ist ein Direktlöser.' },
      { id: 'ait-8', type: 'single-choice', question: 'Was ist ein Vorkonditionierer (Preconditioner)?', options: ['Ein Zeitschritt-Begrenzer', 'Eine Transformation, die das System besser konditioniert → schnellere Konvergenz', 'Ein Gitterverfeinerungstool', 'Ein Nachbearbeitungsschritt'], correctIndex: 1, explanation: 'Preconditioner $M$: Löse $M^{-1}A\\phi = M^{-1}b$ statt $A\\phi = b$ — bessere Konditionierung.' },
      { id: 'ait-9', type: 'true-false', question: 'Wahr oder falsch?', statement: 'ILU (Incomplete LU) ist ein gängiger Vorkonditionierer in CFD.', correct: true, explanation: 'Korrekt — ILU(0), ILU(k) sind die Standard-Preconditioner in CFD-Codes.' },
      { id: 'ait-10', type: 'single-choice', question: 'Was begrenzt die Konvergenzrate von Jacobi und GS bei großen Gittern?', options: ['Rundungsfehler', 'Langwellige Fehler werden nur langsam reduziert', 'Zu wenig Speicher', 'Randbedingungen'], correctIndex: 1, explanation: 'Klassische Iterationen glätten hochfrequente Fehler schnell, aber langwellige langsam → Motivation für Multigrid.' },
    ],
  },

  'algo-multigrid': {
    lessonId: 'algo-multigrid',
    questions: [
      { id: 'mg-1', type: 'single-choice', question: 'Was ist die Grundidee von Multigrid?', options: ['Gitterfeinheit erhöhen', 'Langwellige Fehler auf gröberen Gittern effizient reduzieren', 'Nur auf dem feinsten Gitter lösen', 'Zeitschritt optimieren'], correctIndex: 1, explanation: 'Multigrid: Langwellige Fehler → auf gröberem Gitter hochfrequent → dort effizient glättbar.' },
      { id: 'mg-2', type: 'multi-select', question: 'Welche Komponenten hat ein Multigrid-Zyklus?', options: ['Glätter (Smoother) auf dem aktuellen Gitter', 'Restriktion (fein → grob)', 'Prolongation (grob → fein)', 'Grobgitter-Lösung', 'Randbedingungsberechnung'], correctIndices: [0, 1, 2, 3], explanation: 'MG-Zyklus: 1) Glätten, 2) Restringieren, 3) Grobgitter lösen, 4) Prolongieren, 5) Glätten.' },
      { id: 'mg-3', type: 'text-input', question: 'Wie heißt der Transferoperator, der den Fehler vom feinen zum groben Gitter überträgt?', acceptedAnswers: ['Restriktion', 'Restriction', 'Restriction Operator'], explanation: 'Restriktion: Überträgt das Residuum vom feinen auf das grobe Gitter (z.B. Full-Weighting).' },
      { id: 'mg-4', type: 'text-input', question: 'Wie heißt der Transferoperator, der die Korrektur vom groben zum feinen Gitter überträgt?', acceptedAnswers: ['Prolongation', 'Interpolation', 'Prolongation Operator'], explanation: 'Prolongation: Interpoliert die Grobgitter-Korrektur auf das feine Gitter.' },
      { id: 'mg-5', type: 'single-choice', question: 'Was ist ein V-Zyklus?', options: ['Einmal fein → grob → fein', 'Doppelt fein → grob → fein', 'Nur grobes Gitter', 'Nur feines Gitter'], correctIndex: 0, explanation: 'V-Zyklus: Glätten → Restriktion → ... gröbstes Gitter → ... Prolongation → Glätten. V-Form im Gitterlevel-Diagramm.' },
      { id: 'mg-6', type: 'single-choice', question: 'Was ist ein W-Zyklus?', options: ['Ein einfacher V-Zyklus', 'Ein Zyklus mit mehrfacher Rekursion auf groben Gittern (W-Form)', 'Ein Zyklus nur auf groben Gittern', 'Ein spezieller Glätter'], correctIndex: 1, explanation: 'W-Zyklus: Auf jedem groben Gitter wird zweimal rekursiv geglättet → teurer aber robuster als V-Zyklus.' },
      { id: 'mg-7', type: 'true-false', question: 'Wahr oder falsch?', statement: 'Multigrid erreicht optimalen Aufwand: O(N) pro Iteration für N Unbekannte.', correct: true, explanation: 'Korrekt — Multigrid hat O(N) Komplexität pro Iterationsschritt, was bei großen Problemen entscheidend ist.' },
      { id: 'mg-8', type: 'single-choice', question: 'Was ist "Algebraic Multigrid" (AMG)?', options: ['Multigrid mit geometrisch definierten Gitterhierarchien', 'Multigrid, das die Grobgitter direkt aus der Matrix A konstruiert', 'Ein Direktlöser', 'Ein Zeitintegrationsverfahren'], correctIndex: 1, explanation: 'AMG: kein geometrisches Gitter nötig — Grobgitter-Hierarchie wird aus der Matrixstruktur abgeleitet.' },
      { id: 'mg-9', type: 'multi-select', question: 'Welche Glätter werden in Multigrid eingesetzt?', options: ['Jacobi', 'Gauss-Seidel', 'SOR', 'ILU', 'TDMA'], correctIndices: [0, 1, 2, 3], explanation: 'Jacobi, GS, SOR und ILU sind gängige Smoother. TDMA wird eher als Direktlöser für 1D genutzt.' },
      { id: 'mg-10', type: 'true-false', question: 'Wahr oder falsch?', statement: 'Multigrid ist besonders effektiv für elliptische Probleme (z.B. Druckkorrrekturgleichung).', correct: true, explanation: 'Korrekt — elliptische Probleme haben langsame Konvergenz bei klassischen Iterationen. MG beschleunigt enorm.' },
    ],
  },

  'algo-underrelaxation': {
    lessonId: 'algo-underrelaxation',
    questions: [
      { id: 'ur-1', type: 'formula-select', question: 'Die Unterrelaxation lautet:', options: ['$\\phi^{\\text{new}} = \\phi^{\\text{old}} + \\alpha(\\phi^* - \\phi^{\\text{old}})$', '$\\phi^{\\text{new}} = \\alpha \\phi^*$', '$\\phi^{\\text{new}} = \\phi^*/\\alpha$', '$\\phi^{\\text{new}} = \\phi^{\\text{old}}$'], correctIndex: 0, explanation: '$\\phi^{\\text{new}} = \\phi^{\\text{old}} + \\alpha(\\phi^* - \\phi^{\\text{old}})$ mit $0 < \\alpha < 1$ (Unterrelaxation).' },
      { id: 'ur-2', type: 'single-choice', question: 'Warum braucht man Unterrelaxation bei SIMPLE?', options: ['Für höhere Genauigkeit', 'Um die durch Linearisierung/Vereinfachung zu aggressive Korrektur zu dämpfen', 'Zur Beschleunigung', 'Ist optional'], correctIndex: 1, explanation: 'SIMPLE vernachlässigt Terme → Korrektur zu groß → Unterrelaxation dämpft auf stabiles Niveau.' },
      { id: 'ur-3', type: 'single-choice', question: 'Was ist ein typischer Unterrelaxationsfaktor $\\alpha_u$ für Geschwindigkeit bei SIMPLE?', options: ['0.01', '0.3 - 0.7', '1.0', '1.5'], correctIndex: 1, explanation: 'Typisch: $\\alpha_u = 0.5$ bis $0.7$ für Geschwindigkeit, $\\alpha_p = 0.1$ bis $0.3$ für Druck.' },
      { id: 'ur-4', type: 'true-false', question: 'Wahr oder falsch?', statement: 'Je kleiner der Unterrelaxationsfaktor α, desto langsamer aber sicherer die Konvergenz.', correct: true, explanation: 'Korrekt — kleines α: kleine Schritte → langsam aber stabil. Zu großes α → Divergenz möglich.' },
      { id: 'ur-5', type: 'multi-select', question: 'Welche Variablen werden bei SIMPLE typischerweise unterrelaxiert?', options: ['Geschwindigkeit u,v,w', 'Druck p', 'Turbulenzgrößen k, ε', 'Dichte ρ (bei inkompressibel)'], correctIndices: [0, 1, 2], explanation: 'u,v,w; p; und Turbulenzgrößen brauchen Unterrelaxation. ρ ist bei inkompressibel konstant.' },
      { id: 'ur-6', type: 'text-input', question: 'Was ist die Beziehung zwischen α_u und α_p bei SIMPLE? (Faustregel)', acceptedAnswers: ['alpha_u + alpha_p = 1', 'αu + αp = 1', 'alpha_p = 1 - alpha_u'], hint: 'Summe = ?', explanation: 'Faustregel: $\\alpha_u + \\alpha_p \\approx 1$ (z.B. $\\alpha_u = 0.7$, $\\alpha_p = 0.3$).' },
      { id: 'ur-7', type: 'single-choice', question: 'Was bedeutet $\\alpha = 1$?', options: ['Keine Relaxation (volles Update)', 'Maximale Unterrelaxation', 'System divergiert', 'φ bleibt unverändert'], correctIndex: 0, explanation: '$\\alpha = 1$: $\\phi^{\\text{new}} = \\phi^*$ — kein Relaxationseffekt.' },
      { id: 'ur-8', type: 'true-false', question: 'Wahr oder falsch?', statement: 'Bei SIMPLEC braucht man weniger Unterrelaxation als bei SIMPLE.', correct: true, explanation: 'Korrekt — SIMPLEC hat eine konsistentere Druckkorrektur → weniger aggressive Korrektur → weniger URF nötig.' },
      { id: 'ur-9', type: 'single-choice', question: 'Was passiert bei $\\alpha > 1$?', options: ['Unterrelaxation', 'Überrelaxation (SOR-ähnlich)', 'Fehler', 'Nichts'], correctIndex: 1, explanation: '$\\alpha > 1$: Überrelaxation — verstärkt die Korrektur. Bei SOR: $1 < \\omega < 2$ kann beschleunigen.' },
      { id: 'ur-10', type: 'single-choice', question: 'Was ist das Konvergenzkriterium bei SIMPLE?', options: ['Residuen aller Gleichungen unter einer Toleranz', 'Maximale Iterationszahl erreicht', 'CFL < 1', 'Druckkorrektur = 0'], correctIndex: 0, explanation: 'Konvergenz: Normierte Residuen (Kontinuität, Impuls, Skalare) fallen unter eine vordefinierte Toleranz (z.B. 10⁻⁶).' },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // 10. KOMPRESSIBLE STRÖMUNG
  // ═══════════════════════════════════════════════════════════════

  'comp-euler': {
    lessonId: 'comp-euler',
    questions: [
      { id: 'ceu-1', type: 'single-choice', question: 'Was unterscheidet kompressible von inkompressibler Strömung?', options: ['Die Dichte ist konstant', 'Die Dichte variiert mit Druck und Temperatur', 'Es gibt keinen Druck', 'Die Viskosität ist null'], correctIndex: 1, explanation: 'Kompressibel: $\\rho = \\rho(p, T)$ — Dichte ist variabel, Druck-Dichte-Kopplung über Zustandsgleichung.' },
      { id: 'ceu-2', type: 'multi-select', question: 'Welche Erhaltungsgleichungen löst man bei kompressibler Strömung?', options: ['Massenerhaltung (Kontinuität)', 'Impulserhaltung', 'Energieerhaltung', 'Zustandsgleichung (z.B. ideales Gas)'], correctIndices: [0, 1, 2, 3], explanation: 'Kompressibel: Masse + Impuls + Energie + Zustandsgleichung — 5 Gleichungen in 3D.' },
      { id: 'ceu-3', type: 'formula-select', question: 'Die Mach-Zahl ist definiert als:', options: ['$Ma = \\frac{u}{a}$, wobei $a$ die Schallgeschwindigkeit ist', '$Ma = \\frac{u}{\\nu}$', '$Ma = Re \\cdot Pr$', '$Ma = \\frac{\\Delta t}{\\Delta x}$'], correctIndex: 0, explanation: '$Ma = u/a$ — Verhältnis von Strömungsgeschwindigkeit zu Schallgeschwindigkeit.' },
      { id: 'ceu-4', type: 'single-choice', question: 'Ab welcher Mach-Zahl muss man kompressibel rechnen?', options: ['Ma > 0.01', 'Ma > 0.3', 'Ma > 1', 'Ma > 5'], correctIndex: 1, explanation: 'Ab Ma ≈ 0.3: Dichteänderungen > 5% → inkompressible Annahme nicht mehr gültig.' },
      { id: 'ceu-5', type: 'true-false', question: 'Wahr oder falsch?', statement: 'Die Euler-Gleichungen sind die Navier-Stokes-Gleichungen ohne Viskosität.', correct: true, explanation: 'Korrekt — Euler = NS mit μ = 0: Massenerhaltung + reibungsfreie Impulsgleichung + Energiegleichung.' },
      { id: 'ceu-6', type: 'single-choice', question: 'Was ist die Schallgeschwindigkeit im idealen Gas?', options: ['$a = \\sqrt{\\gamma R T}$', '$a = \\sqrt{p/\\rho}$', '$a = u/Ma$', '$a = \\gamma p$'], correctIndex: 0, explanation: '$a = \\sqrt{\\gamma R T}$ für ein ideales Gas mit Isentropenexponent $\\gamma$.' },
      { id: 'ceu-7', type: 'text-input', question: 'Wie heißt die Eigenschaft der Euler-Gleichungen, die Wellen und Diskontinuitäten erlaubt?', acceptedAnswers: ['Hyperbolisch', 'Hyperbolisches System', 'hyperbolisch'], explanation: 'Die Euler-Gleichungen sind hyperbolisch → unterstützen Wellenausbreitung und Stoßwellen.' },
      { id: 'ceu-8', type: 'multi-select', question: 'Welche konservativen Variablen löst man bei den Euler-Gleichungen?', options: ['$\\rho$ (Dichte)', '$\\rho u$ (Impulsdichte)', '$\\rho E$ (Gesamtenergiedichte)', '$p$ (Druck)', '$T$ (Temperatur)'], correctIndices: [0, 1, 2], explanation: 'Konservative Variablen: $\\rho$, $\\rho u$, $\\rho E$. Druck und Temperatur sind abgeleitete Größen.' },
      { id: 'ceu-9', type: 'single-choice', question: 'Was sind die Eigenwerte der 1D Euler-Gleichungen?', options: ['$u, u, u$', '$u-a, u, u+a$', '$a, -a, 0$', '$u, 0, -u$'], correctIndex: 1, explanation: 'Eigenwerte: $\\lambda_1 = u-a$, $\\lambda_2 = u$, $\\lambda_3 = u+a$ — drei Wellengeschwindigkeiten.' },
      { id: 'ceu-10', type: 'true-false', question: 'Wahr oder falsch?', statement: 'Bei $Ma < 1$ (Unterschall) sind alle drei Eigenwerte der 1D Euler-Gleichungen positiv.', correct: false, explanation: 'Falsch — bei Ma < 1: $u-a < 0$, $u > 0$, $u+a > 0$ → ein Eigenwert negativ (rückwärts laufende Welle).' },
    ],
  },

  'comp-riemann': {
    lessonId: 'comp-riemann',
    questions: [
      { id: 'riem-1', type: 'single-choice', question: 'Was ist ein Riemann-Problem?', options: ['Ein stationäres Problem', 'Ein Anfangswertproblem mit einem Sprung (Diskontinuität) in den Anfangsdaten', 'Ein Randwertproblem', 'Ein Turbulenzproblem'], correctIndex: 1, explanation: 'Riemann-Problem: Stückweise konstante Anfangsdaten mit einem Sprung → welche Wellen entstehen?' },
      { id: 'riem-2', type: 'multi-select', question: 'Welche Wellentypen können bei einem Riemann-Problem auftreten?', options: ['Schockwelle (Verdichtungsstoß)', 'Verdünnungswelle (Expansion Fan)', 'Kontaktdiskontinuität', 'Turbulente Wirbel'], correctIndices: [0, 1, 2], explanation: '3 Wellentypen: Schock, Expansion Fan, Kontaktdiskontinuität — entsprechend den 3 Eigenwerten.' },
      { id: 'riem-3', type: 'true-false', question: 'Wahr oder falsch?', statement: 'Der exakte Riemann-Löser berechnet die exakte Wellenstruktur — ist aber teuer und daher approximierte Löser (z.B. Roe, HLL) üblich.', correct: true, explanation: 'Korrekt — exakte Lösung erfordert nichtlineare Iteration. Approximate Riemann Solver sind der Praxis-Standard.' },
      { id: 'riem-4', type: 'text-input', question: 'Wie heißt der berühmte approximierte Riemann-Löser, der eine linearisierte Jacobi-Matrix an der Zell-Grenze nutzt?', acceptedAnswers: ['Roe', 'Roe-Löser', 'Roe Solver', 'Roe-Solver'], explanation: 'Roe-Löser (1981): Linearisierung der Flux-Jacobian → approximierter Riemann-Löser. Effizient und genau.' },
      { id: 'riem-5', type: 'single-choice', question: 'Was ist die Rankine-Hugoniot-Bedingung?', options: ['Randbedingung am Einlass', 'Sprungbedingung über eine Stoßwelle (Erhaltung über die Diskontinuität)', 'CFL-Bedingung', 'Stabilitätsgrenze'], correctIndex: 1, explanation: 'Rankine-Hugoniot: $[F] = s[U]$ — der Flusssprung über den Stoß = Schockgeschwindigkeit × Zustandssprung.' },
      { id: 'riem-6', type: 'single-choice', question: 'Was ist der HLL-Solver?', options: ['Ein Direktlöser', 'Ein approximierter Riemann-Löser mit 2 Wellengeschwindigkeiten', 'Ein Turbulenzmodell', 'Ein Multigrid-Verfahren'], correctIndex: 1, explanation: 'HLL (Harten-Lax-van Leer): Vereinfachter Riemann-Löser mit nur 2 Wellen (schnellste links und rechts).' },
      { id: 'riem-7', type: 'true-false', question: 'Wahr oder falsch?', statement: 'Der HLL-Solver kann Kontaktdiskontinuitäten auflösen.', correct: false, explanation: 'Falsch — HLL hat nur 2 Wellen → die mittlere Welle (Kontaktdiskontinuität) wird verschmiert. HLLC löst das.' },
      { id: 'riem-8', type: 'single-choice', question: 'Wofür steht das "C" in HLLC?', options: ['Compressible', 'Contact — es fügt die Kontaktwelle hinzu', 'Conservative', 'Central'], correctIndex: 1, explanation: 'HLLC = HLL + Contact: Erweitert HLL um die mittlere Kontaktwelle → kann Kontaktdiskontinuitäten auflösen.' },
      { id: 'riem-9', type: 'multi-select', question: 'Welche approximierten Riemann-Löser werden in CFD eingesetzt?', options: ['Roe', 'HLL', 'HLLC', 'Rusanov (Lax-Friedrichs)', 'SIMPLE'], correctIndices: [0, 1, 2, 3], explanation: 'Roe, HLL, HLLC, Rusanov sind Riemann-Löser. SIMPLE ist ein Druck-Geschwindigkeits-Kopplungsalgorithmus.' },
      { id: 'riem-10', type: 'single-choice', question: 'Warum braucht man Riemann-Löser in der kompressiblen Strömung?', options: ['Für die Zeitintegration', 'Um die Flüsse an Zellgrenzen korrekt zu berechnen, besonders bei Stoßwellen', 'Für die Randbedingungen', 'Für die Gittergenerierung'], correctIndex: 1, explanation: 'Riemann-Löser berechnen den numerischen Fluss an Cell-Faces unter Berücksichtigung der Wellenstruktur.' },
    ],
  },

  'comp-godunov': {
    lessonId: 'comp-godunov',
    questions: [
      { id: 'god-1', type: 'single-choice', question: 'Was ist die Godunov-Methode?', options: ['Ein Turbulenzmodell', 'FVM-Schema, das an jedem Face ein Riemann-Problem löst', 'Ein Direktlöser', 'Ein Gitter-Generator'], correctIndex: 1, explanation: 'Godunov: Stückweise konstante Zellwerte → Riemann-Problem an jedem Face → physikalisch motivierter Fluss.' },
      { id: 'god-2', type: 'true-false', question: 'Wahr oder falsch?', statement: 'Die Godunov-Methode 1. Ordnung ist monoton (bounded).', correct: true, explanation: 'Korrekt — Godunov 1. Ordnung ist monoton, aber auch diffusiv (wie UDS).' },
      { id: 'god-3', type: 'single-choice', question: 'Was besagt Godunovs Theorem?', options: ['FVM ist immer konservativ', 'Lineare monotone Schemata sind höchstens 1. Ordnung genau', 'CFL muss < 1 sein', 'Riemann-Probleme haben immer eine eindeutige Lösung'], correctIndex: 1, explanation: 'Godunovs Theorem: Kein lineares Schema kann gleichzeitig monoton und höherer als 1. Ordnung sein.' },
      { id: 'god-4', type: 'single-choice', question: 'Wie umgeht man Godunovs Theorem in der Praxis?', options: ['Gar nicht', 'Durch nichtlineare Schemata (TVD/MUSCL mit Limitern)', 'Durch feinere Gitter', 'Durch Direktlöser'], correctIndex: 1, explanation: 'TVD-/MUSCL-Rekonstruktion mit Flux-Limitern ist nichtlinear → Godunov-Theorem gilt nicht → 2. Ordnung + monoton.' },
      { id: 'god-5', type: 'text-input', question: 'Wie heißt das Verfahren, das stückweise lineare Rekonstruktion (statt konstant) in jeder Zelle nutzt?', acceptedAnswers: ['MUSCL', 'MUSCL-Rekonstruktion', 'MUSCL Scheme'], hint: 'Abk. von Van Leer', explanation: 'MUSCL = Monotone Upstream-centered Schemes for Conservation Laws (Van Leer) → 2. Ordnung Godunov.' },
      { id: 'god-6', type: 'multi-select', question: 'Was sind die Schritte der Godunov-Methode pro Zeitschritt?', options: ['Rekonstruktion der Zellrandwerte', 'Riemann-Problem an jedem Face lösen', 'Numerischen Fluss berechnen', 'Konservative Update-Formel anwenden'], correctIndices: [0, 1, 2, 3], explanation: '4 Schritte: Rekonstruktion → Riemann → Fluss → Update. Bei 1. Ordnung: stückweise-konstant.' },
      { id: 'god-7', type: 'true-false', question: 'Wahr oder falsch?', statement: 'MUSCL-Rekonstruktion mit Limitern ist der Standard in kompressiblen CFD-Codes.', correct: true, explanation: 'Korrekt — MUSCL + TVD-Limiter + approximierter Riemann-Löser ist die Standard-Methodik.' },
      { id: 'god-8', type: 'single-choice', question: 'Was macht die konservative Update-Formel?', options: ['$U_i^{n+1} = U_i^n - \\frac{\\Delta t}{\\Delta x}(F_{i+1/2} - F_{i-1/2})$', '$U_i^{n+1} = U_i^n + \\Delta t \\cdot S$', '$U_i^{n+1} = 0$', '$U_i^{n+1} = F_{i+1/2}$'], correctIndex: 0, explanation: 'Konservatives Update: Neuer Wert = alter Wert - (Netto-Fluss) × Δt/Δx — exakte Bilanz.' },
      { id: 'god-9', type: 'single-choice', question: 'Warum ist die Godunov-Methode konservativ?', options: ['Weil sie FDM nutzt', 'Weil der Fluss an jedem Face eindeutig ist und sich für Nachbarzellen aufhebt', 'Weil sie Multigrid nutzt', 'Weil sie implizit ist'], correctIndex: 1, explanation: 'Gleicher Fluss an gemeinsamem Face → Was aus einer Zelle raus, fließt in die Nachbarzelle → exakte Bilanz.' },
      { id: 'god-10', type: 'single-choice', question: 'Was ist der Unterschied zwischen Godunov 1. Ordnung und 2. Ordnung?', options: ['Kein Unterschied', 'Stückweise-konstant vs. stückweise-lineare Rekonstruktion in jeder Zelle', 'Verschiedene Riemann-Löser', 'Verschiedene Zeitschritte'], correctIndex: 1, explanation: '1. Ordnung: konstante Zellwerte. 2. Ordnung: lineare Rekonstruktion (MUSCL) → schärfere Auflösung.' },
    ],
  },

  'comp-shocktube': {
    lessonId: 'comp-shocktube',
    questions: [
      { id: 'st-1', type: 'single-choice', question: 'Was ist das Sod Shock-Tube Problem?', options: ['Ein Turbulenz-Benchmark', 'Ein Standard-Riemann-Problem: links hoher Druck, rechts niedrig', 'Ein 2D-Strömungsproblem', 'Ein stationäres Problem'], correctIndex: 1, explanation: 'Sod (1978): 1D Riemann-Problem mit Hochdruck links, Niederdruck rechts → Stoß, Expansion, Kontakt.' },
      { id: 'st-2', type: 'multi-select', question: 'Welche Phänomene treten beim Sod-Problem auf?', options: ['Stoßwelle (nach rechts)', 'Verdünnungsfächer (nach links)', 'Kontaktdiskontinuität', 'Turbulenz'], correctIndices: [0, 1, 2], explanation: 'Sod: 3 Wellen — Stoß (rechts), Expansion Fan (links), Kontaktdiskontinuität (Mitte). Keine Turbulenz (1D).' },
      { id: 'st-3', type: 'true-false', question: 'Wahr oder falsch?', statement: 'Das Sod-Problem hat eine exakte analytische Lösung.', correct: true, explanation: 'Korrekt — als Riemann-Problem mit idealem Gas hat das Sod-Problem eine exakte Lösung.' },
      { id: 'st-4', type: 'single-choice', question: 'Was zeigt ein 1. Ordnung-Schema (z.B. Godunov) beim Stoßrohr?', options: ['Exakte Lösung', 'Verschmierte Stöße und Kontakte', 'Oszillationen', 'Keine Lösung'], correctIndex: 1, explanation: '1. Ordnung → numerische Diffusion → Stoß und Kontaktdiskontinuität sind verschmiert.' },
      { id: 'st-5', type: 'single-choice', question: 'Was ist der Vorteil von 2. Ordnung-MUSCL gegenüber 1. Ordnung?', options: ['Immer stabil', 'Schärfere Auflösung von Stößen und Kontaktdiskontinuitäten', 'Kein Riemann-Löser nötig', 'Schnellere Berechnung'], correctIndex: 1, explanation: 'MUSCL-2O: Lineare Rekonstruktion → weniger numerische Diffusion → schärfere Fronten.' },
      { id: 'st-6', type: 'text-input', question: 'Wie heißt der Standard-Benchmark für 1D kompressible Strömung (Autoren 1978)?', acceptedAnswers: ['Sod', 'Sod Problem', 'Sod Shock Tube', 'Sod-Problem'], explanation: 'Sod (1978): DER Standard-Benchmark für kompressible 1D-Codes.' },
      { id: 'st-7', type: 'single-choice', question: 'Was sind die Anfangsbedingungen des Sod-Problems?', options: ['$\\rho_L = 1, p_L = 1, u_L = 0$ | $\\rho_R = 0.125, p_R = 0.1, u_R = 0$', '$\\rho_L = \\rho_R = 1, u_L = 1, u_R = -1$', 'Überall gleiche Bedingungen', '$\\rho_L = 0, p_L = 0$'], correctIndex: 0, explanation: 'Sod: Links (ρ=1, p=1, u=0), Rechts (ρ=0.125, p=0.1, u=0) — Druckverhältnis 10:1.' },
      { id: 'st-8', type: 'true-false', question: 'Wahr oder falsch?', statement: 'Die Kontaktdiskontinuität transportiert einen Sprung in der Dichte, aber nicht im Druck.', correct: true, explanation: 'Korrekt — an der Kontaktdiskontinuität: ρ und T springen, aber p und u sind stetig.' },
      { id: 'st-9', type: 'multi-select', question: 'Welche Größen kann man beim Sod-Problem verifizieren?', options: ['Dichteprofil ρ(x)', 'Druckprofil p(x)', 'Geschwindigkeitsprofil u(x)', 'Position der Stoßwelle', 'Turbulente kinetische Energie'], correctIndices: [0, 1, 2, 3], explanation: 'ρ, p, u, Stoßposition — alles vergleichbar mit exakter Lösung. Keine Turbulenz im 1D-Fall.' },
      { id: 'st-10', type: 'single-choice', question: 'Wie testet man die Ordnung des Schemas beim Sod-Problem?', options: ['Gitterstudie: L1-Fehler auf verschiedenen Gitterweiten → Konvergenzrate', 'Nur visueller Vergleich', 'CFL-Variation', 'Reynolds-Zahl-Studie'], correctIndex: 0, explanation: 'Gitterstudie: Fehler vs. Δx auf log-log-Plot → Steigung = Konvergenzordnung des Schemas.' },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // 11. TURBULENZ
  // ═══════════════════════════════════════════════════════════════

  'turb-intro': {
    lessonId: 'turb-intro',
    questions: [
      { id: 'ti-1', type: 'single-choice', question: 'Was ist Turbulenz?', options: ['Laminare Strömung bei hohem Re', 'Instationäre, dreidimensionale, chaotische Strömung mit breitem Spektrum an Skalen', 'Strömung ohne Wirbel', 'Stationäre Strömung'], correctIndex: 1, explanation: 'Turbulenz ist instationär, 3D, chaotisch, mit Wirbeln auf vielen Größenskalen.' },
      { id: 'ti-2', type: 'text-input', question: 'Ab welcher Kennzahl wird eine Strömung typischerweise turbulent?', acceptedAnswers: ['Reynolds-Zahl', 'Re', 'Reynolds'], explanation: 'Die Reynolds-Zahl bestimmt den Umschlag laminar → turbulent (z.B. Re_krit ≈ 2300 für Rohrströmung).' },
      { id: 'ti-3', type: 'true-false', question: 'Wahr oder falsch?', statement: 'Die Kolmogorov-Skala $\\eta$ ist die kleinste Wirbelgröße in turbulenter Strömung.', correct: true, explanation: 'Korrekt — $\\eta = (\\nu^3/\\varepsilon)^{1/4}$ ist die kleinste Skala, bei der Dissipation stattfindet.' },
      { id: 'ti-4', type: 'single-choice', question: 'Was beschreibt die Energiekaskade?', options: ['Energie wird von klein nach groß übertragen', 'Energie wird von großen zu kleinen Wirbeln übertragen und am Ende dissipiert', 'Energieverlust durch Reibung an der Wand', 'Energieerzeugung durch den Druck'], correctIndex: 1, explanation: 'Richardson-Kaskade: Große Wirbel → kleine Wirbel → Dissipation bei Kolmogorov-Skala.' },
      { id: 'ti-5', type: 'formula-select', question: 'Das Kolmogorov-Spektrum im Trägheitsbereich:', options: ['$E(k) \\sim \\varepsilon^{2/3} k^{-5/3}$', '$E(k) \\sim k^{-2}$', '$E(k) \\sim k^{+5/3}$', '$E(k) = \\text{const}$'], correctIndex: 0, explanation: '$E(k) \\sim \\varepsilon^{2/3} k^{-5/3}$ — das berühmte -5/3-Gesetz von Kolmogorov (1941).' },
      { id: 'ti-6', type: 'multi-select', question: 'Welche Eigenschaften hat turbulente Strömung?', options: ['Instationär', 'Dreidimensional', 'Dissipativ', 'Diffusiv (verstärkter Mischung)', 'Reversibel'], correctIndices: [0, 1, 2, 3], explanation: 'Turbulenz ist instationär, 3D, dissipativ und erhöht die Mischung. Nicht reversibel!' },
      { id: 'ti-7', type: 'single-choice', question: 'Wie groß ist das Verhältnis der größten zur kleinsten Skala in turbulenter Strömung?', options: ['$L/\\eta \\sim Re^{1/4}$', '$L/\\eta \\sim Re^{3/4}$', '$L/\\eta \\sim Re$', '$L/\\eta \\sim Re^{1/2}$'], correctIndex: 1, explanation: '$L/\\eta \\sim Re^{3/4}$ — bei Re = 10⁸: etwa 10⁶ Gitterpunkte pro Richtung für DNS!' },
      { id: 'ti-8', type: 'true-false', question: 'Wahr oder falsch?', statement: 'In turbulenter Strömung übersteigt der turbulente Transport typischerweise den molekularen um Größenordnungen.', correct: true, explanation: 'Korrekt — turbulente Wirbel transportieren Impuls, Wärme und Masse viel effektiver als molekulare Diffusion.' },
      { id: 'ti-9', type: 'single-choice', question: 'Was ist turbulente kinetische Energie (TKE)?', options: ['Die kinetische Energie der Hauptströmung', '$k = \\frac{1}{2}\\overline{u_i\' u_i\'}$ — Energie der Geschwindigkeitsfluktuationen', 'Die potentielle Energie', 'Die innere Energie'], correctIndex: 1, explanation: '$k = \\frac{1}{2}(\\overline{u\'^2} + \\overline{v\'^2} + \\overline{w\'^2})$ — Energie der turbulenten Schwankungen.' },
      { id: 'ti-10', type: 'text-input', question: 'Wie heißt die DNS-Methode, die alle Skalen direkt auflöst?', acceptedAnswers: ['DNS', 'Direct Numerical Simulation', 'Direkte Numerische Simulation'], explanation: 'DNS = Direct Numerical Simulation — löst alle Turbulenz-Skalen bis hinunter zur Kolmogorov-Skala.' },
    ],
  },

  'turb-rans': {
    lessonId: 'turb-rans',
    questions: [
      { id: 'tr-1', type: 'text-input', question: 'Wofür steht RANS?', acceptedAnswers: ['Reynolds-Averaged Navier-Stokes', 'Reynolds Averaged Navier Stokes'], explanation: 'RANS = Reynolds-Averaged Navier-Stokes — zeitgemittelte NS-Gleichungen.' },
      { id: 'tr-2', type: 'single-choice', question: 'Was ist die Reynolds-Zerlegung?', options: ['$u = \\overline{u} + u\'$ — Mittelwert + Schwankung', '$u = u_1 + u_2$', '$u = Re \\cdot \\nu / L$', '$u = \\nabla p / \\rho$'], correctIndex: 0, explanation: 'Reynolds-Zerlegung: $u = \\overline{u} + u\'$ mit $\\overline{u\'}= 0$.' },
      { id: 'tr-3', type: 'formula-select', question: 'Der Reynolds-Spannungstensor entsteht durch:', options: ['$-\\rho \\overline{u_i\' u_j\'}$ — Korrelation der Schwankungen', '$\\mu \\frac{\\partial u}{\\partial y}$', '$\\rho g$', '$-\\nabla p$'], correctIndex: 0, explanation: 'Reynolds-Spannungen: $\\tau_{ij}^{\\text{turb}} = -\\rho \\overline{u_i\' u_j\'}$ — 6 zusätzliche Unbekannte.' },
      { id: 'tr-4', type: 'single-choice', question: 'Was ist das Schließungsproblem bei RANS?', options: ['Zu wenige Randbedingungen', 'Mehr Unbekannte ($\\overline{u_i\' u_j\'}$) als Gleichungen → Turbulenzmodell nötig', 'Die Navier-Stokes haben keine Lösung', 'Das Gitter ist zu grob'], correctIndex: 1, explanation: 'Schließungsproblem: 6 Reynolds-Spannungen als neue Unbekannte → braucht Modell (z.B. Wirbelviskosität).' },
      { id: 'tr-5', type: 'formula-select', question: 'Die Boussinesq-Hypothese modelliert Reynolds-Spannungen als:', options: ['$-\\rho \\overline{u_i\' u_j\'} = \\mu_t (\\frac{\\partial \\overline{u_i}}{\\partial x_j} + \\frac{\\partial \\overline{u_j}}{\\partial x_i}) - \\frac{2}{3}\\rho k \\delta_{ij}$', '$\\tau_{ij} = \\mu \\frac{\\partial u}{\\partial y}$', '$\\tau_{ij} = 0$', '$\\tau_{ij} = \\rho u^2$'], correctIndex: 0, explanation: 'Boussinesq: Reynolds-Spannungen $\\propto$ mittlerem Deformationstensor — Analogie zur molekularen Viskosität.' },
      { id: 'tr-6', type: 'true-false', question: 'Wahr oder falsch?', statement: 'Die turbulente Viskosität $\\mu_t$ ist eine Stoffeigenschaft des Fluids.', correct: false, explanation: 'Falsch — $\\mu_t$ ist eine Eigenschaft der Strömung (nicht des Fluids!) und ist orts- und zeitabhängig.' },
      { id: 'tr-7', type: 'multi-select', question: 'Welche RANS-Modellkategorien gibt es?', options: ['0-Gleichung (algebraisch)', '1-Gleichung (z.B. Spalart-Allmaras)', '2-Gleichung (z.B. k-ε, k-ω)', 'Reynolds-Spannungs-Modell (RSM)', '10-Gleichung'], correctIndices: [0, 1, 2, 3], explanation: '0, 1, 2-Gleichungen und RSM (6+1 Gleichungen). Kein 10-Gl.-Modell.' },
      { id: 'tr-8', type: 'single-choice', question: 'Was berechnet ein 2-Gleichungs-Modell?', options: ['u und v', 'k (turbulente kinetische Energie) und ein Skalenmaß (ε, ω)', 'p und T', 'ρ und μ'], correctIndex: 1, explanation: '2-Gleichungs-Modelle lösen Transportgleichungen für k und entweder ε (Dissipation) oder ω (spez. Dissipation).' },
      { id: 'tr-9', type: 'true-false', question: 'Wahr oder falsch?', statement: 'Die Boussinesq-Hypothese versagt bei stark anisotroper Turbulenz (z.B. Eckenströmungen).', correct: true, explanation: 'Korrekt — Boussinesq nimmt isotrope Wirbelviskosität an → versagt wenn $\\overline{u_i\'u_j\'}$ stark anisotrop ist.' },
      { id: 'tr-10', type: 'single-choice', question: 'Was ist das Prandtl-Mischungsweg-Modell?', options: ['Ein 2-Gleichungs-Modell', 'Ein 0-Gleichungs-Modell: $\\mu_t = \\rho l_m^2 |\\partial \\bar{u}/\\partial y|$', 'Ein LES-Modell', 'Ein DNS-Verfahren'], correctIndex: 1, explanation: 'Mischungsweg: $\\mu_t = \\rho l_m^2 |dU/dy|$ — einfachstes Modell, empirischer Mischungsweg $l_m$.' },
    ],
  },

  'turb-ke': {
    lessonId: 'turb-ke',
    questions: [
      { id: 'ke-1', type: 'formula-select', question: 'Die turbulente Viskosität im k-ε Modell:', options: ['$\\mu_t = \\rho C_\\mu \\frac{k^2}{\\varepsilon}$', '$\\mu_t = \\rho k / \\varepsilon$', '$\\mu_t = C_\\mu k \\varepsilon$', '$\\mu_t = \\mu + k$'], correctIndex: 0, explanation: '$\\mu_t = \\rho C_\\mu k^2/\\varepsilon$ mit $C_\\mu = 0.09$ — das Standard k-ε Modell (Launder & Spalding, 1974).' },
      { id: 'ke-2', type: 'multi-select', question: 'Welche Transportgleichungen löst das k-ε Modell?', options: ['k — turbulente kinetische Energie', 'ε — Dissipationsrate', 'ω — spezifische Dissipationsrate', 'μ_t direkt'], correctIndices: [0, 1], explanation: 'k-ε löst k- und ε-Transportgln. ω gehört zum k-ω Modell, μ_t wird aus k und ε berechnet.' },
      { id: 'ke-3', type: 'true-false', question: 'Wahr oder falsch?', statement: 'Das Standard k-ε Modell versagt bei Strömungen mit starker Ablösung und Krümmung.', correct: true, explanation: 'Korrekt — Standard k-ε überschätzt k in Stagnationspunkten und versagt bei starker Krümmung/Ablösung.' },
      { id: 'ke-4', type: 'single-choice', question: 'Was ist $C_\\mu$ im k-ε Modell?', options: ['0.09', '0.5', '1.0', '1.44'], correctIndex: 0, explanation: '$C_\\mu = 0.09$ — Standard-Konstante im k-ε Modell.' },
      { id: 'ke-5', type: 'single-choice', question: 'Was beschreibt $\\varepsilon$ physikalisch?', options: ['Produktion turbulenter Energie', 'Rate der Dissipation von k in Wärme', 'Diffusion von k', 'Konvektion von k'], correctIndex: 1, explanation: '$\\varepsilon$ = Dissipationsrate: Rate, mit der turbulente kinetische Energie in Wärme umgewandelt wird.' },
      { id: 'ke-6', type: 'text-input', question: 'Wie heißen die beiden Autoren, die das Standard k-ε Modell 1974 vorgestellt haben?', acceptedAnswers: ['Launder und Spalding', 'Launder & Spalding', 'Launder Spalding'], explanation: 'Launder & Spalding (1974) — das meistzitierte Turbulenzmodell der Geschichte.' },
      { id: 'ke-7', type: 'multi-select', question: 'Was sind Nachteile des Standard k-ε Modells?', options: ['Schlecht nahe der Wand (braucht Wandfunktionen)', 'Überschätzt k in Stagnationspunkten', 'Versagt bei starker Krümmung', 'Kann keine 2D-Strömungen berechnen'], correctIndices: [0, 1, 2], explanation: 'k-ε: schlecht wandnah, überschätzt k-Produktion, versagt bei Krümmung. Funktioniert aber in 2D.' },
      { id: 'ke-8', type: 'single-choice', question: 'Was sind Wandfunktionen (Wall Functions)?', options: ['Randbedingungen, die das universelle Wandgesetz nutzen statt die Grenzschicht aufzulösen', 'Funktionen des Gitters an der Wand', 'Turbulenzmodelle für die Wand', 'Neue Gleichungen für die Wandschubspannung'], correctIndex: 0, explanation: 'Wandfunktionen: Brücke zwischen Wand und logarithmischer Schicht → erspart feine wandnahe Auflösung.' },
      { id: 'ke-9', type: 'true-false', question: 'Wahr oder falsch?', statement: 'Das realizable k-ε Modell (Shih) behebt einige Probleme des Standard-Modells, z.B. Stagnationspunkt-Anomalie.', correct: true, explanation: 'Korrekt — realizable k-ε nutzt variable $C_\\mu$ → physikalisch konsistenter bei Stagnation und Rotation.' },
      { id: 'ke-10', type: 'single-choice', question: 'Was ist das y+ für die erste Zelle bei Wandfunktionen?', options: ['$y^+ \\approx 1$', '$y^+ \\approx 30-100$', '$y^+ > 1000$', '$y^+ = 0$'], correctIndex: 1, explanation: 'Wandfunktionen: erste Zelle in der logarithmischen Schicht → $y^+ \\approx 30-100$ (nicht in der viskosen Unterschicht).' },
    ],
  },

  'turb-kw-sst': {
    lessonId: 'turb-kw-sst',
    questions: [
      { id: 'kw-1', type: 'single-choice', question: 'Was löst das k-ω Modell anstelle von ε?', options: ['Temperatur', '$\\omega = \\varepsilon / (C_\\mu k)$ — spezifische Dissipationsrate', 'Druck', 'Mach-Zahl'], correctIndex: 1, explanation: 'k-ω nutzt $\\omega$ (spez. Dissipationsrate) statt $\\varepsilon$ → besseres Wandverhalten.' },
      { id: 'kw-2', type: 'text-input', question: 'Wer hat das k-ω SST Modell entwickelt?', acceptedAnswers: ['Menter', 'F.R. Menter', 'Florian Menter'], explanation: 'F.R. Menter (1994) — SST kombiniert k-ω wandnah mit k-ε im Fernfeld.' },
      { id: 'kw-3', type: 'single-choice', question: 'Was bedeutet SST?', options: ['Super Sonic Turbulence', 'Shear Stress Transport', 'Standard Stencil Type', 'Steady State Turbulence'], correctIndex: 1, explanation: 'SST = Shear Stress Transport — Transport der Schubspannung, bessere Vorhersage bei Ablösung.' },
      { id: 'kw-4', type: 'true-false', question: 'Wahr oder falsch?', statement: 'Das k-ω SST Modell nutzt k-ω nahe der Wand und schaltet auf k-ε im Fernfeld um.', correct: true, explanation: 'Korrekt — SST: Blending-Funktion $F_1$ schaltet zwischen k-ω (Wand) und k-ε (fern) → Vorteile beider.' },
      { id: 'kw-5', type: 'multi-select', question: 'Welche Vorteile hat SST gegenüber Standard k-ε?', options: ['Besser nahe der Wand', 'Bessere Ablösungsvorhersage', 'Kein y+-Abhängigkeitsproblem im Fernfeld', 'Immer schnellere Konvergenz'], correctIndices: [0, 1, 2], explanation: 'SST: wandnah gut (k-ω), bessere Ablösung (Shear Stress Limiter), robustes Fernfeld (k-ε). Nicht unbedingt schneller.' },
      { id: 'kw-6', type: 'single-choice', question: 'Was ist die SST-Limitierung der turbulenten Viskosität?', options: ['$\\mu_t = \\rho k / \\omega$', '$\\mu_t = \\min(\\rho k/\\omega, \\rho a_1 k / (S F_2))$ mit Bradshaw-Konstante $a_1$', '$\\mu_t = C_\\mu \\rho k^2/\\varepsilon$', '$\\mu_t = \\text{const}$'], correctIndex: 1, explanation: 'SST-Limiter: $\\mu_t = \\min(\\rho k/\\omega, a_1 \\rho k / SF_2)$ → verhindert Überschätzung bei adversem Druckgradienten.' },
      { id: 'kw-7', type: 'single-choice', question: 'Was ist der Vorteil von k-ω gegenüber k-ε nahe der Wand?', options: ['k-ω braucht keine feine Wandauflösung', 'k-ω kann bis zur Wand integriert werden (low-Re) ohne Wandfunktionen', 'k-ω ist schneller', 'Extra Gleichungen'], correctIndex: 1, explanation: 'k-ω: $\\omega$ hat ein analytisches Wandverhalten → Integration bis $y^+ \\approx 1$ möglich (low-Re-fähig).' },
      { id: 'kw-8', type: 'true-false', question: 'Wahr oder falsch?', statement: 'k-ω SST ist das Standard-Industriemodell für viele Anwendungen und der Default in vielen CFD-Codes.', correct: true, explanation: 'Korrekt — SST ist der De-facto-Standard in der Industrie (Fluent, StarCCM+, OpenFOAM).' },
      { id: 'kw-9', type: 'single-choice', question: 'Was ist $F_1$ im SST-Modell?', options: ['Ein Fluss', 'Die Blending-Funktion: 1 nahe Wand (k-ω), 0 im Fernfeld (k-ε)', 'Die Fourier-Zahl', 'Ein Limiter'], correctIndex: 1, explanation: '$F_1$ schaltet sanft zwischen k-ω (=1 nahe Wand) und k-ε (=0 im Fernfeld).' },
      { id: 'kw-10', type: 'multi-select', question: 'Welche Anforderungen hat k-ω SST an das Gitter?', options: ['$y^+ \\approx 1$ an der Wand (für low-Re)', '10-20 Zellen in der Grenzschicht', 'Oder Wandfunktionen mit $y^+ > 30$', 'Gleichmäßiges Gitter überall'], correctIndices: [0, 1, 2], explanation: 'SST kann low-Re ($y^+ \\approx 1$, fein) oder mit Wandfunktionen ($y^+ > 30$) betrieben werden.' },
    ],
  },

  'turb-les': {
    lessonId: 'turb-les',
    questions: [
      { id: 'les-1', type: 'text-input', question: 'Wofür steht LES?', acceptedAnswers: ['Large Eddy Simulation', 'Large-Eddy Simulation'], explanation: 'LES = Large Eddy Simulation — große Wirbel direkt aufgelöst, kleine modelliert.' },
      { id: 'les-2', type: 'single-choice', question: 'Was ist die Grundidee von LES?', options: ['Alle Skalen modellieren', 'Große Wirbel direkt berechnen, nur die kleinen (SGS) modellieren', 'Alle Skalen direkt berechnen', 'Nur zeitgemittelte Gleichungen lösen'], correctIndex: 1, explanation: 'LES: Große Wirbel (> Filtergröße) direkt → feine Wirbel (< Filtergröße) → SGS-Modell.' },
      { id: 'les-3', type: 'single-choice', question: 'Was ist das SGS-Modell?', options: ['Sub-Grid Scale: Modelliert die Wirkung der unaufgelösten kleinen Wirbel', 'Ein Gittertyp', 'Ein Zeitintegrationsverfahren', 'Ein Druckkorrektur-Algorithmus'], correctIndex: 0, explanation: 'SGS = Sub-Grid Scale: Modelliert die Wirkung der Wirbel, die kleiner als die Filtergröße/Gitterweite sind.' },
      { id: 'les-4', type: 'formula-select', question: 'Das Smagorinsky-Modell für die SGS-Viskosität:', options: ['$\\mu_{\\text{sgs}} = \\rho (C_s \\Delta)^2 |\\bar{S}|$', '$\\mu_{\\text{sgs}} = \\rho C_\\mu k^2/\\varepsilon$', '$\\mu_{\\text{sgs}} = 0$', '$\\mu_{\\text{sgs}} = \\mu$'], correctIndex: 0, explanation: 'Smagorinsky: $\\mu_{sgs} = \\rho (C_s \\Delta)^2 |\\bar{S}|$ — einfachstes SGS-Modell ($C_s \\approx 0.1$).' },
      { id: 'les-5', type: 'multi-select', question: 'Welche Anforderungen hat LES?', options: ['Feines Gitter (besonders Grenzschicht)', 'Instationäre Berechnung (3D, zeitabhängig)', 'Kleiner Zeitschritt (CFL ~ 1)', 'Lange Simulationszeiten für Statistik', 'Keine besonderen'], correctIndices: [0, 1, 2, 3], explanation: 'LES braucht feines 3D-Gitter, kleine Zeitschritte und lange Rechenzeiten für statistische Auswertung.' },
      { id: 'les-6', type: 'true-false', question: 'Wahr oder falsch?', statement: 'LES ist billiger als RANS, weil weniger Gleichungen gelöst werden.', correct: false, explanation: 'Falsch — LES ist viel teurer: 3D, instationär, feines Gitter → typisch 100-1000× teurer als RANS.' },
      { id: 'les-7', type: 'single-choice', question: 'Was ist die Filtergröße $\\Delta$ bei LES?', options: ['Ein fester Wert', 'Typischerweise die lokale Gitterweite', 'Die Reynolds-Zahl', 'Die Zeitschrittgröße'], correctIndex: 1, explanation: 'In der Praxis: $\\Delta = (\\Delta x \\cdot \\Delta y \\cdot \\Delta z)^{1/3}$ — die Gitterweite bestimmt, was aufgelöst wird.' },
      { id: 'les-8', type: 'single-choice', question: 'Was ist Wall-Modeled LES (WMLES)?', options: ['LES mit RANS-Modell nahe der Wand statt voller Wandauflösung', 'LES ohne Wand', 'LES mit Wandfunktionen', 'DNS nahe der Wand'], correctIndex: 0, explanation: 'WMLES: RANS oder Wall-Model in Wandnähe + LES im Kernbereich → reduziert den Gitteraufwand drastisch.' },
      { id: 'les-9', type: 'true-false', question: 'Wahr oder falsch?', statement: 'Bei LES erbringt das SGS-Modell weniger als 10-20% der gesamten turbulenten Mischung — der Großteil wird direkt aufgelöst.', correct: true, explanation: 'Korrekt — eine gute LES löst > 80% der turbulenten Energie direkt auf. SGS nur der "Rest".' },
      { id: 'les-10', type: 'multi-select', question: 'Welche SGS-Modelle gibt es?', options: ['Smagorinsky', 'Dynamic Smagorinsky (Germano)', 'WALE', 'k-ε (das ist RANS, nicht SGS)'], correctIndices: [0, 1, 2], explanation: 'Smagorinsky, Dynamic Smagorinsky, WALE sind SGS-Modelle. k-ε ist ein RANS-Modell.' },
    ],
  },

  'turb-dns': {
    lessonId: 'turb-dns',
    questions: [
      { id: 'dns-1', type: 'single-choice', question: 'Was ist DNS?', options: ['Domain Name System', 'Direct Numerical Simulation — alle Skalen direkt aufgelöst', 'Discrete Numerical Scheme', 'Dynamic Navier-Stokes'], correctIndex: 1, explanation: 'DNS = Direct Numerical Simulation — löst die NS-Gleichungen ohne jedes Turbulenzmodell.' },
      { id: 'dns-2', type: 'true-false', question: 'Wahr oder falsch?', statement: 'DNS benötigt kein Turbulenzmodell.', correct: true, explanation: 'Korrekt — DNS löst ALLE Skalen direkt auf → kein Modell nötig.' },
      { id: 'dns-3', type: 'formula-select', question: 'Der Gitteraufwand für DNS skaliert mit:', options: ['$N \\sim Re^{9/4}$ (in 3D)', '$N \\sim Re$', '$N \\sim Re^2$', '$N \\sim \\log(Re)$'], correctIndex: 0, explanation: '$N_{\\text{3D}} \\sim (Re^{3/4})^3 = Re^{9/4}$ — extrem teuer bei hohen Reynolds-Zahlen.' },
      { id: 'dns-4', type: 'single-choice', question: 'Für welche Reynolds-Zahlen ist DNS heute machbar?', options: ['Re ≈ 100', 'Re ≈ 10⁴ - 10⁵ (einfache Geometrien)', 'Re ≈ 10⁸', 'Alle'], correctIndex: 1, explanation: 'DNS: Aktuell bis ca. Re ≈ 10⁴-10⁵ möglich (auf Supercomputern). Industrielle Re (10⁶-10⁸): unmöglich.' },
      { id: 'dns-5', type: 'multi-select', question: 'Wofür wird DNS eingesetzt?', options: ['Grundlagenforschung der Turbulenz', 'Validierung von RANS- und LES-Modellen', 'Industrielle Auslegung von Flugzeugen', 'Erstellung von Turbulenz-Datenbanken'], correctIndices: [0, 1, 3], explanation: 'DNS: Forschung, Modellvalidierung, Datenbanken. Nicht für industrielle Auslegung (zu teuer).' },
      { id: 'dns-6', type: 'true-false', question: 'Wahr oder falsch?', statement: 'DNS mit Gitterweite $\\Delta x > \\eta$ löst nicht alle Turbulenz-Skalen auf und ist daher „unter-aufgelöst".', correct: true, explanation: 'Korrekt — DNS erfordert $\\Delta x \\leq \\eta$ (Kolmogorov-Skala). Gröber = unter-aufgelöst (nicht mehr DNS).' },
      { id: 'dns-7', type: 'single-choice', question: 'Welche numerische Methode wird oft für DNS verwendet?', options: ['1. Ordnung FVM', 'Hochordnungsspektral-Methoden oder kompakte Finite Differenzen', 'Standard UDS', 'Lattice Boltzmann'], correctIndex: 1, explanation: 'DNS braucht minimale numerische Dissipation → Spektralmethoden oder hochgenaue kompakte FD-Schemata.' },
      { id: 'dns-8', type: 'single-choice', question: 'Warum braucht DNS hohe Ordnung-Schemata?', options: ['Für schnellere Konvergenz', 'Um numerische Dissipation zu minimieren, die die feinen Skalen zerstören würde', 'Für einfachere Programmierung', 'Um Randbedingungen besser zu behandeln'], correctIndex: 1, explanation: 'Niedrige Ordnung (z.B. UDS) hat zu viel numerische Diffusion → zerstört die feinen Turbulenzstrukturen.' },
      { id: 'dns-9', type: 'text-input', question: 'Wie skaliert der Zeitaufwand von DNS mit Re (3D, instationär)?', acceptedAnswers: ['Re^3', 'Re hoch 3', 'Re^(11/4)'], hint: 'Potenzgesetz', explanation: 'Zeitaufwand $\\sim Re^{11/4}$ bis $Re^3$ (je nach Implementierung) — schnell prohibitiv.' },
      { id: 'dns-10', type: 'single-choice', question: 'Was ist der Unterschied zwischen DNS und gut aufgelöstem LES?', options: ['Kein Unterschied', 'DNS löst alle Skalen auf, LES filtert die kleinen und modelliert sie', 'DNS braucht ein SGS-Modell', 'LES ist genauer als DNS'], correctIndex: 1, explanation: 'DNS: ALLE Skalen aufgelöst. LES: große Skalen direkt, kleine via SGS-Modell. DNS exakter aber teurer.' },
    ],
  },

  'turb-wall': {
    lessonId: 'turb-wall',
    questions: [
      { id: 'tw-1', type: 'formula-select', question: 'Der dimensionslose Wandabstand $y^+$ ist definiert als:', options: ['$y^+ = \\frac{y u_\\tau}{\\nu}$', '$y^+ = \\frac{y}{\\delta}$', '$y^+ = Re_y$', '$y^+ = y/\\Delta x$'], correctIndex: 0, explanation: '$y^+ = y u_\\tau / \\nu$ mit Wandschubspannungsgeschwindigkeit $u_\\tau = \\sqrt{\\tau_w/\\rho}$.' },
      { id: 'tw-2', type: 'single-choice', question: 'Was ist die viskose Unterschicht?', options: ['Bereich $y^+ > 30$', 'Bereich $y^+ < 5$ — dort dominiert die molekulare Viskosität', 'Der gesamte Grenzschichtbereich', 'Bereich außerhalb der Grenzschicht'], correctIndex: 1, explanation: 'Viskose Unterschicht: $y^+ < 5$. Dort: $u^+ = y^+$ (lineares Profil).' },
      { id: 'tw-3', type: 'formula-select', question: 'Das logarithmische Wandgesetz lautet:', options: ['$u^+ = \\frac{1}{\\kappa}\\ln(y^+) + B$', '$u^+ = y^+$', '$u^+ = (y^+)^2$', '$u^+ = \\sqrt{y^+}$'], correctIndex: 0, explanation: 'Log-Gesetz: $u^+ = (1/\\kappa)\\ln(y^+) + B$ mit $\\kappa \\approx 0.41$, $B \\approx 5.2$ (von Kármán).' },
      { id: 'tw-4', type: 'text-input', question: 'Wie heißt die Konstante κ ≈ 0.41 im logarithmischen Wandgesetz?', acceptedAnswers: ['Von-Kármán-Konstante', 'Kármán-Konstante', 'von Karman Konstante', 'kappa'], explanation: '$\\kappa \\approx 0.41$ — die von-Kármán-Konstante, universell für wandgebundene Turbulenz.' },
      { id: 'tw-5', type: 'multi-select', question: 'Welche Schichten gibt es in der turbulenten Grenzschicht?', options: ['Viskose Unterschicht ($y^+ < 5$)', 'Pufferschicht ($5 < y^+ < 30$)', 'Logarithmische Schicht ($y^+ > 30$)', 'Äußere Schicht (wake region)'], correctIndices: [0, 1, 2, 3], explanation: '4 Schichten: viskos, Puffer, logarithmisch, äußere Schicht.' },
      { id: 'tw-6', type: 'true-false', question: 'Wahr oder falsch?', statement: 'Für "Low-Re"-Turbulenzmodellierung muss die erste Zelle bei $y^+ \\approx 1$ liegen.', correct: true, explanation: 'Korrekt — Low-Re: Wand direkt auflösen, erste Zelle im viskosen Bereich ($y^+ \\approx 1$).' },
      { id: 'tw-7', type: 'single-choice', question: 'Was passiert wenn $y^+$ der ersten Zelle in der Pufferschicht liegt (5 < $y^+$ < 30)?', options: ['Perfekte Lösung', 'Weder Wandauflösung noch Wandfunktion korrekt → schlechteste Region', 'Kein Problem', 'Automatische Anpassung'], correctIndex: 1, explanation: 'Die Pufferschicht ist No-Mans-Land: Zu weit für viskose Auflösung, zu nah für Wandfunktionen.' },
      { id: 'tw-8', type: 'single-choice', question: 'Was sind "all-y+" Wandmodelle?', options: ['Wandmodelle, die nur bei hohem y+ funktionieren', 'Wandmodelle, die automatisch zwischen Low-Re und Wandfunktionen blenden', 'DNS-Wandauflösung', 'Ein Gitteradaptionsverfahren'], correctIndex: 1, explanation: 'All-y+ (z.B. in StarCCM+): Automatisches Blending zwischen Low-Re und High-Re Wandbehandlung.' },
      { id: 'tw-9', type: 'formula-select', question: 'In der viskosen Unterschicht gilt:', options: ['$u^+ = y^+$', '$u^+ = \\frac{1}{\\kappa}\\ln(y^+) + B$', '$u^+ = (y^+)^{1/7}$', '$u^+ = 0$'], correctIndex: 0, explanation: '$u^+ = y^+$ — lineares Profil in der viskosen Unterschicht (dominiert von $\\mu$).' },
      { id: 'tw-10', type: 'true-false', question: 'Wahr oder falsch?', statement: 'Wandfunktionen sind bei allen Strömungen gleich genau wie die volle Wandauflösung.', correct: false, explanation: 'Falsch — Wandfunktionen basieren auf dem Log-Gesetz, das bei Ablösung, starken Druckgradienten etc. versagt.' },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // 12. ZWEIPHASENSTRÖMUNG
  // ═══════════════════════════════════════════════════════════════

  'twophase-intro': {
    lessonId: 'twophase-intro',
    questions: [
      { id: 'tp-1', type: 'single-choice', question: 'Was ist eine Zweiphasenströmung?', options: ['Strömung mit zwei Geschwindigkeiten', 'Strömung mit zwei verschiedenen Phasen (z.B. Wasser und Luft)', 'Strömung in 2D', 'Strömung mit Turbulenz'], correctIndex: 1, explanation: 'Zweiphasenströmung: Gleichzeitige Strömung von zwei Phasen (z.B. Gas-Flüssigkeit, Flüssigkeit-Flüssigkeit).' },
      { id: 'tp-2', type: 'multi-select', question: 'Welche Arten von Zweiphasenströmungen gibt es?', options: ['Gas-Flüssigkeit (z.B. Blasen in Wasser)', 'Flüssigkeit-Flüssigkeit (z.B. Öl-Wasser)', 'Gas-Feststoff (z.B. Staubtransport)', 'Flüssigkeit-Feststoff (z.B. Schlammtransport)'], correctIndices: [0, 1, 2, 3], explanation: 'Alle vier Kombinationen sind möglich und kommen in der Praxis vor.' },
      { id: 'tp-3', type: 'single-choice', question: 'Was ist das Interface (Phasengrenze)?', options: ['Die Wand des Rechengebiets', 'Die Grenzfläche zwischen den beiden Phasen', 'Die Zellgrenze im Gitter', 'Der Rand des Rechners'], correctIndex: 1, explanation: 'Interface = Phasengrenze: Die Fläche, an der zwei Phasen aufeinandertreffen.' },
      { id: 'tp-4', type: 'true-false', question: 'Wahr oder falsch?', statement: 'Bei Zweiphasenströmungen können die Dichte und Viskosität um Größenordnungen springen.', correct: true, explanation: 'Korrekt — z.B. Wasser/Luft: ρ-Verhältnis ≈ 1000:1, μ-Verhältnis ≈ 50:1.' },
      { id: 'tp-5', type: 'single-choice', question: 'Was ist die Weber-Zahl?', options: ['$We = \\rho u^2 L / \\sigma$ — Trägheit zu Oberflächenspannung', '$We = \\mu u / \\sigma$', '$We = Re \\cdot Ma$', '$We = \\sigma / (\\rho u L)$'], correctIndex: 0, explanation: '$We = \\rho u^2 L / \\sigma$ — Verhältnis von Trägheitskräften zu Oberflächenspannung.' },
      { id: 'tp-6', type: 'multi-select', question: 'Welche numerischen Methoden werden für Interface-Tracking genutzt?', options: ['Volume of Fluid (VOF)', 'Level-Set', 'Phase-Field', 'Front-Tracking', 'k-ε'], correctIndices: [0, 1, 2, 3], explanation: 'VOF, Level-Set, Phase-Field, Front-Tracking sind Interface-Methoden. k-ε ist Turbulenz.' },
      { id: 'tp-7', type: 'text-input', question: 'Was ist die physikalische Größe σ (Sigma), die bei Tropfen und Blasen eine Rolle spielt?', acceptedAnswers: ['Oberflächenspannung', 'Surface Tension', 'Grenzflächenspannung'], explanation: 'σ = Oberflächenspannung — erzeugt den Drucksprung über gekrümmte Interfaces (Young-Laplace).' },
      { id: 'tp-8', type: 'single-choice', question: 'Was ist die Young-Laplace-Gleichung?', options: ['$\\Delta p = \\sigma \\kappa$ — Drucksprung = Oberflächenspannung × Krümmung', '$\\Delta p = \\rho g h$', '$\\Delta p = 0$', '$\\Delta p = \\mu \\nabla^2 u$'], correctIndex: 0, explanation: 'Young-Laplace: $\\Delta p = \\sigma \\kappa$ mit Krümmung $\\kappa$ → Drucksprung über gekrümmte Grenzfläche.' },
      { id: 'tp-9', type: 'true-false', question: 'Wahr oder falsch?', statement: 'Der Dichtesprung an der Phasengrenze erfordert spezielle numerische Behandlung.', correct: true, explanation: 'Korrekt — scharfe Dichtesprünge erzeugen numerische Instabilitäten. Ghost-Fluid oder ähnliche Methoden nötig.' },
      { id: 'tp-10', type: 'single-choice', question: 'Was ist ein Euler-Euler-Ansatz?', options: ['Beide Phasen auf Euler-Gitter (Mischungsmodell) mit separaten Transportgleichungen pro Phase', 'Eine Phase Euler, andere Lagrange', 'Nur eine Phase wird berechnet', 'Ein Zeitintegrationsverfahren'], correctIndex: 0, explanation: 'Euler-Euler: Beide Phasen als interpenetrierende Kontinua auf dem gleichen Gitter. Euler-Lagrange: Partikel werden verfolgt.' },
    ],
  },

  'twophase-vof': {
    lessonId: 'twophase-vof',
    questions: [
      { id: 'vof-1', type: 'text-input', question: 'Wofür steht VOF?', acceptedAnswers: ['Volume of Fluid', 'Volume-of-Fluid'], explanation: 'VOF = Volume of Fluid — der Volumenanteil α jeder Phase pro Zelle wird transportiert.' },
      { id: 'vof-2', type: 'single-choice', question: 'Was ist die VOF-Farbfunktion α?', options: ['α = 0: Phase 2, α = 1: Phase 1, 0 < α < 1: Interface-Zelle', 'Ein Turbulenzparameter', 'Die Geschwindigkeit', 'Der Druck'], correctIndex: 0, explanation: 'α = Volumenanteil: α=1 (volle Phase 1), α=0 (Phase 2), dazwischen: Interface liegt in der Zelle.' },
      { id: 'vof-3', type: 'formula-select', question: 'Die α-Transportgleichung lautet:', options: ['$\\frac{\\partial \\alpha}{\\partial t} + \\nabla \\cdot (\\mathbf{u} \\alpha) = 0$', '$\\frac{\\partial \\alpha}{\\partial t} = \\Gamma \\nabla^2 \\alpha$', '$\\alpha = \\text{const}$', '$\\nabla \\alpha = 0$'], correctIndex: 0, explanation: 'VOF-Transport: $\\partial \\alpha/\\partial t + \\nabla \\cdot (\\mathbf{u}\\alpha) = 0$ — reine Konvektion.' },
      { id: 'vof-4', type: 'true-false', question: 'Wahr oder falsch?', statement: 'VOF ist automatisch masseerhaltend, weil es auf einer Volumenanteil-Transportgleichung basiert.', correct: true, explanation: 'Korrekt — die α-Gleichung ist konservativ formuliert → exakte Massenerhaltung für jede Phase.' },
      { id: 'vof-5', type: 'single-choice', question: 'Was ist das numerische Problem bei VOF?', options: ['Das Interface wird nicht verschmiert', 'Standard-Schemata verschmieren das Interface (α zwischen 0 und 1 über mehrere Zellen)', 'VOF ist immer instabil', 'VOF funktioniert nur in 1D'], correctIndex: 1, explanation: 'Numerische Diffusion verschmiert das Interface → spezielle Interface-Schärfungs-Verfahren nötig.' },
      { id: 'vof-6', type: 'multi-select', question: 'Welche Techniken gibt es zur Interface-Schärfung bei VOF?', options: ['Geometrische Rekonstruktion (PLIC)', 'Kompressive Schemata (z.B. CICSAM, HRIC)', 'Interface Compression Term (OpenFOAM)', 'Keine — Verschmierung akzeptieren'], correctIndices: [0, 1, 2], explanation: 'PLIC, kompressive Schemata und künstliche Kompression sind Methoden zur Interface-Schärfung.' },
      { id: 'vof-7', type: 'text-input', question: 'Wie berechnet man die Mischungseigenschaften (z.B. Dichte) in einer Interface-Zelle?', acceptedAnswers: ['Arithmetischer Mittelwert', 'rho = alpha*rho1 + (1-alpha)*rho2', 'Linearer Mix'], hint: 'Gewichtung mit α', explanation: '$\\rho = \\alpha \\rho_1 + (1-\\alpha)\\rho_2$ — lineare Interpolation basierend auf α.' },
      { id: 'vof-8', type: 'single-choice', question: 'Was ist PLIC?', options: ['Piecewise Linear Interface Calculation — geometrische Rekonstruktion des Interfaces', 'Ein Druckkorrektur-Algorithmus', 'Ein Turbulenzmodell', 'Ein Zeitintegrationsverfahren'], correctIndex: 0, explanation: 'PLIC rekonstruiert das Interface als ebene Fläche in jeder Zelle basierend auf α und ∇α → scharf.' },
      { id: 'vof-9', type: 'true-false', question: 'Wahr oder falsch?', statement: 'VOF kann Interface-Topologieänderungen (Verschmelzung, Aufbrechen) automatisch handhaben.', correct: true, explanation: 'Korrekt — VOF ist Euler-basiert: Topologieänderungen passieren natürlich, da nur α transportiert wird.' },
      { id: 'vof-10', type: 'single-choice', question: 'Was ist der Hauptvorteil von VOF gegenüber Level-Set?', options: ['Höhere Genauigkeit', 'Exakte Massenerhaltung', 'Einfachere Implementierung', 'Besseres Interface'], correctIndex: 1, explanation: 'VOF: Exakte Massenerhaltung (konservative Gleichung). Level-Set kann Masse verlieren/gewinnen.' },
    ],
  },

  'twophase-levelset': {
    lessonId: 'twophase-levelset',
    questions: [
      { id: 'ls-1', type: 'single-choice', question: 'Was ist die Level-Set-Methode?', options: ['VOF mit geometrischer Rekonstruktion', 'Abstandsfunktion $\\phi(x,t)$: Interface dort wo $\\phi = 0$', 'Eine Gittergenerierungsmethode', 'Ein Turbulenzmodell'], correctIndex: 1, explanation: 'Level-Set: Vorzeichenbehaftete Abstandsfunktion $\\phi$. Interface = Nullstelle von $\\phi$.' },
      { id: 'ls-2', type: 'formula-select', question: 'Die Level-Set-Transportgleichung:', options: ['$\\frac{\\partial \\phi}{\\partial t} + \\mathbf{u} \\cdot \\nabla \\phi = 0$', '$\\frac{\\partial \\phi}{\\partial t} + \\nabla \\cdot (\\mathbf{u} \\phi) = 0$', '$\\nabla^2 \\phi = 0$', '$\\phi = \\text{const}$'], correctIndex: 0, explanation: 'LS-Transport: $\\partial\\phi/\\partial t + \\mathbf{u} \\cdot \\nabla \\phi = 0$ — advektive (nicht konservative!) Form.' },
      { id: 'ls-3', type: 'single-choice', question: 'Was ist der Hauptnachteil der Level-Set-Methode?', options: ['Schlechte Geometrie', 'Massenverlust/-gewinn weil die Gleichung nicht in konservativer Form ist', 'Zu teuer', 'Nur für 2D geeignet'], correctIndex: 1, explanation: 'LS in nicht-konservativer Form → Volumen/Masse wird nicht exakt erhalten → ΔV ≠ 0 über die Zeit.' },
      { id: 'ls-4', type: 'true-false', question: 'Wahr oder falsch?', statement: 'Level-Set erlaubt eine einfache Berechnung geometrischer Interface-Eigenschaften (Normalen, Krümmung).', correct: true, explanation: 'Korrekt — $\\mathbf{n} = \\nabla \\phi / |\\nabla\\phi|$ und $\\kappa = \\nabla \\cdot \\mathbf{n}$ — direkt aus der glatten Funktion $\\phi$.' },
      { id: 'ls-5', type: 'multi-select', question: 'Welche Vorteile hat Level-Set gegenüber VOF?', options: ['Glattere Interface-Beschreibung', 'Einfache Berechnung von Normalen und Krümmung', 'Exakte Massenerhaltung', 'Natürliche Erweiterung auf höhere Ordnung'], correctIndices: [0, 1, 3], explanation: 'LS: glatt, einfache Geometrie, erweiterbar. ABER: keine exakte Massenerhaltung!' },
      { id: 'ls-6', type: 'text-input', question: 'Wie heißt der Schritt, der die Level-Set-Funktion wieder zu einer Abstandsfunktion macht?', acceptedAnswers: ['Reinitialisierung', 'Reinitialization', 'Redistancing'], explanation: 'Reinitialisierung: Stellt sicher, dass $|\\nabla\\phi| = 1$ (Abstandseigenschaft) erhalten bleibt.' },
      { id: 'ls-7', type: 'formula-select', question: 'Die Eigenschaft einer Abstandsfunktion (Signed Distance Function):', options: ['$|\\nabla \\phi| = 1$', '$\\nabla^2 \\phi = 0$', '$\\phi > 0$ überall', '$\\phi = \\alpha$'], correctIndex: 0, explanation: '$|\\nabla\\phi| = 1$ — die Abstandseigenschaft: |∇φ| liefert überall den Einheitsgradient.' },
      { id: 'ls-8', type: 'single-choice', question: 'Was ist die CLSVOF-Methode?', options: ['Kombination von Level-Set (Geometrie) und VOF (Massenerhaltung)', 'Ein reiner VOF-Löser', 'Ein RANS-Modell', 'Ein Gittergenerator'], correctIndex: 0, explanation: 'CLSVOF: Coupled Level-Set + VOF — LS für Geometrie (Normalen, Krümmung), VOF für Massenerhaltung.' },
      { id: 'ls-9', type: 'true-false', question: 'Wahr oder falsch?', statement: 'Level-Set funktioniert nur in 2D.', correct: false, explanation: 'Falsch — Level-Set funktioniert in 2D und 3D. Die φ-Funktion ist ein skalares Feld in beliebiger Dimension.' },
      { id: 'ls-10', type: 'single-choice', question: 'In welcher Phase ist φ positiv, in welcher negativ?', options: ['Konvention: φ > 0 in Phase 1, φ < 0 in Phase 2, φ = 0 am Interface', 'φ ist immer positiv', 'φ ist immer negativ', 'φ ist überall null'], correctIndex: 0, explanation: 'Signed Distance: φ > 0 auf einer Seite, φ < 0 auf der anderen, φ = 0 genau am Interface.' },
    ],
  },

  'twophase-surface-tension': {
    lessonId: 'twophase-surface-tension',
    questions: [
      { id: 'st2-1', type: 'single-choice', question: 'Wie wird Oberflächenspannung in CFD typischerweise modelliert?', options: ['Als Randbedingung', 'Als Volumenkraft via CSF (Continuum Surface Force)', 'Als zusätzliche Gleichung', 'Gar nicht'], correctIndex: 1, explanation: 'CSF (Brackbill 1992): Oberflächenspannung als Volumenkraft $\\mathbf{f}_\\sigma = \\sigma \\kappa \\nabla \\alpha$ in den Impulsgln.' },
      { id: 'st2-2', type: 'formula-select', question: 'Die CSF-Volumenkraft lautet:', options: ['$\\mathbf{f}_\\sigma = \\sigma \\kappa \\nabla \\alpha$', '$\\mathbf{f}_\\sigma = \\rho \\mathbf{g}$', '$\\mathbf{f}_\\sigma = \\mu \\nabla^2 \\mathbf{u}$', '$\\mathbf{f}_\\sigma = -\\nabla p$'], correctIndex: 0, explanation: 'CSF: $\\mathbf{f}_\\sigma = \\sigma \\kappa \\nabla \\alpha$ — wirkt nur in Interface-Nähe (wo ∇α ≠ 0).' },
      { id: 'st2-3', type: 'true-false', question: 'Wahr oder falsch?', statement: 'Parasitic Currents (Spurious Currents) sind unphysikalische Strömungen, die durch numerische Fehler bei der Oberflächenspannungsberechnung entstehen.', correct: true, explanation: 'Korrekt — Inkonsistenz zwischen Druckgradient und Oberflächenspannung erzeugt nicht-physkalische Geschwindigkeiten am Interface.' },
      { id: 'st2-4', type: 'single-choice', question: 'Was ist die Kapillarzahl $Ca$?', options: ['$Ca = \\mu u / \\sigma$ — Viskosität zu Oberflächenspannung', '$Ca = \\rho u^2 L / \\sigma$', '$Ca = Re / We$', '$Ca = u / a$'], correctIndex: 0, explanation: '$Ca = \\mu u / \\sigma$ — Verhältnis von viskosen Kräften zu Oberflächenspannungskräften.' },
      { id: 'st2-5', type: 'multi-select', question: 'Was sind Ursachen von Parasitic Currents?', options: ['Ungenügende Krümmungsberechnung', 'Inkonsistenz zwischen Druck und Oberflächenspannung', 'Verschmiertes Interface (numerische Diffusion)', 'Zu hohe Reynolds-Zahl'], correctIndices: [0, 1, 2], explanation: 'Parasitic Currents: ungenaue Krümmung, Druck-σ-Inkonsistenz, verschmiertes Interface. Nicht Re-abhängig.' },
      { id: 'st2-6', type: 'text-input', question: 'Wie heißt die Methode von Brackbill (1992) zur Modellierung der Oberflächenspannung als Volumenkraft?', acceptedAnswers: ['CSF', 'Continuum Surface Force', 'CSF-Methode'], explanation: 'CSF = Continuum Surface Force (Brackbill et al., 1992) — Standard-Methode für σ.' },
      { id: 'st2-7', type: 'single-choice', question: 'Warum ist die Krümmungsberechnung für Oberflächenspannung so wichtig?', options: ['Für die Energiebilanz', 'Weil $f_\\sigma = \\sigma \\kappa \\nabla \\alpha$ — falsche Krümmung $\\kappa$ → falsche Kraft', 'Für die Zeitschrittberechnung', 'Für die Randbedingungen'], correctIndex: 1, explanation: 'Die Kraft ist proportional zur Krümmung $\\kappa$. Fehler in κ führen direkt zu Parasitic Currents.' },
      { id: 'st2-8', type: 'true-false', question: 'Wahr oder falsch?', statement: 'Level-Set liefert typischerweise eine glattere Krümmungsberechnung als VOF.', correct: true, explanation: 'Korrekt — die glatte Abstandsfunktion $\\phi$ erlaubt einfachere und genauere Krümmungsberechnung als das sprunghafte α.' },
      { id: 'st2-9', type: 'single-choice', question: 'Was ist der Laplace-Drucktest?', options: ['Ein Test für den Drucklöser', 'Statische Blase/Tropfen: prüft ob $\\Delta p = \\sigma/R$ korrekt reproduziert wird', 'Ein Turbulenztest', 'Ein Geschwindigkeitstest'], correctIndex: 1, explanation: 'Laplace-Test: Ruhende Blase → Drucksprung $\\Delta p = \\sigma/R$ (2D) oder $2\\sigma/R$ (3D). Testet Parasitic Currents.' },
      { id: 'st2-10', type: 'single-choice', question: 'Wie kann man Parasitic Currents reduzieren?', options: ['Feineres Gitter und bessere Krümmungsberechnung', 'Groberes Gitter', 'Mehr Zeitschritte', 'Höhere Reynolds-Zahl'], correctIndex: 0, explanation: 'Feineere Gitter + genaue Krümmung (z.B. Height-Function) + konsistente Druck-σ-Balance reduzieren Parasitic Currents.' },
    ],
  },
};

/* ═══════════════════════════════════════════════════════════════════
   Merge vorlesung questions into existing lesson entries
   ═══════════════════════════════════════════════════════════════════ */
for (const [lid, qs] of Object.entries(vorlesungExtras)) {
  if (quizBank[lid]) {
    quizBank[lid].questions.push(...qs);
  }
}
