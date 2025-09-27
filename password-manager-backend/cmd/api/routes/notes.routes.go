package routes

import (
	"database/sql"
	"password-manager-backend/cmd/api/controllers"
	"password-manager-backend/cmd/api/middlewares"
	"password-manager-backend/cmd/api/models"

	"github.com/gin-gonic/gin"
)

func NotesRoutes(rg *gin.RouterGroup, db *sql.DB) {
	notes := rg.Group("/notes")
	notesController := controllers.NotesController{DB: db}
	userModel := models.UserModel{DB: db}

	notes.GET("/my", middlewares.IsLogged(&userModel), notesController.GetMyNotes)
	notes.GET("/:id", middlewares.IsLogged(&userModel), notesController.GetNoteByID)
	notes.GET("/user/:id", middlewares.IsLogged(&userModel), notesController.GetNotesByUserID)
	notes.GET("/search", middlewares.IsLogged(&userModel), notesController.SearchNotes)
	notes.POST("/", middlewares.IsLogged(&userModel), notesController.CreateNote)
	notes.PUT("/:id", middlewares.IsLogged(&userModel), notesController.UpdateNote)
	notes.DELETE("/:id", middlewares.IsLogged(&userModel), notesController.DeleteNote)
}
