import React from 'react';
import { Card } from './common/Card';
import { PriceResponse } from '../types/api';

interface PriceDisplayProps {
  data: PriceResponse;
}

const styles = {
  title: {
    fontSize: '24px',
    fontWeight: 600,
    marginBottom: '16px',
    color: '#1f2937',
  },
  price: {
    fontSize: '32px',
    fontWeight: 700,
    color: '#1f2937',
    marginBottom: '16px',
  },
  changes: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px',
    marginBottom: '24px',
  },
  change: {
    padding: '12px',
    borderRadius: '8px',
    background: '#f3f4f6',
  },
  changeLabel: {
    fontSize: '14px',
    color: '#6b7280',
    marginBottom: '4px',
  },
  changeValue: {
    fontSize: '16px',
    fontWeight: 600,
  },
  stats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '16px',
  },
  stat: {
    padding: '12px',
    borderRadius: '8px',
    background: '#f3f4f6',
  },
  statLabel: {
    fontSize: '14px',
    color: '#6b7280',
    marginBottom: '4px',
  },
  statValue: {
    fontSize: '16px',
    fontWeight: 600,
  },
  timestamp: {
    fontSize: '14px',
    color: '#6b7280',
    marginTop: '16px',
    textAlign: 'center' as const,
  },
};

const formatNumber = (num: number): string =>
  Intl.NumberFormat('en-US', { maximumFractionDigits: 6 }).format(num);

const formatPercent = (p: number): string => {
  const sign = p > 0 ? '+' : '';
  return `${sign}${p.toFixed(2)}%`;
};

const getChangeStyle = (value: number): React.CSSProperties => ({
  color: value >= 0 ? '#059669' : '#dc2626',
});

export const PriceDisplay: React.FC<PriceDisplayProps> = ({ data }) => {
  return (
    <Card>
      <h3 style={styles.title}>
        {data.base} / {data.quote}
      </h3>
      <p style={styles.price}>
        {formatNumber(data.price.price)}
      </p>

      <div style={styles.changes}>
        <div style={styles.change}>
          <div style={styles.changeLabel}>1h Change</div>
          <div style={{ ...styles.changeValue, ...getChangeStyle(data.price.percent_change_1h) }}>
            {formatPercent(data.price.percent_change_1h)}
          </div>
        </div>
        <div style={styles.change}>
          <div style={styles.changeLabel}>24h Change</div>
          <div style={{ ...styles.changeValue, ...getChangeStyle(data.price.percent_change_24h) }}>
            {formatPercent(data.price.percent_change_24h)}
          </div>
        </div>
        <div style={styles.change}>
          <div style={styles.changeLabel}>7d Change</div>
          <div style={{ ...styles.changeValue, ...getChangeStyle(data.price.percent_change_7d) }}>
            {formatPercent(data.price.percent_change_7d)}
          </div>
        </div>
      </div>

      <div style={styles.stats}>
        <div style={styles.stat}>
          <div style={styles.statLabel}>Market Cap</div>
          <div style={styles.statValue}>
            ${formatNumber(data.price.market_cap)}
          </div>
        </div>
        <div style={styles.stat}>
          <div style={styles.statLabel}>24h Volume</div>
          <div style={styles.statValue}>
            ${formatNumber(data.price.volume_24h)}
          </div>
        </div>
      </div>

      <div style={styles.timestamp}>
        Last Update: {new Date(data.price.last_updated).toLocaleString()}
      </div>
    </Card>
  );
}; 