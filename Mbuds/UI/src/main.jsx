import { StrictMode } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createRoot } from "react-dom/client";
import App from "./Auth";

import Dashboard from "./Dashboardservice"
import "./styles.css";
createRoot(document.getElementById("root")).render(
  <StrictMode>
<BrowserRouter>
  <Routes>
    <Route path="/" element={<App />} />
    <Route path="/dashboard" element={<Dashboard />} />
  </Routes>
</BrowserRouter>
</StrictMode>

);

