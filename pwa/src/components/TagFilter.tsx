interface Props {
  tags: string[];
  active: string | null;
  onToggle: (tag: string) => void;
}

export default function TagFilter({ tags, active, onToggle }: Props) {
  if (tags.length === 0) return null;

  return (
    <div style={styles.scroll}>
      {tags.map(tag => (
        <button
          key={tag}
          onClick={() => onToggle(tag)}
          style={{
            ...styles.pill,
            ...(active === tag ? styles.active : {}),
          }}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  scroll: {
    display: 'flex',
    gap: '8px',
    overflowX: 'auto',
    padding: '0 16px 4px',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
  },
  pill: {
    flexShrink: 0,
    fontSize: '0.8rem',
    padding: '6px 12px',
    borderRadius: '999px',
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    color: 'var(--text-muted)',
    transition: 'all 0.15s',
    whiteSpace: 'nowrap',
  },
  active: {
    background: 'var(--accent)',
    border: '1px solid var(--accent)',
    color: '#fff',
  },
};
