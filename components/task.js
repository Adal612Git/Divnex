import { statusColor } from './kanban.js';

export function createTaskRow(task, handlers = {}) {
  const row = document.createElement('div');
  row.className = 'relative bg-white rounded-md shadow p-3 mb-2 flex justify-between items-center text-sm cursor-pointer select-none';
  row.className = 'task-card relative flex justify-between items-center text-sm cursor-pointer select-none';
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
  status.className = 'text-gray-500 flex items-center space-x-2';
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