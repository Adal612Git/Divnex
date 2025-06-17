import { createKanbanColumn, createTaskCard } from "./components/kanban.js";
import { createTaskRow } from "./components/task.js";
class Task {
  constructor({ id, title, description = '', status = 'To Do', priority = 'Media', type = 'General', estimate = 1 }) {
    this.id = id || Date.now();
    this.title = title;
    this.description = description;
    this.status = status;
    this.priority = priority;
    this.type = type;
    this.estimate = estimate;
  }
  toJSON() {
    return { id: this.id, title: this.title, description: this.description, status: this.status, priority: this.priority, type: this.type, estimate: this.estimate };
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
      li.className = 'cursor-pointer px-2 py-1 rounded hover:bg-gray-100';
      li.textContent = p.name;
      li.onclick = () => { this.currentProject = p; this.renderView(); };
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
        onContext: (e, t) => this.showContextMenu(e, t)
      }));
    });
  },
  renderKanban(container, project) {
    const board = document.createElement('div');
    board.className = 'flex gap-4';
    const statuses = ['To Do', 'In Progress', 'Done'];
    statuses.forEach(status => {
      const { column, list } = createKanbanColumn(status);
      project.tasks.filter(t => t.status === status).forEach(t => {
        list.appendChild(createTaskCard(t, {
          onClick: (_e, task) => this.editTask(task),
          onContext: (e, task) => this.showContextMenu(e, task)
        }));
      });
      board.appendChild(column);
    });
    container.appendChild(board);
  },
  editTask(task) {
    const title = prompt('Editar título', task.title);
    if (title) {
      task.title = title;
      this.save();
      this.renderView();
    }
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
  deleteTask() {
    if (!this.contextTask || !this.currentProject) return;
    this.currentProject.tasks = this.currentProject.tasks.filter(t => t !== this.contextTask);
    this.contextTask = null;
    this.save();
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
  }
};

document.addEventListener('DOMContentLoaded', () => {
  App.load();
  App.renderProjectList();
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
});