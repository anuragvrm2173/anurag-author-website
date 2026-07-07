import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";

import "./styles/variables.css";
import "./styles/globals.css";
import "./styles/utilities.css";
import "./styles/typography.css";
import "./styles/animations.css";
import "./styles/responsive.css";
import "./components/reader/reader.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);