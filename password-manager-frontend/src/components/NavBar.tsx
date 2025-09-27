import React, { useEffect, useState } from "react";
import { AppBar, Tabs, Tab, Toolbar } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { getMe } from "../services/api.service";
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
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  // 🔹 Rutas visibles en tabs
  const tabs = [
    { label: "Notas", path: "/notes" },
    { label: "Perfil", path: "/profile" },
    { label: "Apuntes Obsidian", path: "/obsidian" },
    { label: "API Docs", path: "/apidocs" },
  ];

  if (user?.admin) {
    tabs.push({ label: "Admin Panel", path: "/admin" });
  }

  const currentTab = tabs.some((t) => t.path === location.pathname)
    ? location.pathname
    : false;

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
          {tabs.map((tab) => (
            <Tab key={tab.path} label={tab.label} value={tab.path} />
          ))}
        </Tabs>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
