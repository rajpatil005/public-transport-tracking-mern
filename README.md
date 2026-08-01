# 🚌 Public Transport Tracking System

> **A Full-Stack Smart Transportation Solution built using the MERN Stack that enables real-time bus tracking, intelligent route management, and a seamless travel experience for passengers.**

<p align="center">

![React](https://img.shields.io/badge/Frontend-React.js-61DAFB?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?style=for-the-badge&logo=node.js)
![Express](https://img.shields.io/badge/Framework-Express.js-000000?style=for-the-badge&logo=express)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?style=for-the-badge&logo=mongodb)
![Leaflet](https://img.shields.io/badge/Maps-Leaflet-199900?style=for-the-badge&logo=leaflet)
![Vercel](https://img.shields.io/badge/Deployment-Vercel-000000?style=for-the-badge&logo=vercel)

</p>

---

# 🌐 Live Demo

🚀 **Experience the Live Application**

**🔗 https://public-transport-tracking-steel.vercel.app**

---

# 📖 Project Overview

The **Public Transport Tracking System** is a modern web-based application developed using the **MERN Stack** to improve the efficiency and accessibility of public transportation.

The platform provides passengers with real-time bus tracking, route information, nearby bus stop discovery, ticket booking, and schedule management through an intuitive and responsive interface.

In addition to passenger services, the system includes an administrative dashboard that enables transport authorities to manage buses, routes, schedules, and operational data efficiently.

Designed with scalability and performance in mind, the project demonstrates how modern web technologies can be used to build intelligent transportation solutions for smart cities.

---

# 🎯 Problem Statement

Public transportation users often encounter several challenges during their daily commute, including:

- Lack of real-time bus tracking.
- Uncertainty in bus arrival timings.
- Difficulty finding nearby bus stops.
- Dependence on static or outdated schedules.
- Limited access to route information.
- Inefficient communication between passengers and transport authorities.

These issues increase passenger waiting time, reduce travel convenience, and negatively affect the overall public transportation experience.

---

# 🎯 Project Objectives

The primary objective of this project is to create a smart and user-friendly transportation platform that enhances the commuting experience through digital innovation.

The system aims to:

- Provide accurate real-time bus tracking.
- Reduce passenger waiting time.
- Improve accessibility to transport information.
- Enable quick and convenient online ticket booking.
- Offer interactive route visualization using digital maps.
- Support transport administrators with efficient route and bus management.
- Deliver a scalable solution suitable for future smart city transportation systems.
  ---

# ✨ Key Features

The Public Transport Tracking System is designed to provide a modern, efficient, and user-friendly public transportation experience. It combines real-time tracking capabilities with intelligent route management to improve passenger convenience and transport administration.

### 🚍 Passenger Features

- 📍 Real-Time Bus Tracking
- 🗺️ Interactive Route Visualization using Leaflet Maps
- 📌 Nearby Bus Stop Finder
- 🔎 Smart Bus Route Search
- 📅 Live Bus Schedule
- 🎫 Online Ticket Booking
- 📱 Responsive User Interface
- ⚡ Fast and Smooth Navigation

---

### 👨‍💼 Admin Features

- 🚌 Add, Update and Manage Bus Information
- 🛣️ Route Management
- 📅 Schedule Management
- 📍 Monitor Bus Locations
- 🗂️ Transport Data Management
- 🔒 Secure Administrative Access

---

# 👥 User Modules

The system is divided into two major modules:

| Module | Description |
|---------|-------------|
| 👤 Passenger Module | Allows users to track buses, search routes, find nearby bus stops, check schedules, and book tickets. |
| 👨‍💼 Admin Module | Enables administrators to manage buses, routes, schedules, and transportation data efficiently. |

---

# 🛠️ Technology Stack

| Category | Technology |
|----------|------------|
| Frontend | React.js |
| Styling | CSS3 |
| Programming Language | JavaScript (ES6+) |
| Backend | Node.js |
| Framework | Express.js |
| Database | MongoDB |
| Interactive Maps | Leaflet.js |
| Version Control | Git & GitHub |
| Deployment | Vercel |
| API Testing | Postman |

---

# 🏗️ System Architecture

```text
                ┌──────────────────────┐
                │      Passenger       │
                └──────────┬───────────┘
                           │
                           ▼
                ┌──────────────────────┐
                │   React Frontend     │
                └──────────┬───────────┘
                           │ REST API
                           ▼
                ┌──────────────────────┐
                │ Express.js + Node.js │
                └──────────┬───────────┘
                           │
                           ▼
                ┌──────────────────────┐
                │      MongoDB         │
                └──────────────────────┘
                           ▲
                           │
                ┌──────────────────────┐
                │    Admin Dashboard   │
                └──────────────────────┘
```

---

# 🔄 Project Workflow

```text
Passenger Opens Website
          │
          ▼
Search Bus / Select Route
          │
          ▼
Request Sent to Backend
          │
          ▼
MongoDB Fetches Required Data
          │
          ▼
Backend Processes Response
          │
          ▼
React Displays Live Information
          │
          ▼
Passenger Tracks Bus & Books Ticket
```
---

# 📂 Project Structure

```text
Public-Transport-Tracking/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── data/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   │
│   ├── .env.production
│   ├── package.json
│   ├── package-lock.json
│   └── tailwind.config.js
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── data/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── socket/
│   ├── utils/
│   ├── .env
│   ├── package.json
│   ├── server.js
│   ├── seed.js
│   └── testAuth.js
│
├── screenshots/
│
├── README.md
│
└── .gitignore
```

---

# ⚙️ Installation Guide

### Clone Repository

```bash
git clone https://github.com/your-github-username/Public-Transport-Tracking.git
```

---

### Install Client Dependencies

```bash
cd client
npm install
```

---

### Install Server Dependencies

```bash
cd ../server
npm install
```

---

### Configure Environment Variables

Create a `.env` file inside the **server** folder.

```env
PORT=5000

MONGODB_URI=Your MongoDB Connection String

JWT_SECRET=Your Secret Key
```

---

### Run Backend

```bash
cd server
npm start
```

---

### Run Frontend

```bash
cd client
npm start
```

---

### Open in Browser

```
http://localhost:3000
```

---

# 📦 Major Dependencies

### Frontend

- React.js
- Tailwind CSS
- Leaflet.js
- React Router
- Axios

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- Socket.IO
- JWT Authentication
- Dotenv
- CORS
