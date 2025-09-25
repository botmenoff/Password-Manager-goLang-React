import React, { useState } from "react";
import { AppBar, Tabs, Tab, Toolbar } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Detectar tab activa según la URL
  const [value, setValue] = useState(location.pathname);

  const handleChange = (_: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
    navigate(newValue);
  };

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Tabs value={value} onChange={handleChange} textColor="inherit">
          <Tab label="Home" value="/" />
          <Tab label="Perfil" value="/profile" />
          <Tab label="Usuarios" value="/users" />
          <Tab label="Login" value="/login" />
        </Tabs>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
