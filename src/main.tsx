import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import SupabaseSetup from "./pages/SupabaseSetup";
import { hasSupabaseConfig } from "./integrations/supabase/client";

createRoot(document.getElementById("root")!).render(
  hasSupabaseConfig ? <App /> : <SupabaseSetup />
);
