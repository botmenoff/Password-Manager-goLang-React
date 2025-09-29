import React, { useState, useEffect } from "react";
import { TextField, Button, Typography, Box } from "@mui/material";

// Props: valor de la contraseña y callback para cambiarla
interface PasswordSuggesterProps {
  password: string;
  onChange: (value: string) => void;
}

const PasswordSuggester: React.FC<PasswordSuggesterProps> = ({ password, onChange }) => {
  const [strength, setStrength] = useState<string>("");

  // Función simple para generar una contraseña aleatoria
  const generatePassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
    let pass = "";
    for (let i = 0; i < 12; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    onChange(pass);
  };

  // Evaluar la fuerza de la contraseña
  useEffect(() => {
    if (!password) {
      setStrength("");
    } else if (password.length < 6) {
      setStrength("Débil");
    } else if (password.length < 10) {
      setStrength("Media");
    } else {
      // Si contiene letras, números y símbolos, es fuerte
      const hasLetters = /[a-zA-Z]/.test(password);
      const hasNumbers = /[0-9]/.test(password);
      const hasSymbols = /[!@#$%^&*()_+]/.test(password);
      if (hasLetters && hasNumbers && hasSymbols) {
        setStrength("Fuerte");
      } else {
        setStrength("Media");
      }
    }
  }, [password]);

  // Color según la fuerza
  const getStrengthColor = () => {
    switch (strength) {
      case "Débil":
        return "red";
      case "Media":
        return "orange";
      case "Fuerte":
        return "green";
      default:
        return "";
    }
  };

  return (
    <Box mt={1}>
      <Box display="flex" gap={1} alignItems="center">
        <TextField
          fullWidth
          margin="dense"
          label="Password"
          value={password}
          onChange={(e) => onChange(e.target.value)}
        />
        <Button variant="outlined" onClick={generatePassword}>
          Sugerir
        </Button>
      </Box>
      {strength && (
        <Typography variant="caption" sx={{ color: getStrengthColor(), mt: 0.5 }}>
          Contraseña {strength}
        </Typography>
      )}
    </Box>
  );
};

export default PasswordSuggester;
