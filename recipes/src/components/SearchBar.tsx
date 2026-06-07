interface Props {
  query: string
  minProtein: number
  onQuery: (v: string) => void
  onMinProtein: (v: number) => void
}

export default function SearchBar({ query, minProtein, onQuery, onMinProtein }: Props) {
  return (
    <div className="search-bar">
      <input
        type="search"
        className="search-input"
        placeholder="Search recipes…"
        value={query}
        onChange={e => onQuery(e.target.value)}
        aria-label="Search recipes"
      />
      <div className="filter-row">
        <label className="filter-label">
          Min protein
          <span className="filter-value">{minProtein}g</span>
        </label>
        <input
          type="range"
          className="protein-slider"
          min={0}
          max={60}
          step={5}
          value={minProtein}
          onChange={e => onMinProtein(Number(e.target.value))}
          aria-label="Minimum protein in grams"
        />
      </div>
    </div>
  )
}
