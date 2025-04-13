// src/App.tsx
import { Navigate } from "react-router-dom"
import { useAuth } from "../../sdk/src"

function App() {
  const { user, logout, loading } = useAuth()

  if (loading) return <p>Loading...</p>
  if (!user) return <Navigate to="/login" replace />

  return (
    <div style={{ padding: 40, textAlign: "center" }}>
      <h1>Universal Auth Demo</h1>
      <p>✅ Logged in as: <strong>{user.id}</strong></p>
      <button onClick={logout}>Logout</button>
    </div>
  )
}

export default App
