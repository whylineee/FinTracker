# FinTracker

Next.js frontend + Django backend (Admin + DRF + JWT).

## Project Structure

- `src/` - Next.js App Router frontend
- `backend/` - Django backend with models, admin, and REST API

## 1) Run Django backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_finance
python manage.py createsuperuser
python manage.py runserver
```

Backend URLs:
- Admin: [http://127.0.0.1:8000/admin](http://127.0.0.1:8000/admin)
- JWT token: `POST http://127.0.0.1:8000/api/auth/token/`
- Register: `POST http://127.0.0.1:8000/api/auth/register/`

## 2) Run Next.js frontend

In a second terminal:

```bash
cd /Users/marko/Desktop/Projects/FInTracker
npm install
DJANGO_BASE_URL=http://127.0.0.1:8000 npm run dev
```

Frontend URL:
- [http://127.0.0.1:3000](http://127.0.0.1:3000)
- Login page: [http://127.0.0.1:3000/login](http://127.0.0.1:3000/login)
- Register page: [http://127.0.0.1:3000/register](http://127.0.0.1:3000/register)

Use your existing account credentials, or create a new account at `/register`.

## API Endpoints (authenticated with JWT)

- `POST /api/auth/token/`
- `POST /api/auth/token/refresh/`
- `POST /api/auth/register/`
- `GET /api/dashboard/overview/`
- `GET,POST /api/budgets/`
- `GET,POST /api/transactions/`
- `GET /api/card-activities/`

## Useful backend commands

```bash
python manage.py makemigrations
python manage.py migrate
python manage.py seed_finance
python manage.py check
```
