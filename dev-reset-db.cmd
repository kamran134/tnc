@echo off
REM Wipe the local database volume and re-restore it from dev-local\db\tnc_prod.dump.
REM Uploads and container images are left alone. Use this to get back to a
REM clean copy of the snapshot after messing with data in the dashboard.
setlocal
cd /d "%~dp0"

echo This will DROP the local dev database and restore it from the snapshot.
choice /m "Continue"
if errorlevel 2 exit /b 0

docker compose -f docker-compose.dev.yml --env-file .env.dev down -v
docker compose -f docker-compose.dev.yml --env-file .env.dev up -d
echo.
echo Done. The snapshot is being restored on postgres first boot (a few seconds).
echo Watch it with:  dev-logs.cmd postgres
endlocal
