@echo off
echo 🐳 Building and deploying CycleOptima Backend...

REM Stop existing containers
docker-compose down

REM Build and start containers
docker-compose up -d --build

REM Show status
echo 📊 Container Status:
docker-compose ps

echo ✅ Deployment complete!
echo 🌐 Your API should be available at http://localhost (HTTP) or https://your-domain.com (HTTPS)
echo 🏥 Health check: curl http://localhost/health

pause
