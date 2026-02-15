"use client";

import React, { useState, useMemo } from "react";

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   MeshTypesViz — Interactive visualization of CFD mesh topologies.

   Mesh types:  Cartesian · Curvilinear · C-Grid · H-Grid · O-Grid · Multiblock
   Geometries:  Airfoil · Zylinder · Platte
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

/* ── Types ─────────────────────────────────────────────────────── */

type MeshType = "cartesian" | "curvilinear" | "c-grid" | "h-grid" | "o-grid" | "multiblock";
type Geometry = "airfoil" | "cylinder" | "plate";

interface MeshInfo {
  label: string;
  structured: boolean;
  description: string;
  pros: string[];
  cons: string[];
}

const MESH_INFO: Record<MeshType, MeshInfo> = {
  cartesian: {
    label: "Kartesisches Gitter",
    structured: true,
    description: "Gleichmäßiges Rechteckgitter — einfachste Form. Zellen sind achsenparallel.",
    pros: ["Einfach zu generieren", "Effiziente Datenstruktur", "Gute Genauigkeit bei einfachen Geometrien"],
    cons: ["Schlecht bei komplexen Rändern (Treppenstufen)", "Keine lokale Verfeinerung ohne AMR"],
  },
  curvilinear: {
    label: "Kurvilineares Gitter",
    structured: true,
    description: "Strukturiertes Gitter, das sich der Körperkontur anpasst (body-fitted).",
    pros: ["Randbedingungen exakt", "Gute Grenzschichtauflösung", "Einfache Indexierung (i,j,k)"],
    cons: ["Verzerrung bei starker Krümmung", "Schwierig für sehr komplexe Geometrien"],
  },
  "c-grid": {
    label: "C-Gitter",
    structured: true,
    description: "Gitter umschlingt die Vorderkante C-förmig — ideal für Tragflächen.",
    pros: ["Gute Auflösung an Vorder- und Hinterkante", "Nachlauf automatisch aufgelöst", "Standard für Airfoil-Berechnungen"],
    cons: ["Nur für schlanke Körper geeignet", "Aufwändige Generierung"],
  },
  "h-grid": {
    label: "H-Gitter",
    structured: true,
    description: "Parallele Gitterlinien strömen am Körper vorbei — H-förmige Topologie.",
    pros: ["Einfache Topologie", "Gut für Ein-/Auslass", "Keine Singularitäten"],
    cons: ["Schlechte Auflösung an Vorderkante", "Schiefwinklige Zellen am Körper"],
  },
  "o-grid": {
    label: "O-Gitter",
    structured: true,
    description: "Konzentrische Schichten um den Körper — O-förmig geschlossen.",
    pros: ["Perfekt für Grenzschicht-Auflösung", "Orthogonale Zellen am Körper", "Ideal für Zylinder / stumpfe Körper"],
    cons: ["Singularität im Zentrum (bei Punkt)", "Zellgröße wächst stark nach außen"],
  },
  multiblock: {
    label: "Multiblock-Gitter",
    structured: true,
    description: "Mehrere strukturierte Blöcke werden zusammengesetzt — flexibler als Einzelblock.",
    pros: ["Kombiniert Vorteile verschiedener Topologien", "Lokale Verfeinerung möglich", "Gut parallelisierbar"],
    cons: ["Aufwändige Generierung", "Block-Interfaces brauchen Interpolation", "Planung der Blockstruktur nötig"],
  },
};

const MESH_TYPES: { key: MeshType; label: string }[] = [
  { key: "cartesian", label: "Kartesisch" },
  { key: "curvilinear", label: "Kurvilinear" },
  { key: "c-grid", label: "C-Gitter" },
  { key: "h-grid", label: "H-Gitter" },
  { key: "o-grid", label: "O-Gitter" },
  { key: "multiblock", label: "Multiblock" },
];

const GEOMETRIES: { key: Geometry; label: string }[] = [
  { key: "airfoil", label: "Tragfläche" },
  { key: "cylinder", label: "Zylinder" },
  { key: "plate", label: "Platte" },
];

/* ── Geometry path generators ─────────────────────────────────── */

