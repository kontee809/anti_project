# Flood Monitoring System - Full Stack Application

## 1. Project Overview
The Flood Monitoring System is a comprehensive full-stack web application meticulously designed for securely managing operator accounts and monitoring datasets. This repository contains both the frontend React UI and the backend Spring Boot REST API. It features a completely integrated authentication flow (JWT) alongside strict role-based User Management (CRUD).

## 2. Tech Stack
- **Frontend**: React.js, Vite, TailwindCSS, Axios, Context/State Hooks, Lucide Icons
- **Backend**: Java 17, Spring Boot 3, Spring Security (JWT), Spring Data JPA, Hibernate
- **Database**: MySQL

## 3. Project Structure
```text
/anti-project
├── /back-end    # Spring Boot application (Port: 8080)
└── /front-end   # React Vite application (Port: 5173)
```

## 4. How to Run the Full System
To get the entire application smoothly working locally, you must run both the backend and frontend servers simultaneously in separate terminal windows.

### Step 1: Run Backend
1. Ensure your MySQL server service is actively running and the database schema `flood_monitoring` is successfully created.
2. Open a new terminal in the `/back-end` directory.
3. Replace your local database credentials inside `src/main/resources/application.properties` (Username and Password).
4. Run the backend directly using maven:
   ```bash
   mvn spring-boot:run
   ```
   *(The backend will securely start on `http://localhost:8080`)*

### Step 2: Run Frontend
1. Open a **second** terminal inside the `/front-end` directory.
2. Install the necessary node dependencies (only required the very first time):
   ```bash
   npm install
   ```
3. Start the Vite development server mapping:
   ```bash
   npm run dev
   ```
   *(The frontend will instantaneously start on `http://localhost:5173`)*

### 5. Access the Application
Open your web browser and navigate directly to **http://localhost:5173**. Register for a brand new account or seamlessly log in with an existing Admin credentials to access the User Management dashboard!
