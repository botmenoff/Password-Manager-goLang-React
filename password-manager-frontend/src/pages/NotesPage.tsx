import React, { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import type { Note } from "../models/Notes.model";
import { getMyNotes, createNote, updateNote, deleteNote, getMyNotesSortedByPassword } from "../services/api.service";
import NotesTable from "../components/NotesTable";
import NoteDialog from "../components/NoteDialog";
import ConfirmDialog from "../components/ConfirmDialog";

const NotesPage: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("ASC"); // <-- nuevo estado

  const [openDialog, setOpenDialog] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [noteText, setNoteText] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [openConfirm, setOpenConfirm] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<number | null>(null);

  const fetchNotes = async () => {
    try { setLoading(true); setNotes(await getMyNotes()); }
    catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleSave = async () => {
    if (!editingNote) return;
    try {
      if (editingNote.id && editingNote.id > 0) await updateNote(editingNote.id, noteText, username, password);
      else await createNote(noteText, username, password);

      setOpenDialog(false);
      setEditingNote(null);
      setNoteText(""); setUsername(""); setPassword("");
      fetchNotes();
    } catch (err) { console.error(err); }
  };

  const handleEdit = (note: Note) => {
    setEditingNote(note);
    setNoteText(note.note_text);
    setUsername(note.username || "");
    setPassword(note.password || "");
    setOpenDialog(true);
  };

  const handleCreate = () => {
    setEditingNote({ id: 0, user_id: 0, note_text: "", username: "", password: "", created_at: new Date() });
    setNoteText(""); setUsername(""); setPassword("");
    setOpenDialog(true);
  };

  const handleDeleteClick = (id: number) => { setNoteToDelete(id); setOpenConfirm(true); };
  const handleConfirmDelete = async () => {
    if (noteToDelete !== null) {
      try { await deleteNote(noteToDelete); setNotes(prev => prev.filter(n => n.id !== noteToDelete)); }
      catch (err) { console.error(err); }
      finally { setOpenConfirm(false); setNoteToDelete(null); }
    }
  };

  const handleSortByPassword = async () => {
    try {
      setLoading(true);
      const newOrder = sortOrder === "ASC" ? "DESC" : "ASC"; // alterna orden
      const sortedNotes = await getMyNotesSortedByPassword(newOrder);
      setNotes(sortedNotes);
      setSortOrder(newOrder);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNotes(); }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>Mis Notas</Typography>
      <Button variant="contained" color="primary" onClick={handleCreate}>Nueva Nota</Button>
      {loading ? <Typography sx={{ mt: 2 }}>Cargando...</Typography> :
        <NotesTable
          notes={notes}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
          onSortByPassword={handleSortByPassword}
        />}
      <NoteDialog
        open={openDialog} note={editingNote} noteText={noteText} username={username} password={password}
        onClose={() => setOpenDialog(false)} onSave={handleSave}
        onChangeNoteText={setNoteText} onChangeUsername={setUsername} onChangePassword={setPassword}
      />
      <ConfirmDialog open={openConfirm} onClose={() => setOpenConfirm(false)} onConfirm={handleConfirmDelete} />
    </Box>
  );
};

export default NotesPage;
