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

// GetAllNotes godoc
// @Summary Obtener todas las notas
// @Description Devuelve todas las notas de todos los usuarios
// @Tags notes
// @Produce json
// @Success 200 {array} models.Notes
// @Failure 500 {object} models.ErrorResponse
// @Security ApiKeyAuth
// @Router /notes [get]
func (nc *NotesController) GetAllNotes(c *gin.Context) {
	notesModel := models.NotesModel{DB: nc.DB}

	notes, err := notesModel.GetAll()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, notes)
}

// GetNotesByUserID godoc
// @Summary Obtener notas de un usuario
// @Description Devuelve las notas de un usuario por su ID
// @Tags notes
// @Produce json
// @Param user_id path int true "ID del usuario"
// @Success 200 {array} models.Notes
// @Failure 404 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Security ApiKeyAuth
// @Router /notes/user/{user_id} [get]
func (nc *NotesController) GetNotesByUserID(c *gin.Context) {
	userIDParam := c.Param("user_id")
	userID, err := strconv.Atoi(userIDParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID de usuario inválido"})
		return
	}

	notesModel := models.NotesModel{DB: nc.DB}
	notes, err := notesModel.GetByUserID(userID)
	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "Notas no encontradas"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		}
		return
	}

	c.JSON(http.StatusOK, notes)
}

// GetNoteByID godoc
// @Summary Obtener nota por ID
// @Description Devuelve una nota específica por su ID
// @Tags notes
// @Produce json
// @Param id path int true "ID de la nota"
// @Success 200 {object} models.Notes
// @Failure 404 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Security ApiKeyAuth
// @Router /notes/{id} [get]
func (nc *NotesController) GetNoteByID(c *gin.Context) {
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

	c.JSON(http.StatusOK, note)
}

// CreateNote godoc
// @Summary Crear una nota
// @Description Crea una nueva nota para un usuario
// @Tags notes
// @Accept json
// @Produce json
// @Param note body models.Notes true "Datos de la nota"
// @Success 201 {object} models.Notes
// @Failure 400 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Security ApiKeyAuth
// @Router /notes [post]
func (nc *NotesController) CreateNote(c *gin.Context) {
	var note models.Notes
	if err := c.ShouldBindJSON(&note); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	notesModel := models.NotesModel{DB: nc.DB}
	if err := notesModel.Insert(&note); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error creando la nota: " + err.Error()})
		return
	}

	c.JSON(http.StatusCreated, note)
}

// UpdateNote godoc
// @Summary Actualizar nota
// @Description Actualiza el texto de una nota por ID
// @Tags notes
// @Accept json
// @Produce json
// @Param id path int true "ID de la nota"
// @Param note body models.Notes true "Nuevo texto de la nota"
// @Success 200 {object} models.Notes
// @Failure 400 {object} models.ErrorResponse
// @Failure 404 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Security ApiKeyAuth
// @Router /notes/{id} [put]
func (nc *NotesController) UpdateNote(c *gin.Context) {
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
	err = notesModel.UpdateByID(id, note.NoteText)
	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "Nota no encontrada"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		}
		return
	}

	c.JSON(http.StatusOK, note)
}

// DeleteNote godoc
// @Summary Eliminar nota
// @Description Elimina una nota por ID
// @Tags notes
// @Produce json
// @Param id path int true "ID de la nota"
// @Success 200 {object} map[string]string
// @Failure 400 {object} models.ErrorResponse
// @Failure 404 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Security ApiKeyAuth
// @Router /notes/{id} [delete]
func (nc *NotesController) DeleteNote(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.Atoi(idParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID inválido"})
		return
	}

	notesModel := models.NotesModel{DB: nc.DB}
	err = notesModel.DeleteByID(id)
	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "Nota no encontrada"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		}
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Nota eliminada correctamente"})
}
