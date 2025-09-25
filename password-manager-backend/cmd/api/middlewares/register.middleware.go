package middlewares

import (
	"net/http"
	"password-manager-backend/cmd/api/models"

	"github.com/gin-gonic/gin"
)

func ValidateRegisterRequest() gin.HandlerFunc {
	return func(c *gin.Context) {
		var req models.RegisterRequest

		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error":   "Invalid request",
				"details": err.Error(),
			})
			c.Abort()
			return
		}
		// Guardar la request validada en el contexto para el controller
		c.Set("registerRequest", req)

		c.Next()
	}
}
