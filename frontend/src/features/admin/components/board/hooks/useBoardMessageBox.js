import { useState, useCallback } from 'react';

export default function useBoardMessageBox() {
  const [messageBox, setMessageBox] = useState({
    show: false,
    message: '',
    type: 'alert',
    onConfirm: () => {},
    onCancel: () => {}
  });

  const showMessageBox = useCallback((message, type = 'alert', onConfirm = () => {}, onCancel = () => {}) => {
    setMessageBox({ show: true, message, type, onConfirm, onCancel });
  }, []);

  const hideMessageBox = useCallback(() => {
    setMessageBox({ show: false, message: '', type: 'alert', onConfirm: () => {}, onCancel: () => {} });
  }, []);

  return { messageBox, showMessageBox, hideMessageBox };
}
