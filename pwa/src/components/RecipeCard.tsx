import type { Recipe } from '../types';

interface Props {
  recipe: Recipe;
  onClick: () => void;
}

export default function RecipeCard({ recipe, onClick }: Props) {
  const { name, macros, ingredientTags } = recipe;

  return (
    <button onClick={onClick} style={styles.card}>
      <div style={styles.name}>{name}</div>
      <div style={styles.macros}>
        {macros.calories > 0 && (
          <span style={styles.macro}>{macros.calories} kcal</span>
        )}
        {macros.protein > 0 && (
          <span style={{ ...styles.macro, ...styles.protein }}>
            {macros.protein}g protein
          </span>
        )}
      </div>
      {ingredientTags.length > 0 && (
        <div style={styles.tags}>
          {ingredientTags.slice(0, 4).map(tag => (
            <span key={tag} style={styles.tag}>{tag}</span>
          ))}
        </div>
      )}
    </button>
  );
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '16px',
    textAlign: 'left',
    width: '100%',
    transition: 'border-color 0.15s, background 0.15s',
    cursor: 'pointer',
  },
  name: {
    fontSize: '1rem',
    fontWeight: 600,
    lineHeight: 1.3,
    color: 'var(--text)',
  },
  macros: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  macro: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
    background: 'var(--surface2)',
    borderRadius: '4px',
    padding: '2px 6px',
  },
  protein: {
    color: '#7ecba1',
  },
  tags: {
    display: 'flex',
    gap: '6px',
    flexWrap: 'wrap',
    marginTop: '2px',
  },
  tag: {
    fontSize: '0.72rem',
    color: 'var(--accent2)',
    background: 'rgba(69,123,157,0.12)',
    borderRadius: '4px',
    padding: '2px 6px',
    textTransform: 'lowercase',
  },
};
