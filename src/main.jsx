import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from "./context/ThemeContext";
import ConsentBanner from "./components/ConsentBanner";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <App />
        <ConsentBanner />
      </BrowserRouter>
      {/* Vercel's own (cookieless) traffic analytics. GA4 is separate and sits
          behind the ConsentBanner above. */}
      <Analytics />
    </ThemeProvider>
  </React.StrictMode>
);
