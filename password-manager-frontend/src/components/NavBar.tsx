import React from "react";
import { AppBar, Tabs, Tab, Toolbar } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Mapea rutas a valores válidos para Tabs
  const validTabs = ["/", "/profile", "/users", "/login", "/ObsidianNotesDisplay"];

  // Si la ruta actual no coincide, marcar Home por defecto
  const currentTab = validTabs.includes(location.pathname) ? location.pathname : "/";

  const handleChange = (_: React.SyntheticEvent, newValue: string) => {
    navigate(newValue);
  };

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Tabs
          value={currentTab}
          onChange={handleChange}
          textColor="inherit"
          indicatorColor="secondary"
        >
          <Tab label="Home" value="/" />
          <Tab label="Perfil" value="/profile" />
          <Tab label="Usuarios" value="/users" />
          <Tab label="Login" value="/login" />
          <Tab label="Apuntes Go" value="/ObsidianNotesDisplay" />
        </Tabs>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
