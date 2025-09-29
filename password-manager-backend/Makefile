# Detect OS (Windows = exe, Linux/Mac = no extension)
EXT =
ifeq ($(OS),Windows_NT)
    EXT = .exe
endif

# Build the application
all: build test

build:
	@echo "Building..."
	@go build -o main$(EXT) cmd/api/main.go

# Run the application
run:
	@go run cmd/api/main.go

# Create DB container
docker-run:
	@docker compose up --build -d

# Shutdown DB container
docker-down:
	@docker compose down

# Borrar el volumen y levantar el contenedor de nuevo (en desarrollo):
docker-restart: 
	@docker-compose down
	@docker-compose up -d

# Test the application
test:
	@echo "Testing..."
	@go test ./... -v

# Integrations Tests for the application
itest:
	@echo "Running integration tests..."
	@go test ./internal/database -v

# Clean the binary
clean:
	@echo "Cleaning..."
	@rm -f main main.exe

# Live Reload
dev-win:
	@powershell -ExecutionPolicy Bypass -Command "if (Get-Command air -ErrorAction SilentlyContinue) { \
		air; \
		Write-Output 'Watching...'; \
	} else { \
		Write-Output 'Installing air...'; \
		go install github.com/air-verse/air@latest; \
		air; \
		Write-Output 'Watching...'; \
	}"

dev:
	air

migrate:
	go run cmd/migrate/migrations/main.go up

dev-migrate: wait-db migrate dev

.PHONY: all build run test clean watch docker-run docker-down itest migrate dev dev-win dev-migrate
# 🔹 Esperar a que MySQL esté listo
wait-db:
	@echo "Waiting for MySQL..."
	@while ! nc -z mysql_bp 3306; do \
		echo "MySQL is unavailable - sleeping"; \
		sleep 2; \
	done
	@echo "MySQL is up!"
