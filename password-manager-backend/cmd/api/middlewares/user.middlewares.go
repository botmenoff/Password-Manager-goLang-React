package middlewares

import (
	"fmt"
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

func ValidateAdmin() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Obtener el header
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header missing"})
			c.Abort()
			return
		}
		// Decodificar el token
		claims, err := models.DecodificarToken(authHeader)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
			c.Abort()
			return
		}

		// Verificar si es admin
		if !claims.Admin {
			c.JSON(http.StatusForbidden, gin.H{"error": "Admin access required"})
			c.Abort()
			return
		}

		// Guardar claims en contexto
		c.Set("userClaims", claims)
		c.Next()
	}
}

func IsLogged(userModel *models.UserModel) gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Falta token"})
			c.Abort()
			return
		}

		// Validar token y obtener email
		email, err := models.ValidarToken(authHeader)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
			c.Abort()
			return
		}

		// Buscar usuario
		user, err := userModel.GetUserFromEmail(email)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Usuario no encontrado"})
			c.Abort()
			return
		}

		// Guardar en contexto
		c.Set("userID", user.Id)
		c.Set("isAdmin", user.Admin)

		c.Next()
	}
}

func CanSeePassword(userModel *models.UserModel) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Obtener token
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Falta token"})
			c.Abort()
			return
		}

		// Validar token y obtener email
		email, err := models.ValidarToken(authHeader)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
			c.Abort()
			return
		}

		// Buscar usuario por email
		user, err := userModel.GetUserFromEmail(email)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Usuario no encontrado"})
			c.Abort()
			return
		}

		// Guardar en contexto si puede ver la contraseña
		paramID := c.Param("id")
		if user.Admin || paramID == fmt.Sprintf("%d", user.Id) {
			c.Set("canSeePassword", true)
		} else {
			c.Set("canSeePassword", false)
		}
		c.Next()
	}
}
