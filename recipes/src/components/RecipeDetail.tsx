import type { Recipe } from '../types'

interface Props {
  recipe: Recipe
  onBack: () => void
}

export default function RecipeDetail({ recipe, onBack }: Props) {
  const totalMins = recipe.prepMins + recipe.cookMins
  return (
    <div className="detail">
      <button className="back-btn" onClick={onBack} aria-label="Back to list">
        ← Back
      </button>
      <h1 className="detail-title">{recipe.title}</h1>

      <div className="detail-stats">
        <div className="stat">
          <span className="stat-value">{recipe.proteinG}g</span>
          <span className="stat-label">Protein</span>
        </div>
        <div className="stat">
          <span className="stat-value">{recipe.caloriesKcal}</span>
          <span className="stat-label">kcal</span>
        </div>
        <div className="stat">
          <span className="stat-value">{totalMins}</span>
          <span className="stat-label">min</span>
        </div>
        <div className="stat">
          <span className="stat-value">{recipe.servings}</span>
          <span className="stat-label">serving{recipe.servings !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {recipe.tags.length > 0 && (
        <div className="detail-tags">
          {recipe.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
        </div>
      )}

      <section className="detail-section">
        <h2>Ingredients</h2>
        <ul className="ingredients-list">
          {recipe.ingredients.map((ing, i) => (
            <li key={i}>
              <span className="ing-qty">{ing.qty}</span>
              <span className="ing-item">{ing.item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="detail-section">
        <h2>Method</h2>
        <ol className="steps-list">
          {recipe.steps.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
      </section>
    </div>
  )
}
