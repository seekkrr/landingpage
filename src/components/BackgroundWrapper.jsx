import React from 'react';

/**
 * BackgroundWrapper
 * Maintains image aspect ratio with up to a configurable mild non-uniform stretch.
 * If required distortion exceeds the threshold, switches to contain with white padding.
 */
export default function BackgroundWrapper({
  src,
  threshold = 0.1,
  className = '',
  style = {},
  children,
}) {
  const containerRef = React.useRef(null);
  const [mode, setMode] = React.useState('contain'); // 'contain' | 'stretch'

  // Cache intrinsic size
  const intrinsicRef = React.useRef({ width: 0, height: 0 });

  const recalc = React.useCallback(() => {
    const el = containerRef.current;
    const { width: iw, height: ih } = intrinsicRef.current;
    if (!el || !iw || !ih) return;
    const rect = el.getBoundingClientRect();
    const cw = Math.max(1, rect.width);
    const ch = Math.max(1, rect.height);

    const scaleX = cw / iw;
    const scaleY = ch / ih;
    const distortion = Math.abs(scaleX / scaleY - 1);

    if (distortion <= threshold) {
      setMode('stretch');
    } else {
      setMode('contain');
    }
  }, [threshold]);

  // Load image to get intrinsic size
  React.useEffect(() => {
    if (!src) return;
    let cancelled = false;
    const img = new Image();
    img.onload = () => {
      if (cancelled) return;
      intrinsicRef.current = { width: img.naturalWidth || img.width, height: img.naturalHeight || img.height };
      recalc();
    };
    img.src = src;
    return () => {
      cancelled = true;
    };
  }, [src, recalc]);

  // Recalculate on resize
  React.useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(() => recalc());
    ro.observe(containerRef.current);
    return () => {
      ro.disconnect();
    };
  }, [recalc]);

  const backgroundStyles = {
    backgroundImage: src ? `url(${src})` : undefined,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: mode === 'stretch' ? '100% 100%' : 'contain',
    backgroundColor: '#ffffff',
  };

  return (
    <section
      ref={containerRef}
      className={`background-wrapper ${className}`.trim()}
      style={{ ...backgroundStyles, ...style }}
    >
      <div className="background-content">
        {children}
      </div>
    </section>
  );
}


