'use client';

import React, { useEffect, useRef } from 'react';
import katex from 'katex';
import { useSimulation } from '@/context/SimulationContext';

/** Render a KaTeX formula into a span */
function Formula({ tex, display = false }: { tex: string; display?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (ref.current) {
      katex.render(tex, ref.current, {
        displayMode: display,
        throwOnError: false,
        trust: true,
      });
    }
  }, [tex, display]);
  return <span ref={ref} />;
}

// ── Learning steps for Milestone A ─────────────────────────────────

interface LearningStep {
  title: string;
  content: React.ReactNode;
}

function useLearningSteps(): LearningStep[] {
  const { state } = useSimulation();
  const { scheme, cfl, gamma } = state;

  return [
    {
      title: '1. Erhaltungsgleichung (kontinuierlich)',
      content: (
        <div className="space-y-3">
          <p className="text-gray-300">
            Wir starten mit der <strong>skalaren Transportgleichung</strong> in 1D:
          </p>
          <div className="bg-gray-800 p-3 rounded text-center">
            <Formula tex="\frac{\partial \phi}{\partial t} + \frac{\partial (u \phi)}{\partial x} = \Gamma \frac{\partial^2 \phi}{\partial x^2}" display />
          </div>
          <p className="text-gray-400 text-xs">
            φ = transportierte Größe (Temperatur, Konzentration, ...)<br />
            u = Konvektionsgeschwindigkeit<br />
            Γ = Diffusionskoeffizient {gamma === 0 ? '(hier = 0, reine Konvektion)' : `(= ${gamma})`}
          </p>
        </div>
      ),
    },
    {
      title: '2. Integralform (Finite-Volumen)',
      content: (
        <div className="space-y-3">
          <p className="text-gray-300">
            Integration über ein Kontrollvolumen V mit Oberfläche A:
          </p>
          <div className="bg-gray-800 p-3 rounded text-center">
            <Formula tex="\frac{d}{dt} \int_V \phi \, dV + \oint_A (u \phi) \cdot \mathbf{n} \, dA = \oint_A \Gamma \nabla\phi \cdot \mathbf{n} \, dA" display />
          </div>
          <p className="text-gray-400 text-xs">
            In 1D mit uniformem Gitter (Δx) wird daraus:<br />
            <Formula tex="\Delta x \frac{d\phi_P}{dt} + F_{i+\frac{1}{2}} - F_{i-\frac{1}{2}} = D_{i+\frac{1}{2}} - D_{i-\frac{1}{2}}" />
          </p>
          <p className="text-gray-400 text-xs">
            wobei <Formula tex="F_{i+\frac{1}{2}} = u \cdot \phi_f" /> der <strong>konvektive Flux</strong> an der Zellfläche ist.
          </p>
        </div>
      ),
    },
    {
      title: '3. Flächeninterpolation (Schema)',
      content: (
        <div className="space-y-3">
          <p className="text-gray-300">
            Das <strong>{scheme}</strong>-Schema bestimmt <Formula tex="\phi_f" /> aus den Zellwerten:
          </p>
          {scheme === 'UDS' && (
            <div className="bg-gray-800 p-3 rounded">
              <p className="text-center mb-2">
                <Formula tex="\phi_f = \begin{cases} \phi_P & \text{wenn } u \geq 0 \\ \phi_E & \text{wenn } u < 0 \end{cases}" display />
              </p>
              <p className="text-xs text-green-400">
                ✓ Immer stabil (für CFL ≤ 1), aber numerisch diffusiv (1. Ordnung)
              </p>
            </div>
          )}
          {scheme === 'CDS' && (
            <div className="bg-gray-800 p-3 rounded">
              <p className="text-center mb-2">
                <Formula tex="\phi_f = \frac{1}{2}(\phi_P + \phi_E)" display />
              </p>
              <p className="text-xs text-yellow-400">
                ⚠ 2. Ordnung genau, aber kann bei Pe &gt; 2 Oszillationen erzeugen!
              </p>
            </div>
          )}
          {scheme.startsWith('TVD') && (
            <div className="bg-gray-800 p-3 rounded">
              <p className="text-center mb-2">
                <Formula tex="\phi_f = \phi_U + \frac{1}{2}\psi(r)(\phi_D - \phi_U)" display />
              </p>
              <p className="text-xs text-blue-400">
                {'ψ(r) ist der Flux-Limiter. r = (φ_U − φ_UU)/(φ_D − φ_U) misst die Glätte.'}
              </p>
            </div>
          )}
        </div>
      ),
    },
    {
      title: '4. Diskrete Gleichung',
      content: (
        <div className="space-y-3">
          <p className="text-gray-300">Expliziter Euler-Zeitschritt:</p>
          <div className="bg-gray-800 p-3 rounded text-center">
            <Formula tex="\phi_P^{n+1} = \phi_P^n - \frac{\Delta t}{\Delta x}\left(F_{i+\frac{1}{2}} - F_{i-\frac{1}{2}}\right)" display />
          </div>
          {gamma > 0 && (
            <div className="bg-gray-800 p-3 rounded text-center mt-2">
              <Formula tex="+ \frac{\Delta t}{\Delta x}\left(D_{i+\frac{1}{2}} - D_{i-\frac{1}{2}}\right)" display />
              <p className="text-xs text-gray-400 mt-1">
                mit <Formula tex="D_{i+\frac{1}{2}} = \frac{\Gamma}{\Delta x}(\phi_E - \phi_P)" />
              </p>
            </div>
          )}
        </div>
      ),
    },
    {
      title: '5. Stabilitätsbedingung',
      content: (
        <div className="space-y-3">
          <p className="text-gray-300">CFL-Bedingung für explizite Zeitintegration:</p>
          <div className="bg-gray-800 p-3 rounded text-center">
            <Formula tex="\text{CFL} = \frac{|u| \Delta t}{\Delta x} \leq 1" display />
          </div>
          <div className={`p-2 rounded text-sm ${cfl <= 1 ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
            Aktuelle CFL = {cfl.toFixed(3)} {cfl <= 1 ? '✓ stabil' : '✗ INSTABIL!'}
          </div>
          {gamma > 0 && (
            <>
              <p className="text-gray-300 mt-2">Peclet-Zahl (Konvektion vs Diffusion):</p>
              <div className="bg-gray-800 p-3 rounded text-center">
                <Formula tex="\text{Pe} = \frac{|u| \Delta x}{\Gamma}" display />
              </div>
              <p className="text-xs text-gray-400">
                Pe = {state.peclet === Infinity ? '∞' : state.peclet.toFixed(1)} ·
                {state.peclet > 2
                  ? ' CDS wird Oszillationen zeigen!'
                  : ' CDS sollte stabil sein.'}
              </p>
            </>
          )}
        </div>
      ),
    },
  ];
}

export default function FormulaPanel() {
  const { state, dispatch } = useSimulation();
  const steps = useLearningSteps();
  const currentStep = state.learningStep;

  return (
    <div className="flex flex-col h-full bg-gray-900 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-700">
        <h2 className="text-sm font-bold text-cyan-400">📐 Formeln & Theorie</h2>
        <span className="text-xs text-gray-500">{currentStep + 1}/{steps.length}</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <h3 className="text-base font-semibold text-white mb-3">
          {steps[currentStep]?.title}
        </h3>
        {steps[currentStep]?.content}
      </div>

      {/* Navigation */}
      <div className="flex justify-between px-4 py-2 border-t border-gray-700">
        <button
          disabled={currentStep === 0}
          onClick={() => dispatch({ type: 'SET_LEARNING_STEP', step: currentStep - 1 })}
          className="px-3 py-1 rounded text-xs bg-gray-700 hover:bg-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          ← Zurück
        </button>
        <div className="flex gap-1">
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => dispatch({ type: 'SET_LEARNING_STEP', step: i })}
              className={`w-2 h-2 rounded-full transition-colors ${
                i === currentStep ? 'bg-cyan-400' : 'bg-gray-600'
              }`}
            />
          ))}
        </div>
        <button
          disabled={currentStep === steps.length - 1}
          onClick={() => dispatch({ type: 'SET_LEARNING_STEP', step: currentStep + 1 })}
          className="px-3 py-1 rounded text-xs bg-gray-700 hover:bg-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Weiter →
        </button>
      </div>
    </div>
  );
}
