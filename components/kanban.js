export function createKanbanColumn(title) {
  const column = document.createElement('div');
  column.className = 'kanban-column';
  const header = document.createElement('h3');
  header.textContent = title;
  column.appendChild(header);
  const list = document.createElement('div');
  list.className = 'task-list';
  column.appendChild(list);
  return { column, list };
}

export function createTaskCard(task) {
  const card = document.createElement('div');
  card.className = 'task-card';
  card.textContent = task.title;
  return card;
}
