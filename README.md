# Three-Tier Notes App

**3 containers**, each running independently: `frontend` (Nginx serving static HTML/JS), `backend` (Express API), and `db` (MongoDB).

## Run it

```bash
cd three-tier
docker compose up --build
```

Open http://localhost:3000 (frontend). The frontend's JavaScript calls the backend directly at http://localhost:5000.

## What to notice
- `docker compose ps` will show **3 services**: `frontend`, `backend`, `db`.
- The frontend never talks to the database directly — only the backend does.
- Notice the frontend's fetch calls use `http://localhost:5000` (the browser needs the port published on your machine), while the backend talks to Mongo using `mongodb://db:27017` (containers talk to each other via service names on Docker's internal network).
## Live-reload dev setup (bind mounts)

The `docker-compose.yml` now includes bind mounts so you can edit code and see changes without rebuilding:

- **`frontend`**: `./frontend:/usr/share/nginx/html` — Nginx just serves whatever file is on disk, so editing `index.html` and refreshing your browser shows the change instantly. No extra tooling needed since it's plain HTML.
- **`backend`**: `./backend:/app` — your local `server.js` becomes the same file the container sees. Combined with `command: npx nodemon server.js`, nodemon watches for file changes and auto-restarts the Node process for you.
- **`/app/node_modules`** (backend only) — this is an anonymous volume that protects the container's own installed `node_modules` from being overwritten by your local machine's `./backend` folder (which may not have `node_modules` installed, or has ones built for a different OS).

With this setup: `docker compose up --build` once to start everything, then just edit `server.js` or `index.html` and save — no more rebuilding or restarting needed during development.

**Note:** this bind-mount setup is for local development only. When you push to Docker Hub and deploy (see the "prod" compose file discussed earlier), you go back to a plain `image:`-based file with no bind mounts, since the production server doesn't have your source code folder to bind mount from.

