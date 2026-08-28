@echo off
REM Follow logs of all services (Ctrl+C to stop watching - containers keep running).
REM Pass a service name to watch just one:  dev-logs.cmd backend
setlocal
cd /d "%~dp0"
docker compose -f docker-compose.dev.yml --env-file .env.dev logs -f --tail=100 %*
endlocal
