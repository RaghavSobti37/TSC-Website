import { Reveal, type RevealPreset } from '@/components/animations/Reveal';
import { Parallax } from '@/components/animations/Parallax';
import { BlurReveal } from '@/components/animations/BlurReveal';
import type { ReactNode } from 'react';

export type WixMotionPreset = RevealPreset | 'parallax' | 'blur-reveal';

type WixMotionProps = {
  preset?: WixMotionPreset;
  delay?: number;
  parallaxSpeed?: number;
  className?: string;
  children: ReactNode;
};

/**
 * Maps animation-map.json presets → React components (Phase 7).
 */
export function WixMotion({
  preset = 'fade-up',
  delay = 0,
  parallaxSpeed = 1.2,
  className = '',
  children,
}: WixMotionProps) {
  if (preset === 'parallax') {
    return (
      <Parallax speed={parallaxSpeed} className={className}>
        {children}
      </Parallax>
    );
  }
  if (preset === 'blur-reveal') {
    return <div className={className}>{children}</div>;
  }
  const revealPreset: RevealPreset =
    preset === 'slide-left' ? 'slide-left' : preset === 'fade-in' ? 'fade-in' : 'fade-up';
  return (
    <Reveal preset={revealPreset} delay={delay} className={className}>
      {children}
    </Reveal>
  );
}

export { BlurReveal };
