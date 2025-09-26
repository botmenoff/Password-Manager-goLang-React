import React, { useEffect, useState } from "react";
import { AppBar, Tabs, Tab, Toolbar } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { getMe } from "../services/api.service"; // para saber si es admin
import type { User } from "../models/User.model";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const me = await getMe();
        setUser(me);
      } catch {
        setUser(null); // si no está logueado o hay error
      }
    };

    fetchUser();
  }, []);

  // Rutas válidas
  const validTabs = ["/", "/profile", "/login", "/ObsidianNotesDisplay", "/ApiDocs"];
  if (user?.admin) {
    validTabs.push("/users"); // solo si es admin
  }

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
          {user?.admin && <Tab label="users" value="/users" />}
          <Tab label="Login" value="/login" />
          <Tab label="Apuntes Go" value="/ObsidianNotesDisplay" />
          <Tab label="API Docs" value="/ApiDocs" />
        </Tabs>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
