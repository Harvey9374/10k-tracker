import { useState, useMemo } from 'react';
import type { Recipe, MealType } from '../types';
import RecipeCard from './RecipeCard';
import ProteinFilter from './ProteinFilter';

interface Props {
  recipes: Recipe[];
  onSelect: (recipe: Recipe) => void;
}

const MEAL_TYPES: Array<MealType | 'All'> = ['All', 'Breakfast', 'Snack', 'Lunch', 'Dinner', 'Pudding'];

export default function RecipeList({ recipes, onSelect }: Props) {
  const [query, setQuery] = useState('');
  const [mealType, setMealType] = useState<MealType | 'All'>('All');
  const [proteinTags, setProteinTags] = useState<string[]>([]);
  const [secondTag, setSecondTag] = useState<string | null>(null);

  function toggleProtein(tag: string) {
    setProteinTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
    setSecondTag(null);
  }

  function clearFilters() {
    setProteinTags([]);
    setSecondTag(null);
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return recipes.filter(r => {
      if (mealType !== 'All' && r.mealType !== mealType) return false;
      if (proteinTags.length > 0 && !proteinTags.some(p => r.ingredientTags.includes(p))) return false;
      if (secondTag && !r.ingredientTags.includes(secondTag)) return false;
      if (!q) return true;
      return r.name.toLowerCase().includes(q) || r.ingredientTags.some(t => t.includes(q));
    });
  }, [recipes, query, mealType, proteinTags, secondTag]);

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h1 style={styles.title}>Protein Recipes</h1>
        <input
          type="search"
          placeholder="Search recipes…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          style={styles.search}
        />
      </header>

      <div style={styles.mealFilter}>
        {MEAL_TYPES.map(mt => (
          <button
            key={mt}
            onClick={() => setMealType(mt)}
            style={{
              ...styles.pill,
              ...(mealType === mt ? styles.pillActive : {}),
            }}
          >
            {mt}
          </button>
        ))}
      </div>

      <ProteinFilter
        recipes={recipes}
        proteinTags={proteinTags}
        secondTag={secondTag}
        onProteinToggle={toggleProtein}
        onSecondChange={setSecondTag}
        onClear={clearFilters}
      />

      <div style={styles.count}>
        {filtered.length} recipe{filtered.length !== 1 ? 's' : ''}
      </div>

      <div style={styles.grid}>
        {filtered.map(recipe => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            onClick={() => onSelect(recipe)}
          />
        ))}
        {filtered.length === 0 && (
          <p style={styles.empty}>No recipes match your filters.</p>
        )}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    overflow: 'hidden',
    background: 'var(--bg)',
  },
  header: {
    padding: '20px 16px 14px',
    background: 'var(--surface)',
    borderBottom: '1px solid var(--border)',
  },
  title: {
    fontSize: '1.4rem',
    fontWeight: 700,
    marginBottom: '12px',
    color: 'var(--text)',
  },
  search: {
    width: '100%',
    padding: '10px 14px',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--border)',
    background: 'var(--surface2)',
    color: 'var(--text)',
    fontSize: '0.95rem',
    outline: 'none',
  },
  mealFilter: {
    display: 'flex',
    gap: '6px',
    overflowX: 'auto',
    padding: '10px 16px 4px',
    scrollbarWidth: 'none',
    background: 'var(--surface)',
    borderBottom: '1px solid var(--border)',
  },
  pill: {
    flexShrink: 0,
    fontSize: '0.82rem',
    fontWeight: 500,
    padding: '6px 14px',
    borderRadius: '999px',
    border: '1px solid var(--border)',
    background: 'var(--surface2)',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  pillActive: {
    background: 'var(--accent)',
    border: '1px solid var(--accent)',
    color: '#fff',
  },
  count: {
    padding: '8px 16px 2px',
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
  },
  grid: {
    flex: 1,
    overflowY: 'auto',
    padding: '8px 16px 24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  empty: {
    color: 'var(--text-muted)',
    textAlign: 'center',
    marginTop: '40px',
  },
};
