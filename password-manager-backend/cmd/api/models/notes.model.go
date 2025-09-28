package models

import (
	"database/sql"
	"errors"
	"time"
)

type NotesModel struct {
	DB *sql.DB
}

type Notes struct {
	Id        int       `json:"id"`
	UserId    int       `json:"user_id"`
	NoteText  string    `json:"note_text" binding:"required,min=3,max=255"`
	Username  string    `json:"username" binding:"required,min=3,max=255"`
	Password  string    `json:"password"` // Lo puedes llenar luego con hash
	CreatedAt time.Time `json:"created_at"`
}

// parseTime convierte []byte a time.Time
func parseTime(b []byte) (time.Time, error) {
	if b == nil {
		return time.Time{}, nil
	}
	return time.Parse("2006-01-02 15:04:05", string(b))
}

// GetAll obtiene todas las notas
func (m *NotesModel) GetAll() ([]Notes, error) {
	rows, err := m.DB.Query("SELECT id, user_id, note_text, username, password, created_at FROM notes")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var notes []Notes
	for rows.Next() {
		var n Notes
		var username sql.NullString
		var password sql.NullString
		var createdAt []byte

		if err := rows.Scan(&n.Id, &n.UserId, &n.NoteText, &username, &password, &createdAt); err != nil {
			return nil, err
		}

		if username.Valid {
			n.Username = username.String
		}
		if password.Valid {
			n.Password = password.String
		}

		if t, err := parseTime(createdAt); err == nil {
			n.CreatedAt = t
		}

		notes = append(notes, n)
	}

	return notes, nil
}

// GetByUserID obtiene todas las notas de un usuario específico
func (m *NotesModel) GetByUserID(userID int) ([]Notes, error) {
	rows, err := m.DB.Query("SELECT id, user_id, note_text, username, password, created_at FROM notes WHERE user_id = ?", userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var notes []Notes
	for rows.Next() {
		var n Notes
		var username sql.NullString
		var password sql.NullString
		var createdAt []byte

		if err := rows.Scan(&n.Id, &n.UserId, &n.NoteText, &username, &password, &createdAt); err != nil {
			return nil, err
		}

		if username.Valid {
			n.Username = username.String
		}
		if password.Valid {
			n.Password = password.String
		}

		if t, err := parseTime(createdAt); err == nil {
			n.CreatedAt = t
		}

		notes = append(notes, n)
	}

	if len(notes) == 0 {
		return nil, sql.ErrNoRows
	}

	return notes, nil
}

// Insert crea una nueva nota
func (m *NotesModel) Insert(note *Notes) error {
	result, err := m.DB.Exec(
		"INSERT INTO notes (user_id, note_text, username, password) VALUES (?, ?, ?, ?)",
		note.UserId,
		note.NoteText,
		note.Username,
		note.Password,
	)
	if err != nil {
		return err
	}

	id, err := result.LastInsertId()
	if err != nil {
		return err
	}
	note.Id = int(id)
	return nil
}

// UpdateByID actualiza el texto, username y password de una nota por ID
func (m *NotesModel) UpdateByID(id int, noteText, username, password string) error {
	result, err := m.DB.Exec(
		"UPDATE notes SET note_text = ?, username = ?, password = ? WHERE id = ?",
		noteText, username, password, id,
	)
	if err != nil {
		return err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}
	if rowsAffected == 0 {
		return sql.ErrNoRows
	}

	return nil
}

// DeleteByID elimina una nota por ID
func (m *NotesModel) DeleteByID(id int) error {
	result, err := m.DB.Exec("DELETE FROM notes WHERE id = ?", id)
	if err != nil {
		return err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}
	if rowsAffected == 0 {
		return sql.ErrNoRows
	}

	return nil
}

// GetByID obtiene una nota específica por ID
func (m *NotesModel) GetByID(id int) (*Notes, error) {
	var n Notes
	var username sql.NullString
	var password sql.NullString
	var createdAt []byte

	err := m.DB.QueryRow("SELECT id, user_id, note_text, username, password, created_at FROM notes WHERE id = ?", id).
		Scan(&n.Id, &n.UserId, &n.NoteText, &username, &password, &createdAt)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, sql.ErrNoRows
		}
		return nil, err
	}

	if username.Valid {
		n.Username = username.String
	}
	if password.Valid {
		n.Password = password.String
	}
	if t, err := parseTime(createdAt); err == nil {
		n.CreatedAt = t
	}

	return &n, nil
}

// SearchByText busca notas por texto para un usuario específico
func (nm *NotesModel) SearchByText(userID int, text string) ([]Notes, error) {
	query := `SELECT id, note_text, username, password, user_id, created_at 
	          FROM notes 
	          WHERE user_id = ? AND note_text LIKE ? 
	          ORDER BY created_at DESC`
	rows, err := nm.DB.Query(query, userID, "%"+text+"%")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var notes []Notes
	for rows.Next() {
		var note Notes
		var username sql.NullString
		var password sql.NullString
		var createdAt []byte

		if err := rows.Scan(&note.Id, &note.NoteText, &username, &password, &note.UserId, &createdAt); err != nil {
			return nil, err
		}

		if username.Valid {
			note.Username = username.String
		}
		if password.Valid {
			note.Password = password.String
		}
		if t, err := parseTime(createdAt); err == nil {
			note.CreatedAt = t
		}

		notes = append(notes, note)
	}
	return notes, nil
}
