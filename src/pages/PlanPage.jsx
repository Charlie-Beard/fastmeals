import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { usePlan } from '../context/PlanContext';
import PlanPanel from '../components/PlanPanel';
import ShoppingList from '../components/ShoppingList';
import ServingsControl from '../components/ServingsControl';
import recipesData from '../data/recipes.json';
import styles from './PlanPage.module.css';

export default function PlanPage() {
  const { plannedMeals, clearPlan, globalServings, setGlobalServings, addMeal, isPlanned } = usePlan();

  function handleAddRandom() {
    const unplanned = recipesData.filter(r => !isPlanned(r.id));
    if (unplanned.length === 0) return;
    const pick = unplanned[Math.floor(Math.random() * unplanned.length)];
    addMeal(pick.id, globalServings);
  }
  const count = plannedMeals.length;

  return (
    <main className={styles.page}>
      <Helmet>
        <title>My Meal Plan — Weeknight Veg</title>
        <meta name="description" content="Your weekly vegetarian meal plan and smart shopping list." />
        <meta name="robots" content="noindex" />
      </Helmet>
      <div className="container">
        <div className={styles.pageHeader}>
          <div>
            <h1 className={styles.title}>My Plan</h1>
            <p className={styles.subtitle}>
              {count === 0
                ? 'No meals planned yet'
                : `${count} meal${count !== 1 ? 's' : ''} planned`}
            </p>
          </div>
          <div className={styles.headerActions}>
            <ServingsControl
              value={globalServings}
              onChange={setGlobalServings}
              min={1}
              max={8}
            />
            {count > 0 && (
              <button
                className="btn btn-ghost"
                onClick={clearPlan}
                style={{ color: 'var(--red)', fontSize: '13px' }}
              >
                Clear plan
              </button>
            )}
            <button
              className="btn btn-secondary"
              onClick={handleAddRandom}
              disabled={recipesData.every(r => isPlanned(r.id))}
              title="Add a random recipe to your plan"
            >
              🎲 Random
            </button>
            <Link to="/" className="btn btn-secondary">
              + Add recipes
            </Link>
          </div>
        </div>

        <div className={styles.layout}>
          <section className={styles.mealsSection} aria-labelledby="meals-heading">
            <h2 id="meals-heading" className={styles.sectionTitle}>Meals</h2>
            <PlanPanel />
          </section>

          <section className={styles.listSection} aria-labelledby="shopping-heading">
            <h2 id="shopping-heading" className={styles.sectionTitle}>
              Shopping List
              {count > 0 && <span className={styles.mealCount}>from {count} recipe{count !== 1 ? 's' : ''}</span>}
            </h2>
            <ShoppingList />
          </section>
        </div>
      </div>
    </main>
  );
}
