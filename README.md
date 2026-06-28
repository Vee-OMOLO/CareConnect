# CareConnect

A Flutter + Firebase childcare communication and safety monitoring app that links parents and caregivers. Caregivers log a child's daily activities in real time, raise emergency alerts, and share their live location, while parents follow everything from their own dashboard.

## Overview

CareConnect bridges the gap between a parent at work and the caregiver looking after their child. The caregiver records activities as they happen — feeds, naps, diaper changes, play, and medicine — optionally attaching a note and a photo. Each entry appears instantly on the parent's dashboard. In an emergency, the caregiver can trigger an SOS alert, and the parent can view the caregiver's live GPS location.

The app has two roles, **Parent** and **Caregiver**, each with its own dashboard, selected at registration.

## Features

- **Two-role authentication** — separate Parent and Caregiver accounts via Firebase Authentication, with role-based dashboards.
- **Parent–caregiver linking** — a caregiver links to a parent using the child's name and the parent's email. Both sides deterministically build the same composite key, so logs and alerts line up reliably.
- **Activity logging (Quick Log)** — one-tap logging for Feeding, Sleep, Diaper, Play/Activity, Medicine, plus a category picker and an optional free-text note.
- **Photo attachments** — caregivers can attach a photo (camera or gallery) to any log entry; the parent sees it on the activity card.
- **Real-time sync** — activity logs stream live from Cloud Firestore to the parent's dashboard.
- **Event calendar** — parents schedule events (e.g. doctor's appointments) that surface on the caregiver's calendar.
- **SOS emergency alerts** — a one-tap emergency flow that records an alert with an optional description for the parent and emergency contacts.
- **Live location** — the caregiver's GPS position is written to Firestore so the parent can view the caregiver's current coordinates.
- **Emergency safety vault** — a dedicated area for emergency contacts and safety information.

## Tech stack

- **Flutter** (Dart) — cross-platform mobile UI
- **Firebase Authentication** — user sign-up and sign-in
- **Cloud Firestore** — real-time database for users, activity logs, events, and alerts
- **Geolocator** — GPS location tracking
- **image_picker** — capturing and selecting photos
- **table_calendar** — calendar UI
- **provider** — state management

## Project structure

```
lib/
  models/        Data models (UserModel, ActivityLog, EmergencyContact)
  providers/     AuthProvider (auth state + current user)
  screens/       Login, Register, Caregiver & Parent dashboards, SOS, Safety Vault, Tracking
  services/      Firestore, Location, and related services
  utils/         Shared helpers (link key builder)
  main.dart      App entry point and routing
```

## Getting started

### Prerequisites

- Flutter SDK installed ([flutter.dev/docs/get-started](https://flutter.dev/docs/get-started))
- An Android device or emulator
- A Firebase project

### Setup

1. Clone the repository:
   ```
   git clone https://github.com/Vee-OMOLO/CareConnect.git
   cd CareConnect
   ```

2. Install dependencies:
   ```
   flutter pub get
   ```

3. Connect your own Firebase project (Authentication + Firestore enabled) and add the generated `firebase_options.dart` / `google-services.json`.

4. Run the app:
   ```
   flutter run
   ```

## How it works

A caregiver registers, then links to a parent by entering the child's name and the parent's email. Both the caregiver and the parent app build the same link key from those two values, which is used as the child's identifier across the database. The caregiver logs activities and optionally raises SOS alerts; all of this writes to Firestore under that shared key. The parent, after setting the matching child name, reads the same key and sees the activity feed, calendar events, alerts, and live location in real time.

## Roadmap / future work

- Embedded interactive map for live location (currently shown as coordinates with a shareable map link; an embedded Google Map requires Maps Platform billing).
- Cloud storage for full-resolution photos (current build keeps photos lightweight for the free tier).
- Push notifications for SOS alerts and new activity.

## Author

**Sheryl Omolo** — [github.com/Vee-OMOLO](https://github.com/Vee-OMOLO)

## License

This project was developed as an academic project. All rights reserved by the author.