function airfoilPoints(cx: number, cy: number, chord: number, n: number = 40): [number, number][] {
  const pts: [number, number][] = [];
  for (let i = 0; i <= n; i++) {
    const t = (i / n) * Math.PI * 2;
    const x = cx + (chord / 2) * Math.cos(t);
    // NACA-like thickness distribution
    const xn = (1 + Math.cos(t)) / 2;
    const thick = chord * 0.12 * (2.969 * Math.sqrt(xn) - 1.26 * xn - 3.516 * xn ** 2 + 2.843 * xn ** 3 - 1.015 * xn ** 4);
    const sign = t <= Math.PI ? 1 : -1;
    const y = cy + sign * thick * 2.5;
    pts.push([x, y]);
  }
  return pts;
}

function cylinderPoints(cx: number, cy: number, r: number, n: number = 32): [number, number][] {
  const pts: [number, number][] = [];
  for (let i = 0; i <= n; i++) {
    const t = (i / n) * Math.PI * 2;
    pts.push([cx + r * Math.cos(t), cy + r * Math.sin(t)]);
  }
  return pts;
}

function platePoints(cx: number, cy: number, w: number, h: number): [number, number][] {
  return [
    [cx - w / 2, cy - h / 2],
    [cx + w / 2, cy - h / 2],
    [cx + w / 2, cy + h / 2],
    [cx - w / 2, cy + h / 2],
    [cx - w / 2, cy - h / 2],
  ];
}

function pointsToPath(pts: [number, number][]): string {
  return pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ") + " Z";
}

/* ── SVG Mesh grid generators ─────────────────────────────────── */

const W = 400;
const H = 300;
const CX = W / 2;
const CY = H / 2;

interface GridLine {
  d: string;
  color?: string;
  width?: number;
}

function generateCartesian(geo: Geometry): GridLine[] {
  const lines: GridLine[] = [];
  const step = 20;
  // Horizontal lines
  for (let y = 10; y <= H - 10; y += step) {
    lines.push({ d: `M10,${y} L${W - 10},${y}` });
  }
  // Vertical lines
  for (let x = 10; x <= W - 10; x += step) {
    lines.push({ d: `M${x},10 L${x},${H - 10}` });
  }
  return lines;
}

function generateCurvilinear(geo: Geometry): GridLine[] {
  const lines: GridLine[] = [];
  const nx = 20;
  const ny = 14;
  const margin = 15;

  // The grid warps around the body
  const getPoint = (i: number, j: number): [number, number] => {
    const xBase = margin + (i / nx) * (W - 2 * margin);
    const yBase = margin + (j / ny) * (H - 2 * margin);

    // Body influence — deflect grid lines around center
    const dx = xBase - CX;
    const dy = yBase - CY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const bodyR = geo === "cylinder" ? 40 : geo === "airfoil" ? 50 : 30;

    if (dist < 5) return [xBase, yBase];
    const influence = Math.max(0, 1 - dist / (bodyR * 3));
    const push = bodyR * influence * influence * 1.5;

    const nx2 = dx / dist;
    const ny2 = dy / dist;

    return [xBase + nx2 * push, yBase + ny2 * push];
  };

  // Horizontal-ish lines
  for (let j = 0; j <= ny; j++) {
    const pts: string[] = [];
    for (let i = 0; i <= nx; i++) {
      const [x, y] = getPoint(i, j);
      pts.push(`${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`);
    }
    lines.push({ d: pts.join(" ") });
  }
  // Vertical-ish lines
  for (let i = 0; i <= nx; i++) {
    const pts: string[] = [];
    for (let j = 0; j <= ny; j++) {
      const [x, y] = getPoint(i, j);
      pts.push(`${j === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`);
    }
    lines.push({ d: pts.join(" ") });
  }
  return lines;
}

