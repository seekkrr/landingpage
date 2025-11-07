import React from 'react';
import PropTypes from 'prop-types';

/**
 * Canvas Renderer Component
 * Renders hero overlay elements (logo, heading, body) on canvas
 */
const CanvasRenderer = ({ className = '', dataHideBody = 'false', canvasRef }) => {
  return (
    <div
      className={`canvas-layer ${className}`}
      id="canvasLayer"
      data-hide-body={dataHideBody}
    >
      <canvas ref={canvasRef} id="mainCanvas" />
    </div>
  );
};

CanvasRenderer.propTypes = {
  className: PropTypes.string,
  dataHideBody: PropTypes.string,
  canvasRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) })
  ]),
};

export default CanvasRenderer;
