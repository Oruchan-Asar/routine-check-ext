import React from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "../components/theme-provider";
import { Popup } from "./Popup";
import "../dist/output.css";

const container = document.getElementById("root");
const root = createRoot(container!);

root.render(
  <React.StrictMode>
    <ThemeProvider>
      <Popup />
    </ThemeProvider>
  </React.StrictMode>
);
