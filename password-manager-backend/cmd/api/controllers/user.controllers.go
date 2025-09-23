package controllers

import (
	"database/sql"
	"net/http"
	"password-manager-backend/cmd/api/models"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

type UserController struct {
	DB *sql.DB
}

func GetAllUsers(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "List of users"})
}

func (uc *UserController) CreateUser(c *gin.Context) {
	var register models.RegisterRequest
	// Validar que se ha mandado correctamente
	if err := c.ShouldBindJSON(&register); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No body sent"})
		return
	}
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(register.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Something went wrong hashing the password"})
		return
	}
	icon := "https://avatar.iran.liara.run/username?username=" + register.Username
	user := models.User{
		Email:    register.Email,
		Password: string(hashedPassword),
		Username: register.Username,
		Icon:     icon,
	}
	err = models.User.Insert(&user) // Le pasamos un puntero del objeto que acabamos de crear

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error inserting user: " + err.Error()})
		return
	}

	c.JSON(http.StatusCreated, user)
}
