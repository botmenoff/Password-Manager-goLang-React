import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Alert,
} from "@mui/material";
import { getNotesByUserId } from "../services/api.service";
import type { Note } from "../models/Notes.model";

interface UserNotesDialogProps {
  userId: number;
  open: boolean;
  onClose: () => void;
}

const UserNotesDialog: React.FC<UserNotesDialogProps> = ({ userId, open, onClose }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    const fetchNotes = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getNotesByUserId(userId);
        setNotes(data);
      } catch (err) {
        if (err instanceof Error) setError(err.message);
        else setError("Error al cargar notas");
      } finally {
        setLoading(false);
      }
    };

    void fetchNotes();
  }, [userId, open]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Notas del Usuario {userId}</DialogTitle>
      <DialogContent>
        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : notes.length === 0 ? (
          <Alert severity="info">Este usuario no tiene notas.</Alert>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Texto</TableCell>
                <TableCell>Creada en</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {notes.map((note) => (
                <TableRow key={note.id}>
                  <TableCell>{note.id}</TableCell>
                  <TableCell>{note.note_text}</TableCell>
                  <TableCell>{new Date(note.created_at).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserNotesDialog;
