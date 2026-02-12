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
};
