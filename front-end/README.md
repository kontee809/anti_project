# Thủy Phổ Minh - Flood Monitoring Dashboard

A modern, scalable, and responsive web application designed for real-time flood monitoring and disaster response management in Vietnam. This system provides interactive geospatial data visualization, robust user administration, and streamlined emergency reporting.

---

## 🌟 1. Project Overview

- **Interactive Map Viewer**: High-performance Leaflet map centered on Vietnam with dynamic data layers for Water Level, Rainfall, and Flood Warning Stations. Includes smooth "FlyTo" zoom animations.
- **Layer Toggle Controls**: Easily switch distinct data layers on/off via a sleek floating UI panel. 
- **Real-Time Simulation**: Sensor values and status indicators simulate continuous updates.
- **Emergency Reporting Forms**: Dedicated screens for citizens and field operators to report flooded streets or request rescue operations, complete with form-integrated mini-maps.
- **User Management System (Admin)**: A robust CRUD dashboard supporting sorting, dynamic search, and strict pagination to manage system operators and varying role access.
- **Authentication Forms**: Clean login and registration interfaces prepared for JWT/session integration.

---

## 🛠️ 2. Tech Stack

This project is built using modern frontend paradigms:

- **React 19 & Vite**: Ultra-fast component rendering and development server.
- **Leaflet & React-Leaflet**: Core geospatial mapping engine.
- **TailwindCSS 4**: Utility-first CSS framework for rapid UI styling.
- **Zustand**: Lightweight scalable state management for mapping controls and user data.
- **React Router v6**: Client-side routing for multi-page SPA navigation.

---

## 📂 3. Folder Structure

The project is architected for scalability:

```
src/
├── components/          # Reusable UI components
│   ├── Layout/          # Structural elements (Navbar, PageLayout)
│   ├── Map/             # Advanced Leaflet wrappers (MapDisplay, MarkerPopup)
│   └── UserManagement/  # Admin table fragments (UserTable, UserModal, Pagination)
├── data/                # Static assets and mock generators
│   └── mockData.js      # GeoJSON mapping and sensor simulation outputs
├── hooks/               # Custom React hooks (e.g., useClickOutside)
├── pages/               # Top-level route components (MapPage, UserManagementPage, etc.)
├── store/               # Zustand global state (useMapStore, useUserStore)
├── App.jsx              # React Router definitions
└── index.css            # Base Tailwind and Leaflet CSS overrides
```

---

## ⚙️ 4. Prerequisites

Before you begin, ensure you have the following installed on your machine:
- **Node.js** (v18.0.0 or higher recommended)
- **npm** or **yarn** package manager

---

## 🚀 5. Installation Guide

### Step 1: Clone the repository
Extract or clone the source folder to your local machine:
```bash
git clone https://github.com/your-username/thuyphominh-dashboard.git
cd thuyphominh-dashboard/front-end
```

### Step 2: Install dependencies
Run standard npm installation to fetch React, Tailwind, Leaflet, and standard libraries:
```bash
npm install
```

---

## 🔑 6. Environment Variables (.env)

Create a `.env` file in the root of the project (`front-end/.env`). Use the following template to define your environment configurations:

```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
VITE_LEAFLET_TILE_URL=https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png
VITE_ENABLE_MOCK_DATA=true
```

---

## 🖥️ 7. Running the Project

To start the Vite development server with Hot Module Replacement (HMR):
```bash
npm run dev
```
- **Default URL**: The application will run locally at `http://localhost:5173`.

**How to change port:**
If you need to run on a specific port (e.g., 3000), update your `package.json` script or run:
```bash
npm run dev -- --port 3000
```

---

## 🏗️ 8. Build for Production

When you are ready to deploy to a production environment (Vercel, Netlify, Nginx):

1. **Compile the production bundle:**
   ```bash
   npm run build
   ```
   *This outputs an optimized static build inside the `dist/` directory.*

2. **Test the compiled build locally:**
   ```bash
   npm run preview
   ```
   *This serves the `dist/` folder to ensure everything works before deployment.*

---

## 🧭 9. Features Guide

### Map Usage
- **Layers**: Toggle Water Level, Rainfall, and Warnings from the right sidebar.
- **Interactions**: Click on any map marker. The map will `flyTo` center on the marker, play a visual pulsing highlight animation, and display a detailed popup.

### User Management
- Accessed via **Quản lý -> Quản lý User**.
- View paginated mock users. Features fully working Search (by name/email) and Sorting headers. Click "Thêm người dùng" or the Edit (Pencil) icons to interact with the robust Modal forms.

### Support Forms
- **Report Flood (`/report`)**: A sleek card overlaid on the map to capture disaster types and water levels.
- **Request Help (`/support`)**: Features an embedded interactive mini-map to pinpoint locations precisely.

---

## 📜 10. Scripts

- `npm run dev` : Starts the Vite local development server.
- `npm run build` : Bundles the app for production in the `/dist` folder.
- `npm run preview` : Serves the production build locally for QA testing.
- `npm run lint` *(if config exists)*: Runs ESLint to verify codebase quality.

---

## 🚑 11. Troubleshooting

### Port already in use
**Error**: `net::ERR_CONNECTION_REFUSED` or port 5173 taken.
**Fix**: Vite will automatically try the next port (5174), but you can force a port: `npm run dev -- --port 8080`.

### Node version mismatch
**Error**: `SyntaxError: Unexpected token ...` or package installation failures.
**Fix**: Verify your Node version (`node -v`). Use `nvm use 18` or `nvm use 20` to switch to a supported LTS release.

### Leaflet map not loading (CSS missing)
**Error**: Map tiles are fragmented, markers appear huge, or popups are broken.
**Fix**: Ensure `import 'leaflet/dist/leaflet.css';` is present at the top of your `index.css` or `App.jsx`.

---

## 🔮 12. Future Improvements

- **Backend Integration**: Wire all Zustand actions (`useUserStore`, forms) dynamically to REST APIs.
- **Real-time Data (WebSocket)**: Connect the map to live MQTT streams for 1-second latency flood metrics.
- **AI Prediction Models**: Overlay geospatial heatmaps projecting flood patterns based on current rainfall logic.

---

## 🤝 13. Contribution Guide

We welcome improvements from the community and internal team members!

- **Branch Naming**: Use prefixed branch names:
  - `feature/add-new-layer`
  - `fix/map-zoom-bug`
  - `chore/update-readme`
- **Commit Convention**: Please follow [Conventional Commits](https://www.conventionalcommits.org/):
  - `feat: added live socket connection`
  - `fix: resolved pagination UI alignment overflow`

---

## 📄 14. License

This project is licensed under the **MIT License**. You are free to use, modify, and distribute this software. 

---
*Developed with modern React tooling for the Thủy Phổ Minh system.*
