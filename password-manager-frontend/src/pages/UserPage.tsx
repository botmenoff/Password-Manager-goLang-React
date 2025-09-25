import React, { useState, useEffect } from "react";
import { Box, Typography, Avatar, CircularProgress, Button } from "@mui/material";
import { getMe } from "../services/api.service";
import type { User } from "../models/User.model";
import { cookieService } from "../services/cookie.service";

const UserPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getMe();
        setUser(data);
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
    cookieService.clearAuth()
    window.location.reload(); // Fuerza volver al AuthPanel
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
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
      <Typography variant="h5">{user.username}</Typography>
      <Typography variant="body1">{user.email}</Typography>
      <Typography variant="body2" color="textSecondary">
        {user.admin ? "Admin" : "Usuario normal"}
      </Typography>
      <Typography variant="body1">{user.password}</Typography>

      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 3 }}
        onClick={handleLogout}
      >
        Cerrar sesión
      </Button>
    </Box>
  );
};

export default UserPage;