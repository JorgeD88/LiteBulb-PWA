// ----------------------------
// INDEX PAGE SPECIFIC LOGIC
// ----------------------------

document.addEventListener('DOMContentLoaded', () => {
  M.Modal.init(document.querySelectorAll('.modal'));

  const form = document.getElementById('taskForm');
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();

    const user = auth.currentUser;
    if (!user) {
      M.toast({ html: 'Please sign in first' });
      return;
    }

    const title = document.getElementById('taskTitle').value.trim();
    const notes = document.getElementById('taskNotes').value.trim();

    if (!title) {
      M.toast({ html: 'Task title is required' });
      return;
    }

    const task = { id: crypto.randomUUID(), uid: user.uid, title, notes, synced: false };

    try {
      if (navigator.onLine) {
        const fid = await addTaskOnline(task);
        await addTaskOffline({ ...task, id: fid, synced: true });
        M.toast({ html: 'Task added online' });
      } else {
        await addTaskOffline(task);
        M.toast({ html: 'Task saved offline' });
      }
    } catch (err) {
      console.error('Error adding task:', err);
      M.toast({ html: 'Error adding task' });
    }

    form.reset();
    renderTasks();
  });
});

// Render tasks in preview list
async function renderTasks() {
  const user = auth.currentUser;
  const list = document.getElementById('taskList');

  if (!user) {
    list.innerHTML = '<li class="collection-item">Sign in to view tasks</li>';
    return;
  }

  let tasks = [];
  try {
    tasks = navigator.onLine ? await getTasksOnline() : await getTasksOffline(user.uid);
  } catch (err) {
    console.error('Error fetching tasks:', err);
    tasks = [];
  }

  list.innerHTML = '';
  tasks.forEach(task => {
    const li = document.createElement('li');
    li.className = 'collection-item';
    li.innerHTML = `
      <span><strong>${task.title}</strong><br>${task.notes || ''}</span>
      <a href="#!" class="secondary-content">
        <i class="material-icons red-text delete-task" data-id="${task.id}">delete</i>
      </a>
    `;
    list.appendChild(li);
  });

  document.querySelectorAll('.delete-task').forEach(btn => {
    btn.addEventListener('click', async e => {
      const id = e.target.dataset.id;
      try {
        if (navigator.onLine) await deleteTaskOnline(id);
        await deleteTaskOffline(id);
        M.toast({ html: 'Task deleted' });
        renderTasks();
      } catch (err) {
        console.error('Error deleting task:', err);
        M.toast({ html: 'Error deleting task' });
      }
    });
  });
}

// Refresh task list on auth change
auth.onAuthStateChanged(user => {
  if (user) renderTasks();
  else document.getElementById('taskList').innerHTML = '<li class="collection-item">Sign in to view tasks</li>';
});