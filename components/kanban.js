export function statusColor(status) {
  switch (status) {
    case 'In Progress':
      return '#fbbf24';
    case 'Done':
      return '#10b981';
    default:
      return '#94a3b8';
  }
}

export function createKanbanColumn(title) {
  const column = document.createElement('div');
  column.className = 'bg-gray-100 rounded-lg p-4 flex-1 mr-4 last:mr-0';
  const header = document.createElement('h3');
  header.className = 'font-semibold mb-2';
  header.textContent = title;
  column.appendChild(header);
  const list = document.createElement('div');
  list.className = 'space-y-2 min-h-[100px]';
  column.appendChild(list);
  return { column, list };
}

export function createTaskCard(task, handlers = {}) {
  const card = document.createElement('div');
  card.className = 'bg-white rounded-lg shadow p-3 text-sm cursor-pointer';
  card.style.borderLeft = `4px solid ${statusColor(task.status)}`;
  card.textContent = task.title;
  if (handlers.onClick) card.addEventListener('click', e => handlers.onClick(e, task));
  if (handlers.onContext) card.addEventListener('contextmenu', e => handlers.onContext(e, task));
  return card;
}