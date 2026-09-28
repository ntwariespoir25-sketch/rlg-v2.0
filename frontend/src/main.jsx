import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "./styles/global.css";
import "./styles/professional.css";

// Import Font Awesome CSS (optional - for fallback)
import '@fortawesome/fontawesome-svg-core/styles.css';

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);