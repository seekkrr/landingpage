// Production-ready SVG Cache Manager
// Handles caching, preloading, and optimization of SVG assets

class SVGCacheManager {
    constructor() {
        this.VERSION = "1.0.0";
        this.cacheName = `svg-cache-v${this.VERSION}`;
        this.memoryCache = new Map();
        this.imageCache = new Map();
        this.naturalRatioCache = new Map();
        this.metrics = {
            hits: 0,
            misses: 0,
            errors: 0,
            loadTimes: [],
        };
        this.maxRetries = 3;
        this.retryDelay = 1000;
        this.maxMemoryEntries = 50;
        this.debug = process.env.NODE_ENV !== "production";
        this.isInitialized = false;
        this.loadingIndicator = null;
        this.cache = null;
    }

    log(...args) {
        if (this.debug || window.location.hostname === 'localhost') {
            console.log("[SVGCache]", ...args);
        }
    }

    error(...args) {
        if (this.debug || window.location.hostname === 'localhost') {
            console.error("[SVGCache]", ...args);
        }
        this.metrics.errors++;
    }

    async init() {
        if (this.isInitialized) return;

        try {
            this.debug || window.location.hostname === 'localhost';
            // Clear old cache versions
            if ("caches" in window) {
                const keys = await caches.keys();
                const oldCaches = keys.filter(
                    (key) =>
                        key.startsWith("svg-cache-") && key !== this.cacheName
                );
                await Promise.all(oldCaches.map((key) => caches.delete(key)));
                this.cache = await caches.open(this.cacheName);
            }

            // Initialize loading indicator
            this.createLoadingIndicator();

            await this.preloadAll();

            // Start periodic cleanup
            this.startPeriodicCleanup();

            // Add orientation change handler
            this.setupOrientationHandler();

            this.isInitialized = true;
            this.log("SVG Cache initialized successfully");
        } catch (error) {
            this.error("Initialization failed:", error);
            this.cache = null;
        }
    }

    createLoadingIndicator() {
        const indicator = document.createElement("div");
        indicator.id = "svg-loading-indicator";
        indicator.style.cssText = `
          position: fixed;
          top: 10px;
          right: 10px;
          background: rgba(0,0,0,0.7);
          color: white;
          padding: 8px;
          border-radius: 4px;
          font-size: 14px;
          display: none;
          z-index: 9999;
        `;
        document.body.appendChild(indicator);
        this.loadingIndicator = indicator;
    }

    async preloadAll() {
        const svgFiles = [
            "composed-wrapper-landscape.svg",
            "composed-wrapper-portrait.svg",
            "svg_components/background_landscape.svg",
            "svg_components/background_portrait.svg",
            "svg_components/background.svg",
            "svg_components/Body.svg",
            "svg_components/Heading.svg",
            "svg_components/logo.svg",
            "svg_components/Rectangle 32.svg",
        ];

        this.updateLoadingIndicator(`Loading SVGs: 0/${svgFiles.length}`);
        const startTime = performance.now();

        let loaded = 0;
        const loadPromises = svgFiles.map(async (url) => {
            await this.loadAndCache(url);
            loaded++;
            this.updateLoadingIndicator(
                `Loading SVGs: ${loaded}/${svgFiles.length}`
            );
        });

        await Promise.all(loadPromises);

        const totalTime = performance.now() - startTime;
        this.log(`All SVGs preloaded in ${totalTime.toFixed(2)}ms`);
        this.hideLoadingIndicator();
    }

    updateLoadingIndicator(text) {
        if (this.loadingIndicator) {
          this.loadingIndicator.style.display = 'none';
          this.loadingIndicator.textContent = text;
        }
    }

    hideLoadingIndicator() {
        if (this.loadingIndicator) {
          this.loadingIndicator.style.display = 'none';
        }
    }

