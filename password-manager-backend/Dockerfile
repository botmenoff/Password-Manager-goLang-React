# Etapa de construcción
FROM golang:1.25-alpine AS builder

WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download

COPY . .

# Compilar backend
RUN go build -o main ./cmd/api/main.go
RUN go build -o migrate ./cmd/migrate/migrations/main.go

# Etapa de producción
FROM alpine:latest

WORKDIR /app
COPY --from=builder /app/main .
COPY --from=builder /app/migrate .

# Script para esperar MySQL, ejecutar migraciones y levantar backend
COPY wait-for-mysql.sh .

EXPOSE 8000
CMD ["sh", "./wait-for-mysql.sh"]
