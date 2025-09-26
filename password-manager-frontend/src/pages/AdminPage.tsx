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
} from "@mui/material";
import { getAllUsers, deleteUser } from "../services/api.service";
import type { User } from "../models/User.model";

const AdminPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

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

    // Abrir diálogo de confirmación
    const handleOpenDialog = (id: number): void => {
        setSelectedUserId(id);
        setOpenDialog(true);
    };

    // Cerrar diálogo
    const handleCloseDialog = (): void => {
        setSelectedUserId(null);
        setOpenDialog(false);
    };

    // Confirmar eliminación
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
                                <TableCell>{String(user.username ?? "")}</TableCell>
                                <TableCell>{String(user.email ?? "")}</TableCell>
                                <TableCell>{String(user.password ?? "")}</TableCell>
                                <TableCell>{String(user.admin ?? false)}</TableCell>
                                <TableCell>
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

            {/* Dialog de confirmación */}
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
        </Box>
    );
};

export default AdminPage;
