import React from "react";
import { Box, Button } from "@mui/material";

const ScrollButtons: React.FC = () => {
    const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
    const scrollToBottom = () => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });

    return (
        <Box
            sx={{
                position: "fixed",
                right: 16,
                top: "50%",
                transform: "translateY(-50%)",
                display: "flex",
                flexDirection: "column",
                gap: 1,
                zIndex: 1000,
            }}
        >
            <Button
                onClick={scrollToTop}
                variant="contained"
                sx={{ width: 40, height: 40, minWidth: 0, fontSize: 20, p: 0 }}
            >
                ↑
            </Button>
            <Button
                onClick={scrollToBottom}
                variant="contained"
                sx={{ width: 40, height: 40, minWidth: 0, fontSize: 20, p: 0 }}
            >
                ↓
            </Button>
        </Box>
    );
};

export default ScrollButtons;
