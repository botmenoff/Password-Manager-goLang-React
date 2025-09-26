package models

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"time"
)

type UserModel struct {
	DB *sql.DB
}

type UpdateUserRequest struct {
	Userame string `json:"username"`
	Email   string `json:"email"`
}

type User struct {
	Id       int    `json:"id"`
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password,omitempty" binding:"required,min=8,max=64"`
	Username string `json:"username" binding:"required,min=3,max=32"`
	Icon     string `json:"icon" binding:"omitempty,max=256"`
	Admin    bool   `json:"admin" binding:"omitempty"`
}

func (m *UserModel) Insert(user *User) error {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	query := "INSERT INTO users (email, password, username, icon) VALUES (?, ?, ?, ?)"
	result, err := m.DB.ExecContext(ctx, query, user.Email, user.Password, user.Username, user.Icon)

	if err != nil {
		// Usamos fmt para imprimir por consola
		return fmt.Errorf("error inserting user: %w", err)
	}
	id, err := result.LastInsertId()
	if err != nil {
		return fmt.Errorf("error getting last insert id: %w", err)
	}

	user.Id = int(id)
	return nil
}

func (m *UserModel) GetUserFromEmail(email string) (*User, error) { // Devolver un Usuario y un error
	// Creamos un contexto con un timeout de 3 segundos para que la consulta no bloquee indefinidamente
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel() // Es buena practica usar el cancel cuando se usa WithTimeout

	query := "SELECT id, username, email, icon, password, admin FROM users WHERE email = ?"
	user := &User{} // Puntero a un usuario
	err := m.DB.QueryRowContext(ctx, query, email).Scan(&user.Id, &user.Username, &user.Email, &user.Icon, &user.Password, &user.Admin)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, sql.ErrNoRows
		}
		return nil, err
	}
	return user, nil
}

func (m *UserModel) GetByID(id int) (*User, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	query := "SELECT id, email, username, icon, admin, password FROM users WHERE id = ?"
	row := m.DB.QueryRowContext(ctx, query, id)

	var u User
	err := row.Scan(&u.Id, &u.Email, &u.Username, &u.Icon, &u.Admin, &u.Password)
	if err != nil {
		return nil, err
	}

	return &u, nil
}

func (m *UserModel) GetAll() ([]User, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	query := "SELECT id, email, username, icon, admin, password FROM users"
	rows, err := m.DB.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var users []User
	for rows.Next() {
		var u User
		err := rows.Scan(&u.Id, &u.Email, &u.Username, &u.Icon, &u.Admin, &u.Password)
		if err != nil {
			return nil, err
		}
		users = append(users, u)
	}

	return users, nil
}

func (um *UserModel) UpdateUserByID(id int, req UpdateUserRequest) error {
	_, err := um.DB.Exec(`
		UPDATE users 
		SET username = ?, email = ? 
		WHERE id = ?`,
		req.Userame, req.Email, id,
	)
	return err
}

func (um *UserModel) DeleteUserByID(id int) error {
	_, err := um.DB.Exec(`DELETE FROM users WHERE id = ?`, id)
	return err
}
