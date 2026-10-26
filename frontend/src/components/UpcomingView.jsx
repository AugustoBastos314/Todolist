import { useMemo } from 'react';
import TaskList from './TaskList.jsx';
import { PlusIcon } from './Icons.jsx';
import { addDays, describeDay } from '../utils/dates.js';
import styles from './UpcomingView.module.css';

const DAYS_AHEAD = 14;

export default function UpcomingView({ tasks, today, onAdd, ...handlers }) {
  const days = useMemo(() => Array.from({ length: DAYS_AHEAD }, (_, i) => addDays(today, i)), [today]);
  const lastDay = days[days.length - 1];

  const overdue = tasks.filter((t) => t.dueDate < today);
  const later = tasks.filter((t) => t.dueDate > lastDay);

  return (
    <>
      {overdue.length > 0 && <TaskList title="Atrasadas" tasks={overdue} {...handlers} />}

      {days.map((day) => {
        const { short, rest } = describeDay(day, today);
        return (
          <TaskList
            key={day}
            heading={
              <h2 className={styles.day}>
                {short} <span>{rest}</span>
              </h2>
            }
            tasks={tasks.filter((t) => t.dueDate === day)}
            footer={
              <button type="button" className={styles.add} onClick={() => onAdd(day)}>
                <PlusIcon size={16} /> Adicionar tarefa
              </button>
            }
            {...handlers}
          />
        );
      })}

      {later.length > 0 && <TaskList title="Mais tarde" tasks={later} {...handlers} />}
    </>
  );
}
