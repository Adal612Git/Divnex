import { createKanbanColumn, createTaskCard } from "./components/kanban.js";
import { createTaskRow } from "./components/task.js";
class Task {
  constructor({ id, title, description = '', status = 'To Do', priority = 'Media', type = 'General', estimate = 1, color = '', subtasks = [] }) {
    this.id = id || Date.now();
    this.title = title;
    this.description = description;
    this.status = status;
    this.priority = priority;
    this.type = type;
    this.estimate = estimate;
    this.color = color;
    this.subtasks = subtasks.map(s => ({ id: s.id || Date.now(), title: s.title, done: !!s.done }));
  }
  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      status: this.status,
      priority: this.priority,
      type: this.type,
      estimate: this.estimate,
      color: this.color,
      subtasks: this.subtasks
    };
  }
  static fromJSON(obj) {
    return new Task(obj);
  }
}

class Project {
  constructor({ id, name, tasks = [] }) {
    this.id = id || Date.now();
    this.name = name;
    this.tasks = tasks.map(t => Task.fromJSON(t));
  }
  toJSON() {
    return { id: this.id, name: this.name, tasks: this.tasks.map(t => t.toJSON()) };
  }
  static fromJSON(obj) {
    return new Project(obj);
  }
}

const App = {
  data: { projects: [] },
  currentView: 'list',
  currentProject: null,
  contextTask: null,
  modalTask: null,
  modalSubtasks: [],
  draggedTask: null,
  load() {
    const saved = localStorage.getItem('divnexData');
    if (saved) {
      const parsed = JSON.parse(saved);
      this.data.projects = parsed.projects.map(p => Project.fromJSON(p));
    } else {
      this.data.projects = [
        new Project({
          name: 'Proyecto Demo',
          tasks: [
            new Task({ title: 'Tarea de ejemplo', status: 'To Do' }),
            new Task({ title: 'Otra tarea', status: 'In Progress' })
          ]
        })
      ];
      this.save();
    }
    if (this.data.projects.length) this.currentProject = this.data.projects[0];
  },
  save() {
    localStorage.setItem('divnexData', JSON.stringify({ projects: this.data.projects.map(p => p.toJSON()) }));
  },
  renderProjectList() {
    const list = document.getElementById('projectList');
    list.innerHTML = '';
    this.data.projects.forEach(p => {
      const li = document.createElement('li');
      li.className = 'flex items-center justify-between cursor-pointer px-2 py-1 rounded hover:bg-gray-100';
      const span = document.createElement('span');
      span.textContent = p.name;
      span.onclick = () => { this.currentProject = p; this.renderView(); };
      const actions = document.createElement('div');
      const edit = document.createElement('button');
      edit.textContent = '✎';
      edit.className = 'text-blue-500 ml-2';
      edit.onclick = e => { e.stopPropagation(); this.renameProject(p); };
      const del = document.createElement('button');
      del.textContent = '✕';
      del.className = 'text-red-500 ml-1';
      del.onclick = e => { e.stopPropagation(); this.deleteProject(p); };
      actions.appendChild(edit);
      actions.appendChild(del);
      li.appendChild(span);
      li.appendChild(actions);
      list.appendChild(li);
    });
  },
  renderView() {
    const main = document.getElementById('mainView');
    main.innerHTML = '';
    if (!this.currentProject) return;
    if (this.currentView === 'kanban') {
      this.renderKanban(main, this.currentProject);
    } else if (this.currentView === 'list') {
      this.renderList(main, this.currentProject);
    } else {
      main.textContent = 'Vista calendario no implementada';
    }
  },
  renderList(container, project) {
    project.tasks.forEach(task => {
      container.appendChild(createTaskRow(task, {
        onClick: (_e, t) => this.editTask(t),
        onContext: (e, t) => this.showContextMenu(e, t),
        onDragStart: (e, t) => this.startDrag(e, t),
        onDragOver: e => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; },
        onDrop: (e, t) => {
          e.preventDefault();
          const idx = project.tasks.findIndex(x => x.id === t.id);
          this.dropList(idx);
        },
        onDelete: t => { this.removeTask(t); this.renderView(); }
      }));
    });
    container.ondragover = e => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; };
    container.ondrop = e => {
      e.preventDefault();
      if (e.target === container) this.dropList(-1);
    };
  },
  renderKanban(container, project) {
    const board = document.createElement('div');
    board.className = 'flex gap-4';
    const statuses = ['To Do', 'In Progress', 'Done'];
    statuses.forEach(status => {
      const { column, list } = createKanbanColumn(status);
      list.ondragenter = e => {
        e.preventDefault();
        column.classList.add('highlight-drop-target');
      };
      list.ondragover = e => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
      };
      list.ondragleave = () => {
        column.classList.remove('highlight-drop-target');
      };
      list.ondrop = e => {
        e.preventDefault();
        column.classList.remove('highlight-drop-target');
        this.dropKanban(status);
      };
      project.tasks.filter(t => t.status === status).forEach(t => {
        list.appendChild(createTaskCard(t, {
          onClick: (_e, task) => this.editTask(task),
          onContext: (e, task) => this.showContextMenu(e, task),
          onDragStart: (e, task) => this.startDrag(e, task),
          onDelete: task => { this.removeTask(task); this.renderView(); }
        }));
      });
      board.appendChild(column);
    });
    container.appendChild(board);
  },
  editTask(task) {
    this.showTaskModal(task);
  },
  addTask() {
    this.showTaskModal(null);
  },
  showTaskModal(task) {
    this.modalTask = task;
    document.getElementById('taskModalTitle').textContent = task ? 'Editar Tarea' : 'Nueva Tarea';
    document.getElementById('taskTitle').value = task ? task.title : '';
    document.getElementById('taskStatus').value = task ? task.status : 'To Do';
    document.getElementById('taskColor').value = task && task.color ? task.color : '#94a3b8';
    this.modalSubtasks = task ? task.subtasks.map(s => ({ ...s })) : [];
    this.renderSubtasks();
    document.getElementById('taskModal').classList.remove('hidden');
  },
  closeTaskModal() {
    document.getElementById('taskModal').classList.add('hidden');
    this.modalTask = null;
  },
  renderSubtasks() {
    const list = document.getElementById('subtaskList');
    list.innerHTML = '';
    this.modalSubtasks.forEach((s, idx) => {
      const li = document.createElement('li');
      li.className = 'flex items-center';
      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.checked = s.done;
      cb.onchange = () => { s.done = cb.checked; };
      const span = document.createElement('span');
      span.className = 'flex-1 ml-2';
      span.textContent = s.title;
      const del = document.createElement('button');
      del.textContent = '✕';
      del.className = 'text-red-500 ml-2';
      del.onclick = () => { this.modalSubtasks.splice(idx, 1); this.renderSubtasks(); };
      li.appendChild(cb);
      li.appendChild(span);
      li.appendChild(del);
      list.appendChild(li);
    });
  },
  saveTaskFromModal() {
    const title = document.getElementById('taskTitle').value.trim();
    if (!title) return;
    const status = document.getElementById('taskStatus').value;
    const color = document.getElementById('taskColor').value;
    if (this.modalTask) {
      this.modalTask.title = title;
      this.modalTask.status = status;
      this.modalTask.color = color;
      this.modalTask.subtasks = this.modalSubtasks;
    } else {
      const task = new Task({ title, status, color, subtasks: this.modalSubtasks });
      this.currentProject.tasks.push(task);
    }
    this.save();
    this.renderView();
    this.closeTaskModal();
  },
  showContextMenu(e, task) {
    e.preventDefault();
    this.contextTask = task;
    const menu = document.getElementById('contextMenu');
    menu.style.left = `${e.pageX}px`;
    menu.style.top = `${e.pageY}px`;
    menu.classList.remove('hidden');
  },
  hideContextMenu() {
    document.getElementById('contextMenu').classList.add('hidden');
  },
  removeTask(task) {
    if (!task || !this.currentProject) return;
    this.currentProject.tasks = this.currentProject.tasks.filter(t => t !== task);
    this.save();
  },
  deleteTask() {
    if (!this.contextTask) return;
    this.removeTask(this.contextTask);
    this.contextTask = null;
    this.renderView();
    this.hideContextMenu();
  },
  addProject() {
    const name = prompt('Nombre del proyecto');
    if (!name) return;
    const project = new Project({ name });
    this.data.projects.push(project);
    this.save();
    this.renderProjectList();
  },
  exportJSON() {
    const dataStr = JSON.stringify({ projects: this.data.projects.map(p => p.toJSON()) }, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'divnex-data.json';
    a.click();
    URL.revokeObjectURL(url);
  },
  importJSON(file) {
    const reader = new FileReader();
    reader.onload = e => {
      const parsed = JSON.parse(e.target.result);
      this.data.projects = parsed.projects.map(p => Project.fromJSON(p));
      this.save();
      this.renderProjectList();
      this.renderView();
    };
    reader.readAsText(file);
  },
  renameProject(project) {
    const name = prompt('Nuevo nombre del proyecto', project.name);
    if (name) {
      project.name = name;
      this.save();
      this.renderProjectList();
      this.renderView();
    }
  },
  deleteProject(project) {
    const idx = this.data.projects.indexOf(project);
    if (idx !== -1) {
      this.data.projects.splice(idx, 1);
      if (this.currentProject === project) {
        this.currentProject = this.data.projects[0] || null;
      }
      this.save();
      this.renderProjectList();
      this.renderView();
    }
  },
  startDrag(e, task) {
    e.dataTransfer.effectAllowed = 'move';
    try {
      // Some browsers require data to be set for drag to start
      e.dataTransfer.setData('text/plain', String(task.id));
    } catch {}
    this.draggedTask = task;
  },
  dropKanban(status) {
    if (!this.draggedTask || !this.currentProject) {
      console.log('❌ Drag fallido');
      return;
    }
    const idx = this.currentProject.tasks.findIndex(t => t.id === this.draggedTask.id);
    if (idx !== -1) {
      this.currentProject.tasks[idx].status = status;
      const [t] = this.currentProject.tasks.splice(idx, 1);
      this.currentProject.tasks.push(t);
      this.save();
      this.renderView();
      console.log(`✅ Drag exitoso a ${status}`);
    } else {
      console.log('❌ Drag fallido');
    }
    this.draggedTask = null;
  },
  dropList(index) {
    if (!this.draggedTask || !this.currentProject) return;
    const arr = this.currentProject.tasks;
    const from = arr.findIndex(t => t.id === this.draggedTask.id);
    if (from === -1) return;
    const [task] = arr.splice(from, 1);
    if (index < 0 || index >= arr.length) {
      arr.push(task);
    } else {
      if (from < index) index--;
      arr.splice(index, 0, task);
    }
    this.save();
    this.renderView();
    this.draggedTask = null;
  }
};

