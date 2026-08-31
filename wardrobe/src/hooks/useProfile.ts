import { useState } from 'react';
import { AgeBracket } from '../types';

const STORAGE_KEY = 'wardrobe_age_bracket';
const DEFAULT_BRACKET: AgeBracket = '40s';

export function useProfile() {
  const [ageBracket, setAgeBracketState] = useState<AgeBracket>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return (stored as AgeBracket) || DEFAULT_BRACKET;
  });

  const setAgeBracket = (bracket: AgeBracket) => {
    localStorage.setItem(STORAGE_KEY, bracket);
    setAgeBracketState(bracket);
  };

  return { ageBracket, setAgeBracket };
}
