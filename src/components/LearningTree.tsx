'use client';

import React, { useState, useCallback } from 'react';
import { curriculum, LessonNode, getAllLessons, getBreadcrumb } from '@/curriculum/curriculum';

interface Props {
  currentLessonId: string | null;
  onSelectLesson: (id: string) => void;
  completedLessons?: Set<string>;
}

/**
 * Collapsible tree sidebar showing the full curriculum.
 * Categories are expandable, lessons are clickable.
 */
export default function LearningTree({ currentLessonId, onSelectLesson, completedLessons }: Props) {
  // Auto-expand categories that contain the current lesson
  const breadcrumb = currentLessonId ? getBreadcrumb(currentLessonId) : null;
  const breadcrumbIds = new Set(breadcrumb?.map(n => n.id) ?? []);

  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => {
    // Start with first two categories expanded + breadcrumb
    const initial = new Set<string>(['root', 'basics', 'fdm']);
    breadcrumbIds.forEach(id => initial.add(id));
    return initial;
  });

  const toggle = useCallback((id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  // Progress counter
  const allLessons = getAllLessons();
  const availableLessons = allLessons.filter(l => l.available);
  const completedCount = completedLessons?.size ?? 0;

  return (
    <div className="flex flex-col h-full bg-gray-900 text-sm">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-800">
        <h2 className="text-base font-bold text-cyan-400 flex items-center gap-2">
          🌊 CFD Lernpfad
        </h2>
        <div className="mt-1 flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-cyan-500 rounded-full transition-all duration-500"
              style={{ width: `${availableLessons.length > 0 ? (completedCount / availableLessons.length) * 100 : 0}%` }}
            />
          </div>
          <span className="text-[10px] text-gray-500 whitespace-nowrap">
            {completedCount}/{availableLessons.length}
          </span>
        </div>
      </div>

      {/* Tree */}
      <nav className="flex-1 overflow-y-auto py-2 curriculum-tree">
        {curriculum.children?.map(cat => (
          <CategoryNode
            key={cat.id}
            node={cat}
            depth={0}
            currentLessonId={currentLessonId}
            expandedIds={expandedIds}
            completedLessons={completedLessons}
            onToggle={toggle}
            onSelect={onSelectLesson}
          />
        ))}
      </nav>
    </div>
  );
}

// ── Category (expandable) ──────────────────────────────────────────

interface NodeProps {
  node: LessonNode;
  depth: number;
  currentLessonId: string | null;
  expandedIds: Set<string>;
  completedLessons?: Set<string>;
  onToggle: (id: string) => void;
  onSelect: (id: string) => void;
}

function CategoryNode({ node, depth, currentLessonId, expandedIds, completedLessons, onToggle, onSelect }: NodeProps) {
  const isExpanded = expandedIds.has(node.id);
  const isCategory = node.type === 'category';
  const isLesson = node.type === 'lesson';
  const isCurrent = node.id === currentLessonId;
  const isCompleted = completedLessons?.has(node.id);
  const isAvailable = node.available;

  if (isCategory) {
    // Count completed lessons in this category
    const catLessons = (node.children ?? []).filter(c => c.type === 'lesson');
    const catCompleted = catLessons.filter(c => completedLessons?.has(c.id)).length;

    return (
      <div className={!isAvailable ? 'opacity-50' : ''}>
        <button
          onClick={() => onToggle(node.id)}
          className={`
            w-full flex items-center gap-2 px-3 py-2 text-left
            hover:bg-gray-800/60 transition-colors
            ${depth === 0 ? 'font-semibold text-gray-200' : 'font-medium text-gray-300'}
          `}
          style={{ paddingLeft: `${12 + depth * 16}px` }}
        >
          <span className={`text-[10px] transition-transform ${isExpanded ? 'rotate-90' : ''}`}>
            ▶
          </span>
          <span className="text-base">{node.icon}</span>
          <span className="flex-1 truncate">{node.shortTitle}</span>
          {catLessons.length > 0 && (
            <span className="text-[10px] text-gray-600">
              {catCompleted}/{catLessons.length}
            </span>
          )}
        </button>
        {isExpanded && node.children && (
          <div>
            {node.children.map(child => (
              <CategoryNode
                key={child.id}
                node={child}
                depth={depth + 1}
                currentLessonId={currentLessonId}
                expandedIds={expandedIds}
                completedLessons={completedLessons}
                onToggle={onToggle}
                onSelect={onSelect}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  // Lesson node (leaf)
  if (isLesson) {
    return (
      <button
        onClick={() => isAvailable && onSelect(node.id)}
        disabled={!isAvailable}
        className={`
          w-full flex items-center gap-2 px-3 py-1.5 text-left transition-colors
          ${!isAvailable ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
          ${isCurrent
            ? 'bg-cyan-900/30 text-cyan-300 border-r-2 border-cyan-400'
            : isCompleted
              ? 'text-green-400 hover:bg-gray-800/60'
              : 'text-gray-400 hover:bg-gray-800/60 hover:text-gray-200'
          }
        `}
        style={{ paddingLeft: `${12 + (depth) * 16}px` }}
        title={node.description}
      >
        <span className="w-4 text-center text-xs">
          {isCompleted ? '✓' : isCurrent ? '→' : '○'}
        </span>
        <span className="text-base">{node.icon}</span>
        <span className="flex-1 truncate text-xs">{node.shortTitle}</span>
        {node.simMode && node.simMode !== 'none' && (
          <span className="text-[9px] px-1 py-0.5 rounded bg-gray-800 text-gray-500">▶</span>
        )}
      </button>
    );
  }

  return null;
}
