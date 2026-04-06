# Gates Enterprises Job Platform

A modern, full-stack job-matching web application designed to connect job seekers with employers. This project features a robust **Node.js/Express** backend, a **PostgreSQL** relational database, and a highly responsive **React/Vite** frontend styled with **Tailwind CSS** following premium Dribbble-inspired aesthetics.

---

## 🚀 Features

### **For Job Seekers**
- **Skill-Based Matching**: Advanced PostgreSQL views automatically match seeker skills against active job postings.
- **Dynamic Profiles**: Manage your professional identity, contact info, bio, and skills.
- **Application Tracking**: One-click "Apply" workflow with real-time application status updates (Applied, Interviewing, Offered, etc.).
- **Modern Search UI**: Deep search filters via a sleek sidebar and optimized job feed.

### **For Employers**
- **Company Management**: Establish and customize public company profiles.
- **Job Posting Pipeline**: Create, edit, and toggle the active status of job openings.
- **Applicant Dashboard**: Review candidates who applied to your specific roles and change their pipeline statuses dynamically.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| ----- | ------------ |
| **Frontend Setup** | React 18, Vite, Tailwind CSS, Lucide React (Icons) |
| **Frontend State** | React Context API, React Router v6, Axios |
| **Backend API** | Node.js, Express.js |
| **Database** | PostgreSQL (`pg`), Raw SQL Queries |
| **Security** | JWT (JSON Web Tokens), `bcrypt` (password hashing), `joi` (validation) |

---

## 📂 Project Structure

```text
gates-enterprise-2.0/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── api/            # Axios intercepts (JWT injection)
│   │   ├── components/     # Reusable UI (JobCards, Badges, Navbar)
│   │   ├── hooks/          # Custom hooks (useAuth, useFetch)
│   │   └── pages/          # Full page views
├── server/                 # Node.js Backend
│   ├── src/
│   │   ├── config/         # Postgres DB connections & Env logic
│   │   ├── controllers/    # Route handlers
│   │   ├── middleware/     # Auth guarding, RBAC roles, Error catching
│   │   └── routes/         # Express API definitions
├── schema.sql              # Database architecture initialization
├── package.json            # Root deployment / runner script
└── README.md               # You are here!
```

---

## ⚙️ How to Setup & Run Locally

### 1. Database Initialization
Ensure PostgreSQL is installed on your machine.
1. Create a database named `gates_db`.
2. Run the `schema.sql` script located in the root folder to initialize tables, ENUMs, and the matching View.

### 2. Environment Variables
Create `.env` files based on the structure below:
**`server/.env`**
```env
DATABASE_URL=postgresql://postgres:CLIMATESMART@localhost:5432/gates_db
JWT_SECRET=a_super_secret_key_123
PORT=5000
```

### 3. Start the Platform
This app is configured with a unified `concurrently` runner to start both servers instantly.
```bash
# 1. Install all dependencies across the entire project
npm run install-all

# 2. Fire it up!
npm run dev
```

- **Frontend**: Accessible at `http://localhost:5173`
- **Backend**: API accessible at `http://localhost:5000` (auto-proxied via Vite!)

---

*Designed and engineered for Gates Enterprises.*
