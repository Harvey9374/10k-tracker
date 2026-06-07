import type { Recipe } from '../types';

interface Props {
  recipe: Recipe;
  onClick: () => void;
}

export default function RecipeCard({ recipe, onClick }: Props) {
  const { name, macros, ingredientTags, mealType } = recipe;

  return (
    <button onClick={onClick} style={styles.card}>
      <div style={styles.header}>
        <div style={styles.name}>{name}</div>
        <span style={styles.mealBadge}>{mealType}</span>
      </div>
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
    cursor: 'pointer',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '8px',
  },
  name: {
    fontSize: '1rem',
    fontWeight: 600,
    lineHeight: 1.3,
    color: 'var(--text)',
    flex: 1,
  },
  mealBadge: {
    fontSize: '0.7rem',
    fontWeight: 500,
    color: 'var(--accent2)',
    background: 'rgba(37,99,235,0.08)',
    borderRadius: '4px',
    padding: '2px 7px',
    whiteSpace: 'nowrap',
    flexShrink: 0,
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
    color: '#15803d',
    background: 'rgba(21,128,61,0.08)',
  },
  tags: {
    display: 'flex',
    gap: '6px',
    flexWrap: 'wrap',
    marginTop: '2px',
  },
  tag: {
    fontSize: '0.72rem',
    color: 'var(--text-muted)',
    background: 'var(--surface2)',
    borderRadius: '4px',
    padding: '2px 6px',
    textTransform: 'lowercase',
  },
};
