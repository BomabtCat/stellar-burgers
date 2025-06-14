import { FC, memo, useEffect } from 'react';
import ReactDOM from 'react-dom';

import { TModalProps } from './type';
import { ModalUI } from '@ui';

const _modalRoot = document.getElementById('modals');

export const Modal: FC<TModalProps> = memo(({ title, onClose, children }) => {
  useEffect(() => {
    const _handleEsc = (e: KeyboardEvent) => {
      e.key === 'Escape' && _handleClose();
    };

    document.addEventListener('keydown', _handleEsc);
    return () => {
      document.removeEventListener('keydown', _handleEsc);
    };
  }, []);

  const _handleClose = () => {
    onClose();
    localStorage.setItem('orderModalClosed', 'true');
  };

  return ReactDOM.createPortal(
    <ModalUI title={title} onClose={_handleClose}>
      {children}
    </ModalUI>,
    _modalRoot as HTMLDivElement
  );
});
