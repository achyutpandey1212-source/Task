import React from 'react';

export type DifficultyFilter = 'all' | 'easy' | 'medium' | 'hard';

interface ProblemFiltersProps {
  currentFilter: DifficultyFilter;
  onFilterChange: (filter: DifficultyFilter) => void;
  counts: {
    all: number;
    easy: number;
    medium: number;
    hard: number;
  };
}

export const ProblemFilters: React.FC<ProblemFiltersProps> = ({
  currentFilter,
  onFilterChange,
  counts,
}) => {
  const filters: { key: DifficultyFilter; label: string; count: number }[] = [
    { key: 'all', label: 'ALL CASES', count: counts.all },
    { key: 'easy', label: 'EASY', count: counts.easy },
    { key: 'medium', label: 'MEDIUM', count: counts.medium },
    { key: 'hard', label: 'HARD', count: counts.hard },
  ];

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        flexWrap: 'wrap',
      }}
      role="group"
      aria-label="Filter case files by difficulty"
    >
      <span
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '12px',
          fontWeight: 700,
          color: '#666666',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginRight: '4px',
        }}
      >
        FILTER:
      </span>

      {filters.map((f) => {
        const isSelected = currentFilter === f.key;
        return (
          <button
            key={f.key}
            onClick={() => onFilterChange(f.key)}
            style={{
              backgroundColor: isSelected ? '#FEDE8C' : '#FFFFFF',
              color: '#000000',
              border: '2px solid #000000',
              padding: '6px 14px',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '12px',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: isSelected ? '3px 3px 0px #000000' : '2px 2px 0px rgba(0, 0, 0, 0.15)',
              transform: isSelected ? 'translate(-1px, -1px)' : 'none',
              transition: 'all 0.12s ease',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
            aria-pressed={isSelected}
          >
            <span>{f.label}</span>
            <span
              style={{
                fontSize: '10px',
                padding: '1px 5px',
                borderRadius: '2px',
                backgroundColor: isSelected ? '#000000' : '#E7E5E5',
                color: isSelected ? '#FFFFFF' : '#333333',
              }}
            >
              {f.count}
            </span>
          </button>
        );
      })}
    </div>
  );
};
