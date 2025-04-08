import React from 'react';
import { Modal, Button } from 'react-bootstrap';

interface ConfirmModalProps {
  show: boolean;
  onHide: () => void;
  onConfirm: () => void;
  title: string;
  body: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  show,
  onHide,
  onConfirm,
  title,
  body,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'primary'
}) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{body}</Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onHide}>
          {cancelText}
        </Button>
        <Button variant={variant} onClick={onConfirm}>
          {confirmText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmModal; 