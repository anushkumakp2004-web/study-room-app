import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
  <Toaster
    position="top-right"
    toastOptions={{
      duration: 2000,
      style: {
        background: "#333",
        color: "#fff",
        borderRadius: "10px",
      },
    }}
  />

  <App />
</React.StrictMode>
);