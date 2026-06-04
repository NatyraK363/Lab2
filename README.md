# SmartCare Clinic

## Project Overview

SmartCare Clinic is a web-based clinic management system developed as part of the Lab Course 2 project. The system provides a centralized platform for managing doctors, patients, appointments, medical records, prescriptions, invoices, notifications, and reports.

The goal of the project is to improve clinic operations through a secure and user-friendly application that supports different user roles and healthcare management processes.

---

## Technologies Used

### Backend
- Laravel
- PHP
- MySQL
- Redis
- JWT Authentication

### Frontend
- React
- React Router
- Axios
- Tailwind CSS

### Development Tools
- Postman
- MySQL Workbench
- Git & GitHub
- VS Code

---

## Main Features

### Authentication & Authorization
- User Registration
- User Login
- JWT Authentication
- Role-Based Access Control
- Permissions Management

### Doctor Management
- Create, update and delete doctors
- Department assignment
- Specialty assignment
- Doctor profile management
- Schedule management

### Patient Management
- Patient profiles
- Emergency contacts
- Medical history tracking

### Appointment Management
- Appointment booking
- Appointment approval and confirmation
- Appointment status tracking
- Appointment history

### Medical Records & Prescriptions
- Medical record management
- Prescription management
- Medicine management
- Treatment tracking

### Invoice & Payment Management
- Invoice generation
- Payment tracking
- Billing management

### Notifications
- Real-time notifications
- Read and unread status tracking

### File Management
- Profile photo upload
- File storage support

### Reports
- Dynamic report generation
- Date range filtering
- Saved reports
- Exportable reports

### Import & Export
Supported formats:
- CSV
- JSON
- Excel (XLSX)

Supported entities:
- Doctors
- Patients
- Departments
- Appointments
- Reports

### Advanced Search
Advanced filtering and search functionality implemented across multiple modules:
- Doctors
- Patients
- Appointments
- Departments
- Users

---

## User Roles

### Administrator
- Manage users
- Manage doctors
- Manage patients
- Manage departments
- Manage appointments
- Generate reports
- Import and export data
- Monitor system activity

### Doctor
- View appointments
- Manage medical records
- Create prescriptions
- Manage schedules
- View patient information

### Patient
- Book appointments
- View medical records
- View prescriptions
- Manage profile information

---

## Additional Features

- Redis Caching
- Dynamic Report Generation
- CSV, JSON and Excel Export
- CSV and Excel Import
- Profile Photo Upload
- Real-Time Notifications
- Audit Logging
- Role & Permission Management

---

## Database Structure

The system uses a relational MySQL database consisting of the following main entities:

- Users
- Roles
- Permissions
- User Roles
- Departments
- Specialties
- Doctors
- Patients
- Appointments
- Medical Records
- Prescriptions
- Medicines
- Invoices
- Payments
- Notifications
- Files
- Reports
- Emergency Contacts
- Audit Logs
- Schedules

The complete database design is available in:

documentation/SmartCare_ERD.png

---

## API Documentation

The API collection used for testing is available in:

documentation/SmartCare_Postman_Collection.json

The collection contains endpoints for:

- Authentication
- Doctors
- Patients
- Departments
- Specialties
- Appointments
- Reports
- Import
- Export

---

## Installation

### Backend

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan jwt:secret
php artisan migrate
php artisan serve
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Redis

```bash
redis-server
```

---

## Project Structure

```text
Lab2
│
├── backend
├── frontend
├── documentation
│   ├── SmartCare_ERD.png
│   └── SmartCare_Postman_Collection.json
│
└── README.md
```

---

## Project Author

Natyra Kyqyku

Faculty of Computer Science and Engineering

University for Business and Technology (UBT)