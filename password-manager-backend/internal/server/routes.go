package server

import (
	"net/http"
	"password-manager-backend/cmd/api/routes"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"

	// Swagger
	_ "password-manager-backend/cmd/api/docs" // importamos los docs generados por swag

	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

func (s *Server) RegisterRoutes() http.Handler {
	r := gin.Default()

	// Solo este CORS es suficiente
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"}, // Aquí pones el origen de tu frontend
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"},
		AllowHeaders:     []string{"Authorization", "Content-Type", "Accept"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	// Rutas de Swagger
	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	v1 := r.Group("/api/v1")
	{
		v1.GET("/", s.HelloWorldHandler)
		v1.GET("/health", s.healthHandler)
		routes.UserRoutes(v1, s.db.DB())
		routes.NotesRoutes(v1, s.db.DB())
	}

	return r
}

func (s *Server) HelloWorldHandler(c *gin.Context) {
	resp := make(map[string]string)
	resp["message"] = "Hello World"

	c.JSON(http.StatusOK, resp)
}

func (s *Server) healthHandler(c *gin.Context) {
	c.JSON(http.StatusOK, s.db.Health())
}
