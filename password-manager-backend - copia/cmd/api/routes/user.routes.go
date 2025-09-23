package userroutes

import (
	"password-manager-backend/cmd/api/controllers"

	"github.com/gin-gonic/gin"
)

func UserRoutes(rg *gin.RouterGroup) {
	users := rg.Group("/users")
	{
		users.GET("/", controllers.GetAllUsers)
		users.POST("/", controllers.CreateUser)
	}
}
