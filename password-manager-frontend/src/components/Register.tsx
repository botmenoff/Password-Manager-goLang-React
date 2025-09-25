import React, { useState } from "react";
import { TextField, Button, Box, Typography, Alert } from "@mui/material";
import { registerUser } from "../services/api.service"; // tu servicio
import type { RegisterRequest } from "../models/RegisterRequest.model";

const Register: React.FC = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null); // ✅ Estado de éxito
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null); // resetear mensaje de éxito al enviar

    try {
      const requestData: RegisterRequest = { email, username, password };
      const data = await registerUser(requestData);

      console.log("Registro exitoso", data);
      setSuccess("¡Registrado correctamente!"); // mensaje de éxito
      setEmail("");
      setUsername("");
      setPassword("");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error desconocido");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="50vh"
      px={2}
      sx={{ backgroundColor: "#ffffff" }} // fondo blanco
    >
      <Typography variant="h4" mb={3}>
        Registro
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>} {/* ✅ Mensaje verde */}

      <Box component="form" onSubmit={handleSubmit} width="100%" maxWidth={400}>
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          margin="normal"
          required
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          disabled={loading}
        >
          {loading ? "Registrando..." : "Registrarse"}
        </Button>
      </Box>
    </Box>
  );
};

export default Register;
