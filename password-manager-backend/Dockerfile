FROM golang:1.25-alpine

# Instala dependencias necesarias (bash, git y make)
RUN apk add --no-cache bash git make

# Instala air (live reload)
RUN go install github.com/air-verse/air@latest

WORKDIR /app

# Copiamos solo dependencias para cache
COPY go.mod go.sum ./
RUN go mod download

# Copiamos el Makefile (necesario para dev-migrate)
COPY Makefile ./
# Copiar .env dentro del contenedor
COPY .env ./
# El resto del código se montará como volumen en docker-compose
# por eso no copiamos src aquí en modo dev.

# Comando por defecto: corre migraciones y luego inicia con air
CMD ["make", "dev-migrate"]
