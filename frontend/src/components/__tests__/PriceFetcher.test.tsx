import React, { act } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PriceFetcher from '../PriceFetcher';
import { PriceResponse } from '../../types/api';

// Mock the fetch function
global.fetch = jest.fn();

describe('PriceFetcher', () => {
  const mockPriceData: PriceResponse = {
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

  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
    // Setup default mock response
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockPriceData,
    });
  });

  it('renders initial UI elements correctly', async () => {
    render(<PriceFetcher />);
    
    // Check for main title
    expect(screen.getByText('Crypto Price Tracker')).toBeInTheDocument();
    
    // Check for currency pair buttons
    expect(screen.getByText('TON/USDT')).toBeInTheDocument();
    expect(screen.getByText('USDT/TON')).toBeInTheDocument();
    
    // Wait for loading to complete and check for refresh button
    await waitFor(() => {
      expect(screen.getByText('Refresh')).toBeInTheDocument();
    });
  });

  it('loads and displays initial price data', async () => {
    render(<PriceFetcher />);

    // Wait for price to be displayed
    await waitFor(() => {
      expect(screen.getByText('2.5')).toBeInTheDocument();
    });

    // Check for percentage changes
    expect(screen.getByText('+1.50%')).toBeInTheDocument();
    expect(screen.getByText('-2.30%')).toBeInTheDocument();
    expect(screen.getByText('+5.70%')).toBeInTheDocument();
  });

  it('handles API errors appropriately', async () => {
    // Mock error response
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'API Error' }),
    });

    render(<PriceFetcher />);

    await waitFor(() => {
      expect(screen.getByText('⚠️ API Error')).toBeInTheDocument();
    });
  });

  it('updates price data when refresh button is clicked', async () => {
    const updatedPriceData = {
      ...mockPriceData,
      price: {
        ...mockPriceData.price,
        price: 3.0,
      },
    };

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockPriceData,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => updatedPriceData,
      });

    render(<PriceFetcher />);

    // Wait for initial price
    await waitFor(() => {
      expect(screen.getByText('2.5')).toBeInTheDocument();
    });

    // Click refresh and check for updated price
    await act(async () => {
      fireEvent.click(screen.getByText('Refresh'));
    });
    
    await waitFor(() => {
      expect(screen.getByText('3')).toBeInTheDocument();
    });
  });

  it('shows loading state while fetching data', async () => {
    // Mock a delayed response
    (global.fetch as jest.Mock).mockImplementationOnce(
      () => new Promise(resolve => setTimeout(() => resolve({
        ok: true,
        json: async () => mockPriceData
      }), 100))
    );

    render(<PriceFetcher />);

    // Check for loading state
    expect(screen.getByText('Loading...')).toBeInTheDocument();

    // Wait for data to load
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      expect(screen.getByText('2.5')).toBeInTheDocument();
    });
  });

  it('switches between currency pairs correctly', async () => {
    const reversePairData = {
      ...mockPriceData,
      base: 'USDT',
      quote: 'TON',
      price: {
        ...mockPriceData.price,
        price: 0.4,
      },
    };

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockPriceData,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => reversePairData,
      });

    render(<PriceFetcher />);

    // Wait for initial price
    await waitFor(() => {
      expect(screen.getByText('2.5')).toBeInTheDocument();
    });

    // Switch to reverse pair
    await act(async () => {
      fireEvent.click(screen.getByText('USDT/TON'));
    });

    // Check for updated price
    await waitFor(() => {
      expect(screen.getByText('0.4')).toBeInTheDocument();
    });
  });
}); 