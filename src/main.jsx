import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.jsx";
import { LocaleProvider } from "./locale.jsx";
import "./styles.css";
import "./page.css";
import "./gradient.css";
import "./polish.css";
import "./brand.css";
import "./homepage.css";
import "./pages.css";
import "./hero-motion.css";
import '@fontsource-variable/inter';
import './typography.css';
import './enrichment.css';
import './map-interactions.css';
import './header.css';

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <LocaleProvider><App /></LocaleProvider>
  </React.StrictMode>,
);
