import { useEffect, type ReactNode } from 'react';

type SmoothScrollProps = {
  children: ReactNode;
};

/**
 * Lenis smooth scroll — replaces Wix site scroll feel (Phase 10).
 * ponytail: dynamic import so SSR bundle stays lean
 */
export function SmoothScroll({ children }: SmoothScrollProps) {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let lenis: { destroy: () => void; raf: (t: number) => void } | null = null;
    let raf = 0;

    (async () => {
      const { default: Lenis } = await import('lenis');
      lenis = new Lenis({ duration: 1.1, smoothWheel: true });
      const loop = (time: number) => {
        lenis?.raf(time);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    })();

    return () => {
      cancelAnimationFrame(raf);
      lenis?.destroy();
    };
  }, []);

  return <>{children}</>;
}
