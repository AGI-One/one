@echo off
REM Setup databases with seed data

echo Setting up databases...

echo Starting database services...
cd database
docker compose -f docker-compose.yml up -d
cd ..

echo Running database reset with seed data...
call npx nx database:reset twenty-server

echo Done! Database setup completed.
pause
