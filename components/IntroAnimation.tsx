'use client';

import { useEffect, useRef, useState } from 'react';
import FJMonogram from './FJMonogram';
import styles from './IntroAnimation.module.css';

const INTRO_SESSION_KEY = 'efj-portfolio-intro-played-v2';
const INTRO_STATE_ATTRIBUTE = 'data-portfolio-intro-state';
const INTRO_COMPLETE_EVENT = 'portfolio-intro-complete';
const INTRO_FALLBACK_MS = 5000;

const introBootstrapScript = `
  (() => {
    const root = document.documentElement;

    try {
      const shouldSkip =
        window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
        window.sessionStorage.getItem('${INTRO_SESSION_KEY}') === 'true';

      if (shouldSkip) {
        root.setAttribute('${INTRO_STATE_ATTRIBUTE}', 'skip');
        return;
      }
    } catch {
      // If storage is unavailable, play the intro normally.
    }

    root.setAttribute('${INTRO_STATE_ATTRIBUTE}', 'play');

    let fallbackTimer;
    const finish = () => {
      window.clearTimeout(fallbackTimer);
      document.removeEventListener('animationend', handleAnimationEnd);

      try {
        window.sessionStorage.setItem('${INTRO_SESSION_KEY}', 'true');
      } catch {
        // The animation can still finish when storage is unavailable.
      }

      root.setAttribute('${INTRO_STATE_ATTRIBUTE}', 'done');
      window.dispatchEvent(new Event('${INTRO_COMPLETE_EVENT}'));
    };

    const handleAnimationEnd = (event) => {
      if (event.target instanceof Element && event.target.hasAttribute('data-portfolio-intro')) {
        finish();
      }
    };

    document.addEventListener('animationend', handleAnimationEnd);
    fallbackTimer = window.setTimeout(finish, ${INTRO_FALLBACK_MS});
  })();
`;

export default function IntroAnimation() {
  const [visible, setVisible] = useState(true);
  const introRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    const currentState = root.getAttribute(INTRO_STATE_ATTRIBUTE);
    const hideIntro = () => setVisible(false);

    if (currentState === 'skip' || currentState === 'done') {
      hideIntro();
      return;
    }

    if (currentState === 'play') {
      window.addEventListener(INTRO_COMPLETE_EVENT, hideIntro, { once: true });
      return () => window.removeEventListener(INTRO_COMPLETE_EVENT, hideIntro);
    }

    // This path handles client-side navigation to the homepage, where the
    // server-rendered bootstrap script is not executed by the browser.
    let hasPlayed = false;
    try {
      hasPlayed = window.sessionStorage.getItem(INTRO_SESSION_KEY) === 'true';
    } catch {
      // If storage is unavailable, play the intro normally.
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || hasPlayed) {
      root.setAttribute(INTRO_STATE_ATTRIBUTE, 'skip');
      hideIntro();
      return;
    }

    root.setAttribute(INTRO_STATE_ATTRIBUTE, 'play');
    const introElement = introRef.current;

    const finish = () => {
      window.clearTimeout(fallbackTimer);
      try {
        window.sessionStorage.setItem(INTRO_SESSION_KEY, 'true');
      } catch {
        // The animation can still finish when storage is unavailable.
      }
      root.setAttribute(INTRO_STATE_ATTRIBUTE, 'done');
      hideIntro();
    };

    const handleAnimationEnd = (event: AnimationEvent) => {
      if (event.target === introElement) finish();
    };

    introElement?.addEventListener('animationend', handleAnimationEnd);
    const fallbackTimer = window.setTimeout(finish, INTRO_FALLBACK_MS);

    return () => {
      window.clearTimeout(fallbackTimer);
      introElement?.removeEventListener('animationend', handleAnimationEnd);
    };
  }, []);

  return (
    <>
      <script
        id="portfolio-intro-bootstrap"
        dangerouslySetInnerHTML={{ __html: introBootstrapScript }}
      />
      {visible && (
        <div
          ref={introRef}
          className={styles.intro}
          data-portfolio-intro
          aria-hidden="true"
        >
          <div className={styles.identity}>
            <div className={styles.mark}>
              <FJMonogram size={80} backgroundColor="#FFFFFF" markColor="#B300EF" />
            </div>
            <div className={styles.wordmarkReveal}>
              <div className={styles.wordmark}>Emmanuel Folusho Joseph</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
