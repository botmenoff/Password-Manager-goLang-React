package routes

import (
	"database/sql"
	"password-manager-backend/cmd/api/controllers"

	"github.com/gin-gonic/gin"
)

func UserRoutes(rg *gin.RouterGroup, db *sql.DB) {
	users := rg.Group("/users")
	userController := controllers.UserController{DB: db}
	{
		users.GET("/", userController.GetAllUsers)
		users.POST("/auth/register", userController.RegisterUser)
		users.POST("/auth/login", userController.LoginUser)
	}
}
