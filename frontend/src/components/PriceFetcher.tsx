import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { currencyPairs } from '../config/pairs';
import { API_CONFIG } from '../config/api';
import { PriceResponse, ApiError } from '../types/api';
import { PairSelector } from './PairSelector';
import { PriceDisplay } from './PriceDisplay';
import { Button } from './common/Button';
import { Card } from './common/Card';

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '24px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
  },
  title: {
    fontSize: '32px',
    fontWeight: 700,
    color: '#1f2937',
    marginBottom: '32px',
    textAlign: 'center' as const,
  },
  error: {
    background: '#fee2e2',
    color: '#991b1b',
    padding: '16px',
    borderRadius: '8px',
    marginBottom: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
};

const PriceFetcher: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [data, setData] = useState<PriceResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedPair = useMemo(() => currencyPairs[selectedIndex], [selectedIndex]);

  const fetchPrice = useCallback(async () => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await fetch(
        `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.prices}?base=${selectedPair.base}&quote=${selectedPair.quote}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new ApiError(response.status, errorData.message || 'Failed to fetch price');
      }

      const json: PriceResponse = await response.json();
      setData(json);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  }, [selectedPair]);

  useEffect(() => {
    fetchPrice();
  }, [fetchPrice]);

  const handlePairSelect = useCallback((index: number) => {
    setSelectedIndex(index);
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Crypto Price Tracker</h1>

      <PairSelector
        selectedIndex={selectedIndex}
        onSelect={handlePairSelect}
      />

      {error && (
        <Card>
          <div style={styles.error}>
            ⚠️ {error}
          </div>
        </Card>
      )}

      {data && <PriceDisplay data={data} />}

      <Button
        onClick={fetchPrice}
        disabled={loading}
        fullWidth
      >
        {loading ? 'Loading...' : 'Refresh'}
      </Button>
    </div>
  );
};

export default PriceFetcher; 