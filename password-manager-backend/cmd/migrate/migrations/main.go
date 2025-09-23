package main

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	_ "github.com/go-sql-driver/mysql"
	"github.com/golang-migrate/migrate"
	"github.com/golang-migrate/migrate/database/mysql"
	"github.com/golang-migrate/migrate/source/file"
	_ "github.com/joho/godotenv/autoload" // carga automática del .env
)

func main() {
	if len(os.Args) < 2 {
		log.Fatal("Provide a migration direction: 'up' or 'down'")
	}

	direction := os.Args[1]

	// Cargar variables de entorno
	user := os.Getenv("BLUEPRINT_DB_USERNAME")
	pass := os.Getenv("BLUEPRINT_DB_PASSWORD")
	host := os.Getenv("BLUEPRINT_DB_HOST")
	port := os.Getenv("BLUEPRINT_DB_PORT")
	dbname := os.Getenv("BLUEPRINT_DB_DATABASE")

	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?multiStatements=true", user, pass, host, port, dbname)

	db, err := sql.Open("mysql", dsn)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	driver, err := mysql.WithInstance(db, &mysql.Config{})
	if err != nil {
		log.Fatal(err)
	}

	// Ruta a las migraciones
	fSrc, err := (&file.File{}).Open("cmd/migrate/migrations")
	if err != nil {
		log.Fatal(err)
	}

	m, err := migrate.NewWithInstance("file", fSrc, "mysql", driver)
	if err != nil {
		log.Fatal(err)
	}

	// Ejecutar migraciones
	switch direction {
	case "up":
		if err := m.Up(); err != nil && err != migrate.ErrNoChange {
			log.Fatal(err)
		}
		log.Println("✅ Migrations applied successfully.")
	case "down":
		if err := m.Down(); err != nil && err != migrate.ErrNoChange {
			log.Fatal(err)
		}
		log.Println("🔄 Migrations reverted successfully.")
	default:
		log.Fatal("Invalid direction. Use 'up' or 'down'")
	}
}
