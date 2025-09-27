import React, { useState, useEffect } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { Routes, Route, Navigate } from "react-router-dom";
import theme from "./Constants";
import AuthPanel from "./components/AuthPanel";
import UserPage from "./pages/UserPage";
import Navbar from "./components/NavBar";
import ObsidianNotesDisplay from "./pages/ObsidianNotesDisplay";
import { cookieService } from "./services/cookie.service";
import SwaggerPage from "./pages/SwaggerPage";
import AdminPage from "./pages/AdminPage";
import NotesPage from "./pages/NotesPage";

const App: React.FC = () => {
  const [hasToken, setHasToken] = useState<boolean | null>(null);

  useEffect(() => {
    const token = cookieService.getToken();
    setHasToken(!!token);
  }, []);

  if (hasToken === null) {
    return <div>Cargando...</div>;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {hasToken ? (
        <>
          <Navbar />
          <Routes>
            {/* 🔹 Redirige el home a /notes */}
            <Route path="/" element={<Navigate to="/notes" replace />} />

            <Route path="/notes" element={<NotesPage />} />
            <Route path="/profile" element={<UserPage />} />
            <Route path="/obsidian" element={<ObsidianNotesDisplay />} />
            <Route path="/apidocs" element={<SwaggerPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </>
      ) : (
        <Routes>
          <Route path="/login" element={<AuthPanel />} />
          {/* Si no hay token, cualquier ruta redirige a login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      )}
    </ThemeProvider>
  );
};

export default App;
