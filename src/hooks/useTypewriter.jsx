import { useState, useEffect, useRef } from 'react';

export function useTypewriter(text, { speed = 40, startDelay = 0, loop = false, onComplete } = {}) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  const indexRef = useRef(0);

  useEffect(() => {
    setDisplayed('');
    setDone(false);
    indexRef.current = 0;

    let typingInterval;
    const startTimeout = setTimeout(() => {
      typingInterval = setInterval(() => {
        indexRef.current += 1;
        setDisplayed(text.slice(0, indexRef.current));

        if (indexRef.current >= text.length) {
          clearInterval(typingInterval);
          setDone(true);
          onComplete?.();
          if (loop) {
            setTimeout(() => {
              indexRef.current = 0;
              setDisplayed('');
              setDone(false);
            }, 1500);
          }
        }
      }, speed);
    }, startDelay);

    return () => {
      clearTimeout(startTimeout);
      clearInterval(typingInterval);
    };
  }, [text, speed, startDelay, loop]);

  return { displayed, done };
}