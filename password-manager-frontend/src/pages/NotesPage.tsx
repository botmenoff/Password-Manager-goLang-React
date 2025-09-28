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

  const [open, setOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [noteText, setNoteText] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

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
    if (!editingNote) return;

    try {
      if (editingNote.id && editingNote.id > 0) {
        await updateNote(editingNote.id, noteText, username, password);
      } else {
        await createNote(noteText, username, password);
      }

      setOpen(false);
      setNoteText("");
      setUsername("");
      setPassword("");
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
    setUsername(note.username || "");
    setPassword(note.password || "");
    setOpen(true);
  };

  const handleCreate = () => {
    setEditingNote({
      id: 0,
      user_id: 0,
      note_text: "",
      username: "",
      password: "",
      created_at: new Date(),
    });
    setNoteText("");
    setUsername("");
    setPassword("");
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
              <TableCell sx={{ color: "white" }}>Título</TableCell>
              <TableCell sx={{ color: "white" }}>Username</TableCell>
              <TableCell sx={{ color: "white" }}>Password</TableCell>
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
                <TableCell>{note.username || "--"}</TableCell>
                <TableCell>{note.password ? note.password : "--"}</TableCell>
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

      {/* Modal Crear/Editar Nota */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{editingNote?.id ? "Editar Nota" : "Nueva Nota"}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            label="Título de la "
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
