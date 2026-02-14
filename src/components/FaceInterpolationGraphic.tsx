'use client';

import React, { useState, useCallback, useRef, useMemo } from 'react';

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   FaceInterpolationGraphic — Interactive SVG that shows how UDS, CDS
   and TVD interpolate face values differently.

   The user can:
     • Drag cell values up/down to change the profile
     • Toggle active schemes on/off
     • Select preset profiles (step, ramp, smooth, sine)
   
   Shows 5 cells with 4 faces, and for each face the interpolated value
   per active scheme. Flow direction is always left → right.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

// ── Layout constants ──────────────────────────────────────────────
const W = 520;
const H = 340;
const PAD_L = 52;
const PAD_R = 22;
const PAD_T = 44;
const PAD_B = 58;
const PLOT_W = W - PAD_L - PAD_R;
const PLOT_H = H - PAD_T - PAD_B;
const N_CELLS = 5;
const CELL_W = PLOT_W / N_CELLS;

// Value range
const V_MIN = 0;
const V_MAX = 1;

// Face positions (between cells)
const FACE_INDICES = [0, 1, 2, 3]; // face i is between cell i and cell i+1

// ── Scheme colors ─────────────────────────────────────────────────
const SCHEME_META = {
  UDS:     { color: '#f97316', label: 'UDS (Upwind)', dash: '' },
  CDS:     { color: '#22d3ee', label: 'CDS (Central)', dash: '6,3' },
  TVD:     { color: '#a78bfa', label: 'TVD (van Leer)', dash: '3,3' },
} as const;
type SchemeKey = keyof typeof SCHEME_META;

// ── Presets ────────────────────────────────────────────────────────
const PRESETS: Record<string, { label: string; values: number[] }> = {
  step:   { label: 'Sprung',  values: [0.2, 0.2, 0.8, 0.8, 0.8] },
  ramp:   { label: 'Rampe',   values: [0.1, 0.3, 0.5, 0.7, 0.9] },
  smooth: { label: 'Gauß',    values: [0.1, 0.4, 0.9, 0.4, 0.1] },
  wiggle: { label: 'Welle',   values: [0.2, 0.8, 0.2, 0.8, 0.2] },
};

// ── Limiter helpers ───────────────────────────────────────────────
function vanLeer(r: number): number {
  if (r <= 0) return 0;
  return (2 * r) / (1 + r);
}

// ── Interpolation functions ───────────────────────────────────────
function faceUDS(vals: number[], face: number): number {
  // Upwind = left cell (flow left → right)
  return vals[face];
}

function faceCDS(vals: number[], face: number): number {
  return 0.5 * (vals[face] + vals[face + 1]);
}

function faceTVD(vals: number[], face: number): number {
  const phiU  = vals[face];
  const phiD  = vals[face + 1];
  const phiUU = face > 0 ? vals[face - 1] : vals[face]; // clamp
  const denom = phiD - phiU;
  const r = Math.abs(denom) < 1e-12 ? 1 : (phiU - phiUU) / denom;
  const psi = vanLeer(r);
  return phiU + 0.5 * psi * (phiD - phiU);
}

const SCHEME_FN: Record<SchemeKey, (vals: number[], face: number) => number> = {
  UDS: faceUDS,
  CDS: faceCDS,
  TVD: faceTVD,
};

// ── Coordinate helpers ────────────────────────────────────────────
function cellCenterX(i: number): number {
  return PAD_L + (i + 0.5) * CELL_W;
}
function faceX(i: number): number {
  return PAD_L + (i + 1) * CELL_W;
}
function valToY(v: number): number {
  return PAD_T + PLOT_H * (1 - (v - V_MIN) / (V_MAX - V_MIN));
}
function yToVal(y: number): number {
  const v = V_MIN + (1 - (y - PAD_T) / PLOT_H) * (V_MAX - V_MIN);
  return Math.max(V_MIN, Math.min(V_MAX, v));
}

