/* ----------------------------------------------------
   Editable Seasonal Calendar System
---------------------------------------------------- */

// Ensure Materialize components initialize
document.addEventListener('DOMContentLoaded', () => {
  M.Modal.init(document.querySelectorAll('.modal'));
  M.FormSelect.init(document.querySelectorAll('select'));
});

/* ========== IndexedDB Setup ========== */
const calDBPromise = idb.openDB("litebulb-db", 3, {
  upgrade(db) {
    if (!db.objectStoreNames.contains("calendar-reminders")) {
      const store = db.createObjectStore("calendar-reminders", { keyPath: "id" });
      store.createIndex("by-uid", "uid");
      store.createIndex("by-synced", "synced");
    }
  }
});

/* ========== IndexedDB CRUD ========== */
async function addReminderOffline(rem) {
  const db = await calDBPromise;
  await db.put("calendar-reminders", rem);
}
async function updateReminderOffline(rem) {
  const db = await calDBPromise;
  await db.put("calendar-reminders", rem);
}
async function deleteReminderOffline(id) {
  const db = await calDBPromise;
  await db.delete("calendar-reminders", id);
}
async function getRemindersOffline(uid) {
  const db = await calDBPromise;
  return db.getAllFromIndex("calendar-reminders", "by-uid", uid);
}

/* ========== Firestore CRUD ========== */
function userCalendarCollection() {
  const user = auth.currentUser;
  if (!user) throw new Error("Not signed in");
  return firestore
    .collection("users")
    .doc(user.uid)
    .collection("calendarReminders");
}
async function addReminderOnline(rem) {
  const { id, synced, ...data } = rem;
  const ref = await userCalendarCollection().add(data);
  return ref.id;
}
async function updateReminderOnline(rem) {
  const { id, synced, ...data } = rem;
  await userCalendarCollection().doc(id).update(data);
}
async function deleteReminderOnline(id) {
  await userCalendarCollection().doc(id).delete();
}
async function getRemindersOnline() {
  const snap = await userCalendarCollection().get();
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

/* ========== SYNC ========== */
async function syncCalendar(uid) {
  const offline = await getRemindersOffline(uid);
  const pending = offline.filter(r => !r.synced);
  for (const r of pending) {
    try {
      const newId = await addReminderOnline(r);
      const synced = { ...r, id: newId, synced: true };
      await updateReminderOffline(synced);
    } catch (err) {
      console.error("Calendar sync error:", err);
    }
  }
  if (pending.length > 0) M.toast({ html: `Synced ${pending.length} reminder(s)` });
}

window.addEventListener("online", () => {
  const user = auth.currentUser;
  if (user) syncCalendar(user.uid);
});

/* ========== RENDER LIST ========== */
async function renderCalendar() {
  const user = auth.currentUser;
  const list = document.getElementById("calendarList");

  if (!user) {
    list.innerHTML = `<li class="collection-item">Sign in to view reminders</li>`;
    return;
  }

  let reminders = [];
  try {
    reminders = navigator.onLine ? await getRemindersOnline() : await getRemindersOffline(user.uid);
  } catch (err) {
    console.error('Get reminders error:', err);
  }

  list.innerHTML = "";
  reminders.forEach(r => {
    const li = document.createElement("li");
    li.className = "collection-item";
    li.innerHTML = `
      <span><strong>${r.season}</strong>: ${r.text}</span>
      <div class="secondary-content">
        <i class="material-icons orange-text pointer edit-reminder"
           data-id="${r.id}" data-season="${r.season}" data-text="${r.text}">edit</i>
        <i class="material-icons red-text pointer delete-reminder" data-id="${r.id}">delete</i>
      </div>
    `;
    list.appendChild(li);
  });

  document.querySelectorAll(".edit-reminder").forEach(btn => {
    btn.addEventListener("click", e => {
      const id = e.target.dataset.id;
      const season = e.target.dataset.season;
      const text = e.target.dataset.text;
      document.getElementById("editReminderId").value = id;
      document.getElementById("editSeasonSelect").value = season;
      document.getElementById("editReminderText").value = text;
      M.updateTextFields();
      M.FormSelect.init(document.querySelectorAll('select'));
      M.Modal.getInstance(document.getElementById("editReminderModal")).open();
    });
  });

  document.querySelectorAll(".delete-reminder").forEach(btn => {
    btn.addEventListener("click", async e => {
      const id = e.target.dataset.id;
      try {
        if (navigator.onLine) await deleteReminderOnline(id);
        await deleteReminderOffline(id);
        M.toast({ html: 'Reminder deleted' });
        renderCalendar();
      } catch (err) {
        console.error('Delete reminder error:', err);
        M.toast({ html: 'Error deleting reminder' });
      }
    });
  });
}

/* ========== ADD REMINDER ========== */
document.getElementById("saveReminderBtn").addEventListener("click", async () => {
  const user = auth.currentUser;
  if (!user) return M.toast({ html: "Please sign in" });

  const season = document.getElementById("seasonSelect").value;
  const text = document.getElementById("reminderText").value.trim();

  if (!text) return M.toast({ html: "Enter a reminder" });

  const reminder = { id: crypto.randomUUID(), uid: user.uid, season, text, synced: false };

  try {
    if (navigator.onLine) {
      const newId = await addReminderOnline(reminder);
      await addReminderOffline({ ...reminder, id: newId, synced: true });
    } else {
      await addReminderOffline(reminder);
    }
    M.toast({ html: "Reminder added" });
  } catch (err) {
    console.error('Add reminder error:', err);
    M.toast({ html: 'Error adding reminder' });
  }

  document.getElementById("reminderText").value = "";
  M.Modal.getInstance(document.getElementById("addReminderModal")).close();
  renderCalendar();
});

/* ========== EDIT / DELETE ========== */
document.getElementById("updateReminderBtn").addEventListener("click", async () => {
  const id = document.getElementById("editReminderId").value;
  const season = document.getElementById("editSeasonSelect").value;
  const text = document.getElementById("editReminderText").value.trim();
  const user = auth.currentUser;

  const updated = { id, uid: user.uid, season, text, synced: navigator.onLine };

  try {
    if (navigator.onLine) await updateReminderOnline(updated);
    await updateReminderOffline(updated);
    M.toast({ html: "Updated" });
  } catch (err) {
    console.error('Update reminder error:', err);
    M.toast({ html: 'Error updating reminder' });
  }

  M.Modal.getInstance(document.getElementById("editReminderModal")).close();
  renderCalendar();
});

document.getElementById("deleteReminderBtn").addEventListener("click", async () => {
  const id = document.getElementById("editReminderId").value;

  try {
    if (navigator.onLine) await deleteReminderOnline(id);
    await deleteReminderOffline(id);
    M.toast({ html: "Deleted" });
  } catch (err) {
    console.error('Delete reminder error:', err);
    M.toast({ html: 'Error deleting reminder' });
  }

  M.Modal.getInstance(document.getElementById("editReminderModal")).close();
  renderCalendar();
});

/* ========== AUTH LISTENER: Refresh List ========== */
auth.onAuthStateChanged(user => {
  if (user) {
    syncCalendar(user.uid);
    renderCalendar();
  } else {
    document.getElementById("calendarList").innerHTML =
      `<li class="collection-item">Sign in to view reminders</li>`;
  }
});