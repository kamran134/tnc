@echo off
REM Pull a fresh copy of the PRODUCTION database + uploaded files from the server
REM (read-only: pg_dump and tar only, nothing is changed on prod), then reload
REM the local stack from it.
REM
REM Requires: ssh access to the "tnc" host (see %USERPROFILE%\.ssh\config).
setlocal
cd /d "%~dp0"

set SSH_HOST=tnc
set PG_CONTAINER=tnc-postgres-prod
set REMOTE_DIR=/opt/tnc-website

where ssh >nul 2>&1 || (echo [!] ssh not found in PATH & exit /b 1)
if not exist "dev-local\db" mkdir "dev-local\db"

echo === [1/4] Dumping production database via %SSH_HOST% ===
ssh %SSH_HOST% "docker exec %PG_CONTAINER% pg_dump -U tnc_user -d tnc_prod --no-owner --no-privileges -Fc" > "dev-local\db\tnc_prod.dump"
if errorlevel 1 (echo [!] DB dump failed & exit /b 1)
for %%A in ("dev-local\db\tnc_prod.dump") do echo     saved %%~zA bytes

echo === [2/4] Downloading uploads archive ===
ssh %SSH_HOST% "cd %REMOTE_DIR% && tar czf - uploads" > "dev-local\uploads.tar.gz"
if errorlevel 1 (echo [!] uploads download failed & exit /b 1)

echo === [3/4] Replacing local dev-local\uploads ===
if exist "dev-local\uploads" rmdir /s /q "dev-local\uploads"
tar xzf "dev-local\uploads.tar.gz" -C "dev-local"
del /q "dev-local\uploads.tar.gz"

echo === [4/4] Reloading local stack from the fresh snapshot ===
docker compose -f docker-compose.dev.yml --env-file .env.dev down -v
docker compose -f docker-compose.dev.yml --env-file .env.dev up -d
echo.
echo Done. Site: http://localhost:8090   (snapshot restoring on postgres first boot)
endlocal
