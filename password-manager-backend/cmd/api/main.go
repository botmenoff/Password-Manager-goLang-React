package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os/signal"
	"password-manager-backend/internal/server"
	"syscall"
	"time"

	"github.com/rs/cors"
)

func gracefulShutdown(apiServer *http.Server, done chan bool) {
	// Escucha señales de interrupción (Ctrl+C)
	ctx, stop := signal.NotifyContext(context.Background(), syscall.SIGINT, syscall.SIGTERM)
	defer stop()

	<-ctx.Done()

	log.Println("shutting down gracefully, press Ctrl+C again to force")
	stop() // Permite forzar cierre con Ctrl+C

	// Contexto con timeout de 5 segundos para terminar solicitudes en curso
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := apiServer.Shutdown(ctx); err != nil {
		log.Printf("Server forced to shutdown with error: %v", err)
	}

	log.Println("Server exiting")
	done <- true
}

func main() {
	// Crea el servidor original
	apiServer := server.NewServer()

	// Envuelve el handler con CORS
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://192.168.1.170:3000"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE"},
		AllowedHeaders:   []string{"Authorization", "Content-Type"},
		AllowCredentials: true,
	})

	apiServer.Handler = c.Handler(apiServer.Handler)

	// Canal para esperar el cierre del servidor
	done := make(chan bool, 1)

	// Ejecuta el shutdown en una goroutine separada
	go gracefulShutdown(apiServer, done)

	log.Printf("Starting server on port %s...", apiServer.Addr)
	err := apiServer.ListenAndServe()
	if err != nil && err != http.ErrServerClosed {
		panic(fmt.Sprintf("http server error: %s", err))
	}

	<-done
	log.Println("Graceful shutdown complete.")
}
