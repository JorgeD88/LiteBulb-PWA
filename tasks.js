// ----------------------------
// Firestore Task Functions (v9+ Modular)
// ----------------------------
import { collection, doc, addDoc, getDocs, updateDoc, deleteDoc } 
  from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";
import { auth, firestore } from "./auth.js"; // make sure auth.js exports these

// Helper: get the current user's tasks collection
function userTasksCollection() {
  const user = auth.currentUser;
  if (!user) throw new Error("Not signed in");
  return collection(firestore, "users", user.uid, "tasks");
}

// Add a task online
export async function addTaskOnline(task) {
  const { id, synced, ...rest } = task;
  const ref = await addDoc(userTasksCollection(), {
    ...rest,
    createdAt: Date.now()
  });
  return ref.id;
}

// Get all tasks online
export async function getTasksOnline() {
  const snap = await getDocs(userTasksCollection());
  return snap.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
}

// Update a task online
export async function updateTaskOnline(task) {
  const { id, synced, ...rest } = task;
  const ref = doc(firestore, "users", auth.currentUser.uid, "tasks", id);
  await updateDoc(ref, rest);
}

// Delete a task online
export async function deleteTaskOnline(id) {
  const ref = doc(firestore, "users", auth.currentUser.uid, "tasks", id);
  await deleteDoc(ref);
}