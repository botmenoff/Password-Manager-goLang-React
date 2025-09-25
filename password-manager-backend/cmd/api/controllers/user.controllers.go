package controllers

import (
	"database/sql"
	"errors"
	"net/http"
	"password-manager-backend/cmd/api/models"
	"password-manager-backend/cmd/api/services"
	"strconv"

	"github.com/gin-gonic/gin"
)

type UserController struct {
	DB *sql.DB
}

func (uc *UserController) GetAllUsers(c *gin.Context) {
	userModel := models.UserModel{DB: uc.DB}

	// Usuario que hace la petición (lo dejó guardado tu middleware IsLogged)
	requesterID, _ := c.Get("userID")
	requesterAdmin, _ := c.Get("isAdmin")

	users, err := userModel.GetAll()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Convertir la lista en algo seguro para devolver
	var safeUsers []models.User
	for _, u := range users {
		// Si no eres admin y no es tu usuario => ocultar password
		if !(requesterAdmin.(bool) || strconv.Itoa(u.Id) == requesterID.(string)) {
			u.Password = ""
		}
		safeUsers = append(safeUsers, u)
	}

	c.JSON(http.StatusOK, safeUsers)
}

func (uc *UserController) RegisterUser(c *gin.Context) {
	req, _ := c.Get("registerRequest")       // Es una funcion de clave valor en el contexto y simplemente la obtenemos
	register := req.(models.RegisterRequest) // Lo convertimos al tipo de dato que querremos
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
	// Crear UserModel usando la conexión de la DB
	userModel := models.UserModel{DB: uc.DB} // .DB() devuelve *sql.DB

	if err := userModel.Insert(&user); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error inserting user: " + err.Error()})
		return
	}

	c.JSON(http.StatusCreated, user)
}

func (uc *UserController) LoginUser(c *gin.Context) {
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
	token, err := models.GenerarToken(user.Email, user.Admin)
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

func (uc *UserController) GetUserByID(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.Atoi(idParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID inválido"})
		return
	}
	userModel := models.UserModel{DB: uc.DB}
	user, err := userModel.GetByID(id)
	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "Usuario no encontrado"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		}
		return
	}

	// Revisar si puede ver la contraseña
	canSeePassword, exists := c.Get("canSeePassword")
	if !exists || canSeePassword == false {
		user.Password = "" // ocultar contraseña si no puede verla
	}

	c.JSON(http.StatusOK, user)
}

func (uc *UserController) GetMe(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "No autorizado"})
		return
	}

	id := userID.(int)

	userModel := models.UserModel{DB: uc.DB}
	user, err := userModel.GetByID(id)
	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "Usuario no encontrado"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		}
		return
	}

	// ⚠️ aquí sí devolvemos la contraseña, porque es el dueño
	c.JSON(http.StatusOK, user)
}
