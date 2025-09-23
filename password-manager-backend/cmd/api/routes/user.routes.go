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
		users.GET("/", controllers.GetAllUsers)
		users.POST("/auth/register", userController.CreateUser)
		users.POST("/auth/login", userController.LoginUser)
	}
}
