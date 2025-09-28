import React from "react";
import { Pagination } from "@mui/material";

interface MarkdownPaginationProps {
    count: number;
    page: number;
    onChange: (_: React.ChangeEvent<unknown>, value: number) => void;
}

const MarkdownPagination: React.FC<MarkdownPaginationProps> = ({ count, page, onChange }) => (
    <Pagination
        count={count}
        page={page}
        onChange={onChange}
        color="primary"
        sx={{ mt: 2 }}
    />
);

export default MarkdownPagination;
