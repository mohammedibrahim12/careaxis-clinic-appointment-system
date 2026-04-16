# CareAxis Clinic Appointment System

CareAxis is a zero-cost MERN stack clinic appointment system built for a classroom course project. It supports three roles:

- `patient` can register, browse doctors, and book appointments
- `doctor` can review appointments, add notes, and update statuses
- `admin` can create doctor accounts, manage schedules, and monitor dashboard metrics

## Stack

- Frontend: `React + Vite + React Router + Recharts`
- Backend: `Node.js + Express + Mongoose + JWT`
- Database: `MongoDB Community Server` on localhost

## Project Structure

```text
.
|-- client
|   |-- src
|   |   |-- api
|   |   |-- components
|   |   |-- context
|   |   |-- pages
|   |   `-- utils
|-- server
|   |-- src
|   |   |-- config
|   |   |-- controllers
|   |   |-- middleware
|   |   |-- models
|   |   |-- routes
|   |   |-- scripts
|   |   `-- utils
|-- package.json
`-- README.md
```

## Local Setup

1. Install `MongoDB Community Server` and make sure MongoDB is running locally on `mongodb://127.0.0.1:27017`.
2. From the project root, install dependencies:

```bash
npm install
npm install --prefix server
npm install --prefix client
```

3. The backend already includes a development `.env` file in `server/.env`.
4. Optional: load demo records for a nicer walkthrough:

```bash
npm run seed
```

5. Start the full stack app:

```bash
npm run dev
```

6. Open `http://localhost:5173`.

## Demo Credentials

The server auto-creates the admin account on first start:

- Admin: `admin@careaxis.local` / `Admin@123`

If you run `npm run seed`, you also get:

- Doctor: `asha@careaxis.local` / `Pass@123`
- Patient: `riya@careaxis.local` / `Pass@123`

## Key Features

- JWT authentication and role-based routing
- Public doctor directory with schedule snippets
- Patient appointment booking with doctor availability validation
- Doctor workflow for status updates and consultation notes
- Admin dashboard with appointment trends and doctor management
- Responsive UI with separate public and logged-in layouts

## Verification

The following checks passed during setup:

- `npm run lint` in `client`
- `npm run build` in `client`
- `node --check` on every server `.js` file

MongoDB could not be runtime-tested in this environment because `mongod` is not currently available on PATH.
