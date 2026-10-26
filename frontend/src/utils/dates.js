// Todas as datas trafegam como 'YYYY-MM-DD' e são comparadas como texto,
// evitando problemas de fuso horário.
const pad = (n) => String(n).padStart(2, '0');

export const toISO = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export function parseISO(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export const todayISO = () => toISO(new Date());

export function addDays(iso, n) {
  const d = parseISO(iso);
  d.setDate(d.getDate() + n);
  return toISO(d);
}

export const diffDays = (a, b) => Math.round((parseISO(a) - parseISO(b)) / 86400000);

export function nextMonday(iso) {
  const dow = parseISO(iso).getDay(); // 0 = domingo
  return addDays(iso, ((8 - dow) % 7) || 7);
}

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const weekdayFmt = new Intl.DateTimeFormat('pt-BR', { weekday: 'long' });
const shortFmt = new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'short' });
const fullFmt = new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' });

export const weekdayName = (iso) => capitalize(weekdayFmt.format(parseISO(iso)));

/** Rótulo e tom de cor do prazo, no estilo Todoist. */
export function describeDue(iso, today) {
  const diff = diffDays(iso, today);
  const sameYear = iso.slice(0, 4) === today.slice(0, 4);
  const dateLabel = (sameYear ? shortFmt : fullFmt).format(parseISO(iso));
  if (diff < 0) return { label: dateLabel, tone: 'overdue' };
  if (diff === 0) return { label: 'Hoje', tone: 'today' };
  if (diff === 1) return { label: 'Amanhã', tone: 'tomorrow' };
  if (diff < 7) return { label: weekdayName(iso), tone: 'week' };
  return { label: dateLabel, tone: 'later' };
}

/** Cabeçalho de dia da visão "Em breve": "26 de out." + "Hoje · Segunda-feira". */
export function describeDay(iso, today) {
  const diff = diffDays(iso, today);
  const rel = diff === 0 ? 'Hoje' : diff === 1 ? 'Amanhã' : null;
  return {
    short: shortFmt.format(parseISO(iso)),
    rest: [rel, weekdayName(iso)].filter(Boolean).join(' · '),
  };
}

export const isOverdue = (task, today) => !task.completed && !!task.dueDate && task.dueDate < today;

/** Data mais próxima primeiro; sem data por último; mais recentes primeiro como desempate. */
export function compareTasks(a, b) {
  if (a.dueDate && b.dueDate && a.dueDate !== b.dueDate) return a.dueDate < b.dueDate ? -1 : 1;
  if (a.dueDate && !b.dueDate) return -1;
  if (!a.dueDate && b.dueDate) return 1;
  return b.createdAt.localeCompare(a.createdAt) || b.id - a.id;
}
