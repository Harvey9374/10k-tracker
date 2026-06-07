import { useMemo } from 'react';
import type { Recipe } from '../types';

const PROTEIN_SOURCES = new Set([
  'chicken', 'beef mince', 'beef', 'salmon', 'tuna', 'eggs', 'egg whites',
  'bacon', 'ham', 'chorizo', 'chicken mince', 'pepperoni',
  'cottage cheese', 'whey protein', 'protein powder', 'protein shake',
  'greek yogurt',
]);

interface Props {
  recipes: Recipe[];
  proteinTag: string | null;
  secondTag: string | null;
  onProteinChange: (tag: string | null) => void;
  onSecondChange: (tag: string | null) => void;
}

export default function ProteinFilter({ recipes, proteinTag, secondTag, onProteinChange, onSecondChange }: Props) {
  const proteinTags = useMemo(() => {
    const seen = new Set<string>();
    for (const r of recipes) {
      for (const t of r.ingredientTags) {
        if (PROTEIN_SOURCES.has(t)) seen.add(t);
      }
    }
    return [...seen].sort();
  }, [recipes]);

  const secondaryTags = useMemo(() => {
    if (!proteinTag) return [];
    const seen = new Set<string>();
    for (const r of recipes) {
      if (r.ingredientTags.includes(proteinTag)) {
        for (const t of r.ingredientTags) {
          if (t !== proteinTag) seen.add(t);
        }
      }
    }
    return [...seen].sort();
  }, [recipes, proteinTag]);

  const hasFilters = proteinTag || secondTag;

  return (
    <div style={styles.wrap}>
      <select
        value={proteinTag ?? ''}
        onChange={e => {
          onProteinChange(e.target.value || null);
          onSecondChange(null);
        }}
        style={styles.select}
      >
        <option value="">All proteins</option>
        {proteinTags.map(t => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>

      {proteinTag && (
        <select
          value={secondTag ?? ''}
          onChange={e => onSecondChange(e.target.value || null)}
          style={styles.select}
        >
          <option value="">+ any ingredient</option>
          {secondaryTags.map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      )}

      {hasFilters && (
        <button
          onClick={() => { onProteinChange(null); onSecondChange(null); }}
          style={styles.clear}
        >
          Clear filters
        </button>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrap: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
    padding: '8px 16px',
    flexWrap: 'wrap',
  },
  select: {
    padding: '8px 10px',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--border)',
    background: 'var(--surface)',
    color: 'var(--text)',
    fontSize: '0.875rem',
    cursor: 'pointer',
    outline: 'none',
    flexShrink: 0,
  },
  clear: {
    padding: '8px 12px',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--border)',
    background: 'var(--surface2)',
    color: 'var(--text-muted)',
    fontSize: '0.8rem',
    cursor: 'pointer',
  },
};
