import { useMemo } from 'react';
import { usePlan } from '../context/PlanContext';
import { mergeAllIngredients, groupByCategory, formatQuantity } from '../utils/ingredientUtils';
import recipesData from '../data/recipes.json';
import styles from './ShoppingList.module.css';

const recipesMap = Object.fromEntries(recipesData.map(r => [r.id, r]));

export default function ShoppingList() {
  const { plannedMeals, checkedItems, hideBasics, setHideBasics, toggleChecked, clearChecked } = usePlan();

  const allIngredients = useMemo(
    () => mergeAllIngredients(plannedMeals, recipesMap),
    [plannedMeals]
  );

  const filtered = hideBasics ? allIngredients.filter(i => !i.pantryStaple) : allIngredients;
  const grouped = useMemo(() => groupByCategory(filtered), [filtered]);

  const totalItems = filtered.length;
  const checkedCount = filtered.filter(i => checkedItems[i.key]).length;

  function handleCopy() {
    const lines = grouped.flatMap(g => [
      `\n${g.label.toUpperCase()}`,
      ...g.items.map(i => `• ${formatQuantity(i.quantity, i.unit)} ${i.displayName}`),
    ]);
    navigator.clipboard.writeText(lines.join('\n').trim()).catch(() => {});
  }

  function handlePrint() {
    window.print();
  }

  if (plannedMeals.length === 0) {
    return (
      <div className={styles.empty}>
        <span className={styles.emptyEmoji}>🛒</span>
        <p>Add recipes to your plan to generate a shopping list.</p>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.toolbar}>
        <div className={styles.progress}>
          <span>{checkedCount}/{totalItems} items</span>
          {checkedCount > 0 && (
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${(checkedCount / totalItems) * 100}%` }}
              />
            </div>
          )}
        </div>

        <div className={styles.actions}>
          <label className={styles.toggle}>
            <input
              type="checkbox"
              checked={hideBasics}
              onChange={e => setHideBasics(e.target.checked)}
              aria-label="Hide pantry staples"
            />
            <span className={styles.toggleTrack} />
            <span className={styles.toggleLabel}>Hide basics</span>
          </label>

          {checkedCount > 0 && (
            <button className={`btn btn-ghost ${styles.actionBtn}`} onClick={clearChecked}>
              Clear checked
            </button>
          )}
          <button className={`btn btn-secondary ${styles.actionBtn}`} onClick={handleCopy} aria-label="Copy list">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
            </svg>
            Copy
          </button>
          <button className={`btn btn-secondary ${styles.actionBtn}`} onClick={handlePrint} aria-label="Print list">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <polyline points="6 9 6 2 18 2 18 9"/>
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
              <rect x="6" y="14" width="12" height="8"/>
            </svg>
            Print
          </button>
        </div>
      </div>

      <div className={styles.list}>
        {grouped.map(group => (
          <div key={group.category} className={styles.group}>
            <h3 className={styles.groupLabel}>{group.label}</h3>
            <ul className={styles.items}>
              {group.items.map(item => {
                const checked = !!checkedItems[item.key];
                return (
                  <li key={item.key}>
                    <button
                      className={`${styles.item} ${checked ? styles.checked : ''}`}
                      onClick={() => toggleChecked(item.key)}
                      aria-pressed={checked}
                      aria-label={`${checked ? 'Uncheck' : 'Check'} ${item.displayName}`}
                    >
                      <span className={styles.checkbox} aria-hidden="true">
                        {checked && (
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                        )}
                      </span>
                      <span className={styles.itemText}>
                        <span className={styles.itemQty}>{formatQuantity(item.quantity, item.unit)}</span>
                        <span className={styles.itemName}>{item.displayName}</span>
                      </span>
                      {item.pantryStaple && (
                        <span className={styles.staple} title="Pantry staple">★</span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
