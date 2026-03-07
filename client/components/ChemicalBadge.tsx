import React from 'react';
import styles from '../styles/ChemicalBadge.module.css';

const BADGE_LABELS: Record<string, string> = {
  first_mine: '⛏️',
  pro_mine: '⚒️',
  speed: '⚡',
  expert: '🎯',
  multi_resource: '💎',
  master: '👑',
  diamond_hands: '💠',
  legend: '🏆',
  whale: '🐋',
};

interface ChemicalBadgeProps {
  element: string;
}

const ChemicalBadge: React.FC<ChemicalBadgeProps> = ({ element }) => {
  const label = BADGE_LABELS[element] || element;
  return (
    <div className={styles.chemicalBadge}>
      {label}
    </div>
  );
};

export default ChemicalBadge;
