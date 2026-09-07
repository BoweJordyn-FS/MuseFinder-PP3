# MuseFinder

## Project Overview

MuseFinder is a music discovery and review app built on the [Spotify Web API](https://developer.spotify.com/documentation/web-api/). Users search globally for artists, albums, and tracks, then write reviews on the work they love (or can't stand).

## Prerequisites

- Node.js >= v18.18.0 (developed on v26.3.0)
- npm >= v9.0.0 (developed on v12.0.2)
- MongoDB >= v6.0 (a local install or a MongoDB Atlas connection string)
- A Spotify Developer account with a registered app, for the Client ID and Client Secret
- Chrome / Firefox / Safari / Edge >= latest 2 major versions
- Homebrew >= v3.4.3 (macOS only, if you're installing MongoDB locally)

## Other Considerations

Ports `3000` and `3001` need to be free on the host machine. Check that nothing else is listening on them:

```bash
sudo lsof -nP -i4TCP:3000 | grep LISTEN && sudo lsof -nP -i4TCP:3001 | grep LISTEN
```

If either command prints a result, stop that process before continuing.

MongoDB also has to be running before the backend will connect. On macOS with Homebrew:

```bash
brew services start mongodb-community
```

## Getting Started

Clone the repo and move into it:

```bash
git clone https://github.com/BoweJordyn-FS/MuseFinder-PP3.git
cd MuseFinder-PP3
```

### 1. Environment variables

The backend reads its configuration from a `.env` file. Copy the template and fill it in:

```bash
cp server/.env.dist server/.env && vim server/.env
```

- `DATABASEURL` — MongoDB connection string, e.g. `mongodb://localhost:27017/musefinder`
- `PORT` — port Express listens on. Defaults to `3001`
- `JWT_SECRET` — secret used to sign MuseFinder account tokens. **Required**; the server refuses to boot without it
- `SPOTIFY_CLIENT_ID` — from your Spotify Developer dashboard
- `SPOTIFY_CLIENT_SECRET` — from the same dashboard. Server-side only, never exposed to the client

There is intentionally no fallback for `JWT_SECRET`. A committed default would let anyone forge a token.

### 2. Install dependencies

Each application manages its own `node_modules`, so install them separately:

```bash
cd server && npm install
cd ../client && npm install
```

### 3. Run the applications

You'll need two terminal sessions, one per app.

**Express (backend):**

```bash
cd server
node server.js
```

**Next.js (frontend):**

```bash
cd client
npm run dev
```

## Project Structure

```
MuseFinder-PP3/
├── client/                 # Next.js 16 App Router frontend
│   └── src/
│       ├── app/            # Routes: / (search + discover), /results, /profile
│       ├── components/     # Shared UI, e.g. Header
│       └── app/globals.css # Tailwind v4 entry point
└── server/                 # Express 5 API
    ├── config.js           # Reads and validates JWT_SECRET
    ├── controllers/        # Signup and login handlers, JWT issuing
    ├── middleware/         # requireAuth — Passport JWT guard for protected routes
    ├── models/             # Mongoose User schema, bcrypt password hashing
    ├── routes/             # auth.js (live) and spotify.js (scaffolded)
    └── services/           # Passport local + JWT strategies
```

## Links

- http://localhost:3000 | https://muse-finder-pp-3.vercel.app — the Next.js frontend, the primary user interface for MuseFinder
- http://localhost:3001 | https://musefinder-pp3.onrender.com/ — the Express API
- http://localhost:3001/spotify/v1/auth — account middleware for MuseFinder users

### Account endpoints (working)

- `POST /spotify/v1/signup` — creates a user from an email and password. Returns a JWT and the new user id. Rejects duplicate emails with a `422`
- `POST /spotify/v1/login` — authenticates an existing user through Passport's local strategy. Returns a JWT and user id

Protected routes read the token from an `Authorization: Bearer <token>` header.

### Spotify middleware (in progress)

`server/routes/spotify.js` is scaffolded but not yet mounted. These are the planned endpoints:

- `GET /spotify/v1/status` — returns `true` if the server currently holds a valid, unexpired Spotify token. `false` otherwise
- `GET /spotify/v1/login` — requests a fresh app token from Spotify via the Client Credentials flow and caches it server-side
- `GET /spotify/v1/search` — takes a `?q=` query, calls Spotify's search endpoint with the cached token, and returns JSON for artists, albums, and tracks
