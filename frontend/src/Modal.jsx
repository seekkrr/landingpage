import React from 'react'
import cancelIcon from './assets/cancel.svg'

export default function Modal({ open, onClose, children }) {
  if (!open) return null
  return (
    <div className='modal-backdrop' onClick={onClose}>
      <div className='modal' onClick={(e) => e.stopPropagation()}>
        <button aria-label='Close' className='modal-close' onClick={onClose}>
          <img src={cancelIcon} alt='Close' />
        </button>
        {children}
      </div>
    </div>
  )
}
