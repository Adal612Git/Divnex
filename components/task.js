export function createTaskRow(task) {
  const row = document.createElement('div');
  row.className = 'task-row';
  row.textContent = task.title + ' - ' + task.status;
  return row;
}
