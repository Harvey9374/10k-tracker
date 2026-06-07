import { useState } from 'react';
import type { Recipe } from './types';
import allRecipes from './data/recipes.json';
import RecipeList from './components/RecipeList';
import RecipeDetail from './components/RecipeDetail';

const recipes = allRecipes as Recipe[];

export default function App() {
  const [selected, setSelected] = useState<Recipe | null>(null);

  if (selected) {
    return <RecipeDetail recipe={selected} onBack={() => setSelected(null)} />;
  }

  return <RecipeList recipes={recipes} onSelect={setSelected} />;
}
