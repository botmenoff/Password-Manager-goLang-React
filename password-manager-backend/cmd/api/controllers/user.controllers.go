package controllers

import (
	"database/sql"
	"errors"
	"net/http"
	"password-manager-backend/cmd/api/models"
	"password-manager-backend/cmd/api/services"

	"github.com/gin-gonic/gin"
)

type UserController struct {
	DB *sql.DB
}

var uc *UserController
var userModel = models.UserModel{DB: uc.DB}

func GetAllUsers(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "List of users"})
}

func CreateUser(c *gin.Context) {
	var register models.RegisterRequest
	// TODO Sustituir esta validación por un middleaware
	if err := c.ShouldBindJSON(&register); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err})
		return
	}
	// Hashear password
	hashedPassword, err := services.HashPassword(register.Password)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Something went wrong hashing the password"})
		return
	}
	// Cargar el avatar con una api
	icon := "https://avatar.iran.liara.run/username?username=" + register.Username
	// Crear instancia
	user := models.User{
		Email:    register.Email,
		Password: string(hashedPassword),
		Username: register.Username,
		Icon:     icon,
	}
	err = userModel.Insert(&user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error inserting user: " + err.Error()})
		return
	}

	c.JSON(http.StatusCreated, user)
}

func LoginUser(c *gin.Context) {
	var body models.LoginRequest
	// Validar que se ha mandado correctamente en el body
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No body sent or malformed body"})
		return
	}

	userModel := models.UserModel{DB: uc.DB}
	// Buscar el usuario por email
	user, err := userModel.GetUserFromEmail(body.Email)
	if err != nil {
		var errorString string
		switch {
		// Si no ha encontrado columnas
		case errors.Is(err, sql.ErrNoRows):
			errorString = "Email not found check the email"
		default:
			errorString = "Error finding email"
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": errorString})
		return
	}

	// Validar la contraseña
	passwordValid := services.CheckPassword(body.Password, user.Password)
	if !passwordValid {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Incorrect password try again"})
		return
	}
	// Crear el Token
	token, err := models.GenerarToken(user.Email)
	if err != nil {
		// Si hay error al generar el token
		c.JSON(http.StatusInternalServerError, gin.H{"error": "No se pudo generar el token"})
		return
	}

	c.JSON(http.StatusAccepted, gin.H{
		"user":  user,
		"token": token,
	})
}
