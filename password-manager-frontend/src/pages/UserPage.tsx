import React, { useState, useEffect } from "react";
import { Box, Typography, Avatar, CircularProgress, Button, TextField, Alert } from "@mui/material";
import { getMe, updateUser } from "../services/api.service";
import type { User } from "../models/User.model";
import { cookieService } from "../services/cookie.service";

const UserPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getMe();
        setUser(data);
        setUsername(data.username);
        setEmail(data.email);
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
        else setError("Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    cookieService.clearAuth();
    window.location.reload();
  };

  const handleSave = async () => {
    if (!user) return;
    setError(null);
    setSuccess(null);
    try {
      setSaving(true);
      await updateUser(user.id, { username, email });
      setUser({ ...user, username, email });
      setSuccess("¡Datos actualizados correctamente!");
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Error desconocido");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <CircularProgress />;
  if (!user) return null;

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      px={2}
      sx={{ backgroundColor: "#f9f9f9" }}
    >
      <Avatar src={user.icon} sx={{ width: 80, height: 80, mb: 2 }} />

      {/* Mostrar mensajes */}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      {/* Campos editables */}
      <TextField
        label="Usuario"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        margin="normal"
      />
      <TextField
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        margin="normal"
      />

      <Typography variant="body2" color="textSecondary" mt={2}>
        {user.admin ? "Admin" : "Usuario normal"}
      </Typography>
      <Typography variant="body1">Contraseña: {user.password}</Typography>

      <Box display="flex" gap={2} mt={3}>
        <Button
          variant="contained"
          color="primary"
          disabled={saving}
          onClick={handleSave}
        >
          {saving ? "Guardando..." : "Guardar cambios"}
        </Button>

        <Button
          variant="outlined"
          color="secondary"
          onClick={handleLogout}
        >
          Cerrar sesión
        </Button>
      </Box>
    </Box>
  );
};

export default UserPage;
