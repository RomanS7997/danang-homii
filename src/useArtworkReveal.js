import { useEffect, useRef } from 'react';

export function useArtworkReveal(enabled) {
  const root = useRef(null);
  useEffect(() => {
    if (!enabled || !root.current || !('IntersectionObserver' in window)) return;
    const artwork = [...root.current.querySelectorAll('[data-artwork]')];
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let observer;
    function observe() {
      observer?.disconnect();
      if (motion.matches) {
        artwork.forEach(el => { el.dataset.reveal = 'visible'; });
        return;
      }
      observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.dataset.reveal = 'visible';
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: .12 });
      artwork.forEach(el => {
        if (el.dataset.reveal !== 'visible') {
          el.dataset.reveal = 'waiting';
          observer.observe(el);
        }
      });
    }
    observe();
    motion.addEventListener('change', observe);
    return () => {
      observer?.disconnect();
      motion.removeEventListener('change', observe);
      artwork.forEach(el => { delete el.dataset.reveal; });
    };
  }, [enabled]);
  return root;
}
