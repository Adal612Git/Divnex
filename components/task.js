import { statusColor } from './kanban.js';

export function createTaskRow(task) {
  const row = document.createElement('div');
  row.className = 'bg-white rounded-md shadow p-3 mb-2 flex justify-between items-center text-sm';
  row.style.borderLeft = `4px solid ${statusColor(task.status)}`;
  const title = document.createElement('span');
  title.textContent = task.title;
  const status = document.createElement('span');
  status.className = 'text-gray-500';
  status.textContent = task.status;
  row.appendChild(title);
  row.appendChild(status);
  return row;
}