function generateCGrid(geo: Geometry): GridLine[] {
  const lines: GridLine[] = [];
  const bodyR = geo === "cylinder" ? 30 : geo === "airfoil" ? 45 : 25;

  // C-grid: wraps around leading edge
  const nRadial = 10;
  const nWrap = 30;

  for (let r = 0; r < nRadial; r++) {
    const radius = bodyR + 8 + r * 15;
    const pts: string[] = [];
    // C-shape: from bottom-right, around left, to top-right
    for (let k = 0; k <= nWrap; k++) {
      const angle = -0.6 * Math.PI + (k / nWrap) * 1.2 * Math.PI + Math.PI;
      // Elongate in x-direction for C shape
      const scaleX = 1 + r * 0.15;
      const x = CX + radius * scaleX * Math.cos(angle) * 0.7;
      const y = CY + radius * Math.sin(angle);
      pts.push(`${k === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`);
    }
    lines.push({ d: pts.join(" ") });
  }

  // Radial lines (from body outward)
  for (let k = 0; k <= nWrap; k += 2) {
    const angle = -0.6 * Math.PI + (k / nWrap) * 1.2 * Math.PI + Math.PI;
    const pts: string[] = [];
    for (let r = 0; r < nRadial; r++) {
      const radius = bodyR + 8 + r * 15;
      const scaleX = 1 + r * 0.15;
      const x = CX + radius * scaleX * Math.cos(angle) * 0.7;
      const y = CY + radius * Math.sin(angle);
      pts.push(`${r === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`);
    }
    lines.push({ d: pts.join(" ") });
  }

  // Wake lines (trailing edge to right boundary)
  for (let r = 0; r < nRadial; r++) {
    const radius = bodyR + 8 + r * 15;
    const yTop = CY - radius * Math.sin(0.6 * Math.PI);
    const yBot = CY + radius * Math.sin(0.6 * Math.PI);
    const xEnd = CX + (radius * (1 + r * 0.15)) * 0.7;
    lines.push({ d: `M${xEnd.toFixed(1)},${yTop.toFixed(1)} L${W - 10},${yTop.toFixed(1)}` });
    lines.push({ d: `M${xEnd.toFixed(1)},${yBot.toFixed(1)} L${W - 10},${yBot.toFixed(1)}` });
  }

  return lines;
}

function generateHGrid(geo: Geometry): GridLine[] {
  const lines: GridLine[] = [];
  const nx = 20;
  const ny = 14;
  const margin = 15;
  const bodyR = geo === "cylinder" ? 30 : geo === "airfoil" ? 45 : 25;

  // H-grid: mostly straight lines, deflected slightly around body
  // Horizontal lines
  for (let j = 0; j <= ny; j++) {
    const y = margin + (j / ny) * (H - 2 * margin);
    const pts: string[] = [];
    for (let i = 0; i <= nx; i++) {
      const x = margin + (i / nx) * (W - 2 * margin);
      // Slight deflection around body but mostly straight
      const dx = x - CX;
      const dy = y - CY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      let yOff = 0;
      if (dist < bodyR * 2.5 && dist > 5) {
        const influence = Math.max(0, 1 - dist / (bodyR * 2.5));
        yOff = (dy / dist) * bodyR * influence * influence * 0.8;
      }
      pts.push(`${i === 0 ? "M" : "L"}${x.toFixed(1)},${(y + yOff).toFixed(1)}`);
    }
    lines.push({ d: pts.join(" ") });
  }
  // Vertical lines
  for (let i = 0; i <= nx; i++) {
    const x = margin + (i / nx) * (W - 2 * margin);
    const pts: string[] = [];
    for (let j = 0; j <= ny; j++) {
      const y = margin + (j / ny) * (H - 2 * margin);
      const dx = x - CX;
      const dy = y - CY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      let yOff = 0;
      if (dist < bodyR * 2.5 && dist > 5) {
        const influence = Math.max(0, 1 - dist / (bodyR * 2.5));
        yOff = (dy / dist) * bodyR * influence * influence * 0.8;
      }
      pts.push(`${j === 0 ? "M" : "L"}${x.toFixed(1)},${(y + yOff).toFixed(1)}`);
    }
    lines.push({ d: pts.join(" ") });
  }
  return lines;
}

