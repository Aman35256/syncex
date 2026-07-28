import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./Auth";
import Dashboard from "./Dashboardservice";
import "./styles.css";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
    <Dashboard />
  </StrictMode>,
);
