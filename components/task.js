import { statusColor } from './kanban.js';

export function createTaskRow(task, handlers = {}) {
  const row = document.createElement('div');
  row.className = 'bg-white rounded-md shadow p-3 mb-2 flex justify-between items-center text-sm cursor-pointer select-none';
  row.draggable = true;
  row.dataset.id = task.id;
  row.style.borderLeft = `4px solid ${task.color || statusColor(task.status)}`;
  const title = document.createElement('span');
  let text = task.title;
  if (task.subtasks && task.subtasks.length) {
    const done = task.subtasks.filter(s => s.done).length;
    text += ` (${done}/${task.subtasks.length})`;
  }
  title.textContent = text;
  const status = document.createElement('span');
  status.className = 'text-gray-500';
  status.textContent = task.status;
  row.appendChild(title);
  row.appendChild(status);
  if (handlers.onClick) row.addEventListener('click', e => handlers.onClick(e, task));
  if (handlers.onContext) row.addEventListener('contextmenu', e => handlers.onContext(e, task));
  if (handlers.onDragStart) row.addEventListener('dragstart', e => handlers.onDragStart(e, task));
  if (handlers.onDrop) row.addEventListener('drop', e => handlers.onDrop(e, task));
  if (handlers.onDragOver) row.addEventListener('dragover', e => handlers.onDragOver(e, task));
  return row;
}