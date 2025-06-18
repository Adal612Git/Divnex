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
  column.className = 'kanban-column flex-1 mr-4 last:mr-0 bg-white dark:bg-gray-800 p-4 rounded-xl shadow';
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
  card.className = 'task-card bg-white dark:bg-[#1e1e1e] rounded-lg shadow-md p-4 text-sm cursor-pointer select-none space-y-2 hover:shadow-lg hover:-translate-y-1 transition';
  card.draggable = true;
  card.dataset.id = task.id;
  card.style.borderLeft = `4px solid ${task.color || statusColor(task.status)}`;
  const title = document.createElement('div');
  title.textContent = task.title;
  card.appendChild(title);
  const info = document.createElement('div');
  info.className = 'flex justify-between items-center mt-2 text-xs text-gray-500';
  const left = document.createElement('div');
  if (task.dueDate) {
    const due = document.createElement('span');
    due.className = 'mr-2 cursor-pointer';
    due.textContent = `📅 ${task.dueDate}`;
    if (handlers.onEdit) due.onclick = e => { e.stopPropagation(); handlers.onEdit(task); };
    left.appendChild(due);
  }
  if (task.attachments && task.attachments.length) {
    const att = document.createElement('span');
    att.className = 'mr-2';
    att.textContent = `📎 ${task.attachments.length}`;
    left.appendChild(att);
  }
  if (task.subtasks && task.subtasks.length) {
    const done = task.subtasks.filter(s => s.done).length;
    const progress = document.createElement('span');
    progress.textContent = `☑️ ${done}/${task.subtasks.length}`;
    left.appendChild(progress);
  }
  info.appendChild(left);
  const add = document.createElement('span');
  add.className = 'ml-auto cursor-pointer';
  add.textContent = '➕';
  if (handlers.onEdit) add.onclick = e => { e.stopPropagation(); handlers.onEdit(task); };
  info.appendChild(add);
  card.appendChild(info);
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