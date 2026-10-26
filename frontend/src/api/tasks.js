const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3333').replace(/\/$/, '');

// Converte o formato do backend (snake_case, completed 0/1) para o do frontend.
function normalize(row) {
  return {
    id: row.id,
    title: row.title,
    completed: Boolean(row.completed),
    dueDate: row.due_date ? String(row.due_date).slice(0, 10) : null,
    createdAt: row.created_at || '',
  };
}

async function request(path, { method = 'GET', body } = {}) {
  const options = { method };
  // Só envia Content-Type quando há corpo: o Fastify rejeita DELETE com JSON vazio.
  if (body !== undefined) {
    options.headers = { 'Content-Type': 'application/json' };
    options.body = JSON.stringify(body);
  }

  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, options);
  } catch {
    throw new Error(`Não foi possível conectar à API em ${BASE_URL}. O backend está rodando?`);
  }

  if (response.status === 204) return null;

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.message || `Erro inesperado (${response.status}).`);
  }
  return data;
}

export const tasksApi = {
  async list(search = '') {
    const query = search ? `?search=${encodeURIComponent(search)}` : '';
    const data = await request(`/api/tasks${query}`);
    return {
      tasks: data.tasks.map(normalize),
      total: Number(data.total) || 0,
      completed: Number(data.completed) || 0,
    };
  },
  async create({ title, dueDate }) {
    return normalize(await request('/api/tasks', { method: 'POST', body: { title, dueDate } }));
  },
  async update(id, patch) {
    return normalize(await request(`/api/tasks/${id}`, { method: 'PATCH', body: patch }));
  },
  async remove(id) {
    await request(`/api/tasks/${id}`, { method: 'DELETE' });
  },
};
