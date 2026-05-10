import { useState } from 'react';
import styles from './SearchFilter.module.css';

const TIME_OPTIONS = [
  { label: 'Any time', value: null },
  { label: '≤ 20 min', value: 20 },
  { label: '≤ 30 min', value: 30 },
  { label: '≤ 45 min', value: 45 },
];

const SORT_OPTIONS = [
  { label: 'Default', value: 'default' },
  { label: 'Quickest', value: 'time' },
  { label: 'Fewest calories', value: 'calories' },
  { label: 'A–Z', value: 'alpha' },
];

const ALL_TAGS = [
  'under-20-mins', 'under-30-mins', 'budget', 'high-protein',
  'vegan', 'kid-friendly', 'one-pan', 'spicy', 'mild',
  'healthy', 'batch-friendly', 'comfort-food',
  'indian', 'asian', 'mexican', 'mediterranean',
];

export default function SearchFilter({ onFilterChange, onShuffle }) {
  const [query, setQuery] = useState('');
  const [maxTime, setMaxTime] = useState(null);
  const [activeTags, setActiveTags] = useState([]);
  const [sort, setSort] = useState('default');
  const [showFilters, setShowFilters] = useState(false);

  function emit(updates) {
    const next = { query, maxTime, activeTags, sort, ...updates };
    onFilterChange(next);
  }

  function handleQuery(e) {
    setQuery(e.target.value);
    emit({ query: e.target.value });
  }

  function handleTime(val) {
    setMaxTime(val);
    emit({ maxTime: val });
  }

  function toggleTag(tag) {
    const next = activeTags.includes(tag)
      ? activeTags.filter(t => t !== tag)
      : [...activeTags, tag];
    setActiveTags(next);
    emit({ activeTags: next });
  }

  function handleSort(e) {
    setSort(e.target.value);
    emit({ sort: e.target.value });
  }

  function handleClear() {
    setQuery('');
    setMaxTime(null);
    setActiveTags([]);
    setSort('default');
    onFilterChange({ query: '', maxTime: null, activeTags: [], sort: 'default' });
  }

  const hasFilters = query || maxTime || activeTags.length > 0 || sort !== 'default';

  return (
    <div className={styles.wrapper}>
      <div className={styles.row}>
        <div className={styles.searchWrap}>
          <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="search"
            className={styles.search}
            placeholder="Search recipes…"
            value={query}
            onChange={handleQuery}
            aria-label="Search recipes"
          />
        </div>

        <button
          className={`btn btn-secondary ${styles.filterToggle} ${showFilters ? styles.filterActive : ''}`}
          onClick={() => setShowFilters(v => !v)}
          aria-expanded={showFilters}
          aria-controls="filter-panel"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <line x1="4" y1="6" x2="20" y2="6"/>
            <line x1="8" y1="12" x2="16" y2="12"/>
            <line x1="11" y1="18" x2="13" y2="18"/>
          </svg>
          Filter
          {activeTags.length > 0 || maxTime ? (
            <span className={styles.filterCount}>{activeTags.length + (maxTime ? 1 : 0)}</span>
          ) : null}
        </button>

        <select
          className={styles.sortSelect}
          value={sort}
          onChange={handleSort}
          aria-label="Sort recipes"
        >
          {SORT_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        <button
          className={`btn btn-secondary ${styles.shuffleBtn}`}
          onClick={onShuffle}
          aria-label="Shuffle recipes"
          title="Shuffle"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <polyline points="16 3 21 3 21 8"/>
            <line x1="4" y1="20" x2="21" y2="3"/>
            <polyline points="21 16 21 21 16 21"/>
            <line x1="15" y1="15" x2="21" y2="21"/>
          </svg>
        </button>
      </div>

      {showFilters && (
        <div id="filter-panel" className={styles.panel}>
          <div className={styles.filterSection}>
            <span className={styles.filterLabel}>Cook time</span>
            <div className={styles.pills}>
              {TIME_OPTIONS.map(o => (
                <button
                  key={String(o.value)}
                  className={`${styles.pill} ${maxTime === o.value ? styles.pillActive : ''}`}
                  onClick={() => handleTime(o.value)}
                  aria-pressed={maxTime === o.value}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.filterSection}>
            <span className={styles.filterLabel}>Tags</span>
            <div className={styles.pills}>
              {ALL_TAGS.map(tag => (
                <button
                  key={tag}
                  className={`${styles.pill} ${activeTags.includes(tag) ? styles.pillActive : ''}`}
                  onClick={() => toggleTag(tag)}
                  aria-pressed={activeTags.includes(tag)}
                >
                  {tag.replace(/-/g, ' ')}
                </button>
              ))}
            </div>
          </div>

          {hasFilters && (
            <button className={`btn btn-ghost ${styles.clearBtn}`} onClick={handleClear}>
              Clear all filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
