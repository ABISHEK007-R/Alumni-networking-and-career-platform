# Alumni Connect AI

This repository contains the React + Vite frontend and the Java 17 + Spring Boot authentication backend for Alumni Connect AI.

## Project structure

- `src/pages/Login.jsx` and `src/pages/Register.jsx` call the backend authentication API with Axios.
- `src/pages/student/` contains the existing student dashboard and shared dashboard layout.
- `src/pages/AlumniDashboard.jsx` is the role-based alumni placeholder dashboard.
- `backend/` contains the Spring Boot application, JWT security, auth controller/service, JPA user entity, and H2 configuration.
- `backend/src/main/resources/application.properties` documents the supported database and JWT environment variables.

## Backend database

The backend uses a persistent H2 file database at `backend/data/alumni_connect`. The database and tables are created automatically on startup. To override the defaults, set these environment variables:

```powershell
$env:DB_URL = "jdbc:h2:file:./data/alumni_connect;AUTO_SERVER=TRUE"
$env:DB_USERNAME = "sa"
$env:DB_PASSWORD = ""
$env:JWT_SECRET = "replace-with-a-random-secret-at-least-32-characters"
$env:FRONTEND_URL = "http://localhost:5173"
```

## Start the backend

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

The wrapper downloads Maven automatically if needed. The API runs at `http://localhost:8080` by default. Set `$env:PORT` if you need another port.

## Start the frontend

From the repository root:

```powershell
npm install
npm run dev
```

The frontend calls `http://localhost:8080/api` by default. Set `VITE_API_URL` in a root `.env` file if the backend is hosted elsewhere.

The student dashboard is available at `/student/dashboard`. The previous `/student` path remains as a compatibility route.

Authentication endpoints are:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/profile` with `Authorization: Bearer <token>`

The frontend stores the JWT in `localStorage`, protects role-based routes, restores the session after refresh, and clears the token on logout.

## Original Vite notes

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
