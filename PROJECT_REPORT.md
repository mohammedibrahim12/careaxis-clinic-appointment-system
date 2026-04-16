# Project Report

## Title

**CareAxis: Clinic Appointment System Using MERN Stack**

## Abstract

The CareAxis Clinic Appointment System is a full-stack web application developed using the MERN stack to digitize appointment scheduling and clinic workflow management. The system is designed for small and medium clinics that still depend on manual registers, phone calls, and fragmented communication between patients, doctors, and administrative staff. The application provides a centralized platform where patients can register and request appointments, doctors can manage consultation status and notes, and administrators can create doctor accounts and monitor clinic activity through dashboards.

The project demonstrates practical implementation of a modern web system with JWT-based authentication, role-based access control, CRUD operations, dashboard analytics, MongoDB-based data storage, and a responsive React user interface. The application is completely zero-cost for academic demonstration because it runs on a local machine using MongoDB Community Server and does not depend on paid APIs, payment gateways, or third-party cloud services.

## 1. Introduction

Healthcare service delivery often suffers when clinic appointments are handled manually. Patients face uncertainty about doctor availability, doctors do not get a structured view of their queue, and administrators spend time coordinating schedules instead of managing operations. A digital clinic appointment platform can reduce these issues by creating a single source of truth for appointments, doctor profiles, and consultation status.

This project aims to solve that problem by building a role-based appointment management system using the MERN stack. The application offers a practical and realistic use case suitable for academic evaluation because it combines frontend development, backend APIs, database design, authentication, access control, validation, and reporting.

## 2. Problem Statement

Many clinics still rely on notebooks, spreadsheets, phone calls, and verbal communication to manage appointments. This creates several problems:

- Double-booking of doctors
- Difficulty in checking doctor availability
- Poor visibility into appointment status
- Delays in patient scheduling
- Lack of centralized patient and doctor records
- Time-consuming administrative work

The problem is to build a web-based solution that simplifies appointment scheduling while supporting different roles and maintaining data consistency.

## 3. Objectives

The main objectives of the project are:

- To develop a web-based clinic appointment system using the MERN stack
- To provide secure authentication for admin, doctor, and patient roles
- To allow patients to browse doctors and request appointments
- To allow doctors to review and update appointment progress
- To allow admins to create doctor accounts and manage clinic data
- To prevent duplicate bookings for the same doctor and time slot
- To display dashboard insights for clinic operations
- To create a zero-cost academic project that runs fully on localhost

## 4. Scope of the Project

The system focuses on outpatient clinic appointment workflow. Its current scope includes:

- Patient registration and login
- Admin login and automatic admin bootstrap
- Doctor account creation by admin
- Doctor profile management
- Doctor availability and slot validation
- Appointment booking, status update, and cancellation
- Dashboard reporting for each role

The system does not currently include:

- Online payment integration
- SMS or email notifications
- Prescription PDF generation
- Video consultation
- Multi-branch enterprise deployment

## 5. Existing System and Limitations

### Existing Manual Approach

In a traditional clinic setup, appointments are often booked manually through:

- Phone calls
- Reception desk entries
- Handwritten registers
- Informal follow-up communication

### Limitations of the Existing System

- Manual errors are common
- Patient history is not easily searchable
- Doctor schedules are hard to coordinate
- Reports and analytics are not readily available
- Appointment conflicts may occur
- Administrative staff carry most of the coordination burden

## 6. Proposed System

The proposed system is a MERN-based web application named **CareAxis**. It introduces a centralized digital workflow where:

- Patients register and log in through the portal
- Patients view available doctors and request appointments
- Doctors manage appointments assigned to them
- Admin users create doctor profiles and monitor overall activity
- Appointment data is stored in MongoDB and processed through Express APIs
- React provides a responsive user experience

## 7. Development Methodology

The project follows an iterative development approach:

1. Requirement understanding
2. System design and module planning
3. Backend API development
4. MongoDB schema creation
5. Frontend page and dashboard implementation
6. Role-based integration
7. Validation, testing, and refinement

This approach allowed the project to be built in manageable layers while keeping the frontend and backend aligned.

## 8. Technologies Used

### Frontend

- React.js
- Vite
- React Router DOM
- Recharts
- CSS

### Backend

- Node.js
- Express.js
- JWT
- bcryptjs
- CORS
- Morgan

### Database

- MongoDB Community Server
- Mongoose

### Development Tools

- Visual Studio Code
- PowerShell
- npm
- Nodemon
- Git-compatible project structure

## 9. System Requirements

### Hardware Requirements

- Processor: Dual core or above
- RAM: Minimum 4 GB
- Storage: Minimum 1 GB free space

### Software Requirements

- Windows 10/11
- Node.js
- npm
- MongoDB Community Server
- Modern web browser

## 10. System Architecture

The application uses a three-layer architecture:

```text
User
  |
  v
React Frontend (client)
  |
  v
Express REST API (server)
  |
  v
MongoDB Database
```

### Frontend Layer

