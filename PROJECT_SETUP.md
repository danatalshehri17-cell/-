# FeaturesTree Project Structure and Setup Documentation

## Overview
This project is a full-stack web application using Django (REST API), PostgreSQL, React.js (Vite), and Docker for containerization. The structure is modular for scalability and maintainability.

---

## Project Structure
```
FEATURESTREE/
├── docker-compose.yml          # Orchestrates Django, Postgres, React, Nginx 
├── backend/                    # Django Project
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── manage.py
│   ├── core/                   # Main project settings (settings.py, urls.py)
│   └── apps/                   # Modular app design
│       ├── users/              # Auth, Roles, Subscription
│       ├── exams/              # Domains, Questions, Exam Logic
│       ├── analytics/          # Attempts, Scores, Heatmaps
│       └── ai_engine/          # OpenAI integration & prompt logic
└── frontend/                   # React + Vite Project
    ├── Dockerfile
    ├── package.json
    ├── tailwind.config.js      # UI Styling config
    └── src/
        ├── assets/
        ├── components/
        │   ├── common/
        │   └── charts/
        ├── context/
        ├── hooks/
        ├── pages/
        │   ├── auth/
        │   ├── creator/
        │   └── student/
        ├── services/
        └── utils/
```

---

## Backend Setup (Django)
 **User Registration & Authentication**:
   - Custom user model with roles, subscription tiers, phone, 2FA, verification code, and is_verified flag.
   - Registration API (`/users/register/`): Creates inactive user, generates verification code, sends email.
   - Verification API (`/users/verify/`): Activates user after correct code.
   - Serializers for registration and verification.
   - Utility functions for OTP generation and email sending (SMTP).
   - Email server configured in `core/settings.py` for transactional emails.
   - All endpoints and logic are ready for production use.
   - Extendable for login, password reset, and more.
   - See `apps/users/` for implementation details.
- **Database**: PostgreSQL, configured via environment variables in `docker-compose.yml`.

