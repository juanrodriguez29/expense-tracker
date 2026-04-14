# Expense Tracker — Build Notes

## Project Overview
A full stack expense tracking app where users can add, edit, delete and filter expenses by category and month.

**Live URLs:**
- Frontend: [your Vercel URL]
- Backend: [your Render URL]

---

## Tech Stack

### Frontend
- **React** — UI library for building components
- **Vite** — build tool and dev server, faster than Create React App
- **Tailwind CSS** — utility-first CSS framework, no separate CSS files needed

### Backend
- **Node.js** — JavaScript runtime that runs outside the browser
- **Express** — framework for building API routes in Node
- **PostgreSQL** — production database (hosted on Render)
- **SQLite** — local development database (no setup needed)

### Deployment
- **Vercel** — hosts the React frontend, auto-deploys on every git push
- **Render** — hosts the Express backend and PostgreSQL database
- **GitHub** — source control, connects Vercel and Render to auto-deploy

---

## Architecture
React (Vercel) → fetch() → Express API (Render) → PostgreSQL (Render)
The frontend never talks to the database directly.
The backend acts as a middleman — it receives requests, queries the database, and sends data back.

---

## Phase 1 — Frontend

### Component Structure
App.jsx — main component, holds all state and API calls
├── Balance.jsx — shows total spent
├── ExpenseForm.jsx — form to add new expense
├── FilterBar.jsx — filter by month and category
├── ExpenseList.jsx — renders filtered list
│   └── ExpenseItem.jsx — single expense row with delete
├── EditExpenseModal.jsx — modal for editing an expense
└── CategoryPieChart.jsx — donut chart showing spending by category
└── CategoryTotals.jsx — text breakdown of category totals

### Key Concepts
- **useState** — stores expenses, loading state, error state, filter values
- **useEffect** — fetches expenses from the API when the component mounts
- **Controlled inputs** — form inputs whose values are controlled by state
- **Props** — passing data and functions down to child components
- **Conditional rendering** — showing loading/error states before data arrives
- **Array methods** — .map() to render lists, .filter() to filter expenses

### Environment Variables
Vite uses `import.meta.env.VITE_*` for environment variables.
Never hardcode API URLs — use env variables so the same code works locally and in production.

## Phase 2 — Backend

### API Routes
GET    /expenses        — fetch all expenses, ordered by date DESC
POST   /expenses        — insert a new expense
PUT    /expenses/:id    — update an expense by id
DELETE /expenses/:id    — delete an expense by id

### Key Concepts
- **REST API** — a convention for structuring API routes using HTTP methods (GET, POST, PUT, DELETE)
- **async/await** — handling asynchronous database queries
- **try/catch** — error handling in async functions
- **req.body** — data sent from the frontend in POST/PUT requests
- **req.params** — URL parameters like `:id`
- **res.json()** — sending JSON data back to the frontend

### Database
- **SQL** — language for talking to databases
- **PostgreSQL** uses `$1, $2` placeholders for safe queries
- **SQLite** uses `?` placeholders
- **Adapter pattern** — wrote a wrapper so the same Express code works with both databases

### Environment Variables
Node uses `process.env.*` for environment variables.
Never commit `.env` files to GitHub — add them to `.gitignore`.

---

## Phase 3 — Authentication (in progress)

### Goal
Each user has their own private expenses. Nobody else can see or modify them.

### Plan
- Use **Supabase Auth** for login/signup
- Each request from React includes a **JWT token**
- Express **middleware** verifies the token before allowing access
- Each expense row has a **user_id** column linking it to a user

### New Concepts
- **JWT (JSON Web Token)** — a secure token that proves who you are
- **Middleware** — functions that run before route handlers in Express
- **Row level security** — filtering database rows by user_id

---

## Concepts Glossary

| Concept | What it means |
|---|---|
| Component | A reusable piece of UI in React |
| State | Data that changes over time and triggers re-renders |
| Props | Data passed from parent to child component |
| Hook | A special React function (useState, useEffect etc) |
| API | A set of routes your backend exposes for the frontend to call |
| REST | A convention for API design using HTTP methods |
| JWT | A token that proves who you are, sent with every request |
| Middleware | Express functions that run before route handlers |
| Environment variable | A secret value stored outside your code |