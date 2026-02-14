/**
 * lessonContent.ts — Rich didactic content for each lesson
 *
 * Each lesson has structured learning steps with formulas, explanations,
 * and connections to the interactive simulator.
 */

export interface LearningStep {
  title: string;
  /** KaTeX formulas (rendered as block math) */
  formulas?: string[];
  /** Explanation text (supports basic markdown-like formatting) */
  text: string;
  /** Highlighted box (tip, warning, key insight) */
  highlight?: { type: 'tip' | 'warning' | 'key'; text: string };
  /** Connection to code — which editable block to show */
  codeBlockId?: string;
  /** Embedded interactive component id */
  interactiveComponent?: string;
}

export interface LessonContent {
  lessonId: string;
  steps: LearningStep[];
}

// ═══════════════════════════════════════════════════════════════════
// LESSON CONTENTS
// ═══════════════════════════════════════════════════════════════════

export const lessonContents: Record<string, LessonContent> = {

  // ── 1.1 Was ist CFD? ─────────────────────────────────────────────
  'basics-what-is-cfd': {
    lessonId: 'basics-what-is-cfd',
    steps: [
      {
        title: 'Strömungen sind überall',
        text: 'Luft um ein Flugzeug, Blut in Adern, Wetter — all das sind Strömungen. Sie werden durch die Navier-Stokes-Gleichungen beschrieben, einem System nichtlinearer partieller Differentialgleichungen.',
        highlight: { type: 'key', text: 'Analytische Lösungen existieren nur für sehr wenige Spezialfälle.' },
      },
      {
        title: 'Warum "numerisch"?',
        text: 'Da wir die Gleichungen meist nicht exakt lösen können, teilen wir das Gebiet in viele kleine Zellen/Punkte und lösen vereinfachte algebraische Gleichungen. Das ist die Grundidee von CFD (Computational Fluid Dynamics).',
        formulas: [
          '\\text{PDE (kontinuierlich)} \\xrightarrow{\\text{Diskretisierung}} \\text{Algebraische Gleichungen (diskret)}'
        ],
      },
      {
        title: 'Die drei Grundansätze',
        text: 'Es gibt drei Hauptmethoden zur Diskretisierung:\n\n• **FDM** (Finite-Differenzen-Methode): Ableitungen → Differenzenquotienten an Gitterpunkten\n• **FVM** (Finite-Volumen-Methode): Integration über Kontrollvolumen → Flüsse über Flächen\n• **FEM** (Finite-Elemente-Methode): Schwache Form → Basisfunktionen\n\nWir lernen hier FDM und FVM, die in der CFD am häufigsten verwendet werden.',
        highlight: { type: 'tip', text: 'FVM ist der Standard in kommerziellen CFD-Codes (OpenFOAM, Fluent, StarCCM+), weil es automatisch konservativ ist.' },
      },
      {
        title: 'Was du in diesem Kurs lernst',
        text: 'Du wirst Schritt für Schritt lernen:\n1. Wie man ein Gitter baut\n2. Wie FDM funktioniert (Taylor-Reihe → Stencils)\n3. Wie FVM funktioniert (Kontrollvolumen → Flüsse)\n4. Verschiedene Schemata (UDS, CDS, TVD)\n5. Stabilität (CFL, Peclet)\n6. Von 1D zu 2D\n\nJeder Schritt hat interaktive Simulationen, editierbaren Code und verknüpfte Formeln.',
      },
    ],
  },

  // ── 1.2 PDEs ─────────────────────────────────────────────────────
  'basics-pdes': {
    lessonId: 'basics-pdes',
    steps: [
      {
        title: 'Die allgemeine Transportgleichung',
        text: 'Fast alle Gleichungen in der Strömungsmechanik haben die gleiche Struktur:',
        formulas: [
          '\\underbrace{\\frac{\\partial \\phi}{\\partial t}}_{\\text{zeitliche Änderung}} + \\underbrace{\\nabla \\cdot (\\mathbf{u} \\phi)}_{\\text{Konvektion}} = \\underbrace{\\nabla \\cdot (\\Gamma \\nabla \\phi)}_{\\text{Diffusion}} + \\underbrace{S_\\phi}_{\\text{Quellterm}}'
        ],
        highlight: { type: 'key', text: 'φ kann alles sein: Temperatur, Konzentration, Geschwindigkeitskomponente, turbulente kinetische Energie...' },
      },
      {
        title: 'Konvektion: Transport durch Strömung',
        text: 'Konvektion transportiert φ mit der Strömungsgeschwindigkeit u. Stell dir einen Farbstoff im Fluss vor — er wird mitgerissen.',
        formulas: [
          '\\frac{\\partial \\phi}{\\partial t} + u \\frac{\\partial \\phi}{\\partial x} = 0',
          '\\text{Lösung: } \\phi(x,t) = \\phi_0(x - ut) \\quad \\text{(Wellenausbreitung)}'
        ],
      },
      {
        title: 'Diffusion: Ausgleich durch Gradienten',
        text: 'Diffusion glättet Gradienten — wie Wärme, die sich ausbreitet, oder Tinte, die sich im Wasser verteilt.',
        formulas: [
          '\\frac{\\partial \\phi}{\\partial t} = \\Gamma \\frac{\\partial^2 \\phi}{\\partial x^2}',
        ],
        highlight: { type: 'tip', text: 'Γ (Gamma) ist der Diffusionskoeffizient. Größeres Γ → schnellere Ausbreitung.' },
      },
      {
        title: 'Konvektion + Diffusion zusammen',
        text: 'In der Realität treten beide gleichzeitig auf. Das Peclet-Zahl Pe = |u|Δx/Γ sagt uns, welcher Effekt dominiert.',
        formulas: [
          '\\frac{\\partial \\phi}{\\partial t} + u \\frac{\\partial \\phi}{\\partial x} = \\Gamma \\frac{\\partial^2 \\phi}{\\partial x^2}',
          '\\text{Pe} = \\frac{|u| \\Delta x}{\\Gamma} \\quad \\begin{cases} \\text{Pe} \\gg 1 & \\text{Konvektion dominiert} \\\\ \\text{Pe} \\ll 1 & \\text{Diffusion dominiert} \\end{cases}'
        ],
      },
    ],
  },

  // ── 1.3 Idee der Diskretisierung ─────────────────────────────────
  'basics-discretization-idea': {
    lessonId: 'basics-discretization-idea',
    steps: [
      {
        title: 'Vom Kontinuum zum Gitter',
        text: 'In der realen Welt hat jeder Punkt im Raum einen Wert (Temperatur, Druck, ...). Im Computer können wir nur endlich viele Punkte speichern → wir legen ein Gitter an.',
        highlight: { type: 'key', text: 'Mehr Gitterpunkte = genauer, aber auch teurer (Rechenzeit, Speicher).' },
      },
      {
        title: 'Ableitungen werden Differenzen',
        text: 'Eine Ableitung ∂f/∂x beschreibt die Rate der Änderung. Auf dem Gitter kennen wir nur die Werte an diskreten Punkten → wir approximieren:',
        formulas: [
          '\\frac{\\partial f}{\\partial x}\\bigg|_i \\approx \\frac{f_{i+1} - f_i}{\\Delta x} \\quad \\text{(Vorwärtsdifferenz)}',
          '\\frac{\\partial f}{\\partial x}\\bigg|_i \\approx \\frac{f_{i+1} - f_{i-1}}{2\\Delta x} \\quad \\text{(Zentraldifferenz)}'
        ],
      },
      {
        title: 'Integrale werden Summen',
        text: 'Bei FVM integrieren wir über ein Kontrollvolumen. Das Flächenintegral wird zur Summe der Flüsse über die Zellflächen:',
        formulas: [
          '\\oint_A (\\mathbf{u} \\phi) \\cdot \\mathbf{n} \\, dA \\approx \\sum_{\\text{Flächen}} F_f \\cdot A_f'
        ],
        highlight: { type: 'tip', text: 'Das ist der Kernunterschied: FDM approximiert Ableitungen an Punkten, FVM approximiert Integrale über Volumen.' },
      },
      {
        title: 'Zeitdiskretisierung',
        text: 'Auch die Zeit wird diskretisiert. Der einfachste Ansatz ist expliziter Euler:',
        formulas: [
          '\\phi^{n+1} = \\phi^n + \\Delta t \\cdot \\text{RHS}^n',
          '\\text{wobei RHS die „rechte Seite" (Flüsse, Diffusion, Quellen) zur Zeit } t^n \\text{ ist.}'
        ],
      },
    ],
  },

  // ── 1.4 Gitter & Geometrie ──────────────────────────────────────
  'basics-mesh': {
    lessonId: 'basics-mesh',
    steps: [
      {
        title: '1D Gitter: Zellen und Flächen',
        text: 'Ein 1D-Gitter besteht aus N Zellen mit Breite Δx. Jede Zelle hat:\n• Einen Zellmittelpunkt P (wo der Wert φ_P gespeichert ist)\n• Zwei Flächen (links und rechts)\n• Nachbarzellen W (West) und E (East)',
      },
      {
        title: 'Zell-zentriert vs Knoten-zentriert',
        text: 'Bei FVM speichern wir Werte im Zellzentrum (cell-centered). Bei FDM an den Gitterknoten (vertex-centered). Beides hat Vor- und Nachteile.',
        formulas: [
          '\\text{Zellzentrum: } x_P = (i + \\tfrac{1}{2}) \\Delta x',
          '\\text{Face: } x_f = i \\cdot \\Delta x',
        ],
        highlight: { type: 'key', text: 'Bei FVM kennen wir den Wert an der Fläche NICHT direkt — wir müssen ihn interpolieren. Das ist die Aufgabe des „Schemas".' },
      },
      {
        title: 'Notation Überblick',
        text: 'Die Standard-Notation:\n• P = aktuelle Zelle (Point)\n• W = Nachbar links (West)\n• E = Nachbar rechts (East)\n• f = Face (Fläche)\n• a = Koeffizient (a_P, a_W, a_E)',
      },
    ],
  },

  // ── 2.1 Taylor-Reihe & Fehlerordnung ────────────────────────────
  'fdm-taylor': {
    lessonId: 'fdm-taylor',
    steps: [
      {
        title: 'Taylor-Reihe als Werkzeug',
        text: 'Die Taylor-Reihe ist das mathematische Fundament aller Finite-Differenzen-Formeln. Wir entwickeln f(x+Δx) um den Punkt x:',
        formulas: [
          'f(x + \\Delta x) = f(x) + \\Delta x f\'(x) + \\frac{\\Delta x^2}{2} f\'\'(x) + \\frac{\\Delta x^3}{6} f\'\'\'(x) + \\ldots'
        ],
      },
      {
        title: 'Vorwärtsdifferenz herleiten',
        text: 'Stelle die Taylor-Reihe nach f\'(x) um:',
        formulas: [
          'f\'(x) = \\frac{f(x+\\Delta x) - f(x)}{\\Delta x} - \\underbrace{\\frac{\\Delta x}{2} f\'\'(x) - \\ldots}_{\\text{Abschneidefehler}}',
          '\\Rightarrow \\frac{df}{dx}\\bigg|_i \\approx \\frac{f_{i+1} - f_i}{\\Delta x} + \\mathcal{O}(\\Delta x) \\quad \\text{(1. Ordnung)}'
        ],
        highlight: { type: 'key', text: '1. Ordnung = wenn du Δx halbierst, halbiert sich auch der Fehler.' },
      },
      {
        title: 'Zentraldifferenz: höhere Ordnung',
        text: 'Subtrahiere Taylor-Reihen für f(x+Δx) und f(x−Δx):',
        formulas: [
          'f(x+\\Delta x) - f(x-\\Delta x) = 2\\Delta x f\'(x) + \\frac{2\\Delta x^3}{6} f\'\'\'(x) + \\ldots',
          '\\Rightarrow \\frac{df}{dx}\\bigg|_i \\approx \\frac{f_{i+1} - f_{i-1}}{2\\Delta x} + \\mathcal{O}(\\Delta x^2) \\quad \\text{(2. Ordnung)}'
        ],
        highlight: { type: 'tip', text: '2. Ordnung = wenn du Δx halbierst, viertelt sich der Fehler! Viel besser.' },
      },
      {
        title: 'Zweite Ableitung',
        text: 'Addiere die Taylor-Reihen statt sie zu subtrahieren:',
        formulas: [
          'f(x+\\Delta x) + f(x-\\Delta x) = 2f(x) + \\Delta x^2 f\'\'(x) + \\ldots',
          '\\Rightarrow \\frac{d^2f}{dx^2}\\bigg|_i \\approx \\frac{f_{i+1} - 2f_i + f_{i-1}}{\\Delta x^2} + \\mathcal{O}(\\Delta x^2)'
        ],
        highlight: { type: 'key', text: 'Dieser 3-Punkt-Stencil [1, -2, 1] für die zweite Ableitung ist einer der wichtigsten in CFD.' },
      },
    ],
  },

  // ── 2.2 FD-Stencils interaktiv ──────────────────────────────────
  'fdm-stencils': {
    lessonId: 'fdm-stencils',
    steps: [
      {
        title: 'Was ist ein Stencil?',
        text: 'Ein Stencil beschreibt, welche Nachbarpunkte in die Berechnung eines Wertes eingehen — und mit welchem Gewicht.',
        highlight: { type: 'key', text: 'Der Stencil ist die „Brille" durch die der Solver die Lösung sieht.' },
      },
      {
        title: 'Stencils visualisiert',
        text: 'Vorwärtsdifferenz → Stencil [-1, 1] (Punkte i, i+1)\nZentraldifferenz → Stencil [-½, 0, ½] (Punkte i-1, i, i+1)\nZweite Ableitung → Stencil [1, -2, 1] (Punkte i-1, i, i+1)\n\nProbiere im Simulator verschiedene Stencils aus und sieh, wie sie sich auf die Approximation auswirken.',
      },
      {
        title: 'Vom FD-Stencil zum FVM-Stencil',
        text: 'Bei FVM kommen die Stencil-Koeffizienten nicht direkt aus der Taylor-Reihe, sondern aus der Integration über das Kontrollvolumen + Face-Interpolation. Trotzdem ist die Idee dieselbe: Nachbarwerte + Gewichte = Update.',
      },
    ],
  },

  // ── 2.3 1D Wärmeleitung (FDM) ──────────────────────────────────
  'fdm-1d-heat': {
    lessonId: 'fdm-1d-heat',
    steps: [
      {
        title: 'Die Wärmeleitungsgleichung',
        text: 'Unser erstes echtes Problem — reine Diffusion:',
        formulas: [
          '\\frac{\\partial T}{\\partial t} = \\alpha \\frac{\\partial^2 T}{\\partial x^2}',
          '\\text{α = Temperaturleitfähigkeit (thermal diffusivity)}'
        ],
      },
      {
        title: 'FDM-Diskretisierung',
        text: 'Zentrale Differenzen für die zweite Ableitung + expliziter Euler für die Zeit:',
        formulas: [
          'T_i^{n+1} = T_i^n + \\frac{\\alpha \\Delta t}{\\Delta x^2} (T_{i+1}^n - 2T_i^n + T_{i-1}^n)',
          'T_i^{n+1} = T_i^n + r (T_{i+1}^n - 2T_i^n + T_{i-1}^n) \\quad \\text{mit } r = \\frac{\\alpha \\Delta t}{\\Delta x^2}'
        ],
        highlight: { type: 'key', text: 'r heißt Fourier-Zahl. Für Stabilität muss r ≤ 0.5 gelten!' },
      },
      {
        title: 'Stencil & Koeffizienten',
        text: 'Die Update-Gleichung in Matrixform:',
        formulas: [
          'T_i^{n+1} = r \\cdot T_{i-1}^n + (1 - 2r) \\cdot T_i^n + r \\cdot T_{i+1}^n',
          'a_W = r, \\quad a_P = 1-2r, \\quad a_E = r'
        ],
        highlight: { type: 'warning', text: 'Wenn r > 0.5 wird a_P negativ → die Lösung oszilliert und divergiert!' },
      },
      {
        title: 'Jetzt ausprobieren!',
        text: 'Starte die Simulation mit verschiedenen Werten für α und beobachte:\n• Wie schnell die Temperatur sich ausbreitet\n• Was passiert wenn r > 0.5 (Instabilität!)\n• Wie die Anfangsbedingung geglättet wird',
      },
    ],
  },

  // ── 3.1 Kontrollvolumen & Flüsse ────────────────────────────────
  'fvm-concept': {
    lessonId: 'fvm-concept',
    steps: [
      {
        title: 'Die Idee hinter FVM',
        text: 'Statt Ableitungen an Punkten zu approximieren (FDM), integriert FVM die Gleichung über ein Kontrollvolumen (KV). Das macht die Methode automatisch konservativ.',
        highlight: { type: 'key', text: 'Konservativ = was in eine Zelle hineinfließt, fließt aus der Nachbarzelle heraus. Nichts geht verloren.' },
      },
      {
        title: 'Von der PDE zur Integralform',
        text: 'Wir integrieren die Transportgleichung über ein Kontrollvolumen V:',
        formulas: [
          '\\int_V \\frac{\\partial \\phi}{\\partial t} dV + \\int_V \\nabla \\cdot (\\mathbf{u}\\phi) dV = \\int_V \\nabla \\cdot (\\Gamma \\nabla\\phi) dV',
          '\\text{Mit dem Gaußschen Satz: } \\int_V \\nabla \\cdot \\mathbf{F} \\, dV = \\oint_A \\mathbf{F} \\cdot \\mathbf{n} \\, dA',
          '\\frac{d}{dt} \\int_V \\phi \\, dV + \\oint_A (\\mathbf{u}\\phi) \\cdot \\mathbf{n} \\, dA = \\oint_A \\Gamma \\nabla\\phi \\cdot \\mathbf{n} \\, dA'
        ],
      },
      {
        title: 'Diskret: Summe über Flächen',
        text: 'In 1D mit uniformem Gitter wird das Flächenintegral zur Differenz der Flüsse an den zwei Zellflächen:',
        formulas: [
          '\\Delta x \\frac{d\\phi_P}{dt} = -(F_{i+\\frac{1}{2}} - F_{i-\\frac{1}{2}}) + (D_{i+\\frac{1}{2}} - D_{i-\\frac{1}{2}})',
          'F_{i+\\frac{1}{2}} = u \\cdot \\phi_f^{i+\\frac{1}{2}} \\quad \\text{(konvektiver Flux)}',
          'D_{i+\\frac{1}{2}} = \\frac{\\Gamma}{\\Delta x}(\\phi_E - \\phi_P) \\quad \\text{(diffusiver Flux)}'
        ],
        highlight: { type: 'tip', text: 'Beachte: φ_f ist der Wert an der FLÄCHE, nicht im Zellzentrum. Um ihn zu berechnen brauchen wir ein Interpolationsschema.' },
      },
    ],
  },

  // ── 3.2 Face-Interpolation ──────────────────────────────────────
  'fvm-face-interpolation': {
    lessonId: 'fvm-face-interpolation',
    steps: [
      {
        title: 'Das zentrale Problem',
        text: 'Bei FVM kennen wir den Wert φ nur im Zellzentrum. Für den Flux F = u·φ_f an der Fläche brauchen wir aber φ an der Fläche.',
        formulas: [
          '\\phi_f = \\; ? \\quad \\text{(aus } \\phi_P, \\phi_E, \\phi_W \\text{ berechnen)}'
        ],
        highlight: { type: 'key', text: 'Wie wir φ_f berechnen, bestimmt Genauigkeit UND Stabilität der gesamten Lösung.' },
      },
      {
        title: 'Upwind (UDS)',
        text: 'Der einfachste Ansatz: nimm den Wert der Zelle, aus der die Strömung kommt.',
        formulas: [
          '\\phi_f = \\begin{cases} \\phi_P & \\text{wenn } u \\geq 0 \\\\ \\phi_E & \\text{wenn } u < 0 \\end{cases}',
        ],
        highlight: { type: 'warning', text: 'UDS ist nur 1. Ordnung genau → fügt künstliche (numerische) Diffusion hinzu. Scharfe Fronten werden verschmiert.' },
        codeBlockId: 'faceInterpolation',
      },
      {
        title: 'Central (CDS)',
        text: 'Nimm den Durchschnitt der beiden Nachbarzellen:',
        formulas: [
          '\\phi_f = \\frac{1}{2}(\\phi_P + \\phi_E)',
        ],
        highlight: { type: 'warning', text: 'CDS ist 2. Ordnung — aber bei Pe > 2 kann es Oszillationen geben (unphysikalisch!).' },
        codeBlockId: 'faceInterpolation',
      },
    ],
  },

  // ── 3.3 1D Konvektion (FVM) ─────────────────────────────────────
  'fvm-1d-convection': {
    lessonId: 'fvm-1d-convection',
    steps: [
      {
        title: 'Das Problem',
        text: 'Reine Konvektion — ein Profil wird mit Geschwindigkeit u nach rechts transportiert:',
        formulas: [
          '\\frac{\\partial \\phi}{\\partial t} + u \\frac{\\partial \\phi}{\\partial x} = 0',
          '\\text{Exakte Lösung: } \\phi(x,t) = \\phi_0(x - ut)'
        ],
      },
      {
        title: 'FVM-Diskretisierung',
        text: 'Integration über das Kontrollvolumen + expliziter Euler:',
        formulas: [
          '\\phi_P^{n+1} = \\phi_P^n - \\frac{\\Delta t}{\\Delta x} (F_{i+\\frac{1}{2}} - F_{i-\\frac{1}{2}})',
          'F_{i+\\frac{1}{2}} = u \\cdot \\phi_f^{i+\\frac{1}{2}}'
        ],
        codeBlockId: 'timeStep',
      },
      {
        title: 'Ausprobieren',
        text: 'Wähle ein Preset links und starte die Simulation:\n• UDS: Beobachte wie die Front verschmiert → numerische Diffusion\n• CDS: Beobachte Oszillationen hinter der Front\n• Vergleiche beide im Split-Modus!\n\nDrücke Space zum Starten.',
        highlight: { type: 'tip', text: 'Protip: Wechsle zum Code-Tab und ändere die Face-Interpolation selbst!' },
      },
    ],
  },

  // ── 3.4 FVM vs FDM ──────────────────────────────────────────────
  'fvm-fvm-vs-fdm': {
    lessonId: 'fvm-fvm-vs-fdm',
    steps: [
      {
        title: 'FDM vs FVM — Überblick',
        text: 'Beide Methoden diskretisieren dieselbe PDE, aber auf unterschiedliche Weise:',
      },
      {
        title: 'Finite Differenzen (FDM)',
        text: '• Werte an Gitterknoten\n• Ableitungen → Differenzenquotienten (Taylor-Reihe)\n• Einfach zu implementieren\n• Auf strukturierten Gittern\n• NICHT automatisch konservativ',
        formulas: [
          '\\frac{\\partial f}{\\partial x} \\approx \\frac{f_{i+1} - f_{i-1}}{2\\Delta x}'
        ],
      },
      {
        title: 'Finite Volumen (FVM)',
        text: '• Werte in Zellzentren\n• Integration über Kontrollvolumen → Flüsse über Flächen\n• Automatisch konservativ\n• Funktioniert auf unstrukturierten Gittern\n• Braucht Face-Interpolation (Schema)',
        formulas: [
          '\\phi_P^{n+1} = \\phi_P^n - \\frac{\\Delta t}{\\Delta x}(F_{i+1/2} - F_{i-1/2})'
        ],
        highlight: { type: 'key', text: 'Konservativität ist in der Praxis extrem wichtig: Sie garantiert, dass z.B. die Gesamtmasse erhalten bleibt.' },
      },
    ],
  },

  // ── 4.1 UDS ──────────────────────────────────────────────────────
  'schemes-uds': {
    lessonId: 'schemes-uds',
    steps: [
      {
        title: 'Upwind Differencing Scheme',
        text: 'Die Information „kommt von oben" (upstream). Wir nehmen den Wert aus der Zelle, aus der die Strömung die Fläche erreicht.',
        formulas: [
          '\\phi_f = \\phi_{\\text{upwind}} = \\begin{cases} \\phi_P & u_f \\geq 0 \\\\ \\phi_E & u_f < 0 \\end{cases}'
        ],
      },
      {
        title: 'Warum UDS diffusiv ist',
        text: 'Taylor-Analyse zeigt: UDS entspricht der exakten Gleichung PLUS einem Diffusionsterm:',
        formulas: [
          '\\frac{\\partial \\phi}{\\partial t} + u \\frac{\\partial \\phi}{\\partial x} = \\underbrace{\\frac{|u| \\Delta x}{2} \\frac{\\partial^2 \\phi}{\\partial x^2}}_{\\text{Numerische Diffusion!}}'
        ],
        highlight: { type: 'key', text: 'UDS löst nicht die echte Gleichung, sondern eine mit künstlicher Diffusion. Je feiner das Gitter (Δx → 0), desto kleiner der Fehler.' },
      },
      {
        title: 'Stencil-Koeffizienten',
        text: 'Für u > 0:',
        formulas: [
          '\\phi_P^{n+1} = (1 - c)\\phi_P + c \\cdot \\phi_W \\quad \\text{mit CFL } c = \\frac{u \\Delta t}{\\Delta x}',
          'a_W = c, \\quad a_P = 1-c, \\quad a_E = 0'
        ],
        highlight: { type: 'tip', text: 'Alle Koeffizienten sind positiv wenn CFL ≤ 1 → daher ist UDS stabil!' },
      },
    ],
  },

  // ── 4.2 CDS ──────────────────────────────────────────────────────
  'schemes-cds': {
    lessonId: 'schemes-cds',
    steps: [
      {
        title: 'Central Differencing Scheme',
        text: 'Linearer Durchschnitt der beiden Nachbarn — unabhängig von der Strömungsrichtung:',
        formulas: [
          '\\phi_f = \\frac{1}{2}(\\phi_P + \\phi_E)'
        ],
      },
      {
        title: '2. Ordnung — aber...',
        text: 'CDS ist genauer als UDS (2. Ordnung statt 1. Ordnung), aber es ignoriert die Strömungsrichtung. Das kann zu unphysikalischen Oszillationen führen.',
        formulas: [
          '\\text{Stencil: } a_W = \\frac{c}{2}, \\quad a_P = 1, \\quad a_E = -\\frac{c}{2}'
        ],
        highlight: { type: 'warning', text: 'a_E ist NEGATIV → das kann bei großen CFL-Zahlen zu Oszillationen führen.' },
      },
      {
        title: 'Das Peclet-Problem',
        text: 'CDS funktioniert gut wenn Diffusion dominiert (Pe < 2). Bei hohem Pe (Konvektion dominiert) entstehen 2Δx-Oszillationen. Probiere es aus!',
        formulas: [
          '\\text{CDS stabil wenn } \\text{Pe} = \\frac{|u| \\Delta x}{\\Gamma} < 2'
        ],
      },
    ],
  },

  // ── 4.3 TVD ──────────────────────────────────────────────────────
  'schemes-tvd': {
    lessonId: 'schemes-tvd',
    steps: [
      {
        title: 'Das Dilemma',
        text: 'UDS: stabil, aber verschmiert (1. Ordnung)\nCDS: genau, aber oszilliert (unbounded)\n\nGibt es einen Kompromiss? JA → TVD-Schemata!',
        highlight: { type: 'key', text: 'TVD = Total Variation Diminishing: Die Lösung kann nie stärker oszillieren als die Anfangsbedingung.' },
      },
      {
        title: 'Flux-Limiter',
        text: 'Idee: Starte mit UDS und füge einen „High-Resolution Korrekturterm" hinzu, der durch einen Limiter ψ(r) begrenzt wird:',
        formulas: [
          '\\phi_f = \\phi_U + \\frac{1}{2}\\psi(r)(\\phi_D - \\phi_U)',
          'r = \\frac{\\phi_U - \\phi_{UU}}{\\phi_D - \\phi_U} \\quad \\text{(Glätte-Ratio)}'
        ],
      },
      {
        title: 'Beliebte Limiter',
        text: 'Verschiedene Limiter-Funktionen:',
        formulas: [
          '\\text{minmod: } \\psi(r) = \\max(0, \\min(1, r))',
          '\\text{van Leer: } \\psi(r) = \\frac{2r}{1 + r} \\quad (r > 0)',
          '\\text{superbee: } \\psi(r) = \\max(0, \\min(2r, 1), \\min(r, 2))'
        ],
        highlight: { type: 'tip', text: 'superbee ist am schärfsten, minmod am diffusivsten. van Leer ist ein guter Kompromiss.' },
      },
    ],
  },

  // ── 4.4 Schema-Vergleich ────────────────────────────────────────
  'schemes-compare': {
    lessonId: 'schemes-compare',
    steps: [
      {
        title: 'Alle Schemata vergleichen',
        text: 'Nutze den Vergleichsmodus: Wähle links das Hauptschema und ein Vergleichsschema. Beide laufen mit identischen Parametern.',
      },
      {
        title: 'Face-Interpolation im Vergleich',
        text: 'Der Kern jedes Schemas: Wie wird der Wert $\\phi_f$ an der Zellfläche aus den Zellmittelpunkten berechnet?\n\n• **UDS** nimmt immer den Upwind-Wert: $\\phi_f = \\phi_P$ — stabil, aber diffusiv\n• **CDS** mittelt links und rechts: $\\phi_f = \\frac{1}{2}(\\phi_P + \\phi_E)$ — genau, aber kann oszillieren\n• **TVD** blendet mit Limiter: $\\phi_f = \\phi_P + \\frac{1}{2}\\psi(r)(\\phi_E - \\phi_P)$ — Kompromiss\n\nZiehe die Zellwerte in der Grafik und beobachte, wie unterschiedlich die Face-Werte ausfallen!',
        interactiveComponent: 'face-interpolation',
        highlight: { type: 'key', text: 'Besonders beim Sprung (Preset "Sprung") siehst du den Unterschied: UDS bleibt am Upwind-Wert, CDS springt zur Mitte, TVD passt sich an.' },
      },
      {
        title: 'Was du beobachten solltest',
        text: '• UDS: Front verschmiert, aber keine Oszillationen\n• CDS: Front scharf, aber Wiggles\n• TVD-minmod: Keine Wiggles, etwas verschmiert\n• TVD-superbee: Kaum verschmiert, keine Wiggles\n\nProbiere verschiedene Anfangsbedingungen (Sprung, Gauß, Dreieck)!',
        highlight: { type: 'tip', text: 'Im Diagnostik-Tab siehst du L₂-Fehler und Masseerhaltung für quantitativen Vergleich.' },
      },
    ],
  },

  // ── 5.1 CFL-Bedingung ──────────────────────────────────────────
  'stability-cfl': {
    lessonId: 'stability-cfl',
    steps: [
      {
        title: 'Was ist die CFL-Zahl?',
        text: 'Die Courant-Friedrichs-Lewy (CFL) Zahl misst, wie weit Information in einem Zeitschritt reist, relativ zur Gitterweite:',
        formulas: [
          '\\text{CFL} = \\frac{|u| \\Delta t}{\\Delta x}'
        ],
      },
      {
        title: 'Physikalische Interpretation',
        text: 'CFL = 0.5 bedeutet: In einem Zeitschritt bewegt sich die Welle um eine halbe Zellbreite.\nCFL = 1 bedeutet: Die Welle bewegt sich exakt eine Zellbreite pro Zeitschritt.\nCFL > 1 bedeutet: Die Welle „überspringt" Zellen → Information geht verloren!',
        formulas: [
          '\\text{CFL} \\leq 1 \\quad \\text{für explizite Euler + UDS (1. Ordnung)}'
        ],
        highlight: { type: 'warning', text: 'Schiebe den CFL-Regler über 1 und beobachte, wie die Lösung explodiert!' },
      },
      {
        title: 'Warum genau CFL ≤ 1?',
        text: 'Der Stencil [c, 1−c, 0] hat nur positive Koeffizienten wenn c ≤ 1. Wird c > 1, wird der Koeffizient von φ_P negativ → die Lösung kann wachsen statt zu dämpfen.',
        formulas: [
          '\\text{UDS: } a_P = 1 - c \\quad \\Rightarrow \\quad c > 1 \\Rightarrow a_P < 0 \\Rightarrow \\text{instabil!}'
        ],
      },
    ],
  },

  // ── 5.2 Peclet-Zahl ────────────────────────────────────────────
  'stability-peclet': {
    lessonId: 'stability-peclet',
    steps: [
      {
        title: 'Peclet-Zahl',
        text: 'Die Peclet-Zahl vergleicht Konvektion und Diffusion:',
        formulas: [
          '\\text{Pe} = \\frac{|u| \\Delta x}{\\Gamma} = \\frac{\\text{Konvektiver Transport}}{\\text{Diffusiver Transport}}'
        ],
      },
      {
        title: 'Einfluss auf das Schema',
        text: 'Die Peclet-Zahl bestimmt, welches Schema funktioniert:',
        formulas: [
          '\\text{Pe} \\ll 1 \\Rightarrow \\text{Diffusion dominiert → CDS funktioniert gut}',
          '\\text{Pe} \\gg 1 \\Rightarrow \\text{Konvektion dominiert → CDS oszilliert, UDS nötig}',
          '\\text{Pe} \\approx 2 \\Rightarrow \\text{CDS-Stabilitätsgrenze}'
        ],
        highlight: { type: 'key', text: 'Regel: Wenn Pe > 2 → benutze UDS oder TVD, nicht CDS.' },
      },
      {
        title: 'Interaktiv testen',
        text: 'Ändere Γ (Diffusion) und beobachte:\n• Γ groß → Pe klein → alles glatt\n• Γ klein → Pe groß → Oszillationen bei CDS\n• Γ = 0 → reine Konvektion (Pe = ∞)',
      },
    ],
  },

  // ── 5.3 Von-Neumann-Analyse ────────────────────────────────────
  'stability-vonneumann': {
    lessonId: 'stability-vonneumann',
    steps: [
      {
        title: 'Idee der Von-Neumann-Analyse',
        text: 'Wir zerlegen die Lösung in Fourier-Moden und prüfen, ob jede Mode wächst oder schrumpft:',
        formulas: [
          '\\phi_j^n = G^n e^{ik j \\Delta x}',
          '\\text{G = Verstärkungsfaktor (amplification factor)}'
        ],
      },
      {
        title: 'Stabilitätsbedingung',
        text: 'Die Lösung ist stabil wenn der Verstärkungsfaktor für ALLE Wellenzahlen k ≤ 1 bleibt:',
        formulas: [
          '|G(k)| \\leq 1 \\quad \\forall k',
          '\\text{UDS + Euler: } G = 1 - c(1 - e^{-ik\\Delta x}) \\Rightarrow |G| \\leq 1 \\text{ wenn } c \\leq 1'
        ],
        highlight: { type: 'key', text: 'Die Von-Neumann-Analyse beweist mathematisch die CFL-Bedingung!' },
      },
    ],
  },

  // ── 6.1 1D Konvektion-Diffusion ────────────────────────────────
  'convdiff-1d': {
    lessonId: 'convdiff-1d',
    steps: [
      {
        title: 'Konvektion + Diffusion',
        text: 'Jetzt kommen beide Terme zusammen:',
        formulas: [
          '\\frac{\\partial \\phi}{\\partial t} + u \\frac{\\partial \\phi}{\\partial x} = \\Gamma \\frac{\\partial^2 \\phi}{\\partial x^2}'
        ],
      },
      {
        title: 'FVM-Diskretisierung',
        text: 'Konvektiver Flux + Diffusiver Flux an jeder Fläche:',
        formulas: [
          '\\phi_P^{n+1} = \\phi_P^n - \\frac{\\Delta t}{\\Delta x}(F_R^{conv} - F_L^{conv}) + \\frac{\\Delta t}{\\Delta x}(F_R^{diff} - F_L^{diff})',
          'F_R^{conv} = u \\cdot \\phi_f, \\quad F_R^{diff} = \\frac{\\Gamma}{\\Delta x}(\\phi_E - \\phi_P)'
        ],
        codeBlockId: 'diffusiveFlux',
      },
      {
        title: 'Stabilitätsbedingung',
        text: 'Jetzt gibt es ZWEI Beschränkungen für Δt:',
        formulas: [
          '\\text{Konvektion: } \\Delta t \\leq \\frac{\\Delta x}{|u|}',
          '\\text{Diffusion: } \\Delta t \\leq \\frac{\\Delta x^2}{2\\Gamma}',
          '\\Delta t \\leq \\min\\left(\\frac{\\Delta x}{|u|}, \\frac{\\Delta x^2}{2\\Gamma}\\right)'
        ],
      },
    ],
  },

  // ── 6.2 Peclet-Effekt ─────────────────────────────────────────
  'convdiff-peclet-effect': {
    lessonId: 'convdiff-peclet-effect',
    steps: [
      {
        title: 'Was passiert bei verschiedenen Pe?',
        text: 'Experimentiere mit dem Γ-Regler und beobachte:',
      },
      {
        title: 'Pe ≫ 1 (Konvektion dominiert)',
        text: 'Die Front wird transportiert und kaum geglättet. CDS zeigt Oszillationen, UDS verschmiert.',
        highlight: { type: 'tip', text: 'Setze Γ = 0.001 und beobachte den Unterschied UDS vs CDS.' },
      },
      {
        title: 'Pe ≪ 1 (Diffusion dominiert)',
        text: 'Die Lösung wird schnell glatt. Beide Schemata liefern ähnliche Ergebnisse.',
        highlight: { type: 'tip', text: 'Setze Γ = 0.1 und u = 0.1 für Pe ≈ 0.5.' },
      },
    ],
  },

  // ── 7.1 2D Gitter ─────────────────────────────────────────────
  '2d-grid': {
    lessonId: '2d-grid',
    steps: [
      {
        title: '2D strukturiertes Gitter',
        text: 'Ein 2D-Gitter hat Nx × Ny Zellen. Jede Zelle P hat jetzt VIER Nachbarn: W, E, S, N.',
        formulas: [
          '\\text{Index: } (i,j) \\rightarrow \\text{linear: } j \\cdot N_x + i'
        ],
      },
      {
        title: 'Flächen in 2D',
        text: 'Jede Zelle hat 4 Flächen. An jeder Fläche gibt es einen Flux. Die Update-Gleichung wird:',
        formulas: [
          '\\phi_P^{n+1} = \\phi_P^n - \\frac{\\Delta t}{\\Delta x}(F_e - F_w) - \\frac{\\Delta t}{\\Delta y}(F_n - F_s)'
        ],
      },
    ],
  },

  // ── 7.2 2D Skalartransport ────────────────────────────────────
  '2d-scalar': {
    lessonId: '2d-scalar',
    steps: [
      {
        title: '2D Skalartransport',
        text: 'Ein Skalar (Temperatur, Konzentration) wird durch ein vorgegebenes Geschwindigkeitsfeld (u,v) transportiert:',
        formulas: [
          '\\frac{\\partial \\phi}{\\partial t} + \\frac{\\partial (u\\phi)}{\\partial x} + \\frac{\\partial (v\\phi)}{\\partial y} = \\Gamma \\left(\\frac{\\partial^2 \\phi}{\\partial x^2} + \\frac{\\partial^2 \\phi}{\\partial y^2}\\right)'
        ],
      },
      {
        title: 'Visualisierung',
        text: 'In 2D können wir das Feld als Heatmap darstellen. Optional mit Vektorpfeilen (Quiver) für das Geschwindigkeitsfeld.',
      },
      {
        title: 'Ausprobieren',
        text: 'Wähle ein Geschwindigkeitsfeld und eine Anfangsbedingung. Beobachte:\n• **Rotation**: Der Skalar dreht sich im Kreis — perfekt um numerische Diffusion zu sehen\n• **Uniform**: Transport in eine Richtung\n• **Scherung**: Verformung durch unterschiedliche Geschwindigkeiten\n\nVergleiche UDS (verschmiert) mit CDS (kann oszillieren).',
        highlight: { type: 'tip', text: 'Das Rotationsfeld ist ein klassischer Test: Nach einer vollen Umdrehung sollte das Profil unverändert sein. Ist es das?' },
      },
    ],
  },

  // ── 8.1 Navier-Stokes Gleichungen ─────────────────────────────
  'incomp-ns': {
    lessonId: 'incomp-ns',
    steps: [
      {
        title: 'Die Navier-Stokes-Gleichungen',
        text: 'Für inkompressible, newtonsche Fluide lauten die Impulsgleichungen:',
        formulas: [
          '\\frac{\\partial \\mathbf{u}}{\\partial t} + (\\mathbf{u} \\cdot \\nabla) \\mathbf{u} = -\\frac{1}{\\rho}\\nabla p + \\nu \\nabla^2 \\mathbf{u}',
          '\\nabla \\cdot \\mathbf{u} = 0 \\quad \\text{(Kontinuitätsgleichung / Masseerhaltung)}'
        ],
        highlight: { type: 'key', text: 'Die Kontinuitätsgleichung hat KEINEN Druckterm und KEINE Zeitableitung → der Druck ist kein "normales" Feld.' },
      },
      {
        title: 'Was ist dabei anders?',
        text: 'Im Gegensatz zur skalaren Transportgleichung gibt es hier:\n\n• **Kopplung u-v-p**: Geschwindigkeit und Druck sind verknüpft\n• **Nichtlinearität**: Der konvektive Term $(\\mathbf{u} \\cdot \\nabla)\\mathbf{u}$ enthält das Produkt der Unbekannten\n• **Keine explizite Druckgleichung**: Der Druck muss so gefunden werden, dass die Divergenzfreiheit erfüllt ist',
      },
      {
        title: 'Reynolds-Zahl',
        text: 'Die dimensionslose Kennzahl, die das Verhältnis von Trägheits- zu Viskositätskräften beschreibt:',
        formulas: [
          '\\text{Re} = \\frac{U L}{\\nu}',
          '\\text{Re klein} \\Rightarrow \\text{viskose, laminare Strömung}',
          '\\text{Re groß} \\Rightarrow \\text{Trägheit dominiert → Turbulenz}'
        ],
        highlight: { type: 'tip', text: 'Für die Lid-Driven Cavity: Re = 100 → glatte Strömung, Re = 1000 → sekundäre Wirbel, Re > 10000 → turbulent.' },
      },
      {
        title: 'Dimensionslose Form',
        text: 'Mit charakteristischer Länge L und Geschwindigkeit U wird:',
        formulas: [
          '\\frac{\\partial \\mathbf{u}^*}{\\partial t^*} + (\\mathbf{u}^* \\cdot \\nabla^*) \\mathbf{u}^* = -\\nabla^* p^* + \\frac{1}{\\text{Re}} \\nabla^{*2} \\mathbf{u}^*'
        ],
        highlight: { type: 'key', text: 'Die einzige freie Größe ist Re — es bestimmt das gesamte Strömungsverhalten!' },
      },
    ],
  },

  // ── 8.2 SIMPLE-Algorithmus ─────────────────────────────────────
  'incomp-simple': {
    lessonId: 'incomp-simple',
    steps: [
      {
        title: 'Das Druck-Geschwindigkeits-Problem',
        text: 'Bei inkompressiblen Strömungen kennen wir keine explizite Gleichung für den Druck. Er muss so bestimmt werden, dass die Kontinuität erfüllt ist.',
        highlight: { type: 'key', text: 'Stell dir den Druck als Lagrange-Multiplikator vor, der die Divergenzfreiheit erzwingt.' },
      },
      {
        title: 'SIMPLE: Semi-Implicit Method for Pressure-Linked Equations',
        text: 'Der SIMPLE-Algorithmus von Patankar & Spalding (1972) löst das iterativ:',
        formulas: [
          '\\text{1. Schätze } p^* \\text{ (z.B. aus letzter Iteration)}',
          '\\text{2. Löse Impulsgl. → } \\mathbf{u}^* \\text{ (Geschwindigkeitsschätzung)}',
          '\\text{3. Löse Druckkorrektur-Gl. → } p\'',
          '\\text{4. Korrigiere: } p = p^* + \\alpha_p p\' , \\quad \\mathbf{u} = \\mathbf{u}^* - \\frac{\\Delta t}{\\rho}\\nabla p\''
        ],
      },
      {
        title: 'Die Druckkorrekturgleichung',
        text: 'Die Druckkorrektur p\' löst eine Poisson-Gleichung:',
        formulas: [
          '\\nabla^2 p\' = \\frac{1}{\\Delta t} \\nabla \\cdot \\mathbf{u}^*'
        ],
        highlight: { type: 'warning', text: 'Die rechte Seite ist die Divergenz der Geschwindigkeitsschätzung. Wenn u* schon divergenzfrei ist, ist p\' = 0 → konvergiert!' },
      },
      {
        title: 'Unterrelaxation',
        text: 'Für Stabilität wird typischerweise unterrelaxiert:\n\n• Geschwindigkeit: $\\alpha_u \\approx 0.7$\n• Druck: $\\alpha_p \\approx 0.3$\n\nZu viel Relaxation → langsam. Zu wenig → divergiert.',
        highlight: { type: 'tip', text: 'Starte die Simulation und beobachte, wie das Residuum mit jeder Iteration sinkt.' },
      },
    ],
  },

  // ── 8.3 Lid-Driven Cavity ──────────────────────────────────────
  'incomp-cavity': {
    lessonId: 'incomp-cavity',
    steps: [
      {
        title: 'Das Benchmark-Problem',
        text: 'Das einfachste 2D inkompressible Problem: Ein quadratischer Hohlraum mit bewegtem Deckel.',
        formulas: [
          '\\text{Randbedingungen:}',
          '\\text{Oben: } u = U_{\\text{lid}}, \\; v = 0',
          '\\text{Sonst: } u = 0, \\; v = 0 \\; \\text{(no-slip)}'
        ],
      },
      {
        title: 'Was passiert physikalisch?',
        text: 'Der bewegte Deckel zieht das Fluid mit → es entsteht ein Hauptwirbel. Bei höheren Re-Zahlen bilden sich sekundäre Wirbel in den Ecken.\n\n• **Re = 100**: Ein großer Wirbel, leicht exzentrisch\n• **Re = 400**: Wirbel verschiebt sich, Eckenwirbel werden sichtbar\n• **Re = 1000**: Deutliche sekundäre Wirbel\n• **Re > 5000**: Instationäres Verhalten',
        highlight: { type: 'key', text: 'Die Cavity ist DER Benchmark für inkompressible Solver — Ghia et al. (1982) liefern tabellarische Referenzwerte.' },
      },
      {
        title: 'Ausprobieren',
        text: 'Wähle die Reynolds-Zahl und Gitterauflösung. Beobachte:\n• **Geschwindigkeitsfeld**: Wo ist der Wirbel? Wie verschiebt er sich mit Re?\n• **Druckfeld**: Druckmaximum und -minimum\n• **Wirbelstärke**: Rotationsintensität\n\nTipp: Starte mit Re = 100, N = 30 für schnelle Ergebnisse. Erhöhe dann Re oder N.',
        highlight: { type: 'tip', text: 'Bei Re > 500 brauchst du mehr Iterationen UND ein feineres Gitter für gute Ergebnisse.' },
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // 9. LÖSUNGSALGORITHMEN
  // ═══════════════════════════════════════════════════════════════

  // ── 9.1 Lineare Gleichungssysteme ──────────────────────────────
  'algo-linear-systems': {
    lessonId: 'algo-linear-systems',
    steps: [
      {
        title: 'Von der PDE zum linearen System',
        text: 'Jede diskretisierte Gleichung (FDM oder FVM) ergibt pro Gitterpunkt/Zelle eine algebraische Gleichung. Bei N Zellen haben wir N Gleichungen mit N Unbekannten → ein lineares Gleichungssystem.',
        formulas: [
          'A \\vec{x} = \\vec{b}',
          'a_P \\phi_P = \\sum_{nb} a_{nb} \\phi_{nb} + b_P'
        ],
        highlight: { type: 'key', text: 'Die Matrix A ist dünn besetzt (sparse): Jede Zeile hat nur so viele Nicht-Null-Einträge wie die Zelle Nachbarn hat (z.B. 5 in 2D, 7 in 3D).' },
      },
      {
        title: 'Struktur der Matrix',
        text: 'In 1D mit N Zellen ergibt sich eine **Tridiagonalmatrix** (Hauptdiagonale + zwei Nebendiagonalen). In 2D wird die Matrix bandförmig.\n\n• **Diagonaldominanz**: $|a_P| \\geq \\sum |a_{nb}|$ — wichtig für Konvergenz iterativer Löser\n• **Symmetrie**: Nur bei reiner Diffusion (ohne Konvektion)\n• **Positive Definitheit**: Nicht immer gegeben (Konvektion kann unsymmetrisch machen)',
      },
      {
        title: 'Direkte vs. iterative Löser',
        text: 'Man unterscheidet zwei Klassen:\n\n• **Direkte Löser** (LU, Cholesky): Exakte Lösung in endlich vielen Schritten. Problem: Speicherbedarf $O(N^2)$ bei 2D, $O(N^{7/3})$ bei 3D — bei Millionen Zellen unrealistisch.\n\n• **Iterative Löser** (Jacobi, Gauss-Seidel, CG, GMRES): Starten mit Schätzung, verbessern iterativ. Speicherbedarf $O(N)$ — skaliert!',
        highlight: { type: 'tip', text: 'In praktischer CFD werden fast immer iterative Löser verwendet. Direkte Löser nur für kleine Systeme oder als Vorkonditionierer.' },
      },
    ],
  },

  // ── 9.2 Jacobi & Gauss-Seidel ─────────────────────────────────
  'algo-iterative': {
    lessonId: 'algo-iterative',
    steps: [
      {
        title: 'Jacobi-Verfahren',
        text: 'Die einfachste Idee: Stelle jede Gleichung nach der Diagonalunbekannten um und iteriere.',
        formulas: [
          'x_i^{(k+1)} = \\frac{1}{a_{ii}} \\left( b_i - \\sum_{j \\neq i} a_{ij} x_j^{(k)} \\right)'
        ],
        highlight: { type: 'key', text: 'Jacobi nutzt nur Werte aus der vorherigen Iteration → einfach parallelisierbar, aber langsame Konvergenz.' },
      },
      {
        title: 'Gauss-Seidel-Verfahren',
        text: 'Verbesserung: Nutze bereits aktualisierte Werte sofort im gleichen Sweep.',
        formulas: [
          'x_i^{(k+1)} = \\frac{1}{a_{ii}} \\left( b_i - \\sum_{j < i} a_{ij} x_j^{(k+1)} - \\sum_{j > i} a_{ij} x_j^{(k)} \\right)'
        ],
        highlight: { type: 'tip', text: 'Gauss-Seidel konvergiert typischerweise doppelt so schnell wie Jacobi, braucht aber weniger Parallelität.' },
      },
      {
        title: 'Konvergenzverhalten',
        text: 'Beide Verfahren konvergieren, wenn die Matrix **diagonaldominant** ist (bei CFD oft erfüllt). Das Residuum $r^{(k)} = b - A x^{(k)}$ muss gegen Null fallen.\n\n• **Hochfrequente Fehler** (benachbarte Zellen alternierend falsch) werden schnell gedämpft\n• **Niederfrequente Fehler** (großräumige Abweichungen) werden extrem langsam gedämpft → hier hilft Multigrid!',
        highlight: { type: 'warning', text: 'In der Praxis sind reine Jacobi/GS zu langsam für große Probleme. Man nutzt sie als "Smoother" im Multigrid oder als Vorkonditionierer.' },
      },
      {
        title: 'Interaktiv vergleichen',
        text: 'In der Simulation lösen wir das Modellproblem $-\\nabla^2 u = f$ auf einem 1D-Gitter. Vergleiche Jacobi und Gauss-Seidel:\n\n• Wie viele Iterationen brauchen sie?\n• Wie sieht das Residuum über die Iterationen aus?\n• Was passiert bei mehr Gitterpunkten — wird es schlimmer?',
      },
    ],
  },

  // ── 9.3 Multigrid ─────────────────────────────────────────────
  'algo-multigrid': {
    lessonId: 'algo-multigrid',
    steps: [
      {
        title: 'Das Problem niederfrequenter Fehler',
        text: 'Jacobi und Gauss-Seidel glätten hochfrequente Fehler schnell, aber niederfrequente Fehler kaum. Ein Fehler mit Wellenlänge $\\lambda = L$ (Gebietsgröße) braucht $O(N^2)$ Iterationen!',
        formulas: [
          '\\text{Iterationen} \\sim O(N^2) \\text{ für klassische Relaxation}'
        ],
        highlight: { type: 'key', text: 'Die Idee von Multigrid: Was auf dem feinen Gitter niederfrequent ist, ist auf einem groben Gitter hochfrequent — und wird dort schnell geglättet!' },
      },
      {
        title: 'V-Zyklus',
        text: 'Der klassische Multigrid-Algorithmus:\n\n• **1. Glätten** auf dem feinen Gitter (wenige Jacobi/GS-Schritte)\n• **2. Restriktion**: Residuum auf gröberes Gitter übertragen\n• **3. Lösen/Glätten** auf dem groben Gitter (ggf. rekursiv)\n• **4. Prolongation**: Korrektur auf feines Gitter interpolieren\n• **5. Nachglätten** auf dem feinen Gitter',
        formulas: [
          '\\text{Fein} \\xrightarrow{\\text{Restriktion}} \\text{Grob} \\xrightarrow{\\text{Lösen}} \\text{Korrektur} \\xrightarrow{\\text{Prolongation}} \\text{Fein}'
        ],
      },
      {
        title: 'Optimale Komplexität',
        text: 'Multigrid erreicht **optimale Komplexität** $O(N)$ — der Rechenaufwand wächst nur linear mit der Problemgröße! Das ist ein enormer Vorteil gegenüber direkten Lösern $O(N^{3/2})$ oder klassischen iterativen Methoden $O(N^2)$.',
        highlight: { type: 'tip', text: 'Algebraisches Multigrid (AMG) funktioniert sogar auf unstrukturierten Gittern, ohne geometrische Gitterhierarchie.' },
      },
    ],
  },

  // ── 9.4 Unterrelaxation ────────────────────────────────────────
  'algo-underrelaxation': {
    lessonId: 'algo-underrelaxation',
    steps: [
      {
        title: 'Warum Unterrelaxation?',
        text: 'Bei nichtlinearen Problemen (Navier-Stokes) kann die volle Korrektur pro Iteration zu Instabilität führen. Unterrelaxation dämpft die Änderung.',
        formulas: [
          '\\phi^{\\text{new}} = \\phi^{\\text{old}} + \\alpha \\cdot (\\phi^* - \\phi^{\\text{old}})',
          '0 < \\alpha < 1 \\quad (\\text{Unterrelaxation})',
          '\\alpha = 1 \\quad (\\text{keine Relaxation})',
          '\\alpha > 1 \\quad (\\text{Überrelaxation, z.B. SOR})'
        ],
      },
      {
        title: 'Typische Werte in CFD',
        text: 'In SIMPLE-basierten Solvern:\n\n• **Geschwindigkeit**: $\\alpha_u = 0.7$\n• **Druck**: $\\alpha_p = 0.3$\n• **Turbulenz (k, ε)**: $\\alpha = 0.5 \\text{–} 0.7$\n\nDie Summe $\\alpha_u + \\alpha_p = 1$ ist eine oft empfohlene Faustregel.',
        highlight: { type: 'key', text: 'Zu starke Unterrelaxation ($\\alpha \\ll 1$): sehr langsame Konvergenz. Zu schwache ($\\alpha \\to 1$): Instabilität. Es ist eine Kunst!' },
      },
      {
        title: 'Residuenmonitoring',
        text: 'In der Praxis überwacht man die **Residuen** aller Gleichungen über die Iterationen. Typische Konvergenzkriterien:\n\n• Residuum fällt um 3–5 Größenordnungen\n• Kräfte/Momente am Objekt konvergieren\n• Monitorpunkt-Werte werden stationär',
        highlight: { type: 'tip', text: 'In OpenFOAM/Fluent werden die Anfangsresiduen und das finale Residuum jeder Gleichung pro Iteration ausgegeben.' },
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // 10. KOMPRESSIBLE STRÖMUNGEN
  // ═══════════════════════════════════════════════════════════════

  // ── 10.1 Euler-Gleichungen ─────────────────────────────────────
  'comp-euler': {
    lessonId: 'comp-euler',
    steps: [
      {
        title: 'Von inkompressibel zu kompressibel',
        text: 'In kompressiblen Strömungen ist die **Dichte nicht konstant** — sie ändert sich mit Druck und Temperatur. Die Mach-Zahl bestimmt, wie wichtig Kompressibilitätseffekte sind.',
        formulas: [
          'Ma = \\frac{|u|}{a}, \\quad a = \\sqrt{\\gamma \\frac{p}{\\rho}}',
          'Ma < 0.3: \\text{ quasi-inkompressibel}',
          'Ma > 1: \\text{ Überschall (Stoßwellen!)}'
        ],
      },
      {
        title: 'Die Euler-Gleichungen (1D)',
        text: 'Reibungsfreie kompressible Strömung wird durch drei Erhaltungsgleichungen beschrieben:',
        formulas: [
          '\\frac{\\partial}{\\partial t} \\begin{pmatrix} \\rho \\\\ \\rho u \\\\ \\rho E \\end{pmatrix} + \\frac{\\partial}{\\partial x} \\begin{pmatrix} \\rho u \\\\ \\rho u^2 + p \\\\ u(\\rho E + p) \\end{pmatrix} = 0'
        ],
        highlight: { type: 'key', text: 'Drei Erhaltungssätze: Masse ($\\rho$), Impuls ($\\rho u$), Gesamtenergie ($\\rho E$). Geschlossen mit dem idealen Gasgesetz $p = (\\gamma - 1)(\\rho E - \\frac{1}{2}\\rho u^2)$.' },
      },
      {
        title: 'Hyperbolischer Charakter',
        text: 'Die 1D Euler-Gleichungen haben drei **Eigenwerte** (Wellengeschwindigkeiten):\n\n• $\\lambda_1 = u - a$ (linke akustische Welle)\n• $\\lambda_2 = u$ (Kontaktdiskontinuität / Entropiewelle)\n• $\\lambda_3 = u + a$ (rechte akustische Welle)\n\nInformation breitet sich mit endlicher Geschwindigkeit aus — das ist fundamental anders als bei inkompressiblen Gleichungen!',
        highlight: { type: 'tip', text: 'Überprüfe die Normalschock-Relationen interaktiv: Gib Ma₁ ein und beobachte, wie sich Druck, Temperatur und Dichte über den Stoß ändern.' },
      },
      {
        title: 'Normalschock-Relationen',
        text: 'An einem senkrechten Stoß gelten die **Rankine-Hugoniot-Bedingungen**:',
        formulas: [
          '\\frac{p_2}{p_1} = 1 + \\frac{2\\gamma}{\\gamma+1}(Ma_1^2 - 1)',
          '\\frac{\\rho_2}{\\rho_1} = \\frac{(\\gamma+1)Ma_1^2}{2 + (\\gamma-1)Ma_1^2}',
          '\\frac{T_2}{T_1} = \\frac{p_2}{p_1} \\cdot \\frac{\\rho_1}{\\rho_2}'
        ],
      },
    ],
  },

  // ── 10.2 Riemann-Problem ───────────────────────────────────────
  'comp-riemann': {
    lessonId: 'comp-riemann',
    steps: [
      {
        title: 'Das Riemann-Problem',
        text: 'Gegeben: Zwei konstante Zustände $(\\rho_L, u_L, p_L)$ und $(\\rho_R, u_R, p_R)$, getrennt bei $x = 0$. Was passiert zur Zeit $t > 0$?',
        formulas: [
          '\\vec{U}(x, 0) = \\begin{cases} \\vec{U}_L & x < 0 \\\\ \\vec{U}_R & x > 0 \\end{cases}'
        ],
        highlight: { type: 'key', text: 'Das Riemann-Problem ist der fundamentale Baustein für Godunov-artige Verfahren. Jede Zellfläche wird als lokales Riemann-Problem interpretiert.' },
      },
      {
        title: 'Struktur der Lösung',
        text: 'Die exakte Lösung besteht aus **drei Wellen**, die sich vom Anfangspunkt aus ausbreiten:\n\n• **Linke Welle** (Stoß ODER Verdünnungsfächer): bewegt sich nach links\n• **Kontaktdiskontinuität**: Dichtesprung bei gleichem Druck und Geschwindigkeit\n• **Rechte Welle** (Stoß ODER Verdünnungsfächer): bewegt sich nach rechts',
        formulas: [
          '\\text{Links: Stoß/Expansion} \\;|\\; \\text{Kontakt} \\;|\\; \\text{Rechts: Stoß/Expansion}'
        ],
      },
      {
        title: 'Verdünnungsfächer (Rarefaction)',
        text: 'In einer Verdünnungswelle ändern sich die Größen **stetig** — die Zustandswerte "fächern" sich auf. In einem Stoß dagegen sind die Änderungen **diskontinuierlich** (Sprung in $\\rho$, $u$, $p$).',
        highlight: { type: 'tip', text: 'Die Entropie steigt über einen Stoß an (irreversibel), bleibt aber in einer Verdünnungswelle konstant (isentrop).' },
      },
    ],
  },

  // ── 10.3 Godunov & Riemann-Löser ──────────────────────────────
  'comp-godunov': {
    lessonId: 'comp-godunov',
    steps: [
      {
        title: 'Godunovs Methode',
        text: 'Idee: An jeder Zellfläche liegt ein **lokales Riemann-Problem** vor (linker Zustand = Zelle links, rechter Zustand = Zelle rechts). Löse es und benutze die Lösung zur Flussberechnung.',
        formulas: [
          'F_{i+1/2} = F(\\vec{U}^*(0; \\vec{U}_i, \\vec{U}_{i+1}))'
        ],
        highlight: { type: 'key', text: 'Godunovs Schema ist die theoretische Basis aller modernen Shock-Capturing-Verfahren.' },
      },
      {
        title: 'Approximative Riemann-Löser',
        text: 'Die exakte Riemann-Lösung ist teuer (iterativ). Deshalb nutzt man Approximationen:\n\n• **Roe-Löser** (1981): Linearisierung um einen Roe-gemittelten Zustand. Genau, aber kann nicht-physikalische Stöße erzeugen (Entropie-Fix nötig)\n• **HLL** (Harten-Lax-van Leer, 1983): Zwei Wellen, dazwischen ein konstanter Zustand. Sehr robust, aber diffusiv an Kontaktflächen\n• **HLLC**: HLL mit "Kontaktwelle" (C = Contact). Standard in vielen Codes\n• **Rusanov/Lax-Friedrichs**: Einfachst möglich — maximale numerische Diffusion, aber extrem robust',
      },
      {
        title: 'MUSCL-Rekonstruktion',
        text: 'Godunovs Original ist 1. Ordnung (stückweise konstant). Für höhere Ordnung: **MUSCL** (Monotonic Upstream-centered Scheme for Conservation Laws).\n\n• Lineare oder parabolische Rekonstruktion innerhalb jeder Zelle\n• Slope-Limiter (minmod, van Leer) verhindern Oszillationen\n• Ergebnis: 2. Ordnung in Raum bei TVD-Eigenschaft',
        highlight: { type: 'tip', text: 'OpenFOAM nutzt für kompressible Strömung standardmäßig Kurganov-Tadmor (zentrale Godunovsche Flüsse) mit MUSCL-Rekonstruktion.' },
      },
    ],
  },

  // ── 10.4 Sod Shock Tube ────────────────────────────────────────
  'comp-shocktube': {
    lessonId: 'comp-shocktube',
    steps: [
      {
        title: 'Das Sod-Problem (1978)',
        text: 'Der wichtigste 1D-Testfall für kompressible Löser. Eine Membran trennt zwei Gaszustände:',
        formulas: [
          '(\\rho_L, u_L, p_L) = (1.0, \\; 0, \\; 1.0)',
          '(\\rho_R, u_R, p_R) = (0.125, \\; 0, \\; 0.1)',
          '\\gamma = 1.4, \\quad t_{\\text{end}} = 0.2'
        ],
        highlight: { type: 'key', text: 'Die exakte Lösung enthält: eine nach links laufende Verdünnungswelle, eine Kontaktdiskontinuität und einen nach rechts laufenden Stoß.' },
      },
      {
        title: 'Numerische Herausforderungen',
        text: 'Jedes Schema hat typische Artefakte:\n\n• **Zu diffusiv**: Kontaktdiskontinuität verschmiert (UDS, Rusanov)\n• **Oszillationen**: Über- und Unterschwinger am Stoß (CDS, ohne Limiter)\n• **Expansion Shock**: Nicht-physikalischer Verdichtungsstoß (Roe ohne Entropie-Fix)\n• **Karbunkel-Instabilität**: Numerisches Artefakt bei starken Stößen in 2D',
      },
      {
        title: 'Interaktive Simulation',
        text: 'Der 1D-Euler-Löser verwendet das **Lax-Friedrichs-Schema** (robust, aber diffusiv). Beobachte:\n\n• Die drei Wellenstrukturen (Verdünnung, Kontakt, Stoß)\n• Wie die Gitterauflösung die Schärfe beeinflusst\n• Vergleiche mit der exakten Lösung',
        highlight: { type: 'tip', text: 'Mehr Zellen → schärfere Diskontinuitäten. Aber selbst bei N=1000 bleibt die Kontaktdiskontinuität etwas verschmiert (Lax-Friedrichs ist 1. Ordnung).' },
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // 11. TURBULENZ
  // ═══════════════════════════════════════════════════════════════

  // ── 11.1 Was ist Turbulenz? ────────────────────────────────────
  'turb-intro': {
    lessonId: 'turb-intro',
    steps: [
      {
        title: 'Laminare vs. turbulente Strömung',
        text: 'Bei niedriger Reynolds-Zahl ist die Strömung **laminar** — geordnete Stromlinien. Ab einer kritischen Re-Zahl wird sie **turbulent** — chaotisch, dreidimensional, instationär.',
        formulas: [
          'Re = \\frac{UL}{\\nu}',
          'Re_{\\text{krit, Rohr}} \\approx 2300'
        ],
        highlight: { type: 'key', text: 'Turbulenz ist kein Ein/Aus-Phänomen — es gibt einen Übergangsbereich (Transition), der extrem schwer vorherzusagen ist.' },
      },
      {
        title: 'Eigenschaften von Turbulenz',
        text: '• **Dreidimensional**: Auch wenn die mittlere Strömung 2D ist, sind die Schwankungen immer 3D\n• **Instationär**: Ständige zeitliche Fluktuation\n• **Dissipativer Prozess**: Kinetische Energie wird zu Wärme (durch Viskosität auf den kleinsten Skalen)\n• **Nichtlinear**: Keine Superposition — man kann nicht einfach Lösungen addieren\n• **Breites Skalenspektrum**: Von Gebietsgröße (Integralskala) bis zur winzigen Kolmogorov-Skala',
      },
      {
        title: 'Energiekaskade',
        text: 'Richardson (1922): *Big whirls have little whirls...* — Energie fließt von den großen Wirbeln zu den kleinen.',
        formulas: [
          '\\text{Produktion} \\xrightarrow{\\text{Kaskade}} \\text{Transfer} \\xrightarrow{\\text{Dissipation}} \\text{Wärme}',
          'E(k) \\sim \\varepsilon^{2/3} k^{-5/3} \\quad \\text{(Kolmogorov -5/3 Gesetz)}'
        ],
        highlight: { type: 'key', text: 'Das Kolmogorov-Spektrum $E(k) \\propto k^{-5/3}$ gilt im Trägheitsbereich (Inertial Subrange) — zwischen Produktion und Dissipation.' },
      },
      {
        title: 'Kolmogorov-Skalen',
        text: 'Die kleinste Wirbel haben die Kolmogorov-Skala:',
        formulas: [
          '\\eta = \\left(\\frac{\\nu^3}{\\varepsilon}\\right)^{1/4} \\quad \\text{(Länge)}',
          '\\tau_\\eta = \\left(\\frac{\\nu}{\\varepsilon}\\right)^{1/2} \\quad \\text{(Zeit)}',
          '\\frac{L}{\\eta} \\sim Re^{3/4} \\quad \\text{(Skalenverhältnis)}'
        ],
        highlight: { type: 'tip', text: 'Bei Re = 10⁶: $L/\\eta \\approx 30000$ — man bräuchte 30000³ ≈ 2.7×10¹³ Gitterpunkte für DNS! Deshalb brauchen wir Turbulenzmodelle.' },
      },
    ],
  },

  // ── 11.2 RANS ──────────────────────────────────────────────────
  'turb-rans': {
    lessonId: 'turb-rans',
    steps: [
      {
        title: 'Reynolds-Zerlegung',
        text: 'Jede turbulente Größe wird in Mittelwert und Schwankung zerlegt.',
        formulas: [
          'u_i = \\bar{u}_i + u_i\'',
          '\\overline{u_i\'} = 0, \\quad \\overline{\\bar{u}_i} = \\bar{u}_i'
        ],
      },
      {
        title: 'Reynolds-gemittelte Gleichungen (RANS)',
        text: 'Einsetzen in die Navier-Stokes-Gleichungen und mitteln ergibt die RANS-Gleichungen:',
        formulas: [
          '\\rho \\bar{u}_j \\frac{\\partial \\bar{u}_i}{\\partial x_j} = -\\frac{\\partial \\bar{p}}{\\partial x_i} + \\frac{\\partial}{\\partial x_j}\\left[\\mu \\frac{\\partial \\bar{u}_i}{\\partial x_j} - \\rho \\overline{u_i\' u_j\'}\\right]'
        ],
        highlight: { type: 'key', text: 'Der Term $-\\rho \\overline{u_i\' u_j\'}$ ist der **Reynolds-Spannungstensor** — 6 neue Unbekannte, aber keine neuen Gleichungen → **Schließungsproblem**!' },
      },
      {
        title: 'Das Schließungsproblem',
        text: 'Um die RANS-Gleichungen zu lösen, muss man die Reynolds-Spannungen **modellieren**.\n\n**Boussinesq-Hypothese** (1877): Die Reynolds-Spannungen verhalten sich wie laminare Spannungen mit einer "turbulenten Viskosität".',
        formulas: [
          '-\\overline{u_i\' u_j\'} = \\nu_t \\left(\\frac{\\partial \\bar{u}_i}{\\partial x_j} + \\frac{\\partial \\bar{u}_j}{\\partial x_i}\\right) - \\frac{2}{3} k \\delta_{ij}'
        ],
        highlight: { type: 'warning', text: 'Die Boussinesq-Hypothese nimmt an, dass die Turbulenz isotrop ist und Reynolds-Spannungen mit der mittleren Deformation ausgerichtet sind. Das ist oft falsch!' },
      },
      {
        title: 'Übersicht der RANS-Modelle',
        text: '• **Algebraische Modelle** (Prandtl Mischungsweg): $\\nu_t = l_m^2 |\\partial u/\\partial y|$ — kein PDE, nur lokale Formel\n• **Spalart-Allmaras**: 1 Transportgleichung für $\\tilde{\\nu}$ — beliebt in der Luftfahrt\n• **k-ε**: 2 Gleichungen für k (turbulente kinetische Energie) und ε (Dissipation)\n• **k-ω**: 2 Gleichungen für k und ω (spezifische Dissipation) — besser an Wänden\n• **k-ω SST** (Menter): Hybridmodell k-ω/k-ε — der Industriestandard!\n• **RSM** (Reynolds Stress Model): 7 Gleichungen — genauer, aber teuer und instabil',
      },
    ],
  },

  // ── 11.3 k-ε Modell ───────────────────────────────────────────
  'turb-ke': {
    lessonId: 'turb-ke',
    steps: [
      {
        title: 'Die zwei Gleichungen',
        text: 'Das Standard k-ε-Modell (Launder & Spalding, 1974) löst Transportgleichungen für:',
        formulas: [
          'k = \\frac{1}{2} \\overline{u_i\' u_i\'} \\quad \\text{(turbulente kinetische Energie)}',
          '\\varepsilon = \\nu \\overline{\\frac{\\partial u_i\'}{\\partial x_j} \\frac{\\partial u_i\'}{\\partial x_j}} \\quad \\text{(Dissipationsrate)}'
        ],
      },
      {
        title: 'Turbulente Viskosität',
        text: 'Aus k und ε berechnet sich die turbulente Viskosität:',
        formulas: [
          '\\nu_t = C_\\mu \\frac{k^2}{\\varepsilon}',
          'C_\\mu = 0.09'
        ],
        highlight: { type: 'key', text: 'Dimensionsanalyse: $[k^2/\\varepsilon] = (m^2/s^2)^2 / (m^2/s^3) = m^2/s$ — passt für eine Viskosität!' },
      },
      {
        title: 'Transportgleichungen',
        formulas: [
          '\\frac{\\partial k}{\\partial t} + \\bar{u}_j \\frac{\\partial k}{\\partial x_j} = P_k - \\varepsilon + \\frac{\\partial}{\\partial x_j}\\left[\\left(\\nu + \\frac{\\nu_t}{\\sigma_k}\\right)\\frac{\\partial k}{\\partial x_j}\\right]',
          '\\frac{\\partial \\varepsilon}{\\partial t} + \\bar{u}_j \\frac{\\partial \\varepsilon}{\\partial x_j} = C_1 \\frac{\\varepsilon}{k} P_k - C_2 \\frac{\\varepsilon^2}{k} + \\frac{\\partial}{\\partial x_j}\\left[\\left(\\nu + \\frac{\\nu_t}{\\sigma_\\varepsilon}\\right)\\frac{\\partial \\varepsilon}{\\partial x_j}\\right]'
        ],
        text: 'Produktion $P_k = \\nu_t |\\bar{S}|^2$. Standardkonstanten: $C_1 = 1.44$, $C_2 = 1.92$, $\\sigma_k = 1.0$, $\\sigma_\\varepsilon = 1.3$.',
      },
      {
        title: 'Stärken und Schwächen',
        text: '**Stärken**: Einfach, robust, gut für angehängte Grenzschichten und freie Scherschichten.\n\n**Schwächen**:\n• Überschätzt k an Staupunkten (Stagnationsanomalie)\n• Versagt bei starker Stromlinienkrümmung und Rotation\n• ε ist an der Wand singulär → Wandfunktionen nötig\n• Schlechte Vorhersage für Ablösung',
        highlight: { type: 'warning', text: 'In der Industrie wird das Standard k-ε kaum noch allein verwendet. k-ω SST oder Realizable k-ε sind die bessere Wahl.' },
      },
    ],
  },

  // ── 11.4 k-ω SST ──────────────────────────────────────────────
  'turb-kw-sst': {
    lessonId: 'turb-kw-sst',
    steps: [
      {
        title: 'k-ω Modell (Wilcox)',
        text: 'Statt ε nutzt Wilcox die **spezifische Dissipationsrate** $\\omega = \\varepsilon / (C_\\mu k)$.',
        formulas: [
          '\\nu_t = \\frac{k}{\\omega}',
          '\\omega \\to \\text{endlich an der Wand} \\quad (\\varepsilon \\to \\infty!)'
        ],
        highlight: { type: 'key', text: 'Vorteil von k-ω: Direkte Integration bis zur Wand möglich, ohne spezielle Wandfunktionen.' },
      },
      {
        title: 'Die Schwäche: Fernfeldempfindlichkeit',
        text: 'Das reine k-ω-Modell ist empfindlich gegenüber dem ω-Wert in der freien Anströmung (Fernfeldwerte). Das k-ε-Modell hat dieses Problem nicht.',
        highlight: { type: 'warning', text: 'Deshalb die Idee von Menter: k-ω nahe der Wand, k-ε im Fernfeld → das Beste aus beiden Welten!' },
      },
      {
        title: 'SST = Shear Stress Transport (Menter 1994)',
        text: 'Menters SST-Modell blendet zwischen k-ω (Wand) und k-ε (Fernfeld) mittels einer **Blending-Funktion** $F_1$ um.',
        formulas: [
          '\\phi = F_1 \\cdot \\phi_{k\\omega} + (1 - F_1) \\cdot \\phi_{k\\varepsilon}',
          'F_1 \\to 1 \\text{ (nahe Wand)}, \\quad F_1 \\to 0 \\text{ (fern)}'
        ],
        highlight: { type: 'key', text: 'Der "SST"-Teil limitiert zusätzlich die Schubspannung in adversen Druckgradienten — entscheidend für Ablösungsvorhersage.' },
      },
      {
        title: 'Industriestandard',
        text: 'k-ω SST ist heute der am häufigsten verwendete RANS-Modell in der Industrie:\n\n• Gute Vorhersage für angehängte und abgelöste Grenzschichten\n• Robuste Wandbehandlung\n• Implementiert in jedem kommerziellen CFD-Code\n• Standardmodell in OpenFOAM',
        highlight: { type: 'tip', text: 'Wenn du unsicher bist, welches RANS-Modell: Nimm k-ω SST. Es ist für die meisten Anwendungen die beste Wahl.' },
      },
    ],
  },

  // ── 11.5 LES ───────────────────────────────────────────────────
  'turb-les': {
    lessonId: 'turb-les',
    steps: [
      {
        title: 'Idee der Grobstruktursimulation',
        text: 'LES (Large Eddy Simulation) löst die **gefilterten** Navier-Stokes-Gleichungen: Strukturen größer als die Filterweite $\\Delta$ werden direkt berechnet, kleinere modelliert.',
        formulas: [
          '\\bar{\\phi}(\\vec{x}) = \\int G(\\vec{x} - \\vec{x}\', \\Delta) \\phi(\\vec{x}\') d\\vec{x}\''
        ],
        highlight: { type: 'key', text: 'In der Praxis ist die Filterweite = Gittergröße. Alles was das Gitter auflösen kann, wird berechnet.' },
      },
      {
        title: 'Subgrid-Scale (SGS) Modelle',
        text: '• **Smagorinsky** (1963): $\\nu_{sgs} = (C_S \\Delta)^2 |\\bar{S}|$. Einfach, aber zu dissipativ an Wänden\n• **Dynamisches Smagorinsky** (Germano, 1991): $C_S$ wird lokal berechnet — viel bessere Ergebnisse\n• **WALE** (Wall-Adapting Local Eddy-viscosity): Besseres Wandverhalten als Standard-Smagorinsky\n• **σ-Modell**: Neuerer Ansatz mit Eigenwerten des Geschwindigkeitsgradienten',
        formulas: [
          '\\nu_{sgs} = (C_S \\Delta)^2 |\\bar{S}|, \\quad C_S \\approx 0.1 \\text{–} 0.2'
        ],
      },
      {
        title: 'Rechenaufwand',
        text: 'LES ist wesentlich teurer als RANS:\n\n• **Gitter**: Muss fein genug sein, um ~80% der turbulenten Energie aufzulösen. An Wänden: $\\Delta x^+ \\sim 50$, $\\Delta y^+ \\sim 1$, $\\Delta z^+ \\sim 15$\n• **Instationär**: Zeitschritte $\\Delta t \\sim \\Delta x / U$, viele Durchflusszeiten für Statistik\n• **3D**: Immer dreidimensional (Turbulenz ist 3D!)',
        formulas: [
          'N_{\\text{LES}} \\sim Re^{13/7} \\quad \\text{(Gitterpunkte)}',
          'N_{\\text{DNS}} \\sim Re^{9/4} \\quad \\text{(zum Vergleich)}'
        ],
        highlight: { type: 'warning', text: 'LES an Wänden bei hohem Re ist extrem teuer. Deshalb: Hybrid-Methoden wie DES (Detached Eddy Simulation) = RANS an der Wand + LES außerhalb.' },
      },
    ],
  },

  // ── 11.6 DNS ───────────────────────────────────────────────────
  'turb-dns': {
    lessonId: 'turb-dns',
    steps: [
      {
        title: 'Direkte Numerische Simulation',
        text: 'DNS löst die Navier-Stokes-Gleichungen **ohne jedes Turbulenzmodell**. Alle Skalen — von der Integralskala bis zur Kolmogorov-Skala — werden direkt aufgelöst.',
        formulas: [
          'N_{\\text{3D}} \\sim \\left(\\frac{L}{\\eta}\\right)^3 \\sim Re^{9/4}'
        ],
        highlight: { type: 'key', text: 'DNS gibt die "exakte" Lösung (nur numerische Fehler, kein Modellfehler). Aber der Rechenaufwand wächst mit Re^{9/4} — exponentiell teuer!' },
      },
      {
        title: 'Aktuelle Grenzen',
        text: 'Stand 2024: DNS ist möglich bis ca. $Re_\\tau \\approx 10000$ (Kanalströmung) auf den größten Supercomputern.\n\n• **Re = 100**: Einige tausend Gitterpunkte — auf dem Laptop\n• **Re = 10.000**: ~$10^{10}$ Gitterpunkte — Supercomputer\n• **Re = $10^6$** (Flugzeug): ~$10^{17}$ Punkte — unmöglich (noch für Jahrzehnte)',
      },
      {
        title: 'Wozu DNS?',
        text: 'DNS wird nicht für industrielle Probleme verwendet, sondern:\n\n• Zum **Verständnis** der Turbulenzphysik\n• Als **Referenzdaten** zur Validierung von RANS/LES-Modellen\n• Zur Entwicklung neuer Modelle (z.B. ML-basierte Turbulenzmodelle)',
        highlight: { type: 'tip', text: 'Berühmte DNS-Datensätze: Moser et al. (1999) Kanalströmung, Jiménez & Moin (1991) Grenzschicht.' },
      },
    ],
  },

  // ── 11.7 Wandbehandlung ────────────────────────────────────────
  'turb-wall': {
    lessonId: 'turb-wall',
    steps: [
      {
        title: 'Wandgrenzschicht-Struktur',
        text: 'Nahe einer Wand bildet sich eine dünne Grenzschicht mit charakteristischer Struktur. Die dimensionslosen Wandvariablen sind:',
        formulas: [
          'u_\\tau = \\sqrt{\\frac{\\tau_w}{\\rho}} \\quad \\text{(Schubspannungsgeschwindigkeit)}',
          'y^+ = \\frac{y \\cdot u_\\tau}{\\nu}, \\quad u^+ = \\frac{\\bar{u}}{u_\\tau}'
        ],
      },
      {
        title: 'Die drei Schichten',
        text: '• **Viskose Unterschicht** ($y^+ < 5$): $u^+ = y^+$ — Viskosität dominiert\n• **Pufferschicht** ($5 < y^+ < 30$): Übergangsbereich\n• **Log-Schicht** ($y^+ > 30$): $u^+ = \\frac{1}{\\kappa} \\ln(y^+) + B$ — Turbulenz dominiert',
        formulas: [
          'u^+ = \\frac{1}{\\kappa} \\ln(y^+) + B, \\quad \\kappa \\approx 0.41, \\; B \\approx 5.2'
        ],
        highlight: { type: 'key', text: 'Das logarithmische Wandgesetz ist universal — es gilt für alle turbulenten Wandgrenzschichten (bei Gleichgewichts-Turbulenz).' },
      },
      {
        title: 'Wandfunktionen vs. Wandauflösung',
        text: '**Wandauflösung** ($y^+ \\leq 1$): Das Gitter löst die viskose Unterschicht auf. Möglich mit k-ω Modellen.\n\n**Wandfunktionen** ($30 < y^+ < 300$): Die erste Zelle liegt in der Log-Schicht. Die Wandschubspannung wird analytisch berechnet. Nötig für k-ε.',
        highlight: { type: 'tip', text: 'In der Simulation kannst du das Log-Gesetz-Profil einer turbulenten Kanalströmung sehen und mit verschiedenen $y^+$-Werten spielen.' },
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // 12. ZWEIPHASENSTRÖMUNGEN
  // ═══════════════════════════════════════════════════════════════

  // ── 12.1 Einführung ────────────────────────────────────────────
  'twophase-intro': {
    lessonId: 'twophase-intro',
    steps: [
      {
        title: 'Was sind Zweiphasenströmungen?',
        text: 'Strömungen mit zwei (oder mehr) gleichzeitig vorhandenen Phasen:\n\n• **Gas-Flüssigkeit**: Blasen in Wasser, Wellen, Spray\n• **Flüssigkeit-Flüssigkeit**: Öl/Wasser-Emulsion\n• **Gas-Feststoff**: Wirbelschicht, pneumatischer Transport\n• **Flüssigkeit-Feststoff**: Sedimenttransport, Schlammströmung',
        highlight: { type: 'key', text: 'Die Schwierigkeit: Die Phasengrenzfläche bewegt sich, verformt sich und kann aufbrechen/verschmelzen — das erfordert spezielle numerische Methoden.' },
      },
      {
        title: 'Euler-Euler vs. Euler-Lagrange',
        text: '**Euler-Euler**: Beide Phasen als Kontinua auf dem gleichen Gitter. Jede Phase hat eigene Erhaltungsgleichungen + Austauschterme.\n\n**Euler-Lagrange**: Kontinuierliche Phase (Euler) + diskrete Partikel/Tropfen/Blasen (Lagrange). Jedes Partikel wird einzeln verfolgt.',
        formulas: [
          '\\text{Euler-Euler: } \\alpha_1 + \\alpha_2 = 1 \\quad (\\text{Volumenfüllfaktoren})',
          '\\text{Euler-Lagrange: } m_p \\frac{d\\vec{v}_p}{dt} = \\vec{F}_D + \\vec{F}_G + ... \\quad (\\text{pro Partikel})'
        ],
      },
      {
        title: 'Interface-Capturing vs. Interface-Tracking',
        text: '**Interface-Tracking** (explizit): Gitter folgt der Grenzfläche. Genau, aber schwer bei Topologieänderungen.\n\n**Interface-Capturing** (implizit): Grenzfläche wird durch ein Feld auf dem festen Gitter dargestellt (VOF, Level-Set). Robust bei Aufbrechen/Verschmelzen.',
        highlight: { type: 'tip', text: 'In der Praxis dominiert Interface-Capturing (VOF in OpenFOAM, Fluent). Es kann automatisch mit Topologieänderungen umgehen.' },
      },
    ],
  },

  // ── 12.2 VOF ───────────────────────────────────────────────────
  'twophase-vof': {
    lessonId: 'twophase-vof',
    steps: [
      {
        title: 'Volume of Fluid',
        text: 'Die VOF-Methode (Hirt & Nichols, 1981) definiert einen **Volumenfüllfaktor** α:',
        formulas: [
          '\\alpha = \\begin{cases} 0 & \\text{Phase 1 (z.B. Gas)} \\\\ 1 & \\text{Phase 2 (z.B. Flüssigkeit)} \\\\ 0 < \\alpha < 1 & \\text{Grenzflächenzelle} \\end{cases}'
        ],
        highlight: { type: 'key', text: 'α ist eine konservierte Größe — VOF erhält die Masse exakt (im Gegensatz zu Level-Set).' },
      },
      {
        title: 'Transport von α',
        text: 'α wird mit der Strömung advektiert:',
        formulas: [
          '\\frac{\\partial \\alpha}{\\partial t} + \\nabla \\cdot (\\alpha \\vec{u}) = 0'
        ],
        highlight: { type: 'warning', text: 'Problem: Normales UDS/CDS verschmiert die scharfe Grenzfläche über viele Zellen. Man braucht spezielle Interface-Kompressions-Schemata!' },
      },
      {
        title: 'Interface-Rekonstruktion (PLIC)',
        text: '**PLIC** (Piecewise Linear Interface Calculation): In jeder Grenzflächenzelle wird die Grenzfläche als ebene Fläche rekonstruiert.\n\n1. Berechne den Normalenvektor $\\vec{n}$ aus dem α-Gradient\n2. Bestimme die Position der Ebene so, dass der α-Wert exakt eingehalten wird\n3. Berechne geometrische Flüsse durch die Zellflächen',
        highlight: { type: 'tip', text: 'In der 1D-Simulation siehst du, wie numerische Diffusion die Grenzfläche verschmiert und was passiert, wenn man die Auflösung erhöht.' },
      },
      {
        title: 'Fluideigenschaften',
        text: 'In der gesamten Domain werden Dichte und Viskosität als Funktion von α berechnet:',
        formulas: [
          '\\rho = \\alpha \\rho_2 + (1 - \\alpha) \\rho_1',
          '\\mu = \\alpha \\mu_2 + (1 - \\alpha) \\mu_1'
        ],
      },
    ],
  },

  // ── 12.3 Level-Set ─────────────────────────────────────────────
  'twophase-levelset': {
    lessonId: 'twophase-levelset',
    steps: [
      {
        title: 'Die Level-Set-Funktion',
        text: 'Statt α nutzt die Level-Set-Methode eine **vorzeichenbehaftete Abstandsfunktion** φ:',
        formulas: [
          '\\phi(\\vec{x}) = \\begin{cases} < 0 & \\text{Phase 1} \\\\ = 0 & \\text{Grenzfläche} \\\\ > 0 & \\text{Phase 2} \\end{cases}',
          '|\\nabla \\phi| = 1 \\quad \\text{(Abstandseigenschaft)}'
        ],
        highlight: { type: 'key', text: 'Vorteil: Normalenvektor $\\vec{n} = \\nabla \\phi / |\\nabla \\phi|$ und Krümmung $\\kappa = \\nabla \\cdot \\vec{n}$ sind direkt aus φ berechenbar — wichtig für Oberflächenspannung!' },
      },
      {
        title: 'Transport und Reinitialisierung',
        text: 'φ wird advektiert:',
        formulas: [
          '\\frac{\\partial \\phi}{\\partial t} + \\vec{u} \\cdot \\nabla \\phi = 0'
        ],
        highlight: { type: 'warning', text: 'Problem: Nach einigen Zeitschritten ist $|\\nabla \\phi| \\neq 1$ → man muss regelmäßig **reinitialisieren** (eine Hamilton-Jacobi-Gleichung lösen).' },
      },
      {
        title: 'Massenerhaltungsproblem',
        text: 'Da φ keine konservierte Größe ist, kann sich die Masse unphysikalisch ändern. Kleine Strukturen (z.B. dünne Filamente) können verschwinden.\n\nLösung: **CLSVOF** (Coupled Level-Set / VOF) — kombiniert die Massenerhaltung von VOF mit der genauen Geometrie von Level-Set.',
      },
    ],
  },

  // ── 12.4 Oberflächenspannung ───────────────────────────────────
  'twophase-surface-tension': {
    lessonId: 'twophase-surface-tension',
    steps: [
      {
        title: 'Young-Laplace-Gleichung',
        text: 'An einer gekrümmten Grenzfläche bewirkt die Oberflächenspannung $\\sigma$ einen Drucksprung:',
        formulas: [
          '\\Delta p = p_{\\text{innen}} - p_{\\text{außen}} = \\sigma \\kappa',
          '\\kappa = \\nabla \\cdot \\hat{n} = \\frac{1}{R_1} + \\frac{1}{R_2} \\quad \\text{(Krümmung)}'
        ],
        highlight: { type: 'key', text: 'Der Drucksprung treibt z.B. Kapillarwirkung: $\\sigma_{Wasser} \\approx 0.072$ N/m erzeugt in einem 1-mm-Röhrchen ΔP ≈ 288 Pa.' },
      },
      {
        title: 'CSF-Methode (Continuum Surface Force)',
        text: 'Brackbill et al. (1992): Die Oberflächenspannung wird als **Volumenkraft** in den Impulstermen modelliert:',
        formulas: [
          '\\vec{F}_{\\sigma} = \\sigma \\kappa \\nabla \\alpha \\quad \\text{oder} \\quad \\vec{F}_{\\sigma} = \\sigma \\kappa \\delta(\\phi) \\nabla \\phi'
        ],
        highlight: { type: 'tip', text: 'Der CSF-Ansatz ist einfach zu implementieren, aber erzeugt parasitäre Ströme (spurious currents) an glatten Grenzflächen!' },
      },
      {
        title: 'Kapillarzahl',
        text: 'Die Kapillarzahl vergleicht viskose mit Oberflächenspannungskräften:',
        formulas: [
          'Ca = \\frac{\\mu U}{\\sigma}',
          'Ca \\ll 1: \\text{ Oberflächenspannung dominiert (Tropfenform bleibt rund)}',
          'Ca \\gg 1: \\text{ Viskose Kräfte verformen den Tropfen}'
        ],
      },
    ],
  },
};
