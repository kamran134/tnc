@echo off
REM Rebuild images after code changes and restart, keeping the database.
REM   dev-rebuild.cmd          rebuild frontend + backend
REM   dev-rebuild.cmd app      rebuild only the frontend
REM   dev-rebuild.cmd backend  rebuild only the backend  (from ..\backend-tnc)
setlocal
cd /d "%~dp0"
set TARGET=%*
if "%TARGET%"=="" set TARGET=app backend
docker compose -f docker-compose.dev.yml --env-file .env.dev up -d --build %TARGET%
docker compose -f docker-compose.dev.yml ps
endlocal
