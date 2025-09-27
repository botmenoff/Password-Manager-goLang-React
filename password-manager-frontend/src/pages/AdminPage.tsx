import React, { useEffect, useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Avatar,
  TextField,
} from "@mui/material";
import { getAllUsers, deleteUser, updateUser } from "../services/api.service";
import type { User } from "../models/User.model";

const AdminPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Para eliminar
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  // Para editar
  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [editUsername, setEditUsername] = useState<string>("");
  const [editEmail, setEditEmail] = useState<string>("");

  // Cargar usuarios
  useEffect(() => {
    const fetchUsers = async (): Promise<void> => {
      try {
        const data: User[] = await getAllUsers();
        setUsers(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Error al cargar usuarios");
        }
      } finally {
        setLoading(false);
      }
    };

    void fetchUsers();
  }, []);

  // Eliminar usuario
  const handleOpenDialog = (id: number): void => {
    setSelectedUserId(id);
    setOpenDialog(true);
  };

  const handleCloseDialog = (): void => {
    setSelectedUserId(null);
    setOpenDialog(false);
  };

  const handleConfirmDelete = async (): Promise<void> => {
    if (selectedUserId === null) return;

    try {
      await deleteUser(selectedUserId);
      setUsers((prev: User[]) => prev.filter((u) => u.id !== selectedUserId));
    } catch (err) {
      if (err instanceof Error) {
        alert("Error al eliminar usuario: " + err.message);
      }
    } finally {
      handleCloseDialog();
    }
  };

  // Editar usuario
  const handleOpenEditDialog = (user: User): void => {
    setEditUser(user);
    setEditUsername(user.username ?? "");
    setEditEmail(user.email ?? "");
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = (): void => {
    setEditUser(null);
    setEditUsername("");
    setEditEmail("");
    setOpenEditDialog(false);
  };

  const handleConfirmEdit = async (): Promise<void> => {
    if (!editUser) return;

    try {
      await updateUser(editUser.id, {
        username: editUsername,
        email: editEmail,
      });

      setUsers((prev: User[]) =>
        prev.map((u) =>
          u.id === editUser.id
            ? { ...u, username: editUsername, email: editEmail }
            : u
        )
      );
    } catch (err) {
      if (err instanceof Error) {
        alert("Error al actualizar usuario: " + err.message);
      }
    } finally {
      handleCloseEditDialog();
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={4}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Lista de Usuarios
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#1976D2" }}>
              <TableCell sx={{ color: "#fff" }}>ID</TableCell>
              <TableCell sx={{ color: "#fff" }}>Icon</TableCell>
              <TableCell sx={{ color: "#fff" }}>Nombre</TableCell>
              <TableCell sx={{ color: "#fff" }}>Email</TableCell>
              <TableCell sx={{ color: "#fff" }}>Contraseña</TableCell>
              <TableCell sx={{ color: "#fff" }}>Admin</TableCell>
              <TableCell sx={{ color: "#fff" }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user: User) => (
              <TableRow key={user.id}>
                <TableCell>{String(user.id)}</TableCell>
                <TableCell>
                  <Avatar src={user.icon} sx={{ width: 40, height: 40 }} />
                </TableCell>
                <TableCell>{String(user.username ?? "")}</TableCell>
                <TableCell>{String(user.email ?? "")}</TableCell>
                <TableCell>{String(user.password ?? "")}</TableCell>
                <TableCell>{String(user.admin ?? false)}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ mr: 1 }}
                    onClick={() => handleOpenEditDialog(user)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleOpenDialog(Number(user.id))}
                  >
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog de confirmación de eliminación */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          ¿Estás seguro de que deseas eliminar este usuario?
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

      {/* Dialog de edición */}
      <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
        <DialogTitle>Editar Usuario</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            label="Nombre de usuario"
            value={editUsername}
            onChange={(e) => setEditUsername(e.target.value)}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Email"
            type="email"
            value={editEmail}
            onChange={(e) => setEditEmail(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleConfirmEdit} variant="contained" color="success">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminPage;
