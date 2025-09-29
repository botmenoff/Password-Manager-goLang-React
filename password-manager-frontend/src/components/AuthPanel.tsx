import React, { useState } from "react";
import { Box, Tabs, Tab, Typography } from "@mui/material";
import Login from "./Login";
import Register from "./Register";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}

const AuthPanel: React.FC = () => {
  const [tabIndex, setTabIndex] = useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      px={2}
      sx={{ backgroundColor: "#ffffff" }} // fondo blanco
    >
      <Typography variant="h4" mb={3}>
        Bienvenido
      </Typography>

      <Tabs value={tabIndex} onChange={handleChange} centered>
        <Tab label="Login" />
        <Tab label="Register" />
      </Tabs>

      <TabPanel value={tabIndex} index={0}>
        <Login />
      </TabPanel>
      <TabPanel value={tabIndex} index={1}>
        <Register />
      </TabPanel>
    </Box>
  );
};

export default AuthPanel;
