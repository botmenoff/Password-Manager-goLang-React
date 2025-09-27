package controllers

import (
	"database/sql"
	"net/http"
	"password-manager-backend/cmd/api/models"
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

	idParam := c.Param("id")
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
// @Param note body models.Notes true "Datos de la nota (note_text)"
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

	notesModel := models.NotesModel{DB: nc.DB}
	if err := notesModel.Insert(&note); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error creando la nota: " + err.Error()})
		return
	}

	c.JSON(http.StatusCreated, note)
}

// UpdateNote godoc
// @Summary Actualizar nota
// @Description Actualiza el texto de una nota por ID si pertenece al usuario logueado
// @Tags notes
// @Accept json
// @Produce json
// @Param id path int true "ID de la nota"
// @Param note body models.Notes true "Nuevo texto de la nota"
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

	err = notesModel.UpdateByID(id, note.NoteText)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	existingNote.NoteText = note.NoteText
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
