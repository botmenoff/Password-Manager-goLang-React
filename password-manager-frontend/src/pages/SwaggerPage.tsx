import React from "react";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

const SwaggerPage: React.FC = () => {
  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <SwaggerUI url="http://localhost:8000/swagger/doc.json" />
    </div>
  );
};

export default SwaggerPage;
