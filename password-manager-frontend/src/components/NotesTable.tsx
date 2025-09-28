import React from "react";
import { Table, TableHead, TableRow, TableCell, TableBody, Button, Box, Typography } from "@mui/material";
import type { Note } from "../models/Notes.model";

interface NotesTableProps {
  notes: Note[];
  onEdit: (note: Note) => void;
  onDelete: (id: number) => void;
  onSortByPassword: () => void; // NUEVO callback
}

const NotesTable: React.FC<NotesTableProps> = ({ notes, onEdit, onDelete, onSortByPassword }) => (
  <Table sx={{ mt: 2 }}>
    <TableHead>
      <TableRow sx={{ backgroundColor: "#1976D2" }}>
        <TableCell sx={{ color: "white" }}>ID</TableCell>
        <TableCell sx={{ color: "white" }}>Título</TableCell>
        <TableCell sx={{ color: "white" }}>Username</TableCell>
        <TableCell
          sx={{ color: "white", cursor: "pointer", userSelect: "none" }}
          onClick={onSortByPassword}
        >
          <Box display="flex" alignItems="center" gap={0.5}>
            <Typography>Password</Typography>
            <Typography variant="caption">⇅</Typography> {/* Indicador de ordenable */}
          </Box>
        </TableCell>
        <TableCell sx={{ color: "white" }}>Creadas en</TableCell>
        <TableCell sx={{ color: "white" }} align="right">Acciones</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {notes.map((note) => (
        <TableRow key={note.id}>
          <TableCell>{note.id}</TableCell>
          <TableCell>{note.note_text}</TableCell>
          <TableCell>{note.username || "--"}</TableCell>
          <TableCell>{note.password || "--"}</TableCell>
          <TableCell>{new Date(note.created_at).toLocaleString()}</TableCell>
          <TableCell align="right">
            <Button variant="contained" color="primary" onClick={() => onEdit(note)}>Editar</Button>
            <Button variant="contained" color="error" sx={{ ml: 1 }} onClick={() => onDelete(note.id)}>Eliminar</Button>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

export default NotesTable;
