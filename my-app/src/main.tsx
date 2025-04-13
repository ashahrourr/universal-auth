import React from "react"
import ReactDOM from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import App from "./App"
import { LoginPage, UniversalAuthProvider, useAuth } from "../../sdk/src"

// Wrap LoginPage so we can pass handleLogin
const LoginScreen = () => {
  const { login } = useAuth()
  return <LoginPage onSubmit={login} />
}

const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/login", element: <LoginScreen /> }, // ✅ using wrapper
])

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <UniversalAuthProvider>
      <RouterProvider router={router} />
    </UniversalAuthProvider>
  </React.StrictMode>
)
