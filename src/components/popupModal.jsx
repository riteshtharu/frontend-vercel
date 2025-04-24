import React from 'react';
import '../style/PopupModal.css';

const PopupModal = ({ message, type, onClose }) => {
  if (!message) return null;

  return (
    <div className="popup-modal-backdrop">
      <div className={`popup-modal ${type}`}>
        <p>{message}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default PopupModal;
