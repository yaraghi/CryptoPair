import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { PairSelector } from '../PairSelector';
import { currencyPairs } from '../../config/pairs';

describe('PairSelector', () => {
  const mockOnSelect = jest.fn();

  beforeEach(() => {
    mockOnSelect.mockClear();
  });

  it('renders all currency pairs', () => {
    render(<PairSelector selectedIndex={0} onSelect={mockOnSelect} />);
    
    currencyPairs.forEach((pair) => {
      expect(screen.getByText(`${pair.base}/${pair.quote}`)).toBeInTheDocument();
    });
  });

  it('applies primary variant to selected pair', () => {
    render(<PairSelector selectedIndex={0} onSelect={mockOnSelect} />);
    
    const selectedButton = screen.getByText(`${currencyPairs[0].base}/${currencyPairs[0].quote}`);
    expect(selectedButton).toHaveStyle({
      background: '#2563eb',
      color: '#ffffff',
    });
  });

  it('applies secondary variant to unselected pairs', () => {
    render(<PairSelector selectedIndex={0} onSelect={mockOnSelect} />);
    
    const unselectedButton = screen.getByText(`${currencyPairs[1].base}/${currencyPairs[1].quote}`);
    expect(unselectedButton).toHaveStyle({
      background: '#f3f4f6',
      color: '#374151',
    });
  });

  it('calls onSelect with correct index when pair is clicked', () => {
    render(<PairSelector selectedIndex={0} onSelect={mockOnSelect} />);
    
    fireEvent.click(screen.getByText(`${currencyPairs[1].base}/${currencyPairs[1].quote}`));
    expect(mockOnSelect).toHaveBeenCalledWith(1);
  });

  it('renders with correct container styles', () => {
    render(<PairSelector selectedIndex={0} onSelect={mockOnSelect} />);
    
    const container = screen.getByText(`${currencyPairs[0].base}/${currencyPairs[0].quote}`).parentElement;
    expect(container).toHaveStyle({
      display: 'flex',
      gap: '12px',
      marginBottom: '24px',
      flexWrap: 'wrap',
    });
  });
}); 