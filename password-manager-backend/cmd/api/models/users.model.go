package models

import (
	"context"
	"database/sql"
	"errors"
	"time"
)

type UserModel struct {
	DB *sql.DB
}

type User struct {
	Id       int    `json:"id"`
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=8,max=64"`
	Username string `json:"username" binding:"required,min=3,max=32"`
	Icon     string `json:"icon" binding:"omitempty,max=256"`
}

func (m *UserModel) Insert(user *User) error {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	query := "INSERT INTO users (email, password, username, icon) VALUES ($1, $2, $3, $4) RETURNING id"
	return m.DB.QueryRowContext(ctx, query, user.Email, user.Password, user.Username, user.Icon).Scan(&user.Id)
}

func (m *UserModel) GetUserFromEmail(email string) (*User, error) { // Devolver un Usuario y un error
	// Creamos un contexto con un timeout de 3 segundos para que la consulta no bloquee indefinidamente
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel() // Es buena practica usar el cancel cuando se usa WithTimeout

	query := "SELECT id, username, email FROM users WHERE email $1"
	u := &User{} // Puntero a un usuario
	err := m.DB.QueryRowContext(ctx, query, email).Scan(&u.Id, &u.Username, &u.Email)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, sql.ErrNoRows
		}
		return nil, err
	}
	return u, nil
}
