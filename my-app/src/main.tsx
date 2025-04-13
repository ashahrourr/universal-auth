// src/main.tsx
import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import { UniversalAuthProvider } from "../../sdk"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <UniversalAuthProvider>
      <App />
    </UniversalAuthProvider>
  </React.StrictMode>
)
