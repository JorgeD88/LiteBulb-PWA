LiteBulb PWA

LiteBulb is a Progressive Web App (PWA) designed to help homeowners track and manage recurring maintenance tasks. It offers offline access, installability, and a clean, responsive interface built with Materialize CSS.

Features

- Offline access to task history and DIY guides
- Seasonal maintenance calendar
- Visual guides for common home fixes
- Installable on desktop and mobile
- Push-ready structure for notifications
- Built with HTML, Materialize CSS, and JavaScript

PWA Enhancements

Service Worker
- Caches essential resources for offline use
- Handles fetch events to serve cached content when offline
- Improves load performance and reliability

Manifest File
- Enables install prompt on supported devices
- Includes app name, icons, theme colors, and display mode
- Ensures consistent branding across platforms

## Data Storage & Sync

LiteBulb uses Firebase Firestore for online data and IndexedDB for offline storage. When offline, tasks are saved locally and automatically synced to Firebase when the app reconnects.

### How It Works

- Online: CRUD operations use Firebase
- Offline: CRUD operations use IndexedDB
- Sync: Offline tasks are synced to Firebase with unique IDs
- Service worker caches all required scripts for offline use

### Usage

- Add tasks via the form
- If offline, tasks are stored locally
- When back online, you'll see a toast confirming sync