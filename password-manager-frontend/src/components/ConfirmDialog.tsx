import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";

interface ConfirmDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    content?: string;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ open, onClose, onConfirm, title = "Confirmar eliminación", content = "¿Estás seguro de que deseas eliminar?" }) => (
    <Dialog open={open} onClose={onClose}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>{content}</DialogContent>
        <DialogActions>
            <Button onClick={onClose} color="primary">Cancelar</Button>
            <Button onClick={onConfirm} color="error">Eliminar</Button>
        </DialogActions>
    </Dialog>
);

export default ConfirmDialog;
