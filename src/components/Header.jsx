import { Link, useLocation } from 'react-router-dom';
import { usePlan } from '../context/PlanContext';
import styles from './Header.module.css';

export default function Header() {
  const location = useLocation();
  const { plannedMeals } = usePlan();
  const count = plannedMeals.length;

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link to="/" className={styles.logo} aria-label="Weeknight Veg home">
          <span className={styles.logoEmoji} aria-hidden="true">🥗</span>
          <span className={styles.logoText}>Weeknight Veg</span>
        </Link>

        <nav className={styles.nav} aria-label="Main navigation">
          <Link
            to="/"
            className={`${styles.navLink} ${location.pathname === '/' ? styles.active : ''}`}
          >
            Recipes
          </Link>
          <Link
            to="/plan"
            className={`${styles.navLink} ${location.pathname === '/plan' ? styles.active : ''}`}
            aria-label={`My plan${count > 0 ? `, ${count} recipe${count !== 1 ? 's' : ''}` : ''}`}
          >
            My Plan
            {count > 0 && (
              <span className={styles.badge} aria-hidden="true">{count}</span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
