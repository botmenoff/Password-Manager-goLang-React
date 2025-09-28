import React, { useState, useEffect } from "react";
import { Box, CircularProgress } from "@mui/material";
import MarkdownViewer from "../components/MarkdownViwer";
import MarkdownPagination from "../components/MarkdownPagination";
import ScrollButtons from "../components/ScrollButtons";

const ObsidianNotesDisplay: React.FC = () => {
  const files = ["/docs/GoLang.md", "/docs/Proyecto.md"];

  const [page, setPage] = useState(1);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadMarkdown = async () => {
      setLoading(true);
      try {
        const res = await fetch(files[page - 1]);
        const text = await res.text();
        setContent(text);
      } catch (err) {
        setContent("# Error cargando el archivo");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    void loadMarkdown();
  }, [page]);

  const handleChange = (_: React.ChangeEvent<unknown>, value: number) => setPage(value);

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" px={2} py={4}>
      {loading ? <CircularProgress /> : <MarkdownViewer content={content} />}
      <MarkdownPagination count={files.length} page={page} onChange={handleChange} />
      <ScrollButtons/>
    </Box>
  );
};

export default ObsidianNotesDisplay;
