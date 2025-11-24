# Walkthrough - Docker Fixes & API Proxy

## Issues Resolved

1.  **Platform Mismatch**: Added `platform: linux/arm64` to `docker-compose.yml` to support Apple Silicon.
2.  **API Port Mismatch**: The NestJS API was listening on port 3000 (default), but `docker-compose` and `API_URL` expected port 8080. Added `PORT=8080` to the `api` service environment.
3.  **Database Migrations**: The database was empty, causing 500 errors. Ran `npx prisma migrate deploy` to create tables.
4.  **405 Method Not Allowed**: Next.js `standalone` mode baked in the build-time `API_URL` (which was undefined/defaulting to localhost:3000) into `next.config.js`. Replaced `next.config.ts` rewrites with `middleware.ts` to ensure `API_URL` is resolved at runtime.

## Verification Results

### 1. Container Status
All containers are up and running:
```bash
docker-compose ps
```

### 2. API Connectivity
Verified that the Web container can reach the API container:
```bash
docker exec lexora-web-1 wget -qO- http://api:8080/books
# Output: [] (or list of books)
```

### 3. Proxy Functionality
Verified that `http://localhost:3001/api/books` correctly proxies to the backend API:

**POST Request:**
```bash
curl -X POST -H "Content-Type: application/json" -d '{"title":"Walkthrough Book", "author":"Test"}' http://localhost:3001/api/books
```
**Response:**
```json
{"id":"...","title":"Walkthrough Book","author":"Test",...}
```

**GET Request:**
```bash
curl http://localhost:3001/api/books
```
**Response:**
```json
[{"id":"...","title":"Walkthrough Book",...}]
```

## Changes Made

-   Modified `docker-compose.yml`
-   Modified `apps/web/next.config.ts` (removed rewrites)
-   Created `apps/web/middleware.ts` (added dynamic rewrites)
-   Ran database migrations manually.

The application is now fully functional locally with Docker Compose.
