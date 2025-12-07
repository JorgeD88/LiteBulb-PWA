# LiteBulb

LiteBulb is a Progressive Web App (PWA) for managing home maintenance tasks, seasonal reminders, and DIY guides. It supports **offline‑first functionality**, **Firebase authentication & Firestore sync**, and a **modern flat‑minimal theme**.

---

## Features

- **Task Management**
  - Add, edit, delete tasks
  - Works offline via IndexedDB
  - Syncs online with Firestore when connected
  - Preview list on homepage + full CRUD on tasks page

- **Seasonal Calendar**
  - Add, edit, delete seasonal reminders
  - Offline storage with IndexedDB
  - Syncs reminders to Firestore
  - Editable via Materialize modals

- **DIY Guides**
  - Visual step‑by‑step guides for common home fixes
  - Offline access to images and instructions

- **Authentication**
  - Firebase Email/Password sign‑in
  - Auth state reflected across all pages
  - Sign‑in/out buttons toggle dynamically

- **PWA Support**
  - Service Worker with precaching + dynamic caching
  - Offline fallback for navigation
  - Installable via manifest.json with icons
  - Works seamlessly on desktop and mobile

- **Modern Theme**
  - Flat‑minimal CSS with orange/blue palette
  - Hover effects, shadows, alternating list rows
  - Smooth transitions and accessibility focus styles