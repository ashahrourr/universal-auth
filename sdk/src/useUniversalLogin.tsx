import { useState, useEffect } from "react"
import { getAuthConfig } from "./config"
import { AuthError } from "./errors"

export interface User {
  id: string;
  token: string;
}

interface DecodedToken {
  exp: number
  sub: string
}

let refreshTimeout: ReturnType<typeof setTimeout> | null = null

export function useUniversalLogin() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const decodeToken = (token: string): DecodedToken => {
    const payload = JSON.parse(atob(token.split(".")[1]))
    return { exp: Number(payload.exp), sub: payload.sub }
  }

  const validateToken = (token: string): boolean => {
    try {
      const { exp } = decodeToken(token)
      return Date.now() < exp * 1000
    } catch {
      return false
    }
  }

  const scheduleTokenRefresh = (exp: number) => {
    if (refreshTimeout) clearTimeout(refreshTimeout)

    const delay = exp * 1000 - Date.now() - 60_000 // 1 min before expiry
    if (delay <= 0) return refreshToken()

    refreshTimeout = setTimeout(() => {
      refreshToken()
    }, delay)
  }

  const refreshToken = async () => {
    const { apiUrl, refreshTokenStorage, tokenStorage } = getAuthConfig()

    const refresh_token = refreshTokenStorage?.getItem("uauth-refresh")
    if (!refresh_token) return logout()

    const currentToken = tokenStorage?.getItem("uauth-token")
    if (currentToken && validateToken(currentToken)) return

    try {
      const res = await fetch(`${apiUrl}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token }),
      })

      if (!res.ok) throw new Error(AuthError.InvalidToken)

      const data = await res.json()
      const newToken = data.access_token
      const { sub, exp } = decodeToken(newToken)

      tokenStorage?.setItem("uauth-token", newToken)
      setUser({ id: sub, token: newToken })
      scheduleTokenRefresh(exp)
    } catch {
      logout()
    }
  }

  useEffect(() => {
    const { tokenStorage, refreshTokenStorage } = getAuthConfig()

    const token = tokenStorage?.getItem("uauth-token")
    const id = tokenStorage?.getItem("uauth-id")
    const refresh = refreshTokenStorage?.getItem("uauth-refresh")

    if (token && id) {
      const { exp } = decodeToken(token)
      const currentTime = Math.floor(Date.now() / 1000)
      const isExpired = currentTime > exp

      if (isExpired && refresh) {
        refreshToken()
      } else {
        setUser({ id, token })
        scheduleTokenRefresh(exp)
      }
    }

    setLoading(false)
  }, [])

  const handleLogin = async (email: string) => {
    const { apiUrl, tokenStorage, refreshTokenStorage } = getAuthConfig()

    try {
      let deviceId = tokenStorage?.getItem("uauth-device-id")
      if (!deviceId) {
        deviceId = crypto.randomUUID()
        tokenStorage?.setItem("uauth-device-id", deviceId)
      }

      const res = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ device_id: deviceId }),
      })

      if (!res.ok) throw new Error(AuthError.LoginFailed)

      const data = await res.json()
      const token = data.access_token
      const refresh_token = data.refresh_token
      const { sub, exp } = decodeToken(token)

      tokenStorage?.setItem("uauth-token", token)
      refreshTokenStorage?.setItem("uauth-refresh", refresh_token)
      tokenStorage?.setItem("uauth-id", sub)

      if (email) {
        await fetch(`${apiUrl}/auth/email`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: sub, email }),
        })
      }

      setUser({ id: sub, token })
      scheduleTokenRefresh(exp)
    } catch (error: any) {
      if (error instanceof TypeError) {
        throw new Error(AuthError.NetworkError)
      }
      throw new Error(error.message || AuthError.UnknownError)
    }
  }

  const logout = () => {
    const { tokenStorage, refreshTokenStorage } = getAuthConfig()
    tokenStorage?.removeItem("uauth-token")
    tokenStorage?.removeItem("uauth-id")
    refreshTokenStorage?.removeItem("uauth-refresh")
    if (refreshTimeout) clearTimeout(refreshTimeout)
    setUser(null)
  }

  return {
    user,
    handleLogin,
    logout,
    loading,
  }
}
