package routes

import (
	"database/sql"
	"password-manager-backend/cmd/api/controllers"
	"password-manager-backend/cmd/api/middlewares"
	"password-manager-backend/cmd/api/models"

	"github.com/gin-gonic/gin"
)

func UserRoutes(rg *gin.RouterGroup, db *sql.DB) {
	users := rg.Group("/users")
	userController := controllers.UserController{DB: db}
	userModel := models.UserModel{DB: db}
	{
		users.GET("/", middlewares.IsLogged(&userModel), userController.GetAllUsers)
		users.POST("/auth/register", middlewares.ValidateRegisterRequest(), userController.RegisterUser)
		users.POST("/auth/login", userController.LoginUser)
		users.GET("/:id", middlewares.IsLogged(&userModel), middlewares.CanSeePassword(&userModel), userController.GetUserByID)
		users.GET("/me", middlewares.IsLogged(&userModel), userController.GetMe)
		users.PUT("/:id", middlewares.IsLogged(&userModel), middlewares.CanSeePassword(&userModel), userController.UpdateUser)

	}
}
