# PromptVessel Proxy Server

Keeps your Gemini and EmDash API keys off the frontend. The frontend
calls this server, and this server calls Gemini / EmDash using the real
keys, which live only in `.env` (never sent to the browser).

## Setup

```bash
cd proxy-server
npm install
```

Open `.env` and paste in your **new** Gemini key and EmDash token
(instructions on generating these are in the main chat response).

## Run

```bash
npm start
```

You should see:
```
✅ PromptVessel proxy server running on http://localhost:3001
```

Keep this running in its own terminal, alongside:
- `backend` (EmDash, port 4321): `npm run dev` inside `backend/`
- `frontend` (Vite, port 5173): `npm run dev` inside `frontend/`

All three need to be running at the same time for the site to work.
