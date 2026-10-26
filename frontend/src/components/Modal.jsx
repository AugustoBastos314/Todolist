import { useEffect } from 'react';
import { CloseIcon } from './Icons.jsx';
import styles from './Modal.module.css';

export default function Modal({ title, onClose, children }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      className={styles.overlay}
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className={styles.dialog} role="dialog" aria-modal="true" aria-label={title}>
        <header className={styles.header}>
          <h2>{title}</h2>
          <button type="button" className={styles.close} onClick={onClose} aria-label="Fechar">
            <CloseIcon size={18} />
          </button>
        </header>
        {children}
      </div>
    </div>
  );
}
