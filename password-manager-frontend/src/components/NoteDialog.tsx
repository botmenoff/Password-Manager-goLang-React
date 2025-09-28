import React from "react";
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from "@mui/material";
import type { Note } from "../models/Notes.model";

interface NoteDialogProps {
    open: boolean;
    note: Note | null;
    noteText: string;
    username: string;
    password: string;
    onClose: () => void;
    onSave: () => void;
    onChangeNoteText: (text: string) => void;
    onChangeUsername: (text: string) => void;
    onChangePassword: (text: string) => void;
}

const NoteDialog: React.FC<NoteDialogProps> = ({
    open, note, noteText, username, password,
    onClose, onSave,
    onChangeNoteText, onChangeUsername, onChangePassword
}) => (
    <Dialog open={open} onClose={onClose}>
        <DialogTitle>{note?.id ? "Editar Nota" : "Nueva Nota"}</DialogTitle>
        <DialogContent>
            <TextField fullWidth margin="dense" label="Título" value={noteText} onChange={(e) => onChangeNoteText(e.target.value)} />
            <TextField fullWidth margin="dense" label="Username" value={username} onChange={(e) => onChangeUsername(e.target.value)} />
            <TextField fullWidth margin="dense" label="Password" type="password" value={password} onChange={(e) => onChangePassword(e.target.value)} />
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose}>Cancelar</Button>
            <Button variant="contained" onClick={onSave}>Guardar</Button>
        </DialogActions>
    </Dialog>
);

export default NoteDialog;
