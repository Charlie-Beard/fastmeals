import { Link } from 'react-router-dom';
import { usePlan } from '../context/PlanContext';
import styles from './RecipeCard.module.css';

const DIFFICULTY_COLOUR = { Easy: '#27ae60', Medium: '#e67e22', Hard: '#e74c3c' };

export default function RecipeCard({ recipe }) {
  const { addMeal, removeMeal, isPlanned } = usePlan();
  const planned = isPlanned(recipe.id);

  function handlePlanToggle(e) {
    e.preventDefault();
    e.stopPropagation();
    if (planned) removeMeal(recipe.id);
    else addMeal(recipe.id, 2);
  }

  return (
    <article className={styles.card}>
      <Link to={`/recipe/${recipe.id}`} className={styles.link} aria-label={`View ${recipe.title}`}>
        <div className={styles.hero} style={{ '--recipe-color': recipe.color }}>
          <span className={styles.emoji} aria-hidden="true">{recipe.emoji}</span>
          <div className={styles.heroOverlay} />
        </div>

        <div className={styles.body}>
          <div className={styles.meta}>
            <span className={styles.time}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
              {recipe.totalTime} min
            </span>
            <span className={styles.difficulty} style={{ color: DIFFICULTY_COLOUR[recipe.difficulty] }}>
              {recipe.difficulty}
            </span>
            <span className={styles.cal}>{recipe.calories} kcal</span>
          </div>

          <h2 className={styles.title}>{recipe.title}</h2>
          <p className={styles.description}>{recipe.description}</p>

          <div className={styles.tags}>
            {recipe.tags.slice(0, 3).map(tag => (
              <span key={tag} className={`tag ${styles.tag}`}>{tag.replace(/-/g, ' ')}</span>
            ))}
          </div>
        </div>
      </Link>

      <div className={styles.footer}>
        <button
          className={`btn ${planned ? styles.btnRemove : styles.btnAdd}`}
          onClick={handlePlanToggle}
          aria-label={planned ? `Remove ${recipe.title} from plan` : `Add ${recipe.title} to plan`}
          aria-pressed={planned}
        >
          {planned ? (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Added
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Add to plan
            </>
          )}
        </button>
      </div>
    </article>
  );
}
