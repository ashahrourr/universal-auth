// sdk/src/provider/UniversalAuthProvider.tsx
import React, { createContext, useContext } from "react"
import { useUniversalLogin } from "../useUniversalLogin"


const AuthContext = createContext<ReturnType<typeof useUniversalLogin> | null>(null)

export const UniversalAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useUniversalLogin()

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuthContext must be used within UniversalAuthProvider")
  return ctx
}
