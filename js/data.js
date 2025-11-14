async function addTaskOnline(task) {
  const docRef = await db.collection('tasks').add(task);
  return docRef.id;
}

async function getTasksOnline() {
  const snapshot = await db.collection('tasks').get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

async function updateTaskOnline(id, updates) {
  await db.collection('tasks').doc(id).update(updates);
}

async function deleteTaskOnline(id) {
  await db.collection('tasks').doc(id).delete();
}

async function syncOfflineData() {
  const offlineTasks = await getTasksOffline();
  for (const task of offlineTasks) {
    if (!task.synced) {
      const firebaseId = await addTaskOnline(task);
      task.id = firebaseId;
      task.synced = true;
      await addTaskOffline(task); // update local copy
    }
  }
  M.toast({ html: 'Offline tasks synced to Firebase!' });
}