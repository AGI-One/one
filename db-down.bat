@echo off
REM Stop all database services

echo Stopping database services...
cd database
docker compose -f docker-compose.yml down
cd ..
echo Done! Database services stopped.
pause
