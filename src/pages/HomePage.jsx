import { useState, useMemo, useCallback } from 'react';
import RecipeCard from '../components/RecipeCard';
import SearchFilter from '../components/SearchFilter';
import recipesData from '../data/recipes.json';
import styles from './HomePage.module.css';

function applyFilters(recipes, { query, maxTime, activeTags, sort }) {
  let result = recipes;

  if (query) {
    const q = query.toLowerCase();
    result = result.filter(r =>
      r.title.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q) ||
      r.tags.some(t => t.includes(q))
    );
  }

  if (maxTime) {
    result = result.filter(r => r.totalTime <= maxTime);
  }

  if (activeTags.length > 0) {
    result = result.filter(r => activeTags.every(t => r.tags.includes(t)));
  }

  switch (sort) {
    case 'time':
      result = [...result].sort((a, b) => a.totalTime - b.totalTime);
      break;
    case 'calories':
      result = [...result].sort((a, b) => a.calories - b.calories);
      break;
    case 'alpha':
      result = [...result].sort((a, b) => a.title.localeCompare(b.title));
      break;
    default:
      break;
  }

  return result;
}

export default function HomePage() {
  const [filters, setFilters] = useState({
    query: '', maxTime: null, activeTags: [], sort: 'default'
  });
  const [shuffleSeed, setShuffleSeed] = useState(0);

  const filtered = useMemo(() => {
    const result = applyFilters(recipesData, filters);
    if (shuffleSeed === 0) return result;
    // Fisher-Yates with seed derived from shuffleSeed
    const arr = [...result];
    let s = shuffleSeed;
    for (let i = arr.length - 1; i > 0; i--) {
      s = (s * 1664525 + 1013904223) & 0xffffffff;
      const j = Math.abs(s) % (i + 1);
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, [filters, shuffleSeed]);

  const handleShuffle = useCallback(() => {
    setShuffleSeed(Math.floor(Math.random() * 1e9) + 1);
  }, []);

  return (
    <main className={styles.page}>
      <div className="container">
        <section className={styles.hero}>
          <h1 className={styles.heroTitle}>Quick vegetarian dinners</h1>
          <p className={styles.heroSub}>
            Browse {recipesData.length} weeknight recipes, build your plan, and get a smart shopping list.
          </p>
        </section>

        <div className={styles.filterWrap}>
          <SearchFilter onFilterChange={setFilters} onShuffle={handleShuffle} />
        </div>

        {filtered.length === 0 ? (
          <div className={styles.noResults}>
            <span className={styles.noResultsEmoji}>🔍</span>
            <p>No recipes match your filters. Try adjusting your search.</p>
          </div>
        ) : (
          <>
            <p className={styles.count}>
              {filtered.length} recipe{filtered.length !== 1 ? 's' : ''}
            </p>
            <div className={styles.grid}>
              {filtered.map(recipe => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