function generateOGrid(geo: Geometry): GridLine[] {
  const lines: GridLine[] = [];
  const bodyR = geo === "cylinder" ? 30 : geo === "airfoil" ? 35 : 20;
  const nRadial = 8;
  const nCirc = 32;

  // Concentric rings
  for (let r = 0; r < nRadial; r++) {
    const radius = bodyR + 10 + r * 18;
    const pts: string[] = [];
    for (let k = 0; k <= nCirc; k++) {
      const angle = (k / nCirc) * Math.PI * 2;
      // For airfoil, elongate in x
      const scaleX = geo === "airfoil" ? 1.5 + r * 0.1 : 1 + r * 0.05;
      const scaleY = 1 + r * 0.05;
      const x = CX + radius * scaleX * Math.cos(angle);
      const y = CY + radius * scaleY * Math.sin(angle);
      pts.push(`${k === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`);
    }
    lines.push({ d: pts.join(" ") + " Z" });
  }

  // Radial lines outward
  for (let k = 0; k < nCirc; k += 2) {
    const angle = (k / nCirc) * Math.PI * 2;
    const pts: string[] = [];
    for (let r = 0; r < nRadial; r++) {
      const radius = bodyR + 10 + r * 18;
      const scaleX = geo === "airfoil" ? 1.5 + r * 0.1 : 1 + r * 0.05;
      const scaleY = 1 + r * 0.05;
      const x = CX + radius * scaleX * Math.cos(angle);
      const y = CY + radius * scaleY * Math.sin(angle);
      pts.push(`${r === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`);
    }
    lines.push({ d: pts.join(" ") });
  }

  return lines;
}

function generateMultiblock(geo: Geometry): GridLine[] {
  const lines: GridLine[] = [];
  const bodyR = geo === "cylinder" ? 30 : geo === "airfoil" ? 40 : 20;

  // Block boundaries (thick lines — drawn separately)
  // Inner O-grid block around body
  const innerR = bodyR + 25;
  // Outer blocks: top, bottom, left, right

  // Inner O-grid (fine mesh)
  const nInner = 6;
  const nCirc = 24;
  for (let r = 0; r < nInner; r++) {
    const radius = bodyR + 5 + r * (20 / nInner);
    const pts: string[] = [];
    for (let k = 0; k <= nCirc; k++) {
      const angle = (k / nCirc) * Math.PI * 2;
      const scaleX = geo === "airfoil" ? 1.4 : 1;
      const x = CX + radius * scaleX * Math.cos(angle);
      const y = CY + radius * Math.sin(angle);
      pts.push(`${k === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`);
    }
    lines.push({ d: pts.join(" ") + " Z" });
  }
  // Inner radial lines
  for (let k = 0; k < nCirc; k += 2) {
    const angle = (k / nCirc) * Math.PI * 2;
    const pts: string[] = [];
    for (let r = 0; r < nInner; r++) {
      const radius = bodyR + 5 + r * (20 / nInner);
      const scaleX = geo === "airfoil" ? 1.4 : 1;
      const x = CX + radius * scaleX * Math.cos(angle);
      const y = CY + radius * Math.sin(angle);
      pts.push(`${r === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`);
    }
    lines.push({ d: pts.join(" ") });
  }

  // Outer rectangular blocks (coarser)
  const outerMargin = 20;
  const blockStep = 30;
  // Top block
  for (let y = outerMargin; y <= CY - innerR; y += blockStep) {
    lines.push({ d: `M${outerMargin},${y} L${W - outerMargin},${y}` });
  }
  // Bottom block
  for (let y = CY + innerR; y <= H - outerMargin; y += blockStep) {
    lines.push({ d: `M${outerMargin},${y} L${W - outerMargin},${y}` });
  }
  // Left block
  for (let x = outerMargin; x <= CX - innerR * (geo === "airfoil" ? 1.4 : 1); x += blockStep) {
    lines.push({ d: `M${x},${outerMargin} L${x},${H - outerMargin}` });
  }
  // Right block
  for (let x = CX + innerR * (geo === "airfoil" ? 1.4 : 1); x <= W - outerMargin; x += blockStep) {
    lines.push({ d: `M${x},${outerMargin} L${x},${H - outerMargin}` });
  }

  // Vertical lines in top/bottom blocks
  for (let x = outerMargin; x <= W - outerMargin; x += blockStep) {
    lines.push({ d: `M${x},${outerMargin} L${x},${Math.max(outerMargin, CY - innerR)}` });
    lines.push({ d: `M${x},${CY + innerR} L${x},${H - outerMargin}` });
  }
  // Horizontal lines in left/right blocks
  for (let y = CY - innerR; y <= CY + innerR; y += blockStep) {
    const scaleX = geo === "airfoil" ? 1.4 : 1;
    lines.push({ d: `M${outerMargin},${y} L${CX - innerR * scaleX},${y}` });
    lines.push({ d: `M${CX + innerR * scaleX},${y} L${W - outerMargin},${y}` });
  }

  return lines;
}

