import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from "@mui/material";
import type { Note } from "../models/Notes.model";
import {
    getMyNotes,
    createNote,
    updateNote,
    deleteNote,
} from "../services/api.service";

const NotesPage: React.FC = () => {
    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(true);

    // Para crear/editar notas
    const [open, setOpen] = useState(false);
    const [editingNote, setEditingNote] = useState<Note | null>(null);
    const [noteText, setNoteText] = useState("");

    // Para eliminar notas con confirmación
    const [openDialog, setOpenDialog] = useState(false);
    const [noteToDelete, setNoteToDelete] = useState<number | null>(null);

    const fetchNotes = async () => {
        try {
            setLoading(true);
            const data = await getMyNotes();
            setNotes(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            if (editingNote) {
                await updateNote(editingNote.id, noteText);
            } else {
                await createNote(noteText);
            }
            setOpen(false);
            setNoteText("");
            setEditingNote(null);
            fetchNotes();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteClick = (id: number) => {
        setNoteToDelete(id);
        setOpenDialog(true);
    };

    const handleConfirmDelete = async () => {
        if (noteToDelete !== null) {
            try {
                await deleteNote(noteToDelete);

                setNotes((prevNotes) =>
                    prevNotes.filter((note) => note.id !== noteToDelete)
                );
            } catch (err) {
                console.error(err);
            } finally {
                setOpenDialog(false);
                setNoteToDelete(null);
            }
        }
    };


    const handleCloseDialog = () => {
        setOpenDialog(false);
        setNoteToDelete(null);
    };

    const handleEdit = (note: Note) => {
        setEditingNote(note);
        setNoteText(note.note_text);
        setOpen(true);
    };

    const handleCreate = () => {
        setEditingNote(null);
        setNoteText("");
        setOpen(true);
    };

    useEffect(() => {
        fetchNotes();
    }, []);

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
                Mis Notas
            </Typography>
            <Button variant="contained" color="primary" onClick={handleCreate}>
                Nueva Nota
            </Button>

            {loading ? (
                <Typography sx={{ mt: 2 }}>Cargando...</Typography>
            ) : (
                <Table sx={{ mt: 2 }}>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: "#1976D2" }}>
                            <TableCell sx={{ color: "white" }}>ID</TableCell>
                            <TableCell sx={{ color: "white" }}>Texto</TableCell>
                            <TableCell sx={{ color: "white" }} align="right">
                                Acciones
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {notes.map((note) => (
                            <TableRow key={note.id}>
                                <TableCell>{note.id}</TableCell>
                                <TableCell>{note.note_text}</TableCell>
                                <TableCell align="right">
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleEdit(note)}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="error"
                                        sx={{ ml: 1 }}
                                        onClick={() => handleDeleteClick(note.id)}
                                    >
                                        Eliminar
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}

            {/* Modal Crear/Editar Nota */}
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>{editingNote ? "Editar Nota" : "Nueva Nota"}</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        margin="dense"
                        label="Texto de la nota"
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancelar</Button>
                    <Button variant="contained" onClick={handleSave}>
                        Guardar
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog Confirmación de Eliminación */}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Confirmar eliminación</DialogTitle>
                <DialogContent>
                    ¿Estás seguro de que deseas eliminar esta nota?
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Cancelar
                    </Button>
                    <Button onClick={handleConfirmDelete} color="error">
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default NotesPage;
