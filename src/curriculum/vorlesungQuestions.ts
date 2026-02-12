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

/* ════════════════════════════════════════════════════════════════════════
   ADDITIONAL VORLESUNG QUESTIONS  (remaining ~80 catalog questions)
   Merged into vorlesungExtras below.
   ════════════════════════════════════════════════════════════════════════ */

const _additional: Record<string, QuizQuestion[]> = {

  /* ── UNIT 04 extras ─────────────────────────────────────── */
  'stability-cfl': [
    // u04-q003
    { id: 'vl2-04-q003', type: 'multi-select', tag: 'vorlesung',
      question: 'Welche Aussagen über explizites und implizites Euler-Verfahren im Funktionsgraph sind korrekt?',
      options: [
        'Explizit Euler nutzt die Tangente am Punkt $(t^n, \\varphi^n)$ und projiziert vorwärts',
        'Implizit Euler nutzt die (unbekannte) Steigung bei $(t^{n+1}, \\varphi^{n+1})$',
        'Beide Verfahren legen die Tangente am selben Punkt an',
        'Implizit ist stabiler, aber nicht automatisch genauer als explizit',
        'Explizit Euler verwendet eine Sekante statt einer Tangente',
      ],
      correctIndices: [0, 1, 3],
      explanation: 'Explizit Euler: Tangente bei $t^n$ → vorwärts projizieren. Implizit Euler: Tangente bei $t^{n+1}$ → Gerade von $(t^n,\\varphi^n)$ muss diese Steigung konsistent erfüllen. Implizit ist robuster/stabiler bei steifen Problemen, aber nicht automatisch genauer.' },
    // u04-q007
    { id: 'vl2-04-q007a', type: 'multi-select', tag: 'vorlesung',
      question: 'Was muss bei expliziten Verfahren berücksichtigt werden?',
      options: [
        '$\\Delta t$ muss CFL-Kriterium erfüllen (CFL $\\leq O(1)$)',
        'Diffusionszahl $\\text{Fo} = \\alpha \\Delta t / \\Delta x^2$ hat Grenzwert',
        'Feine Netze/hohe Geschwindigkeiten erfordern kleine $\\Delta t$',
        '$\\Delta t$ kann beliebig groß gewählt werden',
        'Pro Zeitschritt muss ein lineares Gleichungssystem gelöst werden',
      ],
      correctIndices: [0, 1, 2],
      explanation: 'Explizite Verfahren: $\\Delta t$ durch CFL und Fourier-Zahl begrenzt. Feine Netze → kleinere Zeitschritte. Dafür ist der Update pro Schritt sehr einfach (kein Gleichungssystem).' },
    { id: 'vl2-04-q007b', type: 'multi-select', tag: 'vorlesung',
      question: 'Was ändert sich bei impliziten Verfahren gegenüber expliziten?',
      options: [
        'Stabilitätslimit stark erweitert (oft unbedingte Stabilität für Diffusion)',
        'Größere $\\Delta t$ möglich',
        'Pro Zeitschritt muss ein Gleichungssystem gelöst werden',
        'Genauigkeitsanforderung an $\\Delta t$ entfällt komplett',
        'Konvergenzkontrolle pro Zeitschritt (inner iterations) erforderlich',
      ],
      correctIndices: [0, 1, 2, 4],
      explanation: 'Implizit: größere $\\Delta t$ möglich und bessere Stabilität, aber pro Schritt ein (lineares/nichtlineares) Gleichungssystem lösen. Genauigkeitsanforderung bleibt — zu großes $\\Delta t$ verschmiert Transienten.' },
  ],

  /* ── UNIT 05 extras ─────────────────────────────────────── */
  'basics-discretization-idea': [
    // u05-q001
    { id: 'vl2-05-q001', type: 'multi-select', tag: 'vorlesung',
      question: 'Was bedeutet Diskretisierung für die Lösung einer Transportgleichung?',
      options: [
        'Kontinuierliche PDE wird auf endliches Gitter übertragen',
        'Differentialoperatoren werden durch Approximationen ersetzt (Stencils)',
        'Aus der PDE entsteht ein algebraisches Gleichungssystem $A\\varphi = b$',
        'Trunkationsfehler $O(\\Delta x^p)$ tritt auf',
        'Die exakte analytische Lösung wird direkt berechnet',
        'Knotenwerte und Zellmittelwerte sind das gleiche',
      ],
      correctIndices: [0, 1, 2, 3],
      explanation: 'Diskretisierung überführt eine PDE in ein algebraisches Gleichungssystem. Unbekannte sind an diskreten Orten gespeichert, Ableitungen durch Stencils approximiert. Trunkationsfehler $O(\\Delta x^p)$ bestimmt Genauigkeit.' },
  ],

  'fdm-taylor': [
    // u05-q006
    { id: 'vl2-05-q006', type: 'formula-select', tag: 'vorlesung',
      question: 'Wie lautet die Vorwärtsdifferenz (FDS) für $\\varphi\'_i$, hergeleitet aus der Taylorreihe?',
      formula: '$\\varphi_{i+1} = \\varphi_i + \\Delta x\\,\\varphi\'_i + \\frac{\\Delta x^2}{2}\\varphi\'\'_i + \\ldots$',
      options: [
        '$\\varphi\'_i = \\frac{\\varphi_{i+1} - \\varphi_i}{\\Delta x} + O(\\Delta x)$ — Ordnung $p=1$',
        '$\\varphi\'_i = \\frac{\\varphi_{i+1} - \\varphi_{i-1}}{2\\Delta x} + O(\\Delta x^2)$ — Ordnung $p=2$',
        '$\\varphi\'_i = \\frac{\\varphi_i - \\varphi_{i-1}}{\\Delta x} + O(\\Delta x)$ — Ordnung $p=1$',
        '$\\varphi\'_i = \\frac{\\varphi_{i+1} - 2\\varphi_i + \\varphi_{i-1}}{\\Delta x^2}$ — Ordnung $p=2$',
      ],
      correctIndex: 0,
      explanation: 'FDS: Aus Taylor-Reihe nach $\\varphi\'_i$ umstellen: $\\varphi\'_i = (\\varphi_{i+1}-\\varphi_i)/\\Delta x - (\\Delta x/2)\\varphi\'\' + \\ldots$ ⇒ Ordnung $p=1$. Die zweite Option ist CDS ($p=2$), die dritte BDS ($p=1$).' },
    // u05-q008
    { id: 'vl2-05-q008', type: 'single-choice', tag: 'vorlesung',
      question: 'Welche Konvergenzordnung hat die zentrale Differenz (CDS) für die erste Ableitung?',
      options: [
        '$p = 1$ — führender Fehler $\\propto \\Delta x$',
        '$p = 2$ — führender Fehler $\\propto \\Delta x^2$',
        '$p = 3$ — führender Fehler $\\propto \\Delta x^3$',
        '$p = 0$ — kein konsistenter Approximationsfehler',
      ],
      correctIndex: 1,
      explanation: 'CDS: $\\varphi\'_i = (\\varphi_{i+1}-\\varphi_{i-1})/(2\\Delta x)$. Durch Symmetrie fallen die ungeraden Fehlerterme heraus, der führende Fehler ist $\\propto \\Delta x^2$, also $p=2$. FDS/BDS haben nur $p=1$.' },
  ],

  'fdm-stencils': [
    // u05-q010
    { id: 'vl2-05-q010', type: 'formula-select', tag: 'vorlesung',
      question: 'Wie lautet die Differenzenformel für $\\partial^2\\varphi/\\partial y^2$ auf einem äquidistanten kartesischen Netz?',
      options: [
        '$\\frac{\\varphi_{i,j+1} - 2\\varphi_{i,j} + \\varphi_{i,j-1}}{(\\Delta y)^2}$',
        '$\\frac{\\varphi_{i+1,j} - 2\\varphi_{i,j} + \\varphi_{i-1,j}}{(\\Delta x)^2}$',
        '$\\frac{\\varphi_{i,j+1} - \\varphi_{i,j-1}}{2\\Delta y}$',
        '$\\frac{\\varphi_{i+1,j+1} - \\varphi_{i-1,j-1}}{4\\Delta x \\Delta y}$',
      ],
      correctIndex: 0,
      explanation: 'Zweite Ableitung in $y$-Richtung: Zentrale Differenz 2. Ordnung mit Nachbarn $(i,j\\pm1)$, geteilt durch $(\\Delta y)^2$. Option 2 wäre $\\partial^2/\\partial x^2$, Option 3 ist die erste Ableitung.' },
    // u05-q018
    { id: 'vl2-05-q018', type: 'multi-select', tag: 'vorlesung',
      question: 'Welche Methoden können zur Herleitung von Approximationen für zweite Ableitungen verwendet werden?',
      options: [
        'Taylorreihenansatz: $\\varphi_{i\\pm1}$ entwickeln und addieren',
        'Polynom-Fitting: Interpolationspolynom durch Stützstellen legen und zweimal ableiten',
        'FVM-Flux-Ansatz: Differenz der diffusen Flüsse an Zellflächen',
        'Nur die erste Ableitung zweimal hintereinander berechnen (immer identisch)',
        'Geisterzellen für Randnähe verwenden',
      ],
      correctIndices: [0, 1, 2, 4],
      explanation: 'Zweite Ableitungen: Taylor-Ansatz (addiere $\\varphi_{i+1}+\\varphi_{i-1}$), Polynom-Fitting, FVM-Flux-Differenz, und Geisterzellen am Rand. Das bloße zweimalige Anwenden der 1. Ableitung ist nicht identisch mit der korrekten 2. Ableitung.' },
  ],

  /* ── UNIT 06 extras → incomp-ns ─────────────────────────── */
  'incomp-ns': [
    // u06-q002
    { id: 'vl2-06-q002', type: 'multi-select', tag: 'vorlesung',
      question: 'Welche sind wesentliche Schritte bei der Herleitung der Impulserhaltungsgleichung?',
      options: [
        'Newton II auf Kontrollvolumen anwenden: $d/dt\\int_V \\rho\\mathbf{u}\\,dV + \\oint_A \\rho\\mathbf{u}(\\mathbf{u}\\cdot\\mathbf{n})\\,dA = \\Sigma F$',
        'Kräfte aufteilen: Druck ($-p\\mathbf{n}$), viskose Spannungen ($\\boldsymbol{\\tau}\\cdot\\mathbf{n}$), Volumenkräfte ($\\rho\\mathbf{f}$)',
        'Divergenzsatz anwenden: $\\oint (\\ldots)\\cdot\\mathbf{n}\\,dA \\to \\int \\nabla\\cdot(\\ldots)\\,dV$',
        'Ergebnis: $\\partial(\\rho\\mathbf{u})/\\partial t + \\nabla\\cdot(\\rho\\mathbf{u}\\otimes\\mathbf{u}) = -\\nabla p + \\nabla\\cdot\\boldsymbol{\\tau} + \\rho\\mathbf{f}$',
        'Energieerhaltung ist identisch mit Impulserhaltung',
      ],
      correctIndices: [0, 1, 2, 3],
      explanation: 'Impulserhaltung: Reynolds-Transport-Theorem + Kräfteaufteilung (Druck, viskos, Volumenkräfte) + Divergenzsatz → differentielle konservative Form. Energieerhaltung ist eine separate Gleichung.' },
    // u06-q006
    { id: 'vl2-06-q006', type: 'single-choice', tag: 'vorlesung',
      question: 'Was bedeuten die Indizes $x$ und $y$ in der Schubspannung $\\tau_{xy}$?',
      options: [
        '$x$ = Richtung der Kraftkomponente, $y$ = Richtung der Flächennormalen',
        '$x$ = Richtung der Flächennormalen, $y$ = Richtung der Kraftkomponente',
        'Beide Indizes bezeichnen die Ebene, in der die Spannung wirkt',
        '$\\tau_{xy}$ ist eine Normalspannung, keine Schubspannung',
      ],
      correctIndex: 0,
      explanation: '$\\tau_{ij}$: $i$ = Richtung der Spannungs-/Kraftkomponente, $j$ = Richtung der Flächennormalen. Also $\\tau_{xy}$: $x$-Kraftkomponente auf einer Fläche mit $y$-Normale.' },
    // u06-q008
    { id: 'vl2-06-q008', type: 'single-choice', tag: 'vorlesung',
      question: 'Welche Schubspannungskomponente wirkt in $x$-Richtung auf einer $x$-$y$-Ebene (Normale in $z$)?',
      options: [
        '$\\tau_{xz} = \\mu(\\partial u/\\partial z + \\partial w/\\partial x)$',
        '$\\tau_{xy} = \\mu(\\partial u/\\partial y + \\partial v/\\partial x)$',
        '$\\tau_{xx} = 2\\mu\\,\\partial u/\\partial x$',
        '$\\tau_{yz} = \\mu(\\partial v/\\partial z + \\partial w/\\partial y)$',
      ],
      correctIndex: 0,
      explanation: 'Die $x$-$y$-Ebene hat Normale in $z$-Richtung. Die Schubspannung in $x$-Richtung auf dieser Fläche ist $\\tau_{xz} = \\mu(\\partial u/\\partial z + \\partial w/\\partial x)$.' },
    // u06-q009
    { id: 'vl2-06-q009', type: 'single-choice', tag: 'vorlesung',
      question: 'Warum können quadratische Terme der Taylor-Entwicklung in der Herleitung der Navier-Stokes-Gleichungen vernachlässigt werden?',
      options: [
        'Im Grenzprozess $\\Delta\\to 0$ werden $O(\\Delta x^2)$-Terme gegenüber $O(\\Delta x)$-Beiträgen vernachlässigbar',
        'Die quadratischen Terme sind physikalisch irrelevant',
        'Sie canceln sich exakt gegenseitig',
        'Sie sind identisch mit den linearen Termen',
      ],
      correctIndex: 0,
      explanation: 'Bei infinitesimalem KV werden Flussdifferenzen durch Volumen geteilt. Terme $O(\\Delta x^2)$ verschwinden im Grenzprozess $\\Delta\\to 0$ gegenüber den linearen Beiträgen. Nur 1. Ordnung-Ableitungen bleiben.' },
    // u06-q011
    { id: 'vl2-06-q011', type: 'multi-select', tag: 'vorlesung',
      question: 'Welche Schritte gehören zur Herleitung der differentiellen Energiegleichung?',
      options: [
        '1. Hauptsatz auf KV: Änderungsrate der Gesamtenergie = Wärme + mech. Leistung',
        'Reynolds-Transport-Theorem auf $\\rho E$ anwenden',
        'Oberflächenbeiträge: Wärmeleitung $-\\oint q\\cdot n\\,dA$, Druckarbeit, viskose Arbeit',
        'Divergenzsatz → $\\partial(\\rho E)/\\partial t + \\nabla\\cdot(\\rho\\mathbf{u}E) = -\\nabla\\cdot(p\\mathbf{u}) + \\nabla\\cdot(\\boldsymbol{\\tau}\\cdot\\mathbf{u}) - \\nabla\\cdot\\mathbf{q}$',
        'Energiegleichung ist identisch mit Impulsgleichung',
      ],
      correctIndices: [0, 1, 2, 3],
      explanation: 'Energiegleichung: 1. Hauptsatz + RTT auf $\\rho E$ + Oberflächen-/Volumenbeiträge + Divergenzsatz. Alternative Formen: innere Energie $e$ oder Enthalpie $h$.' },
    // u06-q012
    { id: 'vl2-06-q012', type: 'multi-select', tag: 'vorlesung',
      question: 'Welche Kräfte greifen am KV an und wie beeinflussen sie die Energiegleichung?',
      options: [
        'Druckkräfte → Druckarbeit $-\\nabla\\cdot(p\\mathbf{u})$',
        'Viskose Spannungen → viskose Arbeit/Dissipation $\\nabla\\cdot(\\boldsymbol{\\tau}\\cdot\\mathbf{u})$',
        'Volumenkräfte $\\rho\\mathbf{f}$ → Leistung $\\rho\\mathbf{f}\\cdot\\mathbf{u}$',
        'Wärmeleitung $-\\nabla\\cdot\\mathbf{q}$ (kein Kraftterm, aber Energiefluss)',
        'Wärmeleitung ist eine Kraft am KV',
      ],
      correctIndices: [0, 1, 2, 3],
      explanation: 'Oberflächen- und Volumenkräfte leisten Arbeit (Kraft × Geschwindigkeit). Wärmeleitung ist kein Kraftterm, sondern ein Energiefluss ($\\mathbf{q} = -k\\nabla T$).' },
    // u06-q013
    { id: 'vl2-06-q013', type: 'formula-select', tag: 'vorlesung',
      question: 'Wie lautet die konservative Skalartransportform der Energiegleichung für Enthalpie $h$?',
      options: [
        '$\\partial(\\rho h)/\\partial t + \\nabla\\cdot(\\rho\\mathbf{u}h) = \\nabla\\cdot(\\Gamma_h \\nabla h) + S_h$',
        '$\\partial h/\\partial t + \\mathbf{u}\\cdot\\nabla h = \\alpha \\nabla^2 h$',
        '$\\nabla^2 h = 0$ (Laplace-Gleichung)',
        '$\\partial(\\rho h)/\\partial t = -\\nabla p$',
      ],
      correctIndex: 0,
      explanation: 'Enthalpie $h$ als konservativer Skalar: $\\partial(\\rho h)/\\partial t + \\nabla\\cdot(\\rho\\mathbf{u}h) = \\nabla\\cdot(\\Gamma_h \\nabla h) + S_h$. Quellterme $S_h$: Dissipation $\\Phi$, Heizung $\\dot{q}_V$, bei kompressibel $Dp/Dt$.' },
    // u06-q019
    { id: 'vl2-06-q019', type: 'single-choice', tag: 'vorlesung',
      question: 'Was ist der Einfluss molekularer Bewegung auf den Impuls?',
      options: [
        'Molekulare Kollisionen erzeugen Impulsaustausch → Viskosität → diffusive Terme $\\nabla\\cdot\\boldsymbol{\\tau}$',
        'Molekularbewegung erzeugt eine zusätzliche Volumenkraft',
        'Molekularbewegung hat keinen Einfluss bei $Re > 1$',
        'Molekularbewegung erzeugt nur Wärmeleitung, keinen Impulsaustausch',
      ],
      correctIndex: 0,
      explanation: 'Molekulare Bewegung/Kollisionen → Impulsdiffusion → Viskosität. In den Impulsgleichungen erscheint dies als $\\nabla\\cdot\\boldsymbol{\\tau}$ (bei konstantem $\\mu$ inkompressibel: $\\mu\\nabla^2\\mathbf{u}$). Folgen: Grenzschichten, Reibung, Dissipation.' },
    // u06-q021
    { id: 'vl2-06-q021', type: 'multi-select', tag: 'vorlesung',
      question: 'Welche mikroskopischen Prozesse verursachen Reibung und Diffusion?',
      options: [
        'Thermische Molekularbewegung und Kollisionen',
        'Impulsaustausch → Viskosität/Reibung',
        'Energieaustausch → Wärmeleitung (Fourier)',
        'Stoffaustausch → molekulare Diffusion (Fick)',
        'Turbulente Wirbel (makroskopischer Effekt)',
      ],
      correctIndices: [0, 1, 2, 3],
      explanation: 'Reibung und Diffusion werden durch thermische Molekularbewegung und Kollisionen verursacht: Impulsaustausch (Viskosität), Energieaustausch (Wärmeleitung), Stoffaustausch (Fick). Turbulenz ist ein makroskopischer Effekt.' },
    // u06-q023
    { id: 'vl2-06-q023', type: 'single-choice', tag: 'vorlesung',
      question: 'Was ist die Ursache für Diffusionsprozesse (Reibung, Wärmeleitung) in einem Fluid?',
      options: [
        'Molekulare Zufallsbewegung und Kollisionen → Transport entlang von Gradienten',
        'Turbulente Wirbel erzeugen alle Diffusionsprozesse',
        'Konvektion ist die Hauptursache für Diffusion',
        'Diffusion tritt nur an Wänden auf',
      ],
      correctIndex: 0,
      explanation: 'Diffusion wird durch molekulare Zufallsbewegung und Kollisionen entlang von Gradienten getrieben: Geschwindigkeitsgradient → Impulsdiffusion (Reibung), Temperaturgradient → Wärmeleitung, Konzentrationsgradient → Massendiffusion. Irreversibler Prozess mit Entropieproduktion.' },
    // u06-q024
    { id: 'vl2-06-q024', type: 'multi-select', tag: 'vorlesung',
      question: 'Welche sind molekulare Transportprozesse in Gasen?',
      options: [
        'Viskosität (Impulsübertrag durch Molekülkollisionen)',
        'Wärmeleitung (Energieübertrag durch Molekülkollisionen)',
        'Speziesdiffusion in Gasgemischen (Fick)',
        'Konvektion (makroskopische Strömung)',
        'Turbulente Diffusion',
      ],
      correctIndices: [0, 1, 2],
      explanation: 'Molekulare Transportprozesse: Viskosität (Impuls), Wärmeleitung (Energie), Speziesdiffusion (Masse). Konvektion und turbulente Diffusion sind makroskopische Phänomene.' },
  ],

  /* ── UNIT 07 extras ─────────────────────────────────────── */
  'schemes-tvd': [
    // u07-q007
    { id: 'vl2-07-q007', type: 'multi-select', tag: 'vorlesung',
      question: 'Welche Unterschiede bestehen zwischen $\\kappa$-Schemata und TVD-Schemata?',
      options: [
        '$\\kappa$-Schemata: lineare Mischung (konstanter Parameter $\\kappa$), bis 2. Ordnung, aber keine Monotonie-Garantie',
        'TVD-Schemata: nichtlinear mit Flux-Limiter $\\psi(r)$, erfüllen Total-Variation-Diminishing-Kriterium',
        'TVD ist 2. Ordnung in glatten Bereichen, fällt lokal auf 1. Ordnung nahe Schocks zurück',
        'TVD ist immer überall 2. Ordnung',
        '$\\kappa$ ist ein nichtlinearer Limiter wie bei TVD',
      ],
      correctIndices: [0, 1, 2],
      explanation: '$\\kappa$-Schemata: lineare Kombination (einfach, aber Overshoots möglich). TVD: nichtlinearer Limiter $\\psi(r)$ garantiert Boundedness. TVD: 2. Ordnung in glatten Bereichen, 1. Ordnung nahe starker Gradienten.' },
  ],

  /* ── UNIT 08 extras → basics-mesh, 2d-grid, fvm-concept ── */
  'basics-mesh': [
    // u08-q009
    { id: 'vl2-08-q009', type: 'multi-select', tag: 'vorlesung',
      question: 'Was gehört zu einem guten numerischen Netz um ein aerodynamisches Profil (2D)?',
      options: [
        'O- oder C-Grid mit wandnahen orthogonalen Quads',
        'Starke Verfeinerung in der Grenzschicht (kleines $\\Delta n$)',
        'Wake-/Nachlaufverfeinerung hinter der Hinterkante',
        'Ausreichend großes Farfield (mehrere Sehnen Abstand)',
        'Gleichmäßiges Netz ohne Verfeinerung überall',
      ],
      correctIndices: [0, 1, 2, 3],
      explanation: 'Gutes Profilnetz: O/C-Grid, Grenzschichtverfeinerung, Nachlaufverfeinerung, ausreichendes Farfield. Ohne Grenzschichtverfeinerung → falsche Wandkräfte; ohne Farfield-Abstand → Randreflexionen.' },
    // u08-q012
    { id: 'vl2-08-q012', type: 'single-choice', tag: 'vorlesung',
      question: 'Was ist ein blockstrukturiertes Netz?',
      options: [
        'Mehrere strukturierte Teilgitter (Blöcke) mit eigener $(i,j,k)$-Indexierung, an Interfaces gekoppelt',
        'Ein unstrukturiertes Netz mit automatischer Blockbildung',
        'Ein einzelnes strukturiertes Netz ohne jede Unterteilung',
        'Ein Netz nur aus Tetraedern',
      ],
      correctIndex: 0,
      explanation: 'Blockstrukturiert: mehrere strukturierte Blöcke (je mit eigener $(i,j,k)$-Indexierung) an Blockgrenzen gekoppelt. Vorteil: komplexe Geometrien + strukturierte Effizienz innerhalb der Blöcke.' },
    // u08-q013
    { id: 'vl2-08-q013', type: 'multi-select', tag: 'vorlesung',
      question: 'Welche Aussagen über strukturierte vs. unstrukturierte Netze sind korrekt?',
      options: [
        'Strukturiert: regelmäßige Konnektivität, Nachbarn über Index-Offsets $(i\\pm1, j\\pm1)$',
        'Unstrukturiert: beliebige Konnektivität über Listen, flexible Elementtypen (Tri/Tet/Poly)',
        'Strukturiert: effizienter (Speicher, Cache), einfachere Stencils',
        'Unstrukturiert: flexibler für komplexe Geometrien, aber höherer Overhead',
        'Unstrukturiert ist automatisch genauer als strukturiert',
      ],
      correctIndices: [0, 1, 2, 3],
      explanation: 'Strukturiert = regelmäßige Indexierung, effizient; Unstrukturiert = flexible Konnektivität über Listen, beliebige Elementtypen, flexibler aber mehr Overhead. Unstrukturiert ist nicht automatisch genauer.' },
    // u08-q014
    { id: 'vl2-08-q014', type: 'multi-select', tag: 'vorlesung',
      question: 'Was sind Vorteile und Nachteile unstrukturierter Netze?',
      options: [
        'Vorteil: hohe Geometrieflexibilität und lokale Verfeinerung',
        'Vorteil: automatische Netzerzeugung oft möglich',
        'Nachteil: mehr Rechen-/Speicheraufwand, schlechtere Cache-Lokalität',
        'Nachteil: oft höhere Skewness/Non-Orthogonalität → numerische Diffusion',
        'Vorteil: immer bessere Ergebnisse als strukturierte Netze',
      ],
      correctIndices: [0, 1, 2, 3],
      explanation: 'Unstrukturiert: sehr flexibel (Geometrie, Adaptivität, Hybrid-Elemente), aber teurer (Konnektivität, Cache), höhere Skewness/Non-Orthogonalität erfordern Korrekturen. Nicht automatisch besser als strukturiert.' },
    // u08-q015
    { id: 'vl2-08-q015', type: 'multi-select', tag: 'vorlesung',
      question: 'Welche Prinzipien charakterisieren eine Delaunay-Triangulation?',
      options: [
        'Umkreis jedes Dreiecks enthält keine anderen Punkte im Inneren (empty circumcircle)',
        'Maximiert den minimalen Winkel der Dreiecke',
        'Dualgraph ist das Voronoi-Diagramm',
        'Lokale Kanten-Flips (Edge Flipping) zur Herstellung der Bedingung',
        'Garantiert immer perfekte, gleichseitige Dreiecke',
      ],
      correctIndices: [0, 1, 2, 3],
      explanation: 'Delaunay: Empty-Circumcircle-Property, Maximierung des Minimalwinkels, Dualität zum Voronoi-Diagramm. Kein Garant für perfekte Elemente — Qualität hängt auch von Punktverteilung ab.' },
    // u08-q016
    { id: 'vl2-08-q016', type: 'single-choice', tag: 'vorlesung',
      question: 'Für ein unstrukturiertes Netz mit 4 Dreiecken (Quadrat + Zentrumsknoten 5): Wie lautet die Konnektivitätsmatrix?',
      options: [
        '$e_1=(1,2,5),\\; e_2=(2,3,5),\\; e_3=(3,4,5),\\; e_4=(4,1,5)$',
        '$e_1=(1,2,3),\\; e_2=(1,3,4),\\; e_3=(2,3,4),\\; e_4=(1,2,4)$',
        '$e_1=(1,2,3,4),\\; e_2=(5,5,5,5)$',
        '$e_1=(1,5),\\; e_2=(2,5),\\; e_3=(3,5),\\; e_4=(4,5)$',
      ],
      correctIndex: 0,
      explanation: 'Quadrat (Knoten 1–4) + Zentrumsknoten 5: 4 Dreiecke, jedes verbindet eine Kante des Quadrats mit dem Zentrum. Daraus ergibt sich die Element→Knoten-Konnektivität.' },
    // u08-q018
    { id: 'vl2-08-q018', type: 'single-choice', tag: 'vorlesung',
      question: 'Wie beeinflusst Netzverfeinerung an Wänden die Konvergenzordnung?',
      options: [
        'Bei glatter Streckung bleibt die formale Ordnung erhalten, abrupte Zellsprünge können sie senken',
        'Wandverdichtung erhöht automatisch die formale Ordnung des Schemas',
        'Wandverdichtung hat keinen Einfluss auf Genauigkeit oder Konvergenz',
        'Feinere Zellen an der Wand machen das Schema immer instabil',
      ],
      correctIndex: 0,
      explanation: 'Glatte Streckung: formale Ordnung bleibt, aber Kondition steigt. Abrupte Zellgrößensprünge → lokale 1.-Ordnung-Fehler dominieren → Ordnungsreduktion. Wandverdichtung verbessert lokale Auflösung ($y^+$), erhöht aber nicht die Schemaordnung.' },
  ],

  '2d-grid': [
    // u08-q010
    { id: 'vl2-08-q010', type: 'single-choice', tag: 'vorlesung',
      question: 'Welche Indizes besitzen die Nachbarpunkte von $(i,j,k)$ entlang der Gitterlinien eines strukturierten Gitters?',
      options: [
        '$(i\\pm1,j,k)$, $(i,j\\pm1,k)$, $(i,j,k\\pm1)$ — sechs Nachbarn',
        '$(i\\pm1,j\\pm1,k\\pm1)$ — acht Diagonalnachbarn',
        'Nur $(i+1,j,k)$ und $(i,j+1,k)$ — zwei Nachbarn',
        'Beliebige Indizes, da die Konnektivität frei wählbar ist',
      ],
      correctIndex: 0,
      explanation: 'Strukturiertes Gitter: 6 Nachbarn entlang der drei Gitterlinienrichtungen (jeweils $\\pm1$). Diagonale Nachbarn $(i\\pm1,j\\pm1,\\ldots)$ liegen nicht entlang der Gitterlinien.' },
    // u08-q011
    { id: 'vl2-08-q011', type: 'single-choice', tag: 'vorlesung',
      question: 'Durch wie viele Indizes wird ein Gitterpunkt beschrieben?',
      options: [
        'Strukturiert 3D: drei Indizes $(i,j,k)$; Unstrukturiert: ein globaler Index $n$ + Konnektivitätslisten',
        'Beide: immer drei Indizes $(i,j,k)$',
        'Strukturiert: ein Index; Unstrukturiert: drei Indizes',
        'Immer nur ein einziger Index in beiden Fällen',
      ],
      correctIndex: 0,
      explanation: 'Strukturiert: $(i,j,k)$ in 3D, Nachbarn implizit über $\\pm1$. Unstrukturiert: globaler Index/ID, Nachbarschaft über Element→Knoten- und Zelle→Nachbar-Listen gespeichert.' },
  ],

  /* ── UNIT 08 → fvm-concept ──────────────────────────────── */
  'fvm-concept': [
    // u08-q017
    { id: 'vl2-08-q017', type: 'multi-select', tag: 'vorlesung',
      question: 'Wie werden Flüsse über Zellränder in einem unstrukturierten FVM-Gitter berechnet?',
      options: [
        'Normalenvektor $\\mathbf{n}_f$ und Fläche $A_f$ pro Face bestimmen',
        'Face-Werte durch Rekonstruktion/Interpolation aus Nachbarzellen (Gradient, Limiter)',
        'Konvektiver Fluss: $F_{\\text{conv}} = \\dot{m}_f \\varphi_f$; Diffusiver Fluss: $F_{\\text{diff}} = -\\Gamma_f (\\nabla\\varphi\\cdot\\mathbf{n})_f A_f$',
        'Non-Orthogonal Correction für schiefe Flächen im Diffusionsterm',
        'Flüsse werden nur am Zellzentrum berechnet, nicht an den Flächen',
      ],
      correctIndices: [0, 1, 2, 3],
      explanation: 'Unstrukturierte FVM: Face-Normalen/Flächen bestimmen, Werte an Faces rekonstruieren, Konvektions- und Diffusionsflüsse bilden. Bei schiefen Netzen ist Non-Orthogonal Correction für den Diffusionsterm wichtig.' },
  ],

  /* ── UNIT 09 extras ─────────────────────────────────────── */
  'incomp-simple': [
    // u09-q010
    { id: 'vl2-09-q010', type: 'multi-select', tag: 'vorlesung',
      question: 'Was sind Gründe für Checkerboarding und wie wird es verhindert?',
      options: [
        'Ursache: Odd-Even-Decoupling bei collocated Anordnung + zentralen Differenzen',
        'Bestimmte Druckmoden beeinflussen Massenflüsse nicht (werden nicht „gesehen")',
        'Vermeidung: Staggered Grid oder Rhie-Chow-Interpolation bei collocated FVM',
        'Checkerboarding ist nur ein Konvergenzproblem des Solvers',
        'Druckglättung/Filter löst das Problem grundsätzlich',
      ],
      correctIndices: [0, 1, 2],
      explanation: 'Checkerboarding: Schachbrettmuster im Druckfeld durch unzureichende Kopplung (Druckgradient ↔ Divergenz). Lösung: Staggered Grid oder Rhie-Chow (Momentum Interpolation). Druckfilter bekämpfen nur Symptome.' },
    // u09-q011
    { id: 'vl2-09-q011', type: 'true-false', tag: 'vorlesung',
      question: 'Pseudo-Transient Continuation bei stationären Problemen',
      statement: 'Es bringt numerische Vorteile, eine Zeitableitung auch in einem stationären Problem zu berücksichtigen (Pseudo-Transient Continuation).',
      correct: true,
      explanation: 'Ja: Pseudo-Transient Continuation stabilisiert die Iteration. Vorteile: bessere Diagonaldominanz, Dämpfung hochfrequenter Fehler, $\\Delta t$ als Relaxationsparameter. Stationäre Lösung bleibt unverändert wenn bis $\\partial/\\partial t \\to 0$ konvergiert.' },
    // u09-q012
    { id: 'vl2-09-q012', type: 'single-choice', tag: 'vorlesung',
      question: 'Warum darf eine Zeitableitung in stationären Gleichungen berücksichtigt werden?',
      options: [
        'Stationäre Lösung ist der Grenzfall $t\\to\\infty$ mit $\\partial/\\partial t \\to 0$ — der zusätzliche Term ändert den Fixpunkt nicht',
        'Weil die Zeitableitung die stationäre Lösung verbessert',
        'Weil stationäre Probleme nicht ohne Zeitterm lösbar sind',
        'Die Zeitableitung macht die Gleichungen kompressibel',
      ],
      correctIndex: 0,
      explanation: 'Stationär = Fixpunkt der instationären Gleichungen für $t\\to\\infty$. Pseudo-Zeitableitung dient als Relaxation/Stabilisierung und ändert die stationäre Lösung nicht, solange bis $\\partial\\varphi/\\partial t \\approx 0$ iteriert wird.' },
    // u09-q014
    { id: 'vl2-09-q014', type: 'multi-select', tag: 'vorlesung',
      question: 'Wie wird das Druckfeld bei inkompressiblen Strömungen berechnet?',
      options: [
        'Druck ergibt sich aus $\\nabla\\cdot\\mathbf{u}=0$ (Kontinuität) + Impulsgleichung',
        'Projection: Poisson-Gleichung $\\nabla^2 p\' = (\\rho/\\Delta t)\\nabla\\cdot\\mathbf{u}^*$',
        'SIMPLE/PISO: Druckkorrekturgleichung aus Kontinuität + linearisiertem Momentum',
        'Referenzdruck notwendig (Druck nur bis auf Konstante bestimmt)',
        'Druck aus Zustandsgleichung (EOS) berechnen',
      ],
      correctIndices: [0, 1, 2, 3],
      explanation: 'Inkompressibel: Druck nicht aus EOS, sondern aus der Kontinuitätsbedingung $\\nabla\\cdot\\mathbf{u}=0$. Methoden: Projection (Poisson für $p\'$) oder SIMPLE/PISO (iterative Druckkorrektur). Referenzdruck nötig.' },
    // u10-q022 (mapped here since it's about incompressible BC)
    { id: 'vl2-10-q022', type: 'single-choice', tag: 'vorlesung',
      question: 'Warum kann man nicht gleichzeitig $\\Delta p$ und $\\dot{m}$ als Randbedingung bei inkompressiblen Strömungen vorgeben?',
      options: [
        '$\\Delta p$ und $\\dot{m}$ sind über die Impulserhaltung gekoppelt — das Problem wäre überbestimmt',
        'Der Solver kann nur eine Randbedingung gleichzeitig verarbeiten',
        'Druck und Massenstrom sind physikalisch unabhängig',
        'Beide Randbedingungen sind im Grunde identisch',
      ],
      correctIndex: 0,
      explanation: 'Für gegebenes System sind $\\Delta p$ und $\\dot{m}$ über die Impulserhaltung eindeutig verknüpft. Beide gleichzeitig vorgeben ist überbestimmt — Lösung existiert nur bei exakter Konsistenz.' },
  ],

  'algo-iterative': [
    // u09-q013
    { id: 'vl2-09-q013', type: 'multi-select', tag: 'vorlesung',
      question: 'Wann kann die zeitliche Iteration eines stationären Problems beendet werden?',
      options: [
        'Lösung ändert sich nicht mehr: $\\|\\varphi^{n+1}-\\varphi^n\\|$ klein',
        'Residuen unter vorgegebenen Toleranzen',
        'Globale Bilanzen erfüllt (Massenbilanz, Energiebilanz)',
        'Nach einer festen Anzahl Zeitschritte (unabhängig von Konvergenz)',
      ],
      correctIndices: [0, 1, 2],
      explanation: 'Stationär wenn: Lösung stationär, Residuen klein, Bilanzen erfüllt, Monitore (Kräfte, $\\Delta p$) konvergiert. Festgelegte Schrittzahl ohne Konvergenzprüfung ist falsch.' },
  ],

  /* ── UNIT 09-q015 → incomp-ns ──────────────────────────── */
  // (already added to incomp-ns above, add u09-q015 here)

  /* ── UNIT 10 extras → comp-euler, comp-godunov, comp-shocktube */
  'comp-euler': [
    // u10-q012
    { id: 'vl2-10-q012', type: 'multi-select', tag: 'vorlesung',
      question: 'Was sind die Kernunterschiede im Lösungsalgorithmus für kompressible vs. inkompressible Strömungen?',
      options: [
        'Inkompressibel: $p$ aus Kontinuität (Poisson/$\\nabla\\cdot\\mathbf{u}=0$); Kompressibel: $p$ aus EOS ($p = p(\\rho,T)$)',
        'Kompressibel: Kontinuität ist dynamische Gleichung für $\\rho$; Inkompressibel: $\\rho=$const, Kontinuität → $\\nabla\\cdot\\mathbf{u}=0$',
        'Kompressibel: Flüsse mit Riemann-Solver/Upwind $(u \\pm a)$',
        'Beide Verfahren lösen den Druck identisch',
      ],
      correctIndices: [0, 1, 2],
      explanation: 'Kernunterschied: Inkompressibel bestimmt $p$ aus Kontinuität; Kompressibel bestimmt $p$ aus EOS und löst Kontinuität als dynamische Gleichung für $\\rho$. Flüsse: Riemann/Upwind-basiert.' },
    // u10-q013
    { id: 'vl2-10-q013', type: 'multi-select', tag: 'vorlesung',
      question: 'Welche wesentlichen Herausforderungen bestehen bei der numerischen Lösung kompressibler Strömungen?',
      options: [
        'Diskontinuitäten/Schocks erfordern Shock-Capturing (Upwind, Limiter)',
        'Akustische Steifigkeit: $\\Delta t$ durch $|u|+a$ begrenzt (CFL) → sehr restriktiv bei Low-Mach',
        'Starke nichtlineare Kopplung von $\\rho, u, p, T$ über EOS/Energie',
        'Randbedingungen hängen von Sub-/Supersonik ab (Charakteristiken)',
        'Keine besonderen Schwierigkeiten gegenüber inkompressibel',
      ],
      correctIndices: [0, 1, 2, 3],
      explanation: 'Kompressibel: Schocks (Shock-Capturing nötig), CFL-Restriktion durch $|u|+a$, starke Kopplung, charakteristikbasierte BC. Alles deutlich komplexer als inkompressibel.' },
    // u10-q014
    { id: 'vl2-10-q014', type: 'multi-select', tag: 'vorlesung',
      question: 'Welche Erhaltungsgleichungen müssen in kompressiblen Strömungen gelöst werden?',
      options: [
        'Kontinuität (Masse)',
        'Impuls (3 Komponenten)',
        'Energiegleichung',
        'Zustandsgleichung (EOS) als Schließung',
        'Nur Impuls und Druck genügen',
      ],
      correctIndices: [0, 1, 2, 3],
      explanation: 'Kompressibel: Kontinuität + Impuls (3) + Energie + EOS ($p=p(\\rho,T)$). Konservative Variablen $(\\rho, \\rho\\mathbf{u}, \\rho E)$ für Schockauflösung. Ohne Energie wäre $T/p$ nicht bestimmbar.' },
    // u10-q015
    { id: 'vl2-10-q015', type: 'single-choice', tag: 'vorlesung',
      question: 'Wie ändern sich $p$ und $\\rho$ am Staupunkt bei inkompressibler Strömung?',
      options: [
        '$p$ steigt (Bernoulli: $p_0 = p_\\infty + \\frac{1}{2}\\rho u_\\infty^2$), $\\rho$ bleibt konstant',
        'Beide steigen',
        'Beide sinken',
        '$p$ bleibt gleich, $\\rho$ steigt',
      ],
      correctIndex: 0,
      explanation: 'Inkompressibel: $\\rho=$ const (keine Dichteänderung). Am Staupunkt $u=0$, Bernoulli: $p_0 = p_\\infty + \\frac{1}{2}\\rho u_\\infty^2$ → Druck steigt, Dichte bleibt gleich.' },
    // u10-q016
    { id: 'vl2-10-q016', type: 'single-choice', tag: 'vorlesung',
      question: 'Wie ändern sich $p$ und $\\rho$ am Staupunkt bei kompressibler Strömung?',
      options: [
        'Beide steigen: Abbremsung → Kompression → $p\\uparrow$, $\\rho\\uparrow$, $T\\uparrow$',
        '$p$ steigt, $\\rho$ bleibt gleich',
        'Beide sinken',
        '$p$ bleibt gleich, $\\rho$ steigt',
      ],
      correctIndex: 0,
      explanation: 'Kompressibel: Abbremsung führt zu Kompression. Isentrop: $T_0/T_\\infty = 1 + (\\gamma-1)/2\\cdot Ma_\\infty^2$, und $p_0$, $\\rho_0$ steigen entsprechend (stärker bei höherem $Ma$).' },
    // u10-q017
    { id: 'vl2-10-q017', type: 'single-choice', tag: 'vorlesung',
      question: 'Dampf kühlt von 800 K auf 400 K ab (ideales Gas). Wie ändert sich die Schallgeschwindigkeit?',
      options: [
        '$a \\propto \\sqrt{T}$ → $a_2/a_1 = \\sqrt{400/800} \\approx 0{,}707$ — sinkt auf ca. 70,7 %',
        '$a \\propto T$ → $a_2/a_1 = 0{,}5$ — halbiert sich',
        '$a$ bleibt unverändert, da nur $\\gamma$ relevant ist',
        '$a \\propto T^2$ → $a_2/a_1 = 0{,}25$',
      ],
      correctIndex: 0,
      explanation: 'Ideales Gas: $a = \\sqrt{\\gamma R T}$, also $a \\propto \\sqrt{T}$. Verhältnis: $\\sqrt{400/800} = \\sqrt{0{,}5} \\approx 0{,}707$. Die Schallgeschwindigkeit sinkt auf ca. 70,7 % des Ausgangswerts.' },
    // u10-q018
    { id: 'vl2-10-q018', type: 'single-choice', tag: 'vorlesung',
      question: 'Welche Kräfte dominieren bei großen Geschwindigkeiten? Wie vereinfacht sich die Impulserhaltung?',
      options: [
        'Trägheits-/Konvektionskräfte dominieren → viskose Terme vernachlässigbar → Euler-Gleichungen',
        'Viskose Kräfte dominieren immer → keine Vereinfachung',
        'Druckkräfte verschwinden bei hohen Geschwindigkeiten',
        'Alle Kräfte sind bei $Re \\gg 1$ vernachlässigbar',
      ],
      correctIndex: 0,
      explanation: 'Bei hohen Geschwindigkeiten/großem $Re$: Trägheit $\\gg$ Viskosität → $\\nabla\\cdot\\boldsymbol{\\tau}$ vernachlässigbar → Euler-Gleichungen: $\\rho(\\partial\\mathbf{u}/\\partial t + \\mathbf{u}\\cdot\\nabla\\mathbf{u}) = -\\nabla p$. Ausnahme: Grenzschicht bleibt viskos.' },
  ],

  'comp-godunov': [
    // u10-q019
    { id: 'vl2-10-q019', type: 'multi-select', tag: 'vorlesung',
      question: 'Warum sind zentrale Differenzen für die Lösung der Euler-Gleichungen problematisch?',
      options: [
        'Euler-Gleichungen sind hyperbolisch und können Schocks enthalten',
        'CDS liefern zu wenig numerische Dissipation → Oszillationen an Schocks',
        'Für Schockauflösung braucht man Upwind/Godunov-Flüsse basierend auf Eigenwerten $(u \\pm a)$',
        'CDS kann unphysikalische negative Dichten erzeugen',
        'CDS ist grundsätzlich immer die beste Wahl für hyperbolische Gleichungen',
      ],
      correctIndices: [0, 1, 2, 3],
      explanation: 'Euler-Gleichungen: hyperbolisch, Schocks möglich. CDS: nicht upwind-bewusst, zu wenig Dissipation → Gibbs-Oszillationen. Upwind/Riemann-Solver nutzen Charakteristiken $(u \\pm a)$ für stabile Schockauflösung.' },
  ],

  'comp-shocktube': [
    // u10-q020
    { id: 'vl2-10-q020', type: 'multi-select', tag: 'vorlesung',
      question: 'Welche Randbedingungen werden am Eingang/Ausgang/Wand gesetzt für verschiedene Strömungsarten?',
      options: [
        'Isotherm inkompressibel: Einlass $u$-Profil, Auslass Druck $p$, Wand no-slip $u=0$',
        'Isotherm kompressibel: Einlass $p_0, T_0$ oder $\\rho/u$; Auslass (subsonisch) $p$',
        'Variable Dichte: zusätzlich $T$-Randbedingung am Einlass und thermische BC an Wänden',
        'Reagierend kompressibel: Spezieszusammensetzung $Y_k$ am Einlass, Spezies-BC an Wänden',
        'Bei kompressibel können BC wie inkompressibel gesetzt werden (immer gleich)',
      ],
      correctIndices: [0, 1, 2, 3],
      explanation: 'BC hängen von der Strömungsart ab. Kompressibel: Anzahl der vorzugebenden Größen von Sub-/Supersonik abhängig (Charakteristiken). Reagierend: Spezies $Y_k$ + Energie. Nicht identisch zu inkompressibel.' },
    // u10-q021
    { id: 'vl2-10-q021', type: 'multi-select', tag: 'vorlesung',
      question: 'Welche Möglichkeiten gibt es, Randbedingungen für inkompressible Strömungen zu definieren?',
      options: [
        'Velocity Inlet ($u$-Profil) + Pressure Outlet ($p$-Referenz)',
        'Massflow Inlet ($\\dot{m}$) + Pressure Outlet ($p$)',
        'Pressure Inlet + Outflow/Neumann für $u$',
        '$p$ an Einlass und Auslass gleichzeitig ohne Flussangabe',
      ],
      correctIndices: [0, 1, 2],
      explanation: 'Typische Kombinationen: Velocity/Massflow Inlet + Pressure Outlet; oder Pressure Inlet + Outflow. Druck an beiden Enden ohne Flussdefinition → unklare Massenbilanz.' },
    // u10-q023
    { id: 'vl2-10-q023', type: 'multi-select', tag: 'vorlesung',
      question: 'Wie ändern sich die Randbedingungen für Hochgeschwindigkeitsströmungen ohne Reibung/Wärmeleitung (Euler)?',
      options: [
        'Wand: Slip-Bedingung ($u_n=0$) statt No-Slip, keine thermische Rand-BC nötig',
        'Supersonischer Einlass: alle Zustandsgrößen vorgeben',
        'Supersonischer Auslass: keine Zustandsgrößen vorgeben (extrapolieren)',
        'Subsonischer Auslass: typischerweise statischen Druck vorgeben',
        'Wie bei inkompressibel: immer $p$-Outlet überall',
      ],
      correctIndices: [0, 1, 2, 3],
      explanation: 'Euler (inviscid): Slip an Wänden. BC nach Charakteristiken: Supersonisch ein → alles vorgeben, supersonisch aus → extrapolieren, subsonisch → $p$ oder Totalgrößen. Nicht wie inkompressibel.' },
  ],

  /* ── UNIT 09-q015 → comp-euler (coupling conditions) ──── */
  // u09-q015 added to incomp-ns context is better, but let me add it standalone

  /* ── UNIT 11 extras → turb-dns, turb-intro, turb-rans ─── */
  'turb-dns': [
    // u11-q008
    { id: 'vl2-11-q008', type: 'multi-select', tag: 'vorlesung',
      question: 'Was bedeutet DNS (Direkte Numerische Simulation)?',
      options: [
        'Löst instationäre 3D Navier-Stokes ohne Turbulenzmodell',
        'Alle Skalen bis zur Kolmogorov-Skala $\\eta$ werden aufgelöst',
        '$\\Delta x, \\Delta t$ müssen klein genug sein für $\\eta$ und $\\tau_\\eta$',
        'Referenz für LES/RANS-Validierung',
        'DNS ist ein RANS-Modell mit sehr feinem Netz',
      ],
      correctIndices: [0, 1, 2, 3],
      explanation: 'DNS: Alle turbulenten Skalen aufgelöst, kein Turbulenzmodell. Nur Diskretisierungs-/Rundungsfehler. Extrem rechenintensiv, aber Referenzlösung. Kein RANS-Modell!' },
    // u11-q009
    { id: 'vl2-11-q009', type: 'multi-select', tag: 'vorlesung',
      question: 'Vorteile und Nachteile der DNS?',
      options: [
        'Vorteil: höchste physikalische Genauigkeit, keine Modellunsicherheit',
        'Vorteil: vollständige Datenbasis für Validierung und Modellentwicklung',
        'Nachteil: extrem hoher Rechenaufwand, nur niedrige $Re$ und einfache Geometrien',
        'Nachteil: lange Simulationszeit für statistische Konvergenz',
        'Nachteil: DNS ist ungenauer als RANS',
      ],
      correctIndices: [0, 1, 2, 3],
      explanation: 'DNS: höchste Genauigkeit und Referenzdaten, aber extrem teuer. Gitterpunkte skalieren mit $Re^{9/4}$. Nur für niedrige $Re$ und einfache Geometrien praktikabel.' },
    // u11-q010
    { id: 'vl2-11-q010', type: 'formula-select', tag: 'vorlesung',
      question: 'Warum benötigt DNS niedrige Reynolds-Zahlen? Wie skaliert die Gitterpunktzahl?',
      options: [
        '$\\eta/L \\sim Re^{-3/4}$ → $N \\sim (L/\\eta)^3 \\sim Re^{9/4}$ — sehr starke Abhängigkeit',
        '$N \\sim Re$ — lineare Abhängigkeit',
        '$N \\sim Re^{1/2}$ — moderate Abhängigkeit',
        '$N$ ist unabhängig von $Re$',
      ],
      correctIndex: 0,
      explanation: 'Kolmogorov: $\\eta/L \\sim Re^{-3/4}$, also $L/\\eta \\sim Re^{3/4}$. In 3D: $N \\sim Re^{9/4}$ — extrem starke Skalierung. Bei hohem $Re$ praktisch nicht durchführbar.' },
    // u11-q011
    { id: 'vl2-11-q011', type: 'formula-select', tag: 'vorlesung',
      question: 'Was ist das Kriterium für ausreichende Auflösung in einer DNS?',
      options: [
        '$\\Delta x = O(\\eta)$ mit $\\eta = (\\nu^3/\\varepsilon)^{1/4}$ (Kolmogorov-Skala)',
        '$\\Delta x = O(L)$ (Integralmaßstab)',
        '$y^+ \\leq 1$ nur an der Wand',
        'Keine bestimmte Auflösung erforderlich',
      ],
      correctIndex: 0,
      explanation: 'DNS: $\\Delta x = O(\\eta)$ mit $\\eta = (\\nu^3/\\varepsilon)^{1/4}$. Korrelation: $\\eta/L \\sim Re^{-3/4}$. DNS braucht $\\eta$-Auflösung überall, nicht nur an der Wand.' },
    // u11-q012
    { id: 'vl2-11-q012', type: 'multi-select', tag: 'vorlesung',
      question: 'Welche Alternativen gibt es zur DNS, wenn diese zu teuer ist?',
      options: [
        'RANS: alle turbulenten Skalen modelliert → günstig, aber Modellunsicherheit',
        'LES: große Skalen aufgelöst, SGS modelliert → teurer als RANS, günstiger als DNS',
        'Hybrid DES/IDDES: RANS nahe Wand, LES im Kern',
        'Laminare Simulation ohne Turbulenzmodell',
      ],
      correctIndices: [0, 1, 2],
      explanation: 'Alternativen: RANS (günstig, alle Skalen modelliert), LES (große Skalen aufgelöst, SGS modelliert), Hybride DES/IDDES. Laminare Simulation bildet Turbulenz nicht ab.' },
  ],

  'turb-intro': [
    // u11-q013
    { id: 'vl2-11-q013', type: 'single-choice', tag: 'vorlesung',
      question: 'Wie unterscheiden sich laminare und turbulente Geschwindigkeitsprofile in einer Rohrströmung?',
      options: [
        'Laminar: parabolisch ($u_{max}=2\\bar{U}$); Turbulent: flacherer Kern, steiler Wandgradient; Höherer Turbulenzgrad → noch flacher',
        'Laminar: flach; Turbulent: parabolisch',
        'Beide sind immer parabolisch',
        'Laminar und turbulent haben identische Profile bei gleichem $\\bar{U}$',
      ],
      correctIndex: 0,
      explanation: 'Laminar (Hagen-Poiseuille): parabolisch, $u_{max}=2\\bar{U}$. Turbulent: flacherer „Plug"-Kern + steiler Wandgradient. Mehr Turbulenz → noch flacherer Kern (stärkere Durchmischung).' },
  ],

  'turb-rans': [
    // u11-q014
    { id: 'vl2-11-q014', type: 'single-choice', tag: 'vorlesung',
      question: 'Was ist die Reynolds-Zerlegung?',
      options: [
        '$\\varphi(x,t) = \\bar{\\varphi}(x) + \\varphi\'(x,t)$ mit $\\overline{\\varphi\'} = 0$',
        '$\\varphi(x,t) = \\varphi_1 + \\varphi_2 + \\ldots$ (Fourierreihe)',
        '$\\varphi(x,t) = \\nabla\\varphi + \\Delta\\varphi$',
        '$\\varphi(x,t) = \\varphi_{laminar} + \\varphi_{turbulent}$',
      ],
      correctIndex: 0,
      explanation: 'Reynolds-Zerlegung: Mittelwert + Fluktuation. $\\overline{\\varphi\'} = 0$ per Definition. In RANS entstehen daraus zusätzliche Reynolds-Spannungsterme $\\overline{u\'_i u\'_j}$.' },
    // u11-q015
    { id: 'vl2-11-q015', type: 'multi-select', tag: 'vorlesung',
      question: 'Welche Definitionen von Mittelwerten gibt es?',
      options: [
        'Zeitmittel: $(1/T)\\int_{t_0}^{t_0+T} \\varphi\\,dt$',
        'Ensemblemittel: $\\langle\\varphi\\rangle = \\int \\varphi\\, P(\\varphi)\\,d\\varphi$',
        'Räumliches Mittel: $(1/V)\\int_V \\varphi\\,dV$',
        'Favre-Mittel (dichtegewichtet): $\\tilde{\\varphi} = \\overline{\\rho\\varphi}/\\bar{\\rho}$',
        'Phasenmittel: über gleiche Phase eines periodischen Prozesses',
      ],
      correctIndices: [0, 1, 2, 3, 4],
      explanation: 'Verschiedene Mittelungsarten: Zeitmittel (stationäre Turbulenz), Ensemblemittel (nichtstationäre Prozesse), Räumliches Mittel, Phasenmittel, Favre-Mittel (kompressibel). Zeit ↔ Ensemble nur bei Ergodizität gleichsetzbar.' },
    // u11-q016
    { id: 'vl2-11-q016', type: 'single-choice', tag: 'vorlesung',
      question: 'Was ergibt die zeitliche Mittelung einer turbulenten Schwankungsgröße $\\varphi\'$?',
      options: [
        '$\\overline{\\varphi\'} = 0$ per Definition; aber $\\overline{u\'v\'} \\neq 0$ (Reynolds-Spannungen)',
        '$\\overline{\\varphi\'}$ ist eine kleine, aber endliche Zahl',
        'Alle Produkte von Fluktuationen mitteln sich ebenfalls zu 0',
        '$\\overline{\\varphi\'}$ ist nie definiert',
      ],
      correctIndex: 0,
      explanation: '$\\overline{\\varphi\'} = 0$ exakt per Definition der Reynolds-Zerlegung. Aber Produkte $\\overline{u\'v\'}$ oder $\\overline{u\'^2}$ sind i.d.R. $\\neq 0$ und liefern Reynolds-Spannungen bzw. $k = \\frac{1}{2}\\overline{u\'_i u\'_i}$.' },
    // u12-q012
    { id: 'vl2-12-q012', type: 'multi-select', tag: 'vorlesung',
      question: 'Welche Schritte gehören zur Herleitung der Favre-gemittelten Impulserhaltung?',
      options: [
        'Start: $\\partial(\\rho u_i)/\\partial t + \\partial(\\rho u_i u_j)/\\partial x_j = -\\partial p/\\partial x_i + \\ldots$',
        'Favre-Mittel: $\\overline{\\rho u_i} = \\bar{\\rho}\\tilde{u}_i$',
        'Konvektiver Term: $\\overline{\\rho u_i u_j} = \\bar{\\rho}(\\tilde{u}_i\\tilde{u}_j + \\widetilde{u\'\'_i u\'\'_j})$',
        'Zusätzlicher Favre-Reynolds-Spannungstensor: $-\\bar{\\rho}\\widetilde{u\'\'_i u\'\'_j}$ (→ Schließungsproblem)',
        'Reynolds- und Favre-Fluktuationen $u\'$ und $u\'\'$ sind identisch',
      ],
      correctIndices: [0, 1, 2, 3],
      explanation: 'Favre-Mittelung: dichtegewichtete Zerlegung. Konvektionsterm erzeugt Favre-Reynolds-Spannungen $\\bar{\\rho}\\widetilde{u\'\'_i u\'\'_j}$. Favre-Fluktuation $u\'\' = u - \\tilde{u}$ ≠ Reynolds-Fluktuation $u\' = u - \\bar{u}$.' },
    // u12-q013
    { id: 'vl2-12-q013', type: 'single-choice', tag: 'vorlesung',
      question: 'Was ist das Schließungsproblem der Turbulenz?',
      options: [
        'Durch Mittelung entstehen mehr Unbekannte ($\\overline{u\'_i u\'_j}$) als Gleichungen → Modelle nötig',
        'Es gibt zu viele Gleichungen und zu wenige Unbekannte',
        'Es ist ein rein numerisches Problem des Solvers',
        'Reynolds-Spannungen können direkt gemessen und als Eingabe verwendet werden',
      ],
      correctIndex: 0,
      explanation: 'Schließungsproblem: Reynolds-/Favre-Mittelung erzeugt zusätzliche Unbekannte (Reynolds-Spannungen $\\overline{u\'_i u\'_j}$). Mehr Unbekannte als Gleichungen → Turbulenzmodelle schließen das System (Eddy-Viscosity, RSM).' },
    // u12-q014
    { id: 'vl2-12-q014', type: 'multi-select', tag: 'vorlesung',
      question: 'Welche Aufgaben hat ein Turbulenzmodell?',
      options: [
        'Schließen der RANS-Gleichungen: Reynolds-Spannungen modellieren',
        'Turbulente Viskosität $\\mu_t$ oder Spannungstensor bereitstellen',
        'Produktion, Transport und Dissipation von $k$ abbilden',
        'Korrekte Wandmodellierung (Wall Functions / Low-Re)',
        'Fehlerhafte Netze korrigieren',
      ],
      correctIndices: [0, 1, 2, 3],
      explanation: 'Turbulenzmodelle: Reynolds-Spannungen schließen, $\\mu_t$ liefern, $k$-Budgets abbilden, Wandverhalten modellieren. Nicht: „schlechte Netze korrigieren" — Modelle schließen Physik, nicht Numerik.' },
    // u12-q015
    { id: 'vl2-12-q015', type: 'single-choice', tag: 'vorlesung',
      question: 'Was ist die turbulente Schubspannung?',
      options: [
        '$\\tau_{turb} = -\\rho\\overline{u\'v\'}$ — mittlerer Impulstransport durch turbulente Fluktuationen',
        '$\\tau_{turb} = \\mu\\,\\partial\\bar{u}/\\partial y$ — gleich der viskosen Schubspannung',
        '$\\tau_{turb}$ ist überall im Strömungsfeld gleich groß',
        '$\\tau_{turb}$ existiert nur an Wänden',
      ],
      correctIndex: 0,
      explanation: '$\\tau_{turb} = -\\rho\\overline{u\'v\'}$: Impulstransport durch Fluktuationen, analog zu viskös $\\mu\\partial\\bar{u}/\\partial y$, aber anderen Ursprungs. Bei hohem $Re$ oft dominierend. Boussinesq: $-\\rho\\overline{u\'v\'} \\approx \\mu_t \\partial\\bar{u}/\\partial y$.' },
    // u12-q017
    { id: 'vl2-12-q017', type: 'multi-select', tag: 'vorlesung',
      question: 'Was muss über die Schwankungsgrößen für die Turbulenzmodellierung bekannt sein?',
      options: [
        'Statistische Korrelationen: $\\overline{u\'_i u\'_j}$, $\\overline{u\'T\'}$',
        'Turbulente kinetische Energie $k = \\frac{1}{2}\\overline{u\'_i u\'_i}$, Dissipation $\\varepsilon$, $\\omega$',
        'Annahmen über Isotropie/Anisotropie und lokale Gleichgewichte',
        'Die instantanen Fluktuationen $u\'(t)$ müssen direkt berechnet werden',
      ],
      correctIndices: [0, 1, 2],
      explanation: 'Für RANS braucht man Statistik/Korrelationen, nicht die instantanen $u\'(t)$ (das wäre DNS/LES). Wichtig: $k$, $\\varepsilon$/$\\omega$, Längenskalen, Isotropie-Annahmen.' },
    // u12-q018
    { id: 'vl2-12-q018', type: 'single-choice', tag: 'vorlesung',
      question: 'Was sind 0-Gleichungsmodelle (algebraische Turbulenzmodelle)?',
      options: [
        'Keine Transport-PDEs für Turbulenzgrößen; $\\mu_t$ direkt aus lokalen Mittelgrößen, z.B. Prandtl-Mischungsweg: $\\mu_t = \\rho l_m^2 |\\partial\\bar{u}/\\partial y|$',
        'Ein Modell mit einer Transport-PDE',
        'Ein Modell ohne jede Turbulenzmodellierung ($\\mu_t = 0$)',
        'Identisch mit DNS (keine Modelle)',
      ],
      correctIndex: 0,
      explanation: '0-Gleichungsmodelle: keine zusätzlichen PDEs, $\\mu_t$ algebraisch aus lokalen Gradienten/Längenskale ($l_m$). Beispiele: Prandtl-Mischungsweg, Baldwin-Lomax. Einfach und günstig, aber begrenzt anwendbar.' },
    // u12-q019
    { id: 'vl2-12-q019', type: 'multi-select', tag: 'vorlesung',
      question: 'Unter welchen Bedingungen sind 0-Gleichungsmodelle akzeptabel?',
      options: [
        'Lokales Turbulenzgleichgewicht: Produktion $\\approx$ Dissipation ($P \\approx \\varepsilon$)',
        'Einfache Scherströmung/angelegte Grenzschicht',
        'Hohe $Re$ mit gültigem Log-Law-Bereich',
        'Starke Ablösung oder freie Scherströmungen',
        'Komplexe 3D-Strömungen mit Rotation und Krümmung',
      ],
      correctIndices: [0, 1, 2],
      explanation: '0-Gleichungsmodelle brauchen lokales Gleichgewicht ($P \\approx \\varepsilon$): einfache angelegte Grenzschichten, Log-Law gültig. Nicht geeignet für Ablösung, freie Scherströmungen, 3D-Effekte.' },
    // u12-q020
    { id: 'vl2-12-q020', type: 'multi-select', tag: 'vorlesung',
      question: 'Vor- und Nachteile von 0-Gleichungsmodellen?',
      options: [
        'Vorteil: sehr günstig, robust, einfach zu implementieren',
        'Nachteil: versagt bei Ablösung, Druckgradienten, Rotation, 3D',
        'Nachteil: keine Transport-/History-Effekte (rein lokale Bestimmung)',
        'Vorteil: universell für alle Strömungstypen einsetzbar',
      ],
      correctIndices: [0, 1, 2],
      explanation: 'Vorteile: günstig, robust, für einfache Grenzschichten brauchbar. Nachteile: geringe Allgemeingültigkeit, keine History-Effekte, kein $k/\\varepsilon$ für weitere Modelle. Nicht universell.' },
    // u12-q021
    { id: 'vl2-12-q021', type: 'single-choice', tag: 'vorlesung',
      question: 'Welches Gleichgewicht benötigen 0-Gleichungsmodelle?',
      options: [
        'Lokales Turbulenzgleichgewicht: $P \\approx \\varepsilon$ (Produktion ≈ Dissipation)',
        'Globales thermodynamisches Gleichgewicht',
        'Chemisches Gleichgewicht',
        'Mechanisches Gleichgewicht ($\\nabla p = 0$)',
      ],
      correctIndex: 0,
      explanation: 'Lokales Gleichgewicht $P \\approx \\varepsilon$: Turbulenzproduktion und -dissipation im Gleichgewicht → $\\mu_t$ algebraisch bestimmbar. Typisch in voll entwickelten Grenzschichten (Log-Law-Region).' },
  ],

  /* ── UNIT 12 extras → turb-ke ──────────────────────────── */
  'turb-ke': [
    // u12-q016
    { id: 'vl2-12-q016', type: 'multi-select', tag: 'vorlesung',
      question: 'Was ist der Prandtlsche Mischungsweg und wie liefert er $\\mu_t$?',
      options: [
        '$l_m$: charakteristische Länge des turbulenten Impulsmischens (analog zur freien Weglänge)',
        '$u\' \\sim l_m |\\partial\\bar{u}/\\partial y|$ → $\\mu_t = \\rho l_m^2 |\\partial\\bar{u}/\\partial y|$',
        'Wandnähe: $l_m \\approx \\kappa y$ ($\\kappa \\approx 0{,}41$) → führt zum Log-Law',
        '$l_m$ ist überall im Strömungsfeld gleich groß',
      ],
      correctIndices: [0, 1, 2],
      explanation: 'Prandtl-Mischungsweg: $l_m$ × Scherspannung → $\\mu_t$. Wandnähe: $l_m = \\kappa y$ mit van-Driest-Dämpfung. Einfaches 0-Gleichungsmodell; $l_m$ variiert je nach Region.' },
    // u12-q022
    { id: 'vl2-12-q022', type: 'formula-select', tag: 'vorlesung',
      question: 'Wie wird der turbulente Spannungstensor über eine turbulente Viskosität modelliert (Boussinesq)?',
      options: [
        '$-\\rho\\overline{u\'_i u\'_j} = 2\\mu_t \\bar{S}_{ij} - \\frac{2}{3}\\rho k\\,\\delta_{ij}$',
        '$-\\rho\\overline{u\'_i u\'_j} = \\mu\\,\\partial\\bar{u}_i/\\partial x_j$',
        '$-\\rho\\overline{u\'_i u\'_j} = \\rho k\\,\\delta_{ij}$',
        '$-\\rho\\overline{u\'_i u\'_j} = 0$',
      ],
      correctIndex: 0,
      explanation: 'Boussinesq: $-\\rho\\overline{u\'_i u\'_j} = 2\\mu_t \\bar{S}_{ij} - (2/3)\\rho k\\delta_{ij}$ mit $\\bar{S}_{ij} = \\frac{1}{2}(\\partial\\bar{u}_i/\\partial x_j + \\partial\\bar{u}_j/\\partial x_i)$. $\\mu_t$ aus Modell: $\\mu_t = \\rho C_\\mu k^2/\\varepsilon$ (k-$\\varepsilon$) oder $\\mu_t = \\rho k/\\omega$ (k-$\\omega$).' },
    // u12-q023
    { id: 'vl2-12-q023', type: 'single-choice', tag: 'vorlesung',
      question: 'Was sind 1-Gleichungsmodelle?',
      options: [
        'Genau eine Transport-PDE für eine Turbulenzgröße (z.B. Spalart-Allmaras für $\\tilde{\\nu}$, oder $k$ mit algebraischer Skala)',
        'Zwei Transport-PDEs für $k$ und $\\varepsilon$',
        'Kein Modell — Turbulenz wird nicht berücksichtigt',
        'Sechs Transport-PDEs für den vollständigen Reynolds-Spannungstensor',
      ],
      correctIndex: 0,
      explanation: '1-Gleichungsmodelle: eine zusätzliche PDE (z.B. Spalart-Allmaras für $\\tilde{\\nu}$). Günstiger als 2-Gleichungsmodelle, oft robust für aerodynamische Grenzschichten. Längenskala meist algebraisch bestimmt.' },
    // u12-q024
    { id: 'vl2-12-q024', type: 'single-choice', tag: 'vorlesung',
      question: 'Was kennzeichnet 2-Gleichungsmodelle (z.B. $k$-$\\varepsilon$, $k$-$\\omega$)?',
      options: [
        'Zwei Transport-PDEs für Energieskala und Zeitskala; $\\mu_t$ aus $k,\\varepsilon$ oder $k,\\omega$',
        'Zwei algebraische Gleichungen ohne PDEs',
        'Zwei DNS-Läufe, deren Ergebnisse gemittelt werden',
        'Immer identisch mit LES',
      ],
      correctIndex: 0,
      explanation: '2-Gleichungsmodelle: $k$-$\\varepsilon$, $k$-$\\omega$, SST. Aus $k$ und $\\varepsilon$/$\\omega$: $\\mu_t = \\rho C_\\mu k^2/\\varepsilon$ oder $\\mu_t = \\rho k/\\omega$. Universeller als 0/1-Gleichungsmodelle.' },
    // u12-q025
    { id: 'vl2-12-q025', type: 'multi-select', tag: 'vorlesung',
      question: 'Was bedeuten $k$ und $\\varepsilon$ im $k$-$\\varepsilon$-Modell?',
      options: [
        '$k = \\frac{1}{2}\\overline{u\'_i u\'_i}$: turbulente kinetische Energie pro Masse',
        '$\\varepsilon = \\nu\\overline{(\\partial u\'_i/\\partial x_j)^2}$: Dissipationsrate von $k$',
        '$k$ liefert eine Geschwindigkeitsskala, $\\varepsilon$ eine Zeitskala',
        '$\\varepsilon$ ist eine Energie (nicht eine Rate)',
        '$k$ ist die mittlere kinetische Energie $\\frac{1}{2}|\\bar{u}|^2$',
      ],
      correctIndices: [0, 1, 2],
      explanation: '$k$: turbulente kinetische Energie ($m^2/s^2$). $\\varepsilon$: Dissipationsrate ($m^2/s^3$) — eine *Rate*, keine Energie. Längenskala: $l \\sim k^{3/2}/\\varepsilon$. $k \\neq \\frac{1}{2}|\\bar{u}|^2$!' },
    // u12-q026
    { id: 'vl2-12-q026', type: 'multi-select', tag: 'vorlesung',
      question: 'Welche Terme enthält die Transport-Gleichung für $k$?',
      options: [
        'Transient: $\\partial(\\rho k)/\\partial t$',
        'Konvektion: $\\nabla\\cdot(\\rho\\mathbf{u}k)$',
        'Produktion: $P_k = 2\\mu_t \\bar{S}_{ij}\\bar{S}_{ij}$',
        'Dissipation: $-\\rho\\varepsilon$',
        'Diffusion: $\\nabla\\cdot[(\\mu + \\mu_t/\\sigma_k)\\nabla k]$',
      ],
      correctIndices: [0, 1, 2, 3, 4],
      explanation: '$k$-Gleichung: $\\partial(\\rho k)/\\partial t + \\nabla\\cdot(\\rho\\mathbf{u}k) = P_k - \\rho\\varepsilon + \\nabla\\cdot[(\\mu+\\mu_t/\\sigma_k)\\nabla k]$. Alle fünf Terme (+ evtl. Quellen $S_k$).' },
    // u12-q027
    { id: 'vl2-12-q027', type: 'multi-select', tag: 'vorlesung',
      question: 'Welche Terme enthält die Transport-Gleichung für $\\varepsilon$?',
      options: [
        'Transient: $\\partial(\\rho\\varepsilon)/\\partial t$ und Konvektion: $\\nabla\\cdot(\\rho\\mathbf{u}\\varepsilon)$',
        'Produktion: $+C_{\\varepsilon 1}(\\varepsilon/k)P_k$',
        'Zerstörung: $-C_{\\varepsilon 2}\\rho\\varepsilon^2/k$',
        'Diffusion: $\\nabla\\cdot[(\\mu + \\mu_t/\\sigma_\\varepsilon)\\nabla\\varepsilon]$',
        '$\\varepsilon$-Gleichung hat nur den Dissipationsterm',
      ],
      correctIndices: [0, 1, 2, 3],
      explanation: '$\\varepsilon$-Gleichung: Transient + Konvektion = Produktion $C_{\\varepsilon1}(\\varepsilon/k)P_k$ − Zerstörung $C_{\\varepsilon2}\\rho\\varepsilon^2/k$ + Diffusion. Nicht nur „Dissipation" — sie hat eigene Produktion/Transport.' },
  ],

  /* ── UNIT 13 extras → turb-kw-sst, turb-wall ──────────── */
  'turb-kw-sst': [
    // u13-q004
    { id: 'vl2-13-q004', type: 'multi-select', tag: 'vorlesung',
      question: 'Wie unterscheiden sich RSM-Schließungsterme von denen im $k$-$\\varepsilon$-Modell?',
      options: [
        '$k$-$\\varepsilon$: Eddy-Viscosity, Spannungen über Boussinesq (isotropes $\\mu_t$)',
        'RSM: Stress-Transportgleichungen (6 PDEs), Druck-Strain $\\Phi_{ij}$ und Diffusion $D_{ij}$ modellieren',
        'RSM erfasst Anisotropie direkt; $k$-$\\varepsilon$ nimmt isotrope $\\mu_t$ an',
        'RSM braucht keine Turbulenzmodelle',
      ],
      correctIndices: [0, 1, 2],
      explanation: '$k$-$\\varepsilon$: 2 PDEs, isotropes $\\mu_t$ (Boussinesq). RSM: 6 Stress-PDEs (komponentenweise), Anisotropie erfasst, aber viele Schließungsterme ($\\Phi_{ij}$, $D_{ij}$, $\\varepsilon_{ij}$). RSM braucht sehr wohl Modelle!' },
    // u13-q005
    { id: 'vl2-13-q005', type: 'multi-select', tag: 'vorlesung',
      question: 'Vor- und Nachteile verschiedener Turbulenzmodelle?',
      options: [
        '0-Glg: günstig/robust, aber nur für einfache Grenzschichten',
        '$k$-$\\varepsilon$: robust für freie Scherströmungen; Near-wall/Separation oft schwach',
        '$k$-$\\omega$/SST: gutes Near-wall-Verhalten; SST mildert Freiströmungs-$\\omega$-Sensitivität',
        'RSM: Anisotropie/Rotation besser; teurer, schwieriger zu konvergieren',
        'Ein Modell ist universell das beste für alle Strömungen',
      ],
      correctIndices: [0, 1, 2, 3],
      explanation: 'Modellwahl ist problemabhängig. 0-Glg: einfach/günstig. $k$-$\\varepsilon$: robust. $k$-$\\omega$/SST: gut an Wänden. RSM: Anisotropie. LES/DNS: höhere Treue, aber teuer. Kein universell bestes Modell.' },
  ],

  'turb-wall': [
    // u13-q006
    { id: 'vl2-13-q006', type: 'single-choice', tag: 'vorlesung',
      question: 'Warum können konventionelle Turbulenzmodelle (z.B. Prandtl-Mischungsweg) nicht direkt in Wandnähe angewendet werden?',
      options: [
        'In der viskosen Unterschicht dominiert $\\mu$, Turbulenz → 0; Log-Law gilt erst ab $y^+ > 30$; ohne Dämpfung wäre $\\mu_t$ an der Wand falsch',
        'Weil die Zellen zu klein sind',
        'Weil Turbulenz nur im Freifeld existiert',
        'Weil $\\mu_t$ an der Wand maximal sein muss',
      ],
      correctIndex: 0,
      explanation: 'Wandnähe: molekulare Viskosität dominiert, Turbulenzintensität und $l_m$ → 0. Ohne Dämpfung liefern Modelle endliches $\\mu_t$ an der Wand → falsches Profil. Daher: Wandfunktionen oder Low-$Re$-Modelle.' },
    // u13-q007
    { id: 'vl2-13-q007', type: 'formula-select', tag: 'vorlesung',
      question: 'Was ist das Wandgesetz (Law of the Wall)?',
      options: [
        'Viskose Unterschicht: $u^+ = y^+$; Log-Schicht: $u^+ = \\frac{1}{\\kappa}\\ln(y^+) + B$ mit $\\kappa \\approx 0{,}41$, $B \\approx 5$',
        '$u^+ = (y^+)^2$ überall',
        '$u^+ = \\text{const}$ für alle $y^+$',
        '$u^+ = e^{y^+}$',
      ],
      correctIndex: 0,
      explanation: 'Wandgesetz: $u^+ = \\bar{u}/u_\\tau$, $y^+ = \\rho u_\\tau y/\\mu$, $u_\\tau = \\sqrt{\\tau_w/\\rho}$. Viskose Unterschicht ($y^+ \\lesssim 5$): $u^+=y^+$. Log-Schicht ($30 \\lesssim y^+ \\lesssim 300$): $u^+ = (1/\\kappa)\\ln(y^+) + B$.' },
  ],

  /* ── UNIT 14 extras → turb-les ─────────────────────────── */
  'turb-les': [
    // u14-q006
    { id: 'vl2-14-q006', type: 'single-choice', tag: 'vorlesung',
      question: 'Wodurch werden die kleinen Skalen der Turbulenz generiert?',
      options: [
        'Nichtlineare Energiekaskade: Vortex Stretching überträgt Energie von großen zu kleinen Wirbeln',
        'Kleine Skalen entstehen direkt durch Geometrie/Wände',
        'Kleine Skalen entstehen durch Dissipation',
        'Molekulare Effekte erzeugen die kleinen Skalen',
      ],
      correctIndex: 0,
      explanation: 'Kleine Skalen: nichtlineare Kaskade (Vortex Stretching) von großen zu kleinen Wirbeln. Im Inertialbereich verlustfrei; erst bei $\\eta$ wird Energie durch Viskosität dissipiert. Je höher $Re$, desto mehr kleine Skalen.' },
    // u14-q007
    { id: 'vl2-14-q007', type: 'single-choice', tag: 'vorlesung',
      question: 'Warum sind LES-Schließungen einfacher als RANS-Schließungen?',
      options: [
        'LES modelliert nur SGS-Skalen (nahe universell/isotrop); RANS schließt alle turbulenten Skalen (strömungsabhängig)',
        'LES hat kein SGS-Modell',
        'RANS ist einfacher als LES',
        'LES und RANS haben identische Schließungen',
      ],
      correctIndex: 0,
      explanation: 'LES: Großskalen direkt gerechnet, nur SGS (kleine, eher isotrope Skalen) modelliert → einfache Eddy-Viscosity oft ausreichend. RANS: alle Turbulenzskalen geschlossen → mehr Modoll-Annahmen, Parameter, Transportgleichungen.' },
    // u14-q008
    { id: 'vl2-14-q008', type: 'single-choice', tag: 'vorlesung',
      question: 'Warum sind kleine Turbulenzskalen eher isotrop, große aber nicht?',
      options: [
        'Große Skalen: direkt von Anisotropie-Quellen (Wände, Scherung) beeinflusst; Kleine Skalen: lokale Nichtlinearität entkoppelt von Randbedingungen → lokale Isotropie (Kolmogorov)',
        'Viskosität macht alle Skalen anisotrop',
        'Große Skalen sind immer isotrop',
        'Die Skalengröße hat keinen Einfluss auf Isotropie',
      ],
      correctIndex: 0,
      explanation: 'Große Skalen: Anisotropie durch Wände/Scherung/Krümmung. Kleine Skalen: mehrere Kaskadeschritte entfernt → lokale Isotropie (Kolmogorov-Hypothese). Viskosität dämpft Richtungsunterschiede zusätzlich. Nahe Wänden können aber auch kleine Skalen anisotrop bleiben.' },
    // u14-q009
    { id: 'vl2-14-q009', type: 'formula-select', tag: 'vorlesung',
      question: 'Wie lautet das Smagorinsky-Modell für die SGS-Viskosität?',
      options: [
        '$\\nu_t = (C_s \\Delta)^2 |\\bar{S}|$ mit $|\\bar{S}| = \\sqrt{2\\bar{S}_{ij}\\bar{S}_{ij}}$ und $\\Delta = (\\Delta x \\Delta y \\Delta z)^{1/3}$',
        '$\\nu_t = C_\\mu k^2/\\varepsilon$',
        '$\\nu_t = \\rho l_m^2 |\\partial\\bar{u}/\\partial y|$',
        '$\\nu_t = 0$ (kein SGS-Modell)',
      ],
      correctIndex: 0,
      explanation: 'Smagorinsky: $\\nu_t = (C_s \\Delta)^2 |\\bar{S}|$ mit $C_s \\approx 0{,}17$. Alternativ: Dynamic Smagorinsky bestimmt $C_s$ lokal über Germano-Identität. Wandnähe: Dämpfung nötig (van Driest, WALE).' },
    // u14-q010
    { id: 'vl2-14-q010', type: 'multi-select', tag: 'vorlesung',
      question: 'Was sind Modell- vs. numerische Fehler? Nennen Sie Gründe für jeden.',
      options: [
        'Numerischer Fehler: Differenz exakte PDE-Lösung ↔ diskrete Lösung (Trunkation, $\\Delta t$, Iterationen)',
        'Modellfehler: Differenz Realität ↔ modellierte Gleichungen (ungeeignetes SGS-Modell, Annahmen)',
        'Gründe numerisch: räumliche/zeitliche Diskretisierung, schlechte Zellqualität',
        'Gründe Modell: vereinfachte Physik, falsche BC, ungenaue Materialdaten',
        'Modell- und Numerikfehler sind immer identisch',
      ],
      correctIndices: [0, 1, 2, 3],
      explanation: 'Numerischer Fehler: Diskretisierung + Iteration. Modellfehler: vereinfachte/falsche Physik. In LES koppeln sie sich (implizites Filtering). Nicht identisch!' },
    // u14-q011
    { id: 'vl2-14-q011', type: 'single-choice', tag: 'vorlesung',
      question: 'Was bedeutet „Kalibrierung" eines Modells?',
      options: [
        'Modellparameter an Referenzdaten anpassen (≠ Validierung, die an unabhängigen Daten erfolgt)',
        'Das Modell unverändert auf beliebige Fälle anwenden',
        'Kalibrierung und Validierung sind dasselbe',
        'Numerische Parameter des Solvers optimieren',
      ],
      correctIndex: 0,
      explanation: 'Kalibrierung: Modellparameter (z.B. $C_s$, Dämpfungsfunktionen) an Referenzdaten anpassen. Kalibrierung ≠ Validierung (Validierung = Test an unabhängigen Fällen). Gute Kalibrierung nutzt klare Zielfunktion.' },
    // u14-q012
    { id: 'vl2-14-q012', type: 'multi-select', tag: 'vorlesung',
      question: 'Wie wird die Netzqualität/-konvergenz beurteilt?',
      options: [
        'Qualität: Skewness, Non-Orthogonalität, Aspect Ratio, positive Volumina',
        'Konvergenz: Zielgrößen auf mehreren Netzen vergleichen (Grid Convergence Study)',
        'Richardson-Extrapolation / GCI für formale Ordnungsprüfung',
        'LES-spezifisch: $y^+$, Spektren, Anteil aufgelöster Energie',
        'Nur die Gesamtzellzahl zählt',
      ],
      correctIndices: [0, 1, 2, 3],
      explanation: 'Netzqualität: geometrische Metriken. Konvergenz: Gitterstudien mit Zielgrößen, Richardson/GCI. LES: Energieauflösung, Spektren, $y^+$. Nur Zellzahl reicht nicht (kritische Regionen müssen verfeinert werden).' },
    // u14-q013
    { id: 'vl2-14-q013', type: 'multi-select', tag: 'vorlesung',
      question: 'Welche Unterschiede bestehen zwischen RANS und LES für stationäre Fälle?',
      options: [
        'LES ist zeitaufgelöst, auch bei statistisch stationären Strömungen',
        'RANS liefert direkt stationäres Mittel',
        'LES beschreibt kohärente Strukturen explizit; RANS „mittelt sie ein"',
        'Vergleich: zeitgemitteltes LES ↔ RANS-Ergebnis',
        'Ein instantanes LES-Feld kann direkt mit RANS verglichen werden',
      ],
      correctIndices: [0, 1, 2, 3],
      explanation: 'LES: immer instationär, Mittel erst durch Zeitmittelung. RANS: direkt stationär. LES zeigt kohärente Strukturen; Vergleich nur sinnvoll als zeitgemitteltes LES vs. RANS (nicht instantanes Feld).' },
    // u14-q014
    { id: 'vl2-14-q014', type: 'multi-select', tag: 'vorlesung',
      question: 'Wann werden LES-Unterschiede gegenüber RANS wichtig?',
      options: [
        'Starke Drallströmungen, Rezirkulation, Ablösung',
        'Wenn Fluktuationen/Extrema relevant sind (Lärm, Ermüdung, Spitzenwärmeflüsse)',
        'Komplexe Geometrien mit kohärenten Strukturen / Mehrfachstabilitäten',
        'Immer — RANS ist grundsätzlich falsch',
      ],
      correctIndices: [0, 1, 2],
      explanation: 'LES wichtig: starke Instationarität (Ablösung, Drall, Lärm), kohärente Strukturen, Extremwerte. RANS kann für viele Engineering-Fälle ausreichend sein — nicht grundsätzlich falsch.' },
    // u14-q015
    { id: 'vl2-14-q015', type: 'multi-select', tag: 'vorlesung',
      question: 'Bei welchen Anwendungen sind Zyklusvariationen wichtig?',
      options: [
        'Zylinderinnenströmung im Verbrennungsmotor (Cycle-to-Cycle Variation)',
        'Thermo-akustische Schwingungen, pulsierende Jets',
        'Turbomaschinen: Rotor-Stator-Interaktion',
        'Bluff-Body Wake / Vortex Shedding',
      ],
      correctIndices: [0, 1, 2, 3],
      explanation: 'Zyklusvariationen: Motorzyklus, thermo-akustische Instabilitäten, Turbomaschinen, Wirbelstraßen. LES kann diese zeitaufgelöst erfassen. Genug Zyklen für Statistik simulieren!' },
  ],

  /* ── UNIT 15 extras → twophase ─────────────────────────── */
  'twophase-intro': [
    // u15-q010
    { id: 'vl2-15-q010', type: 'multi-select', tag: 'vorlesung',
      question: 'Was charakterisiert eine disperse Zweiphasenströmung?',
      options: [
        'Eine Phase kontinuierlich, die andere als getrennte Elemente (Tropfen, Blasen, Partikel)',
        'Typisch kleiner Volumenbruch der dispersen Phase',
        'Wechselwirkungen: dilute (vernachlässigbar) oder Kollision/Koaleszenz',
        'Beispiele: Spray, Aerosole, Blasenströmung',
        'Stratifizierte/Slug-Flows sind immer dispers',
      ],
      correctIndices: [0, 1, 2, 3],
      explanation: 'Dispers: eine kontinuierliche Phase + getrennte disperse Elemente. Typisch kleiner Volumenbruch. Interaktionen je nach Dichte (dilute → dense). Stratifizierte Flows sind nicht dispers.' },
    // u15-q011
    { id: 'vl2-15-q011', type: 'single-choice', tag: 'vorlesung',
      question: 'Was ist eine „verdünnte" (dilute) Strömung und welcher Volumenbruch charakterisiert sie?',
      options: [
        'Partikel-Partikel-Interaktion vernachlässigbar; $\\alpha_d \\lesssim 10^{-2}$ (1 %) als Faustregel',
        'Immer $\\alpha_d > 50\\%$',
        'Dilute bedeutet: keine disperse Phase vorhanden',
        'Volumenbruch hat keinen Einfluss auf die Kopplung',
      ],
      correctIndex: 0,
      explanation: 'Dilute: Volumenbruch so klein ($\\alpha_d \\lesssim 10^{-2}$), dass Partikel-Partikel-Wechselwirkungen vernachlässigbar. Kopplung: 1-way oder 2-way; 4-way-Effekte klein.' },
  ],

  'twophase-vof': [
    // u15-q012
    { id: 'vl2-15-q012', type: 'formula-select', tag: 'vorlesung',
      question: 'Wie hängen Anzahldichte $n$, Volumenbruch $\\alpha_l$ und Tropfendurchmesser $d$ zusammen?',
      options: [
        '$\\alpha_l = n \\cdot (\\pi/6)\\, d^3$',
        '$\\alpha_l = n \\cdot d$',
        '$\\alpha_l = n \\cdot (\\pi/4)\\, d^2$',
        '$\\alpha_l = (\\pi/6)\\, d^3$ (ohne $n$)',
      ],
      correctIndex: 0,
      explanation: '$n$: Tropfen pro Volumen. Einzeltropfenvolumen: $V_d = (\\pi/6)d^3$. Volumenbruch: $\\alpha_l = n \\cdot (\\pi/6)d^3$. Polydispers: $\\alpha_l = \\int n(d)(\\pi/6)d^3\\,dd$.' },
  ],

  'twophase-levelset': [
    // u15-q013
    { id: 'vl2-15-q013', type: 'multi-select', tag: 'vorlesung',
      question: 'Wie wird die Trajektorie eines Partikels/Tropfens berechnet?',
      options: [
        'Lagrange-Ansatz: $d\\mathbf{x}_p/dt = \\mathbf{u}_p(t)$',
        'Newton: $m_p\\,d\\mathbf{u}_p/dt = \\Sigma F$ (Drag, Gravitation, Lift, …)',
        'ODE-System $\\{\\mathbf{x}_p, \\mathbf{u}_p, T_p, m_p\\}$ numerisch integrieren',
        'Trägerphasen-Geschwindigkeit am Partikelort interpolieren: $\\mathbf{u}_{f,p} = \\mathbf{u}(\\mathbf{x}_p, t)$',
        '$\\mathbf{u}_p = \\mathbf{u}_f$ immer (kein Schlupf)',
      ],
      correctIndices: [0, 1, 2, 3],
      explanation: 'Lagrange-Tracking: ODE-System für Position, Geschwindigkeit, ggf. Temperatur/Masse. Kräftebilanz: Drag, Gravitation, Lift etc. Schlupf $\\mathbf{u}_p \\neq \\mathbf{u}_f$ ist der Regelfall.' },
  ],

  'twophase-surface-tension': [
    // u15-q014
    { id: 'vl2-15-q014', type: 'multi-select', tag: 'vorlesung',
      question: 'Welche Kräfte wirken auf einen Tropfen in einer Zweiphasenströmung?',
      options: [
        'Drag (Widerstandskraft)',
        'Gewicht/Gravitation und Auftrieb',
        'Druckgradientkraft',
        'Virtuelle Masse (Added Mass) und Basset-History-Kraft',
        'Liftkräfte (Saffman, Magnus)',
        'Oberflächenspannungskräfte (bei Deformation/Breakup)',
      ],
      correctIndices: [0, 1, 2, 3, 4, 5],
      explanation: 'Kräfte auf Tropfen: Drag (dominant bei kleinen Partikeln), Gravitation/Auftrieb, Druckgradient, virtuelle Masse, Basset-History, Lift (Saffman, Magnus), Oberflächenspannung. Welche dominieren hängt von Partikelgröße/Re ab.' },
  ],
};

// ── Merge additional questions into vorlesungExtras ──────────
for (const [lid, qs] of Object.entries(_additional)) {
  if (vorlesungExtras[lid]) {
    vorlesungExtras[lid].push(...qs);
  } else {
    vorlesungExtras[lid] = qs;
  }
}
