import React from 'react';

// Generates an organic, rough torn paper SVG path horizontally across width/height
export const generateTornEdge = (width: number, height: number, isTop: boolean): string => {
  const steps = 30;
  const dx = width / steps;
  let d = isTop ? `M 0,${height}` : `M 0,0`;

  for (let i = 0; i <= steps; i++) {
    const x = i * dx;
    // pseudo-random oscillation based on index
    const variance = ((i * 13 + 7) % 7) - 3;
    const y = isTop ? 4 + variance : height - 4 + variance;
    d += ` L ${x.toFixed(1)},${y.toFixed(1)}`;
  }

  if (isTop) {
    d += ` L ${width},${height} Z`;
  } else {
    d += ` L ${width},0 Z`;
  }
  return d;
};

interface TornPaperProps {
  children: React.ReactNode;
  color?: 'lavender' | 'yellow' | 'white';
  rotation?: number; // e.g. -0.5, 0.4
  className?: string;
  style?: React.CSSProperties;
  tornEdges?: 'both' | 'top' | 'bottom' | 'none';
}

export const TornPaper: React.FC<TornPaperProps> = ({
  children,
  color = 'lavender',
  rotation = 0,
  className = '',
  style = {},
  tornEdges = 'both',
}) => {
  const bgColors = {
    lavender: '#D5BDFF',
    yellow: '#FEDE8C',
    white: '#FFFFFF',
  };

  const backgroundColor = bgColors[color];

  // SVG mask for realistic ripped paper edges at top and bottom
  const topTornSvg = (
    <svg
      viewBox="0 0 1200 16"
      preserveAspectRatio="none"
      style={{
        position: 'absolute',
        top: '-15px',
        left: 0,
        width: '100%',
        height: '16px',
        fill: backgroundColor,
        pointerEvents: 'none',
      }}
    >
      <path d="M0,16 L0,8 Q 30,2 60,7 T 120,4 T 180,9 T 240,3 T 300,8 T 360,5 T 420,10 T 480,4 T 540,8 T 600,3 T 660,9 T 720,4 T 780,8 T 840,3 T 900,9 T 960,4 T 1020,8 T 1080,3 T 1140,7 T 1200,5 L1200,16 Z" />
    </svg>
  );

  const bottomTornSvg = (
    <svg
      viewBox="0 0 1200 16"
      preserveAspectRatio="none"
      style={{
        position: 'absolute',
        bottom: '-15px',
        left: 0,
        width: '100%',
        height: '16px',
        fill: backgroundColor,
        pointerEvents: 'none',
      }}
    >
      <path d="M0,0 L0,9 Q 30,14 60,8 T 120,12 T 180,7 T 240,13 T 300,8 T 360,11 T 420,6 T 480,12 T 540,7 T 600,13 T 660,7 T 720,12 T 780,8 T 840,13 T 900,7 T 960,12 T 1020,7 T 1080,13 T 1140,8 T 1200,10 L1200,0 Z" />
    </svg>
  );

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        backgroundColor,
        color: '#000000',
        transform: rotation ? `rotate(${rotation}deg)` : undefined,
        boxShadow: '0 4px 14px rgba(0, 0, 0, 0.04)',
        ...style,
      }}
    >
      {(tornEdges === 'both' || tornEdges === 'top') && topTornSvg}
      {children}
      {(tornEdges === 'both' || tornEdges === 'bottom') && bottomTornSvg}
    </div>
  );
};
