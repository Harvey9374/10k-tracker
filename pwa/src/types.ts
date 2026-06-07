export type MealType = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack' | 'Pudding';

export interface Macros {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface Recipe {
  id: string;
  name: string;
  mealType: MealType;
  ingredients: string[];
  method: string[];
  macros: Macros;
  ingredientTags: string[];
}
