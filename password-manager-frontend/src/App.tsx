import React, { useState, useEffect } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { Routes, Route } from "react-router-dom";
import theme from "./Constants";
import AuthPanel from "./components/AuthPanel";
import UserPage from "./pages/UserPage"; // Para usuarios logueados
import Navbar from "./components/NavBar";
// import Profile from "./pages/Profile";
import ObsidianNotesDisplay from "./pages/ObsidianNotesDisplay";
import { cookieService } from "./services/cookie.service";
import SwaggerPage from "./pages/SwaggerPage";

const App: React.FC = () => {
  const [hasToken, setHasToken] = useState<boolean | null>(null);

  useEffect(() => {
    const token = cookieService.getToken();
    setHasToken(!!token); // true si hay token, false si no
  }, []);

  if (hasToken === null) {
    // Mientras verificamos el token
    return <div>Cargando...</div>;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Normaliza estilos y aplica background */}

      {hasToken ? (
        <>
          <Navbar />
          <Routes>
            <Route path="/" element={<UserPage />} />
            {/* <Route path="/profile" element={<Profile />} /> */}
            {/* <Route path="/users" element={<Users />} /> */}
            <Route path="/login" element={<AuthPanel />} />
            <Route path="/ObsidianNotesDisplay" element={<ObsidianNotesDisplay />} />
            <Route path="/user" element={<UserPage />} /> {/* Tu página de usuario logueado */}
            <Route path="/ApiDocs" element={<SwaggerPage />} />
          </Routes>
        </>
      ) : (
        <AuthPanel />
      )}
    </ThemeProvider>
  );
};

export default App;
