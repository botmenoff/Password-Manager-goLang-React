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

## 📚 Apuntes de Go

En la web he añadido también una sección con **mis apuntes de Go**, donde recopilo lo que he ido aprendiendo durante el desarrollo:  

- Manejo de **paquetes y módulos**  
- Conexión a **MySQL** con `database/sql`  
- Uso de **Gin** para crear rutas y middlewares  
- Buenas prácticas en controladores y modelos  
- Manejo de errores y respuestas JSON  

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

# 🔐 Password Manager

Un proyecto **fullstack** desarrollado con **React, Go y MySQL**.  
Es una especie de **gestor de contraseñas**, donde puedes guardar tus notas, usuarios y claves de forma organizada.  
Además, en la propia aplicación he incluido mis **apuntes de Go** como parte de la práctica y el aprendizaje.

---

## 📋 Requisitos

Antes de ejecutar el proyecto, asegúrate de tener instalado y corriendo **MySQL** (puedes usar [Laragon](https://laragon.org/), XAMPP, Docker u otra herramienta similar).  

1. Abre la consola de MySQL.  
2. Copia y pega el siguiente script para crear la base de datos, el usuario y las tablas con algunos datos de prueba:

```sql
CREATE DATABASE passwordManagerDatabase;
CREATE USER IF NOT EXISTS 'ferran'@'localhost' IDENTIFIED BY 'password1234';
GRANT ALL PRIVILEGES ON passwordManagerDatabase.* TO 'ferran'@'localhost';
FLUSH PRIVILEGES;

USE passwordManagerDatabase;

CREATE TABLE IF NOT EXISTS users (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    icon VARCHAR(255) NOT NULL,
    admin BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS notes (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    note_text VARCHAR(255) NOT NULL,
    username VARCHAR(255),
    password VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Usuarios de ejemplo
INSERT INTO users (email, username, password, icon, admin) VALUES
('alice@example.com', 'alice', '$2a$10$/hl16QUmvpV2.2a8o7VTEOdRptbssk/u6AYnkSAtiFVJC9vJcr1fK', 'https://avatar.iran.liara.run/username?username=Alice', FALSE),
('bob@example.com', 'bob', '$2a$10$rarhuhkUDN0DD6kmrH0v0.CIJUjUc0f1RfE0LHTWahfnQPQAor.Be', 'https://avatar.iran.liara.run/username?username=Bob', FALSE),
('charlie@example.com', 'charlie', '$2a$10$6kfMXScaWG7gPdLX4VqEXetgbM6ASp5G68mg0PXuRgT0F7MUdCA3G', 'https://avatar.iran.liara.run/username?username=Charlie', FALSE),
('admin@example.com', 'admin', '$2a$10$nyholObjpuWYJspsitliMewDzLhSNTHIPKNqnULKpAUo61I8/co8W', 'https://avatar.iran.liara.run/username?username=Admin', TRUE);

-- Notas de ejemplo (Alice, Bob, Charlie y Admin)
INSERT INTO notes (user_id, note_text, username, password) VALUES
(1, 'Gmail', 'alice@gmail.com', NULL),
(1, 'Facebook', 'alice_fb', NULL),
(2, 'Twitter', 'bob_tw', NULL),
(3, 'LinkedIn', 'charlie_li', NULL),
(4, 'GitHub', 'admin_git', NULL);
```

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

# Instalar dependencias
go mod tidy

# Ejecutar servidor
go run main.go
