import React, { useState, useEffect } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./Constants";
import AuthPanel from "./components/AuthPanel";
import UserPage from "./pages/UserPage"; // Tu componente para usuarios logueados
import Navbar from "./components/NavBar";
import { cookieService } from "./services/cookie.service"


const App: React.FC = () => {
  const [hasToken, setHasToken] = useState<boolean | null>(null);

  useEffect(() => {
    const token = cookieService.getToken();
    setHasToken(!!token); // true si hay token, false si no
  }, []);

  if (hasToken === null) {
    // Mientras verificamos el token, podemos mostrar un loading
    return <div>Cargando...</div>;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Normaliza estilos y aplica background */}
      {hasToken ? <> <Navbar/> <UserPage /></> : <AuthPanel />}
    </ThemeProvider>
  );
};

export default App;
