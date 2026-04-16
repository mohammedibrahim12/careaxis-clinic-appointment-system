# Case Study

## Title

**Case Study on CareAxis Clinic Appointment System**

## 1. Background

CareAxis Clinic Appointment System is a web-based solution created for a clinic environment where appointment handling, doctor allocation, and consultation tracking need to be managed more efficiently. The case study is based on the needs of a small clinic that wants to move from a manual scheduling process to a digital workflow without spending money on paid software services.

## 2. Organization Context

Assume a small neighborhood clinic with:

- 1 administrator or receptionist
- 3 to 10 doctors
- Daily patient appointments
- Manual appointment registers
- No centralized digital dashboard

The clinic faces operational issues when multiple patients call for appointments, doctors have different availability windows, and staff members need to track status changes manually.

## 3. Existing Situation

Before the implementation of CareAxis, the clinic handled most operations manually:

- Patients called or visited physically for booking
- Appointment entries were written in notebooks or spreadsheets
- Doctors communicated changes verbally
- Staff checked schedules one by one
- No centralized analytics were available

This caused slow response times, booking mistakes, and poor visibility into clinic workload.

## 4. Main Problems Identified

The clinic’s workflow revealed the following major issues:

- Double-booked consultation slots
- Delayed confirmation of patient appointments
- Difficulty in tracking completed and cancelled visits
- No clear accountability by role
- Time wasted in coordinating doctor schedules
- No quick report on total doctors, patients, or appointments

## 5. Proposed Intervention

The proposed solution was to implement a MERN-based Clinic Appointment System with three clear user roles:

- `Admin`
- `Doctor`
- `Patient`

The application was designed to give each user only the functions needed for their work, improving clarity and security.

## 6. Solution Overview

### Admin Role

- Logs in securely
- Creates doctor accounts
- Updates doctor details and schedules
- Views overall clinic dashboard
- Tracks appointment trends and recent activity

### Doctor Role

- Logs in securely
- Views assigned appointments
- Updates appointment status
- Adds doctor notes
- Reviews weekly workload

### Patient Role

- Registers and logs in
- Views doctors and specializations
- Books appointments based on availability
- Cancels appointments when needed
- Tracks appointment history

## 7. Functional Flow of the Case

### Step 1: Admin Setup

The admin starts by logging into the system and creating doctor accounts with specialization, consultation fee, location, and available timing slots.

### Step 2: Patient Registration

A patient creates an account and accesses the doctor directory.

### Step 3: Appointment Request

The patient selects a doctor, enters a preferred date and time, and provides the reason for the visit.

### Step 4: Validation

The system validates:

- whether the doctor exists
- whether the selected date is in the future
- whether the time falls inside the doctor’s schedule
- whether the slot is already booked

### Step 5: Doctor Review

The doctor views the queue and updates appointment status to:

- pending
- confirmed
- completed
- cancelled

### Step 6: Admin Monitoring

The admin uses the dashboard to track overall clinic activity and inspect trends.

## 8. Case Example

### Scenario

Riya Sharma needs to consult a general physician for recurring headache and fever.

### Process

1. Riya logs in as a patient.
2. She opens the doctor directory and selects Dr. Asha Menon.
3. She chooses a valid future date and time within Dr. Asha Menon’s availability.
4. The system checks whether that slot is free.
5. The appointment is created with status `pending`.
6. Dr. Asha Menon logs in and reviews the request.
7. The doctor confirms the appointment and later marks it as completed after consultation.
8. The patient can see the updated status in the appointment history.

### Outcome

The clinic completes the booking without manual phone coordination or schedule confusion.

## 9. Observed Benefits

After implementing the proposed system, the clinic gains the following benefits:

- Appointment booking becomes structured and traceable
- Doctors get a clear appointment queue
- Patients can self-serve appointment requests
- Admin workload is reduced
- Dashboard insights improve operational awareness
- Manual data duplication is reduced

## 10. Technical Decisions Behind the Solution

The case study solution used the following design choices:

- React for a responsive user interface
- Express and Node.js for REST API handling
- MongoDB for flexible document-based data storage
- JWT for secure session handling
- bcryptjs for password protection
- Role-based authorization for access control

These decisions made the application practical for academic use and realistic for a clinic scenario.

## 11. Business Value

Even though this is an academic project, the system has strong practical value for a real clinic:

- Improves service quality
- Reduces booking errors
- Saves staff time
- Makes data available in one place
- Supports growth from manual workflow to digital operations

## 12. Risks and Controls

### Risk: Unauthorized access

Control:
JWT authentication and role-based route protection

### Risk: Duplicate appointments

Control:
Unique doctor-slot restriction and validation before creation

### Risk: Wrong schedule selection

Control:
Doctor availability validation

### Risk: Inconsistent user data

Control:
Schema validation using Mongoose

## 13. Lessons Learned

This case study highlights several important software engineering lessons:

- Real-world systems need clear user roles
- Validation rules are as important as user interface design
- Dashboards make a system more useful to administrators
- A good project does not need paid APIs to feel realistic
- MERN is well suited for rapid development of role-based business applications

## 14. Conclusion

The CareAxis Clinic Appointment System is a strong example of how a simple digital platform can solve a real operational problem in the healthcare domain. By replacing manual appointment handling with a centralized web application, the clinic can improve efficiency, transparency, and coordination among patients, doctors, and administrators. The case study shows that the solution is technically sound, practical, and suitable for a zero-cost academic course project.

## 15. Suggested Viva Points

- Why MERN stack was chosen
- Why role-based access control is important
- How duplicate bookings are prevented
- Why MongoDB suits this application
- How admin, doctor, and patient workflows differ
- What future improvements can make the system production-ready

