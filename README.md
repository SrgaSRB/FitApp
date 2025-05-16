# FitApp

**FitApp** is a lightweight fitness tracking web application designed for personal workout management and progress monitoring. The app provides essential functionalities like user authentication, workout tracking, progress statistics, and personal profile management.

## ✨ Features
- ✅ **User Registration & Login** (JWT Authentication)
- ✅ **Protected Routes** with automatic logout on token expiration
- ✅ **Add / View / Delete Workouts** (Calories, Duration, Intensity, Fatigue)
- ✅ **Progress Tracking** by weekly statistics
- ✅ **Profile Management** (update user info, live username/email availability check)
- ✅ **Workout History View** with filters and sorting
- ✅ **Responsive Design** optimized for mobile & desktop
- ✅ **Deployed on Vercel (Frontend)** with live API & DB connections

## 🛠️ Technologies Used
| Layer        | Tech Stack                                                   |
|--------------|--------------------------------------------------------------|
| **Frontend** | React + TypeScript, React Router, Axios                      |
| **Backend**  | ASP.NET Core Web API, Entity Framework Core, PostgreSQL       |
| **Database** | PostgreSQL (Neon.tech cloud-hosted)                          |
| **Auth**     | JWT Bearer Token (with expiration & auto-logout handling)     |
| **Deployment**| Vercel (Frontend), Render.com (Backend API), Neon.tech (DB) |

## 🔗 Live Demo
- **Frontend (Vercel):** [https://fit-app-gamma.vercel.app/login](https://fit-app-gamma.vercel.app/login)
- **Note:** Backend is hosted on Render, which might have a **cold start delay (~20-30s)** after inactivity.

## 🗄️ Database Connection
PostgreSQL database is hosted on **Neon.tech** (serverless cloud DB with pooling).