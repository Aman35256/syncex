import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Dashboard from "./Dashboardservice";
import "./styles.css";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Dashboard />
  </StrictMode>,
);
