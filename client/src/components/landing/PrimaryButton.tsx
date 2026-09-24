import React from 'react';
import { Link } from 'react-router-dom';

interface PrimaryButtonProps {
  to?: string;
  onClick?: () => void;
  children: React.ReactNode;
  variant?: 'yellow' | 'black' | 'lavender';
  style?: React.CSSProperties;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  to,
  onClick,
  children,
  variant = 'yellow',
  style = {},
}) => {
  const bgStyles = {
    yellow: {
      backgroundColor: '#FEDE8C',
      color: '#000000',
      border: '2px solid #000000',
      boxShadow: '3px 3px 0px #000000',
    },
    black: {
      backgroundColor: '#000000',
      color: '#FFFFFF',
      border: '2px solid #000000',
      boxShadow: '3px 3px 0px rgba(0, 0, 0, 0.25)',
    },
    lavender: {
      backgroundColor: '#D5BDFF',
      color: '#000000',
      border: '2px solid #000000',
      boxShadow: '3px 3px 0px #000000',
    },
  };

  const selected = bgStyles[variant];

  const commonStyle: React.CSSProperties = {
    ...selected,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '12px 24px',
    borderRadius: '4px',
    fontSize: '15px',
    fontWeight: 700,
    cursor: 'pointer',
    textDecoration: 'none',
    transition: 'transform 0.1s ease, box-shadow 0.1s ease',
    userSelect: 'none',
    ...style,
  };

  if (to) {
    return (
      <Link to={to} style={commonStyle}>
        {children}
      </Link>
    );
  }

  return (
    <button onClick={onClick} style={commonStyle}>
      {children}
    </button>
  );
};
