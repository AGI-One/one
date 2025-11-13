@echo off
REM Start all database services

echo Starting database services...
cd database
docker compose -f docker-compose.yml up -d
cd ..
echo Done! Database services started.
pause
