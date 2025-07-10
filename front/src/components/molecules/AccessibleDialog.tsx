import React, { useEffect } from 'react';
import { Dialog, type DialogProps } from '@mui/material';

interface AccessibleDialogProps extends DialogProps {
  children: React.ReactNode;
}

/**
 * Dialog wrapper que resolve problemas de acessibilidade com aria-hidden
 * Desabilita as funcionalidades problemáticas do Material-UI que causam conflitos de foco
 */
const AccessibleDialog: React.FC<AccessibleDialogProps> = ({
  children,
  open,
  onClose,
  ...props
}) => {
  // Gerenciar aria-hidden no elemento root quando modal abre/fecha
  useEffect(() => {
    const rootElement = document.getElementById('root');
    if (!rootElement) return;

    if (open) {
      // Remove aria-hidden quando modal está aberto para evitar conflitos
      rootElement.removeAttribute('aria-hidden');
    }

    return () => {
      // Cleanup na desmontagem ou quando o modal fechar
      if (!open) {
        rootElement.removeAttribute('aria-hidden');
      }
    };
  }, [open]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      // Desabilitar gerenciamento automático de foco para evitar conflitos
      disableAutoFocus={true}
      disableEnforceFocus={true}
      disableRestoreFocus={true}
      // Evitar problemas de aria-hidden com portais
      disablePortal={false}
      // Manter backdrop para funcionalidade normal
      hideBackdrop={false}
      // Não manter montado para melhor performance
      keepMounted={false}
      // Evitar conflitos de z-index e aria-hidden
      style={{ zIndex: 1300 }}
      {...props}
    >
      {children}
    </Dialog>
  );
};

export default AccessibleDialog;
