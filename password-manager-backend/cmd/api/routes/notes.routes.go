package routes

import (
	"database/sql"
	"password-manager-backend/cmd/api/controllers"
	"password-manager-backend/cmd/api/models"

	"github.com/gin-gonic/gin"
)

func NotesRoutes(rg *gin.RouterGroup, db *sql.DB) {
	notes := rg.Group("/notes")

	// Creamos el controller con la DB
	notesController := controllers.NotesController{DB: db}
	_ = models.NotesModel{DB: db} // Por si necesitas instanciarlo directamente

	{
		// Obtener todas las notas
		notes.GET("/", notesController.GetAllNotes)

		// Obtener notas de un usuario específico
		notes.GET("/user/:user_id", notesController.GetNotesByUserID)

		// Obtener nota por ID
		notes.GET("/:id", func(c *gin.Context) {
			idParam := c.Param("id")
			// Opcional: validar ID
			if idParam == "" {
				c.JSON(400, gin.H{"error": "ID inválido"})
				return
			}
			notesController.GetNoteByID(c)
		})

		// Crear nueva nota
		notes.POST("/", notesController.CreateNote)

		// Actualizar nota por ID
		notes.PUT("/:id", notesController.UpdateNote)

		// Eliminar nota por ID
		notes.DELETE("/:id", notesController.DeleteNote)
	}
}
