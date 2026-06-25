import { useEffect, useRef, useState, type ImgHTMLAttributes, type ReactNode } from 'react';

type BlurRevealProps = {
  src: string;
  alt?: string;
  className?: string;
  imgClassName?: string;
  children?: ReactNode;
} & Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'>;

/**
 * Replaces wow-image[data-animate-blur] → img[data-load-done].
 */
export function BlurReveal({ src, alt = '', className = '', imgClassName = '', children, ...rest }: BlurRevealProps) {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = imgRef.current;
    if (img?.complete) setLoaded(true);
  }, []);

  if (children) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className={className}>
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        className={`blur-reveal-img ${imgClassName}`.trim()}
        style={{
          filter: loaded ? 'none' : 'blur(9px)',
          transition: 'filter 0.8s ease-in',
        }}
        {...rest}
      />
    </div>
  );
}
