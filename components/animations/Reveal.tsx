import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';

const EASE_WIX = 'cubic-bezier(0.22, 1, 0.36, 1)';
const EASE_WIX_SOFT = 'cubic-bezier(0.37, 0, 0.63, 1)';

export type RevealPreset = 'fade-up' | 'fade-in' | 'slide-up' | 'slide-left' | 'none';

export type RevealProps = {
  children: ReactNode;
  preset?: RevealPreset;
  delay?: number;
  duration?: number;
  className?: string;
  /** Intersection threshold 0–1 */
  threshold?: number;
  once?: boolean;
};

const HIDDEN: Record<RevealPreset, CSSProperties> = {
  'fade-up': { opacity: 0, transform: 'translate3d(0, 40px, 0)' },
  'fade-in': { opacity: 0, transform: 'none' },
  'slide-up': { opacity: 0, transform: 'translate3d(0, 48px, 0)' },
  'slide-left': { opacity: 0, transform: 'translate3d(48px, 0, 0)' },
  none: {},
};

/**
 * Replaces Wix data-motion-part scroll reveals (gG6uhp / XWeqiF class swaps).
 * Uses IntersectionObserver — no Thunderbolt.
 */
export function Reveal({
  children,
  preset = 'fade-up',
  delay = 0,
  duration = 0.75,
  className = '',
  threshold = 0.15,
  once = true,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(preset === 'none');

  useEffect(() => {
    if (preset === 'none') return;
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) io.disconnect();
        }
      },
      { threshold, rootMargin: '0px 0px -5% 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [preset, threshold, once]);

  const ease = preset === 'fade-in' ? EASE_WIX_SOFT : EASE_WIX;
  const style: CSSProperties = {
    transition: `opacity ${duration}s ${ease}, transform ${duration}s ${ease}`,
    transitionDelay: `${delay}ms`,
    ...(visible ? { opacity: 1, transform: 'none' } : HIDDEN[preset]),
  };

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}

/** @deprecated use Reveal */
export const FadeIn = Reveal;
