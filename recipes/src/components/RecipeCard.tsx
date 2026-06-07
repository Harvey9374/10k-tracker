import type { Recipe } from '../types'

interface Props {
  recipe: Recipe
  onClick: () => void
}

export default function RecipeCard({ recipe, onClick }: Props) {
  const totalMins = recipe.prepMins + recipe.cookMins
  return (
    <button className="recipe-card" onClick={onClick} aria-label={recipe.title}>
      <div className="card-protein">
        <span className="protein-value">{recipe.proteinG}g</span>
        <span className="protein-label">protein</span>
      </div>
      <div className="card-body">
        <h2 className="card-title">{recipe.title}</h2>
        <div className="card-meta">
          <span>{recipe.caloriesKcal} kcal</span>
          <span>·</span>
          <span>{totalMins} min</span>
          <span>·</span>
          <span>{recipe.servings} serving{recipe.servings !== 1 ? 's' : ''}</span>
        </div>
        <div className="card-tags">
          {recipe.tags.map(tag => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
      </div>
    </button>
  )
}
