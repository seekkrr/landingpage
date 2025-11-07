import React, {
    useEffect,
    useRef,
    useCallback,
    useState,
    useMemo,
} from "react";
import BackgroundSVG from "@/components/BackgroundSVG";
import CanvasRenderer from "@/components/CanvasRenderer";
import CTAButton from "@/components/CTAButton";
import Modal from "@/components/Modal";
import InterestForm from "@/components/InterestForm";
import {
    useCanvasRenderer,
    useMediaQuery,
    useDevicePixelRatio,
} from "@/hooks/useCanvasRender";
import {
    initSVGCache,
    preloadSVGs,
    loadImage,
    getImageRatio,
    calcResponsiveSize,
    computeVisibility,
    getResponsiveDimensions,
} from "@/utils/canvasUtils";
import "@/styles/index.css";

/**
 * Main App Component
 * Manages hero landing page with optimized canvas rendering
 */
const App = () => {
    const canvasRef = useRef(null);
    const [hideBody, setHideBody] = useState(false);
    const [backgroundReady, setBackgroundReady] = useState(false);

    // Modal state
    const [open, setOpen] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [errors, setErrors] = useState({});

    // Orientation detection
    const isPortrait = useMediaQuery("(orientation: portrait)");
    const dpr = useDevicePixelRatio();

    const svgPaths = useMemo(() => {
        // SVG asset paths
        return {
            logo: "/svg_components/logo.svg",
            heading: "/svg_components/Heading.svg",
            body: "/svg_components/Body.svg",
        };
    }, []);

    const svgList = useMemo(
        () => [
            "/composed-wrapper-landscape.svg",
            "/composed-wrapper-portrait.svg",
            "/svg_components/logo.svg",
            "/svg_components/Heading.svg",
            "/svg_components/Body.svg",
            "/svg_components/Rectangle 32.svg",
        ],
        []
    );

    /**
     * Render canvas with hero elements
     */
    const render = useCallback(async () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        try {
            const width = Math.max(1, Math.floor(window.innerWidth));
            const height = Math.max(1, Math.floor(window.innerHeight));

            // Set canvas resolution
            if (
                canvas.width !== width * dpr ||
                canvas.height !== height * dpr
            ) {
                canvas.width = width * dpr;
                canvas.height = height * dpr;
            }

            const ctx = canvas.getContext("2d", { alpha: true });
            if (!ctx) {
                throw new Error("Failed to get canvas context");
            }

            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.clearRect(0, 0, width, height);

            // Get dimensions
            const dims = getResponsiveDimensions();
            const { headingVisible, bodyVisible } = computeVisibility(
                width,
                height
            );

            // Center positioning for mobile
            const centerHeading = width < 600;
            const centerBody = width < 600 && height > width;

            // Load images in parallel
            const [logoImg, headingImg, bodyImg] = await Promise.all([
                loadImage(svgPaths.logo),
                loadImage(svgPaths.heading),
                loadImage(svgPaths.body),
            ]);

            if (!logoImg || !headingImg || !bodyImg) {
                throw new Error("Failed to load one or more SVG images");
            }

            // Calculate sizes
            const logoW = Math.max(
                dims.logoMin,
                Math.min(dims.logoMax, dims.logoScale * (width * 0.22))
            );
            const logoH = Math.max(
                1,
                logoW / getImageRatio(svgPaths.logo, 4.2)
            );

            const availHeadingW = Math.max(
                1,
                width - dims.heroLeftMargin - dims.heroRightMargin
            );
            const headingW0 = calcResponsiveSize(
                dims.headingMin,
                dims.headingVw,
                dims.headingMax,
                width,
                availHeadingW
            );
            const headingH = Math.max(
                1,
                headingW0 / getImageRatio(svgPaths.heading, 820 / 120)
            );
            const headingW = Math.min(headingW0, availHeadingW);

            const availBodyW = Math.max(
                1,
                width - dims.heroLeftMargin - dims.heroRightMargin
            );
            const bodyW0 = calcResponsiveSize(
                dims.bodyMin,
                dims.bodyVw,
                dims.bodyMax,
                width,
                availBodyW
            );
            const bodyH = Math.max(
                1,
                bodyW0 / getImageRatio(svgPaths.body, 560 / 80)
            );
            const bodyW = Math.min(bodyW0, availBodyW);

            // Draw logo
            const logoX = (width - logoW) / 2;
            const logoY = dims.heroLogoTop;
            ctx.drawImage(
                logoImg,
                Math.round(logoX),
                Math.round(logoY),
                Math.round(logoW),
                Math.round(logoH)
            );

            // Draw heading and body
            if (headingVisible) {
                const headingX = centerHeading
                    ? Math.round((width - headingW) / 2)
                    : Math.max(
                          0,
                          Math.min(dims.heroLeftMargin, width - headingW)
                      );
                const headingY = Math.max(
                    dims.heroHeadingTop,
                    logoY + logoH + dims.gapAfterLogo
                );
                ctx.drawImage(
                    headingImg,
                    headingX,
                    Math.round(headingY),
                    Math.round(headingW),
                    Math.round(headingH)
                );

                if (bodyVisible) {
                    const bodyX = centerBody
                        ? Math.round((width - bodyW) / 2)
                        : Math.max(
                              0,
                              Math.min(dims.heroLeftMargin, width - bodyW)
                          );
                    const bodyY = Math.max(
                        dims.heroBodyTop,
                        headingY + headingH + dims.gapAfterHeading
                    );
                    ctx.drawImage(
                        bodyImg,
                        Math.round(bodyX),
                        Math.round(bodyY),
                        Math.round(bodyW),
                        Math.round(bodyH)
                    );
                    setHideBody(false);
                } else {
                    setHideBody(true);
                }
            } else {
                setHideBody(true);
            }
        } catch (error) {
            console.error("Canvas rendering error:", error);
        }
    }, [dpr, svgPaths]);

    // Canvas rendering hook
    useCanvasRenderer(render);

    /**
     * Initialize SVG cache and preload assets
     */
    useEffect(() => {
        const initialize = async () => {
            try {
                await initSVGCache();

                const preloadResults = await preloadSVGs(svgList);

                // Check for critical errors
                const criticalAssets = [
                    svgPaths.logo,
                    svgPaths.heading,
                    svgPaths.body,
                ];
                const criticalLoaded = criticalAssets.every((asset) =>
                    preloadResults.some((r) => r.url === asset && r.success)
                );

                if (!criticalLoaded) {
                    console.warn("Some critical SVG assets failed to load");
                }
            } catch (error) {
                console.error("Initialization failed:", error);
            }
        };

        initialize();
    }, [svgList, svgPaths]);

    /**
     * Handle background SVG load
     */
    const handleBackgroundLoad = useCallback(() => {
        setBackgroundReady(true);
        render();
    }, [render]);

    return (
        <div className="main-container" id="appRoot">
            <BackgroundSVG
                orientation={isPortrait ? "portrait" : "landscape"}
                onLoad={handleBackgroundLoad}
            />
            <CanvasRenderer
                dataHideBody={hideBody ? "true" : "false"}
                canvasRef={canvasRef}
            />
            <CTAButton
                label="Show Interest"
                onClick={() => {
                    setOpen(true);
                    setErrors({});
                }}
                submitted={submitted}
            />
            <Modal open={open} onClose={() => setOpen(false)}>
                <InterestForm
                    setOpen={setOpen}
                    setSubmitted={setSubmitted}
                    errors={errors}
                    setErrors={setErrors}
                />
            </Modal>
        </div>
    );
};

export default App;
