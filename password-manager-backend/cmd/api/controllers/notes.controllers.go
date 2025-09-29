package controllers

import (
	"database/sql"
	"net/http"
	"password-manager-backend/cmd/api/models"
	"password-manager-backend/cmd/api/services"
	"strconv"

	"github.com/gin-gonic/gin"
)

type NotesController struct {
	DB *sql.DB
}

// GetMyNotes godoc
// @Summary Obtener notas del usuario logueado
// @Description Devuelve las notas del usuario autenticado
// @Tags notes
// @Produce json
// @Success 200 {array} models.Notes
// @Failure 404 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Security ApiKeyAuth
// @Router /notes/my [get]
func (nc *NotesController) GetMyNotes(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Usuario no autorizado"})
		return
	}

	notesModel := models.NotesModel{DB: nc.DB}
	notes, err := notesModel.GetByUserID(userID.(int))
	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "No tienes notas"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		}
		return
	}

	c.JSON(http.StatusOK, notes)
}

// GetNoteByID godoc
// @Summary Obtener nota por ID
// @Description Devuelve una nota específica si pertenece al usuario logueado
// @Tags notes
// @Produce json
// @Param id path int true "ID de la nota"
// @Success 200 {object} models.Notes
// @Failure 403 {object} models.ErrorResponse
// @Failure 404 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Security ApiKeyAuth
// @Router /notes/{id} [get]
func (nc *NotesController) GetNoteByID(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Usuario no autorizado"})
		return
	}

	idParam := c.Param("userID")
	id, err := strconv.Atoi(idParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID inválido"})
		return
	}

	notesModel := models.NotesModel{DB: nc.DB}
	note, err := notesModel.GetByID(id)
	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "Nota no encontrada"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		}
		return
	}

	// Validar que la nota sea del usuario logueado
	if note.UserId != userID.(int) {
		c.JSON(http.StatusForbidden, gin.H{"error": "No tienes acceso a esta nota"})
		return
	}

	c.JSON(http.StatusOK, note)
}

// CreateNote godoc
// @Summary Crear una nota
// @Description Crea una nueva nota para el usuario logueado
// @Tags notes
// @Accept json
// @Produce json
// @Param note body models.Notes true "Datos de la nota (note_text, username, password opcional)"
// @Success 201 {object} models.Notes
// @Failure 400 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Security ApiKeyAuth
// @Router /notes [post]
func (nc *NotesController) CreateNote(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Usuario no autorizado"})
		return
	}

	var note models.Notes
	if err := c.ShouldBindJSON(&note); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Forzar el userID del contexto
	note.UserId = userID.(int)

	// Hashear la contraseña antes de guardar
	hashedPassword, err := services.HashPassword(note.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al hashear la contraseña"})
		return
	}
	note.Password = hashedPassword

	notesModel := models.NotesModel{DB: nc.DB}
	if err := notesModel.Insert(&note); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error creando la nota: " + err.Error()})
		return
	}

	c.JSON(http.StatusCreated, note)
}

// UpdateNote godoc
// @Summary Actualizar nota
// @Description Actualiza el texto y username de una nota por ID si pertenece al usuario logueado
// @Tags notes
// @Accept json
// @Produce json
// @Param id path int true "ID de la nota"
// @Param note body models.Notes true "Nuevo texto de la nota y username"
// @Success 200 {object} models.Notes
// @Failure 400 {object} models.ErrorResponse
// @Failure 403 {object} models.ErrorResponse
// @Failure 404 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Security ApiKeyAuth
// @Router /notes/{id} [put]
func (nc *NotesController) UpdateNote(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Usuario no autorizado"})
		return
	}

	idParam := c.Param("id")
	id, err := strconv.Atoi(idParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID inválido"})
		return
	}

	var note models.Notes
	if err := c.ShouldBindJSON(&note); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	notesModel := models.NotesModel{DB: nc.DB}
	existingNote, err := notesModel.GetByID(id)
	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "Nota no encontrada"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		}
		return
	}

	// Validar que sea del usuario
	if existingNote.UserId != userID.(int) {
		c.JSON(http.StatusForbidden, gin.H{"error": "No tienes acceso a esta nota"})
		return
	}

	// Hashear la contraseña antes de actualizar si viene en el body
	if note.Password != "" {
		hashedPassword, err := services.HashPassword(note.Password)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al hashear la contraseña"})
			return
		}
		note.Password = hashedPassword
	} else {
		note.Password = existingNote.Password // mantener la anterior
	}

	err = notesModel.UpdateByID(id, note.NoteText, note.Username, note.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	existingNote.NoteText = note.NoteText
	existingNote.Username = note.Username
	existingNote.Password = note.Password

	c.JSON(http.StatusOK, existingNote)
}