// ═══════════════════════════════════════════════════════════════════
export default function FaceInterpolationGraphic() {
  const [cellValues, setCellValues] = useState<number[]>(PRESETS.step.values);
  const [activeSchemes, setActiveSchemes] = useState<Record<SchemeKey, boolean>>({
    UDS: true, CDS: true, TVD: true,
  });
  const [activePreset, setActivePreset] = useState('step');
  const [dragging, setDragging] = useState<number | null>(null);
  const [hoveredFace, setHoveredFace] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // ── Drag handlers ─────────────────────────────────────────────
  const getSvgY = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!svgRef.current) return 0;
    const rect = svgRef.current.getBoundingClientRect();
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    return (clientY - rect.top) * (H / rect.height);
  }, []);

  const handlePointerMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (dragging === null) return;
    const y = getSvgY(e);
    const v = yToVal(y);
    setCellValues(prev => {
      const next = [...prev];
      next[dragging] = Math.round(v * 100) / 100;
      return next;
    });
    setActivePreset('');
  }, [dragging, getSvgY]);

  const handlePointerUp = useCallback(() => setDragging(null), []);

  // ── Computed face values ──────────────────────────────────────
  const faceValues = useMemo(() => {
    const result: Record<SchemeKey, number[]> = { UDS: [], CDS: [], TVD: [] };
    for (const face of FACE_INDICES) {
      for (const scheme of Object.keys(SCHEME_FN) as SchemeKey[]) {
        result[scheme].push(SCHEME_FN[scheme](cellValues, face));
      }
    }
    return result;
  }, [cellValues]);

  // ── Y-axis ticks ──────────────────────────────────────────────
  const yTicks = [0, 0.25, 0.5, 0.75, 1.0];

  return (
    <div className="mt-4 bg-gray-900/70 rounded-xl border border-gray-800/60 overflow-hidden">
      {/* Header controls */}
      <div className="flex flex-wrap items-center gap-3 px-3 py-2 border-b border-gray-800/40">
        {/* Scheme toggles */}
        <div className="flex items-center gap-2">
          {(Object.keys(SCHEME_META) as SchemeKey[]).map(key => (
            <button
              key={key}
              onClick={() => setActiveSchemes(prev => ({ ...prev, [key]: !prev[key] }))}
              className={`flex items-center gap-1.5 px-2 py-1 rounded text-[11px] font-medium transition-all ${
                activeSchemes[key]
                  ? 'bg-gray-800 text-gray-200'
                  : 'bg-transparent text-gray-600 hover:text-gray-400'
              }`}
            >
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0 transition-opacity"
                style={{
                  backgroundColor: SCHEME_META[key].color,
                  opacity: activeSchemes[key] ? 1 : 0.3,
                }}
              />
              {key}
            </button>
          ))}
        </div>

        <div className="w-px h-4 bg-gray-800" />

        {/* Presets */}
        <div className="flex items-center gap-1">
          {Object.entries(PRESETS).map(([key, { label }]) => (
            <button
              key={key}
              onClick={() => {
                setCellValues(PRESETS[key].values);
                setActivePreset(key);
              }}
              className={`px-2 py-0.5 rounded text-[10px] transition-colors ${
                activePreset === key
                  ? 'bg-cyan-600/30 text-cyan-300'
                  : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* SVG canvas */}
      <div className="flex justify-center px-2 pt-1 pb-2">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          className="w-full max-w-[520px] select-none"
          style={{ touchAction: 'none' }}
          onMouseMove={handlePointerMove}
          onMouseUp={handlePointerUp}
          onMouseLeave={handlePointerUp}
          onTouchMove={handlePointerMove}
          onTouchEnd={handlePointerUp}
        >
          {/* ── Plot background ─────────────────────────────── */}
          <rect x={PAD_L} y={PAD_T} width={PLOT_W} height={PLOT_H}
            fill="#0f172a" rx={4} />

          {/* ── Grid lines & Y axis labels ──────────────────── */}
          {yTicks.map(v => (
            <g key={v}>
              <line
                x1={PAD_L} x2={PAD_L + PLOT_W}
                y1={valToY(v)} y2={valToY(v)}
                stroke="#1e293b" strokeWidth={0.8}
              />
              <text x={PAD_L - 6} y={valToY(v) + 3.5}
                textAnchor="end" className="text-[10px]" fill="#64748b">
                {v.toFixed(2)}
              </text>
            </g>
          ))}

          {/* ── Cell boundaries (vertical dashed lines) ────── */}
          {Array.from({ length: N_CELLS + 1 }, (_, i) => {
            const x = PAD_L + i * CELL_W;
            return (
              <line key={i}
                x1={x} x2={x}
                y1={PAD_T} y2={PAD_T + PLOT_H}
                stroke="#334155" strokeWidth={0.6} strokeDasharray="3,4"
              />
            );
          })}

          {/* ── Face highlight zones ────────────────────────── */}
          {FACE_INDICES.map(fi => {
            const fx = faceX(fi);
            return (
              <g key={`face-zone-${fi}`}>
                {/* Face line */}
                <line
                  x1={fx} x2={fx}
                  y1={PAD_T + 2} y2={PAD_T + PLOT_H - 2}
                  stroke={hoveredFace === fi ? '#475569' : '#1e293b'}
                  strokeWidth={hoveredFace === fi ? 2 : 1.2}
                />
                {/* Hover target zone (wider invisible) */}
                <rect
                  x={fx - 12} y={PAD_T}
                  width={24} height={PLOT_H}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredFace(fi)}
                  onMouseLeave={() => setHoveredFace(null)}
                />
                {/* Face label */}
                <text x={fx} y={PAD_T + PLOT_H + 14}
                  textAnchor="middle" className="text-[9px]" fill="#64748b">
                  f{fi + 1}
                </text>
              </g>
            );
          })}

          {/* ── Flow direction arrow ────────────────────────── */}
          <defs>
            <marker id="arrowHead" markerWidth="6" markerHeight="5"
              refX="5" refY="2.5" orient="auto">
              <path d="M0,0 L6,2.5 L0,5" fill="#475569" />
            </marker>
          </defs>
          <line
            x1={PAD_L + 10} x2={PAD_L + PLOT_W - 10}
            y1={PAD_T - 14} y2={PAD_T - 14}
            stroke="#475569" strokeWidth={1.2}
            markerEnd="url(#arrowHead)"
          />
          <text x={PAD_L + PLOT_W / 2} y={PAD_T - 22}
            textAnchor="middle" className="text-[9px] font-medium" fill="#64748b">
            Strömungsrichtung u → 
          </text>

          {/* ── Cell center values (connected line) ─────────── */}
          <polyline
            points={cellValues.map((v, i) => `${cellCenterX(i)},${valToY(v)}`).join(' ')}
            fill="none" stroke="#94a3b8" strokeWidth={1.5}
            strokeLinejoin="round"
          />

          {/* ── Scheme interpolated face values ─────────────── */}
          {(Object.keys(SCHEME_META) as SchemeKey[]).map(scheme => {
            if (!activeSchemes[scheme]) return null;
            const meta = SCHEME_META[scheme];
            const vals = faceValues[scheme];

            // Build a line: cell0 → face0 → cell1 → face1 → ...
            // Show interpolated values as colored markers on faces
            return (
              <g key={scheme}>
                {FACE_INDICES.map((fi, idx) => {
                  const fx = faceX(fi);
                  const fy = valToY(vals[idx]);
                  const isHovered = hoveredFace === fi;

                  // Connection lines from adjacent cells to face value
                  const leftX = cellCenterX(fi);
                  const leftY = valToY(cellValues[fi]);
                  const rightX = cellCenterX(fi + 1);
                  const rightY = valToY(cellValues[fi + 1]);

                  return (
                    <g key={`${scheme}-${fi}`} opacity={isHovered ? 1 : 0.7}>
                      {/* Interpolation lines from cells to face */}
                      <line x1={leftX} y1={leftY} x2={fx} y2={fy}
                        stroke={meta.color} strokeWidth={isHovered ? 1.8 : 1}
                        strokeDasharray={meta.dash} opacity={0.5} />
                      <line x1={fx} y1={fy} x2={rightX} y2={rightY}
                        stroke={meta.color} strokeWidth={isHovered ? 1.8 : 1}
                        strokeDasharray={meta.dash} opacity={0.3} />
                      
                      {/* Face value marker */}
                      <circle cx={fx} cy={fy}
                        r={isHovered ? 5 : 3.5}
                        fill={meta.color}
                        stroke="#0f172a" strokeWidth={1.5}
                        className="transition-all duration-150"
                      />
                      
                      {/* Value label on hover */}
                      {isHovered && (
                        <text x={fx + (idx % 2 === 0 ? 8 : -8)} y={fy + 3}
                          textAnchor={idx % 2 === 0 ? 'start' : 'end'}
                          className="text-[9px] font-mono" fill={meta.color}>
                          {vals[idx].toFixed(3)}
                        </text>
                      )}
                    </g>
                  );
                })}
              </g>
            );
          })}

          {/* ── Draggable cell-center dots ───────────────────── */}
          {cellValues.map((v, i) => {
            const cx = cellCenterX(i);
            const cy = valToY(v);
            const isDragging = dragging === i;
            return (
              <g key={`cell-${i}`}>
                {/* Larger invisible hit area */}
                <circle cx={cx} cy={cy} r={14} fill="transparent"
                  className="cursor-ns-resize"
                  onMouseDown={(e) => { e.preventDefault(); setDragging(i); }}
                  onTouchStart={(e) => { e.preventDefault(); setDragging(i); }}
                />
                {/* Visible dot */}
                <circle cx={cx} cy={cy}
                  r={isDragging ? 6 : 4.5}
                  fill="#e2e8f0"
                  stroke={isDragging ? '#22d3ee' : '#475569'}
                  strokeWidth={isDragging ? 2 : 1.5}
                  className="cursor-ns-resize transition-all duration-100"
                />
                {/* Value text */}
                <text x={cx} y={cy - 10}
                  textAnchor="middle" className="text-[9px] font-mono" fill="#94a3b8">
                  {v.toFixed(2)}
                </text>
                {/* Cell label */}
                <text x={cx} y={PAD_T + PLOT_H + 14}
                  textAnchor="middle" className="text-[9px]" fill="#94a3b8">
                  φ{String.fromCharCode(8320 + i)}
                </text>
              </g>
            );
          })}

          {/* ── Legend at bottom ─────────────────────────────── */}
          {(Object.keys(SCHEME_META) as SchemeKey[]).map((key, idx) => {
            const meta = SCHEME_META[key];
            const lx = PAD_L + idx * 170;
            const ly = H - 10;
            return (
              <g key={`legend-${key}`} opacity={activeSchemes[key] ? 1 : 0.35}>
                <circle cx={lx} cy={ly - 3} r={3.5} fill={meta.color} />
                <text x={lx + 8} y={ly} className="text-[10px]" fill="#94a3b8">
                  {meta.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Info / Tooltip area */}
      <div className="px-3 pb-3">
        <div className="text-[11px] text-gray-500 bg-gray-900/50 rounded-lg p-2 flex items-start gap-2">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="shrink-0 mt-px text-gray-600">
            <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2" fill="none"/>
            <path d="M8 5v0.5M8 7v4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
          <span>
            <strong className="text-gray-400">Ziehe die Punkte</strong> nach oben/unten, um die Zellwerte zu ändern.
            Hover über eine Face-Linie, um die interpolierten Werte zu sehen.
            {hoveredFace !== null && (
              <span className="block mt-1 text-gray-400">
                Face f{hoveredFace + 1}: {' '}
                {(Object.keys(SCHEME_META) as SchemeKey[]).filter(k => activeSchemes[k]).map(k => (
                  <span key={k} className="mr-2" style={{ color: SCHEME_META[k].color }}>
                    {k}={faceValues[k][hoveredFace].toFixed(3)}
                  </span>
                ))}
              </span>
            )}
          </span>
        </div>
      </div>
    </div>
  );
}
