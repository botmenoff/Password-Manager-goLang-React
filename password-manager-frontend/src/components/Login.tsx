import React, { useState } from "react";
import { TextField, Button, Box, Typography, Alert } from "@mui/material";
import { loginUser } from "../services/api.services";
import type { LoginRequest } from "../models/LoginRequest.models";

const Login: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const requestData: LoginRequest = { email, password };
            const data = await loginUser(requestData);

            // Guardar token en localStorage para desarrollo rápido
            localStorage.setItem("token", data.token);

            // Aquí podrías redirigir al dashboard
            console.log("Login exitoso", data);
        } catch (err: unknown) {
            // Type guard
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
        >
            <Typography variant="h4" mb={3}>
                Login
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <Box
                component="form"
                onSubmit={handleSubmit}
                display="flex"
                flexDirection="column"
                gap={2}
                width="100%"
                maxWidth={400}
            >
                <TextField
                    label="Email"
                    type="email"
                    value={email}
                    required
                    onChange={(e) => setEmail(e.target.value)}
                />

                <TextField
                    label="Password"
                    type="password"
                    value={password}
                    required
                    onChange={(e) => setPassword(e.target.value)}
                />

                <Button variant="contained" color="primary" type="submit" disabled={loading}>
                    {loading ? "Cargando..." : "Login"}
                </Button>
            </Box>
        </Box>
    );
};

export default Login;