document.addEventListener('DOMContentLoaded', () => {
  App.load();
  App.renderProjectList();
  App.renderView();
  document.getElementById('addProjectBtn').onclick = () => App.addProject();
  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.onclick = () => { App.currentView = btn.dataset.view; App.renderView(); };
  });
  document.getElementById('exportBtn').onclick = () => App.exportJSON();
  document.getElementById('importBtn').onclick = () => document.getElementById('importFile').click();
  document.getElementById('importFile').onchange = e => {
    const file = e.target.files[0];
    if (file) App.importJSON(file);
  };
  document.getElementById('addTaskBtn').onclick = () => App.addTask();
  document.getElementById('cancelTaskBtn').onclick = () => App.closeTaskModal();
  document.getElementById('saveTaskBtn').onclick = () => App.saveTaskFromModal();
  document.getElementById('addSubtaskBtn').onclick = () => {
    const input = document.getElementById('subtaskInput');
    const title = input.value.trim();
    if (title) {
      App.modalSubtasks.push({ id: Date.now(), title, done: false });
      input.value = '';
      App.renderSubtasks();
    }
  };
  document.getElementById('taskModal').addEventListener('click', e => {
    if (e.target.id === 'taskModal') App.closeTaskModal();
  });
  document.getElementById('editTask').onclick = () => {
    if (App.contextTask) App.editTask(App.contextTask);
    App.hideContextMenu();
  };
  document.getElementById('deleteTask').onclick = () => App.deleteTask();
  document.addEventListener('click', e => {
    const menu = document.getElementById('contextMenu');
    if (!menu.contains(e.target)) App.hideContextMenu();
  });
  document.addEventListener('contextmenu', e => {
    const menu = document.getElementById('contextMenu');
    if (!menu.contains(e.target)) App.hideContextMenu();
  });
  document.addEventListener('dragend', () => { App.draggedTask = null; });
});

export { App };
