import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from "@mui/material";
import type { User } from "../models/User.model";

interface EditUserDialogProps {
    open: boolean;
    user: User | null;
    username: string;
    email: string;
    onClose: () => void;
    onSave: () => void;
    onChangeUsername: (value: string) => void;
    onChangeEmail: (value: string) => void;
}

const EditUserDialog: React.FC<EditUserDialogProps> = ({
    open, username, email,
    onClose, onSave,
    onChangeUsername, onChangeEmail
}) => (
    <Dialog open={open} onClose={onClose}>
        <DialogTitle>Editar Usuario</DialogTitle>
        <DialogContent>
            <TextField
                fullWidth
                margin="dense"
                label="Nombre de usuario"
                value={username}
                onChange={(e) => onChangeUsername(e.target.value)}
            />
            <TextField
                fullWidth
                margin="dense"
                label="Email"
                type="email"
                value={email}
                onChange={(e) => onChangeEmail(e.target.value)}
            />
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose} color="primary">Cancelar</Button>
            <Button onClick={onSave} variant="contained" color="success">Guardar</Button>
        </DialogActions>
    </Dialog>
);

export default EditUserDialog;
