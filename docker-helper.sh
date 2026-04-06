#!/bin/bash

# TerraBite Docker Helper Script
# Useful commands for building and running the application

set -e

echo "TerraBite Docker Helper"
echo "======================="
echo ""

case "${1:-help}" in
  build)
    echo "Building Docker images..."
    docker-compose build --no-cache frontend
    echo "✅ Frontend build complete"
    ;;
  
  up)
    echo "Starting TerraBite services..."
    docker-compose up -d
    echo "✅ Services started"
    echo "   Frontend: http://localhost:3000"
    echo "   API: http://localhost:8000"
    echo "   Database: localhost:5432"
    ;;
  
  down)
    echo "Stopping TerraBite services..."
    docker-compose down
    echo "✅ Services stopped"
    ;;
  
  clean)
    echo "Cleaning up Docker build cache..."
    docker-compose down -v
    docker system prune -f
    echo "✅ Cleanup complete"
    ;;
  
  restart)
    echo "Restarting services..."
    docker-compose restart
    echo "✅ Services restarted"
    ;;
  
  logs)
    echo "Showing logs (frontend)..."
    docker-compose logs -f frontend
    ;;
  
  shell)
    echo "Opening frontend shell..."
    docker-compose exec frontend /bin/sh
    ;;
  
  help|*)
    echo "Available commands:"
    echo "  ./docker-helper.sh build    - Build Docker images (no cache)"
    echo "  ./docker-helper.sh up       - Start all services"
    echo "  ./docker-helper.sh down     - Stop all services"
    echo "  ./docker-helper.sh clean    - Clean up Docker artifacts"
    echo "  ./docker-helper.sh restart  - Restart services"
    echo "  ./docker-helper.sh logs     - View frontend logs"
    echo "  ./docker-helper.sh shell    - Open frontend shell"
    echo ""
    ;;
esac
