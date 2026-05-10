import { useState, useRef } from 'react';
import styles from './DiceButton.module.css';

const DOTS = {
  1: [[50, 50]],
  2: [[30, 30], [70, 70]],
  3: [[30, 30], [50, 50], [70, 70]],
  4: [[30, 30], [70, 30], [30, 70], [70, 70]],
  5: [[30, 30], [70, 30], [50, 50], [30, 70], [70, 70]],
  6: [[30, 28], [70, 28], [30, 50], [70, 50], [30, 72], [70, 72]],
};

function DieFace({ value }) {
  return (
    <svg width="22" height="22" viewBox="0 0 100 100" aria-hidden="true">
      <rect x="4" y="4" width="92" height="92" rx="20" fill="currentColor" opacity="0.08" />
      <rect x="4" y="4" width="92" height="92" rx="20" fill="none" stroke="currentColor" strokeWidth="7" />
      {DOTS[value].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="9" fill="currentColor" />
      ))}
    </svg>
  );
}

export default function DiceButton({ onClick, disabled }) {
  const [face, setFace] = useState(6);
  const [rolling, setRolling] = useState(false);
  const timerRef = useRef(null);

  function handleClick() {
    if (rolling || disabled) return;
    setRolling(true);

    let tick = 0;
    const totalTicks = 10;
    // Intervals slow down as the die "settles"
    const delays = [50, 60, 70, 80, 90, 100, 120, 150, 180, 220];

    function nextFace() {
      setFace(Math.ceil(Math.random() * 6));
      tick++;
      if (tick < totalTicks) {
        timerRef.current = setTimeout(nextFace, delays[tick]);
      } else {
        setRolling(false);
        onClick();
      }
    }

    timerRef.current = setTimeout(nextFace, delays[0]);
  }

  return (
    <button
      className={`${styles.btn} ${rolling ? styles.rolling : ''}`}
      onClick={handleClick}
      disabled={disabled}
      title="Add a random recipe"
      aria-label="Add a random recipe to your plan"
    >
      <DieFace value={face} />
    </button>
  );
}
