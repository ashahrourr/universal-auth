// src/App.tsx
import { useAuth } from "../../sdk/src/hooks/useAuth"

function App() {
  const { user, login, logout, loading } = useAuth()

  if (loading) return <p>Loading...</p>

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif", textAlign: "center" }}>
      {user ? (
        <>
          <h2>Welcome, {user.id} 🎉</h2>
          <p style={{ maxWidth: 400, margin: "1rem auto", wordBreak: "break-word" }}>{user.token}</p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <>
          <h2>You are not logged in</h2>
          <button onClick={() => login("")}>Login with Universal ID</button>
        </>
      )}
    </div>
  )
}

export default App
