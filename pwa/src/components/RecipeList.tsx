import { useState, useMemo } from 'react';
import type { Recipe } from '../types';
import RecipeCard from './RecipeCard';
import TagFilter from './TagFilter';

interface Props {
  recipes: Recipe[];
  onSelect: (recipe: Recipe) => void;
}

export default function RecipeList({ recipes, onSelect }: Props) {
  const [query, setQuery] = useState('');
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const allTags = useMemo(() => {
    const counts = new Map<string, number>();
    for (const r of recipes) {
      for (const t of r.ingredientTags) {
        counts.set(t, (counts.get(t) ?? 0) + 1);
      }
    }
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([t]) => t);
  }, [recipes]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return recipes.filter(r => {
      if (activeTag && !r.ingredientTags.includes(activeTag)) return false;
      if (!q) return true;
      return (
        r.name.toLowerCase().includes(q) ||
        r.ingredientTags.some(t => t.includes(q))
      );
    });
  }, [recipes, query, activeTag]);

  function toggleTag(tag: string) {
    setActiveTag(prev => (prev === tag ? null : tag));
  }

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h1 style={styles.title}>Protein Recipes</h1>
        <div style={styles.searchWrap}>
          <input
            type="search"
            placeholder="Search recipes…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={styles.search}
          />
        </div>
      </header>

      <TagFilter tags={allTags} active={activeTag} onToggle={toggleTag} />

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
          <p style={styles.empty}>No recipes match your search.</p>
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
  },
  header: {
    padding: '20px 16px 12px',
    background: 'var(--surface)',
    borderBottom: '1px solid var(--border)',
  },
  title: {
    fontSize: '1.4rem',
    fontWeight: 700,
    marginBottom: '12px',
    color: 'var(--text)',
  },
  searchWrap: {
    position: 'relative',
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
  count: {
    padding: '10px 16px 4px',
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
