import React from 'react';

export const Tape: React.FC<{
  rotation?: number;
  width?: number;
  height?: number;
  color?: string;
  style?: React.CSSProperties;
}> = ({
  rotation = -4,
  width = 72,
  height = 24,
  color = 'rgba(254, 222, 140, 0.65)', // translucent butter yellow tape
  style = {},
}) => {
  return (
    <div
      style={{
        width: `${width}px`,
        height: `${height}px`,
        backgroundColor: color,
        transform: `rotate(${rotation}deg)`,
        position: 'absolute',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
        backdropFilter: 'blur(1px)',
        zIndex: 10,
        pointerEvents: 'none',
        ...style,
      }}
      aria-hidden="true"
    />
  );
};

export const PushPin: React.FC<{
  color?: string;
  style?: React.CSSProperties;
}> = ({ color = '#D5BDFF', style = {} }) => {
  return (
    <div
      style={{
        width: '14px',
        height: '14px',
        borderRadius: '50%',
        backgroundColor: color,
        border: '1.5px solid #000000',
        boxShadow: '1px 2px 4px rgba(0, 0, 0, 0.25)',
        position: 'absolute',
        zIndex: 15,
        pointerEvents: 'none',
        ...style,
      }}
      aria-hidden="true"
    />
  );
};
