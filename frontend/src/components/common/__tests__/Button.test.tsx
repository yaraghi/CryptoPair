import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../Button';

describe('Button', () => {
  const mockOnClick = jest.fn();

  beforeEach(() => {
    mockOnClick.mockClear();
  });

  it('renders button with correct text', () => {
    render(<Button onClick={mockOnClick}>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', () => {
    render(<Button onClick={mockOnClick}>Click me</Button>);
    fireEvent.click(screen.getByText('Click me'));
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('applies primary variant styles by default', () => {
    render(<Button onClick={mockOnClick}>Click me</Button>);
    const button = screen.getByText('Click me');
    expect(button).toHaveStyle({
      background: '#2563eb',
      color: '#ffffff',
    });
  });

  it('applies secondary variant styles when specified', () => {
    render(
      <Button onClick={mockOnClick} variant="secondary">
        Click me
      </Button>
    );
    const button = screen.getByText('Click me');
    expect(button).toHaveStyle({
      background: '#f3f4f6',
      color: '#374151',
    });
  });

  it('applies disabled styles when disabled', () => {
    render(
      <Button onClick={mockOnClick} disabled>
        Click me
      </Button>
    );
    const button = screen.getByText('Click me');
    expect(button).toHaveStyle({
      opacity: '0.6',
      cursor: 'not-allowed',
    });
  });

  it('does not call onClick when disabled', () => {
    render(
      <Button onClick={mockOnClick} disabled>
        Click me
      </Button>
    );
    fireEvent.click(screen.getByText('Click me'));
    expect(mockOnClick).not.toHaveBeenCalled();
  });

  it('applies full width when specified', () => {
    render(
      <Button onClick={mockOnClick} fullWidth>
        Click me
      </Button>
    );
    const button = screen.getByText('Click me');
    expect(button).toHaveStyle({
      width: '100%',
    });
  });
}); 