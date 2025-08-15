# SeekKrr 

## Where to place static assets
All images/SVGs live in **`frontend/src/assets/`**. Replace them with your versions if needed:
- `background.jpg` — the hero background
- `SeekKrr logo.svg` — the logo at the top
- `cancel.svg` — the modal close button

## Run it locally

### 1) API
```bash
cd backend
python -m venv .venv && source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python app.py               # launches http://localhost:5000
```

### 2) Frontend
```bash
cd ../frontend
npm i
npm run dev                 # http://localhost:5173
```

The frontend proxies calls from `/api/...` to `http://localhost:5000` during development.

## Build for production
```bash
cd frontend
npm run build
```
Upload `frontend/dist` to a static host (Netlify/Vercel/Nginx). Keep the Flask API on `https://your-api...`.

## DB
SQLite file: `backend/seekkrr.db`. The table `interests` is created automatically on first run.
