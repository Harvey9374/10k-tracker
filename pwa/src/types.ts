export interface Macros {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface Recipe {
  id: string;
  name: string;
  ingredients: string[];
  method: string[];
  macros: Macros;
  ingredientTags: string[];
}
