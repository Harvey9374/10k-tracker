export interface Ingredient {
  qty: string
  item: string
}

export interface Recipe {
  id: string
  title: string
  proteinG: number
  caloriesKcal: number
  prepMins: number
  cookMins: number
  servings: number
  tags: string[]
  ingredients: Ingredient[]
  steps: string[]
  image?: string
}
