import React from "react";
import PropTypes from "prop-types";

/**
 * CTA Button Component
 * Call-to-action button with accessibility features
 */
const CTAButton = ({
    label = "Show Interest",
    onClick = () => {},
    className = "",
    submitted = false,
}) => {
    const handleClick = React.useCallback(() => {
        // Flash animation
        const button = document.getElementById("show-interest-cta");
        if (button) {
            button.style.opacity = "0.95";
            setTimeout(() => {
                button.style.opacity = "";
            }, 120);
        }
        onClick();
    }, [onClick]);

    const handleKeyDown = React.useCallback(
        (e) => {
            if (e.key === "Enter" || e.key === " ") {
                if (e.key === " ") e.preventDefault();
                handleClick();
            }
        },
        [handleClick]
    );

    return (
        <div className="overlay-cta">
            <button
                id="show-interest-cta"
                className={`cta ${className}`}
                onClick={handleClick}
                onKeyDown={handleKeyDown}
                aria-label={label}
                type="button"
                disabled={submitted}
            >
                {submitted ? "You have joined the waitlist" : "Show Interest"}
            </button>
        </div>
    );
};

CTAButton.propTypes = {
    label: PropTypes.string,
    onClick: PropTypes.func,
    className: PropTypes.string,
    submitted: PropTypes.bool,
};

export default CTAButton;
