# Donezo

**Ride the wave of productivity.**

Donezo is a modern, dark-themed task board app that helps you organize, track, and complete your tasks with style. Built for speed, clarity, and a beautiful user experience—on both web and mobile.

## ✨ Features
- 📝 Create, edit, and delete tasks
- 🏷️ Organize tasks by status (To Do, In Progress, Done)
- 🔍 Fast search and filtering
- 📱 Fully responsive (mobile & desktop)
- 🌓 Gorgeous dark UI
- 🏄 Drag & drop task movement
- 🔒 Local storage for persistence
- 🔑 Firebase authentication (MetaMask & Phantom wallet connect)

## 🚀 Tech Stack
- [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Firebase](https://firebase.google.com/) (Auth, Analytics)
- [shadcn/ui](https://ui.shadcn.com/) components

## 🛠️ Getting Started

1. **Clone the repo:**
   ```bash
   git clone https://github.com/your-username/donezo.git
   cd donezo
   ```
2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```
3. **Set up environment variables:**
   - Copy the example below into a `.env` file in the project root:
     ```env
     VITE_FIREBASE_API_KEY=your_api_key
     VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
     VITE_FIREBASE_PROJECT_ID=your_project_id
     VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
     VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
     VITE_FIREBASE_APP_ID=your_app_id
     VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
     ```
   - Get these values from your [Firebase Console](https://console.firebase.google.com/).

4. **Start the app:**
   ```bash
npm run dev
   # or
   yarn dev
   ```
   The app will be running at [http://localhost:5173](http://localhost:5173)

## 📦 Build for Production
```bash
npm run build
# or
yarn build
```

## 📝 License
MIT

---

> **Donezo** — Ride the wave of productivity.
