import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { usePlan } from '../context/PlanContext';
import ServingsControl from '../components/ServingsControl';
import { formatQuantity, scaleQuantity, roundQuantity } from '../utils/ingredientUtils';
import recipesData from '../data/recipes.json';
import styles from './RecipePage.module.css';

const recipesMap = Object.fromEntries(recipesData.map(r => [r.id, r]));

const CATEGORY_LABELS = {
  vegetables: '🥦 Fresh Produce',
  fridge: '🧀 Fridge',
  tins: '🥫 Tins & Jars',
  dry: '🌾 Dry Goods',
  'herbs-spices': '🌿 Herbs & Spices',
  bakery: '🍞 Bakery',
  frozen: '🧊 Frozen',
  condiments: '🫙 Condiments',
};

function groupIngredients(ingredients) {
  const groups = {};
  for (const ing of ingredients) {
    const cat = ing.category ?? 'misc';
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(ing);
  }
  return groups;
}

export default function RecipePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const recipe = recipesMap[id];
  const { addMeal, removeMeal, isPlanned, updateServings, plannedMeals } = usePlan();

  const planned = isPlanned(id);
  const planEntry = plannedMeals.find(m => m.recipeId === id);
  const [localServings, setLocalServings] = useState(planEntry?.servings ?? recipe?.baseServings ?? 2);

  if (!recipe) {
    return (
      <main className={styles.notFound}>
        <p>Recipe not found.</p>
        <Link to="/" className="btn btn-primary">Back to recipes</Link>
      </main>
    );
  }

  function handleServingsChange(v) {
    setLocalServings(v);
    if (planned) updateServings(id, v);
  }

  function handlePlanToggle() {
    if (planned) {
      removeMeal(id);
    } else {
      addMeal(id, localServings);
    }
  }

  const scale = localServings / recipe.baseServings;
  const grouped = groupIngredients(recipe.ingredients);

  return (
    <main className={styles.page}>
      <div className="container">
        <div className={styles.breadcrumb}>
          <button className={`btn btn-ghost ${styles.backBtn}`} onClick={() => navigate(-1)} aria-label="Go back">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            Back
          </button>
        </div>

        <div className={styles.layout}>
          {/* Left: recipe content */}
          <article className={styles.content}>
            <div className={styles.hero} style={{ '--recipe-color': recipe.color }}>
              {recipe.image ? (
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className={styles.heroImg}
                />
              ) : (
                <span className={styles.heroEmoji} aria-hidden="true">{recipe.emoji}</span>
              )}
            </div>

            <header className={styles.header}>
              <div className={styles.tags}>
                {recipe.tags.map(tag => (
                  <span key={tag} className="tag">{tag.replace(/-/g, ' ')}</span>
                ))}
              </div>
              <h1 className={styles.title}>{recipe.title}</h1>
              <p className={styles.description}>{recipe.description}</p>

              <div className={styles.stats}>
                <div className={styles.stat}>
                  <span className={styles.statValue}>{recipe.prepTime}</span>
                  <span className={styles.statLabel}>prep min</span>
                </div>
                <div className={styles.statDivider} />
                <div className={styles.stat}>
                  <span className={styles.statValue}>{recipe.cookTime}</span>
                  <span className={styles.statLabel}>cook min</span>
                </div>
                <div className={styles.statDivider} />
                <div className={styles.stat}>
                  <span className={styles.statValue}>{recipe.totalTime}</span>
                  <span className={styles.statLabel}>total min</span>
                </div>
                <div className={styles.statDivider} />
                <div className={styles.stat}>
                  <span className={styles.statValue}>{recipe.calories}</span>
                  <span className={styles.statLabel}>kcal/serving</span>
                </div>
                <div className={styles.statDivider} />
                <div className={styles.stat}>
                  <span className={styles.statValue}>{recipe.fruitVegPortions}</span>
                  <span className={styles.statLabel}>veg portions</span>
                </div>
              </div>
            </header>

            {/* Ingredients */}
            <section className={styles.section} aria-labelledby="ingredients-heading">
              <div className={styles.sectionHeader}>
                <h2 id="ingredients-heading" className={styles.sectionTitle}>Ingredients</h2>
                <ServingsControl
                  value={localServings}
                  onChange={handleServingsChange}
                />
              </div>

              {Object.entries(grouped).map(([cat, items]) => (
                <div key={cat} className={styles.ingredientGroup}>
                  <h3 className={styles.ingredientGroupLabel}>
                    {CATEGORY_LABELS[cat] ?? cat}
                  </h3>
                  <ul className={styles.ingredientList}>
                    {items.map((ing, i) => {
                      const scaledQty = ing.quantity !== null
                        ? roundQuantity(scaleQuantity(ing.quantity, recipe.baseServings, localServings), ing.unit)
                        : null;
                      return (
                        <li key={i} className={`${styles.ingredient} ${ing.pantryStaple ? styles.stapleIng : ''}`}>
                          <span className={styles.ingredientQty}>
                            {formatQuantity(scaledQty, ing.unit)}
                          </span>
                          <span className={styles.ingredientName}>{ing.name}</span>
                          {ing.pantryStaple && <span className={styles.stapleTag}>staple</span>}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </section>

            {/* Equipment */}
            {recipe.equipment?.length > 0 && (
              <section className={styles.section} aria-labelledby="equipment-heading">
                <h2 id="equipment-heading" className={styles.sectionTitle}>You'll need</h2>
                <ul className={styles.equipmentList}>
                  {recipe.equipment.map((item, i) => (
                    <li key={i} className={styles.equipmentItem}>
                      <span aria-hidden="true">🍳</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Steps */}
            <section className={styles.section} aria-labelledby="steps-heading">
              <h2 id="steps-heading" className={styles.sectionTitle}>Method</h2>
              <ol className={styles.steps}>
                {recipe.steps.map((step, i) => (
                  <li key={i} className={styles.step}>
                    <span className={styles.stepNum} aria-hidden="true">{i + 1}</span>
                    <p className={styles.stepText}>{step}</p>
                  </li>
                ))}
              </ol>
            </section>

            {/* Tips */}
            {recipe.tips?.length > 0 && (
              <section className={styles.section} aria-labelledby="tips-heading">
                <h2 id="tips-heading" className={styles.sectionTitle}>Tips</h2>
                <ul className={styles.tips}>
                  {recipe.tips.map((tip, i) => (
                    <li key={i} className={styles.tip}>
                      <span aria-hidden="true">💡</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Storage */}
            {(recipe.storage || recipe.reheating) && (
              <section className={styles.section} aria-labelledby="storage-heading">
                <h2 id="storage-heading" className={styles.sectionTitle}>Storage & reheating</h2>
                <div className={styles.storageGrid}>
                  {recipe.storage && (
                    <div className={styles.storageCard}>
                      <span aria-hidden="true">🧊</span>
                      <div>
                        <strong>Storage</strong>
                        <p>{recipe.storage}</p>
                      </div>
                    </div>
                  )}
                  {recipe.reheating && (
                    <div className={styles.storageCard}>
                      <span aria-hidden="true">🔥</span>
                      <div>
                        <strong>Reheating</strong>
                        <p>{recipe.reheating}</p>
                      </div>
                    </div>
                  )}
                </div>
              </section>
            )}
          </article>

          {/* Right: sticky plan button */}
          <aside className={styles.sidebar}>
            <div className={styles.stickyCard}>
              <div className={styles.stickyEmoji} style={{ '--recipe-color': recipe.color }}>
                {recipe.emoji}
              </div>
              <h3 className={styles.stickyTitle}>{recipe.title}</h3>

              <div className={styles.stickyMeta}>
                <span>⏱ {recipe.totalTime} min</span>
                <span>🔥 {recipe.calories} kcal</span>
                <span>👤 {recipe.difficulty}</span>
              </div>

              <div className={styles.stickyServings}>
                <span className={styles.stickyLabel}>Servings</span>
                <ServingsControl value={localServings} onChange={handleServingsChange} />
              </div>

              <button
                className={`btn ${planned ? styles.btnRemove : 'btn-primary'} ${styles.planBtn}`}
                onClick={handlePlanToggle}
                aria-pressed={planned}
              >
                {planned ? (
                  <>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    In your plan
                  </>
                ) : (
                  <>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                    Add to plan
                  </>
                )}
              </button>

              {planned && (
                <Link to="/plan" className={`btn btn-secondary ${styles.viewPlanBtn}`}>
                  View plan & shopping list →
                </Link>
              )}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
