import styles from './ServingsControl.module.css';

export default function ServingsControl({ value, onChange, min = 1, max = 5 }) {
  return (
    <div className={styles.control} role="group" aria-label="Serving size">
      <button
        className={styles.btn}
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="Decrease servings"
      >
        −
      </button>
      <span className={styles.value} aria-live="polite">
        <span className={styles.number}>{value}</span>
        <span className={styles.label}>{value === 1 ? 'serving' : 'servings'}</span>
      </span>
      <button
        className={styles.btn}
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="Increase servings"
      >
        +
      </button>
    </div>
  );
}
