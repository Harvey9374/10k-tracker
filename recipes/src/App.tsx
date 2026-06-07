import { useState, useEffect, useMemo } from 'react'
import type { Recipe } from './types'
import SearchBar from './components/SearchBar'
import RecipeCard from './components/RecipeCard'
import RecipeDetail from './components/RecipeDetail'

export default function App() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [minProtein, setMinProtein] = useState(0)
  const [selected, setSelected] = useState<Recipe | null>(null)

  useEffect(() => {
    fetch('recipes.json')
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json() as Promise<Recipe[]>
      })
      .then(data => {
        setRecipes(data)
        setLoading(false)
      })
      .catch(err => {
        setError(String(err))
        setLoading(false)
      })
  }, [])

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()
    return recipes.filter(r => {
      if (r.proteinG < minProtein) return false
      if (!q) return true
      return (
        r.title.toLowerCase().includes(q) ||
        r.tags.some(t => t.toLowerCase().includes(q)) ||
        r.ingredients.some(i => i.item.toLowerCase().includes(q))
      )
    })
  }, [recipes, query, minProtein])

  if (selected) {
    return (
      <main className="app">
        <RecipeDetail recipe={selected} onBack={() => setSelected(null)} />
      </main>
    )
  }

  return (
    <main className="app">
      <header className="app-header">
        <h1 className="app-title">Protein Recipes</h1>
        <span className="recipe-count">{filtered.length} recipe{filtered.length !== 1 ? 's' : ''}</span>
      </header>

      <SearchBar
        query={query}
        minProtein={minProtein}
        onQuery={setQuery}
        onMinProtein={setMinProtein}
      />

      {loading && <p className="status-msg">Loading…</p>}
      {error && <p className="status-msg error">Failed to load recipes: {error}</p>}

      {!loading && !error && filtered.length === 0 && (
        <p className="status-msg">No recipes match your filters.</p>
      )}

      <div className="recipe-grid">
        {filtered.map(r => (
          <RecipeCard key={r.id} recipe={r} onClick={() => setSelected(r)} />
        ))}
      </div>
    </main>
  )
}
