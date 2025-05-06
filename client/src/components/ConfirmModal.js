import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const ConfirmModal = ({ show, title, message, onConfirm, onCancel }) => {
  return (
    <Modal show={show} onHide={onCancel} backdrop="static" keyboard={false} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title || "Подтверждение"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{message}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onCancel}>Отмена</Button>
        <Button variant="danger" onClick={onConfirm}>Подтверждаю</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmModal;
