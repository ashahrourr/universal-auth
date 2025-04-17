// sdk/src/hooks/useAuth.ts
import { useAuthContext } from "../provider/UniversalAuthProvider"


export const useAuth = () => {
  const { user, loading, handleLogin, logout } = useAuthContext()
  return { user, loading, login: handleLogin, logout }
}
 // testing what the diff