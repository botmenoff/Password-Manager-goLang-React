# 🔐 Password Manager - Fullstack Project

Este es un proyecto **fullstack** desarrollado con:

- ⚛️ **React (TypeScript + Material UI)** para el frontend  
- 🐹 **Go (Gin + SQL)** para el backend  
- 🐬 **MySQL** como base de datos  

La aplicación es una especie de **gestor de contraseñas**, donde los usuarios pueden guardar notas, asociarlas con credenciales y organizarlas de manera segura.

---

## ✨ Características

✅ Registro y autenticación de usuarios  
✅ Gestión de notas con campos: título, usuario, contraseña, fecha de creación  
✅ Filtrado y ordenación de notas (por título o por si tienen contraseña)  
✅ Búsqueda de notas por título  
✅ API segura con middleware de autenticación  
✅ Documentación generada con Swagger  

---

## 🛠️ Tecnologías usadas

### Frontend
- React + TypeScript
- Material UI
- Fetch API para comunicación con el backend

### Backend
- Go (Golang)
- Gin (framework web)
- JWT para autenticación
- MySQL Driver (`go-sql-driver/mysql`)

### Infraestructura
- MySQL
- Swagger para documentación


---

## 📋 Requisitos

Tener docker instalado 


## 🚀 Instalación y uso

### Backend
```bash
# Clonar repositorio
git clone https://github.com/usuario/password-manager.git
cd password-manager-backend
docker compose up -d

# Variables de entorno en ./password-manager-backend/.env
PORT=EJEMPLO
APP_ENV=EJEMPLO
BLUEPRINT_DB_HOST=EJEMPLO
BLUEPRINT_DB_PORT=EJEMPLO
BLUEPRINT_DB_DATABASE=EJEMPLO
BLUEPRINT_DB_USERNAME=EJEMPLO
BLUEPRINT_DB_PASSWORD=EJEMPLO
BLUEPRINT_DB_ROOT_PASSWORD=EJEMPLO
JWT_SECRET=EJEMPLO

```

## 🧪 Datos de prueba
Usuarios de ejemplo

| Email               | Username | Contraseña      | Admin |
|--------------------|---------|----------------|-------|
| alice@example.com   | alice   | 12345678       | ❌    |
| bob@example.com     | bob     | 12345678       | ❌    |
| charlie@example.com | charlie | 12345678       | ❌    |
| admin@example.com   | admin   | ASDasd123@     | ✅    |
---

## 📚 Apuntes de Go

Durante el desarrollo del proyecto he recopilado lo que he ido aprendiendo de Go.  
Aquí tienes un resumen de los puntos más importantes:

### 🚀 Características del lenguaje
- **Concurrencia con goroutines y canales** → ligeras, ideales para servidores y microservicios.  
- **Compilación ultra rápida** → binarios únicos y portables.  
- **Simplicidad y uniformidad** → sintaxis minimalista, `gofmt` obligatorio.  
- **Librería estándar potente** → HTTP, JSON, concurrencia, testing, etc.  

### 🔤 Tipos básicos y valores iniciales
- Números: `int`, `int8`, `uint`, `float32`, `complex128`  
- Texto: `string`, `rune`, `byte`  
- Booleanos: `bool`  
- Valores iniciales: `0`, `false`, `""`  

### 📝 Sintaxis esencial
- Declaración corta: `x := 2`  
- Funciones con múltiples retornos:  
  ```go
  func swap(x int, y string) (int, string) { return x, y }
Bucles → solo existe for (también como while).

if con asignación en línea.

switch flexible (casos no constantes).

### 📦 Estructuras de datos
Arrays → tamaño fijo.

Slices → dinámicos, con append, len y cap.

Structs → agrupación de datos, compatibles con punteros.

### ⚙️ Concurrencia
Goroutines → go function() para ejecutar concurrentemente.

Channels (no incluido arriba pero recomendable mencionar).

defer → ejecutar al final de la función (ej: cerrar conexiones).

### 🔗 Punteros
&x → dirección de memoria.

*p → valor apuntado.

Go no permite aritmética de punteros (más seguro).

### 🌐 API REST con Gin
Controllers → reciben el Context (c *gin.Context).

Routes → agrupar endpoints en routers (r.Group("/users")).

Middlewares → validar y guardar datos en el contexto antes de los controladores.

### 📦 Modelos y JSON
Campos deben iniciar en mayúscula para ser exportados.

Se usa json:"nombreCampo" para serialización.

### 🔒 Seguridad
JWT → RegisteredClaims + CustomClaims para email/roles.

bcrypt → GenerateFromPassword y CompareHashAndPassword para hash de contraseñas.

### 🛠️ Comandos útiles de Go
sh
Copy code
##### Ejecutar directamente
go run main.go

##### Compilar binario
go build -o app main.go

##### Inicializar módulo
go mod init nombreDelModulo
go mod tidy   # descargar y limpiar dependencias

##### Testing
go test ./...     # todos los paquetes
go test -v ./...  # con detalles

##### Formatear
go fmt ./...

##### Cross compiling
GOOS=linux GOARCH=amd64 go build -o app main.go
