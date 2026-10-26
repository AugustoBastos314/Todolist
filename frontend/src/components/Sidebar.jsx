import { CheckCircleIcon, InboxIcon, Logo, PlusIcon, SearchIcon, TodayIcon, UpcomingIcon } from './Icons.jsx';
import styles from './Sidebar.module.css';

const NAV = [
  { id: 'inbox', label: 'Entrada', Icon: InboxIcon },
  { id: 'today', label: 'Hoje', Icon: TodayIcon },
  { id: 'upcoming', label: 'Em breve', Icon: UpcomingIcon },
  { id: 'completed', label: 'Concluídas', Icon: CheckCircleIcon },
];

export default function Sidebar({ view, counts, total, completed, open, onSelect, onAdd, onSearch, onClose }) {
  const percent = total ? Math.round((completed / total) * 100) : 0;

  return (
    <>
      <div className={`${styles.scrim} ${open ? styles.scrimOpen : ''}`} onClick={onClose} />
      <aside className={`${styles.sidebar} ${open ? styles.open : ''}`} aria-label="Navegação">
        <div className={styles.brand}>
          <Logo />
          <span>Todolist</span>
        </div>

        <div className={styles.progress}>
          <strong>
            {completed} de {total} concluídas
          </strong>
          <div className={styles.bar} role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent}>
            <div className={styles.fill} style={{ width: `${percent}%` }} />
          </div>
          <span className={styles.total}>
            {total} {total === 1 ? 'tarefa' : 'tarefas'} no total
          </span>
        </div>

        <button type="button" className={styles.add} onClick={onAdd}>
          <span className={styles.plus}>
            <PlusIcon size={14} />
          </span>
          Adicionar tarefa
        </button>

        <nav className={styles.nav}>
          <button type="button" className={styles.item} onClick={onSearch}>
            <SearchIcon size={18} />
            <span className={styles.label}>Buscar</span>
          </button>
          {NAV.map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              className={`${styles.item} ${view === id ? styles.active : ''}`}
              aria-current={view === id ? 'page' : undefined}
              onClick={() => onSelect(id)}
            >
              <Icon size={18} />
              <span className={styles.label}>{label}</span>
              {counts[id] > 0 && <span className={styles.count}>{counts[id]}</span>}
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
}
