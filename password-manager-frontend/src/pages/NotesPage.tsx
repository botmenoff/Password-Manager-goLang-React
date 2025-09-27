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
    searchNotes,
} from "../services/api.service";

const NotesPage: React.FC = () => {
    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(true);

    // Búsqueda
    const [search, setSearch] = useState("");

    // Crear/editar notas
    const [open, setOpen] = useState(false);
    const [editingNote, setEditingNote] = useState<Note | null>(null);
    const [noteText, setNoteText] = useState("");

    // Eliminar notas
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

    const handleSearch = async (query: string) => {
        if (!query.trim()) {
            fetchNotes();
            return;
        }
        try {
            setLoading(true);
            const data = await searchNotes(query);
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

    // 🔹 Debounce para búsqueda en vivo
    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (search.trim()) {
                handleSearch(search);
            } else {
                fetchNotes();
            }
        }, 500);

        return () => clearTimeout(delayDebounce);
    }, [search]);


    useEffect(() => {
        fetchNotes();
    }, []);

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
                Mis Notas
            </Typography>

            {/* Barra de búsqueda */}
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                <TextField
                    label="Buscar nota"
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <Button variant="contained" color="primary" onClick={handleCreate}>
                    Nueva Nota
                </Button>
            </Box>

            {loading ? (
                <Typography sx={{ mt: 2 }}>Cargando...</Typography>
            ) : (
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: "#1976D2" }}>
                            <TableCell sx={{ color: "white" }}>ID</TableCell>
                            <TableCell sx={{ color: "white" }}>Texto</TableCell>
                            <TableCell sx={{ color: "white" }}>Creadas en</TableCell>
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
                                <TableCell>
                                    {new Date(note.created_at).toLocaleString()}
                                </TableCell>
                                <TableCell align="right">
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleEdit(note)}
                                    >
                                        Editar
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

            {/* Modal Crear/Editar */}
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

            {/* Confirmación eliminación */}
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
