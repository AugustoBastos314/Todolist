import TaskItem from './TaskItem.jsx';
import styles from './TaskList.module.css';

export default function TaskList({ title, heading, tasks, lingering, onToggle, onEdit, onDelete, footer }) {
  return (
    <section className={styles.section}>
      {heading ?? (title && <h2 className={styles.heading}>{title} <span className={styles.count}>{tasks.length}</span></h2>)}
      {tasks.length > 0 && (
        <ul>
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              leaving={lingering?.has(task.id)}
              onToggle={onToggle}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </ul>
      )}
      {footer}
    </section>
  );
}
