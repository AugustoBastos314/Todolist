import { useEffect, useMemo, useRef, useState } from 'react';
import Sidebar from './components/Sidebar.jsx';
import SearchBar from './components/SearchBar.jsx';
import TaskList from './components/TaskList.jsx';
import UpcomingView from './components/UpcomingView.jsx';
import TaskModal from './components/TaskModal.jsx';
import ConfirmDialog from './components/ConfirmDialog.jsx';
import EmptyState from './components/EmptyState.jsx';
import { PanelIcon, PlusIcon } from './components/Icons.jsx';
import { useDebounce } from './hooks/useDebounce.js';
import { useTasks } from './hooks/useTasks.js';
import { compareTasks, todayISO } from './utils/dates.js';
import styles from './App.module.css';

const VIEW_TITLES = {
  inbox: 'Entrada',
  today: 'Hoje',
  upcoming: 'Em breve',
  completed: 'Concluídas',
};

const LINGER_MS = 650; // tempo que a tarefa concluída fica visível antes de sair da lista

export default function App() {
  const [view, setView] = useState('inbox');
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 400);
  const search = debouncedQuery.trim();
  const isSearching = search !== '';

  const { tasks, total, completed, loaded, loading, error, reload, create, update, toggle, remove } =
    useTasks(search);

  const [modal, setModal] = useState(null); // { type: 'create' | 'edit' | 'delete', task?, dueDate? }
  const [lingering, setLingering] = useState(() => new Set());
  const [toast, setToast] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const searchRef = useRef(null);
  const today = todayISO();

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(''), 4500);
    return () => clearTimeout(timer);
  }, [toast]);

  // ---- Organização: data mais próxima no topo ----
  const sorted = useMemo(() => [...tasks].sort(compareTasks), [tasks]);

  const visible = useMemo(() => {
    const stillShown = (t) => !t.completed || lingering.has(t.id);
    if (isSearching) return [...sorted.filter((t) => !t.completed), ...sorted.filter((t) => t.completed)];
    switch (view) {
      case 'completed':
        return sorted.filter((t) => t.completed || lingering.has(t.id));
      case 'today':
        return sorted.filter((t) => stillShown(t) && t.dueDate && t.dueDate <= today);
      case 'upcoming':
        return sorted.filter((t) => stillShown(t) && t.dueDate);
      default:
        return sorted.filter(stillShown);
    }
  }, [sorted, view, isSearching, lingering, today]);

  const counts = {
    inbox: total - completed,
    completed,
    today: isSearching ? 0 : tasks.filter((t) => !t.completed && t.dueDate && t.dueDate <= today).length,
  };

  // ---- Ações ----
  const run = async (fn) => {
    try {
      await fn();
    } catch (err) {
      setToast(err.message);
    }
  };

  const handleToggle = (task) => {
    setLingering((prev) => {
      const next = new Set(prev);
      if (next.has(task.id)) next.delete(task.id);
      else next.add(task.id);
      return next;
    });
    setTimeout(() => {
      setLingering((prev) => {
        const next = new Set(prev);
        next.delete(task.id);
        return next;
      });
    }, LINGER_MS);
    run(() => toggle(task));
  };

  const handleSubmit = async ({ title, dueDate }) => {
    if (modal.type === 'edit') await update(modal.task.id, { title, dueDate });
    else await create({ title, dueDate });
    setModal(null);
  };

  const handleDelete = () => {
    const { task } = modal;
    setModal(null);
    run(() => remove(task));
  };

  const closeModal = () => setModal(null);
  const handlers = {
    lingering,
    onToggle: handleToggle,
    onEdit: (task) => setModal({ type: 'edit', task }),
    onDelete: (task) => setModal({ type: 'delete', task }),
  };

  // ---- Conteúdo principal ----
  let body;
  if (!loaded) {
    body = <p className={styles.status}>Carregando tarefas…</p>;
  } else if (visible.length === 0) {
    if (isSearching) {
      body = <EmptyState title="Nenhuma tarefa encontrada." hint={`Nada corresponde a “${search}”.`} />;
    } else if (view === 'completed') {
      body = <EmptyState title="Nenhuma tarefa concluída ainda." hint="Marque uma tarefa para vê-la aqui." />;
    } else {
      body = <EmptyState title="You have no pending tasks." hint="Use o botão + para criar uma nova tarefa." />;
    }
  } else if (!isSearching && view === 'upcoming') {
    body = <UpcomingView tasks={visible} today={today} onAdd={(dueDate) => setModal({ type: 'create', dueDate })} {...handlers} />;
  } else if (!isSearching && view === 'today') {
    const overdue = visible.filter((t) => t.dueDate < today);
    const dueToday = visible.filter((t) => t.dueDate === today);
    body = (
      <>
        {overdue.length > 0 && <TaskList title="Atrasadas" tasks={overdue} {...handlers} />}
        {dueToday.length > 0 && <TaskList title={overdue.length > 0 ? 'Hoje' : undefined} tasks={dueToday} {...handlers} />}
      </>
    );
  } else {
    body = <TaskList tasks={visible} {...handlers} />;
  }

  return (
    <div className={styles.shell}>
      <Sidebar
        view={view}
        counts={counts}
        total={total}
        completed={completed}
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onSelect={(id) => {
          setView(id);
          setQuery('');
          setMenuOpen(false);
        }}
        onAdd={() => {
          setMenuOpen(false);
          setModal({ type: 'create' });
        }}
        onSearch={() => {
          setMenuOpen(false);
          searchRef.current?.focus();
        }}
      />

      <main className={styles.main}>
        <header className={styles.topbar}>
          <button type="button" className={styles.menu} onClick={() => setMenuOpen(true)} aria-label="Abrir menu">
            <PanelIcon size={20} />
          </button>
          <SearchBar ref={searchRef} value={query} onChange={setQuery} />
        </header>

        <section className={styles.content} aria-busy={loading}>
          <div className={styles.head}>
            <h1>{isSearching ? `Resultados para “${search}”` : VIEW_TITLES[view]}</h1>
            <p className={styles.summary}>
              {total} {total === 1 ? 'tarefa' : 'tarefas'} · {completed} {completed === 1 ? 'concluída' : 'concluídas'}
            </p>
          </div>

          {error && (
            <div className={styles.error} role="alert">
              <span>{error}</span>
              <button type="button" onClick={() => reload()}>Tentar novamente</button>
            </div>
          )}

          <div className={loading && loaded ? styles.refreshing : undefined}>{body}</div>
        </section>
      </main>

      <button type="button" className={styles.fab} onClick={() => setModal({ type: 'create' })} aria-label="Criar tarefa" title="Criar tarefa">
        <PlusIcon size={28} />
      </button>

      {(modal?.type === 'create' || modal?.type === 'edit') && (
        <TaskModal
          mode={modal.type}
          initial={modal.type === 'edit' ? modal.task : { dueDate: modal.dueDate }}
          onSubmit={handleSubmit}
          onClose={closeModal}
        />
      )}

      {modal?.type === 'delete' && (
        <ConfirmDialog
          title="Excluir tarefa"
          message={`Tem certeza de que deseja excluir “${modal.task.title}”? Essa ação não pode ser desfeita.`}
          confirmLabel="Excluir"
          onConfirm={handleDelete}
          onClose={closeModal}
        />
      )}

      {toast && (
        <div className={styles.toast} role="status">
          {toast}
        </div>
      )}
    </div>
  );
}
