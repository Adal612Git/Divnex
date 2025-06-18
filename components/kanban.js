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
  column.className = 'kanban-column bg-gray-100 rounded-lg p-4 flex-1 mr-4 last:mr-0';
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
  card.className = 'relative bg-white rounded-lg shadow p-3 text-sm cursor-pointer select-none';
  card.draggable = true;
  card.dataset.id = task.id;
  card.style.borderLeft = `4px solid ${task.color || statusColor(task.status)}`;
  const title = document.createElement('div');
  title.textContent = task.title;
  card.appendChild(title);
  if (task.subtasks && task.subtasks.length) {
    const progress = document.createElement('div');
    const done = task.subtasks.filter(s => s.done).length;
    progress.className = 'text-xs text-gray-500';
    progress.textContent = `${done}/${task.subtasks.length}`;
    card.appendChild(progress);
  }
  if (handlers.onClick) card.addEventListener('click', e => handlers.onClick(e, task));
  if (handlers.onContext) card.addEventListener('contextmenu', e => handlers.onContext(e, task));
  if (handlers.onDragStart) card.addEventListener('dragstart', e => handlers.onDragStart(e, task));
  if (handlers.onEdit || handlers.onDelete) {
    const actions = document.createElement('div');
    actions.className = 'absolute top-1 right-1 space-x-1';
    if (handlers.onEdit) {
      const edit = document.createElement('button');
      edit.textContent = '✎';
      edit.className = 'text-blue-500';
      edit.onclick = e => { e.stopPropagation(); handlers.onEdit(task); };
      actions.appendChild(edit);
    }
    if (handlers.onDelete) {
      const del = document.createElement('button');
      del.textContent = '✕';
      del.className = 'text-red-500';
      del.onclick = e => { e.stopPropagation(); handlers.onDelete(task); };
      actions.appendChild(del);
    }
    card.appendChild(actions);
  }
  return card;
}