import React from 'react';
import { Modal, Button } from 'react-bootstrap';

function ConfirmationModal({ show, onHide, onConfirm, title, message, variant }) {
  const getHeaderClass = () => {
    const classes = {
      primary: 'bg-primary text-white',
      success: 'bg-success text-white',
      danger: 'bg-danger text-white',
      warning: 'bg-warning',
      info: 'bg-info text-white'
    };
    return classes[variant] || '';
  };

  const getIcon = () => {
    const icons = {
      primary: '🚗',
      success: '✅',
      danger: '⚠️',
      warning: '⚠️',
      info: 'ℹ️'
    };
    return icons[variant] || '❓';
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton className={getHeaderClass()}>
        <Modal.Title>
          <span style={{ marginRight: '10px', fontSize: '1.2em' }}>{getIcon()}</span>
          {title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p style={{ fontSize: '1.1em', marginBottom: 0 }}>{message}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancelar
        </Button>
        <Button variant={variant} onClick={onConfirm}>
          Confirmar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ConfirmationModal; 