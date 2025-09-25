package routes

import (
	"database/sql"
	"password-manager-backend/cmd/api/controllers"
	"password-manager-backend/cmd/api/middlewares"

	"github.com/gin-gonic/gin"
)

func UserRoutes(rg *gin.RouterGroup, db *sql.DB) {
	users := rg.Group("/users")
	userController := controllers.UserController{DB: db}
	{
		users.GET("/", userController.GetAllUsers)
		users.POST("/auth/register", middlewares.ValidateRegisterRequest(), userController.RegisterUser)
		users.POST("/auth/login", userController.LoginUser)
	}
}