function generateGrid(mesh: MeshType, geo: Geometry): GridLine[] {
  switch (mesh) {
    case "cartesian": return generateCartesian(geo);
    case "curvilinear": return generateCurvilinear(geo);
    case "c-grid": return generateCGrid(geo);
    case "h-grid": return generateHGrid(geo);
    case "o-grid": return generateOGrid(geo);
    case "multiblock": return generateMultiblock(geo);
  }
}

function getBodyPath(geo: Geometry): string {
  switch (geo) {
    case "airfoil": return pointsToPath(airfoilPoints(CX, CY, 70, 40));
    case "cylinder": return pointsToPath(cylinderPoints(CX, CY, 30, 32));
    case "plate": return pointsToPath(platePoints(CX, CY, 60, 8));
  }
}

/* Block boundaries for multiblock visualization */
function getBlockBoundaries(geo: Geometry): string[] {
  const r = geo === "cylinder" ? 30 : geo === "airfoil" ? 40 : 20;
  const innerR = r + 25;
  const scaleX = geo === "airfoil" ? 1.4 : 1;
  const m = 20;
  return [
    // Inner O-block boundary
    pointsToPath(
      Array.from({ length: 33 }, (_, i) => {
        const a = (i / 32) * Math.PI * 2;
        return [CX + innerR * scaleX * Math.cos(a), CY + innerR * Math.sin(a)] as [number, number];
      })
    ),
    // Outer boundary
    `M${m},${m} L${W - m},${m} L${W - m},${H - m} L${m},${H - m} Z`,
  ];
}

/* ── Mesh topology diagram (small schematic) ─────────────────── */

