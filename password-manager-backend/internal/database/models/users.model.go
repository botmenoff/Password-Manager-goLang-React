package database

import "database/sql"

type UserModel struct {
	DB *sql.DB
}

type User struct {
	ID       int    `json:"id"`
	Email    string `json:"email"`
	Password string `json:"-"`
	Username string `json:"username"`
	Icon     string `json:"icon"`
}
