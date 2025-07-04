import { createKanbanColumn, createTaskCard } from "./components/kanban.js";
import { createTaskRow } from "./components/task.js";
class Task {
  constructor({ id, title, description = '', status = 'To Do', priority = 'Media', type = 'General', estimate = 1, color = '', dueDate = '', attachments = [], subtasks = [], notes = [], header = {} }) {
    this.id = id || Date.now();
    this.title = title;
    this.description = description;
    this.status = status;
    this.priority = priority;
    this.type = type;
    this.estimate = estimate;
    this.color = color;
    this.dueDate = dueDate;
    this.attachments = attachments;
    this.subtasks = subtasks.map(s => ({ id: s.id || Date.now(), title: s.title, done: !!s.done }));
    this.notes = notes.map(n => ({
      id: n.id || Date.now(),
      text: n.text || '',
      time: n.time || new Date().toISOString(),
      images: n.images || []
    }));
    this.header = header; // {color, image}
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
      dueDate: this.dueDate,
      attachments: this.attachments,
      subtasks: this.subtasks,
      notes: this.notes,
      header: this.header
    };
  }
  static fromJSON(obj) {
    return new Task(obj);
  }
}

class Project {
  constructor({ id, name, tasks = [], status = '' }) {
    this.id = id || Date.now();
    this.name = name;
    this.tasks = tasks.map(t => Task.fromJSON(t));
    this.status = status;
  }
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      tasks: this.tasks.map(t => t.toJSON()),
      status: this.status
    };
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
  modalAttachments: [],
  modalNotes: [],
  draggedTask: null,
  calendarMonth: new Date(),
  load() {
    const saved = localStorage.getItem('divnexData');
    if (saved) {
      const parsed = JSON.parse(saved);
      this.data.projects = parsed.projects.map(p => Project.fromJSON(p));
    } else {
      this.data.projects = [
        new Project({
          name: 'Proyecto Demo',
          status: '',
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
      li.className = 'flex items-center justify-between cursor-pointer px-3 py-2 rounded hover:bg-indigo-100 dark:hover:bg-gray-800';
      if (this.currentProject === p) li.classList.add('bg-indigo-100', 'dark:bg-gray-800');
      li.onclick = () => {
        this.currentProject = p;
        this.renderProjectList();
        this.renderView();
      };
      const span = document.createElement('span');
      span.textContent = p.name;

      const statusWrap = document.createElement('div');
      statusWrap.className = 'flex ml-2';
      [
        { value: 'stop', color: 'red' },
        { value: 'go', color: 'green' },
        { value: 'done', color: 'blue' }
      ].forEach(info => {
        const b = document.createElement('button');
        b.className = 'w-3 h-3 rounded-full border ml-1';
        b.style.borderColor = info.color;
        if (p.status === info.value) b.style.backgroundColor = info.color;
        b.onclick = e => {
          e.stopPropagation();
          p.status = p.status === info.value ? '' : info.value;
          this.save();
          this.renderProjectList();
          if (this.currentProject === p) this.renderView();
        };
        statusWrap.appendChild(b);
      });
      const actions = document.createElement('div');
      const edit = document.createElement('button');
      edit.textContent = '✎';
      edit.className = 'text-blue-500 hover:text-blue-700 ml-2';
      edit.onclick = e => { e.stopPropagation(); this.renameProject(p); };
      const del = document.createElement('button');
      del.textContent = '✕';
      del.className = 'text-red-500 hover:text-red-700 ml-1';
      del.onclick = e => { e.stopPropagation(); this.deleteProject(p); };
      actions.appendChild(edit);
      actions.appendChild(del);
      li.appendChild(span);
      li.appendChild(statusWrap);
      li.appendChild(actions);
      list.appendChild(li);
    });
  },
  renderView() {
    const main = document.getElementById('mainView');
    main.innerHTML = '';
    if (!this.currentProject) return;
    const header = document.createElement('div');
    header.className = 'flex items-center justify-between mb-4';
    const title = document.createElement('h2');
    title.className = 'text-xl font-semibold';
    title.textContent = this.currentProject.name;
    const statusWrap = document.createElement('div');
    statusWrap.className = 'flex ml-2';
    [
      { value: 'stop', color: 'red' },
      { value: 'go', color: 'green' },
      { value: 'done', color: 'blue' }
    ].forEach(info => {
      const b = document.createElement('button');
      b.className = 'w-4 h-4 rounded-full border ml-1';
      b.style.borderColor = info.color;
      if (this.currentProject.status === info.value) b.style.backgroundColor = info.color;
      b.onclick = e => {
        e.stopPropagation();
        this.currentProject.status = this.currentProject.status === info.value ? '' : info.value;
        this.save();
        this.renderProjectList();
        this.renderView();
      };
      statusWrap.appendChild(b);
    });

    const actions = document.createElement('div');
    const edit = document.createElement('button');
    edit.textContent = '✎';
    edit.className = 'text-blue-500 mr-2';
    edit.onclick = () => this.renameProject(this.currentProject);
    const del = document.createElement('button');
    del.textContent = '✕';
    del.className = 'text-red-500';
    del.onclick = () => this.deleteProject(this.currentProject);
    actions.appendChild(edit);
    actions.appendChild(del);
    header.appendChild(title);
    header.appendChild(statusWrap);
    header.appendChild(actions);
    main.appendChild(header);

    const content = document.createElement('div');
    if (this.currentView === 'kanban') {
      this.renderKanban(content, this.currentProject);
    } else if (this.currentView === 'list') {
      this.renderList(content, this.currentProject);
    } else {
      this.renderCalendar(content, this.currentProject);
    }
    main.appendChild(content);
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
        onEdit: t => this.editTask(t),
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
    board.className = 'flex gap-4 overflow-x-auto flex-nowrap';
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
          onEdit: task => this.editTask(task),
          onDelete: task => { this.removeTask(task); this.renderView(); }
        }));
      });
      board.appendChild(column);
    });
    container.appendChild(board);
  },
  renderCalendar(container, project) {
    const month = this.calendarMonth;
    const first = new Date(month.getFullYear(), month.getMonth(), 1);
    const last = new Date(month.getFullYear(), month.getMonth() + 1, 0);
    const startDay = first.getDay();
    const days = last.getDate();
    const header = document.createElement('div');
    header.className = 'flex items-center justify-between mb-2';
    const title = document.createElement('h3');
    title.className = 'font-semibold';
    title.textContent = month.toLocaleString('default', { month: 'long', year: 'numeric' });
    const nav = document.createElement('div');
    const prev = document.createElement('button');
    prev.textContent = '‹';
    prev.onclick = () => { this.calendarMonth = new Date(month.getFullYear(), month.getMonth() - 1, 1); this.renderView(); };
    const next = document.createElement('button');
    next.textContent = '›';
    next.onclick = () => { this.calendarMonth = new Date(month.getFullYear(), month.getMonth() + 1, 1); this.renderView(); };
    nav.appendChild(prev);
    nav.appendChild(next);
    header.appendChild(title);
    header.appendChild(nav);
    container.appendChild(header);

    const grid = document.createElement('div');
    grid.className = 'grid grid-cols-7 gap-2';
    const daysHeader = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
    daysHeader.forEach(d => {
      const h = document.createElement('div');
      h.className = 'text-center font-semibold';
      h.textContent = d;
      grid.appendChild(h);
    });
    for (let i = 0; i < startDay; i++) {
      grid.appendChild(document.createElement('div'));
    }
    for (let d = 1; d <= days; d++) {
      const cell = document.createElement('div');
      cell.className = 'border p-1 min-h-[60px]';
      const label = document.createElement('div');
      label.className = 'text-xs text-gray-600';
      label.textContent = d;
      cell.appendChild(label);
      const dateStr = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      project.tasks.filter(t => t.dueDate && t.dueDate.startsWith(dateStr)).forEach(t => {
        const div = document.createElement('div');
        div.className = 'text-xs truncate rounded bg-white shadow px-1 my-1';
        div.style.borderLeft = `3px solid ${t.color || '#94a3b8'}`;
        div.textContent = t.title;
        div.onclick = () => this.editTask(t);
        cell.appendChild(div);
      });
      grid.appendChild(cell);
    }
    container.appendChild(grid);
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
    document.getElementById('taskDueDate').value = task ? (task.dueDate || '') : '';
    document.getElementById('taskColor').value = task && task.color ? task.color : '#94a3b8';
    document.getElementById('taskDescription').value = task ? task.description : '';
    const header = task && task.header ? task.header : {};
    document.getElementById('headerColor').value = header.color || '#e5e7eb';
    const preview = document.getElementById('headerPreview');
    preview.style.backgroundColor = header.color || '#e5e7eb';
    if (header.image) {
      preview.style.backgroundImage = `url(${header.image})`;
      preview.dataset.image = header.image;
    } else {
      preview.style.backgroundImage = 'none';
      preview.dataset.image = '';
    }
    this.modalSubtasks = task ? task.subtasks.map(s => ({ ...s })) : [];
    this.modalAttachments = task ? task.attachments.slice() : [];
    this.modalNotes = task ? task.notes.map(n => ({ ...n })) : [];
    document.getElementById('taskAttachments').value = '';
    this.renderSubtasks();
    this.renderNotes();
    document.getElementById('taskModal').classList.remove('hidden');
  },
  closeTaskModal() {
    document.getElementById('taskModal').classList.add('hidden');
    this.modalTask = null;
    this.modalAttachments = [];
    this.modalNotes = [];
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
  renderNotes() {
    const list = document.getElementById('noteList');
    list.innerHTML = '';
    this.modalNotes.forEach(n => {
      const li = document.createElement('li');
      li.className = 'bg-white p-2 rounded text-sm space-y-1';
      const text = document.createElement('div');
      text.textContent = n.text;
      const time = document.createElement('div');
      time.className = 'text-xs text-gray-500';
      time.textContent = new Date(n.time).toLocaleString();
      li.appendChild(text);
      if (n.images && n.images.length) {
        const imgContainer = document.createElement('div');
        imgContainer.className = 'flex gap-1 flex-wrap';
        n.images.forEach(img => {
          const i = document.createElement('img');
          i.src = img.data;
          i.alt = img.name;
          i.className = 'w-12 h-12 object-cover rounded';
          imgContainer.appendChild(i);
        });
        li.appendChild(imgContainer);
      }
      li.appendChild(time);
      list.appendChild(li);
    });
  },
  saveTaskFromModal() {
    const title = document.getElementById('taskTitle').value.trim();
    if (!title) return;
    const status = document.getElementById('taskStatus').value;
    const dueDate = document.getElementById('taskDueDate').value;
    const color = document.getElementById('taskColor').value;
    const description = document.getElementById('taskDescription').value;
    const header = {
      color: document.getElementById('headerColor').value,
      image: document.getElementById('headerPreview').dataset.image || ''
    };
    const attachments = this.modalAttachments;
    if (this.modalTask) {
      this.modalTask.title = title;
      this.modalTask.status = status;
      this.modalTask.dueDate = dueDate;
      this.modalTask.color = color;
      this.modalTask.description = description;
      this.modalTask.header = header;
      this.modalTask.subtasks = this.modalSubtasks;
      this.modalTask.attachments = attachments;
      this.modalTask.notes = this.modalNotes;
    } else {
      const task = new Task({ title, status, color, dueDate, description, attachments, subtasks: this.modalSubtasks, notes: this.modalNotes, header });
      this.currentProject.tasks.push(task);
    }
    this.save();
    this.closeTaskModal();
    this.renderView();
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
    this.currentProject.tasks = this.currentProject.tasks.filter(t => t.id !== task.id);
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
    if (!this.draggedTask || !this.currentProject) return;
    const arr = this.currentProject.tasks;
    const from = arr.findIndex(t => t.id === this.draggedTask.id);
    if (from === -1) { this.draggedTask = null; return; }
    arr[from].status = status;
    const [task] = arr.splice(from, 1);
    arr.push(task);
    this.draggedTask = null;
    this.save();
    this.renderView();
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
  document.getElementById('addNoteBtn').onclick = () => {
    const text = document.getElementById('noteText').value.trim();
    const files = Array.from(document.getElementById('noteImages').files);
    const note = { id: Date.now(), text, time: new Date().toISOString(), images: [] };
    if (files.length) {
      let remaining = files.length;
      files.forEach(f => {
        const r = new FileReader();
        r.onload = ev => {
          note.images.push({ name: f.name, data: ev.target.result });
          remaining--;
          if (remaining === 0) finishNote();
        };
        r.readAsDataURL(f);
      });
    } else {
      finishNote();
    }
    function finishNote() {
      App.modalNotes.push(note);
      document.getElementById('noteText').value = '';
      document.getElementById('noteImages').value = '';
      App.renderNotes();
    }
  };
  document.getElementById('noteImages').onchange = () => {}; // just to reset input after adding
  document.getElementById('headerColor').oninput = e => {
    const val = e.target.value;
    const prev = document.getElementById('headerPreview');
    prev.style.backgroundColor = val;
    prev.dataset.image = prev.dataset.image || '';
  };
  document.getElementById('headerImage').onchange = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const prev = document.getElementById('headerPreview');
      prev.style.backgroundImage = `url(${ev.target.result})`;
      prev.dataset.image = ev.target.result;
    };
    reader.readAsDataURL(file);
  };
  document.getElementById('taskAttachments').onchange = e => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = ev => {
        App.modalAttachments.push({ name: file.name, data: ev.target.result });
      };
      reader.readAsDataURL(file);
    });
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