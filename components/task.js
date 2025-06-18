import { statusColor } from './kanban.js';

export function createTaskRow(task, handlers = {}) {
  const row = document.createElement('div');
  row.className = 'task-card mb-2 flex justify-between items-center text-sm cursor-pointer select-none';
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
  status.className = 'text-gray-500 dark:text-gray-400 flex items-center space-x-2';
  const stText = document.createElement('span');
  stText.textContent = task.status;
  status.appendChild(stText);
  if (task.dueDate) {
    const due = document.createElement('span');
    due.textContent = `📅 ${task.dueDate}`;
    status.appendChild(due);
  }
  if (task.attachments && task.attachments.length) {
    const att = document.createElement('span');
    att.textContent = `📎 ${task.attachments.length}`;
    status.appendChild(att);
  }
  row.appendChild(title);
  row.appendChild(status);
  if (handlers.onClick) row.addEventListener('click', e => handlers.onClick(e, task));
  if (handlers.onContext) row.addEventListener('contextmenu', e => handlers.onContext(e, task));
  if (handlers.onDragStart) row.addEventListener('dragstart', e => handlers.onDragStart(e, task));
  if (handlers.onDrop) row.addEventListener('drop', e => handlers.onDrop(e, task));
  if (handlers.onDragOver) row.addEventListener('dragover', e => handlers.onDragOver(e, task));
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
    row.appendChild(actions);
  }
  return row;
}