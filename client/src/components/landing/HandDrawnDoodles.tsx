import React from 'react';

export const SketchStar: React.FC<{ size?: number; style?: React.CSSProperties }> = ({ size = 32, style = {} }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    stroke="#000000"
    strokeWidth="2.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ display: 'inline-block', ...style }}
    aria-hidden="true"
  >
    {/* 8-point hand-drawn star like in reference images */}
    <path d="M24,4 L24,44 M4,24 L44,24 M10,10 L38,38 M10,38 L38,10" />
  </svg>
);

export const SketchArrowDownRight: React.FC<{ size?: number; style?: React.CSSProperties }> = ({ size = 48, style = {} }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    stroke="#000000"
    strokeWidth="2.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ display: 'inline-block', ...style }}
    aria-hidden="true"
  >
    {/* Looped curved arrow pointing down */}
    <path d="M12,18 C28,4 52,14 48,34 C44,52 26,46 36,54" />
    <path d="M28,52 L38,56 L40,44" />
  </svg>
);

export const SketchArrowCurveDown: React.FC<{ width?: number; height?: number; style?: React.CSSProperties }> = ({
  width = 64,
  height = 54,
  style = {},
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 64 54"
    fill="none"
    stroke="#000000"
    strokeWidth="2.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ display: 'inline-block', ...style }}
    aria-hidden="true"
  >
    <path d="M10,8 C22,4 48,10 52,36" />
    <path d="M42,32 L53,38 L56,26" />
  </svg>
);

export const SketchArrowLoop: React.FC<{ size?: number; style?: React.CSSProperties }> = ({ size = 56, style = {} }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    stroke="#000000"
    strokeWidth="2.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ display: 'inline-block', ...style }}
    aria-hidden="true"
  >
    {/* Looping swoosh arrow like on the reference cover */}
    <path d="M14,48 C8,28 26,10 42,16 C58,22 48,46 28,42" />
    <path d="M22,34 L26,43 L36,40" />
  </svg>
);

export const SketchDashes: React.FC<{ style?: React.CSSProperties }> = ({ style = {} }) => (
  <svg
    width={36}
    height={36}
    viewBox="0 0 36 36"
    fill="none"
    stroke="#000000"
    strokeWidth="2.8"
    strokeLinecap="round"
    style={{ display: 'inline-block', ...style }}
    aria-hidden="true"
  >
    <path d="M6,22 L14,14 M16,28 L24,6 M28,32 L34,16" />
  </svg>
);

export const SketchUnderline: React.FC<{ width?: number; style?: React.CSSProperties }> = ({
  width = 160,
  style = {},
}) => (
  <svg
    width={width}
    height={16}
    viewBox={`0 0 ${width} 16`}
    fill="none"
    stroke="#000000"
    strokeWidth="3"
    strokeLinecap="round"
    style={{ display: 'block', ...style }}
    aria-hidden="true"
  >
    <path d={`M 4,10 Q ${width / 3},4 ${width * 0.6},11 T ${width - 4},6`} />
  </svg>
);
