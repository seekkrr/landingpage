import React from 'react';
import cancelIcon from '../assets/cancel.svg';
import PropTypes from 'prop-types';

/**
 * Modal Component
 * A reusable accessible modal dialog
 * 
 * @param {boolean} open - Controls modal visibility
 * @param {function} onClose - Callback when modal should close
 * @param {ReactNode} children - Modal content
 */
const Modal = ({ open, onClose, children }) => {
  // Handle escape key press
  React.useEffect(() => {
    if (!open) return;

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);

    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div 
      className="modal-backdrop" 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        className="modal" 
        onClick={(e) => e.stopPropagation()}
        role="document"
      >
        <button 
          aria-label="Close modal" 
          className="modal-close" 
          onClick={onClose}
          type="button"
        >
          <img src={cancelIcon} alt="" aria-hidden="true" />
        </button>
        {children}
      </div>
    </div>
  );
}

Modal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  children: PropTypes.node
};

export default Modal;