import SVGCacheManager from '@/utils/SVGCacheManager';

/**
 * Initialize SVG Cache Manager on app start
 */
export const initSVGCache = async () => {
  try {
    await SVGCacheManager.init();
  } catch (error) {
    console.error('Failed to initialize SVG Cache:', error);
  }
};

/**
 * Preload all SVG assets
 */
export const preloadSVGs = async (svgList) => {
  if (!Array.isArray(svgList) || svgList.length === 0) {
    console.warn('SVG list is empty');
    return [];
  }

  try {
    const results = await Promise.allSettled(
      svgList.map((url) => SVGCacheManager.loadAndCache(url))
    );

    return results.map((result, index) => ({
      url: svgList[index],
      success: result.status === 'fulfilled',
      data: result.status === 'fulfilled' ? result.value : null,
      error: result.status === 'rejected' ? result.reason : null,
    }));
  } catch (error) {
    console.error('Error preloading SVGs:', error);
    return svgList.map((url) => ({
      url,
      success: false,
      data: null,
      error: error.message,
    }));
  }
};

/**
 * Load an image with automatic caching
 */
export const loadImage = async (src) => {
  try {
    return await SVGCacheManager.loadImage(src);
  } catch (error) {
    console.error(`Failed to load image: ${src}`, error);
    return null;
  }
};

/**
 * Get the natural aspect ratio of an image
 */
export const getImageRatio = (src, fallback = 1) => {
  return SVGCacheManager.getRatioFor(src, fallback);
};

/**
 * Calculate responsive size based on viewport
 */
export const calcResponsiveSize = (minVal, preferredVw, maxVal, viewportW, availableW) => {
  const preferred = (viewportW * preferredVw) / 100;
  let size = Math.max(minVal, Math.min(preferred, maxVal));

  if (Number.isFinite(availableW)) {
    size = Math.min(size, availableW);
    size = Math.max(1, size);
  }

  return size;
};

/**
 * Calculate element dimensions based on aspect ratio
 */
export const calculateDimensions = (width, ratio) => {
  return {
    width: Math.round(width),
    height: Math.max(1, Math.round(width / ratio)),
  };
};

/**
 * Determine which elements should be visible based on screen size
 */
export const computeVisibility = (width, height) => {
  const headingVisible = height >= 300;
  const bodyHiddenByHeight = height < 420;
  const bodyHiddenByShortDesktop = width > 768 && height < 576;
  const bodyVisible = !bodyHiddenByHeight && !bodyHiddenByShortDesktop && headingVisible;

  return {
    headingVisible,
    bodyVisible,
    logoVisible: true, // Logo is always visible
  };
};

/**
 * Get computed CSS variable value
 */
export const getCSSVariable = (variableName) => {
  if (typeof window === 'undefined') return null;
  return getComputedStyle(document.documentElement)
    .getPropertyValue(variableName)
    .trim();
};

/**
 * Get computed CSS variable as pixel value
 */
export const getCSSVariablePx = (variableName) => {
  const value = getCSSVariable(variableName);
  return parseFloat(value.replace('px', '')) || 0;
};

/**
 * Get all responsive dimensions from CSS variables
 */
export const getResponsiveDimensions = () => {
  const cssPx = (name) => getCSSVariablePx(name);
  const css = (name) => getCSSVariable(name);

  return {
    heroLeftMargin: cssPx('--hero-left-margin'),
    heroRightMargin: cssPx('--hero-right-margin'),
    heroLogoTop: cssPx('--hero-logo-top'),
    heroHeadingTop: cssPx('--hero-heading-top'),
    heroBodyTop: cssPx('--hero-body-top'),
    gapAfterLogo: cssPx('--gap-after-logo'),
    gapAfterHeading: cssPx('--gap-after-heading'),
    logoMax: cssPx('--logo-max-px'),
    logoMin: cssPx('--logo-min-px'),
    logoScale: parseFloat(css('--logo-scale')) || 1,
    headingMax: cssPx('--heading-max-px'),
    headingMin: cssPx('--heading-min-px'),
    bodyMax: cssPx('--body-max-px'),
    bodyMin: cssPx('--body-min-px'),
    headingVw: parseFloat(css('--heading-vw')) || 0,
    bodyVw: parseFloat(css('--body-vw')) || 0,
  };
};

/**
 * Throttle function execution
 */
export const throttle = (fn, wait) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), wait);
  };
};

/**
 * Get cache metrics for debugging
 */
export const getCacheMetrics = () => {
  return SVGCacheManager.getMetrics();
};

/**
 * Clear all caches (for testing/reset)
 */
export const clearAllCaches = () => {
  SVGCacheManager.clearCache();
};
