import React, { useEffect, useRef, useCallback, useMemo } from "react";

/**
 * Custom hook for responsive canvas rendering with RAF optimization
 * Handles resize and orientation change events
 */
export const useCanvasRenderer = (renderFn) => {
    const rafRef = useRef(null);
    const lastTimeRef = useRef(0);
    const throttleDelayRef = useRef(80);

    const scheduleRender = useCallback(() => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => {
            const now = performance.now();
            if (now - lastTimeRef.current >= throttleDelayRef.current) {
                lastTimeRef.current = now;
                renderFn();
            }
        });
    }, [renderFn]);

    useEffect(() => {
        scheduleRender();

        const handleResize = () => scheduleRender();
        const handleOrientationChange = () => {
            setTimeout(scheduleRender, 120);
        };

        window.addEventListener("resize", handleResize, { passive: true });
        window.addEventListener("orientationchange", handleOrientationChange, {
            passive: true,
        });

        return () => {
            window.removeEventListener("resize", handleResize);
            window.removeEventListener(
                "orientationchange",
                handleOrientationChange
            );
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [scheduleRender]);

    return { scheduleRender };
};

/**
 * Custom hook for CSS variable reading
 */
export const useCSSVariable = (variableName) => {
    const getValue = useCallback(() => {
        const value = getComputedStyle(document.documentElement)
            .getPropertyValue(variableName)
            .trim();
        return value;
    }, [variableName]);

    const getValueAsNumber = useCallback(() => {
        const value = getValue();
        return parseFloat(value.replace("px", "")) || 0;
    }, [getValue]);

    return useMemo(
        () => ({ getValue, getValueAsNumber }),
        [getValue, getValueAsNumber]
    );
};

/**
 * Custom hook for media queries
 */
export const useMediaQuery = (query) => {
    const [matches, setMatches] = React.useState(() => {
        if (typeof window !== "undefined") {
            return window.matchMedia(query).matches;
        }
        return false;
    });

    React.useEffect(() => {
        const mediaQuery = window.matchMedia(query);
        const handler = (e) => setMatches(e.matches);

        mediaQuery.addEventListener("change", handler);
        return () => mediaQuery.removeEventListener("change", handler);
    }, [query]);

    return matches;
};

/**
 * Custom hook for device pixel ratio
 */
export const useDevicePixelRatio = () => {
    const [dpr, setDpr] = React.useState(() =>
        Math.min(window.devicePixelRatio || 1, 2)
    );

    React.useEffect(() => {
        // Use matchMedia for resolution changes
        const mediaQuery = window.matchMedia(
            `(resolution: ${window.devicePixelRatio}dppx)`
        );

        // Update handler with latest DPR
        const updateDPR = () => {
            const newDpr = Math.min(window.devicePixelRatio || 1, 2);
            if (newDpr !== dpr) {
                setDpr(newDpr);
            }
        };

        // Handle both change event and orientation changes
        mediaQuery.addEventListener("change", updateDPR);
        window.addEventListener("orientationchange", () => {
            // Small delay after orientation change to ensure DPR is updated
            setTimeout(updateDPR, 100);
        });

        return () => {
            mediaQuery.removeEventListener("change", updateDPR);
            window.removeEventListener("orientationchange", updateDPR);
        };
    }, [dpr]);

    return dpr;
};
