# Thủy Phổ Minh - Flood Monitoring Backend

A complete Spring Boot backend for the Thủy Phổ Minh flood monitoring dashboard, providing secure JWT authentication, role-based access control, and RESTful APIs for the React frontend.

---

## 1. Project Overview

- **Core Framework**: Spring Boot
- **Database**: MySQL
- **Build Tool**: Maven
- **Security**: JSON Web Tokens (JWT) & Spring Security

---

## 2. Prerequisites

Ensure the following foundational tools are installed on your machine:

- Java 17
- Maven
- MySQL

You can verify your installations by running:
```bash
java -version  
mvn -version  
mysql --version  
```

---

## 3. Installation

### Clone repository

```bash
git clone <repo_url>
cd backend
```

---

## 4. Database Setup

Open your MySQL terminal and execute the following commands to create the database and application user:

```sql
-- Create database:
CREATE DATABASE flood_monitoring;

-- Create user:
CREATE USER 'app_user'@'localhost' IDENTIFIED BY '123456';

-- Grant privileges:
GRANT ALL PRIVILEGES ON flood_monitoring.* TO 'app_user'@'localhost';
FLUSH PRIVILEGES;

exit;
```

---

## 5. Configuration

All database credentials and connection parameters map to `src/main/resources/application.properties`. 

Edit the file to match your environment if needed. Example:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/flood_monitoring
spring.datasource.username=app_user
spring.datasource.password=123456

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

---

## 6. Run the Project

To fetch all dependencies and launch the server on port `8080`, simply execute:

```bash
mvn spring-boot:run
```

**Expected output:**
You should see output logging ending with:
> `"Started BackendApplication"`

---

## 7. API Testing

You can use **Postman** to test the authentication flow:

`POST /api/auth/register`
```json
{
  "name": "Operator System",
  "email": "operator@thuyphominh.vn",
  "password": "securepassword123"
}
```

`POST /api/auth/login`
```json
{
  "email": "operator@thuyphominh.vn",
  "password": "securepassword123"
}
```

---

## 8. Common Issues & Fixes

* **Cannot connect to DB / Access denied**: Ensure `application.properties` matches the password (`123456`) and username (`app_user`) generated in Step 4. Also verify MySQL is actively running (`sudo systemctl status mysql`).
* **Port already in use**: Port `8080` is occupied. You can configure a new port in `application.properties` via `server.port=9090`. 
* **Java version mismatch**: Spring Boot strictly demands Java 17+. Re-verify your JDK path using `java -version`. 

---

## 9. Project Structure

The codebase utilizes clean architectural layering:
* `/controller` - Exposed REST API endpoints (`AuthController.java`). 
* `/service` - Core business logic linking validation, databases, and encryption.
* `/repository` - Spring Data JPA interfaces mapping objects to MySQL statements. 
* `/entity` - Database table layouts (`User.java`, Enums).

---

## 10. Notes

* **Do NOT use root user in production.** Creating dedicated users (like `app_user`) limits structural damage if credentials are leaked.
* **Password must be hashed (BCrypt).** The logic natively leverages `BCryptPasswordEncoder`. Plain passwords are never mathematically retrievable nor stored in text variables. Always uphold these standards in future schemas!
