import React from "react";
import type { CSSProperties } from "react";
import ReactMarkdown from "react-markdown";
import { Box } from "@mui/material";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface MarkdownViewerProps {
  content: string;
}

const MarkdownViewer: React.FC<MarkdownViewerProps> = ({ content }) => (
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
        code({ inline, className, children, ...props }: any) {
          const match = /language-(\w+)/.exec(className || "");
          return !inline && match ? (
            <SyntaxHighlighter
              style={oneDark as { [key: string]: CSSProperties }}
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
);

export default MarkdownViewer;
