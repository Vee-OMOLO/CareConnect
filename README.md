<div align="center">

# 🩺 CareConnect

**Real-time care coordination for parents & caregivers**

---

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore-FFCA28?style=flat-square&logo=firebase&logoColor=black)](https://firebase.google.com)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9-199900?style=flat-square&logo=leaflet&logoColor=white)](https://leafletjs.com)

<br/>

[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](#license)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat-square)](#contributing)

---

### 🚀 Live Demo & Source Code

[![Live on Vercel](https://img.shields.io/badge/Live_Demo-🌐-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://zip-chi-rust.vercel.app)
[![GitHub Repo](https://img.shields.io/badge/Source_Code-📦-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Vee-OMOLO/CareConnect2)

</div>

---

## Overview

CareConnect bridges the gap between parents and caregivers with a real-time platform for activity logging, location tracking, emergency alerts, and care coordination — all in a clean, mobile-first interface.

---

## Features

| Category | Capabilities |
|----------|-------------|
| **👤 Dual Role System** | Parent dashboard with daily summaries · Caregiver view for quick logging · Role-specific navigation |
| **📝 Activity Tracking** | Log meals, naps, diaper changes, medication & more · Real-time sync to parent view · Color-coded timeline |
| **📍 Live Location** | GPS tracking with Leaflet maps · Share location with family · Watch live position updates |
| **🚨 Emergency SOS** | One-tap alert · Auto-shares GPS location · Emergency type selection (Medical, Fire, Missing Child, Injury, Allergic Reaction, Choking) |
| **📅 Smart Calendar** | Monthly calendar view · Appointment & medication reminders · Upcoming events list |
| **🛡️ Safety Vault** | Emergency contacts · Medical info (blood type, allergies, conditions, medications) · Quick access to SOS |
| **🔐 Auth & Roles** | Firebase Authentication · Email/password & social login · Role selection on first launch |
| **📱 Mobile-First** | Bottom navigation · PWA-ready · Touch-optimized UI · Smooth animations |

---

## Tech Stack

<div align="center">

| Frontend | Backend | Infrastructure |
|----------|---------|---------------|
| React 19 | Firebase Auth | Vite 8 |
| TypeScript 5.8 | Firestore (NoSQL) | Vercel |
| Tailwind CSS 4 | Cloudinary | Capacitor (Android) |
| Framer Motion | Geolocation API | PWA |
| Leaflet + React-Leaflet | Push Notifications | |

</div>

---

## Getting Started

### Prerequisites

- Node.js 18+
- A Firebase project with Auth & Firestore enabled
- A Cloudinary account (for media uploads)

### Installation

```bash
git clone https://github.com/Vee-OMOLO/CareConnect2.git
cd CareConnect2
npm install
```

### Environment Variables

Create `.env.local` from `.env.example`:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=
VITE_CLOUDINARY_CLOUD_NAME=
VITE_CLOUDINARY_UPLOAD_PRESET=
```

### Run

```bash
npm run dev        # Start dev server
npm run build      # Production build
npm run preview    # Preview production build
npm run lint       # Lint with oxlint
```

---

## Project Structure

```
src/
├── main.jsx                  # Entry point
├── App.jsx                   # Routes & auth guards
├── firebase.js               # Firebase config
├── index.css                 # Global styles
├── contexts/
│   └── AuthContext.jsx       # Auth state, roles, linking
├── services/
│   ├── firestoreService.js   # Firestore CRUD operations
│   ├── locationService.js    # Geolocation helpers
│   └── notificationService.js# Push notification utils
├── components/
│   ├── BottomNav.jsx         # Mobile bottom nav
│   ├── PageHeader.jsx        # Page header with back
│   ├── ActivityChip.jsx      # Activity type chip
│   ├── Toggle.jsx            # Toggle switch
│   ├── EmergencyDashboard.jsx# SOS alert system
│   └── ErrorBoundary.jsx     # Error boundary
├── constants/
│   └── activityData.js       # Activity types & colors
└── pages/
    ├── Login.jsx             # Sign in
    ├── Register.jsx          # Create account
    ├── RoleSelection.jsx     # Choose parent/caregiver
    ├── ParentHome.jsx        # Parent dashboard
    ├── CaregiverHome.jsx     # Caregiver dashboard
    ├── LogActivity.jsx       # Log a care activity
    ├── Calendar.jsx          # Schedule calendar
    ├── TrackingMap.jsx       # Live GPS tracking
    ├── SafetyVault.jsx       # Emergency contacts & info
    └── Profile.jsx           # User profile & settings
```

---

## API & Services

| Service | File | Purpose |
|---------|------|---------|
| Firestore | `firestoreService.js` | CRUD for activities, SOS alerts, user profiles |
| Location | `locationService.js` | GPS position, watchPosition, nearby places |
| Notifications | `notificationService.js` | Push notification scheduling & display |
| Auth | `AuthContext.jsx` | Login, register, logout, role management, parent-caregiver linking |

---

## Security

- Firebase Authentication with email/password & OAuth (Google, Facebook)
- Firestore security rules enforce per-user access
- Role-based routing (parent vs caregiver views)
- Environment variables for all secrets

---

## Contributing

[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen?style=for-the-badge)](#contributing)

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push (`git push origin feature/amazing-feature`)
5. Open a PR

---

## License

MIT © [Vee Omolo](https://github.com/Vee-OMOLO)

---

<div align="center">

[![GitHub Stars](https://img.shields.io/github/stars/Vee-OMOLO/CareConnect2?style=flat-square&color=yellow)](https://github.com/Vee-OMOLO/CareConnect2)
[![GitHub Forks](https://img.shields.io/github/forks/Vee-OMOLO/CareConnect2?style=flat-square)](https://github.com/Vee-OMOLO/CareConnect2)
[![GitHub Issues](https://img.shields.io/github/issues/Vee-OMOLO/CareConnect2?style=flat-square&color=red)](https://github.com/Vee-OMOLO/CareConnect2/issues)

**⭐ Star this repo if you find it useful!**

</div>
