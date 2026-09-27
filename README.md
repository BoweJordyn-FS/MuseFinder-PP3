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

## Getting Started

Clone the repo and move into it:

```bash
git clone https://github.com/BoweJordyn-FS/MuseFinder-PP3.git
cd MuseFinder-PP3
```

### 1. Environment variables

**Backend.** Copy the template and fill it in:

```bash
cp server/.env.dist server/.env && vim server/.env
```

- `DATABASEURL` — MongoDB connection string, e.g. `mongodb://localhost:27017/musefinder`
- `PORT` — port Express listens on. Defaults to `3001`
- `JWT_SECRET` — secret used to sign MuseFinder account tokens. **Required**; the server refuses to boot without it
- `SPOTIFY_CLIENT_ID` — from your Spotify Developer dashboard
- `SPOTIFY_CLIENT_SECRET` — from the same dashboard. Server-side only, never exposed to the client
- `SPOTIFY_REDIRECT_URI` — where Spotify sends the browser after login. Defaults to `http://127.0.0.1:3001/spotify/v1/callback`
- `CLIENT_URL` — where the backend sends the browser once Spotify tokens are stored. Defaults to `http://localhost:3000`

There is intentionally no fallback for `JWT_SECRET`. A committed default would let anyone forge a token.

**Frontend.** Create `client/.env.local` with the backend's address:

```bash
echo "NEXT_PUBLIC_API_URL=http://localhost:3001" > client/.env.local
```

**Spotify dashboard.** The redirect URI must be registered on your app under _Settings → Redirect URIs_, character for character. Spotify requires HTTPS except for the loopback address, so use `http://127.0.0.1:3001/spotify/v1/callback` for local development — `localhost` is rejected. Add the deployed `https://…/spotify/v1/callback` URL alongside it.

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
├── client/                    # Next.js 16 App Router frontend
│   └── src/
│       ├── app/               # Routes: /, /results, /profile, /playlists, /login, /signup
│       ├── components/        # Shared UI: Header, PostCard, Modal
│       ├── context/           # AuthContext — session state, login/signup/logout
│       ├── lib/api.js         # One axios instance; attaches the JWT to every request
│       └── services/          # auth.js, spotify.js, posts.js — one file per backend resource
└── server/                    # Express 5 API
    ├── config.js              # Reads and validates JWT_SECRET
    ├── controllers/           # Signup and login handlers, JWT issuing
    ├── middleware/            # requireAuth — Passport JWT guard for protected routes
    ├── models/                # User, Post, Playlist, SpotifyToken
    ├── routes/                # auth, posts, playlists, spotify
    └── services/              # passport.js (local + JWT strategies), spotify.js (app token + search)
```

## Links

- http://localhost:3000 | https://muse-finder-pp-3.vercel.app — the Next.js frontend, the primary user interface for MuseFinder
- http://localhost:3001 | https://musefinder-pp3.onrender.com — the Express API

The API is split into two namespaces:

- `/api/v1` — MuseFinder's own data: accounts, reviews, and playlists. None of it touches Spotify
- `/spotify/v1` — the middleware layer that fronts the Spotify Web API

Routes marked 🔒 require an `Authorization: Bearer <token>` header carrying a MuseFinder account JWT.

### Accounts — `/api/v1/auth`

- `POST /signup` — creates a user from a username, email and password. Returns a JWT (valid 7 days) and the user id. `422` on a duplicate username or email
- `POST /login` — authenticates with email and password. Returns a JWT and user id
- `GET /me` 🔒 — returns the signed-in user's id, username and email. The frontend calls this on page load to restore the session

### Spotify — `/spotify/v1`

**Authorization Code flow.** The backend authenticates with Spotify on the user's behalf and stores the resulting tokens in MongoDB (`SpotifyToken` collection).

- `GET /login` — redirects the browser to Spotify's consent screen
- `GET /callback` — Spotify sends the browser back here. Verifies `state`, exchanges the code for tokens, saves them, redirects to `CLIENT_URL`
- `GET /refresh_token` — uses the stored refresh token to get a new access token. Access tokens expire after one hour
- `GET /status` — `{ status: true }` if a valid, unexpired token is stored in the database
