/**
 * quizData.ts — Quiz questions for every lesson
 *
 * Types: multiple-choice, formula-select, definition
 * All formulas use KaTeX notation inside $...$
 */

export interface QuizQuestion {
  id: string;
  type: 'multiple-choice' | 'formula-select' | 'definition';
  question: string;
  /** Optional KaTeX formula shown below question */
  formula?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface LessonQuiz {
  lessonId: string;
  questions: QuizQuestion[];
}

export const quizBank: Record<string, LessonQuiz> = {

  // ═══════════════════════════════════════════════════════════════
  // 1. GRUNDLAGEN
  // ═══════════════════════════════════════════════════════════════

  'basics-what-is-cfd': {
    lessonId: 'basics-what-is-cfd',
    questions: [
      {
        id: 'cfd-1', type: 'definition',
        question: 'Wofür steht die Abkürzung CFD?',
        options: ['Computational Fluid Dynamics', 'Central Finite Differences', 'Corrected Flow Distribution', 'Compressible Fluid Design'],
        correctIndex: 0,
        explanation: 'CFD = Computational Fluid Dynamics — die numerische Simulation von Strömungen.',
      },
      {
        id: 'cfd-2', type: 'multiple-choice',
        question: 'Welche Gleichungen beschreiben allgemein die Strömungsmechanik?',
        options: ['Maxwell-Gleichungen', 'Navier-Stokes-Gleichungen', 'Schrödinger-Gleichung', 'Laplace-Gleichung'],
        correctIndex: 1,
        explanation: 'Die Navier-Stokes-Gleichungen beschreiben die Impuls-, Massen- und Energieerhaltung in Strömungen.',
      },
      {
        id: 'cfd-3', type: 'multiple-choice',
        question: 'Warum brauchen wir numerische Methoden für Strömungen?',
        options: [
          'Analytische Lösungen existieren für fast alle Fälle',
          'Die Navier-Stokes-Gleichungen sind nichtlinear und haben meist keine geschlossene Lösung',
          'Computer sind schneller als analytische Methoden',
          'Numerische Methoden sind immer genauer',
        ],
        correctIndex: 1,
        explanation: 'Die Nichtlinearität der Navier-Stokes-Gleichungen verhindert geschlossene Lösungen für die meisten praktischen Probleme.',
      },
      {
        id: 'cfd-4', type: 'multiple-choice',
        question: 'Welche der folgenden ist KEINE Standardmethode zur Diskretisierung in CFD?',
        options: ['Finite-Differenzen-Methode (FDM)', 'Finite-Volumen-Methode (FVM)', 'Finite-Elemente-Methode (FEM)', 'Finite-Integral-Methode (FIM)'],
        correctIndex: 3,
        explanation: 'FDM, FVM und FEM sind die drei Standard-Diskretisierungsmethoden. FIM existiert nicht als Standardverfahren.',
      },
    ],
  },

  'basics-pdes': {
    lessonId: 'basics-pdes',
    questions: [
      {
        id: 'pde-1', type: 'formula-select',
        question: 'Welche Gleichung beschreibt reine Konvektion eines Skalars $\\phi$?',
        options: [
          '$\\frac{\\partial \\phi}{\\partial t} + u \\frac{\\partial \\phi}{\\partial x} = 0$',
          '$\\frac{\\partial \\phi}{\\partial t} = \\Gamma \\frac{\\partial^2 \\phi}{\\partial x^2}$',
          '$\\frac{\\partial \\phi}{\\partial t} + u \\frac{\\partial \\phi}{\\partial x} = \\Gamma \\frac{\\partial^2 \\phi}{\\partial x^2}$',
          '$\\nabla^2 \\phi = 0$',
        ],
        correctIndex: 0,
        explanation: 'Reine Konvektion: $\\frac{\\partial \\phi}{\\partial t} + u \\cdot \\nabla \\phi = 0$ — kein Diffusionsterm.',
      },
      {
        id: 'pde-2', type: 'formula-select',
        question: 'Was beschreibt der Diffusionsterm in einer Transportgleichung physikalisch?',
        options: [
          'Transport durch eine mittlere Strömungsgeschwindigkeit',
          'Ausbreitung durch molekulare/turbulente Mischung (Gradientendiffusion)',
          'Erzeugung oder Vernichtung einer Größe',
          'Änderung des Drucks entlang einer Stromlinie',
        ],
        correctIndex: 1,
        explanation: 'Diffusion beschreibt den Transport aufgrund von Konzentrationsgradienten (Ficksches Gesetz).',
      },
      {
        id: 'pde-3', type: 'definition',
        question: 'Was ist eine "hyperbolische" PDE?',
        options: [
          'Gleichung mit rein diffusivem Charakter',
          'Gleichung mit wellenartigem Ausbreitungsverhalten (z.B. Konvektion)',
          'Gleichung mit elliptischem Operator',
          'Gleichung ohne Zeitableitung',
        ],
        correctIndex: 1,
        explanation: 'Hyperbolische PDEs wie die Wellengleichung oder reine Konvektion haben Information, die sich mit endlicher Geschwindigkeit ausbreitet.',
      },
    ],
  },

  'basics-discretization-idea': {
    lessonId: 'basics-discretization-idea',
    questions: [
      {
        id: 'disc-1', type: 'definition',
        question: 'Was versteht man unter "Diskretisierung"?',
        options: [
          'Die exakte Lösung einer Differentialgleichung',
          'Die Umwandlung kontinuierlicher Gleichungen in algebraische Gleichungen auf einem Gitter',
          'Die Berechnung von Randbedingungen',
          'Die Wahl des Zeitschritts',
        ],
        correctIndex: 1,
        explanation: 'Diskretisierung ersetzt das Kontinuum durch endlich viele Punkte/Zellen und die PDEs durch algebraische Gleichungen.',
      },
      {
        id: 'disc-2', type: 'multiple-choice',
        question: 'Was passiert bei Gitterverfeinerung (Δx → 0)?',
        options: [
          'Die numerische Lösung wird immer instabiler',
          'Die Lösung konvergiert gegen die exakte Lösung (bei konsistentem Verfahren)',
          'Der Rechenaufwand sinkt',
          'Die Genauigkeit bleibt gleich',
        ],
        correctIndex: 1,
        explanation: 'Konsistenz + Stabilität → Konvergenz (Äquivalenzsatz von Lax). Bei Verfeinerung nähert sich die Lösung dem Exakten.',
      },
      {
        id: 'disc-3', type: 'formula-select',
        question: 'Welche Näherung nutzt die Finite-Differenzen-Methode für die erste Ableitung?',
        formula: '\\frac{\\partial \\phi}{\\partial x} \\approx \\; ?',
        options: [
          '$\\frac{\\phi_{i+1} - \\phi_{i-1}}{2\\Delta x}$ (zentral)',
          '$\\int \\phi \\, dx$',
          '$\\phi_i \\cdot \\Delta x$',
          '$\\phi_{i+1} \\cdot \\phi_{i-1}$',
        ],
        correctIndex: 0,
        explanation: 'Die zentrale Differenz $\\frac{\\phi_{i+1} - \\phi_{i-1}}{2\\Delta x}$ ist eine 2. Ordnung Näherung der ersten Ableitung.',
      },
    ],
  },

  'basics-mesh': {
    lessonId: 'basics-mesh',
    questions: [
      {
        id: 'mesh-1', type: 'multiple-choice',
        question: 'Was ist der Unterschied zwischen einem strukturierten und unstrukturierten Gitter?',
        options: [
          'Strukturiert = Zufällige Anordnung, Unstrukturiert = Regelmäßig',
          'Strukturiert = i,j,k-Indizierung möglich, Unstrukturiert = beliebige Topologie',
          'Kein Unterschied, nur andere Bezeichnung',
          'Strukturiert = nur Dreiecke, Unstrukturiert = nur Vierecke',
        ],
        correctIndex: 1,
        explanation: 'Strukturierte Gitter haben eine regelmäßige Connectivity (i,j,k). Unstrukturierte Gitter können beliebige Zellformen haben.',
      },
      {
        id: 'mesh-2', type: 'definition',
        question: 'Was bedeutet Δx in einem gleichmäßigen 1D-Gitter?',
        options: [
          'Die Gesamtlänge des Gebiets',
          'Der Abstand zwischen zwei benachbarten Gitterpunkten',
          'Die Anzahl der Gitterpunkte',
          'Die Zeitschrittweite',
        ],
        correctIndex: 1,
        explanation: '$\\Delta x = L / N$ ist der Abstand zwischen zwei Gitterpunkten bei gleichmäßiger Teilung.',
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // 2. FDM
  // ═══════════════════════════════════════════════════════════════

  'fdm-taylor': {
    lessonId: 'fdm-taylor',
    questions: [
      {
        id: 'tay-1', type: 'formula-select',
        question: 'Die Vorwärtsdifferenz hat welche Fehlerordnung?',
        formula: '\\frac{\\partial \\phi}{\\partial x} \\approx \\frac{\\phi_{i+1} - \\phi_i}{\\Delta x}',
        options: ['$O(\\Delta x)$ — 1. Ordnung', '$O(\\Delta x^2)$ — 2. Ordnung', '$O(\\Delta x^3)$ — 3. Ordnung', '$O(1)$ — 0. Ordnung'],
        correctIndex: 0,
        explanation: 'Aus der Taylor-Reihe folgt: Vorwärtsdifferenz = 1. Ableitung + $O(\\Delta x)$ Abbruchfehler.',
      },
      {
        id: 'tay-2', type: 'formula-select',
        question: 'Die zentrale Differenz für die 1. Ableitung hat Ordnung:',
        formula: '\\frac{\\phi_{i+1} - \\phi_{i-1}}{2\\Delta x}',
        options: ['$O(\\Delta x)$', '$O(\\Delta x^2)$', '$O(\\Delta x^3)$', '$O(\\Delta x^4)$'],
        correctIndex: 1,
        explanation: 'Zentrale Differenzen für ungerade Ableitungen sind immer eine Ordnung höher als einseitige Differenzen.',
      },
      {
        id: 'tay-3', type: 'multiple-choice',
        question: 'Die Taylor-Reihe um $x_i$ lautet:',
        formula: '\\phi(x_i + \\Delta x) = \\phi_i + \\Delta x \\phi_i\' + \\frac{\\Delta x^2}{2!}\\phi_i\'\' + ...',
        options: [
          'Richtig — das ist die Taylor-Entwicklung nach rechts',
          'Falsch — es fehlt der Term $\\Delta x^0 / 0!$',
          'Falsch — die Vorzeichen alternieren immer',
          'Falsch — Taylor-Reihen gelten nur für Polynome',
        ],
        correctIndex: 0,
        explanation: 'Die Taylor-Reihe ist die Grundlage aller FD-Approximationen. Durch Umstellen erhält man Differenzenformeln.',
      },
    ],
  },

  'fdm-stencils': {
    lessonId: 'fdm-stencils',
    questions: [
      {
        id: 'sten-1', type: 'multiple-choice',
        question: 'Ein 3-Punkt-Stencil für die 2. Ableitung beinhaltet welche Punkte?',
        options: [
          '$\\phi_{i-1}, \\phi_i, \\phi_{i+1}$',
          '$\\phi_{i}, \\phi_{i+1}, \\phi_{i+2}$',
          '$\\phi_{i-2}, \\phi_i, \\phi_{i+2}$',
          '$\\phi_{i-1}, \\phi_{i+1}$ (ohne $\\phi_i$)',
        ],
        correctIndex: 0,
        explanation: 'Der Standard-Stencil für $\\phi\'\' \\approx \\frac{\\phi_{i-1} - 2\\phi_i + \\phi_{i+1}}{\\Delta x^2}$ nutzt die drei Nachbarpunkte.',
      },
      {
        id: 'sten-2', type: 'definition',
        question: 'Was ist ein "Stencil" in der FD-Methode?',
        options: [
          'Die grafische Darstellung der Lösung',
          'Die Menge der Gitterpunkte, die in eine Differenzenapproximation eingehen',
          'Ein spezieller Randbedingungs-Typ',
          'Die Zeitintegrationsmethode',
        ],
        correctIndex: 1,
        explanation: 'Der Stencil zeigt, welche Nachbarpunkte für die Berechnung an einem Punkt benötigt werden.',
      },
    ],
  },

  'fdm-1d-heat': {
    lessonId: 'fdm-1d-heat',
    questions: [
      {
        id: 'heat-1', type: 'formula-select',
        question: 'Die 1D Wärmeleitungsgleichung lautet:',
        options: [
          '$\\frac{\\partial T}{\\partial t} = \\alpha \\frac{\\partial^2 T}{\\partial x^2}$',
          '$\\frac{\\partial T}{\\partial t} + u \\frac{\\partial T}{\\partial x} = 0$',
          '$\\nabla^2 T = 0$',
          '$\\frac{\\partial T}{\\partial t} = -\\alpha T$',
        ],
        correctIndex: 0,
        explanation: 'Die Wärmeleitungsgleichung ist eine parabolische PDE: $\\partial_t T = \\alpha \\partial_{xx} T$.',
      },
      {
        id: 'heat-2', type: 'multiple-choice',
        question: 'Was ist die Fourier-Zahl $r$ und wann wird die explizite Methode instabil?',
        formula: 'r = \\frac{\\alpha \\Delta t}{\\Delta x^2}',
        options: [
          'Instabil für $r > 1$',
          'Instabil für $r > 0.5$',
          'Instabil für $r > 0.25$',
          'Immer stabil',
        ],
        correctIndex: 1,
        explanation: 'Die Von-Neumann-Analyse zeigt: expliziter Euler für Diffusion erfordert $r \\leq 0.5$ (1D).',
      },
      {
        id: 'heat-3', type: 'multiple-choice',
        question: 'Was passiert physikalisch bei der Wärmeleitung?',
        options: [
          'Wärme wird mit der Strömung transportiert',
          'Temperaturunterschiede gleichen sich durch molekulare Bewegung aus',
          'Wärme wird erzeugt',
          'Temperatur bleibt konstant',
        ],
        correctIndex: 1,
        explanation: 'Diffusion gleicht Gradienten aus — Wärme fließt von warm nach kalt (2. Hauptsatz).',
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // 3. FVM
  // ═══════════════════════════════════════════════════════════════

  'fvm-concept': {
    lessonId: 'fvm-concept',
    questions: [
      {
        id: 'fvc-1', type: 'definition',
        question: 'Was ist das Grundprinzip der Finite-Volumen-Methode?',
        options: [
          'Ableitungen durch Differenzenquotienten ersetzen',
          'Integration der Erhaltungsgleichung über ein Kontrollvolumen → Bilanzierung der Flüsse',
          'Variationsformulierung mit Basisfunktionen',
          'Spektrale Zerlegung in Fourier-Moden',
        ],
        correctIndex: 1,
        explanation: 'FVM integriert die Erhaltungsgleichung über jedes KV. Was reinfließt minus was rausfließt = Änderung im KV.',
      },
      {
        id: 'fvc-2', type: 'multiple-choice',
        question: 'Warum ist FVM automatisch konservativ?',
        options: [
          'Weil es höhere Ordnung hat als FDM',
          'Weil der Fluss durch eine gemeinsame Fläche für beide Nachbarzellen gleich ist',
          'Weil es unstrukturierte Gitter verwendet',
          'Weil es implizite Zeitintegration nutzt',
        ],
        correctIndex: 1,
        explanation: 'Der Fluss, der KV_i verlässt, ist exakt der Fluss, der KV_{i+1} betritt — keine Masse geht verloren.',
      },
    ],
  },

  'fvm-face-interpolation': {
    lessonId: 'fvm-face-interpolation',
    questions: [
      {
        id: 'fi-1', type: 'multiple-choice',
        question: 'Warum brauchen wir Face-Interpolation in FVM?',
        options: [
          'Die Lösung ist nur an Zellzentren definiert, aber Flüsse an Flächen gebraucht',
          'Um die Zeitableitung zu berechnen',
          'Um das Gitter zu verfeinern',
          'Um Randbedingungen zu setzen',
        ],
        correctIndex: 0,
        explanation: 'In FVM sind die Unbekannten Zellmittelwerte. Für die Flussberechnung brauchen wir Werte an den Zellflächen.',
      },
      {
        id: 'fi-2', type: 'multiple-choice',
        question: 'Was ist der Unterschied zwischen UDS und CDS bei Face-Interpolation?',
        options: [
          'UDS nimmt den Wert der stromaufwärts liegenden Zelle, CDS mittelt zwischen beiden Nachbarn',
          'UDS ist 2. Ordnung, CDS ist 1. Ordnung',
          'UDS ist für Diffusion, CDS für Konvektion',
          'Kein Unterschied',
        ],
        correctIndex: 0,
        explanation: 'UDS: $\\phi_f = \\phi_{\\text{upwind}}$ (1. Ordnung, diffusiv). CDS: $\\phi_f = (\\phi_i + \\phi_{i+1})/2$ (2. Ordnung, oszillierend).',
      },
    ],
  },

  'fvm-1d-convection': {
    lessonId: 'fvm-1d-convection',
    questions: [
      {
        id: 'conv-1', type: 'formula-select',
        question: 'Die 1D Konvektionsgleichung in Erhaltungsform:',
        options: [
          '$\\frac{\\partial \\phi}{\\partial t} + \\frac{\\partial (u\\phi)}{\\partial x} = 0$',
          '$\\frac{\\partial \\phi}{\\partial t} = \\Gamma \\frac{\\partial^2 \\phi}{\\partial x^2}$',
          '$u \\frac{\\partial \\phi}{\\partial x} = 0$ (stationär)',
          '$\\frac{\\partial^2 \\phi}{\\partial t^2} + \\frac{\\partial^2 \\phi}{\\partial x^2} = 0$',
        ],
        correctIndex: 0,
        explanation: 'Erhaltungsform: $\\partial_t \\phi + \\partial_x(u\\phi) = 0$. Der Fluss ist $F = u\\phi$.',
      },
      {
        id: 'conv-2', type: 'multiple-choice',
        question: 'Was passiert bei reiner Konvektion ohne Diffusion mit einem Anfangsprofil?',
        options: [
          'Es diffundiert langsam',
          'Es wird unverändert mit Geschwindigkeit u transportiert',
          'Es bleibt stehen',
          'Es invertiert sich',
        ],
        correctIndex: 1,
        explanation: 'Reine Konvektion = Translation. Das Profil wird ohne Formänderung verschoben: $\\phi(x,t) = \\phi_0(x - ut)$.',
      },
    ],
  },

  'fvm-fvm-vs-fdm': {
    lessonId: 'fvm-fvm-vs-fdm',
    questions: [
      {
        id: 'vfd-1', type: 'multiple-choice',
        question: 'Welcher Vorteil hat FVM gegenüber FDM?',
        options: [
          'FVM ist immer genauer', 'FVM ist automatisch konservativ und funktioniert auf unstrukturierten Gittern',
          'FVM braucht keine Randbedingungen', 'FVM ist einfacher zu implementieren',
        ],
        correctIndex: 1,
        explanation: 'FVM garantiert lokale Erhaltung (konservativ) und kann auf beliebigen Gittertypen arbeiten.',
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // 4. SCHEMATA
  // ═══════════════════════════════════════════════════════════════

  'schemes-uds': {
    lessonId: 'schemes-uds',
    questions: [
      {
        id: 'uds-1', type: 'multiple-choice',
        question: 'Was ist der Hauptnachteil von UDS (Upwind)?',
        options: ['Instabilität', 'Numerische Diffusion (verschmiert scharfe Gradienten)', 'Nur 2D möglich', 'Braucht implizite Zeitintegration'],
        correctIndex: 1,
        explanation: 'UDS ist 1. Ordnung — der Abbruchfehler wirkt wie zusätzliche künstliche Diffusion.',
      },
      {
        id: 'uds-2', type: 'formula-select',
        question: 'Die UDS-Interpolation an der östlichen Fläche (bei $u > 0$):',
        options: ['$\\phi_f = \\phi_P$', '$\\phi_f = \\phi_E$', '$\\phi_f = (\\phi_P + \\phi_E)/2$', '$\\phi_f = \\phi_P + \\phi_E$'],
        correctIndex: 0,
        explanation: 'Bei UDS wird immer der Wert der stromaufwärts liegenden Zelle genommen: $\\phi_f = \\phi_P$ wenn $u > 0$.',
      },
    ],
  },

  'schemes-cds': {
    lessonId: 'schemes-cds',
    questions: [
      {
        id: 'cds-1', type: 'multiple-choice',
        question: 'Wann werden CDS-Oszillationen besonders stark?',
        options: ['Bei kleinem Pe', 'Bei großem Pe (konvektionsdominiert)', 'Bei kleinem CFL', 'Bei feinem Gitter'],
        correctIndex: 1,
        explanation: 'CDS oszilliert wenn $Pe > 2$, weil die zentrale Interpolation die Transportrichtung ignoriert.',
      },
      {
        id: 'cds-2', type: 'formula-select',
        question: 'Die CDS-Interpolation:',
        options: ['$\\phi_f = (\\phi_P + \\phi_E) / 2$', '$\\phi_f = \\phi_P$', '$\\phi_f = \\max(\\phi_P, \\phi_E)$', '$\\phi_f = \\phi_E - \\phi_P$'],
        correctIndex: 0,
        explanation: 'CDS = lineares Mittel: $\\phi_f = (\\phi_P + \\phi_E)/2$. 2. Ordnung, aber unbeschränkt.',
      },
    ],
  },

  'schemes-tvd': {
    lessonId: 'schemes-tvd',
    questions: [
      {
        id: 'tvd-1', type: 'definition',
        question: 'Was bedeutet TVD?',
        options: ['Total Variation Diminishing', 'Time-Variable Discretization', 'Two-Volume Differencing', 'Transient Velocity Distribution'],
        correctIndex: 0,
        explanation: 'TVD = Total Variation Diminishing. Die Gesamtvariation der Lösung darf nicht wachsen → keine neuen Extrema.',
      },
      {
        id: 'tvd-2', type: 'multiple-choice',
        question: 'Was macht ein Flux-Limiter?',
        options: [
          'Begrenzt die Zeitschrittweite',
          'Schaltet zwischen hoher Ordnung (glatt) und niedriger Ordnung (steil) um',
          'Limitiert die maximale Geschwindigkeit',
          'Begrenzt den Diffusionskoeffizienten',
        ],
        correctIndex: 1,
        explanation: 'Der Limiter $\\psi(r)$ blended zwischen UDS (stabil) und einem High-Order-Schema. In glatten Bereichen: hohe Ordnung. An Sprüngen: UDS.',
      },
      {
        id: 'tvd-3', type: 'multiple-choice',
        question: 'Welcher Limiter ist am diffusivsten (vorsichtigsten)?',
        options: ['Superbee', 'van Leer', 'minmod', 'CDS (kein Limiter)'],
        correctIndex: 2,
        explanation: 'minmod ist der konservativste Limiter — er wählt die flachste Rekonstruktion und erzeugt die meiste numerische Diffusion.',
      },
    ],
  },

  'schemes-compare': {
    lessonId: 'schemes-compare',
    questions: [
      {
        id: 'sc-1', type: 'multiple-choice',
        question: 'Welches Schema liefert die schärfste Auflösung eines Sprungs ohne Oszillationen?',
        options: ['UDS', 'CDS', 'TVD Superbee', 'Alle gleich'],
        correctIndex: 2,
        explanation: 'Superbee ist der aggressivste TVD-Limiter — schärfste Kanten, aber noch monoton.',
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // 5. STABILITÄT
  // ═══════════════════════════════════════════════════════════════

  'stability-cfl': {
    lessonId: 'stability-cfl',
    questions: [
      {
        id: 'cfl-1', type: 'formula-select',
        question: 'Die CFL-Bedingung lautet:',
        options: [
          '$\\text{CFL} = |u| \\frac{\\Delta t}{\\Delta x} \\leq 1$',
          '$\\text{CFL} = \\frac{\\Delta x}{\\Delta t} \\leq 1$',
          '$\\text{CFL} = \\Gamma \\frac{\\Delta t}{\\Delta x^2} \\leq 1$',
          '$\\text{CFL} = \\frac{\\Delta x^2}{\\Delta t} \\leq 1$',
        ],
        correctIndex: 0,
        explanation: 'CFL = $|u|\\Delta t / \\Delta x$. Die physikalische Information darf pro Zeitschritt höchstens eine Zelle wandern.',
      },
      {
        id: 'cfl-2', type: 'multiple-choice',
        question: 'Was passiert, wenn CFL > 1 bei explizitem Euler?',
        options: [
          'Die Lösung wird genauer', 'Die Lösung divergiert (Instabilität)',
          'Nichts — CFL > 1 ist erlaubt', 'Die Lösung konvergiert schneller',
        ],
        correctIndex: 1,
        explanation: 'Bei CFL > 1 überspringt die Numerik Zellen, die Information enthalten — Störungen wachsen exponentiell.',
      },
      {
        id: 'cfl-3', type: 'multiple-choice',
        question: 'Wie kann man den Zeitschritt bei gegebenem CFL berechnen?',
        formula: '\\Delta t = \\text{CFL} \\cdot \\frac{\\Delta x}{|u|}',
        options: [
          'Δt wird größer bei feinerem Gitter',
          'Δt wird kleiner bei feinerem Gitter (bei gleichem CFL)',
          'Δt hängt nicht von Δx ab',
          'Δt wird größer bei höherer Geschwindigkeit',
        ],
        correctIndex: 1,
        explanation: '$\\Delta t = CFL \\cdot \\Delta x / |u|$. Feineres Gitter → kleineres $\\Delta x$ → kleineres $\\Delta t$.',
      },
    ],
  },

  'stability-peclet': {
    lessonId: 'stability-peclet',
    questions: [
      {
        id: 'pe-1', type: 'formula-select',
        question: 'Die Gitter-Peclet-Zahl ist definiert als:',
        options: [
          '$Pe = \\frac{|u| \\Delta x}{\\Gamma}$',
          '$Pe = \\frac{\\Gamma}{|u| \\Delta x}$',
          '$Pe = |u| \\cdot \\Gamma \\cdot \\Delta x$',
          '$Pe = \\frac{|u| \\Delta t}{\\Delta x}$ (das ist CFL)',
        ],
        correctIndex: 0,
        explanation: 'Pe vergleicht Konvektion ($|u|\\Delta x$) mit Diffusion ($\\Gamma$). Pe > 2 → CDS oszilliert.',
      },
      {
        id: 'pe-2', type: 'multiple-choice',
        question: 'Bei Pe >> 1 dominiert:',
        options: ['Diffusion', 'Konvektion', 'Beides gleich', 'Keines'],
        correctIndex: 1,
        explanation: 'Große Peclet-Zahl = Konvektion dominiert. Die Strömung "bläst" schneller als Diffusion mischen kann.',
      },
    ],
  },

  'stability-vonneumann': {
    lessonId: 'stability-vonneumann',
    questions: [
      {
        id: 'vn-1', type: 'definition',
        question: 'Was analysiert die Von-Neumann-Stabilitätsanalyse?',
        options: [
          'Die Konvergenz des Gitters',
          'Den Verstärkungsfaktor |G| einzelner Fourier-Moden pro Zeitschritt',
          'Die Genauigkeit der Randbedingungen',
          'Die Ordnung des Diskretisierungsschemas',
        ],
        correctIndex: 1,
        explanation: 'Man setzt $\\phi = G^n e^{ik x}$ ein und prüft: $|G| \\leq 1$? Wenn ja → stabil.',
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // 6. KONVEKTION-DIFFUSION
  // ═══════════════════════════════════════════════════════════════

  'convdiff-1d': {
    lessonId: 'convdiff-1d',
    questions: [
      {
        id: 'cd-1', type: 'formula-select',
        question: 'Die Konvektion-Diffusion-Gleichung:',
        options: [
          '$\\frac{\\partial \\phi}{\\partial t} + u\\frac{\\partial \\phi}{\\partial x} = \\Gamma \\frac{\\partial^2 \\phi}{\\partial x^2}$',
          '$\\frac{\\partial \\phi}{\\partial t} = \\Gamma \\frac{\\partial^2 \\phi}{\\partial x^2}$',
          '$u\\frac{\\partial \\phi}{\\partial x} = 0$',
          '$\\frac{\\partial \\phi}{\\partial t} = -\\phi$',
        ],
        correctIndex: 0,
        explanation: 'Konvektion (Transport durch Strömung) + Diffusion (molekulare Mischung) = das allgemeine skalare Transportproblem.',
      },
    ],
  },

  'convdiff-peclet-effect': {
    lessonId: 'convdiff-peclet-effect',
    questions: [
      {
        id: 'cpe-1', type: 'multiple-choice',
        question: 'Bei sehr niedrigem Pe (Pe << 1), wie sieht die Lösung aus?',
        options: [
          'Scharfe Fronten ohne Verschmierung',
          'Glatte, symmet. Lösung — Diffusion dominiert',
          'Oszillierende Lösung',
          'Stationäre Lösung verschwindet',
        ],
        correctIndex: 1,
        explanation: 'Bei Pe << 1 dominiert Diffusion. Die Lösung wird schnell glatt und symmetrisch.',
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // 7. 2D
  // ═══════════════════════════════════════════════════════════════

  '2d-grid': {
    lessonId: '2d-grid',
    questions: [
      {
        id: '2dg-1', type: 'multiple-choice',
        question: 'Wie viele Flächennachbarn hat eine innere Zelle in einem 2D kartesischen Gitter?',
        options: ['2', '4', '6', '8'],
        correctIndex: 1,
        explanation: 'In 2D hat jede Zelle 4 Flächen: Ost, West, Nord, Süd. In 3D wären es 6.',
      },
    ],
  },

  '2d-scalar': {
    lessonId: '2d-scalar',
    questions: [
      {
        id: '2ds-1', type: 'multiple-choice',
        question: 'Beim 2D Skalartransport in einem Rotationsfeld: Was passiert mit einem Gauß-Blob?',
        options: [
          'Er wird zum Rand transportiert',
          'Er rotiert um das Zentrum (idealerweise formerhaltend)',
          'Er verschwindet sofort',
          'Er teilt sich in zwei Blobs',
        ],
        correctIndex: 1,
        explanation: 'In einem Rotationsfeld dreht sich der Blob auf einer Kreisbahn. Numerische Diffusion verschmiert ihn mit der Zeit.',
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // 8. INKOMPRESSIBEL
  // ═══════════════════════════════════════════════════════════════

  'incomp-ns': {
    lessonId: 'incomp-ns',
    questions: [
      {
        id: 'ns-1', type: 'formula-select',
        question: 'Die Kontinuitätsgleichung für inkompressible Strömung:',
        options: ['$\\nabla \\cdot \\vec{u} = 0$', '$\\frac{\\partial \\rho}{\\partial t} + \\nabla \\cdot (\\rho \\vec{u}) = 0$', '$\\nabla^2 p = 0$', '$\\frac{\\partial \\vec{u}}{\\partial t} = 0$'],
        correctIndex: 0,
        explanation: 'Bei konstanter Dichte ($\\rho = const$) vereinfacht sich die Massenerhaltung zu $\\nabla \\cdot \\vec{u} = 0$ (divergenzfrei).',
      },
      {
        id: 'ns-2', type: 'multiple-choice',
        question: 'Was macht die inkompressiblen N-S-Gleichungen schwer zu lösen?',
        options: [
          'Sie sind linear',
          'Es gibt keine Gleichung für den Druck — er muss so bestimmt werden, dass $\\nabla \\cdot \\vec{u} = 0$ erfüllt ist',
          'Sie haben keine Randbedingungen',
          'Sie sind nur 1D anwendbar',
        ],
        correctIndex: 1,
        explanation: 'Der Druck ist kein prognostischer, sondern ein diagnostischer Variable — er erzwingt die Inkompressibilität.',
      },
      {
        id: 'ns-3', type: 'formula-select',
        question: 'Die Impulsgleichung (Navier-Stokes) für inkompressible Newtonsche Fluide:',
        formula: '\\rho \\left(\\frac{\\partial \\vec{u}}{\\partial t} + (\\vec{u} \\cdot \\nabla)\\vec{u}\\right) = ?',
        options: [
          '$-\\nabla p + \\mu \\nabla^2 \\vec{u} + \\rho \\vec{g}$',
          '$\\nabla p + \\mu \\nabla^2 \\vec{u}$',
          '$-\\nabla p$',
          '$\\mu \\nabla^2 \\vec{u}$',
        ],
        correctIndex: 0,
        explanation: 'Druckgradient + viskose Terme + Volumenkräfte auf der rechten Seite.',
      },
    ],
  },

  'incomp-simple': {
    lessonId: 'incomp-simple',
    questions: [
      {
        id: 'sim-1', type: 'definition',
        question: 'Wofür steht SIMPLE?',
        options: [
          'Semi-Implicit Method for Pressure-Linked Equations',
          'Standard Integration Method for Partial Linear Equations',
          'Simplified Implicit Pressure-Level Extraction',
          'Sequential Iterative Method for Pressure and Linearization',
        ],
        correctIndex: 0,
        explanation: 'SIMPLE = Semi-Implicit Method for Pressure-Linked Equations (Patankar & Spalding, 1972).',
      },
      {
        id: 'sim-2', type: 'multiple-choice',
        question: 'Was sind die Schritte im SIMPLE-Algorithmus?',
        options: [
          '1. Impuls lösen → 2. Druck-Poisson lösen → 3. Geschwindigkeit korrigieren → wiederholen',
          '1. Druck raten → 2. Energie lösen → 3. Impuls korrigieren',
          '1. Gitter verfeinern → 2. Gleichung lösen → 3. Fehler prüfen',
          '1. Turbulenzmodell wählen → 2. Impuls lösen → 3. Fertig',
        ],
        correctIndex: 0,
        explanation: 'SIMPLE: Geschätzter Druck → Impulsgleichung → Druckkorrektur aus Kontinuität → Geschwindigkeitskorrektur → iterieren.',
      },
    ],
  },

  'incomp-cavity': {
    lessonId: 'incomp-cavity',
    questions: [
      {
        id: 'cav-1', type: 'multiple-choice',
        question: 'Bei der Lid-Driven Cavity: Was treibt die Strömung an?',
        options: [
          'Ein Druckgradient',
          'Die bewegte Wand (Deckel) überträgt Impuls durch Viskosität',
          'Gravitation',
          'Ein externer Ventilator',
        ],
        correctIndex: 1,
        explanation: 'Der Deckel bewegt sich mit konstanter Geschwindigkeit. Durch Haftbedingung und Viskosität wird das Fluid mitgezogen.',
      },
      {
        id: 'cav-2', type: 'multiple-choice',
        question: 'Was passiert bei steigender Reynolds-Zahl in der Cavity?',
        options: [
          'Die Strömung wird langsamer',
          'Es bilden sich zusätzliche Sekundärwirbel in den Ecken',
          'Die Strömung wird stationär und symmetrisch',
          'Der Druckgradient verschwindet',
        ],
        correctIndex: 1,
        explanation: 'Bei höherem Re entstehen Sekundärwirbel in den unteren Ecken. Ab Re ≈ 8000 wird die Strömung instationär.',
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // 9. ALGORITHMEN (coming with new chapter)
  // ═══════════════════════════════════════════════════════════════

  'algo-linear-systems': {
    lessonId: 'algo-linear-systems',
    questions: [
      {
        id: 'als-1', type: 'definition',
        question: 'Warum entsteht bei der Diskretisierung ein lineares Gleichungssystem $A\\vec{x} = \\vec{b}$?',
        options: [
          'Weil die PDE immer linear ist',
          'Weil die Diskretisierung die PDE in algebraische Beziehungen zwischen Nachbarzellen übersetzt',
          'Weil der Computer nur Matrizen versteht',
          'Weil die Randbedingungen linear sind',
        ],
        correctIndex: 1,
        explanation: 'Jede FD/FV-Approximation ergibt eine Gleichung pro Zelle: $a_P \\phi_P + \\sum a_{nb} \\phi_{nb} = b_P$.',
      },
      {
        id: 'als-2', type: 'multiple-choice',
        question: 'Die Koeffizientenmatrix A in CFD ist typischerweise:',
        options: ['Voll besetzt (dicht)', 'Dünn besetzt (sparse) — nur wenige Nicht-Null-Einträge pro Zeile', 'Diagonal', 'Symmetrisch positiv definit (immer)'],
        correctIndex: 1,
        explanation: 'Jede Zelle interagiert nur mit wenigen Nachbarn → die Matrix ist sparse (z.B. 5 oder 7 Nicht-Null-Einträge pro Zeile in 2D/3D).',
      },
    ],
  },

  'algo-iterative': {
    lessonId: 'algo-iterative',
    questions: [
      {
        id: 'ait-1', type: 'multiple-choice',
        question: 'Was ist der Unterschied zwischen Jacobi und Gauss-Seidel?',
        options: [
          'Jacobi nutzt nur alte Werte, Gauss-Seidel nutzt bereits aktualisierte Werte im selben Sweep',
          'Jacobi ist immer schneller', 'Gauss-Seidel braucht kein Anfangswert', 'Kein Unterschied in der Konvergenz',
        ],
        correctIndex: 0,
        explanation: 'Jacobi: $x_i^{(k+1)} = f(x^{(k)})$. Gauss-Seidel: $x_i^{(k+1)} = f(x_1^{(k+1)}, ..., x_{i-1}^{(k+1)}, x_{i+1}^{(k)}, ...)$ — nutzt sofort neue Werte.',
      },
      {
        id: 'ait-2', type: 'definition',
        question: 'Was bedeutet "Konvergenz" bei einem iterativen Solver?',
        options: [
          'Die Lösung ist exakt nach 1 Iteration',
          'Das Residuum $\\|A\\vec{x}^{(k)} - \\vec{b}\\|$ fällt mit jeder Iteration und nähert sich 0',
          'Die Lösung divergiert',
          'Die Matrix wird invertiert',
        ],
        correctIndex: 1,
        explanation: 'Konvergenz: $\\|r^{(k)}\\| \\to 0$. Das Residuum muss unter eine Toleranz fallen (z.B. $10^{-6}$).',
      },
      {
        id: 'ait-3', type: 'multiple-choice',
        question: 'Warum nutzt man in CFD iterative statt direkte Löser?',
        options: [
          'Iterative Löser sind immer genauer',
          'Die Matrizen sind groß und sparse — direkte Löser (LU-Zerlegung) wären zu speicherintensiv',
          'Direkte Löser gibt es nicht',
          'Iterative Löser brauchen keinen Speicher',
        ],
        correctIndex: 1,
        explanation: 'Bei Millionen Zellen wäre die LU-Zerlegung extrem teuer. Iterative Methoden nutzen die Sparse-Struktur effizient.',
      },
    ],
  },

  'algo-multigrid': {
    lessonId: 'algo-multigrid',
    questions: [
      {
        id: 'mg-1', type: 'definition',
        question: 'Was ist die Grundidee von Multigrid?',
        options: [
          'Mehr Gitterpunkte = bessere Lösung',
          'Langwellige Fehler werden auf groben Gittern effizient gedämpft, kurzwellige auf feinen Gittern',
          'Man löst nur auf dem gröbsten Gitter',
          'Man verwendet mehrere verschiedene Schemata',
        ],
        correctIndex: 1,
        explanation: 'Iterative Löser (Jacobi/GS) dämpfen hochfrequente Fehler schnell, aber niederfrequente langsam. Auf groben Gittern werden diese zu hochfrequenten Fehlern!',
      },
      {
        id: 'mg-2', type: 'multiple-choice',
        question: 'Was ist ein V-Zyklus?',
        options: [
          'Vorverdichtung → Lösung → Nachrelaxation',
          'Glätten auf feinstem Gitter → Restriktion auf grobe Gitter → Lösung → Prolongation zurück → Glätten',
          'Zweimal die gleiche Lösung berechnen',
          'Die Geschwindigkeit V berechnen',
        ],
        correctIndex: 1,
        explanation: 'V-Zyklus: Fein→Grob (Restriktion) → Grob lösen → Grob→Fein (Prolongation). Die Form im Gitterlevel-Diagramm sieht aus wie ein V.',
      },
    ],
  },

  'algo-underrelaxation': {
    lessonId: 'algo-underrelaxation',
    questions: [
      {
        id: 'ur-1', type: 'formula-select',
        question: 'Die Unterrelaxation lautet:',
        options: [
          '$\\phi^{new} = \\phi^{old} + \\alpha(\\phi^{*} - \\phi^{old})$, mit $0 < \\alpha < 1$',
          '$\\phi^{new} = 2\\phi^{*} - \\phi^{old}$',
          '$\\phi^{new} = \\phi^{*}$',
          '$\\phi^{new} = \\phi^{old} / \\alpha$',
        ],
        correctIndex: 0,
        explanation: 'Unterrelaxation ($\\alpha < 1$) dämpft die Änderung pro Iteration, um Instabilitäten durch Nichtlinearitäten zu vermeiden.',
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // 10. KOMPRESSIBLE STRÖMUNGEN
  // ═══════════════════════════════════════════════════════════════

  'comp-euler': {
    lessonId: 'comp-euler',
    questions: [
      {
        id: 'ce-1', type: 'formula-select',
        question: 'Die Euler-Gleichungen beschreiben:',
        options: [
          'Reibungsfreie kompressible Strömung (Masse, Impuls, Energie)',
          'Nur inkompressible Strömung',
          'Nur die Energiegleichung',
          'Stationäre Potentialströmung',
        ],
        correctIndex: 0,
        explanation: 'Euler-Gleichungen = Navier-Stokes ohne Viskosität. System von Erhaltungsgleichungen für $\\rho$, $\\rho\\vec{u}$, $\\rho E$.',
      },
      {
        id: 'ce-2', type: 'multiple-choice',
        question: 'Was ist die Mach-Zahl?',
        formula: 'Ma = \\frac{|u|}{a}',
        options: [
          'Verhältnis von Trägheitskraft zu Viskosität (Reynolds)',
          'Verhältnis von Strömungsgeschwindigkeit zu Schallgeschwindigkeit',
          'Verhältnis von Konvektion zu Diffusion (Peclet)',
          'Verhältnis von Druck zu Dichte',
        ],
        correctIndex: 1,
        explanation: '$Ma = |u|/a$, wobei $a = \\sqrt{\\gamma R T}$ die Schallgeschwindigkeit ist. Ma > 1 = Überschall.',
      },
      {
        id: 'ce-3', type: 'multiple-choice',
        question: 'Die Schallgeschwindigkeit in einem idealen Gas:',
        formula: 'a = \\sqrt{\\gamma \\frac{p}{\\rho}} = \\sqrt{\\gamma R T}',
        options: [
          'Hängt nur von der Temperatur ab (bei idealem Gas)',
          'Hängt nur vom Druck ab',
          'Ist immer 340 m/s',
          'Hängt von der Geschwindigkeit ab',
        ],
        correctIndex: 0,
        explanation: 'Für ein ideales Gas: $a = \\sqrt{\\gamma R T}$. Bei Luft ($\\gamma=1.4$, $R=287$) und $T=293K$: $a \\approx 343$ m/s.',
      },
    ],
  },

  'comp-riemann': {
    lessonId: 'comp-riemann',
    questions: [
      {
        id: 'cr-1', type: 'definition',
        question: 'Was ist ein Riemann-Problem?',
        options: [
          'Ein beliebiges 3D-Strömungsproblem',
          'Ein Anfangswertproblem mit stückweise konstantem Zustand und einer Diskontinuität',
          'Die stationäre Lösung der Euler-Gleichungen',
          'Ein Problem mit nur Schallwellen',
        ],
        correctIndex: 1,
        explanation: 'Das Riemann-Problem hat zwei konstante Zustände getrennt durch eine Diskontinuität. Die Lösung enthält Stoß, Kontakt und Verdünnungsfächer.',
      },
      {
        id: 'cr-2', type: 'multiple-choice',
        question: 'Welche Wellentypen treten in der Lösung des Riemann-Problems auf?',
        options: [
          'Nur Stoßwellen',
          'Stoßwelle, Kontaktdiskontinuität, Verdünnungsfächer (Rarefaction)',
          'Nur Schallwellen',
          'Nur elektromagnetische Wellen',
        ],
        correctIndex: 1,
        explanation: 'Die exakte Lösung hat drei Wellentypen: linke Welle (Stoß oder Verdünnung), Kontaktdiskontinuität, rechte Welle (Stoß oder Verdünnung).',
      },
    ],
  },

  'comp-godunov': {
    lessonId: 'comp-godunov',
    questions: [
      {
        id: 'cg-1', type: 'multiple-choice',
        question: 'Was ist die Grundidee von Godunovs Methode?',
        options: [
          'Zentrale Differenzen für Euler-Gleichungen',
          'An jeder Zellfläche wird ein Riemann-Problem gelöst, um den Fluss zu bestimmen',
          'Künstliche Viskosität addieren',
          'Implizite Zeitintegration nutzen',
        ],
        correctIndex: 1,
        explanation: 'Godunov: Jede Zellfläche = lokales Riemann-Problem. Der Fluss folgt aus der (exakten oder approximierten) Riemann-Lösung.',
      },
      {
        id: 'cg-2', type: 'definition',
        question: 'Was ist ein "approximativer Riemann-Löser"?',
        options: [
          'Die exakte Lösung des Riemann-Problems',
          'Eine vereinfachte Schätzung des Flusses an einer Zellfläche (z.B. Roe, HLL, HLLC)',
          'Ein Löser nur für inkompressible Strömungen',
          'Ein direkter Matrixlöser',
        ],
        correctIndex: 1,
        explanation: 'Da die exakte Riemann-Lösung teuer ist, nutzt man Approximationen: Roe-Löser, HLL, HLLC, Rusanov etc.',
      },
    ],
  },

  'comp-shocktube': {
    lessonId: 'comp-shocktube',
    questions: [
      {
        id: 'cst-1', type: 'multiple-choice',
        question: 'Was passiert beim Sod-Shock-Tube-Problem?',
        options: [
          'Zwei Gase mit unterschiedlichem Druck sind durch eine Membran getrennt — zur Zeit t=0 reißt die Membran',
          'Gas wird gleichmäßig erwärmt',
          'Eine stationäre Düsenströmung entsteht',
          'Eine akustische Welle reflektiert an einer Wand',
        ],
        correctIndex: 0,
        explanation: 'Sod (1978): Links hoher Druck, rechts niedriger Druck. Nach Membranbruch bilden sich Stoß, Kontakt und Verdünnungsfächer.',
      },
      {
        id: 'cst-2', type: 'multiple-choice',
        question: 'Welche Probleme hat ein einfaches Zentralschema bei Stoßwellen?',
        options: [
          'Es ist extrem genau',
          'Es erzeugt unphysikalische Oszillationen (Gibbs-Phänomen) an Diskontinuitäten',
          'Es ist zu diffusiv',
          'Es funktioniert gar nicht',
        ],
        correctIndex: 1,
        explanation: 'Zentralschemata haben keinen eingebauten Upwind-Mechanismus. An Stößen erzeugen sie Über-/Unterschwinger.',
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // 11. TURBULENZ
  // ═══════════════════════════════════════════════════════════════

  'turb-intro': {
    lessonId: 'turb-intro',
    questions: [
      {
        id: 'ti-1', type: 'definition',
        question: 'Was charakterisiert turbulente Strömung?',
        options: [
          'Laminare, geordnete Stromlinien',
          'Chaotische, dreidimensionale, instationäre Schwankungen auf vielen Skalen',
          'Stationäre Strömung bei hoher Viskosität',
          'Strömung nur in Rohren',
        ],
        correctIndex: 1,
        explanation: 'Turbulenz: irregulär, dreidimensional, dissipativ, mit einem breiten Spektrum von Wirbelgrößen.',
      },
      {
        id: 'ti-2', type: 'multiple-choice',
        question: 'Ab welcher Reynolds-Zahl wird Rohrströmung typischerweise turbulent?',
        options: ['Re ≈ 100', 'Re ≈ 2300', 'Re ≈ 10.000', 'Re ≈ 1.000.000'],
        correctIndex: 1,
        explanation: 'In Rohren ist der kritische Reynolds-Wert Re ≈ 2300 (für Kanal Re ≈ 5772 als linearer Stabilitäts-Grenzwert).',
      },
      {
        id: 'ti-3', type: 'formula-select',
        question: 'Die Kolmogorov-Längenskala (kleinste Wirbelgröße):',
        formula: '\\eta = \\left(\\frac{\\nu^3}{\\varepsilon}\\right)^{1/4}',
        options: [
          'Hängt von Viskosität und Dissipationsrate ab',
          'Ist immer 1 mm',
          'Hängt nur von der Geschwindigkeit ab',
          'Ist gleich der Gittergröße',
        ],
        correctIndex: 0,
        explanation: '$\\eta = (\\nu^3/\\varepsilon)^{1/4}$. Je höher Re, desto kleiner $\\eta$ → desto mehr Gitterpunkte bräuchte DNS.',
      },
    ],
  },

  'turb-rans': {
    lessonId: 'turb-rans',
    questions: [
      {
        id: 'tr-1', type: 'definition',
        question: 'Was bedeutet RANS?',
        options: [
          'Reynolds-Averaged Navier-Stokes',
          'Rapid Approximation of Numerical Solutions',
          'Rotational Analysis of Non-Steady flows',
          'Reynolds Algebraic Navier-Stokes',
        ],
        correctIndex: 0,
        explanation: 'RANS = Reynolds-Averaged Navier-Stokes. Die Navier-Stokes-Gleichungen werden zeitlich gemittelt.',
      },
      {
        id: 'tr-2', type: 'formula-select',
        question: 'Die Reynolds-Zerlegung:',
        formula: 'u = \\bar{u} + u\'',
        options: [
          'Geschwindigkeit = Mittelwert + Schwankung',
          'Geschwindigkeit = Druck + Viskosität',
          'Geschwindigkeit = x-Komponente + y-Komponente',
          'Geschwindigkeit = alt + neu',
        ],
        correctIndex: 0,
        explanation: '$u = \\bar{u} + u\'$. Jede Größe wird in Mittelwert (zeitlich gemittelt) und Schwankungsanteil zerlegt.',
      },
      {
        id: 'tr-3', type: 'multiple-choice',
        question: 'Was ist der Reynolds-Spannungstensor?',
        formula: '\\tau_{ij}^R = -\\rho \\overline{u_i\' u_j\'}',
        options: [
          'Die laminaren Schubspannungen',
          'Scheinbare Spannungen durch turbulente Schwankungen — das Schließungsproblem der Turbulenz',
          'Der Druck an der Wand',
          'Die Gravitationskraft',
        ],
        correctIndex: 1,
        explanation: 'Die Reynolds-Mittelung erzeugt 6 neue Unbekannte ($\\overline{u_i\' u_j\'}$), aber keine neuen Gleichungen → Schließungsproblem!',
      },
    ],
  },

  'turb-ke': {
    lessonId: 'turb-ke',
    questions: [
      {
        id: 'ke-1', type: 'multiple-choice',
        question: 'Was modelliert das k-ε-Modell?',
        options: [
          'Nur den Druck',
          'Die turbulente kinetische Energie k und die Dissipationsrate ε mit je einer Transportgleichung',
          'Die exakte Turbulenzstruktur',
          'Nur die Wandreibung',
        ],
        correctIndex: 1,
        explanation: 'k-ε: Zwei Gleichungen für $k = \\frac{1}{2}\\overline{u_i\' u_i\'}$ und $\\varepsilon$ (Dissipationsrate). Daraus: $\\nu_t = C_\\mu k^2/\\varepsilon$.',
      },
      {
        id: 'ke-2', type: 'formula-select',
        question: 'Die turbulente Viskosität im k-ε-Modell:',
        options: [
          '$\\nu_t = C_\\mu \\frac{k^2}{\\varepsilon}$',
          '$\\nu_t = k \\cdot \\varepsilon$',
          '$\\nu_t = \\sqrt{k / \\varepsilon}$',
          '$\\nu_t = C_\\mu k$',
        ],
        correctIndex: 0,
        explanation: '$\\nu_t = C_\\mu k^2/\\varepsilon$ mit $C_\\mu = 0.09$. Dimensionsanalyse: $[k^2/\\varepsilon] = m^2/s$ — passt!',
      },
      {
        id: 'ke-3', type: 'multiple-choice',
        question: 'Was ist der Hauptnachteil des Standard k-ε-Modells?',
        options: [
          'Es hat zu viele Gleichungen',
          'Es überschätzt die Turbulenz in Staupunktströmungen und versagt bei starker Stromlinienkrümmung',
          'Es ist instabil',
          'Es funktioniert nur in 1D',
        ],
        correctIndex: 1,
        explanation: 'k-ε überschätzt k an Staupunkten und versagt bei Ablösung, starker Krümmung und Rotation.',
      },
    ],
  },

  'turb-kw-sst': {
    lessonId: 'turb-kw-sst',
    questions: [
      {
        id: 'kw-1', type: 'multiple-choice',
        question: 'Was ist der Vorteil des k-ω-Modells gegenüber k-ε?',
        options: [
          'k-ω braucht keine Wandfunktionen — es kann bis zur Wand integriert werden',
          'k-ω ist schneller',
          'k-ω hat weniger Konstanten',
          'k-ω funktioniert nur für laminare Strömung',
        ],
        correctIndex: 0,
        explanation: 'k-ω (Wilcox) löst bis zur Wand auf. ε → ∞ an der Wand, aber ω bleibt endlich → einfachere Wandbehandlung.',
      },
      {
        id: 'kw-2', type: 'definition',
        question: 'Was macht das SST-Modell (Menter)?',
        options: [
          'Es nutzt nur k-ε überall',
          'Es blendet k-ω (wandnah) und k-ε (freie Strömung) ineinander → Vorteile beider Modelle',
          'Es löst die DNS-Gleichungen',
          'Es verwendet keine Transportgleichungen',
        ],
        correctIndex: 1,
        explanation: 'SST = Shear Stress Transport. Blending-Funktion: k-ω an der Wand, k-ε im Fernfeld. Der Industriestandard!',
      },
    ],
  },

  'turb-les': {
    lessonId: 'turb-les',
    questions: [
      {
        id: 'les-1', type: 'definition',
        question: 'Was ist LES (Large Eddy Simulation)?',
        options: [
          'Alle Skalen werden modelliert',
          'Große Wirbel werden direkt berechnet, kleine Wirbel (Subgrid) werden modelliert',
          'Nur die größten Wirbel werden betrachtet, der Rest wird ignoriert',
          'Eine vereinfachte RANS-Methode',
        ],
        correctIndex: 1,
        explanation: 'LES löst die gefilterten N-S-Gleichungen. Strukturen > Filtergröße werden aufgelöst, kleinere über ein SGS-Modell beschrieben.',
      },
      {
        id: 'les-2', type: 'multiple-choice',
        question: 'Das einfachste SGS-Modell in LES ist:',
        options: [
          'k-ε', 'Smagorinsky-Modell ($\\nu_{sgs} = (C_S \\Delta)^2 |\\bar{S}|$)', 'RANS', 'DNS (kein Modell nötig)'],
        correctIndex: 1,
        explanation: 'Smagorinsky (1963): $\\nu_{sgs} = (C_S \\Delta)^2 |\\bar{S}|$. Einfach, aber mit bekannten Schwächen (zu dissipativ an Wänden).',
      },
      {
        id: 'les-3', type: 'multiple-choice',
        question: 'Was ist der Rechenaufwand von LES im Vergleich zu RANS?',
        options: [
          'Gleich', 'Wesentlich höher — LES braucht feines Gitter und instationäre Berechnung',
          'Geringer', 'LES braucht kein Gitter',
        ],
        correctIndex: 1,
        explanation: 'LES: ~$Re^{13/7}$ Gitterpunkte (vs. DNS: ~$Re^{9/4}$). Plus instationär → viele Zeitschritte. Faktor 100-1000× gegenüber RANS.',
      },
    ],
  },

  'turb-dns': {
    lessonId: 'turb-dns',
    questions: [
      {
        id: 'dns-1', type: 'multiple-choice',
        question: 'Wie viele Gitterpunkte braucht DNS ungefähr?',
        formula: 'N \\sim Re^{9/4} \\quad (\\text{3D})',
        options: [
          '$N \\sim Re$',
          '$N \\sim Re^{9/4}$ (pro Richtung: $Re^{3/4}$)',
          '$N \\sim \\log(Re)$',
          '$N \\sim \\sqrt{Re}$',
        ],
        correctIndex: 1,
        explanation: 'DNS muss alle Skalen bis zur Kolmogorov-Skala auflösen: $L/\\eta \\sim Re^{3/4}$ pro Richtung → $N_{3D} \\sim Re^{9/4}$.',
      },
    ],
  },

  'turb-wall': {
    lessonId: 'turb-wall',
    questions: [
      {
        id: 'tw-1', type: 'formula-select',
        question: 'Die dimensionslose Wanddistanz $y^+$ ist definiert als:',
        options: [
          '$y^+ = \\frac{y \\cdot u_\\tau}{\\nu}$',
          '$y^+ = \\frac{y}{L}$',
          '$y^+ = y \\cdot Re$',
          '$y^+ = \\frac{\\nu}{y}$',
        ],
        correctIndex: 0,
        explanation: '$y^+ = y u_\\tau / \\nu$ mit $u_\\tau = \\sqrt{\\tau_w / \\rho}$ (Schubspannungsgeschwindigkeit). Beschreibt die Wandnähe in Wandeinheiten.',
      },
      {
        id: 'tw-2', type: 'multiple-choice',
        question: 'Was gilt in der viskosen Unterschicht ($y^+ < 5$)?',
        options: [
          '$u^+ = y^+$ (lineares Profil)',
          '$u^+ = \\frac{1}{\\kappa} \\ln(y^+) + B$ (Log-Gesetz)',
          '$u^+ = const$',
          '$u^+ = (y^+)^2$',
        ],
        correctIndex: 0,
        explanation: 'Direkt an der Wand dominiert Viskosität: $u^+ = y^+$. Ab $y^+ \\approx 30$ gilt das logarithmische Wandgesetz.',
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // 12. ZWEIPHASENSTRÖMUNGEN
  // ═══════════════════════════════════════════════════════════════

  'twophase-intro': {
    lessonId: 'twophase-intro',
    questions: [
      {
        id: 'tp-1', type: 'definition',
        question: 'Was ist eine Zweiphasenströmung?',
        options: [
          'Strömung mit zwei verschiedenen Geschwindigkeiten',
          'Gleichzeitiges Vorhandensein zweier Phasen (z.B. Flüssigkeit + Gas) in einer Strömung',
          'Strömung in zwei Dimensionen',
          'Strömung bei zwei verschiedenen Temperaturen',
        ],
        correctIndex: 1,
        explanation: 'Zweiphasenströmung: z.B. Wasser + Luft (Blasen), Öl + Gas (Pipeline), Tropfen in Luft (Spray).',
      },
      {
        id: 'tp-2', type: 'multiple-choice',
        question: 'Was ist die Hauptschwierigkeit bei der Simulation von Zweiphasenströmungen?',
        options: [
          'Die Gleichungen sind zu einfach',
          'Die Grenzfläche zwischen den Phasen muss genau verfolgt werden (Topologieänderungen, Oberflächenspannung)',
          'Es gibt keine Erhaltungsgleichungen',
          'Nur laminare Strömung ist möglich',
        ],
        correctIndex: 1,
        explanation: 'Die Phasengrenzfläche ist eine freie Oberfläche, die sich bewegt, verformt, aufbrechen und verschmelzen kann.',
      },
    ],
  },

  'twophase-vof': {
    lessonId: 'twophase-vof',
    questions: [
      {
        id: 'vof-1', type: 'definition',
        question: 'Was ist die VOF-Methode (Volume of Fluid)?',
        options: [
          'Man verfolgt die Grenzfläche mit Markern',
          'Man transportiert einen Volumenfüllfaktor α ∈ [0,1], der den Phasenanteil pro Zelle angibt',
          'Man löst separate Gleichungen auf separaten Gittern',
          'Man verwendet nur eine Phase und ignoriert die andere',
        ],
        correctIndex: 1,
        explanation: 'VOF: $\\alpha = 0$ (Phase 1), $\\alpha = 1$ (Phase 2), $0 < \\alpha < 1$ (Grenzflächenzelle). Transport: $\\partial_t \\alpha + \\vec{u} \\cdot \\nabla \\alpha = 0$.',
      },
      {
        id: 'vof-2', type: 'multiple-choice',
        question: 'Was ist das Problem bei der Advection von α ohne spezielle Behandlung?',
        options: [
          'α bleibt immer exakt erhalten',
          'Numerische Diffusion verschmiert die scharfe Grenzfläche → α-Werte zwischen 0 und 1 breiten sich aus',
          'α wird negativ',
          'Die Strömung stoppt',
        ],
        correctIndex: 1,
        explanation: 'Ohne Interface-Rekonstruktion (z.B. PLIC) verschmiert die Grenzfläche über mehrere Zellen. Spezielle Schemata (CICSAM, HRIC) sind nötig.',
      },
    ],
  },

  'twophase-levelset': {
    lessonId: 'twophase-levelset',
    questions: [
      {
        id: 'ls-1', type: 'definition',
        question: 'Was ist die Level-Set-Methode?',
        options: [
          'Man definiert die Grenzfläche als Nullstellenmenge einer vorzeichenbehafteten Abstandsfunktion φ',
          'Man verfolgt einzelne Partikel auf der Grenzfläche',
          'Man nutzt den VOF-Ansatz mit α ∈ [0,1]',
          'Man verwendet adaptive Gitterverfeinerung',
        ],
        correctIndex: 0,
        explanation: 'Level-Set: φ < 0 (Phase 1), φ > 0 (Phase 2), φ = 0 (Grenzfläche). Vorteil: glatte Normalenvektoren und Krümmung leicht berechenbar.',
      },
      {
        id: 'ls-2', type: 'multiple-choice',
        question: 'Der Hauptnachteil der Level-Set-Methode gegenüber VOF?',
        options: [
          'Massenerhaltung ist nicht automatisch gewährleistet',
          'Die Grenzfläche ist immer unscharf',
          'Funktioniert nicht in 3D',
          'Braucht keine Reinitialisierung',
        ],
        correctIndex: 0,
        explanation: 'Level-Set erhält die Masse nicht exakt (φ ist keine konservierte Größe). Hybridmethoden (CLSVOF) kombinieren die Vorteile beider.',
      },
    ],
  },

  'twophase-surface-tension': {
    lessonId: 'twophase-surface-tension',
    questions: [
      {
        id: 'st-1', type: 'formula-select',
        question: 'Die Oberflächenspannung erzeugt einen Drucksprung (Young-Laplace):',
        options: [
          '$\\Delta p = \\sigma \\kappa$ (Oberflächenspannung × Krümmung)',
          '$\\Delta p = \\rho g h$',
          '$\\Delta p = \\frac{1}{2}\\rho u^2$',
          '$\\Delta p = \\mu \\frac{du}{dy}$',
        ],
        correctIndex: 0,
        explanation: 'Young-Laplace: $\\Delta p = \\sigma \\kappa$. In 3D: $\\kappa = 1/R_1 + 1/R_2$ (zwei Hauptkrümmungsradien). Treibt z.B. Kapillarwirkung.',
      },
    ],
  },
};
