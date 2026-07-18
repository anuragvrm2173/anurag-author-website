import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import { SiteSettingsProvider } from "./context/SiteSettingsContext";
import { installRuntimeTrace, shouldEnableRuntimeTrace } from "./utils/runtimeTrace";

import "./styles/variables.css";
import "./styles/globals.css";
import "./styles/utilities.css";
import "./styles/typography.css";
import "./styles/animations.css";
import "./styles/responsive.css";
import "./components/reader/reader.css";

if (shouldEnableRuntimeTrace()) {
  installRuntimeTrace();
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <SiteSettingsProvider>
          <App />
        </SiteSettingsProvider>
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>
);