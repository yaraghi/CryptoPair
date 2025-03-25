import React from 'react';

interface ButtonProps {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  fullWidth?: boolean;
}

const styles = {
  button: {
    padding: '12px 24px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 600,
    transition: 'all 0.2s ease',
  },
  primary: {
    background: '#2563eb',
    color: '#ffffff',
    '&:hover': {
      background: '#1d4ed8',
    },
  },
  secondary: {
    background: '#f3f4f6',
    color: '#374151',
    '&:hover': {
      background: '#e5e7eb',
    },
  },
  disabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
};

export const Button: React.FC<ButtonProps> = ({
  onClick,
  disabled,
  children,
  variant = 'primary',
  fullWidth = false,
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    style={{
      ...styles.button,
      ...styles[variant],
      ...(disabled && styles.disabled),
      width: fullWidth ? '100%' : 'auto',
    }}
  >
    {children}
  </button>
); 