'use client';

import React from 'react';

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   SVG icon system — replaces all emojis throughout the app.

   Each icon is a 16×16 SVG that inherits `currentColor`.
   Usage: <Icon name="flame" className="text-amber-400 w-4 h-4" />
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

interface IconProps {
  name: string;
  className?: string;
  size?: number;
}

const paths: Record<string, React.ReactNode> = {
  // ── General ──────────────────────────────────────────
  'wave': (
    <path d="M1 8c2-3 4-3 6 0s4 3 6 0 4-3 6 0" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" />
  ),
  'book': (<>
    <path d="M2 3h5a2 2 0 012 2v8a1.5 1.5 0 00-1.5-1.5H2V3z" stroke="currentColor" strokeWidth="1.3" fill="none" />
    <path d="M14 3H9a2 2 0 00-2 2v8a1.5 1.5 0 011.5-1.5H14V3z" stroke="currentColor" strokeWidth="1.3" fill="none" />
  </>),
  'microscope': (<>
    <circle cx="8" cy="4.5" r="2.5" stroke="currentColor" strokeWidth="1.3" fill="none" />
    <path d="M8 7v4M5 14h6M8 11v3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </>),
  'compass': (<>
    <path d="M4 12l3-5 5-3-3 5-5 3z" stroke="currentColor" strokeWidth="1.2" fill="none" />
    <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.3" fill="none" />
  </>),
  'grid-square': (<>
    <rect x="2" y="2" width="12" height="12" rx="1" stroke="currentColor" strokeWidth="1.3" fill="none" />
    <path d="M2 6h12M2 10h12M6 2v12M10 2v12" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
  </>),
  'ruler': (
    <path d="M2 13l11-11M5 10l1-1M7 8l1-1M9 6l1-1M11 4l1-1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  ),
  'hash': (
    <path d="M4 1v14M10 1v14M1 5h14M1 11h14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
  ),
  'flame': (
    <path d="M8 1c0 3-4 4.5-4 8a4 4 0 008 0c0-3.5-4-5-4-8z" stroke="currentColor" strokeWidth="1.3" fill="none" />
  ),
  'box': (<>
    <path d="M2 5l6-3 6 3v6l-6 3-6-3V5z" stroke="currentColor" strokeWidth="1.3" fill="none" />
    <path d="M2 5l6 3 6-3M8 8v6.5" stroke="currentColor" strokeWidth="1" opacity="0.5" />
  </>),
  'arrow-right': (
    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  ),
  'arrows-h': (
    <path d="M2 8h12M5 5L2 8l3 3M11 5l3 3-3 3" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  ),
  'scale': (<>
    <path d="M8 2v12M3 14h10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    <path d="M3 6l5-4 5 4" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3 6c0 1.5 1 2 2 2s2-.5 2-2M9 6c0 1.5 1 2 2 2s2-.5 2-2" stroke="currentColor" strokeWidth="1" fill="none" />
  </>),
  'zap': (
    <path d="M9 1L4 9h4l-1 6 5-8H8l1-6z" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinejoin="round" />
  ),
  'arrow-left': (
    <path d="M13 8H3M7 4L3 8l4 4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  ),
  'shield': (
    <path d="M8 1L2 4v4c0 4 2.5 6 6 8 3.5-2 6-4 6-8V4L8 1z" stroke="currentColor" strokeWidth="1.3" fill="none" />
  ),
  'bar-chart': (<>
    <rect x="2" y="8" width="3" height="6" rx="0.5" stroke="currentColor" strokeWidth="1.2" fill="none" />
    <rect x="6.5" y="4" width="3" height="10" rx="0.5" stroke="currentColor" strokeWidth="1.2" fill="none" />
    <rect x="11" y="1" width="3" height="13" rx="0.5" stroke="currentColor" strokeWidth="1.2" fill="none" />
  </>),
  'alert-triangle': (<>
    <path d="M8 1L1 14h14L8 1z" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinejoin="round" />
    <path d="M8 6v3M8 11.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </>),
  'clock': (<>
    <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.3" fill="none" />
    <path d="M8 4v4l3 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </>),
  'thermometer': (<>
    <path d="M8 2v8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    <circle cx="8" cy="12" r="2" stroke="currentColor" strokeWidth="1.3" fill="none" />
    <rect x="6" y="2" width="4" height="8" rx="2" stroke="currentColor" strokeWidth="1.3" fill="none" />
  </>),
  'trending-down': (
    <path d="M3 3l4 4 3-3 4 4M10 8h4v4" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  ),
  'refresh': (
    <path d="M2 8a6 6 0 0110.5-4M14 8a6 6 0 01-10.5 4M12.5 1v3.5H9M3.5 15v-3.5H7" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  ),
  'map': (<>
    <path d="M1 3l5-1 4 2 5-1v11l-5 1-4-2-5 1V3z" stroke="currentColor" strokeWidth="1.2" fill="none" />
    <path d="M6 2v11M10 4v11" stroke="currentColor" strokeWidth="1" opacity="0.5" />
  </>),
  'hexagon': (
    <path d="M8 1L14 4.5V11.5L8 15L2 11.5V4.5L8 1z" stroke="currentColor" strokeWidth="1.3" fill="none" />
  ),
  'building': (<>
    <rect x="3" y="2" width="10" height="12" rx="1" stroke="currentColor" strokeWidth="1.3" fill="none" />
    <path d="M6 5h1M9 5h1M6 8h1M9 8h1M7 11h2v3H7v-3z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
  </>),
  'scroll': (<>
    <path d="M4 2h8a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V4a2 2 0 012-2z" stroke="currentColor" strokeWidth="1.3" fill="none" />
    <path d="M6 6h4M6 8.5h3M6 11h4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
  </>),
  'repeat': (<>
    <path d="M2 8a6 6 0 0112 0 6 6 0 01-12 0" stroke="currentColor" strokeWidth="1.3" fill="none" />
    <path d="M11 3l3 3-3 3" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </>),
  'spiral': (
    <path d="M8 8a1 1 0 011 1 2 2 0 01-2 2 3 3 0 013-3 4 4 0 00-4-4 5 5 0 015 5 6 6 0 01-6 6" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" />
  ),
  'lock': (<>
    <rect x="3" y="7" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.3" fill="none" />
    <path d="M5 7V5a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" />
  </>),
  'check': (
    <path d="M3 8.5l3.5 3.5 6.5-8" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  ),
  'play': (
    <path d="M5 3l8 5-8 5V3z" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinejoin="round" />
  ),

  // ── Highlight-box icons ──────────────────────────────
  'lightbulb': (<>
    <path d="M6 12h4M6.5 14h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M8 1a5 5 0 00-3 9v2h6v-2a5 5 0 00-3-9z" stroke="currentColor" strokeWidth="1.3" fill="none" />
  </>),
  'warning': (<>
    <path d="M8 1L1 14h14L8 1z" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinejoin="round" />
    <path d="M8 6v3M8 11.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </>),
  'key': (<>
    <circle cx="5" cy="5" r="3" stroke="currentColor" strokeWidth="1.3" fill="none" />
    <path d="M7.5 7.5L13 13M11 11l2-2M13 13l1-1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </>),

  // ── Simulation / placeholder icons ───────────────────
  'construction': (<>
    <path d="M2 14l5-5M14 14l-5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M4 2l2 4h4l2-4" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinejoin="round" />
    <path d="M6 6v3h4V6" stroke="currentColor" strokeWidth="1" fill="none" />
  </>),
  'chart-line': (<>
    <path d="M2 13l3-4 3 2 4-6 2 1" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </>),
  'explosion': (<>
    <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.2" fill="none" />
    <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3 3l1.5 1.5M11.5 11.5L13 13M3 13l1.5-1.5M11.5 4.5L13 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
  </>),
  'arrow-right-fire': (<>
    <path d="M3 8h8M8 5l3 3-3 3" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M14 6c0 1.5-1 3-2 3s-2-1.5-2-3c0 1 1 2 2 2s2-1 2-2z" stroke="currentColor" strokeWidth="0.8" fill="none" opacity="0.6" />
  </>),
};

/** Map curriculum icon keys to SVG path keys */
const ICON_ALIASES: Record<string, string> = {
  // Category icons
  'cat-wave': 'wave',
  'cat-book': 'book',
  'cat-ruler': 'ruler',
  'cat-box': 'box',
  'cat-zap': 'zap',
  'cat-alert': 'alert-triangle',
  'cat-refresh': 'refresh',
  'cat-map': 'map',
  'cat-spiral': 'spiral',
};

export default function Icon({ name, className = '', size = 16 }: IconProps) {
  const key = ICON_ALIASES[name] ?? name;
  const content = paths[key];
  if (!content) {
    // Fallback: render a small circle
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={`inline-block shrink-0 ${className}`}>
        <circle cx="8" cy="8" r="4" stroke="currentColor" strokeWidth="1.3" fill="none" />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={`inline-block shrink-0 ${className}`}>
      {content}
    </svg>
  );
}

/** Highlight box icon helper */
export function HighlightIcon({ type, className = '' }: { type: 'tip' | 'warning' | 'key'; className?: string }) {
  const map = { tip: 'lightbulb', warning: 'warning', key: 'key' };
  return <Icon name={map[type]} className={className} size={14} />;
}
