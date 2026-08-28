@echo off
REM Build (if needed) and start the local prod-mirror stack.
REM Run from anywhere - it cd's to the repo root itself.
setlocal
cd /d "%~dp0"

where docker >nul 2>&1 || (echo [!] Docker not found in PATH. Start Docker Desktop. & exit /b 1)
docker info >nul 2>&1 || (echo [!] Docker daemon not reachable. Start Docker Desktop and retry. & exit /b 1)

if not exist "dev-local\db\tnc_prod.dump" (
  echo [!] dev-local\db\tnc_prod.dump is missing.
  echo     Run dev-refresh-snapshot.cmd first to pull the prod DB + uploads.
  exit /b 1
)

echo === Building and starting containers ===
docker compose -f docker-compose.dev.yml --env-file .env.dev up -d --build
if errorlevel 1 (echo [!] compose up failed & exit /b 1)

echo.
echo === Status ===
docker compose -f docker-compose.dev.yml ps
echo.
echo   Site .............. http://localhost:8090
echo   Dashboard ......... http://localhost:8090/dashboard
echo   Backend Swagger ... http://localhost:8080/swagger-ui/index.html
echo   Postgres .......... localhost:5432  (tnc_user / tnc_local_dev / tnc_prod)
echo.
echo   Logs:  dev-logs.cmd        Stop:  dev-down.cmd
endlocal
