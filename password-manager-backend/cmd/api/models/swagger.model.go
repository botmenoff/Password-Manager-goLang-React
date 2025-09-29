package models

type ErrorResponse struct {
	Error string `json:"error"`
}

type VerifyNotePasswordRequest struct {
	NoteID   int    `json:"note_id"`
	Password string `json:"password"`
}
