import { useMemo } from 'react';
import type { Recipe } from '../types';

const PROTEIN_SOURCES = new Set([
  'chicken', 'beef mince', 'beef', 'salmon', 'tuna', 'eggs', 'egg whites',
  'bacon', 'ham', 'chorizo', 'chicken mince', 'pepperoni', 'turkey bacon',
  'cottage cheese', 'whey protein', 'protein powder', 'protein shake',
  'greek yogurt',
]);

interface Props {
  recipes: Recipe[];
  proteinTags: string[];
  secondTag: string | null;
  onProteinToggle: (tag: string) => void;
  onSecondChange: (tag: string | null) => void;
  onClear: () => void;
}

export default function ProteinFilter({ recipes, proteinTags, secondTag, onProteinToggle, onSecondChange, onClear }: Props) {
  const availableProteins = useMemo(() => {
    const seen = new Set<string>();
    for (const r of recipes) {
      for (const t of r.ingredientTags) {
        if (PROTEIN_SOURCES.has(t)) seen.add(t);
      }
    }
    return [...seen].sort();
  }, [recipes]);

  const secondaryTags = useMemo(() => {
    if (proteinTags.length === 0) return [];
    const seen = new Set<string>();
    for (const r of recipes) {
      if (proteinTags.some(p => r.ingredientTags.includes(p))) {
        for (const t of r.ingredientTags) {
          if (!proteinTags.includes(t)) seen.add(t);
        }
      }
    }
    return [...seen].sort();
  }, [recipes, proteinTags]);

  const hasFilters = proteinTags.length > 0 || secondTag;

  return (
    <div style={styles.wrap}>
      <div style={styles.label}>Protein</div>
      <div style={styles.pillRow}>
        {availableProteins.map(t => (
          <button
            key={t}
            onClick={() => onProteinToggle(t)}
            style={{
              ...styles.pill,
              ...(proteinTags.includes(t) ? styles.pillActive : {}),
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {proteinTags.length > 0 && secondaryTags.length > 0 && (
        <>
          <div style={styles.label}>+ ingredient</div>
          <select
            value={secondTag ?? ''}
            onChange={e => onSecondChange(e.target.value || null)}
            style={styles.select}
          >
            <option value="">Any</option>
            {secondaryTags.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </>
      )}

      {hasFilters && (
        <button onClick={onClear} style={styles.clear}>
          Clear filters
        </button>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrap: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    padding: '8px 16px 10px',
    borderBottom: '1px solid var(--border)',
    background: 'var(--surface)',
  },
  label: {
    fontSize: '0.72rem',
    fontWeight: 600,
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  pillRow: {
    display: 'flex',
    gap: '6px',
    overflowX: 'auto',
    scrollbarWidth: 'none',
    paddingBottom: '2px',
  },
  pill: {
    flexShrink: 0,
    fontSize: '0.8rem',
    fontWeight: 500,
    padding: '5px 12px',
    borderRadius: '999px',
    border: '1px solid var(--border)',
    background: 'var(--surface2)',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  pillActive: {
    background: '#15803d',
    border: '1px solid #15803d',
    color: '#fff',
  },
  select: {
    padding: '7px 10px',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--border)',
    background: 'var(--surface2)',
    color: 'var(--text)',
    fontSize: '0.875rem',
    cursor: 'pointer',
    outline: 'none',
    alignSelf: 'flex-start',
  },
  clear: {
    alignSelf: 'flex-start',
    padding: '6px 12px',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--border)',
    background: 'var(--surface2)',
    color: 'var(--text-muted)',
    fontSize: '0.8rem',
    cursor: 'pointer',
    marginTop: '2px',
  },
};
