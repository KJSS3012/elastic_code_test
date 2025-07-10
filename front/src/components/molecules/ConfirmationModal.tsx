import React from 'react';
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography
} from '@mui/material';
import AccessibleDialog from './AccessibleDialog';

interface ConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: 'primary' | 'secondary' | 'error' | 'warning';
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  confirmColor = 'error'
}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <AccessibleDialog
      open={open}
      onClose={onClose}
      aria-labelledby="confirmation-dialog-title"
      aria-describedby="confirmation-dialog-description"
    >
      <DialogTitle id="confirmation-dialog-title">
        {title}
      </DialogTitle>
      <DialogContent>
        <Typography id="confirmation-dialog-description">
          {message}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          {cancelText}
        </Button>
        <Button onClick={handleConfirm} color={confirmColor} variant="contained">
          {confirmText}
        </Button>
      </DialogActions>
    </AccessibleDialog>
  );
};

export default ConfirmationModal;