    async loadAndCache(url, retryCount = 0) {
        const startTime = performance.now();

        try {
            // Check memory cache first
            if (this.memoryCache.has(url)) {
                this.metrics.hits++;
                this.log(`${url} loaded from memory cache`);
                return this.memoryCache.get(url);
            }

            // Check Cache API
            if (this.cache) {
                const cachedResponse = await this.cache.match(url);
                if (cachedResponse) {
                    const svgContent = await cachedResponse.text();
                    this.memoryCache.set(url, svgContent);
                    this.log(`${url} loaded from Cache API`);
                    return svgContent;
                }
            }

            this.metrics.misses++;

            // Fetch from network
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const svgContent = await response.text();

            // Validate SVG
            if (!this.isValidSVG(svgContent)) {
                throw new Error("Invalid SVG content");
            }

            // Optimize and cache
            const optimizedSVG = this.optimizeSVG(svgContent);

            // Store in Cache API
            if (this.cache) {
                await this.cache.put(url, new Response(optimizedSVG));
            }

            // Store in memory cache with memory management
            this.manageMemoryCache();
            this.memoryCache.set(url, optimizedSVG);

            // Record metrics
            const loadTime = performance.now() - startTime;
            this.metrics.loadTimes.push({ url, time: loadTime });

            this.log(`${url} fetched and cached in ${loadTime.toFixed(2)}ms`);
            return optimizedSVG;
        } catch (error) {
            this.error(`Error loading SVG ${url}:`, error);

            // Retry mechanism
            if (retryCount < this.maxRetries) {
                this.log(
                    `Retrying ${url} (attempt ${retryCount + 1}/${
                        this.maxRetries
                    })`
                );
                await new Promise((resolve) =>
                    setTimeout(resolve, this.retryDelay * (retryCount + 1))
                );
                return this.loadAndCache(url, retryCount + 1);
            }

            return null;
        }
    }

    isValidSVG(content) {
        if (typeof content !== "string") return false;
        return content.includes("<svg") && content.includes("</svg>");
    }

    optimizeSVG(svgContent) {
        // Remove comments and unnecessary whitespace
        let optimized = svgContent.replace(/<!--[\s\S]*?-->/g, "");
        optimized = optimized.replace(/>\s+</g, "><");
        return optimized;
    }

    manageMemoryCache() {
        if (this.memoryCache.size >= this.maxMemoryEntries) {
            const entries = Array.from(this.memoryCache.entries());
            const oldestEntries = entries.slice(
                0,
                Math.floor(this.maxMemoryEntries * 0.2)
            );
            oldestEntries.forEach(([key]) => this.memoryCache.delete(key));
        }
    }

    startPeriodicCleanup() {
        setInterval(() => {
          this.cleanupMetrics();
        }, 3600000); // Cleanup every hour
    }

    cleanupMetrics() {
        // Keep only recent load times
        this.metrics.loadTimes = this.metrics.loadTimes.slice(-100);
    }

    setupOrientationHandler() {
        window.addEventListener('orientationchange', () => {
            this.log('Orientation changed, ensuring critical SVGs are in memory');
            // Pre-warm orientation-specific SVGs
            const orientation = window.orientation === 0 ? 'portrait' : 'landscape';
            this.preloadOrientationSpecificSVGs(orientation);
        });
    }

    async preloadOrientationSpecificSVGs(orientation) {
        const criticalSVGs = Array.from(this.memoryCache.keys())
            .filter(key => key.includes(orientation));
        await Promise.all(criticalSVGs.map(url => this.loadAndCache(url)));
    }

    async getSVG(url) {
        const svg = await this.loadAndCache(url);
        if (!svg && this.debug) {
            this.error(`Failed to load SVG: ${url}`);
        }
        return svg;
    }

    async loadImage(src) {
        return new Promise((resolve, reject) => {
            if (this.imageCache.has(src)) {
                resolve(this.imageCache.get(src));
                return;
            }

            const img = new Image();
            img.crossOrigin = "anonymous";
            img.decoding = "async";
            img.loading = "eager";

            img.addEventListener(
                "load",
                () => {
                    this.imageCache.set(src, img);
                    if (!this.naturalRatioCache.has(src)) {
                        const ratio =
                            (img.naturalWidth || 1) / (img.naturalHeight || 1);
                        this.naturalRatioCache.set(src, ratio);
                    }
                    resolve(img);
                },
                { once: true }
            );

            img.addEventListener(
                "error",
                () => reject(new Error(`Failed to load image: ${src}`)),
                { once: true }
            );

            img.src = src;
        });
    }

    getRatioFor(src, fallback) {
        return this.naturalRatioCache.get(src) || fallback;
    }

    getMetrics() {
        return {
            ...this.metrics,
            cacheSize: this.memoryCache.size,
            // imageCacheSize: this.imageCache.size,
            averageLoadTime: this.calculateAverageLoadTime(),
        };
    }

    calculateAverageLoadTime() {
        if (this.metrics.loadTimes.length === 0) return 0;
        const sum = this.metrics.loadTimes.reduce(
            (acc, { time }) => acc + time,
            0
        );
        return sum / this.metrics.loadTimes.length;
    }

    clearCache() {
        this.memoryCache.clear();
        this.imageCache.clear();
        this.naturalRatioCache.clear();
        this.metrics = {
            hits: 0,
            misses: 0,
            errors: 0,
            loadTimes: [],
        };
        this.log("All caches cleared");
    }
}

export default new SVGCacheManager();
