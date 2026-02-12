'use client';

import React, { useRef, useState, useCallback, useEffect, useMemo } from 'react';
import { curriculum, LessonNode, getAllLessons } from '@/curriculum/curriculum';

// ── Layout constants ───────────────────────────────────────────────

const CAT_W = 200;
const CAT_H = 72;
const LESSON_W = 170;
const LESSON_H = 54;
const CAT_GAP_X = 300;
const LESSON_GAP_Y = 68;
const LESSON_OFFSET_Y = 100;
const MAP_PADDING = 120;

/** Precomputed positions for every node */
interface NodePos {
  id: string;
  node: LessonNode;
  x: number;
  y: number;
  w: number;
  h: number;
  parentId?: string;
}

function computeLayout(root: LessonNode): { nodes: NodePos[]; edges: [string, string][]; width: number; height: number } {
  const nodes: NodePos[] = [];
  const edges: [string, string][] = [];
  const categories = root.children ?? [];

  // Categories horizontal, 2 rows (zigzag path for visual interest)  
  let cx = MAP_PADDING;
  const ROW_0_Y = 240;

  categories.forEach((cat, ci) => {
    const catX = cx;
    const catY = ROW_0_Y;

    nodes.push({ id: cat.id, node: cat, x: catX, y: catY, w: CAT_W, h: CAT_H });

    // Connect categories along the main path
    if (ci > 0) {
      edges.push([categories[ci - 1].id, cat.id]);
    }

    // Lessons below the category
    const lessons = cat.children ?? [];
    const totalLessonW = lessons.length * LESSON_W + (lessons.length - 1) * 20;
    const lessonsStartX = catX + CAT_W / 2 - totalLessonW / 2;

    lessons.forEach((lesson, li) => {
      const lx = lessonsStartX + li * (LESSON_W + 20);
      const ly = catY + LESSON_OFFSET_Y;
      nodes.push({ id: lesson.id, node: lesson, x: lx, y: ly, w: LESSON_W, h: LESSON_H, parentId: cat.id });
      edges.push([cat.id, lesson.id]);
    });

    cx += CAT_W + CAT_GAP_X;
  });

  const width = cx + MAP_PADDING;
  const maxLessonY = Math.max(...nodes.filter(n => n.node.type === 'lesson').map(n => n.y + n.h), ROW_0_Y + 200);
  const height = maxLessonY + MAP_PADDING;

  return { nodes, edges, width, height };
}

// ── Main component ─────────────────────────────────────────────────

interface Props {
  onSelectLesson: (id: string) => void;
  completedLessons: Set<string>;
}

