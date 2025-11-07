import React from "react";
import PropTypes from "prop-types";

/**
 * SVG Assets Preloader Component
 * Handles background SVG switching and optimization
 */
const BackgroundSVG = ({ orientation = "landscape", onLoad = () => {} }) => {
    const [isLoaded, setIsLoaded] = React.useState(false);
    const [error, setError] = React.useState(null);

    const getSVGSource = React.useCallback(() => {
        if (orientation === "portrait") {
            return "/composed-wrapper-portrait.svg";
        }
        return "/composed-wrapper-landscape.svg";
    }, [orientation]);

    const handleLoad = React.useCallback(() => {
        setIsLoaded(true);
        setError(null);
        onLoad();
    }, [onLoad]);

    const handleError = React.useCallback((err) => {
        setError(err);
        setIsLoaded(false);
        console.error("Background SVG failed to load:", err);
    }, []);

    if (error) {
        return (
            <div
                className="background-svg background-svg-fallback"
                aria-hidden="true"
            >
                {/* Gradient fallback */}
            </div>
        );
    }

    return (
        <object
            id="bgWrapper"
            data={getSVGSource()}
            alt="Background"
            onLoad={handleLoad}
            type="image/svg+xml"
            className="background-svg"
            aria-hidden="true"
            style={{
                opacity: isLoaded ? 1 : 0.5,
                transition: "opacity 0.3s ease-in-out",
            }}
            // Error handling moved to parent handler
            ref={(el) => {
                if (el) {
                    el.onerror = handleError;
                }
            }}
        ></object>
    );
};

BackgroundSVG.propTypes = {
    orientation: PropTypes.oneOf(["portrait", "landscape"]),
    onLoad: PropTypes.func,
};

export default BackgroundSVG;
