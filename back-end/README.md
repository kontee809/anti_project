# Flood Monitoring Backend (Spring Boot)

## 1. Project Description
This is the backend component of the Flood Monitoring System, built with Spring Boot. It provides a secure, role-based RESTful API for managing user accounts and authentication. 

Features:
- Authentication (Login & Register)
- JWT (JSON Web Token) Security
- Full User Management CRUD (Admin Only)
- Role-based Access Control (strict `ADMIN` vs `USER` limits)

## 2. Requirements
- **Java 17** or higher
- **Maven**
- **MySQL** (version 8+ recommended)
- **IDE** (IntelliJ IDEA, VS Code, or Eclipse)

## 3. Database Setup
Follow these exact steps to initialize your local database:

1. Open MySQL Command Line or your preferred MySQL GUI (e.g., MySQL Workbench).
2. Create the required database by executing:
   ```sql
   CREATE DATABASE flood_monitoring;
   ```
3. Update your `src/main/resources/application.properties` with your local database credentials:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/flood_monitoring
   spring.datasource.username=YOUR_USERNAME 
   spring.datasource.password=YOUR_PASSWORD
   ```
*(Note: Hibernate `ddl-auto=update` is configured to automatically generate the necessary tables when the application first starts.)*

## 4. Run Backend
You can easily start the application either directly from your IDE or via the terminal:

1. Navigate to the `back-end` folder in your terminal.
2. Build the project and download all dependencies:
   ```bash
   mvn clean install
   ```
3. Run the Spring Boot application:
   ```bash
   mvn spring-boot:run
   ```

## 5. API Base URL
Once running, the backend server will be locally available at:
**http://localhost:8080**

## 6. Test Account
Once the server connects to the database successfully, you can register a new account via the frontend UI or API request. 
*Note: Passwords are automatically salted and encrypted using `BCryptPasswordEncoder` securely before being saved to the database.*

Example Admin Account (Once you register one):
- **Email**: `admin@gmail.com`
- **Password**: `123456`

## 7. Notes
- **JWT Authentication** is strictly required for all management endpoints (`/api/admin/**`).
- **Startup Order**: The backend server must be up and running *before* the frontend can successfully authenticate users.