// DeleteNote godoc
// @Summary Eliminar nota
// @Description Elimina una nota por ID si pertenece al usuario logueado
// @Tags notes
// @Produce json
// @Param id path int true "ID de la nota"
// @Success 200 {object} map[string]string
// @Failure 403 {object} models.ErrorResponse
// @Failure 404 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Security ApiKeyAuth
// @Router /notes/{id} [delete]
func (nc *NotesController) DeleteNote(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Usuario no autorizado"})
		return
	}

	idParam := c.Param("id")
	id, err := strconv.Atoi(idParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID inválido"})
		return
	}

	notesModel := models.NotesModel{DB: nc.DB}
	existingNote, err := notesModel.GetByID(id)
	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "Nota no encontrada"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		}
		return
	}

	if existingNote.UserId != userID.(int) {
		c.JSON(http.StatusForbidden, gin.H{"error": "No tienes acceso a esta nota"})
		return
	}

	err = notesModel.DeleteByID(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Nota eliminada correctamente"})
}

// GetNotesByUserID godoc
// @Summary Obtener notas de un usuario específico
// @Description Devuelve todas las notas de un usuario dado
// @Tags notes
// @Produce json
// @Param user_id path int true "ID del usuario"
// @Success 200 {array} models.Notes
// @Failure 404 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Security ApiKeyAuth
// @Router /notes/user/{user_id} [get]
func (nc *NotesController) GetNotesByUserID(c *gin.Context) {
	userIDParam := c.Param("id")
	userID, err := strconv.Atoi(userIDParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID de usuario inválido"})
		return
	}

	notesModel := models.NotesModel{DB: nc.DB}
	notes, err := notesModel.GetByUserID(userID)
	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "No se encontraron notas para este usuario"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		}
		return
	}

	c.JSON(http.StatusOK, notes)
}

// SearchNotes godoc
// @Summary Buscar notas por texto
// @Description Devuelve todas las notas que contengan el texto buscado
// @Tags notes
// @Produce json
// @Param q query string true "Texto a buscar"
// @Success 200 {array} models.Notes
// @Failure 400 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Security ApiKeyAuth
// @Router /notes/search [get]
func (nc *NotesController) SearchNotes(c *gin.Context) {
	query := c.Query("q")
	if query == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Se requiere un texto de búsqueda"})
		return
	}

	user, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "No autorizado"})
		return
	}

	userID := user.(int)

	notesModel := models.NotesModel{DB: nc.DB}
	notes, err := notesModel.SearchByText(userID, query)

	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "No se encontraron notas"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		}
		return
	}

	c.JSON(http.StatusOK, notes)
}

// VerifyNotePassword godoc
// @Summary Verificar contraseña de una nota
// @Description Valida la contraseña proporcionada para una nota específica
// @Tags notes
// @Accept json
// @Produce json
// @Param body body struct{NoteID int `json:"note_id"`; Password string `json:"password"`} true "ID de la nota y contraseña"
// @Success 200 {object} map[string]string
// @Failure 400 {object} models.ErrorResponse
// @Failure 401 {object} models.ErrorResponse
// @Failure 404 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Security ApiKeyAuth
// @Router /notes/verify-password [post]
func (nc *NotesController) VerifyNotePassword(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Usuario no autorizado"})
		return
	}

	var body struct {
		NoteID   int    `json:"note_id"`
		Password string `json:"password"`
	}

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	notesModel := models.NotesModel{DB: nc.DB}
	note, err := notesModel.GetByID(body.NoteID)
	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "Nota no encontrada"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		}
		return
	}

	// Validar que la nota sea del usuario logueado
	if note.UserId != userID.(int) {
		c.JSON(http.StatusForbidden, gin.H{"error": "No tienes acceso a esta nota"})
		return
	}

	// Validar contraseña usando tu servicio de hashing
	passwordValid := services.CheckPassword(body.Password, note.Password)
	if !passwordValid {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Contraseña incorrecta"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Contraseña correcta"})
}

// GetSortedNotesFixed godoc
// @Summary Obtener notas ordenadas (contraseñas primero, luego por título)
// @Description Devuelve notas del usuario, primero las que tienen contraseña, luego ordenadas por título
// @Tags notes
// @Produce json
// @Param order query string false "ASC o DESC" default(ASC)
// @Success 200 {array} models.Notes
// @Failure 404 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Security ApiKeyAuth
// @Router /notes/sorted-fixed [get]
func (nc *NotesController) GetSortedNotesFixed(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Usuario no autorizado"})
		return
	}

	order := c.Query("order")

	notesModel := models.NotesModel{DB: nc.DB}
	notes, err := notesModel.GetByUserIDSortedFixed(userID.(int), order)
	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "No tienes notas"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		}
		return
	}

	c.JSON(http.StatusOK, notes)
}
