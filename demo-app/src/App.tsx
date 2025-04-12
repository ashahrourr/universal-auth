import { useUniversalLogin } from "../../sdk/src/useUniversalLogin"

function App() {
  const { user, login, logout, loading } = useUniversalLogin()

  if (loading) return <p>Loading...</p>

  return (
    <div style={{ padding: 40 }}>
      {user ? (
        <>
          <h2>Welcome, {user.id} 🎉</h2>
          <p>Your token:</p>
          <code>{user.token}</code>
          <br />
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <>
          <h2>You are not logged in</h2>
          <button onClick={login}>Login with Universal ID</button>
        </>
      )}
    </div>
  )
}

export default App
