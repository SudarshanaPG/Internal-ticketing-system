# Internal Ticketing System

Full-stack ticketing app built with Django REST Framework (JWT auth), Cloudinary attachments, and a vanilla JS frontend. Supports Admin and User roles with scoped ticket access, filtering, search, pagination, and Tawk.to chat widget on every page.

## Tech Stack
- Backend: Django 5 + Django REST Framework + JWT (djangorestframework-simplejwt)
- Storage: Cloudinary via `django-cloudinary-storage`
- Frontend: Vanilla HTML/CSS/JS (no external template)
- Chat: Tawk.to default widget

Frontend template source: N/A (custom-built for this project)

## Project Structure
- `backend/` – Django project (`ticketsys`) and tickets app
- `frontend/` – Static frontend pages (`index.html`, `submit.html`, `tickets.html`, `ticket.html`)

## Backend Setup
1) Install deps (use a venv):
```bash
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Linux/macOS
pip install -r backend/requirements.txt
```
2) Configure environment:
   - Copy `backend/.env.example` to `backend/.env` and fill values.
   - Required env vars:
     - `DJANGO_SECRET_KEY`
     - `DJANGO_DEBUG` (true/false)
     - `DJANGO_ALLOWED_HOSTS` (comma-separated)
     - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
3) Apply migrations:
```bash
python backend/manage.py migrate
```
4) Create an admin (Admin role = `is_staff`):
```bash
python backend/manage.py createsuperuser
```
5) Run the API:
```bash
python backend/manage.py runserver
```

## Frontend Setup
- The frontend expects the API at `http://localhost:8000/api` (override by setting `localStorage.setItem('API_BASE_URL', 'http://your-api:8000/api')` in the browser console).
- Serve the static files (examples):
```bash
# Option A: Python http server
python -m http.server 3000 -d frontend
# Option B: npx serve
npx serve frontend
```
Open `http://localhost:3000/index.html` (or the port you choose).

## Roles & Access
- **Admin** (`is_staff=True`): view all tickets, filter/search/paginate, update status, access Django admin.
- **User**: create tickets, view only own tickets, cannot update status.

## API Endpoints
- `POST /api/auth/login` – JWT login (returns access/refresh + user info)
- `POST /api/auth/refresh` – refresh access token
- `GET /api/auth/me` – current user
- `GET /api/tickets` – list tickets (role-aware; filters: `category`, `status`, `search`, `page`)
- `POST /api/tickets` – create ticket (multipart for attachments)
- `GET /api/tickets/:id` – ticket detail (owner or admin)
- `PATCH /api/tickets/:id/status` – update status (Admin only)

Ticket model: `title`, `description`, `category` (Technical/Financial/Product), `status` (New/Under Review/Resolved), `attachment` (Cloudinary), `createdBy`, `createdAt`.

## Cloudinary
- Set the Cloudinary vars in `.env`. `DEFAULT_FILE_STORAGE` is configured to use Cloudinary, so attachments automatically upload there.
- For local tests without attachments you can skip the file field; uploads require valid credentials.

## Chat Integration (Tawk.to)
- Edit `frontend/js/chat.js` and replace `YOUR_TAWK_PROPERTY_ID` with your Tawk property id (widget id defaults to `default`).
- Reload any frontend page; the Tawk widget should appear on the bottom-right. Verify by opening the page and confirming the chat bubble shows.

## Testing the APIs Quickly
- Login:
```bash
curl -X POST http://localhost:8000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"admin\",\"password\":\"password\"}"
```
- Create a ticket (with auth token):
```bash
curl -X POST http://localhost:8000/api/tickets ^
  -H "Authorization: Bearer <ACCESS_TOKEN>" ^
  -F "title=Example" -F "category=Technical" -F "description=Details here"
```
- List tickets with filters:
```bash
curl -H "Authorization: Bearer <ACCESS_TOKEN>" "http://localhost:8000/api/tickets?status=New&search=login"
```
- Update status (admin):
```bash
curl -X PATCH http://localhost:8000/api/tickets/1/status ^
  -H "Authorization: Bearer <ACCESS_TOKEN>" ^
  -H "Content-Type: application/json" ^
  -d "{\"status\":\"Resolved\"}"
```

## Frontend Notes
- `index.html` – login; stores JWT + user info in `localStorage`.
- `submit.html` – ticket creation with optional attachment upload to Cloudinary.
- `tickets.html` – list with search, category/status filters, pagination (server-side), links to details.
- `ticket.html` – full details, attachment preview, admin-only status update control.
- Custom styling built for this project (no external template).

## Verification Checklist
- Auth: login returns JWT, `/api/auth/me` returns user, non-auth requests to ticket endpoints are rejected.
- Tickets: users see only their tickets; admins see all; filters/search/pagination work.
- Status updates: only Admin (is_staff) can PATCH `/status`.
- Attachments: upload a file on `submit.html` and confirm it appears via the Cloudinary URL in details.
- Chat: Tawk widget visible on every page after property id is set.

## Live Demo
Frontend (Netlify): `https://neon-babka-907659.netlify.app/`

Backend (Render):
- API: `https://internal-ticketing-system-qoyb.onrender.com/api/`
- Admin: `https://internal-ticketing-system-qoyb.onrender.com/admin/`

Notes:
- The Render free tier may “sleep”, so the first request can take ~30–60 seconds.
- The backend root URL `/` will show 404 by design (only `/api/` and `/admin/` exist).
