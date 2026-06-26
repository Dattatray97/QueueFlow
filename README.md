# QueueFlow - Smart Appointment & Token Management System

QueueFlow is a full-stack Java web application designed to manage appointments, generate token numbers, and track queues in real-time. It provides a seamless experience for users to book appointments and a powerful dashboard for admins to control queues.

## Technology Stack

### Backend
*   **Framework:** Spring Boot 3.2.x
*   **Database:** MySQL
*   **Security:** Spring Security + JWT Authentication
*   **ORM:** Spring Data JPA / Hibernate
*   **Other:** Lombok, JavaMailSender

### Frontend
*   **Framework:** React 18 (Vite)
*   **Styling:** Custom CSS Custom Properties (Premium Dark Theme with Glassmorphism), Bootstrap Grid
*   **Routing:** React Router v6
*   **Charts:** Recharts
*   **HTTP Client:** Axios

### Deployment
*   **Docker:** Multi-stage builds for frontend (Nginx) and backend
*   **Orchestration:** Docker Compose

## Features

**User Features:**
*   User Registration & JWT Login
*   Book Appointments with Service & Time Slot selection
*   Auto-generate Token Numbers (e.g., QF-1025)
*   Live Queue Status (Current serving, Wait time estimation, People ahead)
*   Appointment History (Upcoming, Completed, Cancelled)

**Admin Features:**
*   Dashboard Analytics (Total Users, Today's Bookings)
*   Real-time Queue Control (Call Next, Skip, Complete, Cancel)
*   Visual Charts for Daily Bookings & Service Popularity

## Getting Started Locally

### Prerequisites
*   Java 17+
*   Node.js 18+
*   MySQL 8.0+

### Database Setup
Create the database and schema using the script in `database/schema.sql` or let Spring Boot automatically create it.

### Run Backend
```bash
cd backend
mvn spring-boot:run
```

### Run Frontend
```bash
cd frontend
npm install
npm run dev
```

## Running with Docker (Recommended)

Make sure you have Docker and Docker Compose installed.

```bash
docker-compose up -d
```

The application will be accessible at:
*   Frontend: http://localhost:80
*   Backend API: http://localhost:8080/api

### Default Credentials
*   **Admin Email:** `admin@queueflow.com`
*   **Admin Password:** `admin123`