## Frontend Setup (React + Vite)
- **Dockerfile**: Multi-stage build (Node for build, Nginx for serving static files).
- **package.json**: React, Vite, Tailwind dependencies and scripts.
- **tailwind.config.js**: Tailwind CSS configuration.
- **src/**: Contains assets, components, context, hooks, pages, services, utils.

## Docker Compose
- Orchestrates backend, frontend, and database containers.
- Ensures services are networked and persistent.

## How to Start Development
1. **Build and Start Containers**
   - Run: `docker-compose up --build`
2. **Backend**
   - Code Django REST API in `backend/apps/`
   - Configure settings in `backend/core/settings.py`
3. **Frontend**
   - Code React UI in `frontend/src/`
   - Use Tailwind for styling
   - Connect to backend via API services

## Next Steps
- Add Django models, views, serializers in each app.
- Add React components and pages as needed.
- Write custom hooks and context for state management.
- Document new features and changes in this file.

---

## Database Setup (PostgreSQL)

# PostgreSQL Database Setup Documentation

## Overview
This project uses PostgreSQL as the main database for the Django backend. The database is managed as a Docker container and is configured for persistent storage and secure access.

---

## Configuration
- **Docker Compose Service Name:** `db`
- **Image:** `postgres:16-alpine`
- **Container Name:** `postgres_db`
- **Environment Variables:**
   - `POSTGRES_DB`: Database name (default: `mydjangoappdb`)
   - `POSTGRES_USER`: Username (default: `mdhazz`)
   - `POSTGRES_PASSWORD`: Password (default: `M&z2!not`)
- **Volume:**
   - `postgres_data:/var/lib/postgresql/data/` (persistent storage)
- **Network:**
   - Accessible to Django backend via service name `db` on port `5432`.

---

## How It Works
- The database container is started automatically by Docker Compose.
- Data is stored persistently in the `postgres_data` volume, so it survives container restarts.
- The Django backend connects to the database using the credentials and host defined in `docker-compose.yml` and `core/settings.py`.
- For local development, you can uncomment the `ports` section to expose PostgreSQL on your host machine (default: `5432`).

---

## Usage
1. **Start All Services**
    - Run: `docker-compose up --build`
2. **Database Initialization**
    - On first run, the database and user are created automatically.
    - Django migrations will set up tables and schema.
3. **Persistent Data**
    - All data is stored in the Docker volume `postgres_data`.
    - To remove all data, delete the volume: `docker volume rm featurestree_postgres_data`

---

## Security Notes
- Change the default password before deploying to production.
- Use environment files for secrets in production.
- Restrict database access to only necessary services.

---

## References
- [PostgreSQL Docker Image](https://hub.docker.com/_/postgres)
- [Django Database Settings](https://docs.djangoproject.com/en/4.2/ref/settings/#databases)
- [Docker Volumes](https://docs.docker.com/storage/volumes/)

---

*Update this documentation as you add new database features or change configuration.*
- [Django Documentation](https://docs.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Docker](https://docs.docker.com/)

---

## Email Setup (SMTP)
- Configured in `backend/core/settings.py`.
- Uses SMTP server: `mail.abdulazizdhamri.xyz` (port 465, SSL).
- Credentials and sender: `noreply@abdulazizdhamri.xyz`.
- To test email, use Django shell:
  ```python
  from django.core.mail import send_mail
  send_mail('Test', 'Body', 'noreply@abdulazizdhamri.xyz', ['your@email.com'], fail_silently=False)
  ```
- If you see `[Errno 101] Network is unreachable`, check Docker/container network and firewall.
- For TLS, use port 587 and set `EMAIL_USE_TLS = True`.

---

## CORS Setup
- Uses `django-cors-headers` for cross-origin requests.
- Enabled in `INSTALLED_APPS` and `MIDDLEWARE` in `core/settings.py`.
- `CORS_ALLOW_ALL_ORIGINS = True` for development (restrict in production).

---

## Registration Workflow
1. User submits registration form (frontend).
2. Backend checks if user exists:
   - If not, creates inactive user, generates code, sends email.
   - If exists and not verified, resends code.
   - If exists and verified, returns error.
3. User enters code to verify account.
4. Backend activates user on correct code.

---

## Troubleshooting
- **500 Internal Server Error:**
  - Check backend logs: `docker-compose logs backend`
  - Common causes: email server unreachable, duplicate email, database issues.
- **CORS errors:**
  - Ensure CORS headers are set and backend is accessible on port 8000.
- **Email not sending:**
  - Test with Django shell, check SMTP/firewall settings.
- **Database access:**
  - Use: `docker exec -it postgres_db psql -U mdhazz -d mydjangoappdb`
  - List users: `SELECT * FROM apps_users_user;`
  - Delete user: `DELETE FROM apps_users_user WHERE email = 'user@example.com';`

---

## Custom User Model (Django)

- This project uses a custom user model defined in `apps/users/models.py` as `User` (inherits from `AbstractUser`).
- The custom user model includes:
  - Roles (Admin, Creator, Student)
  - Subscription tiers (Free, Premium)
  - Phone number, 2FA, verification code, is_verified flag, and more
- **Django setting:**
  - `AUTH_USER_MODEL = 'users.User'` is set in `core/settings.py` to ensure all authentication and user logic uses the custom model.
- **Best Practice:**
  - Always use `get_user_model()` from `django.contrib.auth` to reference the user model in your code (views, serializers, etc.).
  - Do not import the user model directly from `django.contrib.auth.models.User`.
- **Database Table:**
  - All user data is stored in the `users_user` table (not the default `auth_user`).
- **Migrations:**
  - If you change the user model, always make and apply migrations.
- **Admin:**
  - The custom user model is registered in the Django admin for management.

---

*This documentation covers everything created and set up so far. Update as you build further features.*
