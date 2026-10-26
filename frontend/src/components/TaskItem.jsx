import { CheckIcon, PencilIcon, TrashIcon, TodayIcon } from './Icons.jsx';
import { describeDue, isOverdue, todayISO } from '../utils/dates.js';
import styles from './TaskItem.module.css';

const TONES = {
  overdue: styles.toneOverdue,
  today: styles.toneToday,
  tomorrow: styles.toneTomorrow,
  week: styles.toneWeek,
  later: styles.toneLater,
};

export default function TaskItem({ task, leaving, onToggle, onEdit, onDelete }) {
  const today = todayISO();
  const late = isOverdue(task, today);
  const due = task.dueDate ? describeDue(task.dueDate, today) : null;

  return (
    <li
      className={`${styles.item} ${task.completed ? styles.done : ''} ${leaving ? styles.leaving : ''}`}
    >
      <button
        type="button"
        role="checkbox"
        aria-checked={task.completed}
        aria-label={task.completed ? 'Marcar como pendente' : 'Concluir tarefa'}
        className={styles.check}
        onClick={() => onToggle(task)}
      >
        <CheckIcon size={12} />
      </button>

      <div className={styles.body}>
        <div className={styles.titleRow}>
          <span className={`${styles.title} ${late ? styles.late : ''}`}>{task.title}</span>
          {late && <span className={styles.badge}>Em atraso</span>}
        </div>
        {due && (
          <span className={`${styles.due} ${TONES[task.completed ? 'later' : due.tone]}`}>
            <TodayIcon size={12} />
            {due.label}
          </span>
        )}
      </div>

      <div className={styles.actions}>
        <button type="button" className={styles.iconBtn} onClick={() => onEdit(task)} aria-label="Editar tarefa" title="Editar">
          <PencilIcon size={16} />
        </button>
        <button type="button" className={`${styles.iconBtn} ${styles.danger}`} onClick={() => onDelete(task)} aria-label="Excluir tarefa" title="Excluir">
          <TrashIcon size={16} />
        </button>
      </div>
    </li>
  );
}