function TopologyIcon({ mesh }: { mesh: MeshType }) {
  const s = 50;
  const m = 4;
  const c = s / 2;

  const body = (
    <circle cx={c} cy={c} r={6} fill="#334155" stroke="#94a3b8" strokeWidth={1} />
  );

  switch (mesh) {
    case "cartesian":
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
          {[0.25, 0.5, 0.75].map(f => (
            <React.Fragment key={f}>
              <line x1={m} y1={s * f} x2={s - m} y2={s * f} stroke="#475569" strokeWidth={0.5} />
              <line x1={s * f} y1={m} x2={s * f} y2={s - m} stroke="#475569" strokeWidth={0.5} />
            </React.Fragment>
          ))}
          <rect x={m} y={m} width={s - 2 * m} height={s - 2 * m} fill="none" stroke="#64748b" strokeWidth={1} />
        </svg>
      );
    case "curvilinear":
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
          {body}
          {[0.3, 0.5, 0.7].map(f => (
            <path key={`h${f}`} d={`M${m},${s * f} Q${c},${s * f + (f < 0.5 ? -8 : f > 0.5 ? 8 : 0)} ${s - m},${s * f}`} fill="none" stroke="#475569" strokeWidth={0.5} />
          ))}
          {[0.3, 0.5, 0.7].map(f => (
            <line key={`v${f}`} x1={s * f} y1={m} x2={s * f} y2={s - m} stroke="#475569" strokeWidth={0.5} />
          ))}
        </svg>
      );
    case "c-grid":
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
          {body}
          {[12, 18].map(r => (
            <path key={r} d={`M${c + r * 0.8},${c - r} A${r},${r} 0 1,0 ${c + r * 0.8},${c + r}`} fill="none" stroke="#475569" strokeWidth={0.5} />
          ))}
          <line x1={c + 10} y1={c - 18} x2={s - m} y2={c - 18} stroke="#475569" strokeWidth={0.5} />
          <line x1={c + 10} y1={c + 18} x2={s - m} y2={c + 18} stroke="#475569" strokeWidth={0.5} />
          <text x={c - 2} y={s - 2} fontSize={8} fill="#94a3b8" fontFamily="monospace">C</text>
        </svg>
      );
    case "h-grid":
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
          {body}
          {[0.25, 0.5, 0.75].map(f => (
            <line key={f} x1={m} y1={s * f} x2={s - m} y2={s * f} stroke="#475569" strokeWidth={0.5} />
          ))}
          {[0.25, 0.5, 0.75].map(f => (
            <line key={`v${f}`} x1={s * f} y1={m} x2={s * f} y2={s - m} stroke="#475569" strokeWidth={0.5} />
          ))}
          <text x={c - 2} y={s - 2} fontSize={8} fill="#94a3b8" fontFamily="monospace">H</text>
        </svg>
      );
    case "o-grid":
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
          {body}
          {[12, 18].map(r => (
            <circle key={r} cx={c} cy={c} r={r} fill="none" stroke="#475569" strokeWidth={0.5} />
          ))}
          {[0, 45, 90, 135].map(a => {
            const rad = (a * Math.PI) / 180;
            return <line key={a} x1={c + 8 * Math.cos(rad)} y1={c + 8 * Math.sin(rad)} x2={c + 20 * Math.cos(rad)} y2={c + 20 * Math.sin(rad)} stroke="#475569" strokeWidth={0.5} />;
          })}
          <text x={c - 2} y={s - 2} fontSize={8} fill="#94a3b8" fontFamily="monospace">O</text>
        </svg>
      );
    case "multiblock":
      return (
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
          {body}
          <circle cx={c} cy={c} r={14} fill="none" stroke="#f59e0b" strokeWidth={0.8} strokeDasharray="2,1" />
          <rect x={m} y={m} width={s - 2 * m} height={s - 2 * m} fill="none" stroke="#64748b" strokeWidth={1} />
          <line x1={m} y1={c} x2={c - 14} y2={c} stroke="#f59e0b" strokeWidth={0.5} strokeDasharray="2,1" />
          <line x1={c + 14} y1={c} x2={s - m} y2={c} stroke="#f59e0b" strokeWidth={0.5} strokeDasharray="2,1" />
          <text x={m + 1} y={s - 2} fontSize={6} fill="#94a3b8" fontFamily="monospace">MB</text>
        </svg>
      );
  }
}

/* ── Main component ───────────────────────────────────────────── */

