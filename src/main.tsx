import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// Корпоративный UI-kit: подключаем сначала, чтобы Tailwind мог переопределять при необходимости
import "@sber-orm/ui-kit/index.css";
import App from "./App";
import "./styles.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
