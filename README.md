# Skyframe Aerial Studio – Drone Filming Agency Platform

A white-label, full-stack web application for a certified drone filming & aerial cinematography studio
(aerial commercials, FPV flythroughs, real-estate footage, thermal inspections and 3D mapping).
The codebase is in English; all user-facing copy and seeded content is in Slovak.

```
.
├── backend/    Django 6 + Django REST Framework API and Slovak admin
└── frontend/   Angular 22 (standalone components, Signals, zoneless) + modular SCSS
```

## Requirements

- Python 3.11+
- Node.js 20+ and npm (Angular CLI is installed locally via `npm install`)

## 1. Backend (`/backend`)

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate            # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env                 # optional – defaults work for local dev

python manage.py migrate
python manage.py seed_data           # idempotent demo content (safe to re-run)
python manage.py createsuperuser     # account for /admin
python manage.py runserver           # http://localhost:8000
```

- **Admin:** <http://localhost:8000/admin/> – manage projects, services, fleet, pilots and incoming
  quote requests (filter by status, bulk "Označiť ako vybavené" action).
- **API root:** <http://localhost:8000/api/>
- **Tests:** `python manage.py test aerial`
- `python manage.py seed_data --flush` wipes catalogue data first (quote requests are kept).

### API endpoints

| Method | Endpoint                   | Notes                                                                 |
| ------ | -------------------------- | --------------------------------------------------------------------- |
| GET    | `/api/categories/`         | Includes `project_count` and `service_count`                          |
| GET    | `/api/portfolio/`          | `?category=<slug>`, `?featured=true`, `?search=`, `?ordering=title`   |
| GET    | `/api/portfolio/<slug>/`   | Full dossier: embed URL, drone platform, airspace clearance, summary  |
| GET    | `/api/services/`           | `?category=<slug>`, `?featured=true`                                  |
| GET    | `/api/fleet/`              | Drone fleet and camera payloads                                        |
| GET    | `/api/pilots/`             | Licensed UAV pilots and camera operators                              |
| POST   | `/api/quotes/`             | Quote & airspace check request; validated, rate-limited, write-only   |

### Production (PostgreSQL)

Set environment variables (or a `.env` file):

```
DJANGO_DEBUG=False
DJANGO_SECRET_KEY=<long random string>
DJANGO_ALLOWED_HOSTS=example.sk,www.example.sk
DATABASE_URL=postgres://user:password@host:5432/dbname
CORS_ALLOWED_ORIGINS=https://example.sk
CSRF_TRUSTED_ORIGINS=https://example.sk
```

Then `pip install -r requirements-prod.txt` (adds `psycopg` and `gunicorn`),
`python manage.py migrate` and `python manage.py collectstatic`.

## 2. Frontend (`/frontend`)

```bash
cd frontend
npm install
npm start                            # ng serve → http://localhost:4200
npm run build                        # production build → dist/frontend
```

The API URL lives in `src/environments/environment.ts` (dev: `http://localhost:8000/api`).
The production build swaps in `environment.production.ts`, which expects the API on the same
domain under `/api` (reverse proxy). Change it to an absolute URL if the backend is hosted elsewhere.

### Routes

| Path                 | Page                                                              |
| -------------------- | ----------------------------------------------------------------- |
| `/`                  | Hero + showreel, featured projects, services, estimator, trust, reviews |
| `/portfolio`         | Filterable gallery (`?kategoria=<slug>`), search, in-page video   |
| `/portfolio/:slug`   | Flight dossier: video, telemetry bar, story, deliverables, CTA    |
| `/sluzby-a-flotila`  | Services breakdown and drone fleet                                |
| `/legislativa-a-tim` | EASA / Dopravný úrad SR overview, pilots, FAQ accordion           |
| `/dopyt`             | Quote & airspace check form, pre-fillable via query params        |

Quote form query params: `style` (`cinema|fpv|combo|inspection`), `duration`
(`short|half_day|full_day`), `env` (`priroda|mesto|interier`), `post` (`raw|edit`) and `ref`
(project title for "similar shots" requests).

## Rebranding for a new client

1. **Business details & copy:** edit `frontend/src/app/core/config/site.config.ts` – agency name,
   wordmark, tagline, hero, showreel URL, chief pilot phone, booking email, address, IČO/DIČ,
   operator ID, insurance, social links, trust metrics and testimonials.
2. **Colours & fonts:** adjust tokens in `frontend/src/styles/_variables.scss`, or override the CSS
   custom properties on `:root` (`--color-accent`, `--color-bg`, …) defined in `_base.scss`.
3. **Prices:** the estimator's orientational pricing is in
   `frontend/src/app/core/estimator/estimator.ts`.
4. **Content:** manage projects, services, fleet and pilots in Django admin (or edit
   `backend/aerial/management/commands/seed_data.py` for a new demo dataset).
5. Replace `frontend/public/favicon.svg` and the `<title>`/description in `frontend/src/index.html`.

> Demo videos and images are placeholders (public YouTube/Vimeo clips and Unsplash photos). Replace
> them with the studio's own footage before going live. Company IDs and the operator ID in
> `site.config.ts` are fictitious.
