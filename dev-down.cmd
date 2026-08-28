@echo off
REM Stop the local stack. Keeps the database volume (data survives).
setlocal
cd /d "%~dp0"
docker compose -f docker-compose.dev.yml --env-file .env.dev down
endlocal
