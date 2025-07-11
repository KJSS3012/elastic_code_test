import React from 'react';
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  CircularProgress
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
  loading?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  confirmColor = 'error',
  loading = false
}) => {
  const handleConfirm = () => {
    onConfirm();
    // Não fechar automaticamente - deixar o parent controlar
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
        <Button onClick={onClose} disabled={loading} color="primary">
          {cancelText}
        </Button>
        <Button onClick={handleConfirm} disabled={loading} color={confirmColor} variant="contained">
          {loading ? <CircularProgress size={20} /> : confirmText}
        </Button>
      </DialogActions>
    </AccessibleDialog>
  );
};

export default ConfirmationModal;