export default function CurriculumMap({ onSelectLesson, completedLessons }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Pan & zoom state
  const [viewBox, setViewBox] = useState({ x: 0, y: 80, w: 1600, h: 600 });
  const [isPanning, setIsPanning] = useState(false);
  const panStart = useRef({ mx: 0, my: 0, vx: 0, vy: 0 });

  // Hover
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Layout
  const layout = useMemo(() => computeLayout(curriculum), []);
  const allLessons = useMemo(() => getAllLessons(), []);
  const availableCount = allLessons.filter(l => l.available).length;

  // Fit view on mount
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const aspect = el.clientWidth / el.clientHeight;
    const mapAspect = layout.width / layout.height;
    let w: number, h: number;
    if (mapAspect > aspect) {
      w = layout.width + 200;
      h = w / aspect;
    } else {
      h = layout.height + 200;
      w = h * aspect;
    }
    setViewBox({ x: -100, y: 0, w, h });
  }, [layout]);

  // ── Pan handlers ──────────────────────────────────────────────
  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if (e.button !== 0) return;
    // check if clicking empty space (not a node)
    const target = e.target as SVGElement;
    if (target.closest('[data-node]')) return;
    setIsPanning(true);
    panStart.current = { mx: e.clientX, my: e.clientY, vx: viewBox.x, vy: viewBox.y };
    (e.target as Element).setPointerCapture?.(e.pointerId);
  }, [viewBox.x, viewBox.y]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isPanning) return;
    const el = containerRef.current;
    if (!el) return;
    const scaleX = viewBox.w / el.clientWidth;
    const scaleY = viewBox.h / el.clientHeight;
    const dx = (e.clientX - panStart.current.mx) * scaleX;
    const dy = (e.clientY - panStart.current.my) * scaleY;
    setViewBox(v => ({ ...v, x: panStart.current.vx - dx, y: panStart.current.vy - dy }));
  }, [isPanning, viewBox.w, viewBox.h]);

  const onPointerUp = useCallback(() => setIsPanning(false), []);

  // ── Zoom handler ──────────────────────────────────────────────
  const onWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const el = containerRef.current;
    if (!el) return;

    const factor = e.deltaY > 0 ? 1.1 : 0.9;
    const rect = el.getBoundingClientRect();
    const mx = (e.clientX - rect.left) / rect.width;
    const my = (e.clientY - rect.top) / rect.height;

    setViewBox(v => {
      const newW = Math.max(400, Math.min(layout.width * 2, v.w * factor));
      const newH = Math.max(200, Math.min(layout.height * 2, v.h * factor));
      return {
        x: v.x + (v.w - newW) * mx,
        y: v.y + (v.h - newH) * my,
        w: newW,
        h: newH,
      };
    });
  }, [layout]);

  // ── Node click ────────────────────────────────────────────────
  const handleNodeClick = useCallback((node: LessonNode) => {
    if (node.type === 'lesson' && node.available) {
      onSelectLesson(node.id);
    } else if (node.type === 'category') {
      // Zoom into category
      const catNodes = layout.nodes.filter(n => n.parentId === node.id || n.id === node.id);
      if (catNodes.length === 0) return;
      const minX = Math.min(...catNodes.map(n => n.x)) - 40;
      const maxX = Math.max(...catNodes.map(n => n.x + n.w)) + 40;
      const minY = Math.min(...catNodes.map(n => n.y)) - 40;
      const maxY = Math.max(...catNodes.map(n => n.y + n.h)) + 40;
      const el = containerRef.current;
      if (!el) return;
      const aspect = el.clientWidth / el.clientHeight;
      let w = maxX - minX;
      let h = maxY - minY;
      if (w / h > aspect) { h = w / aspect; } else { w = h * aspect; }
      setViewBox({ x: minX - (w - (maxX - minX)) / 2, y: minY - (h - (maxY - minY)) / 2, w, h });
    }
  }, [layout, onSelectLesson]);

  // ── Reset zoom ────────────────────────────────────────────────
  const resetZoom = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const aspect = el.clientWidth / el.clientHeight;
    let w = layout.width + 200;
    let h = w / aspect;
    if (h < layout.height + 200) { h = layout.height + 200; w = h * aspect; }
    setViewBox({ x: -100, y: 0, w, h });
  }, [layout]);

  return (
    <div className="relative w-full h-full bg-gray-950 overflow-hidden select-none" ref={containerRef}>
      {/* Background grid pattern */}
      <svg
        ref={svgRef}
        className={`w-full h-full ${isPanning ? 'cursor-grabbing' : 'cursor-grab'}`}
        viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        onWheel={onWheel}
      >
        <defs>
          {/* Grid pattern */}
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="20" cy="20" r="0.5" fill="#1f2937" />
          </pattern>
          {/* Glow filter */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glow-strong">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* Category gradient */}
          <linearGradient id="cat-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#164e63" />
            <stop offset="100%" stopColor="#0e3a4a" />
          </linearGradient>
          <linearGradient id="cat-grad-hover" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1e6e8a" />
            <stop offset="100%" stopColor="#155e75" />
          </linearGradient>
          <linearGradient id="lesson-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
          <linearGradient id="lesson-done-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#14352a" />
            <stop offset="100%" stopColor="#0a2620" />
          </linearGradient>
          <linearGradient id="unavail-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#111827" />
            <stop offset="100%" stopColor="#0a0f1a" />
          </linearGradient>
        </defs>

        {/* Background */}
        <rect x={viewBox.x - 100} y={viewBox.y - 100} width={viewBox.w + 200} height={viewBox.h + 200} fill="url(#grid)" />

        {/* Title area */}
        <text x={layout.width / 2} y={100} textAnchor="middle" className="select-none pointer-events-none">
          <tspan fill="#06b6d4" fontSize="36" fontWeight="bold">🌊 CFD Lab</tspan>
        </text>
        <text x={layout.width / 2} y={140} textAnchor="middle" fill="#4b5563" fontSize="14" className="select-none pointer-events-none">
          Klicke auf ein Thema zum Reinzoomen · Klicke auf eine Lektion zum Starten
        </text>

        {/* Progress bar */}
        <rect x={layout.width / 2 - 150} y={160} width={300} height={6} rx={3} fill="#1f2937" />
        <rect x={layout.width / 2 - 150} y={160}
          width={availableCount > 0 ? 300 * (completedLessons.size / availableCount) : 0}
          height={6} rx={3} fill="#06b6d4" className="transition-all duration-700" />
        <text x={layout.width / 2 + 160} y={167} fill="#4b5563" fontSize="11" className="select-none pointer-events-none">
          {completedLessons.size}/{availableCount}
        </text>

        {/* Edges */}
        {layout.edges.map(([fromId, toId]) => {
          const from = layout.nodes.find(n => n.id === fromId)!;
          const to = layout.nodes.find(n => n.id === toId)!;
          if (!from || !to) return null;

          const isCatToCat = from.node.type === 'category' && to.node.type === 'category';
          const isCatToLesson = from.node.type === 'category' && to.node.type === 'lesson';

          let x1: number, y1: number, x2: number, y2: number;

          if (isCatToCat) {
            x1 = from.x + from.w;
            y1 = from.y + from.h / 2;
            x2 = to.x;
            y2 = to.y + to.h / 2;
          } else {
            x1 = from.x + from.w / 2;
            y1 = from.y + from.h;
            x2 = to.x + to.w / 2;
            y2 = to.y;
          }

          const mx = (x1 + x2) / 2;
          const my = (y1 + y2) / 2;

          const pathD = isCatToCat
            ? `M${x1},${y1} C${x1 + 60},${y1} ${x2 - 60},${y2} ${x2},${y2}`
            : `M${x1},${y1} Q${x1},${my} ${x2},${y2}`;

          const isAvailable = to.node.available && from.node.available;

          return (
            <path
              key={`${fromId}-${toId}`}
              d={pathD}
              fill="none"
              stroke={isAvailable ? (isCatToCat ? '#164e63' : '#1e293b') : '#111827'}
              strokeWidth={isCatToCat ? 3 : 1.5}
              strokeDasharray={isCatToCat ? undefined : '4 4'}
              opacity={isAvailable ? 0.8 : 0.3}
            />
          );
        })}

        {/* Nodes */}
        {layout.nodes.map((np) => (
          <MapNode
            key={np.id}
            np={np}
            isHovered={hoveredId === np.id}
            isCompleted={completedLessons.has(np.id)}
            onHover={setHoveredId}
            onClick={handleNodeClick}
          />
        ))}
      </svg>

      {/* Zoom controls */}
      <div className="absolute bottom-4 right-4 flex gap-1.5">
        <button onClick={resetZoom}
          className="w-9 h-9 rounded-lg bg-gray-800/80 backdrop-blur border border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors text-sm flex items-center justify-center"
          title="Gesamtansicht">
          ⊞
        </button>
        <button onClick={() => setViewBox(v => {
          const nw = v.w * 0.8; const nh = v.h * 0.8;
          return { x: v.x + (v.w - nw) / 2, y: v.y + (v.h - nh) / 2, w: nw, h: nh };
        })}
          className="w-9 h-9 rounded-lg bg-gray-800/80 backdrop-blur border border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors text-base flex items-center justify-center"
          title="Reinzoomen">
          +
        </button>
        <button onClick={() => setViewBox(v => {
          const nw = v.w * 1.25; const nh = v.h * 1.25;
          return { x: v.x + (v.w - nw) / 2, y: v.y + (v.h - nh) / 2, w: nw, h: nh };
        })}
          className="w-9 h-9 rounded-lg bg-gray-800/80 backdrop-blur border border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors text-base flex items-center justify-center"
          title="Rauszoomen">
          −
        </button>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 left-4 text-[11px] text-gray-600 pointer-events-none">
        Ziehen = Verschieben · Scrollen = Zoomen · Klicken = Öffnen
      </div>

      {/* Hovered node tooltip */}
      {hoveredId && (() => {
        const np = layout.nodes.find(n => n.id === hoveredId);
        if (!np) return null;
        return (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-gray-900/90 backdrop-blur border border-gray-700 rounded-lg text-sm text-gray-200 max-w-md text-center pointer-events-none z-10">
            <span className="text-base mr-2">{np.node.icon}</span>
            <span className="font-medium">{np.node.title}</span>
            <span className="text-gray-500 ml-2">— {np.node.description}</span>
          </div>
        );
      })()}
    </div>
  );
}

