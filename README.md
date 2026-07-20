<div align="center">

# CareConnect

### Child Safety & Activity Monitoring Platform

A modern, role-based web application designed to help parents and caregivers
collaborate on child safety through real-time tracking, activity logging,
and secure information management.

[![Deployed on Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://careconnect-gules.vercel.app)
[![GitHub Repo](https://img.shields.io/badge/Repository-careconnect--safety-6e5494?style=for-the-badge&logo=github&logoColor=white)](https://github.com/ishiidoc96-ship-it/careconnect-safety)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](#license)
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-brightgreen?style=for-the-badge)](https://github.com/ishiidoc96-ship-it/careconnect-safety/pulls)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Firebase](https://img.shields.io/badge/Firebase-12-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com)

<br/>

**[Live Demo](https://careconnect-gules.vercel.app)** &nbsp;|&nbsp; **[Report Bug](https://github.com/ishiidoc96-ship-it/careconnect-safety/issues)** &nbsp;|&nbsp; **[Request Feature](https://github.com/ishiidoc96-ship-it/careconnect-safety/issues)**

</div>

---

## Features

- **Role-Based Dashboards** — Separate experiences for Parents and Caregivers with tailored views and permissions
- **Real-Time Location Tracking** — Interactive Leaflet maps for monitoring child locations with geofencing support
- **Activity Logging** — Record and track daily activities, milestones, and care notes
- **Calendar Integration** — Visual calendar for scheduling and reviewing care events
- **Safety Vault** — Secure storage for critical child information (medical, emergency contacts, allergies)
- **Push Notifications** — Timely alerts for activity updates and safety events
- **Authentication** — Firebase-powered secure sign-up, login, and session management
- **Glassmorphic UI** — Modern Material Design 3 aesthetic with glassmorphism effects

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [React 19](https://react.dev) |
| **Build Tool** | [Vite 8](https://vite.dev) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com) |
| **Routing** | [React Router DOM v7](https://reactrouter.com) |
| **Backend** | [Firebase](https://firebase.google.com) (Auth + Firestore) |
| **Maps** | [Leaflet](https://leafletjs.com) / [React-Leaflet](https://react-leaflet.js.org) |
| **Mobile** | [Capacitor 8](https://capacitorjs.com) (Android-ready) |
| **Linting** | [Oxlint](https://oxc.rs) |

## Getting Started

### Prerequisites

- **Node.js** 18+ 
- **npm** or **yarn**
- A [Firebase project](https://console.firebase.google.com) (for Auth & Firestore)

### Installation

```bash
# Clone the repository
git clone https://github.com/ishiidoc96-ship-it/careconnect-safety.git
cd careconnect-safety

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Firebase Setup

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Authentication** (Email/Password provider)
3. Enable **Cloud Firestore**
4. Copy your Firebase config into `src/firebase.js`:

```js
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run Oxlint static analysis |

## Project Structure

```
careconnect/
├── public/
├── src/
│   ├── components/
│   │   └── BottomNav.jsx          # Role-based bottom navigation
│   ├── contexts/
│   │   └── AuthContext.jsx        # Firebase auth context provider
│   ├── pages/
│   │   ├── Login.jsx              # Email/password sign-in
│   │   ├── Register.jsx           # New account creation
│   │   ├── RoleSelection.jsx      # Parent or Caregiver role picker
│   │   ├── ParentHome.jsx         # Parent dashboard
│   │   ├── CaregiverHome.jsx      # Caregiver dashboard
│   │   ├── Calendar.jsx           # Event scheduling & view
│   │   ├── LogActivity.jsx        # Activity entry & history
│   │   ├── TrackingMap.jsx        # Real-time location map
│   │   ├── SafetyVault.jsx        # Secure child info storage
│   │   └── Profile.jsx            # User profile management
│   ├── services/
│   │   ├── firestoreService.js    # Firestore CRUD operations
│   │   ├── locationService.js     # Geolocation & tracking
│   │   └── notificationService.js # Push notification handling
│   ├── firebase.js                # Firebase configuration
│   ├── App.jsx                    # Root component & routing
│   └── index.css                  # Global styles & Tailwind
├── capacitor.config.json          # Capacitor Android config
├── vite.config.js                 # Vite build config
├── tailwind.config.js             # Tailwind CSS config
└── package.json
```

## Deployment

### Vercel (Recommended)

The project is auto-detected by Vercel. Push to `main` and it deploys automatically.

```bash
# Or deploy manually
npx vercel --prod
```

### Android (Capacitor)

```bash
npm run build
npx cap sync android
npx cap open android
```

Then build the APK from Android Studio.

## Roadmap

- [ ] Real-time Firestore sync in Activity Log & Calendar
- [ ] Geofence alerts and boundary notifications
- [ ] Multi-language support (i18n)
- [ ] Dark mode toggle
- [ ] Offline-first with IndexedDB caching
- [ ] iOS build via Capacitor

## Contributing

Contributions are welcome! Please open an issue first to discuss what you'd like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

<div align="center">

Built with care for child safety.

</div>
