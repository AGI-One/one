@echo off
REM Show database logs

echo Showing database logs (Press Ctrl+C to exit)...
cd database
docker-compose logs -f
cd ..
