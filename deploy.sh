#!/bin/bash

# Build and deploy with Docker Compose
echo "🐳 Building and deploying CycleOptima Backend..."

# Stop existing containers
docker-compose down

# Build and start containers
docker-compose up -d --build

# Show status
echo "📊 Container Status:"
docker-compose ps

echo "✅ Deployment complete!"
echo "🌐 Your API should be available at http://localhost (HTTP) or https://your-domain.com (HTTPS)"
echo "🏥 Health check: curl http://localhost/health"
