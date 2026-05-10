import { Link } from 'react-router-dom';
import { usePlan } from '../context/PlanContext';
import recipesData from '../data/recipes.json';
import styles from './PlanPanel.module.css';

const recipesMap = Object.fromEntries(recipesData.map(r => [r.id, r]));

export default function PlanPanel() {
  const { plannedMeals, removeMeal } = usePlan();

  if (plannedMeals.length === 0) {
    return (
      <div className={styles.empty}>
        <span className={styles.emptyEmoji}>📋</span>
        <p>No recipes added yet.</p>
        <Link to="/" className="btn btn-primary">Browse recipes</Link>
      </div>
    );
  }

  return (
    <ul className={styles.list}>
      {plannedMeals.map(({ recipeId }) => {
        const recipe = recipesMap[recipeId];
        if (!recipe) return null;
        return (
          <li key={recipeId} className={styles.meal}>
            <div
              className={styles.mealHero}
              style={{ '--recipe-color': recipe.color }}
              aria-hidden="true"
            >
              <span className={styles.mealEmoji}>{recipe.emoji}</span>
            </div>

            <div className={styles.mealInfo}>
              <Link to={`/recipe/${recipeId}`} className={styles.mealTitle}>
                {recipe.title}
              </Link>
              <span className={styles.mealMeta}>
                {recipe.totalTime} min · {recipe.difficulty}
              </span>
            </div>

            <div className={styles.mealActions}>
              <button
                className={`btn btn-ghost btn-icon ${styles.removeBtn}`}
                onClick={() => removeMeal(recipeId)}
                aria-label={`Remove ${recipe.title} from plan`}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                  <path d="M10 11v6M14 11v6"/>
                  <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                </svg>
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
