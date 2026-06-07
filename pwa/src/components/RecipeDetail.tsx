import type { Recipe } from '../types';

interface Props {
  recipe: Recipe;
  onBack: () => void;
}

export default function RecipeDetail({ recipe, onBack }: Props) {
  const { name, ingredients, method, macros } = recipe;

  const macroItems = [
    { label: 'Calories', value: macros.calories, unit: 'kcal', color: '#f4a261' },
    { label: 'Protein', value: macros.protein, unit: 'g', color: '#7ecba1' },
    { label: 'Carbs', value: macros.carbs, unit: 'g', color: '#a8c4e0' },
    { label: 'Fat', value: macros.fat, unit: 'g', color: '#e9c46a' },
  ].filter(m => m.value > 0);

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <button onClick={onBack} style={styles.back} aria-label="Back">
          ← Back
        </button>
        <h1 style={styles.title}>{name}</h1>
      </header>

      <div style={styles.body}>
        {macroItems.length > 0 && (
          <section style={styles.section}>
            <div style={styles.macroGrid}>
              {macroItems.map(m => (
                <div key={m.label} style={styles.macroCard}>
                  <span style={{ ...styles.macroValue, color: m.color }}>
                    {m.value}{m.unit}
                  </span>
                  <span style={styles.macroLabel}>{m.label}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {ingredients.length > 0 && (
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Ingredients</h2>
            <ul style={styles.list}>
              {ingredients.map((ing, i) => (
                <li key={i} style={styles.listItem}>
                  <span style={styles.bullet}>•</span>
                  {ing}
                </li>
              ))}
            </ul>
          </section>
        )}

        {method.length > 0 && (
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Method</h2>
            <ol style={styles.list}>
              {method.map((step, i) => (
                <li key={i} style={styles.stepItem}>
                  <span style={styles.stepNum}>{i + 1}</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </section>
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
    padding: '16px 16px 14px',
    background: 'var(--surface)',
    borderBottom: '1px solid var(--border)',
  },
  back: {
    fontSize: '0.9rem',
    color: 'var(--accent2)',
    marginBottom: '10px',
    padding: 0,
  },
  title: {
    fontSize: '1.3rem',
    fontWeight: 700,
    lineHeight: 1.3,
  },
  body: {
    flex: 1,
    overflowY: 'auto',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  sectionTitle: {
    fontWeight: 600,
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    fontSize: '0.78rem',
  } as React.CSSProperties,
  macroGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))',
    gap: '10px',
  },
  macroCard: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    padding: '12px 10px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
  },
  macroValue: {
    fontSize: '1.1rem',
    fontWeight: 700,
  },
  macroLabel: {
    fontSize: '0.72rem',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  list: {
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  listItem: {
    display: 'flex',
    gap: '10px',
    fontSize: '0.95rem',
    lineHeight: 1.4,
    color: 'var(--text)',
  },
  bullet: {
    color: 'var(--accent)',
    flexShrink: 0,
    marginTop: '1px',
  },
  stepItem: {
    display: 'flex',
    gap: '12px',
    fontSize: '0.95rem',
    lineHeight: 1.5,
    color: 'var(--text)',
  },
  stepNum: {
    flexShrink: 0,
    width: '22px',
    height: '22px',
    borderRadius: '50%',
    background: 'var(--accent)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.75rem',
    fontWeight: 700,
    marginTop: '1px',
  },
};
