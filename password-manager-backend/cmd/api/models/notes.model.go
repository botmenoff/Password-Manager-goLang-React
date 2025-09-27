package models

import (
	"database/sql"
	"errors"
)

type NotesModel struct {
	DB *sql.DB
}

type Notes struct {
	Id        int    `json:"id"`
	UserId    int    `json:"user_id"`
	NoteText  string `json:"note_text" binding:"required,min=3,max=255"`
	CreatedAt string `json:"created_at"`
}

// GetAll obtiene todas las notas
func (m *NotesModel) GetAll() ([]Notes, error) {
	rows, err := m.DB.Query("SELECT id, user_id, note_text FROM notes")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var notes []Notes
	for rows.Next() {
		var n Notes
		if err := rows.Scan(&n.Id, &n.UserId, &n.NoteText); err != nil {
			return nil, err
		}
		notes = append(notes, n)
	}

	return notes, nil
}

// GetByUserID obtiene todas las notas de un usuario específico
func (m *NotesModel) GetByUserID(userID int) ([]Notes, error) {
	rows, err := m.DB.Query("SELECT id, user_id, note_text FROM notes WHERE user_id = ?", userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var notes []Notes
	for rows.Next() {
		var n Notes
		if err := rows.Scan(&n.Id, &n.UserId, &n.NoteText); err != nil {
			return nil, err
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
		"INSERT INTO notes (user_id, note_text) VALUES (?, ?)",
		note.UserId,
		note.NoteText,
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

// UpdateByID actualiza el texto de una nota por ID
func (m *NotesModel) UpdateByID(id int, noteText string) error {
	result, err := m.DB.Exec(
		"UPDATE notes SET note_text = ? WHERE id = ?",
		noteText,
		id,
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
	err := m.DB.QueryRow("SELECT id, user_id, note_text FROM notes WHERE id = ?", id).
		Scan(&n.Id, &n.UserId, &n.NoteText)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, sql.ErrNoRows
		}
		return nil, err
	}
	return &n, nil
}

func (nm *NotesModel) SearchByText(userID int, text string) ([]Notes, error) {
	query := `SELECT id, note_text, user_id, created_at 
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
		if err := rows.Scan(&note.Id, &note.NoteText, &note.UserId, &note.CreatedAt); err != nil {
			return nil, err
		}
		notes = append(notes, note)
	}
	return notes, nil
}
