import { useCallback, useEffect, useRef, useState } from 'react';

export function useHeroMapReveal(active, variant) {
  const [reduced, setReduced] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [mapOpen, setMapOpen] = useState(reduced);
  const [mapSettled, setMapSettled] = useState(reduced);
  const [replay, setReplay] = useState(0);
  const [intro, setIntro] = useState(true);
  const automatic = useRef(null);

  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    clearTimeout(automatic.current);
    setIntro(true);
    setMapOpen(reduced);
    setMapSettled(reduced);
    if (active && !reduced) automatic.current = setTimeout(() => setMapOpen(true), 560);
    return () => clearTimeout(automatic.current);
  }, [active, variant, replay, reduced]);

  useEffect(() => {
    setMapSettled(mapOpen && reduced);
    if (mapOpen && !reduced) {
      // Prices arrive in the final part of the 1280 ms panel reveal.
      const timer = setTimeout(() => setMapSettled(true), 820);
      return () => clearTimeout(timer);
    }
  }, [mapOpen, reduced, variant]);

  const setView = useCallback(open => {
    // A manual choice always takes precedence over the automatic introduction.
    clearTimeout(automatic.current);
    setIntro(false);
    if (!open) setMapSettled(false);
    setMapOpen(open);
  }, []);

  const restart = useCallback(() => {
    clearTimeout(automatic.current);
    setIntro(true);
    setMapOpen(reduced);
    setMapSettled(reduced);
    setReplay(value => value + 1);
  }, [reduced]);

  return { mapOpen, mapSettled, resetting: intro && !mapOpen, setMapOpen: setView, restart };
}