- Displays public pages and protected dashboards
- Handles form submission and role-based navigation
- Communicates with backend APIs using Axios

### Backend Layer

- Processes authentication
- Validates input and permissions
- Applies business rules for appointment booking
- Returns dashboard data and doctor information

### Database Layer

- Stores users, doctor profiles, and appointments
- Maintains persistent clinic records

## 11. Modules of the System

### 11.1 Authentication Module

- Patient registration
- Login for all roles
- JWT token generation
- Current user retrieval

### 11.2 Doctor Management Module

- View doctor directory
- Create doctor account by admin
- Update doctor profile
- Maintain specialization, fee, and availability

### 11.3 Appointment Management Module

- Book appointment by patient
- Check doctor availability
- Prevent duplicate doctor-slot booking
- Cancel appointment
- Update appointment status to pending, confirmed, completed, or cancelled

### 11.4 Dashboard Module

- Admin dashboard with summary counts and trends
- Doctor dashboard with workload and queue
- Patient dashboard with care team and booking history

## 12. Database Design

The project uses three main MongoDB collections.

### 12.1 User Collection

Fields:

- `name`
- `email`
- `password`
- `role`
- `phone`
- `gender`
- `age`
- `lastLoginAt`
- `createdAt`
- `updatedAt`

### 12.2 DoctorProfile Collection

Fields:

- `user`
- `specialization`
- `qualifications`
- `experienceYears`
- `consultationFee`
- `location`
- `clinicRoom`
- `bio`
- `rating`
- `isAvailable`
- `availability`

### 12.3 Appointment Collection

Fields:

- `patient`
- `doctor`
- `appointmentDate`
- `reason`
- `status`
- `doctorNotes`
- `cancellationReason`
- `createdAt`
- `updatedAt`

### Relationship Summary

- One `User` may be an admin, doctor, or patient
- One doctor user has one doctor profile
- One patient can have many appointments
- One doctor can have many appointments

## 13. API Design Summary

### Authentication APIs

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Doctor APIs

- `GET /api/doctors`
- `GET /api/doctors/:id`
- `POST /api/doctors`
- `PUT /api/doctors/:id`

### Appointment APIs

- `GET /api/appointments`
- `POST /api/appointments`
- `PATCH /api/appointments/:id/status`
- `PATCH /api/appointments/:id/cancel`

### Dashboard API

- `GET /api/dashboard/overview`

## 14. Security and Validation

The system includes the following controls:

- JWT-based authentication
- Password hashing using `bcryptjs`
- Role-based route protection
- Duplicate appointment prevention with unique doctor-date index
- Future-date validation for appointments
- Doctor availability window validation
- Restricted doctor creation to admin only

## 15. User Roles and Permissions

### Admin

- Can log in
- Can access admin dashboard
- Can create doctor accounts
- Can edit doctor details
- Can view all appointments
- Can update appointment status

### Doctor

- Can log in
- Can access doctor dashboard
- Can view assigned appointments
- Can update appointment status
- Can edit own profile

### Patient

- Can register and log in
- Can browse doctors
- Can request appointments
- Can cancel their appointments
- Can access patient dashboard

## 16. Output Screens

The project contains the following major UI pages:

- Landing page
- Authentication page
- Doctor directory page
- Patient appointment page
- Admin manage doctors page
- Dashboard page for all roles

Note:
Screenshots of these pages can be inserted into this report before submission for a stronger presentation.

## 17. Testing Summary

### Functional Testing

- Login works for valid credentials
- Invalid credentials are rejected
- Patients can book appointments
- Duplicate doctor-slot booking is blocked
- Doctors can update appointment status
- Admin can create doctor accounts

### Technical Verification

- Client linting passed
- Production build passed
- Backend source files passed syntax checks

## 18. Advantages of the Proposed System

- Reduces manual booking effort
- Improves appointment accuracy
- Provides role-wise dashboards
- Makes doctor availability transparent
- Creates structured clinic records
- Easy to demonstrate in academic viva
- Runs without paid services

## 19. Limitations

- No notification system
- No online payment support
- No report export to PDF
- No advanced analytics beyond dashboard summaries
- Best suited for small or medium clinic use in its current form

## 20. Future Enhancements

- Email and SMS reminders
- Prescription management
- Laboratory report upload
- Advanced search and filtering
- Multi-branch clinic support
- Telemedicine integration
- PDF and Excel report export
- AI-assisted appointment suggestions

## 21. Conclusion

The CareAxis Clinic Appointment System successfully addresses the core problem of manual clinic scheduling by offering a centralized, role-based digital solution. The project is a strong demonstration of full-stack development using the MERN stack and includes essential industry-relevant features such as authentication, CRUD operations, dashboard analytics, validation logic, and access control. Because it is practical, zero-cost, and based on a real-world healthcare workflow, it is well suited as a course project for academic evaluation.

## 22. References

- MERN Stack Documentation
- MongoDB Documentation
- Express.js Documentation
- React Documentation
- JWT Authentication Concepts

