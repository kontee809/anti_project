# Flood Monitoring Frontend (React + Vite)

## 1. Project Description
This is the frontend component for the User Management dashboard of the Flood Monitoring project. It provides a sleek, modern UI built reliably with React and TailwindCSS.

Features:
- Secure Login & Registration UI flows
- Full CRUD User Management interface
- Role-based UI components (Admin-only views)
- Real-time search and dynamic sorting
- Interactive Success/Error Dialogs & Toasts

## 2. Requirements
- **Node.js** (v18.0 or higher recommended)
- **npm** (comes packaged with Node.js) or **yarn**

## 3. Install Dependencies
Open a terminal inside the `front-end` directory and run:
```bash
npm install
```

## 4. Run Project
Start the lightning-fast Vite development server:
```bash
npm run dev
```

## 5. Frontend URL
The web application will immediately be accessible at:
**http://localhost:5173**

## 6. API Configuration
The frontend communicates directly with the Spring Boot backend. Ensure the base URL is configured accurately targeting the backend port.

**File Location:** `src/services/api.js`
Ensure it contains:
```javascript
baseURL: 'http://localhost:8080'
```

## 7. Login
Once both the Backend and Frontend servers are running seamlessly:
1. Navigate to `http://localhost:5173/login` in your web browser.
2. Use an account created via your backend database or register a new one to access the system.
*Note: Only `ADMIN` roles are permitted to access the User Management core dashboard.*

## 8. Notes
- **Dependencies**: The backend MySQL server (`localhost:8080`) must be fully running simultaneously to log in, fetch data, or complete CRUD updates.
- **Security**: Upon successful login, the JWT API Token, user email, and user role are stored securely inside your browser's `localStorage` and automatically attached via Axios interceptors to all subsequent API requests.
