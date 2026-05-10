import { createContext, useContext, useCallback } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const PlanContext = createContext(null);

export function PlanProvider({ children }) {
  const [plannedMeals, setPlannedMeals] = useLocalStorage('wv-plan', []);
  const [checkedItems, setCheckedItems] = useLocalStorage('wv-checked', {});
  const [hideBasics, setHideBasics] = useLocalStorage('wv-hide-basics', false);

  const addMeal = useCallback((recipeId, servings = 2) => {
    setPlannedMeals(prev => {
      const exists = prev.find(m => m.recipeId === recipeId);
      if (exists) return prev;
      return [...prev, { recipeId, servings }];
    });
  }, [setPlannedMeals]);

  const removeMeal = useCallback((recipeId) => {
    setPlannedMeals(prev => prev.filter(m => m.recipeId !== recipeId));
  }, [setPlannedMeals]);

  const updateServings = useCallback((recipeId, servings) => {
    setPlannedMeals(prev =>
      prev.map(m => m.recipeId === recipeId ? { ...m, servings } : m)
    );
  }, [setPlannedMeals]);

  const isPlanned = useCallback((recipeId) => {
    return plannedMeals.some(m => m.recipeId === recipeId);
  }, [plannedMeals]);

  const toggleChecked = useCallback((itemKey) => {
    setCheckedItems(prev => ({ ...prev, [itemKey]: !prev[itemKey] }));
  }, [setCheckedItems]);

  const clearChecked = useCallback(() => {
    setCheckedItems({});
  }, [setCheckedItems]);

  const clearPlan = useCallback(() => {
    setPlannedMeals([]);
    setCheckedItems({});
  }, [setPlannedMeals, setCheckedItems]);

  return (
    <PlanContext.Provider value={{
      plannedMeals,
      checkedItems,
      hideBasics,
      setHideBasics,
      addMeal,
      removeMeal,
      updateServings,
      isPlanned,
      toggleChecked,
      clearChecked,
      clearPlan,
    }}>
      {children}
    </PlanContext.Provider>
  );
}

export function usePlan() {
  const ctx = useContext(PlanContext);
  if (!ctx) throw new Error('usePlan must be used within PlanProvider');
  return ctx;
}
