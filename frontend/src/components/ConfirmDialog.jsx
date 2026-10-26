import Modal from './Modal.jsx';
import styles from './ConfirmDialog.module.css';

export default function ConfirmDialog({ title, message, confirmLabel, onConfirm, onClose }) {
  return (
    <Modal title={title} onClose={onClose}>
      <div className={styles.body}>
        <p className={styles.message}>{message}</p>
        <div className={styles.footer}>
          <button type="button" className={styles.cancel} onClick={onClose}>
            Cancelar
          </button>
          <button type="button" className={styles.danger} onClick={onConfirm} autoFocus>
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}