// ── Individual node renderer ───────────────────────────────────────

interface MapNodeProps {
  np: NodePos;
  isHovered: boolean;
  isCompleted: boolean;
  onHover: (id: string | null) => void;
  onClick: (node: LessonNode) => void;
}

function MapNode({ np, isHovered, isCompleted, onHover, onClick }: MapNodeProps) {
  const { id, node, x, y, w, h } = np;
  const isCategory = node.type === 'category';
  const isLesson = node.type === 'lesson';
  const available = node.available;
  const hasInteractive = node.simMode && node.simMode !== 'none';

  let fill = 'url(#lesson-grad)';
  let stroke = '#334155';
  let textColor = '#94a3b8';
  let radius = 12;

  if (isCategory) {
    fill = isHovered ? 'url(#cat-grad-hover)' : 'url(#cat-grad)';
    stroke = isHovered ? '#22d3ee' : '#0e7490';
    textColor = '#e2e8f0';
    radius = 16;
  } else if (!available) {
    fill = 'url(#unavail-grad)';
    stroke = '#1f2937';
    textColor = '#374151';
  } else if (isCompleted) {
    fill = 'url(#lesson-done-grad)';
    stroke = '#059669';
    textColor = '#6ee7b7';
  } else if (isHovered) {
    stroke = '#06b6d4';
    textColor = '#e2e8f0';
  }

  return (
    <g
      data-node
      className={`${available ? 'cursor-pointer' : 'cursor-default'}`}
      onPointerEnter={() => onHover(id)}
      onPointerLeave={() => onHover(null)}
      onClick={(e) => { e.stopPropagation(); onClick(node); }}
    >
      {/* Glow ring on hover */}
      {isHovered && available && (
        <rect
          x={x - 4} y={y - 4} width={w + 8} height={h + 8} rx={radius + 4}
          fill="none"
          stroke={isCategory ? '#22d3ee' : isCompleted ? '#34d399' : '#06b6d4'}
          strokeWidth={2}
          opacity={0.4}
          filter="url(#glow)"
        />
      )}

      {/* Main rect */}
      <rect
        x={x} y={y} width={w} height={h} rx={radius}
        fill={fill}
        stroke={stroke}
        strokeWidth={isCategory ? 2 : 1.5}
      />

      {/* Icon */}
      <text
        x={x + (isCategory ? 16 : 12)}
        y={y + h / 2 + (isCategory ? 1 : 0)}
        dominantBaseline="central"
        fontSize={isCategory ? 22 : 18}
        className="select-none pointer-events-none"
      >
        {node.icon}
      </text>

      {/* Label */}
      <text
        x={x + (isCategory ? 46 : 38)}
        y={y + (isCategory ? h / 2 - 6 : h / 2)}
        dominantBaseline="central"
        fill={textColor}
        fontSize={isCategory ? 14 : 11}
        fontWeight={isCategory ? 'bold' : 'normal'}
        className="select-none pointer-events-none"
      >
        {node.shortTitle}
      </text>

      {/* Subtitle for categories */}
      {isCategory && (
        <text
          x={x + 46}
          y={y + h / 2 + 12}
          dominantBaseline="central"
          fill="#64748b"
          fontSize={10}
          className="select-none pointer-events-none"
        >
          {(node.children ?? []).filter(c => c.type === 'lesson').length} Lektionen
        </text>
      )}

      {/* Interactive badge */}
      {isLesson && hasInteractive && available && (
        <g>
          <circle cx={x + w - 14} cy={y + 14} r={8} fill="#164e63" stroke="#0e7490" strokeWidth={1} />
          <text x={x + w - 14} y={y + 15} textAnchor="middle" dominantBaseline="central" fill="#22d3ee" fontSize={8} className="select-none pointer-events-none">▶</text>
        </g>
      )}

      {/* Completed checkmark */}
      {isCompleted && (
        <g>
          <circle cx={x + w - 14} cy={y + h - 14} r={8} fill="#065f46" stroke="#059669" strokeWidth={1} />
          <text x={x + w - 14} y={y + h - 13} textAnchor="middle" dominantBaseline="central" fill="#34d399" fontSize={10} className="select-none pointer-events-none">✓</text>
        </g>
      )}

      {/* Lock icon for unavailable */}
      {!available && (
        <text x={x + w - 16} y={y + h / 2 + 1} dominantBaseline="central" fill="#374151" fontSize={12} className="select-none pointer-events-none">🔒</text>
      )}
    </g>
  );
}
