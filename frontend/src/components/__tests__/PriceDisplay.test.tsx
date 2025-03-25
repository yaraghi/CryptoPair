import React from 'react';
import { render, screen } from '@testing-library/react';
import { PriceDisplay } from '../PriceDisplay';
import { PriceResponse } from '../../types/api';

const mockData: PriceResponse = {
  base: 'TON',
  quote: 'USDT',
  price: {
    base: 'TON',
    quote: 'USDT',
    price: 2.5,
    percent_change_1h: 1.5,
    percent_change_24h: -2.3,
    percent_change_7d: 5.7,
    market_cap: 1000000,
    volume_24h: 500000,
    last_updated: '2024-03-20T12:00:00Z',
  },
};

describe('PriceDisplay', () => {
  it('renders price information correctly', () => {
    render(<PriceDisplay data={mockData} />);

    // Check if the pair is displayed
    expect(screen.getByText('TON / USDT')).toBeInTheDocument();

    // Check if the price is displayed
    expect(screen.getByText('2.5')).toBeInTheDocument();

    // Check if percentage changes are displayed
    expect(screen.getByText('+1.50%')).toBeInTheDocument();
    expect(screen.getByText('-2.30%')).toBeInTheDocument();
    expect(screen.getByText('+5.70%')).toBeInTheDocument();

    // Check if market cap and volume are displayed
    expect(screen.getByText('$1,000,000')).toBeInTheDocument();
    expect(screen.getByText('$500,000')).toBeInTheDocument();

    // Check if last update is displayed
    expect(screen.getByText(/Last Update:/)).toBeInTheDocument();
  });

  it('applies correct colors to percentage changes', () => {
    render(<PriceDisplay data={mockData} />);

    // Positive change should be green
    const positiveChange = screen.getByText('+1.50%');
    expect(positiveChange).toHaveStyle({ color: '#059669' });

    // Negative change should be red
    const negativeChange = screen.getByText('-2.30%');
    expect(negativeChange).toHaveStyle({ color: '#dc2626' });
  });
}); 