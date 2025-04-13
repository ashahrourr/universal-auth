// src/main.tsx
import React from "react"
import ReactDOM from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import App from "./App"
import { LoginPage, UniversalAuthProvider } from "../../sdk/src"

const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/login", element: <LoginPage /> },
])

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <UniversalAuthProvider>
      <RouterProvider router={router} />
    </UniversalAuthProvider>
  </React.StrictMode>
)
