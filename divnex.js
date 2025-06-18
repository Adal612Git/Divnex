@@ -73,52 +73,52 @@ const App = {
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
      if (this.currentProject === p) li.classList.add('bg-indigo-100');
      li.className = 'flex items-center justify-between cursor-pointer px-2 py-1 rounded hover:bg-indigo-100 dark:hover:bg-gray-700 transition-colors';
      if (this.currentProject === p) li.classList.add('bg-indigo-100','dark:bg-gray-700');
      li.onclick = () => {
        this.currentProject = p;
        this.renderProjectList();
        this.renderView();
      };
      const span = document.createElement('span');
      span.textContent = p.name;
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