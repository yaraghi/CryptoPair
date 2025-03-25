import React from 'react';
import { currencyPairs } from '../config/pairs';
import { Button } from './common/Button';

interface PairSelectorProps {
  selectedIndex: number;
  onSelect: (index: number) => void;
}

const styles = {
  container: {
    display: 'flex',
    gap: '12px',
    marginBottom: '24px',
    flexWrap: 'wrap' as const,
  },
};

export const PairSelector: React.FC<PairSelectorProps> = ({
  selectedIndex,
  onSelect,
}) => {
  return (
    <div style={styles.container}>
      {currencyPairs.map((pair, idx) => (
        <Button
          key={idx}
          onClick={() => onSelect(idx)}
          variant={idx === selectedIndex ? 'primary' : 'secondary'}
        >
          {pair.base}/{pair.quote}
        </Button>
      ))}
    </div>
  );
}; 