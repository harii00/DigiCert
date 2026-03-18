# Digital Certificate System

A full-stack web application for issuing, storing, and verifying digital certificates. Built with React (Vite), Node.js, Express, and MongoDB.

## Features

- **Issue Certificates** – Admins can create certificates for students
- **Secure Storage** – Certificates stored in MongoDB
- **PDF Generation** – Students can download certificates as PDF
- **Search & Verify** – Public verification by Certificate ID or student name
- **Role-Based Access** – Admin, Student, and Verifier (public) roles
- **Session Authentication** – express-session with MongoDB store

## Tech Stack

| Layer     | Technology                    |
| --------- | ----------------------------- |
| Frontend  | React 18, Vite, React Router  |
| Backend   | Node.js, Express.js           |
| Database  | MongoDB (Mongoose)            |
| Auth      | express-session, connect-mongo |
| PDF       | pdfkit                        |

## Project Structure

```
Digital_Certificate_System/
├── client/                 # Vite React frontend
│   ├── src/
│   │   ├── components/     # ProtectedRoute, etc.
│   │   ├── layouts/        # Navbar
│   │   ├── pages/          # Login, Verify, Admin, Student pages
│   │   ├── services/       # API calls
│   │   ├── styles/         # index.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
├── server/                 # Node Express backend
│   ├── config/             # db.js
│   ├── controllers/        # auth, certificate, user
│   ├── middleware/         # auth (protect, adminOnly, studentOnly)
│   ├── models/             # User, Certificate
│   ├── routes/             # auth, certificate, user
│   ├── server.js
│   ├── seed.js
│   └── package.json
├── .env.example
└── README.md
```

## User Flows

### Issue a Certificate (Admin)

1. Login 
2. Go to **Issue Certificate**
3. Enter student email (must be registered student), name, course, date, grade
4. Click **Issue Certificate**
5. A unique Certificate ID is auto-generated

### Download PDF (Student)

1. Login 
2. Go to **My Certificates**
3. Click **View** on a certificate
4. Click **Download PDF**

### Verify Certificate (Public / Verifier)

1. Go to **Verify** 
2. Enter Certificate ID (e.g. DCS-000001ABC) 
3. Click **Verify**
4. View results with validity status


