import React from "react";
import {
    Table, TableBody, TableCell, TableHead, TableRow, Avatar, Button
} from "@mui/material";
import type { User } from "../models/User.model";

interface UsersTableProps {
    users: User[];
    onEdit: (user: User) => void;
    onDelete: (id: number) => void;
}

const UsersTable: React.FC<UsersTableProps> = ({ users, onEdit, onDelete }) => (
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
            {users.map((user) => (
                <TableRow key={user.id}>
                    <TableCell>{user.id}</TableCell>
                    <TableCell><Avatar src={user.icon} sx={{ width: 40, height: 40 }} /></TableCell>
                    <TableCell>{user.username ?? ""}</TableCell>
                    <TableCell>{user.email ?? ""}</TableCell>
                    <TableCell>{user.password ?? ""}</TableCell>
                    <TableCell>{String(user.admin ?? false)}</TableCell>
                    <TableCell>
                        <Button variant="contained" color="primary" sx={{ mr: 1 }} onClick={() => onEdit(user)}>Editar</Button>
                        <Button variant="contained" color="error" onClick={() => onDelete(Number(user.id))}>Eliminar</Button>
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
    </Table>
);

export default UsersTable;
