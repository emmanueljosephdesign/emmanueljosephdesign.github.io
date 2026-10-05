'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import FJMonogram from './FJMonogram';
import styles from './IntroAnimation.module.css';

const INTRO_SESSION_KEY = 'efj-portfolio-intro-played-v2';
const INTRO_DURATION_MS = 3500;

export default function IntroAnimation() {
  const [visible, setVisible] = useState(true);
  const introRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const introElement = introRef.current;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasPlayed = window.sessionStorage.getItem(INTRO_SESSION_KEY) === 'true';

    if (prefersReducedMotion || hasPlayed) {
      const frame = window.requestAnimationFrame(() => setVisible(false));
      return () => window.cancelAnimationFrame(frame);
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    introElement?.setAttribute('data-active', 'true');

    const timer = window.setTimeout(() => {
      window.sessionStorage.setItem(INTRO_SESSION_KEY, 'true');
      document.body.style.overflow = previousOverflow;
      setVisible(false);
    }, INTRO_DURATION_MS);

    return () => {
      window.clearTimeout(timer);
      introElement?.removeAttribute('data-active');
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  if (!visible) return null;

  return (
    <div ref={introRef} className={styles.intro} aria-hidden="true">
      <div className={styles.identity}>
        <div className={styles.mark}>
          <FJMonogram size={80} backgroundColor="#FFFFFF" markColor="#B300EF" />
        </div>
        <div className={styles.wordmarkReveal}>
          <div className={styles.wordmark}>Emmanuel Folusho Joseph</div>
        </div>
      </div>
    </div>
  );
}
