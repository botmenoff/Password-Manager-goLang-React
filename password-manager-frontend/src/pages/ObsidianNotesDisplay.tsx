import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Box, Pagination, CircularProgress } from "@mui/material";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const ObsidianNotesDisplay: React.FC = () => {
  // Lista de archivos Markdown en public/docs/
  const files = [
    "/docs/GoLang.md",
    "/docs/Proyecto.md",
  ];

  const [page, setPage] = useState(1);
  const [content, setContent] = useState<string>("");
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

    loadMarkdown();
  }, [page]);

  const handleChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      px={2}
      py={4}
    >
      {loading ? (
        <CircularProgress />
      ) : (
        <Box
          width="100%"
          maxWidth={1000}
          sx={{
            border: "1px solid #ddd",
            borderRadius: 2,
            p: 3,
            backgroundColor: "#fafafa",
            mb: 2,
            minHeight: 300,
            overflowX: "auto",
          }}
        >
          <ReactMarkdown
            components={{
              code({ inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || "");
                return !inline && match ? (
                  <SyntaxHighlighter
                    style={oneDark}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {content}
          </ReactMarkdown>
        </Box>
      )}

      <Pagination
        count={files.length}
        page={page}
        onChange={handleChange}
        color="primary"
        sx={{ mt: 2 }}
      />
    </Box>
  );
};

export default ObsidianNotesDisplay;
