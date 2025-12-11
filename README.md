# FeaturesTree

A full-stack, Dockerized exam platform with role-based access, built with Django REST Framework, React.js, and PostgreSQL.

## Features

- **User Registration & Email Verification**: Secure sign-up with email activation.
- **JWT Authentication**: Secure login and protected API endpoints.
- **Role-Based Access**: Admin, Creator, and Student roles.
- **Admin Dashboard**: Manage users and exams with a modern UI.
- **Exam Management**: Create, edit, and view exams and questions.
- **CORS & API Security**: Configured for modern web clients.
- **Dockerized**: Easy local development and deployment.

## Tech Stack

- **Backend**: Django, Django REST Framework, PostgreSQL
- **Frontend**: React.js (Vite), Tailwind CSS, Axios
- **Auth**: JWT (djangorestframework-simplejwt)
- **DevOps**: Docker, docker-compose

## Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js (for frontend dev only)

### 1. Clone the Repository
```sh
git clone https://github.com/Remimaru/FeaturesTree.git
cd FeaturesTree
```

### 2. Environment Setup
- Copy `.env.example` to `.env` and adjust as needed (for secrets, DB, email, etc).

### 3. Build & Run All Services
```sh
docker-compose up --build
```
- Backend: http://localhost:8000
- Frontend: http://localhost (or http://localhost:3000 if running Vite dev server)
- Database: PostgreSQL (see `docker-compose.yml` for credentials)

### 4. Create Superuser (optional)
```sh
docker-compose exec backend python manage.py createsuperuser
```

### 5. Access the App
- Register a new user and activate via email
- Login as admin to access the dashboard

## Project Structure

```
FeaturesTree/
├── backend/
│   ├── apps/
│   │   ├── users/        # Custom user model, registration, JWT, admin APIs
│   │   ├── exams/        # Exam, question, option models & APIs
│   ├── core/             # Django settings, URLs
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── pages/        # React pages (auth, admin, etc)
│   │   ├── services/     # API helpers
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

## API Overview

- `POST /api/users/register/` — Register new user
- `POST /api/users/verify/` — Verify email with code
- `POST /api/users/token/` — Obtain JWT token (login)
- `POST /api/users/token/refresh/` — Refresh JWT token
- `GET /api/admin/users/` — List users (admin only)
- `GET /api/admin/exams/` — List exams (admin only)

## Customization
- Update email settings in `backend/core/settings.py` for production
- Adjust CORS and security settings as needed

## Development
- Frontend: `cd frontend && npm install && npm run dev`
- Backend: `cd backend && pip install -r requirements.txt && python manage.py runserver`

## License
MIT

---

**Contributions welcome!**

For issues, feature requests, or questions, open an issue or PR.
