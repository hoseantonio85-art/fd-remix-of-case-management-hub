import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// Точка входа приложения. Здесь подключается BrowserRouter из react-router-dom.
// basename берётся из Vite (vite.config.ts -> base), чтобы корректно работать на GitHub Pages.
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { Toaster } from "@/shared/ui";

const queryClient = new QueryClient();

// Базовый путь для GitHub Pages (совпадает с `base` в vite.config.ts)
const basename = import.meta.env.BASE_URL;

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* BrowserRouter используется здесь — единственная точка маршрутизации */}
      <BrowserRouter basename={basename}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster position="bottom-right" />
      </BrowserRouter>
    </QueryClientProvider>
  );
}
