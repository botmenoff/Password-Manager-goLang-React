import React, { useEffect, useState } from "react";
import { Box, Typography, CircularProgress, Alert, TableContainer, Paper } from "@mui/material";
import type { User } from "../models/User.model";
import { getAllUsers, deleteUser, updateUser } from "../services/api.service";
import UsersTable from "../components/UsersTable";
import EditUserDialog from "../components/EditUserDialog";
import ConfirmDialog from "../components/ConfirmDialog";

const AdminPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const [openEdit, setOpenEdit] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [editUsername, setEditUsername] = useState("");
  const [editEmail, setEditEmail] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try { setUsers(await getAllUsers()); }
      catch (err) { setError(err instanceof Error ? err.message : "Error al cargar usuarios"); }
      finally { setLoading(false); }
    };
    void fetchUsers();
  }, []);

  const handleEdit = (user: User) => {
    setEditUser(user);
    setEditUsername(user.username ?? "");
    setEditEmail(user.email ?? "");
    setOpenEdit(true);
  };

  const handleSaveEdit = async () => {
    if (!editUser) return;
    try {
      await updateUser(editUser.id, { username: editUsername, email: editEmail });
      setUsers(prev => prev.map(u => u.id === editUser.id ? { ...u, username: editUsername, email: editEmail } : u));
    } catch (err) {
      if (err instanceof Error) alert("Error al actualizar usuario: " + err.message);
    } finally {
      setOpenEdit(false);
    }
  };

  const handleDelete = (id: number) => {
    setSelectedUserId(id);
    setOpenConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedUserId === null) return;
    try {
      await deleteUser(selectedUserId);
      setUsers(prev => prev.filter(u => u.id !== selectedUserId));
    } catch (err) {
      if (err instanceof Error) alert("Error al eliminar usuario: " + err.message);
    } finally {
      setOpenConfirm(false);
      setSelectedUserId(null);
    }
  };

  if (loading) return <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh"><CircularProgress /></Box>;
  if (error) return <Box p={4}><Alert severity="error">{error}</Alert></Box>;

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>Lista de Usuarios</Typography>
      <TableContainer component={Paper}>
        <UsersTable users={users} onEdit={handleEdit} onDelete={handleDelete} />
      </TableContainer>
      <EditUserDialog
        open={openEdit} user={editUser} username={editUsername} email={editEmail}
        onClose={() => setOpenEdit(false)} onSave={handleSaveEdit}
        onChangeUsername={setEditUsername} onChangeEmail={setEditEmail}
      />
      <ConfirmDialog
        open={openConfirm} onClose={() => setOpenConfirm(false)} onConfirm={handleConfirmDelete}
        title="Confirmar eliminación" content="¿Estás seguro de que deseas eliminar este usuario?"
      />
    </Box>
  );
};

export default AdminPage;
