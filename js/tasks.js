/* ----------------------------------------------------
   Firebase + Firestore + IndexedDB Task Management
---------------------------------------------------- */

// Do NOT re-initialize Firebase here; auth.js handles it
const authRef = auth;
const fsRef = firestore;

// ---------------------------
// IndexedDB Setup (Local Cache)
// ---------------------------
const dbPromise = idb.openDB("litebulb-db", 2, {
  upgrade(db) {
    if (!db.objectStoreNames.contains("tasks")) {
      const store = db.createObjectStore("tasks", { keyPath: "id" });
      store.createIndex("by-uid", "uid");
      store.createIndex("by-synced", "synced");
    }
  }
});

/* ----------------------------------------------------
   IndexedDB CRUD
---------------------------------------------------- */
async function addTaskOffline(task) {
  const db = await dbPromise;
  await db.put("tasks", task);
}
async function updateTaskOffline(task) {
  const db = await dbPromise;
  await db.put("tasks", task);
}
async function deleteTaskOffline(id) {
  const db = await dbPromise;
  await db.delete("tasks", id);
}
async function getTasksOffline(uid) {
  const db = await dbPromise;
  return db.getAllFromIndex("tasks", "by-uid", uid);
}

/* ----------------------------------------------------
   Firestore CRUD
---------------------------------------------------- */
function userTasksCollection() {
  const user = authRef.currentUser;
  if (!user) throw new Error("Not signed in");
  return fsRef.collection("users").doc(user.uid).collection("tasks");
}
async function addTaskOnline(task) {
  const { id, synced, ...rest } = task;
  const ref = await userTasksCollection().add({ ...rest, createdAt: Date.now() });
  return ref.id;
}
async function updateTaskOnline(task) {
  const { id, synced, ...rest } = task;
  await userTasksCollection().doc(id).update(rest);
}
async function deleteTaskOnline(id) {
  await userTasksCollection().doc(id).delete();
}
async function getTasksOnline() {
  const snap = await userTasksCollection().get();
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

/* ----------------------------------------------------
   Sync Offline → Online
---------------------------------------------------- */
async function syncOfflineData(uid) {
  const offline = await getTasksOffline(uid);
  const unsynced = offline.filter(t => !t.synced);
  for (const t of unsynced) {
    try {
      const newId = await addTaskOnline(t);
      const fixed = { ...t, id: newId, synced: true };
      await updateTaskOffline(fixed);
    } catch (err) {
      console.error("Sync error:", err);
    }
  }
  if (unsynced.length > 0) {
    M.toast({ html: `Synced ${unsynced.length} task(s)` });
  }
}

/* ----------------------------------------------------
   Auto-Sync When Online
---------------------------------------------------- */
window.addEventListener("online", () => {
  const user = authRef.currentUser;
  if (user) syncOfflineData(user.uid);
});