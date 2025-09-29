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
	apiServer := server.NewServer()

	done := make(chan bool, 1)
	go gracefulShutdown(apiServer, done)

	log.Printf("Starting server on port %s...", apiServer.Addr)
	// Ejecuta directamente el router de Gin que ya tiene CORS
	err := apiServer.ListenAndServe()
	if err != nil && err != http.ErrServerClosed {
		panic(fmt.Sprintf("http server error: %s", err))
	}

	<-done
	log.Println("Graceful shutdown complete.")
}
