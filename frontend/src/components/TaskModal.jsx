import { useEffect, useRef, useState } from 'react';
import Modal from './Modal.jsx';
import { addDays, nextMonday, todayISO } from '../utils/dates.js';
import styles from './TaskModal.module.css';

export default function TaskModal({ mode, initial, onSubmit, onClose }) {
  const [title, setTitle] = useState(initial?.title ?? '');
  const [dueDate, setDueDate] = useState(initial?.dueDate ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const titleRef = useRef(null);

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  const today = todayISO();
  const shortcuts = [
    { label: 'Hoje', value: today },
    { label: 'Amanhã', value: addDays(today, 1) },
    { label: 'Próxima semana', value: nextMonday(today) },
    { label: 'Sem data', value: '' },
  ];

  async function handleSubmit(e) {
    e.preventDefault();
    const clean = title.trim();
    if (!clean) {
      setError('O nome da tarefa é obrigatório.');
      titleRef.current?.focus();
      return;
    }
    setSaving(true);
    setError('');
    try {
      await onSubmit({ title: clean, dueDate: dueDate || null });
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  }

  const isEdit = mode === 'edit';

  return (
    <Modal title={isEdit ? 'Edit Task' : 'Create Task'} onClose={onClose}>
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <label className={styles.field}>
          <span className={styles.label}>Nome da tarefa</span>
          <input
            ref={titleRef}
            className={styles.title}
            value={title}
            maxLength={255}
            placeholder="Ex.: Ir na biblioteca segunda de tarde"
            onChange={(e) => {
              setTitle(e.target.value);
              if (error) setError('');
            }}
            aria-invalid={Boolean(error)}
          />
        </label>

        <div className={styles.field}>
          <span className={styles.label}>Data limite (opcional)</span>
          <div className={styles.dateRow}>
            <div className={styles.chips}>
              {shortcuts.map((s) => (
                <button
                  key={s.label}
                  type="button"
                  className={`${styles.chip} ${dueDate === s.value ? styles.chipActive : ''}`}
                  aria-pressed={dueDate === s.value}
                  onClick={() => setDueDate(s.value)}
                >
                  {s.label}
                </button>
              ))}
            </div>
            <input
              type="date"
              className={styles.date}
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              aria-label="Escolher data limite"
            />
          </div>
        </div>

        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}

        <footer className={styles.footer}>
          <button type="button" className={styles.cancel} onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" className={styles.submit} disabled={saving}>
            {saving ? 'Salvando…' : isEdit ? 'Salvar' : 'Criar tarefa'}
          </button>
        </footer>
      </form>
    </Modal>
  );
}
