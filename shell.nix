{ pkgs ? import <nixpkgs> {} }:

let
  pythonEnv = pkgs.python3.withPackages (ps: with ps; [
    # Test dependencies
    pytest
    pytest-asyncio
    pytest-cov
    pytest-mock
    httpx
    
    structlog
    colorama
    
    # Monitoring Dependency
    psutil
    requests
    pillow
    # Database dependencies
    sqlalchemy
    asyncpg
    alembic
    psycopg2
    
    # Other dependencies
    python-dotenv
    py-cpuinfo
    speedtest-cli
    pyyaml
    email-validator
    
    # Web dependencies
    fastapi
    
    # Security dependencies
    cryptography
    python-jose
    passlib
    bcrypt
    
    # Main application dependencies
    uvicorn
    pydantic
    pydantic-settings
    python-multipart
    
    # Development tools
    black
    mypy
    pylint
    
  ]);
in
pkgs.mkShell {
  buildInputs = [
    pythonEnv
    pkgs.tree
    pkgs.nodejs_20    # Add Node.js
    pkgs.nodePackages.npm    # Add npm
    pkgs.nodePackages.npm-check-updates    # Add npm-check-updates
    pkgs.docker    # Add Docker
    pkgs.docker-compose    # Add Docker Compose
    pkgs.curl    # Add curl for health checks
    pkgs.lsof
    pkgs.tmux    # Add tmux for terminal sessions
    pkgs.pyright    # Add pyright for Python type checking
  ];
  
  shellHook = ''
    # Set PYTHONPATH to include the project root
    export PYTHONPATH="$PWD:$PYTHONPATH"
    echo "Für Tests/Entwicklung: Stelle sicher, dass die PostgreSQL-Datenbank (enigma-db) per Docker läuft!"
    
    # --- Cache Cleaning Function ---
    clean-caches() {
      echo "Cleaning host caches (__pycache__, .pytest_cache)..."
      find . \( -path '*/__pycache__' -o -path '*/.pytest_cache' \) -type d -exec rm -rf {} +
      echo "Host cache cleaning complete."
    }

    # --- Start/Stop Functions ---
    start-backend-dev() {
      echo "Starting main API (codebreaker-backend) and DB (enigma-db) containers..."
      docker compose -f docker-compose.yml up -d codebreaker-backend enigma-db
    }
    
    stop-backend-dev() {
      echo "Stopping main API and DB containers..."
      docker compose -f docker-compose.yml stop codebreaker-backend enigma-db
      docker compose -f docker-compose.yml rm -f codebreaker-backend enigma-db
    }

    check_docker() {
      if ! docker info > /dev/null 2>&1; then
        echo "Docker is not running. Please start Docker and try again."
        return 1
      fi
      return 0
    }

    check_frontend_deps() {
      if [ ! -d "frontend/node_modules" ]; then
        echo "Frontend dependencies not found. Installing..."
        install-npm
      fi
    }

    check_backend_health() {
      local max_attempts=30
      local attempt=1
      local wait_time=2
      local health_url="http://localhost:8000/ping"

      echo "Checking backend health at $health_url..."
      while [ $attempt -le $max_attempts ]; do
        if curl -s "$health_url" > /dev/null; then
          echo "Backend is healthy!"
          return 0
        fi
        echo "Attempt $attempt/$max_attempts: Backend not ready yet, waiting $wait_time seconds..."
        sleep $wait_time
        attempt=$((attempt + 1))
      done
      echo "Backend health check failed after $max_attempts attempts"
      return 1
    }

    check_docker_containers() {
      if ! docker compose -f docker-compose.yml ps --services --filter "status=running" | grep -q "codebreaker-backend"; then
        echo "Docker containers not running. Building and starting..."
        if ! start-main-services; then
          echo "Failed to start main services properly. Please check the logs."
          return 1
        fi
        if ! check_backend_health; then
          echo "Failed to start backend properly. Please check the logs."
          return 1
        fi
      fi
      return 0
    }

    quick-install() {
      echo "Starting quick installation process..."
      check_frontend_deps
      if check_docker; then
        echo "Building Docker containers for Enigma project..."
        docker compose -f docker-compose.yml build
      fi
      echo "Quick installation complete!"
    }
    
    start-main-services() {
      echo "Starting main backend (codebreaker-backend) and database (enigma-db)..."
      docker compose -f docker-compose.yml up --build -d codebreaker-backend enigma-db
      sleep 5
      if ! docker compose -f docker-compose.yml ps --services --filter "status=running" | grep -q "codebreaker-backend"; then
        echo "Failed to start containers. Check logs with: docker compose logs codebreaker-backend"
        return 1
      fi
      echo "Main backend and database containers started successfully"
    }

    quick-startup() {
      echo "Starting quick startup process..."
      if ! check_docker; then return 1; fi
      check_frontend_deps
      if ! check_docker_containers; then
        echo "Failed to ensure backend is running. Aborting startup."
        return 1
      fi
      echo "Starting frontend development server..."
      start-frontend-dev
      echo "Quick startup complete! All services should be running."
      echo "Frontend: http://localhost:$(get-frontend-port)"
      echo "Backend:  http://localhost:8000"
    }

    install-npm() {
      echo "Installing npm dependencies for frontend..."
      cd frontend
      npm install
      cd -
      echo "npm dependencies installation complete."
    }

    start-frontend-dev() {
      echo "Starting frontend development server on port $(get-frontend-port)..."
      cd frontend
      npm run dev
      cd -
    }
    
    start-frontend-tmux() {
      echo "Starting frontend development server in tmux session..."
      local session_name="codebreaker-frontend"
      if ! tmux has-session -t "$session_name" 2>/dev/null; then
        tmux new-session -d -s "$session_name"
      fi
      tmux send-keys -t "$session_name" "cd $(pwd)/frontend" C-m
      tmux send-keys -t "$session_name" "npm run dev" C-m
      echo "Frontend server started in tmux session '$session_name'"
      echo "To attach to the session: tmux attach -t $session_name"
    }

    rebuild-backend() {
      echo "Stopping and removing main backend/db containers and volumes..."
      docker compose -f docker-compose.yml down -v --remove-orphans
      echo "Rebuilding and starting main backend/db containers in background..."
      docker compose -f docker-compose.yml up --build -d codebreaker-backend
      echo "Main backend rebuild complete!"
    }

    rebuild-frontend() {
      echo "Killing frontend"
      kill-frontend-port
      echo "Removing node_modules, package-lock.json, and .next in the frontend..."
      cd frontend # Corrected path
      rm -rf node_modules package-lock.json .next
      echo "Cleaning npm cache..."
      npm cache clean --force
      echo "Reinstalling npm dependencies..."
      npm install
      cd -
      echo "Frontend dependencies have been completely reinstalled!"
      start-frontend-dev
    }
    
    kill-frontend-port() {
      local port=$(get-frontend-port); echo "Checking for processes using frontend port $port..."
      kill_port_process "$port"
      if is_port_in_use "$port"; then
        echo "Port still in use, checking for Next.js processes..."; local next_pids=$(ps aux | grep -i "next dev" | grep -v grep | awk '{print $2}')
        if [ -n "$next_pids" ]; then echo "Found Next.js processes: $next_pids"; for pid in $next_pids; do kill "$pid" 2>/dev/null; done; sleep 1; fi
      fi
      if is_port_in_use "$port"; then echo "Still in use, trying force kill..."; kill_port_process "$port" "force"; fi
    }

    # --- Improved Port Management Functions (largely unchanged, ensure get-frontend-port is accurate) ---
    detect_port_process() {
      local port=$1
      local pids=""
      if command -v lsof &>/dev/null; then
        pids=$(lsof -t -i ":$port" 2>/dev/null | while read pid; do if ! ps -p "$pid" -o comm= | grep -q "firefox"; then echo "$pid"; fi; done)
      fi
      if [ -z "$pids" ] && command -v netstat &>/dev/null; then
        pids=$(netstat -tulpn 2>/dev/null | grep ":$port " | awk '{print $7}' | cut -d'/' -f1 | grep -v "-" | sort -u | while read pid; do if ! ps -p "$pid" -o comm= | grep -q "firefox"; then echo "$pid"; fi; done)
      fi
      if [ -z "$pids" ] && command -v ss &>/dev/null; then
        pids=$(ss -tulpn 2>/dev/null | grep ":$port " | awk '{print $7}' | cut -d',' -f2 | cut -d'=' -f2 | grep -v "-" | sort -u | while read pid; do if ! ps -p "$pid" -o comm= | grep -q "firefox"; then echo "$pid"; fi; done)
      fi
      if [ -z "$pids" ] && command -v fuser &>/dev/null; then
        pids=$(fuser -n tcp "$port" 2>/dev/null | awk '{for(i=1;i<=NF;i++) if($i+0>0) print $i}' | while read pid; do if ! ps -p "$pid" -o comm= | grep -q "firefox"; then echo "$pid"; fi; done)
      fi
      echo "$pids"
    }

    is_port_in_use() {
      local port=$1
      if command -v lsof &>/dev/null && lsof -i ":$port" &>/dev/null; then return 0; fi
      if command -v netstat &>/dev/null && netstat -tuln 2>/dev/null | grep -q ":$port "; then return 0; fi
      if command -v ss &>/dev/null && ss -tuln 2>/dev/null | grep -q ":$port "; then return 0; fi
      if command -v fuser &>/dev/null && fuser -n tcp "$port" 2>/dev/null | grep -q "$port"; then return 0; fi
      if command -v nc &>/dev/null; then nc -z localhost "$port" &>/dev/null && return 0; 
      elif command -v timeout &>/dev/null; then timeout 1 bash -c "</dev/tcp/localhost/$port" &>/dev/null && return 0; fi
      return 1
    }

    kill_port_process() {
      local port=$1; local force=$2; local pids=$(detect_port_process "$port"); local killed=false
      if [ -n "$pids" ]; then
        echo "Found process(es) on port $port (excluding Firefox): $pids"
        if [ "$force" != "force" ]; then
          echo "Attempting graceful termination..."; for pid in $pids; do if ! ps -p "$pid" -o comm= | grep -q "firefox"; then kill "$pid" 2>/dev/null; killed=true; fi; done; sleep 1
        fi
        if [ "$force" = "force" ] || is_port_in_use "$port"; then
          echo "Using force termination (kill -9)..."; for pid in $pids; do if ! ps -p "$pid" -o comm= | grep -q "firefox"; then kill -9 "$pid" 2>/dev/null; killed=true; fi; done; sleep 1
        fi
        if is_port_in_use "$port"; then echo "WARNING: Port $port is still in use after kill attempts!"; return 1; else echo "Successfully freed port $port"; return 0; fi
      else
        echo "No process found using port $port (excluding Firefox)"; if is_port_in_use "$port"; then echo "WARNING: Port $port appears to be in use, but couldn't identify the process"; return 1; fi; return 0
      fi
    }

    get-frontend-port() {
      local env_file="frontend/.env.local"
      local port="4001"
      if [ -f "$env_file" ]; then
        local env_port
        env_port=$(grep -E '^PORT=' "$env_file" | cut -d'=' -f2)
        if [ -z "$env_port" ]; then
          env_port=$(grep -E '^NEXTAUTH_URL=' "$env_file" | sed -E 's/.*:([0-9]+).*/\1/')
        fi
        if [ -n "$env_port" ]; then
          port=$env_port
        fi
      fi
      echo "$port"
    }

    clean-all() {
      clean-caches
      kill-frontend-port
      clean-frontend
      echo "Everything has been cleaned!"
    }

    close-kill-clean-all() {
      echo ">>> Stopping and removing all backend containers and volumes..."
      docker compose -f docker-compose.yml down -v --remove-orphans
      echo ">>> Killing frontend dev server and freeing its port..."
      kill-frontend-port
      if ! wait_for_port_free "$(get-frontend-port)" 10 2; then
        echo "WARNING: Could not free frontend port after multiple attempts."
      fi
      echo ">>> Removing frontend build artifacts and dependencies..."
      cd frontend
      rm -rf node_modules package-lock.json .next
      cd -
      echo ">>> Cleaning Python caches..."
      clean-caches
      echo ">>> All project apps stopped and all caches/artifacts cleaned!"
      echo "If you want to start fresh, use: quick-startup"
    }

    rebuild-all() {
      echo ">>> Stopping and removing all containers and volumes..."
      docker compose -f docker-compose.yml down -v --remove-orphans
      echo ">>> Cleaning up frontend..."
      cd frontend
      rm -rf node_modules package-lock.json .next
      echo ">>> Cleaning npm cache..."
      npm cache clean --force
      echo ">>> Installing dependencies..."
      npm install
      cd -
      echo ">>> Rebuilding and starting main backend/db containers..."
      docker compose -f docker-compose.yml up --build -d codebreaker-backend enigma-db
      echo ">>> Starting frontend development server..."
      cd frontend
      npm run dev &
      cd -
      echo ">>> Everything has been rebuilt and started!"
      echo "Frontend: http://localhost:$(get-frontend-port)"
      echo "Backend:  http://localhost:8000"
    }

    echo "Python development environment activated"
    echo "PYTHONPATH set to: $PYTHONPATH"
    echo "Available commands:"
    echo "  quick-startup       - Start all services with automatic dependency checks"
    echo "  quick-install       - Install all dependencies and build Docker containers"
    echo "  install-npm         - Install npm dependencies for the frontend"
    echo "  start-frontend-dev  - Start the frontend development server (Host: $(get-frontend-port))"
    echo "  start-frontend-tmux - Start the frontend development server in a tmux session"
    echo "  start-main-services - Start the main backend and database using Docker"
    echo "  rebuild-all         - Full rebuild: Stops, cleans, reinstalls frontend deps, rebuilds/starts backend & frontend"
    echo "  rebuild-backend     - Clean rebuild of backend Docker services"
    echo "  rebuild-frontend    - Clean rebuild of frontend dependencies and restarts dev server"
    echo "  clean-caches        - Manually clean Python host caches"
    echo "  clean-frontend      - Clean frontend (node_modules, .next, etc.)"
    echo "  clean-all           - Clean Python and frontend caches/artifacts"
    echo "  close-kill-clean-all - Stops all services, cleans everything (Docker, caches, frontend artifacts)"
  '';
}
