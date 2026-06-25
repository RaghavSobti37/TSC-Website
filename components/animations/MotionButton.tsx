import type { ButtonHTMLAttributes, ReactNode } from 'react';

type MotionButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  as?: 'button' | 'a';
  href?: string;
  className?: string;
};

/** Wix StylableButton hover — scale + opacity (Phase 8). */
export function MotionButton({
  children,
  as = 'button',
  href,
  className = '',
  ...rest
}: MotionButtonProps) {
  const cls = `motion-btn ${className}`.trim();
  if (as === 'a' && href) {
    return (
      <a href={href} className={cls} {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {children}
      </a>
    );
  }
  return (
    <button type="button" className={cls} {...rest}>
      {children}
    </button>
  );
}
