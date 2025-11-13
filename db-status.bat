@echo off
REM Show database status

echo Database services status:
cd database
docker-compose ps
cd ..
pause
