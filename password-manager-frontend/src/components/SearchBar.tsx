import React from "react";
import { TextField, Box } from "@mui/material";

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, placeholder = "Buscar..." }) => {
    return (
        <Box sx={{ width: "100%" }}>
            <TextField
                fullWidth
                variant="outlined"
                size="small"
                label={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </Box>
    );
};

export default SearchBar;
