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

// GetAllUsers godoc
// @Summary Obtener todos los usuarios
// @Description Devuelve la lista de usuarios, ocultando la contraseña si no eres admin ni el propio usuario
// @Tags users
// @Produce json
// @Success 200 {array} models.User
// @Failure 500 {object} models.ErrorResponse
// @Security ApiKeyAuth
// @Router /users [get]
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

// RegisterUser godoc
// @Summary Registrar un nuevo usuario
// @Description Registra un usuario nuevo, hashea la contraseña y asigna un avatar
// @Tags users
// @Accept json
// @Produce json
// @Param register body models.RegisterRequest true "Datos del usuario"
// @Success 201 {object} models.User
// @Failure 400 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Router /users/register [post]
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

// LoginUser godoc
// @Summary Login de usuario
// @Description Inicia sesión y devuelve token JWT
// @Tags users
// @Accept json
// @Produce json
// @Param login body models.LoginRequest true "Datos de login"
// @Success 202 {object} map[string]interface{}
// @Failure 400 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Router /users/login [post]
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
	user.Password = ""
	c.JSON(http.StatusAccepted, gin.H{
		"user":  user,
		"token": token,
	})
}

// GetUserByID godoc
// @Summary Obtener usuario por ID
// @Description Devuelve un usuario por su ID, oculta la contraseña si no tiene permisos
// @Tags users
// @Produce json
// @Param id path int true "ID del usuario"
// @Success 200 {object} models.User
// @Failure 400 {object} models.ErrorResponse
// @Failure 404 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Security ApiKeyAuth
// @Router /users/{id} [get]
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

// GetMe godoc
// @Summary Obtener mi información
// @Description Devuelve la información del usuario logueado, incluyendo la contraseña
// @Tags users
// @Produce json
// @Success 200 {object} models.User
// @Failure 401 {object} models.ErrorResponse
// @Failure 404 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Security ApiKeyAuth
// @Router /users/me [get]
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

	c.JSON(http.StatusOK, user)
}

// UpdateUser godoc
// @Summary Actualizar usuario
// @Description Actualiza el nombre de usuario y el email de un usuario específico
// @Tags users
// @Accept json
// @Produce json
// @Param id path int true "ID del usuario"
// @Param user body models.UpdateUserRequest true "Datos a actualizar"
// @Success 200 {object} map[string]string "Usuario actualizado correctamente"
// @Failure 400 {object} models.ErrorResponse "ID inválido o body incorrecto"
// @Failure 403 {object} models.ErrorResponse "No tienes permisos para actualizar este usuario"
// @Failure 404 {object} models.ErrorResponse "Usuario no encontrado"
// @Failure 500 {object} models.ErrorResponse "Error interno del servidor"
// @Security ApiKeyAuth
// @Router /users/{id} [put]
func (uc *UserController) UpdateUser(c *gin.Context) {
	// Verificar permisos desde el middleware
	canSee, exists := c.Get("canSeePassword")
	if !exists || canSee.(bool) == false {
		c.JSON(http.StatusForbidden, gin.H{
			"error": "No tienes permisos para actualizar este usuario",
		})
		return
	}

	// Obtener ID desde la URL
	idParam := c.Param("id")
	id, err := strconv.Atoi(idParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID inválido"})
		return
	}

	// Parsear body
	var req models.UpdateUserRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Usar el modelo
	userModel := models.UserModel{DB: uc.DB}
	err = userModel.UpdateUserByID(id, req)
	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "Usuario no encontrado"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		}
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Usuario actualizado correctamente"})
}

// DeleteUser godoc
// @Summary Eliminar usuario
// @Description Elimina un usuario específico
// @Tags users
// @Param id path int true "ID del usuario"
// @Success 200 {object} map[string]string "Usuario eliminado correctamente"
// @Failure 400 {object} models.ErrorResponse "ID inválido"
// @Failure 403 {object} models.ErrorResponse "No tienes permisos para eliminar este usuario"
// @Failure 404 {object} models.ErrorResponse "Usuario no encontrado"
// @Failure 500 {object} models.ErrorResponse "Error interno del servidor"
// @Security ApiKeyAuth
// @Router /users/{id} [delete]
func (uc *UserController) DeleteUser(c *gin.Context) {
	// Verificar permisos desde el middleware
	canSee, exists := c.Get("canSeePassword")
	if !exists || canSee.(bool) == false {
		c.JSON(http.StatusForbidden, gin.H{
			"error": "No tienes permisos para eliminar este usuario",
		})
		return
	}

	// Obtener ID desde la URL
	idParam := c.Param("id")
	id, err := strconv.Atoi(idParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID inválido"})
		return
	}

	// Usar el modelo
	userModel := models.UserModel{DB: uc.DB}
	err = userModel.DeleteUserByID(id)
	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "Usuario no encontrado"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		}
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Usuario eliminado correctamente"})
}
