import { useCallback, useEffect, useRef, useState } from 'react';
import { tasksApi } from '../api/tasks.js';

export function useTasks(search) {
  const [data, setData] = useState({ tasks: [], total: 0, completed: 0 });
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const lastRequest = useRef(0);

  const load = useCallback(
    async ({ silent = false } = {}) => {
      const id = ++lastRequest.current;
      if (!silent) setLoading(true);
      try {
        const result = await tasksApi.list(search);
        if (id !== lastRequest.current) return; // resposta antiga: descarta
        setData(result);
        setError('');
      } catch (err) {
        if (id === lastRequest.current) setError(err.message);
      } finally {
        if (id === lastRequest.current) {
          setLoading(false);
          setLoaded(true);
        }
      }
    },
    [search]
  );

  useEffect(() => {
    load();
  }, [load]);

  const refresh = () => load({ silent: true });

  const create = async (payload) => {
    await tasksApi.create(payload);
    await refresh();
  };

  const update = async (id, patch) => {
    await tasksApi.update(id, patch);
    await refresh();
  };

  // Atualização otimista: a interface responde na hora e o servidor confirma depois.
  const toggle = async (task) => {
    const next = !task.completed;
    setData((d) => ({
      ...d,
      tasks: d.tasks.map((t) => (t.id === task.id ? { ...t, completed: next } : t)),
      completed: d.completed + (next ? 1 : -1),
    }));
    try {
      await tasksApi.update(task.id, { completed: next });
      await refresh();
    } catch (err) {
      await refresh();
      throw err;
    }
  };

  const remove = async (task) => {
    setData((d) => ({
      tasks: d.tasks.filter((t) => t.id !== task.id),
      total: d.total - 1,
      completed: d.completed - (task.completed ? 1 : 0),
    }));
    try {
      await tasksApi.remove(task.id);
      await refresh();
    } catch (err) {
      await refresh();
      throw err;
    }
  };

  return { ...data, loaded, loading, error, reload: load, create, update, toggle, remove };
}
