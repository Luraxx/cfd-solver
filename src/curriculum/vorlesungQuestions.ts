/**
 * vorlesungQuestions.ts — Converted lecture exam questions (Fragenkatalog)
 *
 * All 226 catalog questions converted to quiz format, split where multi-part,
 * tagged with 'vorlesung' for QuizMode filtering.
 */

import type { QuizQuestion } from './quizData';

/** Vorlesung questions grouped by lesson ID for merging into quizBank */
export const vorlesungExtras: Record<string, QuizQuestion[]> = {

  /* ════════════════════════════════════════════════════════════════
     UNIT 02 — Beispielsimulation  →  basics-what-is-cfd
     ════════════════════════════════════════════════════════════════ */
  'basics-what-is-cfd': [
    // u02-q001 — Wesentliche Schritte einer CFD-Simulation
    { id: 'vl-02-01', type: 'multi-select', tag: 'vorlesung',
      question: 'Welche der folgenden sind wesentliche Schritte einer CFD-Simulation?',
      options: [
        'Problemdefinition & Strömungsregime festlegen',
        'Rechengitter erzeugen',
        'Diskretisierung & Solver wählen',
        'Auswertung & Verifikation/Validierung',
        'Versuchsaufbau im Labor konstruieren',
        'Analytische Lösung der Navier-Stokes-Gleichungen finden',
      ],
      correctIndices: [0, 1, 2, 3],
      explanation: 'Die wesentlichen Schritte sind: Problemdefinition, Geometrie, Physik-Modell, BC/IC, Gitter, Diskretisierung, Solver, Numerik-Parameter, Rechnung/Monitoring, Postprocessing & V&V. Laborversuche und analytische Lösungen sind keine CFD-Schritte.' },

    { id: 'vl-02-02', type: 'single-choice', tag: 'vorlesung',
      question: 'Warum ist eine Gitterstudie (Gitterverfeinerung) bei der CFD-Auswertung wichtig?',
      options: [
        'Um den numerischen Fehler vom Modellfehler zu trennen',
        'Um die Rechenzeit zu minimieren',
        'Um die Turbulenz aufzulösen',
        'Um die Randbedingungen zu überprüfen',
      ],
      correctIndex: 0,
      explanation: 'Gitterstudie quantifiziert den Diskretisierungsfehler (Verifikation). Nur wenn der numerische Fehler bekannt ist, kann man Abweichungen der Physik zuordnen (Validierung).' },

    { id: 'vl-02-03', type: 'true-false', tag: 'vorlesung',
      question: 'Wahr oder falsch?',
      statement: 'Konvergenz der Residuen allein reicht aus, um die Korrektheit einer CFD-Simulation zu bestätigen.',
      correct: false,
      explanation: 'Falsch — kleine Residuen bedeuten nicht automatisch physikalisch korrekte Lösung. Zusätzlich müssen Massen-/Energiebilanzen, Monitorgrößen und Gitterstudie geprüft werden.' },

    // u02-q002 — Aufgaben in jedem Schritt
    { id: 'vl-02-04', type: 'single-choice', tag: 'vorlesung',
      question: 'Was gehört zur Problemdefinition einer CFD-Simulation?',
      options: [
        'Zielgrößen festlegen, Strömungsregime abschätzen ($Re$, $Ma$), Modellannahmen treffen',
        'Primärzellen im Gitter nummerieren',
        'Den SIMPLE-Algorithmus konfigurieren',
        'Residual-Skalierung festlegen',
      ],
      correctIndex: 0,
      explanation: 'Problemdefinition umfasst: Zielgrößen (z.B. $\\Delta p$, Kräfte), Randdaten sammeln, Regime abschätzen ($Re$, $Ma$) und Modellannahmen (stationär/instationär, kompressibel/inkompressibel, laminar/turbulent).' },

    { id: 'vl-02-05', type: 'true-false', tag: 'vorlesung',
      question: 'Wahr oder falsch?',
      statement: 'Man darf Massenstrom und Druckdifferenz gleichzeitig am gleichen Rand vorgeben.',
      correct: false,
      explanation: 'Falsch — überspezifizierte Randbedingungen ($\\dot{m}$ und $\\Delta p$ am selben Rand) führen zu schlechter Konvergenz oder unphysikalischer Lösung.' },
  ],

  /* ════════════════════════════════════════════════════════════════
     UNIT 03 — 1D Erhaltungsgleichung  →  basics-pdes
     ════════════════════════════════════════════════════════════════ */
  'basics-pdes': [
    // u03-q001 split: Massenerhaltung
    { id: 'vl-03-01a', type: 'formula-select', tag: 'vorlesung',
      question: 'Wie lautet die 1D-Massenerhaltung (Kontinuitätsgleichung)?',
      options: [
        '$\\frac{\\partial \\rho}{\\partial t} + \\frac{\\partial (\\rho u)}{\\partial x} = 0$',
        '$\\frac{\\partial u}{\\partial t} + u \\frac{\\partial u}{\\partial x} = 0$',
        '$\\frac{\\partial \\rho}{\\partial t} = \\frac{\\partial^2 \\rho}{\\partial x^2}$',
        '$\\rho \\frac{\\partial u}{\\partial t} = -\\frac{\\partial p}{\\partial x}$',
      ],
      correctIndex: 0,
      explanation: 'Massenerhaltung 1D: $\\frac{\\partial \\rho}{\\partial t} + \\frac{\\partial (\\rho u)}{\\partial x} = 0$. Für inkompressibel ($\\rho = \\text{const}$) folgt $\\frac{\\partial u}{\\partial x} = 0$.' },

    // u03-q001 split: Impulserhaltung
    { id: 'vl-03-01b', type: 'formula-select', tag: 'vorlesung',
      question: 'Wie lautet die 1D-Impulserhaltung in konservativer Form?',
      options: [
        '$\\frac{\\partial (\\rho u)}{\\partial t} + \\frac{\\partial (\\rho u^2)}{\\partial x} = -\\frac{\\partial p}{\\partial x} + \\frac{\\partial \\tau_{xx}}{\\partial x} + \\rho f_x$',
        '$\\frac{\\partial u}{\\partial t} + \\frac{\\partial u^2}{\\partial x} = -\\frac{1}{\\rho}\\frac{\\partial p}{\\partial x}$',
        '$\\frac{\\partial (\\rho u)}{\\partial t} = \\mu \\frac{\\partial^2 u}{\\partial x^2}$',
        '$\\rho u \\frac{\\partial u}{\\partial x} = -\\frac{\\partial p}{\\partial x}$',
      ],
      correctIndex: 0,
      explanation: '1D-Impulserhaltung (konservativ): $\\frac{\\partial (\\rho u)}{\\partial t} + \\frac{\\partial (\\rho u^2)}{\\partial x} = -\\frac{\\partial p}{\\partial x} + \\frac{\\partial \\tau_{xx}}{\\partial x} + \\rho f_x$.' },

    // u03-q001 split: Temperaturgleichung
    { id: 'vl-03-01c', type: 'formula-select', tag: 'vorlesung',
      question: 'Wie lautet die 1D-Temperaturgleichung als Skalartransport?',
      options: [
        '$\\frac{\\partial T}{\\partial t} + u \\frac{\\partial T}{\\partial x} = \\alpha \\frac{\\partial^2 T}{\\partial x^2} + S_T$',
        '$\\frac{\\partial T}{\\partial t} = -u \\frac{\\partial T}{\\partial x}$',
        '$\\frac{\\partial (\\rho T)}{\\partial t} = \\frac{\\partial p}{\\partial x}$',
        '$T = \\alpha \\frac{\\partial^2 T}{\\partial x^2}$',
      ],
      correctIndex: 0,
      explanation: '1D-Temperaturgleichung: $\\frac{\\partial T}{\\partial t} + u \\frac{\\partial T}{\\partial x} = \\alpha \\frac{\\partial^2 T}{\\partial x^2} + S_T$ mit $\\alpha = k/(\\rho c_p)$.' },

    // u03-q001: Generische Transportgleichung
    { id: 'vl-03-01d', type: 'formula-select', tag: 'vorlesung',
      question: 'Wie lautet die generische 1D-Transportgleichung in konservativer Form?',
      options: [
        '$\\frac{\\partial (\\rho \\phi)}{\\partial t} + \\frac{\\partial (\\rho u \\phi)}{\\partial x} = \\frac{\\partial}{\\partial x}\\left(\\Gamma \\frac{\\partial \\phi}{\\partial x}\\right) + S_\\phi$',
        '$\\frac{\\partial \\phi}{\\partial t} = \\frac{\\partial^2 \\phi}{\\partial x^2}$',
        '$\\rho \\frac{\\partial \\phi}{\\partial t} + \\rho u \\phi = \\Gamma + S_\\phi$',
        '$\\frac{\\partial \\phi}{\\partial x} = \\frac{S_\\phi}{\\rho u}$',
      ],
      correctIndex: 0,
      explanation: 'Generische Transportgleichung: $\\frac{\\partial (\\rho \\phi)}{\\partial t} + \\frac{\\partial (\\rho u \\phi)}{\\partial x} = \\frac{\\partial}{\\partial x}(\\Gamma \\frac{\\partial \\phi}{\\partial x}) + S_\\phi$. Masse: $\\phi=1$, Impuls: $\\phi=u$, Temperatur: $\\phi=T$.' },

    // u03-q002 — Kontinuum vs Diskret
    { id: 'vl-03-02', type: 'single-choice', tag: 'vorlesung',
      question: 'Was ist der Unterschied zwischen einer Kontinuums- und einer diskreten Betrachtung?',
      options: [
        'Kontinuum: $\\phi(x,t)$ überall definiert, Ableitungen existieren. Diskret: nur endlich viele Stützstellen, Ableitungen durch Approximationen ersetzt.',
        'Kontinuum: nur ganzzahlige Werte. Diskret: beliebige reelle Werte.',
        'Kein Unterschied — beide Beschreibungen sind äquivalent.',
        'Diskret: unendlich viele Punkte. Kontinuum: endlich viele Punkte.',
      ],
      correctIndex: 0,
      explanation: 'Kontinuum: $\\phi(x,t)$ stetig, PDE-Beschreibung. Diskret: $\\phi_i \\approx \\phi(x_i)$ an endlich vielen Punkten, Ableitungen als Differenzenapproximationen → algebraisches Gleichungssystem.' },

    // u03-q009 — Modellfehler vs. numerischer Fehler
    { id: 'vl-03-09', type: 'multi-select', tag: 'vorlesung',
      question: 'Warum ist die Trennung von Modell- und numerischem Fehler in CFD wichtig?',
      options: [
        'Verifikation setzt voraus, dass der numerische Fehler quantifiziert ist',
        'Turbulenzmodelle dürfen nicht gegen numerische Fehler kalibriert werden',
        'Man erkennt, ob Verbesserung durch feinere Gitter oder bessere Physik erreicht wird',
        'Numerische Fehler sind immer größer als Modellfehler',
      ],
      correctIndices: [0, 1, 2],
      explanation: 'Trennung ist essentiell für V&V: Verifikation (Numerik korrekt?) vor Validierung (Physik korrekt?). Numerische Fehler sind nicht immer größer.' },

    // u03-q010 — Erhaltene Größen
    { id: 'vl-03-10', type: 'multi-select', tag: 'vorlesung',
      question: 'Welche Größen müssen an jedem Punkt im Rechengebiet erhalten sein?',
      options: [
        'Masse',
        'Impuls',
        'Energie',
        'Druck',
        'Geschwindigkeit',
      ],
      correctIndices: [0, 1, 2],
      explanation: 'Erhaltungsgrößen: Masse, Impuls (je Komponente) und Energie. Druck und Geschwindigkeit sind keine Erhaltungsgrößen.' },

    // u03-q012 — Isotherme Strömung
    { id: 'vl-03-12a', type: 'single-choice', tag: 'vorlesung',
      question: 'Welche Erhaltungsgleichungen bilden die Basis isothermer Strömungen?',
      options: [
        'Massenerhaltung und Impulserhaltung (bei kompressibel zusätzlich EOS)',
        'Nur Energieerhaltung',
        'Masse, Impuls und Energieerhaltung',
        'Nur Massenerhaltung',
      ],
      correctIndex: 0,
      explanation: 'Isotherm: $T = \\text{const}$ → Energiegleichung nicht nötig. Basis: $\\nabla \\cdot \\mathbf{u} = 0$ (inkompressibel) oder $\\partial \\rho / \\partial t + \\nabla \\cdot (\\rho \\mathbf{u}) = 0$ + Impuls + EOS (kompressibel).' },

    { id: 'vl-03-12b', type: 'true-false', tag: 'vorlesung',
      question: 'Wahr oder falsch?',
      statement: 'Inkompressibel bedeutet, dass der Druck konstant ist.',
      correct: false,
      explanation: 'Falsch — inkompressibel bedeutet $\\rho \\approx \\text{const}$ (bzw. $\\nabla \\cdot \\mathbf{u} = 0$). Der Druck variiert sehr wohl.' },
  ],

  /* ════════════════════════════════════════════════════════════════
     UNIT 03 continued  →  basics-discretization-idea
     ════════════════════════════════════════════════════════════════ */
  'basics-discretization-idea': [
    // u03-q005 — Diskretisierung der Temperaturgleichung
    { id: 'vl-03-05a', type: 'single-choice', tag: 'vorlesung',
      question: 'Was entsteht nach der Diskretisierung der 1D-Temperaturgleichung mit implizitem Euler und CDS?',
      options: [
        'Ein tridiagonales lineares Gleichungssystem $a_W T_{i-1} + a_P T_i + a_E T_{i+1} = b_i$',
        'Eine analytische Lösung $T(x)$',
        'Ein vollbesetztes Gleichungssystem',
        'Eine gewöhnliche Differentialgleichung',
      ],
      correctIndex: 0,
      explanation: 'Implizit Euler + CDS in 1D erzeugt ein tridiagonales System: $a_W T_{i-1}^{n+1} + a_P T_i^{n+1} + a_E T_{i+1}^{n+1} = b_i$ (lösbar mit TDMA).' },

    // u03-q006 — Wie wird integriert?
    { id: 'vl-03-06', type: 'single-choice', tag: 'vorlesung',
      question: 'Was passiert nach der Raumdiskretisierung einer PDE?',
      options: [
        'Es entsteht ein ODE-System in der Zeit, das mit Zeitintegrationsverfahren gelöst wird',
        'Die Lösung ist direkt bekannt',
        'Man erhält ein stationäres Resultat',
        'Nur Randwerte müssen berechnet werden',
      ],
      correctIndex: 0,
      explanation: 'Semi-Diskretisierung: $M \\frac{d\\phi}{dt} = R(\\phi)$. Integration mit explizitem/implizitem Euler, Crank-Nicolson, Runge-Kutta etc.' },

    // u03-q007 — Genauigkeitsordnung
    { id: 'vl-03-07', type: 'single-choice', tag: 'vorlesung',
      question: 'Was bestimmt die Genauigkeitsordnung $p$ einer Finite-Differenzen-Approximation?',
      options: [
        'Der kleinste Exponent $p$ des ersten nicht-verschwindenden Terms im Trunkationsfehler',
        'Die Anzahl der Gitterpunkte',
        'Die Größe des Koeffizienten $C_p$',
        'Die Rechenzeit pro Iteration',
      ],
      correctIndex: 0,
      explanation: 'Trunkationsfehler $TE = C_p (\\Delta x)^p + O(\\Delta x^{p+1})$. Die Ordnung $p$ wird durch den Exponenten des führenden Terms bestimmt.' },

    // u03-q008 — Bestimmung der Ordnung
    { id: 'vl-03-08', type: 'multi-select', tag: 'vorlesung',
      question: 'Wie kann die Genauigkeitsordnung der Lösung bestimmt werden?',
      options: [
        'Gitterverfeinerungsstudie (log-log-Plot Fehler vs. $\\Delta x$)',
        'Richardson-Extrapolation',
        'Method of Manufactured Solutions (MMS)',
        'Nur visueller Vergleich zweier Plots',
      ],
      correctIndices: [0, 1, 2],
      explanation: 'Gitterstudie, Richardson-Extrapolation und MMS sind etablierte Methoden zur Ordnungsbestimmung. Visueller Vergleich allein ist nicht quantitativ.' },

    // u03-q011 — Kleinste Dimension
    { id: 'vl-03-11', type: 'single-choice', tag: 'vorlesung',
      question: 'Was ist die kleinste räumliche Dimension, die eine CFD-Simulation haben muss?',
      options: [
        '1D — mindestens eine Raumkoordinate für Gradienten/Flüsse',
        '0D — lumped Modelle reichen',
        '2D — immer mindestens zwei Dimensionen',
        '3D — Strömungen sind immer dreidimensional',
      ],
      correctIndex: 0,
      explanation: 'CFD benötigt mindestens 1D (Gradienten). 0D-Modelle (lumped) haben keine räumliche Auflösung. 3D-Physik kann durch Symmetrie auf 2D/1D reduziert werden.' },
  ],

  /* ════════════════════════════════════════════════════════════════
     UNIT 03 — Taylor  →  fdm-taylor
     ════════════════════════════════════════════════════════════════ */
  'fdm-taylor': [
    // u03-q003 — Erste Ableitung via Taylor
    { id: 'vl-03-03a', type: 'formula-select', tag: 'vorlesung',
      question: 'Wie lautet die Vorwärtsdifferenz (FDS) für die erste Ableitung?',
      options: [
        "$f'_i \\approx \\frac{f_{i+1} - f_i}{\\Delta x}$, Ordnung $O(\\Delta x)$",
        "$f'_i \\approx \\frac{f_{i+1} - f_{i-1}}{2\\Delta x}$, Ordnung $O(\\Delta x^2)$",
        "$f'_i \\approx \\frac{f_i - f_{i-1}}{\\Delta x}$, Ordnung $O(\\Delta x)$",
        "$f'_i \\approx \\frac{f_{i+1} - 2f_i + f_{i-1}}{\\Delta x^2}$",
      ],
      correctIndex: 0,
      explanation: 'FDS: $f\'_i \\approx (f_{i+1} - f_i) / \\Delta x + O(\\Delta x)$ — 1. Ordnung, aus Taylor $f(x_i + \\Delta x) = f_i + \\Delta x f\'_i + O(\\Delta x^2)$.' },

    { id: 'vl-03-03b', type: 'formula-select', tag: 'vorlesung',
      question: 'Wie lautet die zentrale Differenz (CDS) für die erste Ableitung?',
      options: [
        "$f'_i \\approx \\frac{f_{i+1} - f_{i-1}}{2\\Delta x}$, Ordnung $O(\\Delta x^2)$",
        "$f'_i \\approx \\frac{f_{i+1} - f_i}{\\Delta x}$, Ordnung $O(\\Delta x)$",
        "$f'_i \\approx \\frac{f_{i+1} + f_{i-1}}{2\\Delta x}$",
        "$f'_i \\approx \\frac{f_{i+1} - f_{i-1}}{\\Delta x}$",
      ],
      correctIndex: 0,
      explanation: 'CDS: $(f_{i+1} - f_{i-1})/(2\\Delta x) + O(\\Delta x^2)$ — 2. Ordnung. Die Symmetrie eliminiert den $\\Delta x$-Term.' },

    // u03-q004 — Zweite Ableitung
    { id: 'vl-03-04', type: 'formula-select', tag: 'vorlesung',
      question: 'Wie lautet die zentrale Differenz für die zweite Ableitung?',
      options: [
        "$f''_i \\approx \\frac{f_{i+1} - 2f_i + f_{i-1}}{\\Delta x^2}$, Ordnung $O(\\Delta x^2)$",
        "$f''_i \\approx \\frac{f_{i+1} - f_{i-1}}{2\\Delta x^2}$",
        "$f''_i \\approx \\frac{f_{i+1} + f_{i-1}}{\\Delta x^2}$",
        "$f''_i \\approx \\frac{f_{i+1} - f_i}{\\Delta x^2}$",
      ],
      correctIndex: 0,
      explanation: 'Zweite Ableitung: $(f_{i+1} - 2f_i + f_{i-1})/\\Delta x^2 + O(\\Delta x^2)$. Herleitung durch Addition der Taylor-Entwicklungen nach vorne und hinten.' },

    { id: 'vl-03-04b', type: 'true-false', tag: 'vorlesung',
      question: 'Wahr oder falsch?',
      statement: 'FDS und BDS für die erste Ableitung sind beide 1. Ordnung, während CDS 2. Ordnung ist.',
      correct: true,
      explanation: 'Korrekt. FDS/BDS: $O(\\Delta x)$ (unsymmetrisch). CDS: $O(\\Delta x^2)$ (symmetrisch eliminiert geraden Fehlerterm).' },
  ],

  /* ════════════════════════════════════════════════════════════════
     UNIT 04 — Zeitdiskretisierung  →  stability-cfl
     ════════════════════════════════════════════════════════════════ */
  'stability-cfl': [
    // u04-q001 — Unterscheidungsmerkmale Zeitintegration
    { id: 'vl-04-01', type: 'multi-select', tag: 'vorlesung',
      question: 'Was sind wesentliche Unterscheidungsmerkmale von Zeitintegrationsmethoden?',
      options: [
        'Explizit vs. implizit',
        'Ordnung/Genauigkeit',
        'Stabilität (A-stabil, CFL-Limit)',
        'Single-step vs. multi-step',
        'Ob die Lösung analytisch ist',
      ],
      correctIndices: [0, 1, 2, 3],
      explanation: 'Hauptmerkmale: explizit/implizit, Ordnung, Stabilitätsbereich, Ein-/Mehrschrittverfahren. Analytische Lösung ist keine Eigenschaft der Zeitintegration.' },

    // u04-q002 — Expliziter/Impliziter Euler
    { id: 'vl-04-02a', type: 'formula-select', tag: 'vorlesung',
      question: 'Wie lautet das explizite Euler-Verfahren für $d\\phi/dt = f(\\phi, t)$?',
      options: [
        '$\\phi^{n+1} = \\phi^n + \\Delta t \\cdot f(\\phi^n, t^n)$',
        '$\\phi^{n+1} = \\phi^n + \\Delta t \\cdot f(\\phi^{n+1}, t^{n+1})$',
        '$\\phi^{n+1} = \\phi^n + \\frac{\\Delta t}{2}[f(\\phi^n) + f(\\phi^{n+1})]$',
        '$\\phi^{n+1} = \\phi^{n-1} + 2\\Delta t \\cdot f(\\phi^n, t^n)$',
      ],
      correctIndex: 0,
      explanation: 'Expliziter Euler: $\\phi^{n+1} = \\phi^n + \\Delta t \\cdot f(\\phi^n, t^n)$ — Auswertung am alten Zeitschritt, 1. Ordnung.' },

    { id: 'vl-04-02b', type: 'formula-select', tag: 'vorlesung',
      question: 'Wie lautet das implizite Euler-Verfahren?',
      options: [
        '$\\phi^{n+1} = \\phi^n + \\Delta t \\cdot f(\\phi^{n+1}, t^{n+1})$',
        '$\\phi^{n+1} = \\phi^n + \\Delta t \\cdot f(\\phi^n, t^n)$',
        '$\\phi^{n+1} = \\frac{\\Delta t}{2} f(\\phi^n)$',
        '$\\phi^{n+1} = \\phi^{n-1} + \\Delta t \\cdot f(\\phi^n)$',
      ],
      correctIndex: 0,
      explanation: 'Impliziter Euler: $\\phi^{n+1} = \\phi^n + \\Delta t \\cdot f(\\phi^{n+1}, t^{n+1})$ — muss nach $\\phi^{n+1}$ aufgelöst werden. Auch 1. Ordnung, aber A-stabil.' },

    // u04-q004 — Crank-Nicolson
    { id: 'vl-04-04', type: 'single-choice', tag: 'vorlesung',
      question: 'Was beschreibt das Crank-Nicolson-Verfahren?',
      options: [
        'Trapezregel: $\\phi^{n+1} = \\phi^n + \\frac{\\Delta t}{2}[f(\\phi^n) + f(\\phi^{n+1})]$, 2. Ordnung, implizit',
        'Explizites Euler-Verfahren mit halber Schrittweite',
        'Runge-Kutta 4. Ordnung',
        'BDF2-Verfahren',
      ],
      correctIndex: 0,
      explanation: 'Crank-Nicolson = Trapezregel, 2. Ordnung in der Zeit, implizit, A-stabil. Kann bei steifen Problemen/Schocks trotzdem Oszillationen zeigen.' },

    // u04-q005 — Euler auf ODE anwenden
    { id: 'vl-04-05', type: 'single-choice', tag: 'vorlesung',
      question: 'Für die ODE $d\\phi/dt = \\lambda\\phi$ ($\\lambda < 0$): Wann ist der explizite Euler stabil?',
      options: [
        '$\\Delta t \\leq 2/|\\lambda|$, d.h. $|1 + \\lambda\\Delta t| \\leq 1$',
        'Für alle $\\Delta t$ (unbedingt stabil)',
        '$\\Delta t \\leq 1/|\\lambda|^2$',
        'Explizit ist nie stabil',
      ],
      correctIndex: 0,
      explanation: 'Explizit Euler: $\\phi^{n+1} = (1 + \\lambda\\Delta t)\\phi^n$. Für $\\lambda < 0$ stabil wenn $|1 + \\lambda\\Delta t| \\leq 1 \\Rightarrow \\Delta t \\leq 2/|\\lambda|$.' },

    // u04-q006 — Unterschied explizit/implizit
    { id: 'vl-04-06', type: 'single-choice', tag: 'vorlesung',
      question: 'Was ist der wesentliche Unterschied zwischen expliziten und impliziten Verfahren?',
      options: [
        'Explizit: $\\phi^{n+1}$ direkt berechenbar; Implizit: Gleichungssystem pro Zeitschritt nötig',
        'Explizit: höhere Ordnung; Implizit: niedrigere Ordnung',
        'Explizit: immer instabil; Implizit: immer stabil',
        'Kein Unterschied — beide sind gleich teuer',
      ],
      correctIndex: 0,
      explanation: 'Explizit: direktes Update, CFL-limitiert. Implizit: Gleichungssystem lösen, größerer Stabilitätsbereich, aber teurer pro Schritt. Ordnung ist unabhängig von explizit/implizit.' },

    // u04-q009 — Große zeitliche Änderungen
    { id: 'vl-04-09', type: 'true-false', tag: 'vorlesung',
      question: 'Wahr oder falsch?',
      statement: 'Bei stark variierenden Lösungen muss $\\Delta t$ bei expliziten Verfahren sehr klein gewählt werden — sowohl aus Stabilitäts- als auch Genauigkeitsgründen.',
      correct: true,
      explanation: 'Korrekt — schnelle Transienten erfordern kleines $\\Delta t$ für Stabilität (CFL) und Genauigkeit (Tangentenapproximation wird sonst zu grob).' },

    // u05-q020 — CFL-Zahl
    { id: 'vl-05-20a', type: 'formula-select', tag: 'vorlesung',
      question: 'Wie ist die CFL-Zahl (Courant-Friedrichs-Lewy) in 1D definiert?',
      options: [
        '$CFL = \\frac{|u| \\Delta t}{\\Delta x}$',
        '$CFL = \\frac{u \\Delta x}{\\alpha}$',
        '$CFL = \\frac{\\Delta x}{|u| \\Delta t}$',
        '$CFL = \\frac{\\rho u \\Delta x}{\\mu}$',
      ],
      correctIndex: 0,
      explanation: '$CFL = |u|\\Delta t / \\Delta x$ — Verhältnis der zurückgelegten Strecke pro Zeitschritt zur Zellgröße. Für explizite Verfahren typisch $CFL \\leq 1$.' },

    { id: 'vl-05-20b', type: 'true-false', tag: 'vorlesung',
      question: 'Wahr oder falsch?',
      statement: 'Bei impliziten Verfahren spielt die CFL-Zahl keine Rolle mehr.',
      correct: false,
      explanation: 'Falsch — implizite Verfahren sind stabilitätsmäßig weniger CFL-limitiert, aber CFL beeinflusst weiterhin die Genauigkeit (zeitliche Auflösung).' },
  ],

  /* ════════════════════════════════════════════════════════════════
     UNIT 04  →  stability-peclet
     ════════════════════════════════════════════════════════════════ */
  'stability-peclet': [
    // u04-q008 — Péclet-Zahl
    { id: 'vl-04-08a', type: 'formula-select', tag: 'vorlesung',
      question: 'Wie ist die diskrete Zell-Péclet-Zahl $Pe_D$ definiert?',
      options: [
        '$Pe_D = \\frac{u \\Delta x}{\\alpha}$ bzw. $\\frac{\\rho u \\Delta x}{\\Gamma}$',
        '$Pe_D = \\frac{|u| \\Delta t}{\\Delta x}$',
        '$Pe_D = \\frac{\\rho u L}{\\mu}$',
        '$Pe_D = \\frac{\\Delta x}{u \\Delta t}$',
      ],
      correctIndex: 0,
      explanation: 'Zell-Péclet: $Pe_D = u\\Delta x / \\alpha = \\rho u \\Delta x / \\Gamma$ — lokales Konvektion/Diffusion-Verhältnis auf Zellebene.' },

    { id: 'vl-04-08b', type: 'single-choice', tag: 'vorlesung',
      question: 'Warum führt $|Pe_D| > 2$ bei CDS zu Instabilitäten?',
      options: [
        'Es entstehen negative Koeffizienten, die Monotonie/Positivität verletzen → unphysikalische Oszillationen',
        'Der Zeitschritt wird zu groß',
        'Die Diffusion überwiegt und dämpft die Lösung',
        'Die CFL-Bedingung wird verletzt',
      ],
      correctIndex: 0,
      explanation: 'Bei $|Pe_D| > 2$ wird der Koeffizient $D - F/2$ negativ → Verlust der Diagonaldominanz → Oszillationen. Abhilfe: Upwind/TVD oder Gitter verfeinern.' },
  ],

  /* ════════════════════════════════════════════════════════════════
     UNIT 04  →  stability-vonneumann
     ════════════════════════════════════════════════════════════════ */
  'stability-vonneumann': [
    // u04-q011 — Runge-Kutta
    { id: 'vl-04-11', type: 'multi-select', tag: 'vorlesung',
      question: 'Was sind Eigenschaften von Runge-Kutta-Verfahren?',
      options: [
        'Mehrstufen-Einschrittverfahren (mehrere Stufen $k_i$ pro Zeitschritt)',
        'Kein Speicher über viele alte Zeitebenen nötig',
        'Höhere Ordnung möglich (RK2, RK4)',
        'Explizite RK sind CFL-frei',
      ],
      correctIndices: [0, 1, 2],
      explanation: 'RK: Mehrstufen-Einschritt, kompakt (kein Multi-Step-Speicher), flexible Ordnung. Explizite RK bleiben CFL-limitiert!' },

    // u04-q012 — Zeitliche Konvergenz
    { id: 'vl-04-12', type: 'single-choice', tag: 'vorlesung',
      question: 'Ein Zeitintegrationsverfahren der Ordnung $p$ — wie skaliert der Fehler bei Halbierung von $\\Delta t$?',
      options: [
        'Fehler sinkt um Faktor $2^p$',
        'Fehler sinkt um Faktor $2$',
        'Fehler bleibt gleich',
        'Fehler wird $p$-mal kleiner',
      ],
      correctIndex: 0,
      explanation: 'Globaler Fehler $E(\\Delta t) \\approx C \\cdot (\\Delta t)^p$. Bei $\\Delta t / 2$: $E_{\\text{neu}} = E_{\\text{alt}} / 2^p$. Z.B. bei $p=2$: Faktor 4.' },

    // u04-q010 — Pseudo-Code impliziter Euler
    { id: 'vl-04-10', type: 'single-choice', tag: 'vorlesung',
      question: 'Was ist ein wesentlicher Schritt im impliziten Euler bei nichtlinearem $f$?',
      options: [
        'Innere Iteration (Newton/Picard) bis $\\|R(\\phi^{n+1})\\|$ klein genug',
        'Nur einmal auswerten, keine Iteration nötig',
        'Explizites Update mit korrigiertem $\\Delta t$',
        'Adaptiver Gitterwechsel',
      ],
      correctIndex: 0,
      explanation: 'Impliziter Euler bei nichtlinearem $f$: Residuum $R(\\phi^{n+1}) = \\phi^{n+1} - \\phi^n - \\Delta t f(\\phi^{n+1}) = 0$ muss iterativ gelöst werden.' },

    // u04-q013 — Diskretisierungssterne
    { id: 'vl-04-13', type: 'single-choice', tag: 'vorlesung',
      question: 'Was passiert mit dem zeitlichen Diskretisierungsstern bei höherer Ordnung?',
      options: [
        'Er wird breiter (mehr Zeitebenen bei Multi-Step; mehr Stufen bei RK)',
        'Er wird schmaler',
        'Er bleibt gleich',
        'In der Zeit gibt es keine Stencils',
      ],
      correctIndex: 0,
      explanation: 'Höhere Ordnung → mehr Zeitebenen (BDF2: $\\{n-1,n,n+1\\}$) oder mehr Stufen (RK4: 4 Auswertungen). Startup-Probleme bei Multi-Step beachten.' },
  ],

  /* ════════════════════════════════════════════════════════════════
     UNIT 05 — Raumdiskretisierung  →  schemes-uds
     ════════════════════════════════════════════════════════════════ */
  'schemes-uds': [
    // u05-q015 — Diskretisierungsschemata Konvektion
    { id: 'vl-05-15a', type: 'single-choice', tag: 'vorlesung',
      question: 'Was ist der Hauptnachteil von 1. Ordnung Upwind (UDS)?',
      options: [
        'Starke numerische Diffusion — Profile werden verschmiert',
        'Unphysikalische Oszillationen',
        'Sehr großer Stencil',
        'Nicht auf unstrukturierten Gittern anwendbar',
      ],
      correctIndex: 0,
      explanation: 'UDS ist robust und monoton, erzeugt aber starke numerische Diffusion ($\\sim O(\\Delta x)$), die Gradienten verschmiert (Top-Hat → Rampe).' },

    // u05-q022 — Numerische Diffusion
    { id: 'vl-05-22', type: 'single-choice', tag: 'vorlesung',
      question: 'Was ist numerische Diffusion?',
      options: [
        'Künstliche, nicht-physikalische Glättung durch die Diskretisierung (v.a. Upwind-Schemata)',
        'Physikalische Wärmeleitfähigkeit des Fluids',
        'Turbulente Diffusion in der Grenzschicht',
        'Ein Effekt der Zeitdiskretisierung',
      ],
      correctIndex: 0,
      explanation: 'Numerische Diffusion: zusätzlicher, nicht-physikalischer Diffusionsterm durch Diskretisierung. Wirkt wie $\\mu_{\\text{num}} \\nabla^2 \\phi$, verschmiert Fronten.' },

    // u05-q023 — Reduktion numerischer Diffusion
    { id: 'vl-05-23', type: 'multi-select', tag: 'vorlesung',
      question: 'Wie kann numerische Diffusion verringert werden?',
      options: [
        'Höherwertige Konvektionsschemata (TVD, MUSCL, WENO)',
        'Gitterverfeinerung ($\\Delta x$ reduzieren)',
        'Gitter an Strömungsrichtung ausrichten',
        'Upwind-Ordnung auf 0 setzen',
      ],
      correctIndices: [0, 1, 2],
      explanation: 'Numerische Diffusion skaliert mit $\\Delta x$ und Schemaordnung. Feinere Gitter, höhere Ordnung und gitterausrichtung helfen. 0. Ordnung existiert nicht.' },
  ],

  /* ════════════════════════════════════════════════════════════════
     UNIT 05  →  schemes-cds
     ════════════════════════════════════════════════════════════════ */
  'schemes-cds': [
    // u05-q004 — CDS/FDS/BDS
    { id: 'vl-05-04', type: 'multi-select', tag: 'vorlesung',
      question: 'Welche Aussagen über CDS (zentrale Differenzen) für Konvektion sind korrekt?',
      options: [
        '2. Ordnung genau',
        'Kann unbounded sein bei $|Pe_D| > 2$',
        'Geringe numerische Diffusion',
        'Immer monoton und stabil',
      ],
      correctIndices: [0, 1, 2],
      explanation: 'CDS: 2. Ordnung, wenig numerische Diffusion, aber bei konvektionsdominanten Fällen ($|Pe_D| > 2$) unbounded → Oszillationen. Nicht immer monoton!' },

    // u05-q016 — Einschränkungen bei scharfen Gradienten
    { id: 'vl-05-16', type: 'single-choice', tag: 'vorlesung',
      question: 'Was passiert mit CDS/QUICK (ohne Limiter) bei scharfen Gradienten?',
      options: [
        'Über-/Unterschwinger (Gibbs-artige Oszillationen), unbounded Werte möglich',
        'Perfekte Auflösung der Gradienten',
        'Starke Verschmierung des Profils',
        'Numerisches Steady-State wird sofort erreicht',
      ],
      correctIndex: 0,
      explanation: 'Höhere Ordnung ohne Limiter erzeugt Overshoots/Undershoots an starken Gradienten (negative Konzentrationen, T-Spikes). TVD-Limiter sind notwendig.' },
  ],

  /* ════════════════════════════════════════════════════════════════
     UNIT 05  →  schemes-tvd
     ════════════════════════════════════════════════════════════════ */
  'schemes-tvd': [
    // u05-q017 — TVD Grundidee
    { id: 'vl-05-17a', type: 'single-choice', tag: 'vorlesung',
      question: 'Was ist die Grundidee von TVD-Schemata?',
      options: [
        'Nichtlineare Mischung aus Upwind (monoton) und höherer Ordnung über eine Limiterfunktion $\\psi(r)$',
        'Immer 1. Ordnung Upwind',
        'Rein zentrale Differenzen mit Glättung',
        'Spektrale Methoden im Fourier-Raum',
      ],
      correctIndex: 0,
      explanation: 'TVD = Total Variation Diminishing. $TV(\\phi)^{n+1} \\leq TV(\\phi)^n$ — keine neuen Extrema. Limiter $\\psi(r)$: 2. Ordnung in glatten Bereichen, Upwind an Fronten.' },

    { id: 'vl-05-17b', type: 'true-false', tag: 'vorlesung',
      question: 'Wahr oder falsch?',
      statement: 'TVD-Schemata sind überall 2. Ordnung genau.',
      correct: false,
      explanation: 'Falsch — TVD-Schemata sind 2. Ordnung in glatten Bereichen, fallen aber nahe starker Gradienten lokal auf 1. Ordnung zurück ($\\psi \\to 0$).' },
  ],

  /* ════════════════════════════════════════════════════════════════
     UNIT 05  →  schemes-compare
     ════════════════════════════════════════════════════════════════ */
  'schemes-compare': [
    // u05-q011/q012/q013 — Fehlerverhalten
    { id: 'vl-05-11', type: 'single-choice', tag: 'vorlesung',
      question: 'Schema 1. Ordnung: Wie ändert sich der Fehler bei Halbierung von $\\Delta x$?',
      options: [
        'Fehler halbiert sich (Faktor 2)',
        'Fehler viertelt sich (Faktor 4)',
        'Fehler bleibt gleich',
        'Fehler wird 8× kleiner',
      ],
      correctIndex: 0,
      explanation: '$p=1$: $E \\propto \\Delta x \\Rightarrow E_{\\text{neu}} / E_{\\text{alt}} = 1/2$. Faktor 2 Verbesserung.' },

    { id: 'vl-05-12', type: 'single-choice', tag: 'vorlesung',
      question: 'Schema 2. Ordnung: Wie ändert sich der Fehler bei Verdopplung der Zellanzahl (gleiches Gebiet)?',
      options: [
        'Fehler sinkt auf $1/4$ (Faktor 4)',
        'Fehler halbiert sich',
        'Fehler sinkt auf $1/8$',
        'Fehler bleibt gleich',
      ],
      correctIndex: 0,
      explanation: '$p=2$: $\\Delta x \\to \\Delta x/2 \\Rightarrow E \\propto (\\Delta x)^2 \\to E/4$. Verdopplung der Zellen ≈ Halbierung von $\\Delta x$.' },

    { id: 'vl-05-13', type: 'single-choice', tag: 'vorlesung',
      question: 'CDS (2. Ordnung), Gitterpunkte von 40 auf 60 erhöht. Wie ändert sich der Fehler?',
      options: [
        '$E_{\\text{neu}}/E_{\\text{alt}} \\approx (40/60)^2 = 4/9 \\approx 0{,}44$',
        '$E_{\\text{neu}}/E_{\\text{alt}} = 40/60 \\approx 0{,}67$',
        '$E_{\\text{neu}}/E_{\\text{alt}} = (40/60)^3 \\approx 0{,}30$',
        'Fehler verdoppelt sich',
      ],
      correctIndex: 0,
      explanation: '$p=2$, $\\Delta x \\propto 1/N$: $E \\propto N^{-2} \\Rightarrow (40/60)^2 = 4/9 \\approx 0{,}44$ — Fehler sinkt auf ca. 44%.' },

    // u05-q007 — Trunkationsfehler und Ordnung
    { id: 'vl-05-07', type: 'single-choice', tag: 'vorlesung',
      question: 'Was bestimmt die Konvergenzordnung im Trunkationsfehler $TE = C_p (\\Delta x)^p + C_{p+1} (\\Delta x)^{p+1} + \\ldots$?',
      options: [
        'Der kleinste Exponent $p$ (führender Term)',
        'Der Koeffizient $C_p$',
        'Die Summe aller Terme',
        'Der größte Exponent',
      ],
      correctIndex: 0,
      explanation: 'Die Ordnung $p$ = Exponent des führenden (dominanten) Terms. $C_p$ beeinflusst die Fehlerhöhe, nicht die Skalierung.' },
  ],

  /* ════════════════════════════════════════════════════════════════
     UNIT 05  →  fvm-face-interpolation
     ════════════════════════════════════════════════════════════════ */
  'fvm-face-interpolation': [
    // u05-q002 — Notation
    { id: 'vl-05-02', type: 'single-choice', tag: 'vorlesung',
      question: 'In der Kompassnotation einer FVM-Zelle: Was bedeuten $P$, $E$, $W$ und $e$, $w$?',
      options: [
        '$P$ = Zellzentrum, $E/W$ = rechter/linker Nachbar, $e/w$ = Zellflächen dazwischen',
        '$P$ = Randpunkt, $E/W$ = Eckpunkte, $e/w$ = Kanten',
        '$P$ = Druck, $E/W$ = Energie/Arbeit',
        '$P, E, W$ sind Flächenwerte, $e, w$ sind Zentrumswerte',
      ],
      correctIndex: 0,
      explanation: 'Kompassnotation: $P$ = aktuelles Zellzentrum, $E$(East)/$W$(West)/$N$(North)/$S$(South) = Nachbarzellzentren, $e/w/n/s$ = Zellflächen dazwischen.' },

    // u05-q003 — Diskretisierungsstern
    { id: 'vl-05-03', type: 'single-choice', tag: 'vorlesung',
      question: 'Was beeinflusst die Größe des Diskretisierungssterns (Stencil)?',
      options: [
        'Ordnung (höher → mehr Punkte), Bandbreite der Matrix, Randbehandlung',
        'Nur die Rechnerleistung',
        'Die Temperatur des Fluids',
        'Ausschließlich die Zeitschrittgröße',
      ],
      correctIndex: 0,
      explanation: 'Größerer Stencil → höhere Ordnung möglich, aber mehr Matrixeinträge, komplexere Randbehandlung und ggf. Stabilitätsprobleme.' },

    // u05-q019 — Diffusion auf Top-Hat
    { id: 'vl-05-19', type: 'single-choice', tag: 'vorlesung',
      question: 'Wie wirkt Diffusion auf ein Top-Hat-Profil?',
      options: [
        'Kanten werden abgerundet, Maximum sinkt, Profil verbreitert sich',
        'Profil wird steiler und schmaler',
        'Profil bleibt unverändert',
        'Oszillationen entstehen',
      ],
      correctIndex: 0,
      explanation: 'Diffusion ($\\alpha \\partial^2 \\phi / \\partial x^2$) glättet Gradienten: scharfe Kanten abrunden, Maximum senken, Übergangszone verbreitern. Integral bleibt erhalten.' },

    // u05-q009/q010 — 2. Ableitung CDS
    { id: 'vl-05-09', type: 'formula-select', tag: 'vorlesung',
      question: 'Wie lautet die CDS-Formel für $\\partial^2 \\phi / \\partial x^2$ auf 2D-Gitter?',
      options: [
        '$\\frac{\\phi_{i+1,j} - 2\\phi_{i,j} + \\phi_{i-1,j}}{\\Delta x^2}$',
        '$\\frac{\\phi_{i+1,j} - \\phi_{i-1,j}}{2\\Delta x}$',
        '$\\frac{\\phi_{i,j+1} - \\phi_{i,j-1}}{\\Delta y^2}$',
        '$\\frac{\\phi_{i+1,j} - \\phi_{i,j}}{\\Delta x^2}$',
      ],
      correctIndex: 0,
      explanation: 'Zweite Ableitung in $x$: $(\\phi_{i+1,j} - 2\\phi_{i,j} + \\phi_{i-1,j})/\\Delta x^2$ — nur Nachbarn in $x$-Richtung bei festem $j$.' },
  ],

  /* ════════════════════════════════════════════════════════════════
     UNIT 05 — Randbedingungen  →  fdm-1d-heat
     ════════════════════════════════════════════════════════════════ */
  'fdm-1d-heat': [
    // u05-q026 — BC-Typen in Matrix
    { id: 'vl-05-26a', type: 'single-choice', tag: 'vorlesung',
      question: 'Wie ändert sich die Koeffizientenmatrix bei Neumann-BC (adiabatisch, $\\partial T/\\partial x = 0$)?',
      options: [
        'Der Diagonal-Koeffizient $a_P$ reduziert sich (ein Nachbarterm fällt weg durch Geisterzelle)',
        'Die Matrix wird voll besetzt',
        'Die Matrix wird singulär',
        'Keine Änderung',
      ],
      correctIndex: 0,
      explanation: 'Adiabatisch ($\\partial T/\\partial x = 0$): Geisterzelle $T_0 = T_1$ → erste Zeile: $(1+Fo)T_1 - Fo \\cdot T_2 = T_1^n$ (Diagonal reduziert).' },

    { id: 'vl-05-26b', type: 'single-choice', tag: 'vorlesung',
      question: 'Was passiert bei periodischen Randbedingungen mit der Koeffizientenmatrix?',
      options: [
        'Zusätzliche Einträge in den Eck-Positionen → zyklische Matrix statt tridiagonal',
        'Matrix bleibt tridiagonal',
        'Matrix wird Diagonal',
        'Die rechte Seite verschwindet',
      ],
      correctIndex: 0,
      explanation: 'Periodisch: $T_0 = T_N$, $T_{N+1} = T_1$ → Kopplungen in erste Spalte/letzte Zeile und umgekehrt → zyklische Matrix (braucht zyklischen Löser).' },

    // u05-q024/q025 — Wand-BC
    { id: 'vl-05-24', type: 'single-choice', tag: 'vorlesung',
      question: 'Welche Randbedingungen gelten an einer Wand für viskose Strömungen?',
      options: [
        'No-Slip ($u_t = 0$) und Impermeabilität ($u_n = 0$)',
        'Slip ($u_t$ beliebig) und $u_n = 0$',
        'Nur $u_n = 0$',
        'Freie Ausströmung',
      ],
      correctIndex: 0,
      explanation: 'Viskose Wand: No-Slip (tangential $u_t = 0$) + Impermeabilität (normal $u_n = 0$).' },

    { id: 'vl-05-25', type: 'single-choice', tag: 'vorlesung',
      question: 'Welche Geschwindigkeits-BC gilt an einer Wand in reibungsfreier (inviszider) Strömung?',
      options: [
        'Slip: $u_n = 0$ (no-penetration), aber keine Schubspannung ($\\tau_w = 0$)',
        'No-Slip: $u_t = 0$',
        'Alle Geschwindigkeitskomponenten = 0',
        'Geschwindigkeit vorgegeben aus analytischer Lösung',
      ],
      correctIndex: 0,
      explanation: 'Inviszide/Euler: Slip-Wall — nur $u_n = 0$ (undurchlässig), tangential kein Haftung ($\\tau_w = 0$).' },
  ],

  /* ════════════════════════════════════════════════════════════════
     UNIT 05  →  fdm-stencils
     ════════════════════════════════════════════════════════════════ */
  'fdm-stencils': [
    // u05-q005 — Herleitungsmethoden
    { id: 'vl-05-05', type: 'multi-select', tag: 'vorlesung',
      question: 'Welche Methoden gibt es zur Herleitung von FD-Approximationen der ersten Ableitung?',
      options: [
        'Taylorreihenentwicklung',
        'Interpolationspolynom (Lagrange) + analytisches Ableiten',
        'Methode der unbestimmten Koeffizienten',
        'Nur numerisches Experimentieren',
      ],
      correctIndices: [0, 1, 2],
      explanation: 'Taylor, Polynom-Fitting/Lagrange und unbestimmte Koeffizienten sind systematische Methoden. Numerisches Experimentieren ist keine Herleitung.' },

    // u05-q014 — Interpolationspolynome
    { id: 'vl-05-14', type: 'single-choice', tag: 'vorlesung',
      question: 'Wie werden mit Interpolationspolynomen FD-Approximationen hergeleitet?',
      options: [
        'Polynom durch Stützstellen legen und analytisch ableiten: $\\phi\'(x^*) \\approx p_m\'(x^*)$',
        'Polynom nur für Visualisierung, nicht für Ableitungen',
        'Das Polynom ersetzt die PDE direkt',
        'Nur für periodische Lösungen anwendbar',
      ],
      correctIndex: 0,
      explanation: 'Lagrange-Polynom $p_m(x)$ durch $m+1$ Stützstellen interpolieren, dann $\\phi\' \\approx p_m\'$, $\\phi\'\' \\approx p_m\'\'$. Liefert die Standard-FD-Koeffizienten.' },

    // u05-q021 — Analytische Lösung in CFD
    { id: 'vl-05-21', type: 'single-choice', tag: 'vorlesung',
      question: 'Warum braucht eine CFD-Simulation analytische Lösungen?',
      options: [
        'Zur Verifikation: Code-/Solver-Checks, Ordnungstests, Fehlerabschätzung',
        'Zum Ersetzen der numerischen Lösung',
        'Analytische Lösungen sind nicht nützlich für CFD',
        'Nur zur Visualisierung',
      ],
      correctIndex: 0,
      explanation: 'Analytische Referenzlösungen (Poiseuille, Couette, 1D-Wärmeleitung) ermöglichen Verifikation: Ist der Code korrekt? Stimmt die Ordnung? Trennung numerisch vs. Modellfehler.' },
  ],

  /* ════════════════════════════════════════════════════════════════
     UNIT 06 — Erhaltungsgleichungen 2D/3D  →  incomp-ns
     ════════════════════════════════════════════════════════════════ */
  'incomp-ns': [
    // u06-q001 split: 3D Massenerhaltung
    { id: 'vl-06-01', type: 'formula-select', tag: 'vorlesung',
      question: 'Wie lautet die Kontinuitätsgleichung in 3D?',
      options: [
        '$\\frac{\\partial \\rho}{\\partial t} + \\frac{\\partial (\\rho u)}{\\partial x} + \\frac{\\partial (\\rho v)}{\\partial y} + \\frac{\\partial (\\rho w)}{\\partial z} = 0$',
        '$\\frac{\\partial \\rho}{\\partial t} + \\nabla^2 \\rho = 0$',
        '$\\frac{\\partial u}{\\partial x} + \\frac{\\partial v}{\\partial y} + \\frac{\\partial w}{\\partial z} = \\rho$',
        '$\\rho = \\text{const}$ immer',
      ],
      correctIndex: 0,
      explanation: '3D-Kontinuität: $\\partial \\rho / \\partial t + \\nabla \\cdot (\\rho \\mathbf{u}) = 0$. Inkompressibel ($\\rho = \\text{const}$): $\\nabla \\cdot \\mathbf{u} = 0$.' },

    // u06-q003 — NS für ρ=const
    { id: 'vl-06-03', type: 'formula-select', tag: 'vorlesung',
      question: 'Wie lauten die Navier-Stokes-Gleichungen für $\\rho = \\text{const}$?',
      options: [
        '$\\rho\\left(\\frac{\\partial \\mathbf{u}}{\\partial t} + \\mathbf{u} \\cdot \\nabla \\mathbf{u}\\right) = -\\nabla p + \\mu \\nabla^2 \\mathbf{u} + \\rho \\mathbf{f}$',
        '$\\frac{\\partial \\mathbf{u}}{\\partial t} = -\\nabla p$',
        '$\\rho \\nabla^2 \\mathbf{u} = \\mathbf{f}$',
        '$\\nabla \\cdot \\mathbf{u} = -\\nabla p$',
      ],
      correctIndex: 0,
      explanation: 'Inkompressible NS: $\\rho(\\partial_t \\mathbf{u} + \\mathbf{u} \\cdot \\nabla \\mathbf{u}) = -\\nabla p + \\mu \\nabla^2 \\mathbf{u} + \\rho \\mathbf{f}$, plus $\\nabla \\cdot \\mathbf{u} = 0$.' },

    // u06-q004 — Terme der Impulsgleichung
    { id: 'vl-06-04', type: 'multi-select', tag: 'vorlesung',
      question: 'Welche Terme enthält die Impulserhaltungsgleichung?',
      options: [
        'Zeitterm $\\partial(\\rho\\mathbf{u})/\\partial t$',
        'Konvektion $\\nabla \\cdot (\\rho \\mathbf{u} \\otimes \\mathbf{u})$',
        'Druckgradient $-\\nabla p$',
        'Viskose Spannungen $\\nabla \\cdot \\boldsymbol{\\tau}$',
        'Turbulente kinetische Energie $k$',
      ],
      correctIndices: [0, 1, 2, 3],
      explanation: 'Impulsgleichung: Zeitterm + Konvektion = Druckgradient + viskose Diffusion + Volumenkräfte. $k$ ist eine Modellgröße, nicht direkt ein Term der Impulsgleichung.' },

    // u06-q005 — Einstein-Summenkonvention
    { id: 'vl-06-05', type: 'formula-select', tag: 'vorlesung',
      question: 'Wie lautet die Impulserhaltung in Einstein-Notation?',
      options: [
        '$\\frac{\\partial (\\rho u_i)}{\\partial t} + \\frac{\\partial (\\rho u_i u_j)}{\\partial x_j} = -\\frac{\\partial p}{\\partial x_i} + \\frac{\\partial \\tau_{ij}}{\\partial x_j} + \\rho f_i$',
        '$\\frac{\\partial u_i}{\\partial x_i} = 0$',
        '$\\rho u_i u_j = -p \\delta_{ij}$',
        '$\\frac{\\partial \\tau_{ij}}{\\partial x_i} = \\rho f_j$',
      ],
      correctIndex: 0,
      explanation: 'Einstein-Notation: über wiederholte Indizes wird summiert. $\\frac{\\partial(\\rho u_i u_j)}{\\partial x_j}$ summiert über $j = 1,2,3$.' },

    // u06-q006/q007 — Schubspannung
    { id: 'vl-06-07', type: 'formula-select', tag: 'vorlesung',
      question: 'Wie lautet $\\tau_{xy}$ für ein Newtonsches Fluid (Stokes)?',
      options: [
        '$\\tau_{xy} = \\mu\\left(\\frac{\\partial u}{\\partial y} + \\frac{\\partial v}{\\partial x}\\right)$',
        '$\\tau_{xy} = \\mu \\frac{\\partial u}{\\partial x}$',
        '$\\tau_{xy} = -p + 2\\mu \\frac{\\partial u}{\\partial x}$',
        '$\\tau_{xy} = \\rho u v$',
      ],
      correctIndex: 0,
      explanation: 'Stokes: $\\tau_{ij} = \\mu(\\partial u_i / \\partial x_j + \\partial u_j / \\partial x_i) - \\frac{2}{3}\\mu(\\nabla \\cdot \\mathbf{u})\\delta_{ij}$. Für $i \\neq j$: $\\tau_{xy} = \\mu(\\partial u/\\partial y + \\partial v/\\partial x)$.' },

    // u06-q015 — Generische Transportgleichung
    { id: 'vl-06-15', type: 'single-choice', tag: 'vorlesung',
      question: 'In der generischen Transportgleichung $\\partial(\\rho\\phi)/\\partial t + \\nabla \\cdot (\\rho \\mathbf{u} \\phi) = \\nabla \\cdot (\\Gamma \\nabla \\phi) + S_\\phi$: Was wird durch $\\phi = 1$ beschrieben?',
      options: [
        'Massenerhaltung (Kontinuitätsgleichung)',
        'Impulserhaltung',
        'Energieerhaltung',
        'Speziesgleichung',
      ],
      correctIndex: 0,
      explanation: '$\\phi = 1, \\Gamma = 0, S = 0 \\Rightarrow \\partial \\rho / \\partial t + \\nabla \\cdot (\\rho \\mathbf{u}) = 0$ — Massenerhaltung.' },

    // u06-q018 — Drei molekulare Transportphänomene
    { id: 'vl-06-18', type: 'multi-select', tag: 'vorlesung',
      question: 'Welche drei molekularen Diffusionsprozesse beeinflussen eine Strömung?',
      options: [
        'Impulsdiffusion (Viskosität $\\mu$)',
        'Wärmediffusion (Wärmeleitung $k$)',
        'Stoffdiffusion (Fick, $D$)',
        'Turbulente Diffusion',
      ],
      correctIndices: [0, 1, 2],
      explanation: 'Drei molekulare Prozesse: Impulsdiffusion ($\\mu$), Wärmediffusion ($k$), Speziesdiffusion ($D$). Turbulente Diffusion ist makroskopisch, nicht molekular.' },

    // u06-q020 — Newton'sches Fluid
    { id: 'vl-06-20', type: 'text-input', tag: 'vorlesung',
      question: 'Was charakterisiert ein Newtonsches Fluid?',
      acceptedAnswers: ['Schubspannung linear proportional zur Scherrate', 'lineare Beziehung zwischen Schubspannung und Scherrate', 'tau proportional zu du/dy', 'linearer Zusammenhang Schubspannung Scherrate'],
      explanation: 'Newtonsches Fluid: $\\tau = \\mu \\dot{\\gamma}$ — Schubspannung linear proportional zur Verzerrungsgeschwindigkeit. $\\mu$ unabhängig von der Scherrate.' },

    // u06-q022 — Fourier
    { id: 'vl-06-22', type: 'formula-select', tag: 'vorlesung',
      question: 'Wie lautet das Fourier-Gesetz der Wärmeleitung?',
      options: [
        '$\\mathbf{q} = -k \\nabla T$, mit $k$ in W/(m·K)',
        '$\\mathbf{q} = k \\nabla T$',
        '$\\mathbf{q} = -\\mu \\nabla \\mathbf{u}$',
        '$\\mathbf{q} = \\rho c_p T$',
      ],
      correctIndex: 0,
      explanation: 'Fourier: $\\mathbf{q} = -k \\nabla T$. Wärme fließt von warm nach kalt (negatives Vorzeichen). $k$ = Wärmeleitfähigkeit [W/(m·K)].' },

    // u06-q025 — Bernoulli
    { id: 'vl-06-25', type: 'single-choice', tag: 'vorlesung',
      question: 'Unter welchen Annahmen vereinfacht sich die Energiegleichung zur Bernoulli-Gleichung?',
      options: [
        'Stationär, inkompressibel, inviszid, adiabatisch, entlang Stromlinie',
        'Instationär, kompressibel, viskos',
        'Nur bei turbulenter Strömung',
        'Immer anwendbar',
      ],
      correctIndex: 0,
      explanation: 'Bernoulli: $p/\\rho + |\\mathbf{u}|^2/2 + gz = \\text{const}$ gilt nur stationär, inkompressibel, inviszid, adiabatisch, entlang einer Stromlinie.' },
  ],

  /* ════════════════════════════════════════════════════════════════
     UNIT 06  →  2d-scalar
     ════════════════════════════════════════════════════════════════ */
  '2d-scalar': [
    // u06-q026 — 2D Wärmegleichung
    { id: 'vl-06-26', type: 'single-choice', tag: 'vorlesung',
      question: 'Was ergibt die implizite Diskretisierung der 2D-Wärmegleichung?',
      options: [
        'Ein 5-Punkt-System: $a_P T_P = a_W T_W + a_E T_E + a_S T_S + a_N T_N + b$',
        'Ein tridiagonales System',
        'Eine analytische Lösung',
        'Ein 3-Punkt-System',
      ],
      correctIndex: 0,
      explanation: 'Implizit 2D: 5-Punkt-Stencil ($P, W, E, S, N$). Mit $Fo_x = \\alpha \\Delta t / \\Delta x^2$, $Fo_y = \\alpha \\Delta t / \\Delta y^2$: $a_P = 1 + 2Fo_x + 2Fo_y$.' },

    // u06-q010 — Energiedefinitionen
    { id: 'vl-06-10', type: 'multi-select', tag: 'vorlesung',
      question: 'Welche Energiedefinitionen sind in der CFD relevant?',
      options: [
        'Innere Energie $e = c_v T$',
        'Kinetische Energie $|\\mathbf{u}|^2/2$',
        'Enthalpie $h = e + p/\\rho$',
        'Totale Energie $E = e + |\\mathbf{u}|^2/2$',
        'Elektrische Energie',
      ],
      correctIndices: [0, 1, 2, 3],
      explanation: 'CFD-relevant: innere Energie $e$, kinetische Energie, Enthalpie $h = e + p/\\rho$ und totale Energie $E = e + |\\mathbf{u}|^2/2$ (+$gz$).' },

    // u06-q016 — Auswahlkriterien Erhaltungsgleichungen
    { id: 'vl-06-16', type: 'multi-select', tag: 'vorlesung',
      question: 'Welche Kriterien bestimmen die nötigen Erhaltungsgleichungen in einer CFD?',
      options: [
        'Kompressibilität/Machzahl',
        'Thermik (Temperaturänderungen relevant?)',
        'Turbulenz (RANS/LES/DNS)',
        'Mehrphasen-Strömung',
        'Die Farbe des Fluids',
      ],
      correctIndices: [0, 1, 2, 3],
      explanation: 'Auswahl basiert auf: Kompressibilität ($Ma$), Thermik, Turbulenz, Mehrphasen, ggf. Spezies/Reaktionen. Farbe ist irrelevant.' },
  ],

  /* ════════════════════════════════════════════════════════════════
     UNIT 07 — Finite Volumen Methode  →  fvm-concept
     ════════════════════════════════════════════════════════════════ */
  'fvm-concept': [
    // u07-q002 — Zustandsgrößen und Flüsse
    { id: 'vl-07-02', type: 'single-choice', tag: 'vorlesung',
      question: 'Wo sind in der FVM Zustandsgrößen und Flüsse definiert?',
      options: [
        'Zustandsgrößen im Zellzentrum, Flüsse an den Zellflächen',
        'Beide im Zellzentrum',
        'Beide an den Zellflächen',
        'Zustandsgrößen an Ecken, Flüsse im Zentrum',
      ],
      correctIndex: 0,
      explanation: 'Cell-centered FVM: Skalare ($p, T, \\rho$) im Zellzentrum $P$. Konvektive/diffuse Flüsse an Flächen ($e, w, n, s$).' },

    // u07-q003 — Face-Werte
    { id: 'vl-07-03', type: 'multi-select', tag: 'vorlesung',
      question: 'Wie können Face-Werte $\\phi_f$ in der FVM berechnet werden?',
      options: [
        'Lineare Interpolation (CDS): $\\phi_e \\approx (\\phi_P + \\phi_E)/2$',
        'Upwind: $\\phi_e = \\phi_{\\text{upwind}}$ je nach Flussrichtung',
        'Gradient-basiert mit Limiter (TVD/MUSCL)',
        'Exakte analytische Lösung an jedem Face',
      ],
      correctIndices: [0, 1, 2],
      explanation: 'Face-Werte durch Interpolation/Rekonstruktion: CDS (linear), Upwind (1. Ordnung), TVD/MUSCL (höhere Ordnung mit Limiter). Exakte Lösung ist nicht verfügbar.' },

    // u07-q005 — Vereinfachende Annahmen
    { id: 'vl-07-05', type: 'true-false', tag: 'vorlesung',
      question: 'Wahr oder falsch?',
      statement: 'In der FVM werden Stoffwerte ($\\rho$, $\\mu$, $k$) häufig als stückweise konstant pro Zelle angenommen.',
      correct: true,
      explanation: 'Korrekt — Stoffwerte werden meist als Zellmittelwerte behandelt. Face-Stoffwerte durch arithmetische oder harmonische Mittelung.' },

    // u07-q008 — Ap als Funktion
    { id: 'vl-07-08', type: 'single-choice', tag: 'vorlesung',
      question: 'In der FVM-Gleichung $a_P \\phi_P = \\Sigma a_{nb} \\phi_{nb} + b$: Ist $a_P$ frei wählbar?',
      options: [
        'Nein — $a_P$ ergibt sich aus der Bilanz: $a_P = \\Sigma a_{nb} - S_P + a_P^{\\text{transient}}$',
        'Ja — $a_P$ ist ein freier Stabilisierungsparameter',
        '$a_P$ ist immer 1',
        '$a_P$ hängt nur vom Zeitschritt ab',
      ],
      correctIndex: 0,
      explanation: '$a_P$ folgt aus Erhaltungsprinzip und Koeffizientensumme. Diagonaldominanz ($a_P \\geq \\Sigma |a_{nb}|$) ist wichtig für Konvergenz.' },
  ],

  /* ════════════════════════════════════════════════════════════════
     UNIT 07  →  fvm-fvm-vs-fdm
     ════════════════════════════════════════════════════════════════ */
  'fvm-fvm-vs-fdm': [
    // u07-q001 — FDM vs FVM
    { id: 'vl-07-01', type: 'multi-select', tag: 'vorlesung',
      question: 'Was sind Vorteile der FVM gegenüber der FDM?',
      options: [
        'Von Natur aus konservativ (lokale Flusserhaltung)',
        'Gut geeignet für unstrukturierte Gitter',
        'Basiert auf Integralform der Erhaltungssätze',
        'Einfacher zu implementieren als FDM',
      ],
      correctIndices: [0, 1, 2],
      explanation: 'FVM: konservativ (Flüsse paarweise), flexibel (unstrukturierte Gitter), physikalisch motiviert (Integralform). FDM ist auf strukturierten Gittern oft einfacher.' },

    // u07-q010 — Konvergenzordnung FVM
    { id: 'vl-07-10', type: 'single-choice', tag: 'vorlesung',
      question: 'Was ist die typische Konvergenzordnung einer FVM mit linearer Rekonstruktion?',
      options: [
        '2. Ordnung auf orthogonalen, strukturierten Netzen',
        'Immer 4. Ordnung',
        'Immer 1. Ordnung',
        'Unabhängig vom Schema',
      ],
      correctIndex: 0,
      explanation: 'Typische FVM: 2. Ordnung mit CDS/linearer Rekonstruktion. Mit UDS nur 1. Ordnung. Auf verzerrten Netzen/schlecht Rand-BC kann die beobachtete Ordnung sinken.' },

    // u07-q009 — Sweby-Kriterium
    { id: 'vl-07-09', type: 'single-choice', tag: 'vorlesung',
      question: 'Was beschreibt das Sweby-Kriterium?',
      options: [
        'Den zulässigen Bereich für Flux-Limiter $\\psi(r)$, damit ein Schema TVD bleibt',
        'Die Stabilitätsbedingung für den Zeitschritt',
        'Die Konvergenzordnung eines Schemas',
        'Die Gitterqualitätskriterien',
      ],
      correctIndex: 0,
      explanation: 'Sweby-Diagramm: Achsen $r$ und $\\psi$. TVD-Bereich: $0 \\leq \\psi(r) \\leq \\min(2r, 2)$ für $r \\geq 0$, $\\psi(r) = 0$ für $r < 0$.' },
  ],

  /* ════════════════════════════════════════════════════════════════
     UNIT 08 — Rechengitter  →  basics-mesh
     ════════════════════════════════════════════════════════════════ */
  'basics-mesh': [
    { id: 'vl-08-01', type: 'single-choice', tag: 'vorlesung',
      question: 'Was ist der Unterschied zwischen physikalischem Raum und Rechenraum?',
      options: [
        'Physikalischer Raum: reale Geometrie (krummlinig). Rechenraum: transformierte, oft äquidistante Koordinaten.',
        'Kein Unterschied',
        'Physikalischer Raum = 3D, Rechenraum = 2D',
        'Rechenraum ist immer kartesisch und uniform',
      ],
      correctIndex: 0,
      explanation: 'Bei strukturierten Gittern wird die krummlinige Geometrie (physikalisch) in ein regelmäßiges Rechengitter transformiert. Jacobi-Matrix beschreibt die Abbildung.' },

    { id: 'vl-08-02', type: 'multi-select', tag: 'vorlesung',
      question: 'Welche Gittertypen gibt es in CFD?',
      options: [
        'Strukturiert (hexaedrisch, ijk-Indizierung)',
        'Unstrukturiert (Tetraeder, Polyeder, gemischt)',
        'Block-strukturiert (Multi-Block)',
        'Nur kartesische Gitter',
      ],
      correctIndices: [0, 1, 2],
      explanation: 'Haupttypen: strukturiert (Hex, einfache Indizierung), unstrukturiert (Tet/Poly, flexibel), block-strukturiert (Multi-Block für komplexe Geometrien).' },

    { id: 'vl-08-03', type: 'multi-select', tag: 'vorlesung',
      question: 'Welche Qualitätskriterien sind für CFD-Gitter wichtig?',
      options: [
        'Skewness (Schiefe)',
        'Orthogonalität',
        'Aspect Ratio (Seitenverhältnis)',
        'Grenzschichtauflösung ($y^+$)',
        'Gitterfarbe',
      ],
      correctIndices: [0, 1, 2, 3],
      explanation: 'Gitterqualität: Skewness, Orthogonalität, Aspect Ratio beeinflussen Genauigkeit/Konvergenz. $y^+$ ist entscheidend für Wandmodellierung.' },

    { id: 'vl-08-04', type: 'true-false', tag: 'vorlesung',
      question: 'Wahr oder falsch?',
      statement: 'Non-Orthogonalität eines Gitters erfordert Korrekturen im diffusen Fluss der FVM.',
      correct: true,
      explanation: 'Korrekt — bei nicht-orthogonalen Gittern stimmt der Vektor $\\mathbf{d}_{PE}$ nicht mit der Flächennormale überein → non-orthogonal correction nötig, sonst Genauigkeitsverlust.' },

    { id: 'vl-08-05', type: 'single-choice', tag: 'vorlesung',
      question: 'Was ist der Vorteil eines strukturierten Gitters gegenüber unstrukturiert?',
      options: [
        'Einfache Indizierung ($i,j,k$), effiziente Speicherung, gute Löser-Performance',
        'Mehr Flexibilität bei komplexen Geometrien',
        'Automatische Grenzschichtauflösung',
        'Kein Vorteil',
      ],
      correctIndex: 0,
      explanation: 'Strukturiert: ijk-Indizierung → effizient, schnelle Löser (TDMA), gute Diskretisierungsordnung. Nachteil: schwer für komplexe Geometrien.' },
  ],

  /* ════════════════════════════════════════════════════════════════
     UNIT 09 — Algorithmen  →  incomp-simple
     ════════════════════════════════════════════════════════════════ */
  'incomp-simple': [
    { id: 'vl-09-01', type: 'single-choice', tag: 'vorlesung',
      question: 'Was ist das Kernproblem bei inkompressiblen Strömungen, das den SIMPLE-Algorithmus nötig macht?',
      options: [
        'Es gibt keine Zustandsgleichung für $p$ — Druck-Geschwindigkeits-Kopplung muss algorithmisch gelöst werden',
        'Die Energiegleichung ist nicht lösbar',
        'Die Viskosität ist unbekannt',
        'Turbulenz muss immer modelliert werden',
      ],
      correctIndex: 0,
      explanation: 'Inkompressibel: $\\rho = \\text{const}$, keine EOS für $p$. SIMPLE nutzt eine Druckkorrekturgleichung aus der Kontinuität, um $p$ und $\\mathbf{u}$ zu koppeln.' },

    { id: 'vl-09-02', type: 'single-choice', tag: 'vorlesung',
      question: 'Was ist die Grundidee des SIMPLE-Algorithmus?',
      options: [
        'Predict-Correct: Impuls mit geschätztem Druck lösen, dann Druck korrigieren, damit Kontinuität erfüllt ist',
        'Direkte Lösung aller Gleichungen gleichzeitig (fully coupled)',
        'Nur die Energiegleichung lösen',
        'Monte-Carlo-Simulation der Moleküle',
      ],
      correctIndex: 0,
      explanation: 'SIMPLE: 1) Impuls mit $p^*$ lösen → $\\mathbf{u}^*$. 2) Druckkorrekturgleichung aus $\\nabla \\cdot \\mathbf{u}^* \\neq 0$. 3) $p, \\mathbf{u}$ korrigieren. Iterieren.' },

    { id: 'vl-09-03', type: 'true-false', tag: 'vorlesung',
      question: 'Wahr oder falsch?',
      statement: 'Checkerboard-Oszillationen im Druckfeld können bei collocated Gittern auftreten, wenn keine Rhie-Chow-Interpolation verwendet wird.',
      correct: true,
      explanation: 'Korrekt — auf collocated Gittern entkoppelt CDS den Druck (gerade/ungerade Punkte). Rhie-Chow-Interpolation oder staggered Gitter verhindern dies.' },
  ],

  /* ════════════════════════════════════════════════════════════════
     UNIT 09  →  algo-linear-systems / algo-iterative
     ════════════════════════════════════════════════════════════════ */
  'algo-linear-systems': [
    { id: 'vl-09-04', type: 'single-choice', tag: 'vorlesung',
      question: 'Was sind Residuen in einer CFD-Simulation?',
      options: [
        'Maß für die Verletzung der diskreten Gleichungen, d.h. $R = A\\phi - b$',
        'Die physikalische Lösung selbst',
        'Randbedingungswerte',
        'Zufällige Rundungsfehler',
      ],
      correctIndex: 0,
      explanation: 'Residuum $R = A\\phi - b \\neq 0$ bei nicht konvergierter Lösung. $\\|R\\| \\to 0$ bei iterativer Konvergenz, aber kleine Residuen ≠ korrekte Physik.' },

    { id: 'vl-09-05', type: 'true-false', tag: 'vorlesung',
      question: 'Wahr oder falsch?',
      statement: 'Diagonaldominanz der Koeffizientenmatrix ist wichtig für die Konvergenz iterativer Löser.',
      correct: true,
      explanation: 'Korrekt — $|a_P| \\geq \\Sigma |a_{nb}|$ garantiert Konvergenz von Gauss-Seidel/SOR. Negative Koeffizienten (z.B. CDS bei großem $Pe_D$) verletzen dies.' },
  ],

  'algo-iterative': [
    { id: 'vl-09-06', type: 'multi-select', tag: 'vorlesung',
      question: 'Welche iterativen Lösungsverfahren werden in CFD eingesetzt?',
      options: [
        'Gauss-Seidel / SOR',
        'Krylov-Methoden (CG, GMRES, BiCGSTAB)',
        'Algebraisches Multigrid (AMG)',
        'Nur direkte Löser (LU-Zerlegung)',
      ],
      correctIndices: [0, 1, 2],
      explanation: 'Iterative Löser: Gauss-Seidel/SOR (einfach), Krylov (CG für symm., GMRES/BiCGSTAB für unsymm.), AMG als Preconditioner. Direkte Löser nur bei kleinen Systemen.' },
  ],

  /* ════════════════════════════════════════════════════════════════
     UNIT 09  →  algo-underrelaxation
     ════════════════════════════════════════════════════════════════ */
  'algo-underrelaxation': [
    { id: 'vl-09-07', type: 'single-choice', tag: 'vorlesung',
      question: 'Was ist der Zweck der Unterrelaxation in CFD?',
      options: [
        'Stabilisierung der äußeren Iteration durch Dämpfung der Änderungen: $\\phi^{\\text{new}} = \\phi^{\\text{old}} + \\alpha (\\phi^* - \\phi^{\\text{old}})$',
        'Beschleunigung der Konvergenz durch größere Schritte',
        'Verbesserung der Zeitgenauigkeit',
        'Reduktion der Gitterpunkte',
      ],
      correctIndex: 0,
      explanation: 'Unterrelaxation mit $0 < \\alpha < 1$ dämpft die Iteration, verhindert Divergenz bei stark nichtlinearer Kopplung (Navier-Stokes). Zu kleine $\\alpha$ → langsame Konvergenz.' },

    { id: 'vl-09-08', type: 'true-false', tag: 'vorlesung',
      question: 'Wahr oder falsch?',
      statement: 'Bei der Unterrelaxation muss sowohl der Diagonal-Koeffizient $a_P$ als auch die rechte Seite $b$ angepasst werden.',
      correct: true,
      explanation: 'Korrekt — Standardform: $a_P/\\alpha \\cdot \\phi_P = \\Sigma a_{nb} \\phi_{nb} + b + (1-\\alpha)/\\alpha \\cdot a_P \\cdot \\phi_P^{\\text{old}}$. Beide Seiten müssen konsistent sein.' },
  ],

  /* ════════════════════════════════════════════════════════════════
     UNIT 09  →  algo-multigrid
     ════════════════════════════════════════════════════════════════ */
  'algo-multigrid': [
    { id: 'vl-09-09', type: 'single-choice', tag: 'vorlesung',
      question: 'Was ist die Grundidee von Multigrid?',
      options: [
        'Niedrigfrequente Fehler auf grobem Gitter effizient dämpfen, hochfrequente auf feinem Gitter',
        'Nur auf dem feinsten Gitter iterieren',
        'Das Gitter während der Rechnung verfeinern',
        'Direkte Lösung auf dem gröbsten Gitter',
      ],
      correctIndex: 0,
      explanation: 'Multigrid: Relaxation auf feinem Gitter dämpft nur hochfrequente Fehler. Restriktion auf gröberes Gitter → niederfrequente Fehler werden hochfrequent → effizient lösbar. V-Zyklus.' },
  ],

  /* ════════════════════════════════════════════════════════════════
     UNIT 10 — Kompressible Strömungen  →  comp-euler
     ════════════════════════════════════════════════════════════════ */
  'comp-euler': [
    { id: 'vl-10-01', type: 'formula-select', tag: 'vorlesung',
      question: 'Wie lautet die Schallgeschwindigkeit $a$ für ein ideales Gas?',
      options: [
        '$a = \\sqrt{\\gamma R T} = \\sqrt{\\gamma p / \\rho}$',
        '$a = \\gamma p / \\rho$',
        '$a = \\sqrt{p / \\rho}$',
        '$a = u + p / \\rho$',
      ],
      correctIndex: 0,
      explanation: 'Ideales Gas: $a = \\sqrt{\\gamma R T} = \\sqrt{\\gamma p / \\rho}$ mit $\\gamma = c_p / c_v$.' },

    { id: 'vl-10-02', type: 'single-choice', tag: 'vorlesung',
      question: 'Was ist die Machzahl und was beschreibt sie?',
      options: [
        '$Ma = u/a$ — Verhältnis Strömungsgeschwindigkeit zu Schallgeschwindigkeit',
        '$Ma = \\rho u L / \\mu$ — Verhältnis Trägheit zu Reibung',
        '$Ma = u \\Delta x / \\alpha$ — Verhältnis Konvektion zu Diffusion',
        '$Ma = |u| \\Delta t / \\Delta x$ — Verhältnis Strecke zu Zellgröße',
      ],
      correctIndex: 0,
      explanation: '$Ma = u/a$. $Ma < 0{,}3$: inkompressibel. $0{,}3 < Ma < 1$: subsonic. $Ma > 1$: supersonic. $Ma > 5$: hypersonic.' },

    { id: 'vl-10-03', type: 'multi-select', tag: 'vorlesung',
      question: 'Welche zusätzlichen Gleichungen braucht man für kompressible Strömungen (vs. inkompressibel)?',
      options: [
        'Energiegleichung (Enthalpie/Temperatur)',
        'Zustandsgleichung $p = p(\\rho, T)$',
        'Dichte ist jetzt Unbekannte',
        'SIMPLE-Druckkorrektur ist ausreichend',
      ],
      correctIndices: [0, 1, 2],
      explanation: 'Kompressibel: $\\rho$ variabel → Energie + EOS nötig zusätzlich zu Masse + Impuls. SIMPLE reicht oft nicht (density-based Solver nötig).' },

    { id: 'vl-10-04', type: 'single-choice', tag: 'vorlesung',
      question: 'Was sind Charakteristiken in der kompressiblen Strömung?',
      options: [
        'Kurven im $x$-$t$-Diagramm, entlang derer sich Information ausbreitet (Geschwindigkeiten $u$, $u+a$, $u-a$)',
        'Die Randbedingungen der Simulation',
        'Turbulenzstrukturen',
        'Gitterlinien im Rechenraum',
      ],
      correctIndex: 0,
      explanation: 'Charakteristiken: Informationsausbreitung mit $u$ (Entropie/Partikelwelle), $u+a$ und $u-a$ (Schallwellen). Bei $Ma > 1$ zeigen alle nach downstream → Supersonic-BC.' },
  ],

  /* ════════════════════════════════════════════════════════════════
     UNIT 10  →  comp-riemann
     ════════════════════════════════════════════════════════════════ */
  'comp-riemann': [
    { id: 'vl-10-05', type: 'single-choice', tag: 'vorlesung',
      question: 'Was ist ein Riemann-Problem?',
      options: [
        'Anfangswertproblem mit stückweise konstantem Zustand und einer Diskontinuität (z.B. Membran)',
        'Ein allgemeines 3D-Strömungsproblem',
        'Die zeitliche Integration der Energiegleichung',
        'Ein Turbulenzmodell',
      ],
      correctIndex: 0,
      explanation: 'Riemann-Problem: $U(x,0) = U_L$ für $x < 0$, $U_R$ für $x > 0$. Lösung besteht aus Schock, Kontaktdiskontinuität und Expansionsfächer.' },

    { id: 'vl-10-06', type: 'multi-select', tag: 'vorlesung',
      question: 'Welche Wellentypen treten bei der Lösung des Riemann-Problems auf?',
      options: [
        'Stoßwelle (Schock)',
        'Kontaktdiskontinuität',
        'Expansionsfächer (Verdünnungswelle)',
        'Turbulenter Wirbel',
      ],
      correctIndices: [0, 1, 2],
      explanation: 'Riemann-Lösung: Schock (Kompression), Kontaktdiskontinuität (Dichte-Sprung, kein Drucksprung) und Expansionsfächer. Keine Turbulenz im 1D-Euler-Riemann.' },
  ],

  /* ════════════════════════════════════════════════════════════════
     UNIT 10  →  comp-godunov
     ════════════════════════════════════════════════════════════════ */
  'comp-godunov': [
    { id: 'vl-10-07', type: 'single-choice', tag: 'vorlesung',
      question: 'Was ist die Grundidee des Godunov-Verfahrens?',
      options: [
        'An jeder Zellfläche ein lokales Riemann-Problem lösen, um den numerischen Fluss zu bestimmen',
        'Zentrale Differenzen für alle Flüsse verwenden',
        'Die Euler-Gleichungen analytisch lösen',
        'Direkte Druckkorrektur wie SIMPLE',
      ],
      correctIndex: 0,
      explanation: 'Godunov: Stückweise konstante Zustände → lokales Riemann-Problem an jeder Zellfläche → physikalisch korrekte Flussberechnung. Basis für moderne Verfahren (Roe, HLLC).' },

    { id: 'vl-10-08', type: 'multi-select', tag: 'vorlesung',
      question: 'Welche approximativen Riemann-Löser gibt es?',
      options: [
        'Roe-Solver (linearisiertes Riemann-Problem)',
        'HLL/HLLC-Solver',
        'Rusanov/Lax-Friedrichs',
        'SIMPLE-Solver',
      ],
      correctIndices: [0, 1, 2],
      explanation: 'Approximative Riemann-Löser: Roe (linearisiert), HLL/HLLC (Wave-Speed-Abschätzung), Rusanov (einfachster, diffusivster). SIMPLE ist für inkompressible Druck-Geschwindigkeits-Kopplung.' },
  ],

  /* ════════════════════════════════════════════════════════════════
     UNIT 10  →  comp-shocktube
     ════════════════════════════════════════════════════════════════ */
  'comp-shocktube': [
    { id: 'vl-10-09', type: 'single-choice', tag: 'vorlesung',
      question: 'Was beschreibt das Sod-Shocktube-Problem?',
      options: [
        'Klassisches 1D-Riemann-Problem: Membran trennt Hochdruck von Niederdruck, Lösung enthält Schock, Kontakt und Expansionsfächer',
        'Eine 3D-Turbulenzrechnung',
        'Eine stationäre Rohrströmung',
        'Die Ausbreitung einer Flamme',
      ],
      correctIndex: 0,
      explanation: 'Sod Shocktube: $p_L > p_R$, $\\rho_L > \\rho_R$. Nach Membranbruch: Schock nach rechts, Kontaktdiskontinuität, Expansionsfächer nach links. Standard-Benchmark für kompressible Solver.' },

    { id: 'vl-10-10', type: 'true-false', tag: 'vorlesung',
      question: 'Wahr oder falsch?',
      statement: 'Über einen Stoß (Schock) gelten die Rankine-Hugoniot-Bedingungen als Sprungrelationen für Masse, Impuls und Energie.',
      correct: true,
      explanation: 'Korrekt — Rankine-Hugoniot: $[\\rho(u - s)] = 0$, $[\\rho u(u-s) + p] = 0$, $[\\rho E(u-s) + pu] = 0$ mit Schockgeschwindigkeit $s$. Entropieanstieg durch den Schock.' },

    { id: 'vl-10-11', type: 'single-choice', tag: 'vorlesung',
      question: 'Wie bestimmt man die Anzahl der am Ein-/Auslass vorzugebenden Randbedingungen bei kompressiblen Strömungen?',
      options: [
        'Über die Anzahl der einlaufenden Charakteristiken (abhängig von $Ma$ und Vorzeichen)',
        'Immer alle Variablen vorgeben',
        'Nur den Druck vorgeben',
        'Das ist nicht relevant',
      ],
      correctIndex: 0,
      explanation: 'Subsonic Einlass: 1 ausgehende Charakt. → 1 Variable extrapolieren, Rest vorgeben. Supersonic Einlass: alle eingehend → alles vorgeben. Supersonic Auslass: alles extrapolieren.' },
  ],

  /* ════════════════════════════════════════════════════════════════
     UNIT 11 — Turbulenz Eigenschaften  →  turb-intro
     ════════════════════════════════════════════════════════════════ */
  'turb-intro': [
    { id: 'vl-11-01', type: 'single-choice', tag: 'vorlesung',
      question: 'Ab welcher Kennzahl wird eine Strömung typischerweise turbulent?',
      options: [
        'Ab einer kritischen Reynolds-Zahl $Re_{\\text{krit}}$ (abhängig von Geometrie)',
        'Ab $Ma > 1$',
        'Ab $Pe > 2$',
        'Immer bei Gasen',
      ],
      correctIndex: 0,
      explanation: 'Turbulenzübergang bei $Re > Re_{\\text{krit}}$ (z.B. Rohr: $Re_{\\text{krit}} \\approx 2300$, Platte: $Re_{\\text{krit}} \\approx 5 \\cdot 10^5$). Machzahl und Péclet sind andere Kennzahlen.' },

    { id: 'vl-11-02', type: 'multi-select', tag: 'vorlesung',
      question: 'Was sind typische Eigenschaften turbulenter Strömungen?',
      options: [
        'Dreidimensional und instationär',
        'Breites Spektrum an Längen- und Zeitskalen',
        'Erhöhte Mischung und Diffusion',
        'Deterministisch und vorhersagbar im Detail',
      ],
      correctIndices: [0, 1, 2],
      explanation: 'Turbulenz: 3D, instationär, breites Skalenspektrum (Kolmogorov-Kaskade), erhöhter Transport. Sensitiv auf Anfangsbedingungen (chaotisch), nicht deterministisch im Detail.' },

    { id: 'vl-11-03', type: 'formula-select', tag: 'vorlesung',
      question: 'Wie skaliert die kleinste turbulente Längenskala (Kolmogorov-Skala) $\\eta$?',
      options: [
        '$\\eta \\sim L \\cdot Re^{-3/4}$',
        '$\\eta \\sim L \\cdot Re^{-1/2}$',
        '$\\eta \\sim L \\cdot Re^{-1}$',
        '$\\eta = L / 10$',
      ],
      correctIndex: 0,
      explanation: 'Kolmogorov: $\\eta = (\\nu^3 / \\varepsilon)^{1/4} \\sim L \\cdot Re^{-3/4}$. Bei $Re = 10^6$: $\\eta / L \\sim 10^{-4.5}$ — DNS braucht $\\sim Re^{9/4}$ Gitterpunkte in 3D!' },

    { id: 'vl-11-04', type: 'single-choice', tag: 'vorlesung',
      question: 'Was beschreibt die turbulente Energiekaskade?',
      options: [
        'Energie wird bei großen Wirbeln eingebracht und über immer kleinere Wirbel bis zur Dissipation bei der Kolmogorov-Skala transportiert',
        'Energie fließt von kleinen zu großen Skalen',
        'Energie wird gleichmäßig auf alle Skalen verteilt',
        'Es gibt keine Kaskade in turbulenten Strömungen',
      ],
      correctIndex: 0,
      explanation: 'Richardson-Kaskade: große Wirbel → kleinere → … → Kolmogorov-Skala $\\eta$. Energieeintrag bei $L$, Dissipation bei $\\eta$. Im Inertialbereich: $E(\\kappa) \\propto \\kappa^{-5/3}$ (Kolmogorov).' },

    { id: 'vl-11-05', type: 'text-input', tag: 'vorlesung',
      question: 'Wie heißt die Zerlegung in der Reynolds-Mittelung? $u = \\bar{u} + u\'$ — wie nennt man $u\'$?',
      acceptedAnswers: ['Fluktuation', 'Schwankungsgröße', 'Schwankungsanteil', 'turbulente Fluktuation'],
      explanation: 'Reynolds-Zerlegung: $u = \\bar{u} + u\'$. $\\bar{u}$ = zeitgemittelt, $u\'$ = turbulente Fluktuation/Schwankungsgröße. $\\overline{u\'} = 0$.' },
  ],

  /* ════════════════════════════════════════════════════════════════
     UNIT 11  →  turb-dns
     ════════════════════════════════════════════════════════════════ */
  'turb-dns': [
    { id: 'vl-11-06', type: 'single-choice', tag: 'vorlesung',
      question: 'Was ist DNS (Direkte Numerische Simulation)?',
      options: [
        'Lösung der vollständigen Navier-Stokes-Gleichungen ohne Turbulenzmodell — alle Skalen bis $\\eta$ aufgelöst',
        'Simulation mit RANS-Modell auf feinem Gitter',
        'Numerische Lösung mit DNS-Turbulenzmodell',
        'Direkte Interpolation der Experimentaldaten',
      ],
      correctIndex: 0,
      explanation: 'DNS: Keine Modellierung, alle Turbulensskalen direkt aufgelöst. Braucht $N \\sim Re^{9/4}$ Punkte in 3D — extrem aufwendig, nur bei moderatem $Re$ machbar.' },

    { id: 'vl-11-07', type: 'formula-select', tag: 'vorlesung',
      question: 'Wie skaliert der Rechenaufwand einer DNS mit der Reynolds-Zahl?',
      options: [
        '$N_{\\text{gesamt}} \\sim Re^{9/4}$ (in 3D)',
        '$N_{\\text{gesamt}} \\sim Re$',
        '$N_{\\text{gesamt}} \\sim Re^{1/2}$',
        '$N_{\\text{gesamt}} \\sim \\log(Re)$',
      ],
      correctIndex: 0,
      explanation: 'DNS: $\\Delta x \\sim \\eta \\sim L Re^{-3/4}$ → $N_{\\text{1D}} \\sim Re^{3/4}$ → $N_{\\text{3D}} \\sim Re^{9/4}$. Plus Zeitschrittbedingung: Gesamtkosten $\\sim Re^3$.' },
  ],

  /* ════════════════════════════════════════════════════════════════
     UNIT 12 — RANS Modellierung  →  turb-rans
     ════════════════════════════════════════════════════════════════ */
  'turb-rans': [
    { id: 'vl-12-01', type: 'single-choice', tag: 'vorlesung',
      question: 'Was ist das Schließungsproblem der RANS-Gleichungen?',
      options: [
        'Die Reynolds-Mittelung erzeugt den Reynolds-Spannungstensor $\\overline{u_i\' u_j\'}$ — mehr Unbekannte als Gleichungen',
        'Die Navier-Stokes-Gleichungen sind nicht lösbar',
        'Es gibt keine Randbedingungen',
        'Das Gitter ist zu grob',
      ],
      correctIndex: 0,
      explanation: 'RANS: Durch Mittelung entstehen 6 neue Unbekannte $-\\rho \\overline{u_i\' u_j\'}$ (symmetrischer Tensor) → Schließungsproblem. Turbulenzmodelle (z.B. $k$-$\\varepsilon$) approximieren diese.' },

    { id: 'vl-12-02', type: 'formula-select', tag: 'vorlesung',
      question: 'Wie lautet die Boussinesq-Hypothese für den Reynolds-Spannungstensor?',
      options: [
        '$-\\overline{u_i\' u_j\'} = \\nu_t \\left(\\frac{\\partial \\bar{u}_i}{\\partial x_j} + \\frac{\\partial \\bar{u}_j}{\\partial x_i}\\right) - \\frac{2}{3} k \\delta_{ij}$',
        '$-\\overline{u_i\' u_j\'} = \\mu \\nabla^2 \\bar{u}$',
        '$-\\overline{u_i\' u_j\'} = \\rho k$',
        '$-\\overline{u_i\' u_j\'} = 0$',
      ],
      correctIndex: 0,
      explanation: 'Boussinesq: Reynolds-Spannungen analog zu viskosen Spannungen, mit turb. Wirbelviskosität $\\nu_t$. Linearer Zusammenhang mit mittlerer Dehnrate + isotroper $k$-Anteil.' },

    { id: 'vl-12-03', type: 'true-false', tag: 'vorlesung',
      question: 'Wahr oder falsch?',
      statement: 'RANS-Modelle lösen die zeitgemittelten Navier-Stokes-Gleichungen — die gesamte Turbulenz wird modelliert.',
      correct: true,
      explanation: 'Korrekt — RANS: alle Turbulensskalen modelliert (über $\\nu_t$ oder Reynolds-Spannungs-Modell). Im Gegensatz zu LES, wo große Wirbel aufgelöst werden.' },

    { id: 'vl-12-04', type: 'single-choice', tag: 'vorlesung',
      question: 'Was ist die turbulente Wirbelviskosität $\\nu_t$ im $k$-$\\varepsilon$-Modell?',
      options: [
        '$\\nu_t = C_\\mu k^2 / \\varepsilon$',
        '$\\nu_t = k / \\varepsilon$',
        '$\\nu_t = C_\\mu k \\varepsilon$',
        '$\\nu_t = \\mu / \\rho$',
      ],
      correctIndex: 0,
      explanation: '$k$-$\\varepsilon$: $\\nu_t = C_\\mu k^2 / \\varepsilon$ mit $C_\\mu = 0{,}09$. Dimensionsanalyse: $[\\nu_t] = [k^2/\\varepsilon] = \\text{m}^2/\\text{s}$.' },

    { id: 'vl-12-05', type: 'multi-select', tag: 'vorlesung',
      question: 'Welche Limitierungen hat die Boussinesq-Hypothese?',
      options: [
        'Anisotrope Turbulenz wird nicht korrekt erfasst',
        'Versagt bei Strömungen mit starker Krümmung/Rotation',
        'Linearer Zusammenhang passt nicht bei hohem Druckgradienten',
        'Voraussetzung: $\\nu_t$ is immer positiv-isotrop',
      ],
      correctIndices: [0, 1, 2, 3],
      explanation: 'Boussinesq-Limitierungen: Isotropie der $\\nu_t$, versagt bei Anisotropie, Krümmung, starken Druckgradienten. Reynolds-Spannungs-Modelle (RSM) lösen den vollständigen Tensor.' },
  ],

  /* ════════════════════════════════════════════════════════════════
     UNIT 12/13  →  turb-ke
     ════════════════════════════════════════════════════════════════ */
  'turb-ke': [
    { id: 'vl-12-06', type: 'single-choice', tag: 'vorlesung',
      question: 'Was transportiert die $k$-Gleichung im $k$-$\\varepsilon$-Modell?',
      options: [
        'Die turbulente kinetische Energie $k = \\frac{1}{2}\\overline{u_i\' u_i\'}$',
        'Die molekulare Viskosität',
        'Den Druck',
        'Die Temperatur',
      ],
      correctIndex: 0,
      explanation: '$k = \\frac{1}{2}(\\overline{u\'^2} + \\overline{v\'^2} + \\overline{w\'^2})$ — mittlere kinetische Energie der Schwankungen. Produktion $P_k$, Dissipation $\\varepsilon$, Transport.' },

    { id: 'vl-12-07', type: 'single-choice', tag: 'vorlesung',
      question: 'Was bedeutet $\\varepsilon$ im $k$-$\\varepsilon$-Modell?',
      options: [
        'Dissipationsrate der turbulenten kinetischen Energie (Energie-Abbau bei kleinen Skalen)',
        'Die Kompressibilität',
        'Die Strahlungswärme',
        'Der numerische Fehler',
      ],
      correctIndex: 0,
      explanation: '$\\varepsilon = \\nu \\overline{(\\partial u_i\'/\\partial x_j)^2}$ — Rate, mit der $k$ durch viskose Effekte bei kleinen Skalen in Wärme umgewandelt wird.' },

    { id: 'vl-12-08', type: 'true-false', tag: 'vorlesung',
      question: 'Wahr oder falsch?',
      statement: 'Das Standard-$k$-$\\varepsilon$-Modell benötigt Wandfunktionen, da $\\varepsilon$ an der Wand singulär wird.',
      correct: true,
      explanation: 'Korrekt — $\\varepsilon \\to \\infty$ an der Wand. Standard-$k$-$\\varepsilon$ nutzt Wandfunktionen (log-law) statt die Wandnähe direkt aufzulösen. Low-Re-Varianten integrieren bis zur Wand.' },

    // u13 — verschiedene RANS-Schließungen
    { id: 'vl-13-01', type: 'multi-select', tag: 'vorlesung',
      question: 'Welche RANS-Turbulenzmodelle gibt es?',
      options: [
        'Standard $k$-$\\varepsilon$ (Launder-Sharma)',
        '$k$-$\\omega$ (Wilcox)',
        '$k$-$\\omega$ SST (Menter)',
        'Spalart-Allmaras (Ein-Gleichungs-Modell)',
        'Direkte Numerische Simulation',
      ],
      correctIndices: [0, 1, 2, 3],
      explanation: 'RANS-Modelle: $k$-$\\varepsilon$, $k$-$\\omega$, $k$-$\\omega$ SST, Spalart-Allmaras. DNS ist kein Turbulenzmodell sondern eine vollständige Auflösung.' },
  ],

  /* ════════════════════════════════════════════════════════════════
     UNIT 13  →  turb-kw-sst
     ════════════════════════════════════════════════════════════════ */
  'turb-kw-sst': [
    { id: 'vl-13-02', type: 'single-choice', tag: 'vorlesung',
      question: 'Was ist der Hauptvorteil des $k$-$\\omega$ SST-Modells (Menter)?',
      options: [
        'Kombination von $k$-$\\omega$ wandnah (robust, kein Wandfunktionszwang) und $k$-$\\varepsilon$ in der freien Strömung (stabil)',
        'Es ist das einfachste Turbulenzmodell',
        'Es löst alle Turbulenzskalen auf',
        'Es braucht keine Randbedingungen',
      ],
      correctIndex: 0,
      explanation: 'SST Blending: $k$-$\\omega$ (robust wandnah, gut für $y^+ < 1$) + $k$-$\\varepsilon$ (stabil in der freien Strömung). Plus Shear-Stress-Transport-Limiter für bessere APG-Performance.' },

    { id: 'vl-13-03', type: 'single-choice', tag: 'vorlesung',
      question: 'Was unterscheidet $k$-$\\omega$ von $k$-$\\varepsilon$?',
      options: [
        '$\\omega = \\varepsilon/k$ ist die spezifische Dissipationsrate — $k$-$\\omega$ integriert direkt bis zur Wand ohne Wandfunktionen',
        'Kein Unterschied — gleiche Gleichungen',
        '$k$-$\\omega$ hat keine Diffusionsterme',
        '$k$-$\\omega$ braucht immer Wandfunktionen',
      ],
      correctIndex: 0,
      explanation: '$\\omega = \\varepsilon / (C_\\mu k)$. $k$-$\\omega$ ist wandnah besser (natürliche Randbedingung $\\omega_w$), aber sensibel auf $\\omega$-Freestream-Werte. SST kombiniert die Vorteile.' },
  ],

  /* ════════════════════════════════════════════════════════════════
     UNIT 12  →  turb-wall (Wandbehandlung)
     ════════════════════════════════════════════════════════════════ */
  'turb-wall': [
    { id: 'vl-12-09', type: 'formula-select', tag: 'vorlesung',
      question: 'Wie ist $y^+$ (dimensionsloser Wandabstand) definiert?',
      options: [
        '$y^+ = \\frac{y \\cdot u_\\tau}{\\nu}$ mit $u_\\tau = \\sqrt{\\tau_w / \\rho}$',
        '$y^+ = y / \\Delta x$',
        '$y^+ = Re \\cdot y / L$',
        '$y^+ = y \\cdot \\omega$',
      ],
      correctIndex: 0,
      explanation: '$y^+ = y u_\\tau / \\nu$ mit Schubspannungsgeschwindigkeit $u_\\tau = \\sqrt{\\tau_w / \\rho}$. Wichtig für Wandmodellierung: $y^+ < 1$ für Low-Re, $30 < y^+ < 300$ für Wandfunktionen.' },

    { id: 'vl-12-10', type: 'single-choice', tag: 'vorlesung',
      question: 'Was beschreibt das logarithmische Wandgesetz?',
      options: [
        '$u^+ = \\frac{1}{\\kappa} \\ln(y^+) + B$ im Bereich $30 < y^+ < 300$ (log-law)',
        'Ein universelles Profil für die freie Strömung',
        'Die Druckverteilung an der Wand',
        'Die Temperaturverteilung im Kern',
      ],
      correctIndex: 0,
      explanation: 'Log-law: $u^+ = (1/\\kappa) \\ln y^+ + B$ mit $\\kappa \\approx 0{,}41$, $B \\approx 5{,}2$. Gilt in der Log-Schicht ($30 < y^+ < 300$). Viskose Unterschicht: $u^+ = y^+$ ($y^+ < 5$).' },

    { id: 'vl-12-11', type: 'true-false', tag: 'vorlesung',
      question: 'Wahr oder falsch?',
      statement: 'Wandfunktionen ersetzen die direkte Auflösung der viskosen Unterschicht und erlauben gröbere Gitter in Wandnähe.',
      correct: true,
      explanation: 'Korrekt — Wandfunktionen überbrücken die viskose Unterschicht ($y^+ < 5$). Erste Zelle bei $y^+ \\approx 30$–$100$ statt $y^+ < 1$. Spart Gitterzellen, aber unpräziser bei Ablösung.' },
  ],

  /* ════════════════════════════════════════════════════════════════
     UNIT 14 — LES  →  turb-les
     ════════════════════════════════════════════════════════════════ */
  'turb-les': [
    { id: 'vl-14-01', type: 'single-choice', tag: 'vorlesung',
      question: 'Was ist die Grundidee der Large Eddy Simulation (LES)?',
      options: [
        'Große, energietragende Wirbel direkt auflösen; kleine, universelle Wirbel modellieren (SGS-Modell)',
        'Alle Turbulensskalen modellieren (wie RANS)',
        'Alle Skalen bis zur Kolmogorov-Skala auflösen (wie DNS)',
        'Nur die mittlere Strömung berechnen',
      ],
      correctIndex: 0,
      explanation: 'LES: Filterung der NS-Gleichungen. Große Wirbel (resolved) direkt simuliert, kleine Wirbel (subgrid-scale, SGS) modelliert. Kompromiss zwischen DNS und RANS.' },

    { id: 'vl-14-02', type: 'single-choice', tag: 'vorlesung',
      question: 'Was ist das Smagorinsky-Modell?',
      options: [
        'SGS-Modell mit $\\nu_{\\text{SGS}} = (C_S \\Delta)^2 |\\bar{S}|$ — algebraisches Wirbelviskositätsmodell',
        'Ein RANS-Zweigleichungsmodell',
        'Ein Wandfunktionsmodell',
        'Eine DNS-Methode',
      ],
      correctIndex: 0,
      explanation: 'Smagorinsky: $\\nu_{\\text{SGS}} = (C_S \\Delta)^2 |\\bar{S}|$ mit $C_S \\approx 0{,}1$–$0{,}2$, $\\Delta$ = Filterlänge (~ Zellgröße). Einfach, aber zu dissipativ in Wandnähe. Dynamische Variante passt $C_S$ an.' },

    { id: 'vl-14-03', type: 'true-false', tag: 'vorlesung',
      question: 'Wahr oder falsch?',
      statement: 'In LES ist die Gitterauflösung direkt der implizite Filter — das Gitter bestimmt, welche Wirbel aufgelöst werden.',
      correct: true,
      explanation: 'Korrekt — bei implizitem Filtern (üblich in FVM-LES) definiert die Zellgröße $\\Delta$ den Cutoff. Feineres Gitter → mehr aufgelöste Turbulenz, weniger Modellierung.' },

    { id: 'vl-14-04', type: 'multi-select', tag: 'vorlesung',
      question: 'Welche Anforderungen hat LES im Vergleich zu RANS?',
      options: [
        'Deutlich feinere Gitter (v.a. wandnah)',
        'Instationäre Rechnung zwingend (3D, zeitaufgelöst)',
        'Statistik über lange Zeitserien nötig',
        'Kann mit 2D-Gittern und stationärem Solver berechnet werden',
      ],
      correctIndices: [0, 1, 2],
      explanation: 'LES: 3D + instationär zwingend, feinere Gitter (große Wirbel auflösen), Zeitstatistik nötig. 2D und stationär sind für LES nicht möglich.' },

    { id: 'vl-14-05', type: 'single-choice', tag: 'vorlesung',
      question: 'Was sind hybride RANS-LES-Methoden (z.B. DES)?',
      options: [
        'RANS in Wandnähe, LES in der freien Strömung — reduziert Gitteranforderungen',
        'Nur RANS überall',
        'Nur LES überall',
        'DNS in Wandnähe, RANS außen',
      ],
      correctIndex: 0,
      explanation: 'DES (Detached Eddy Simulation): RANS in der Grenzschicht (spart Gitter), LES in abgelösten Bereichen (gute Auflösung). Übergangszone kann problematisch sein (Grey Area).' },
  ],

  /* ════════════════════════════════════════════════════════════════
     UNIT 15 — Zweiphasenströmungen  →  twophase-intro
     ════════════════════════════════════════════════════════════════ */
  'twophase-intro': [
    { id: 'vl-15-01', type: 'multi-select', tag: 'vorlesung',
      question: 'Welche Ansätze gibt es für Zweiphasenströmungen in CFD?',
      options: [
        'Euler-Euler (beide Phasen als Kontinuum, Volumenanteile)',
        'Euler-Lagrange (Kontinuum + Partikelbahnen)',
        'Interface-Tracking/Capturing (VOF, Level-Set)',
        'Nur Ein-Phasen-Solver verwenden',
      ],
      correctIndices: [0, 1, 2],
      explanation: 'Zweiphasen-CFD: Euler-Euler (Kontinuum+Kontinuum), Euler-Lagrange (Fluid+Partikel), Interface-Capturing (VOF/Level-Set für scharfe Phasengrenzen).' },

    { id: 'vl-15-02', type: 'single-choice', tag: 'vorlesung',
      question: 'Was ist der Volumenanteil $\\alpha$ in Zweiphasenströmungen?',
      options: [
        'Anteil einer Phase am Zellvolumen: $\\alpha \\in [0, 1]$, mit $\\alpha_1 + \\alpha_2 = 1$',
        'Die Dichte der zweiten Phase',
        'Der Druckunterschied zwischen den Phasen',
        'Die Turbulenzintensität',
      ],
      correctIndex: 0,
      explanation: '$\\alpha$ = lokaler Volumenanteil. $\\alpha = 1$: reine Phase 1, $\\alpha = 0$: reine Phase 2. Interface bei $0 < \\alpha < 1$. Gemischte Stoffeigenschaften: $\\rho = \\alpha \\rho_1 + (1-\\alpha) \\rho_2$.' },
  ],

  /* ════════════════════════════════════════════════════════════════
     UNIT 15  →  twophase-vof
     ════════════════════════════════════════════════════════════════ */
  'twophase-vof': [
    { id: 'vl-15-03', type: 'single-choice', tag: 'vorlesung',
      question: 'Was ist die VOF-Methode (Volume of Fluid)?',
      options: [
        'Transportgleichung für den Volumenanteil $\\alpha$: $\\partial \\alpha / \\partial t + \\nabla \\cdot (\\alpha \\mathbf{u}) = 0$',
        'Eine Lagrangesche Partikelmethode',
        'Direkte Auflösung der Moleküle',
        'Ein Turbulenzmodell für Blasen',
      ],
      correctIndex: 0,
      explanation: 'VOF: Advektionsgleichung für $\\alpha$. Konserviert Masse inherent. Interface nicht explizit verfolgt, sondern aus $\\alpha$-Feld rekonstruiert.' },

    { id: 'vl-15-04', type: 'true-false', tag: 'vorlesung',
      question: 'Wahr oder falsch?',
      statement: 'VOF ist massenkonservativ, kann aber das Interface verschmieren (numerical diffusion).',
      correct: true,
      explanation: 'Korrekt — VOF ist konservativ (integral $\\alpha$ bleibt erhalten), aber Standard-Advektionsschemata verschmieren das Interface. Geometrische Rekonstruktion (PLIC) oder algebraische Methoden (CICSAM) helfen.' },

    { id: 'vl-15-05', type: 'single-choice', tag: 'vorlesung',
      question: 'Was ist PLIC (Piecewise Linear Interface Calculation)?',
      options: [
        'Geometrische Rekonstruktion des Interface als ebene Fläche pro Zelle für scharfe VOF-Advection',
        'Ein Turbulenzmodell',
        'Eine Zeitintegrationsmethode',
        'Ein Gittergenerierungsalgorithmus',
      ],
      correctIndex: 0,
      explanation: 'PLIC: Interface wird als ebene Fläche pro Zelle approximiert, basierend auf $\\alpha$ und $\\nabla \\alpha$. Erzeugt scharfe Interfaces bei VOF-Advection.' },
  ],

  /* ════════════════════════════════════════════════════════════════
     UNIT 15  →  twophase-levelset
     ════════════════════════════════════════════════════════════════ */
  'twophase-levelset': [
    { id: 'vl-15-06', type: 'single-choice', tag: 'vorlesung',
      question: 'Was ist die Level-Set-Methode?',
      options: [
        'Vorzeichenbehaftete Abstandsfunktion $\\phi$: Interface bei $\\phi = 0$, $\\phi > 0$ in Phase 1, $\\phi < 0$ in Phase 2',
        'Eine VOF-Variante',
        'Ein Gittertyp',
        'Eine Randbedingung',
      ],
      correctIndex: 0,
      explanation: 'Level-Set: $\\phi(\\mathbf{x}, t)$ = signed distance. Interface: $\\phi = 0$. Glatt → einfache Krümmung $\\kappa = -\\nabla \\cdot (\\nabla \\phi / |\\nabla \\phi|)$. Nachteil: nicht automatisch massenkonservativ.' },

    { id: 'vl-15-07', type: 'single-choice', tag: 'vorlesung',
      question: 'Was ist der Hauptnachteil von Level-Set gegenüber VOF?',
      options: [
        'Keine automatische Massenerhaltung — Reinitialisierung kann Masse verlieren',
        'Schlechtere Krümmungsberechnung',
        'Nicht anwendbar auf 3D',
        'Braucht unstrukturierte Gitter',
      ],
      correctIndex: 0,
      explanation: 'Level-Set: $\\phi$-Advection + Reinitialisierung (signed distance) kann Masse verlieren. VOF ist konservativ. Hybrid CLSVOF kombiniert Vorteile beider.' },
  ],

  /* ════════════════════════════════════════════════════════════════
     UNIT 15  →  twophase-surface-tension
     ════════════════════════════════════════════════════════════════ */
  'twophase-surface-tension': [
    { id: 'vl-15-08', type: 'formula-select', tag: 'vorlesung',
      question: 'Wie berechnet sich die Weber-Zahl?',
      options: [
        '$We = \\frac{\\rho u^2 L}{\\sigma}$ — Verhältnis Trägheit zu Oberflächenspannung',
        '$We = \\frac{\\mu u}{\\sigma}$',
        '$We = \\frac{u}{a}$',
        '$We = \\frac{\\rho u L}{\\mu}$',
      ],
      correctIndex: 0,
      explanation: 'Weber-Zahl: $We = \\rho u^2 L / \\sigma$. Trägheitskräfte vs. Oberflächenspannung. Großes $We$ → Tropfen/Blasen zerfallen, kleines $We$ → Oberflächenspannung dominiert.' },

    { id: 'vl-15-09', type: 'single-choice', tag: 'vorlesung',
      question: 'Was ist der Laplace-Drucktest?',
      options: [
        'Statische Blase: prüft ob der Drucksprung $\\Delta p = \\sigma / R$ (2D) korrekt reproduziert wird',
        'Ein Turbulenztest',
        'Ein Geschwindigkeitstest an der Wand',
        'Test der Zeitschrittgröße',
      ],
      correctIndex: 0,
      explanation: 'Laplace-Test: Ruhende Blase/Tropfen → $\\Delta p = \\sigma/R$ (2D) oder $2\\sigma/R$ (3D). Testet Krümmungsberechnung und Parasitic Currents.' },
  ],

  /* ════════════════════════════════════════════════════════════════
     UNIT 06 — Konvektion-Diffusion  →  convdiff-1d / convdiff-peclet-effect
     ════════════════════════════════════════════════════════════════ */
  'convdiff-1d': [
    { id: 'vl-06-14', type: 'single-choice', tag: 'vorlesung',
      question: 'Was ist der Zusammenhang zwischen integraler und differentieller Form der Erhaltungsgleichungen?',
      options: [
        'Integral → Differential: Divergenzsatz + „$V$ beliebig". Differential → Integral: Integration + Divergenzsatz rückwärts.',
        'Es gibt keinen Zusammenhang',
        'Nur die Integralform existiert',
        'Beide sind identisch ohne Umrechnung',
      ],
      correctIndex: 0,
      explanation: 'Integral ↔ Differential über Divergenzsatz (Gauß). „$V$ beliebig" erlaubt den Übergang zum Integranden = 0 (differentielle Form).' },

    // u06-q017 — Gas/Flüssigkeit/Festkörper
    { id: 'vl-06-17', type: 'single-choice', tag: 'vorlesung',
      question: 'Was ist der Hauptunterschied der Erhaltungsgleichungen zwischen Gas und Flüssigkeit?',
      options: [
        'Gas: oft kompressibel ($\\rho$ variabel, EOS nötig, Energiegleichung). Flüssigkeit: oft inkompressibel ($\\rho \\approx \\text{const}$, $\\nabla \\cdot \\mathbf{u} = 0$).',
        'Kein Unterschied — gleiche Gleichungen immer',
        'Für Gase gelten keine Erhaltungssätze',
        'Flüssigkeiten haben keine Viskosität',
      ],
      correctIndex: 0,
      explanation: 'Gas: $\\rho$ variabel → EOS ($p = \\rho R T$) und Energiegleichung nötig. Flüssigkeit: meist $\\rho \\approx \\text{const}$ → $\\nabla \\cdot \\mathbf{u} = 0$, Energie nur bei Wärmeübertragung.' },
  ],

  'convdiff-peclet-effect': [
    // u05-q015b — Vergleich Schemata
    { id: 'vl-05-15b', type: 'multi-select', tag: 'vorlesung',
      question: 'Welche Aussagen über Konvektionsschemata sind korrekt?',
      options: [
        'UDS: 1. Ordnung, monoton, stark diffusiv',
        'CDS: 2. Ordnung, unbounded bei $|Pe_D| > 2$',
        'TVD: 2. Ordnung in glatten Bereichen, monoton an Fronten',
        'WENO: nur für 1D geeignet',
      ],
      correctIndices: [0, 1, 2],
      explanation: 'UDS: diffusiv aber robust. CDS: genau aber unbounded. TVD: bester Kompromiss. WENO ist hochgenau und auch für 2D/3D geeignet.' },
  ],

  /* ════════════════════════════════════════════════════════════════
     UNIT 07  →  fvm-1d-convection
     ════════════════════════════════════════════════════════════════ */
  'fvm-1d-convection': [
    // u07-q004 — Flüsse am Zellrand
    { id: 'vl-07-04', type: 'single-choice', tag: 'vorlesung',
      question: 'Wie berechnet man den Gesamtfluss über ein Face $e$ in der FVM?',
      options: [
        '$F_e = \\underbrace{(\\rho u_n)_e \\phi_e A_e}_{\\text{konvektiv}} + \\underbrace{(-\\Gamma_e (\\nabla\\phi \\cdot \\mathbf{n})_e A_e)}_{\\text{diffusiv}}$',
        '$F_e = \\phi_P \\cdot A_e$',
        '$F_e = \\rho_P u_P$',
        '$F_e = 0$ (Flüsse an Faces sind immer null)',
      ],
      correctIndex: 0,
      explanation: 'Face-Fluss = konvektiver + diffusiver Anteil. Konvektiv: Massenfluss × Face-Wert. Diffusiv: $-\\Gamma (\\nabla \\phi \\cdot \\mathbf{n}) A$.' },

    // u07-q011 — Upwind Flüsse
    { id: 'vl-07-11', type: 'single-choice', tag: 'vorlesung',
      question: 'Bei Upwind-Diskretisierung: welchen Wert nimmt $\\phi_e$ an, wenn $u_n > 0$ (Fluss von P nach E)?',
      options: [
        '$\\phi_e = \\phi_P$ (Wert aus der Upwind-Zelle)',
        '$\\phi_e = \\phi_E$',
        '$\\phi_e = (\\phi_P + \\phi_E) / 2$',
        '$\\phi_e = 0$',
      ],
      correctIndex: 0,
      explanation: 'Upwind: $\\phi_e$ kommt aus der Zelle, aus der der Fluss stammt. Bei $u_n > 0$: Fluss von P → E, also $\\phi_e = \\phi_P$. Bei $u_n < 0$: $\\phi_e = \\phi_E$.' },

    // u07-q006 — UDS vs CDS Koeffizienten
    { id: 'vl-07-06', type: 'true-false', tag: 'vorlesung',
      question: 'Wahr oder falsch?',
      statement: 'Bei CDS können negative Koeffizienten in der FVM-Diskretisierung auftreten, wenn $|Pe_D| > 2$.',
      correct: true,
      explanation: 'Korrekt — CDS: $a_E = D - F/2$. Wenn $F > 2D$ (d.h. $|Pe_D| > 2$), wird $a_E < 0$. Verlust der Diagonaldominanz → Oszillationen/Unboundedness.' },
  ],

  /* ════════════════════════════════════════════════════════════════
     UNIT 08  →  2d-grid
     ════════════════════════════════════════════════════════════════ */
  '2d-grid': [
    { id: 'vl-08-06', type: 'single-choice', tag: 'vorlesung',
      question: 'Was ist der Vorteil eines unstrukturierten Gitters?',
      options: [
        'Hohe Flexibilität bei komplexen Geometrien — automatische Vernetzung möglich',
        'Einfachere Datenstruktur als strukturiert',
        'Immer höhere Genauigkeit',
        'Schnellere Löser',
      ],
      correctIndex: 0,
      explanation: 'Unstrukturiert: beliebige Zellformen (Tet, Poly), automatische Vernetzung, flexible Verfeinerung. Nachteil: indirekte Adressierung, höherer Speicher-/Rechenaufwand.' },

    { id: 'vl-08-07', type: 'true-false', tag: 'vorlesung',
      question: 'Wahr oder falsch?',
      statement: 'Polyheder-Zellen können in unstrukturierten Gittern weniger numerische Diffusion erzeugen als Tetraeder, da sie mehr Nachbarn haben.',
      correct: true,
      explanation: 'Korrekt — Polyheder haben mehr Faces/Nachbarn → bessere Gradientenapproximation, geringere numerische Diffusion im Vergleich zu Tetraedern bei gleicher Zellanzahl.' },

    { id: 'vl-08-08', type: 'single-choice', tag: 'vorlesung',
      question: 'Was beschreibt $y^+$ im Kontext der Gitteranforderungen?',
      options: [
        'Dimensionsloser Wandabstand der ersten Zelle — bestimmt ob Wandfunktionen oder direkte Wandauflösung nötig sind',
        'Die Gitterqualität gesamt',
        'Den maximalen Zeitschritt',
        'Die Ordnung des Schemas',
      ],
      correctIndex: 0,
      explanation: '$y^+ = y u_\\tau / \\nu$. Für Low-Re (direkte Wandauflösung): $y^+ < 1$. Für Wandfunktionen: $30 < y^+ < 300$. Dazwischen: „Buffer-Layer" — vermeiden!' },
  ],

  /* ════════════════════════════════════════════════════════════════
     UNIT 06 — Cavity  →  incomp-cavity
     ════════════════════════════════════════════════════════════════ */
  'incomp-cavity': [
    { id: 'vl-06-27', type: 'single-choice', tag: 'vorlesung',
      question: 'Was ergibt die Diskretisierung der 2D-Euler-Gleichungen (explizit)?',
      options: [
        'Flussdifferenzen pro Zelle: $(\\rho u)^{n+1} = (\\rho u)^n - (\\Delta t/\\Delta x)(F^n_{i+1/2} - F^n_{i-1/2}) - (\\Delta t/\\Delta y)(G^n_{j+1/2} - G^n_{j-1/2})$',
        'Eine tridiagonale Matrix',
        'Keine Gleichung — Euler ist analytisch lösbar',
        'Ein 3D-Gleichungssystem',
      ],
      correctIndex: 0,
      explanation: 'Explizite Euler-Diskretisierung: Konservative Flussdifferenzen in $x$ ($F = \\rho u^2 + p, \\rho uv$) und $y$ ($G = \\rho uv, \\rho v^2 + p$). Druckterm $p$ im Fluss nicht vergessen!' },
  ],
};
