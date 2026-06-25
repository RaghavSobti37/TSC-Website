import { useEffect, useRef, type ReactNode } from 'react';

type ParallaxProps = {
  children: ReactNode;
  speed?: number;
  className?: string;
};

/**
 * Replaces wow-image parallaxSpeed (TB ImageParallax / BackgroundParallax).
 */
export function Parallax({ children, speed = 1.2, className = '' }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (speed === 1) return;
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const vh = window.innerHeight;
        if (rect.bottom < 0 || rect.top > vh) return;
        const p = (vh - rect.top) / (vh + rect.height);
        const shift = (p - 0.5) * 48 * (speed - 1);
        el.style.transform = `translate3d(0, ${shift.toFixed(2)}px, 0)`;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [speed]);

  return (
    <div ref={ref} className={className} style={{ willChange: speed !== 1 ? 'transform' : undefined }}>
      {children}
    </div>
  );
}
