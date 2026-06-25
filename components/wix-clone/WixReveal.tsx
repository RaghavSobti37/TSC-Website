import React, { useEffect, useRef, useState } from 'react';

export function WixReveal({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: 0 | 1 | 2 | 3;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setVisible(true);
      return;
    }

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const delayClass = delay ? `wix-hdc-reveal-delay-${delay}` : '';

  return (
    <div
      ref={ref}
      className={`wix-hdc-reveal ${delayClass} ${visible ? 'is-visible' : ''} ${className}`.trim()}
    >
      {children}
    </div>
  );
}
