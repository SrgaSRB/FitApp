# FitApp

FitApp is a simple fitness tracking application that allows users to register, log in, and manage their workouts. The app enables users to add, view, update, and delete workouts, as well as track progress over time.

## Features
- User registration & login (JWT authentication)
- Protected routes with auto-logout on token expiration
- CRUD operations for workouts (add, list, delete)
- Progress tracking (weekly statistics)
- Responsive design (deployed on Vercel)
- PostgreSQL database hosted on Neon.tech

## Technologies Used
- **Frontend**: React, TypeScript, Axios, React Router
- **Backend**: ASP.NET Core Web API, Entity Framework Core, PostgreSQL
- **Deployment**: Vercel (Frontend), Render.com (Backend), Neon.tech (Database)
- **Authentication**: JWT Bearer Tokens

## Demo
Frontend deployed on Vercel:  
🔗 [https://fit-app-gamma.vercel.app/login](https://fit-app-gamma.vercel.app/login)

Backend hosted on Render (cold start ~20-30 sec after inactivity).

## Database Connection (Neon.tech)