export default function MeshTypesViz() {
  const [meshType, setMeshType] = useState<MeshType>("cartesian");
  const [geometry, setGeometry] = useState<Geometry>("airfoil");

  const gridLines = useMemo(() => generateGrid(meshType, geometry), [meshType, geometry]);
  const bodyPath = useMemo(() => getBodyPath(geometry), [geometry]);
  const blockBounds = useMemo(
    () => meshType === "multiblock" ? getBlockBoundaries(geometry) : [],
    [meshType, geometry]
  );
  const info = MESH_INFO[meshType];

  return (
    <div className="flex flex-col gap-4 p-4 max-w-3xl mx-auto">
      {/* ── Title ──────────────────────────────────────────── */}
      <div className="text-center">
        <h2 className="text-xl font-bold text-white mb-1">Gittertypen in CFD</h2>
        <p className="text-xs text-gray-500">Strukturierte Netztopologien im Vergleich</p>
      </div>

      {/* ── Mesh type selector ─────────────────────────────── */}
      <div className="flex flex-wrap justify-center gap-1.5">
        {MESH_TYPES.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setMeshType(key)}
            className={`flex flex-col items-center gap-1 px-2 py-1.5 rounded-lg transition-all duration-200 border ${
              meshType === key
                ? "bg-cyan-500/15 border-cyan-500/40 text-cyan-400"
                : "bg-gray-900/60 border-gray-800/50 text-gray-500 hover:text-gray-300 hover:border-gray-700"
            }`}
          >
            <TopologyIcon mesh={key} />
            <span className="text-[9px] font-medium">{label}</span>
          </button>
        ))}
      </div>

      {/* ── Geometry selector ──────────────────────────────── */}
      <div className="flex justify-center gap-1">
        <span className="text-[9px] text-gray-600 self-center mr-1">Geometrie:</span>
        {GEOMETRIES.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setGeometry(key)}
            className={`px-2.5 py-1 rounded-md text-[10px] font-medium transition-all duration-200 ${
              geometry === key
                ? "bg-violet-500/20 text-violet-400 border border-violet-500/30"
                : "text-gray-600 hover:text-gray-400 border border-transparent hover:border-gray-800"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── SVG Visualization ──────────────────────────────── */}
      <div className="relative bg-gray-950/80 rounded-xl border border-gray-800/50 overflow-hidden">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full"
          style={{ aspectRatio: `${W}/${H}` }}
        >
          {/* Far-field boundary */}
          <rect x={2} y={2} width={W - 4} height={H - 4} fill="none" stroke="#1e293b" strokeWidth={1} rx={4} />

          {/* Flow direction arrow */}
          <defs>
            <marker id="arrowMesh" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
              <path d="M0,0 L6,2 L0,4" fill="#334155" />
            </marker>
          </defs>
          <line x1={20} y1={20} x2={70} y2={20} stroke="#334155" strokeWidth={1} markerEnd="url(#arrowMesh)" />
          <text x={45} y={14} textAnchor="middle" fontSize={9} fill="#475569" fontFamily="sans-serif">u</text>

          {/* Grid lines */}
          {gridLines.map((line, i) => (
            <path
              key={`${meshType}-${geometry}-${i}`}
              d={line.d}
              fill="none"
              stroke={line.color || "#1e3a5f"}
              strokeWidth={line.width || 0.5}
              opacity={0.6}
            />
          ))}

          {/* Block boundaries (multiblock) */}
          {blockBounds.map((d, i) => (
            <path
              key={`block-${i}`}
              d={d}
              fill="none"
              stroke="#f59e0b"
              strokeWidth={1.5}
              strokeDasharray="4,2"
              opacity={0.7}
            />
          ))}

          {/* Body */}
          <path
            d={bodyPath}
            fill="#1e293b"
            stroke="#94a3b8"
            strokeWidth={1.5}
          />

          {/* Body label */}
          <text x={CX} y={CY + 3} textAnchor="middle" fontSize={8} fill="#64748b" fontFamily="sans-serif">
            {geometry === "airfoil" ? "Profil" : geometry === "cylinder" ? "Zyl." : "Platte"}
          </text>

          {/* Mesh type label */}
          <text x={W - 10} y={H - 10} textAnchor="end" fontSize={10} fill="#475569" fontWeight="bold" fontFamily="sans-serif">
            {info.label}
          </text>
        </svg>

        {/* Structured badge */}
        <div className="absolute top-2 right-2">
          <span className={`text-[9px] font-medium px-2 py-0.5 rounded-full border ${
            info.structured
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
              : "bg-amber-500/10 text-amber-400 border-amber-500/30"
          }`}>
            {info.structured ? "Strukturiert" : "Unstrukturiert"}
          </span>
        </div>
      </div>

      {/* ── Info panel ──────────────────────────────────────── */}
      <div className="bg-gray-900/50 rounded-lg border border-gray-800/50 p-3">
        <div className="text-[11px] text-gray-300 mb-2">{info.description}</div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="text-[9px] text-emerald-500/70 font-semibold uppercase tracking-wider mb-1">Vorteile</div>
            <ul className="space-y-0.5">
              {info.pros.map((p, i) => (
                <li key={i} className="text-[9px] text-gray-500 flex gap-1">
                  <span className="text-emerald-500/50 shrink-0">+</span>
                  {p}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="text-[9px] text-rose-500/70 font-semibold uppercase tracking-wider mb-1">Nachteile</div>
            <ul className="space-y-0.5">
              {info.cons.map((c, i) => (
                <li key={i} className="text-[9px] text-gray-500 flex gap-1">
                  <span className="text-rose-500/50 shrink-0">−</span>
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
