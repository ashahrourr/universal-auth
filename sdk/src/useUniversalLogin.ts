import { useState, useEffect } from "react"

const API_URL = "http://localhost:8000"

export function useUniversalLogin() {
  const [user, setUser] = useState<{ id: string; token: string } | null>(null)
  const [loading, setLoading] = useState(true)

  // Decode token and get expiry timestamp
  const decodeToken = (token: string): { exp: number; sub: string } => {
    const payload = JSON.parse(atob(token.split(".")[1]))
    return { exp: payload.exp, sub: payload.sub }
  }

  const refreshToken = async () => {
    const refresh_token = localStorage.getItem("uauth-refresh")
    if (!refresh_token) return logout()

    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token }),
    })

    if (!res.ok) return logout()

    const data = await res.json()
    const newToken = data.access_token
    const { sub } = decodeToken(newToken)

    localStorage.setItem("uauth-token", newToken)
    setUser({ id: sub, token: newToken })
  }

  useEffect(() => {
    const token = localStorage.getItem("uauth-token")
    const id = localStorage.getItem("uauth-id")
    const refresh = localStorage.getItem("uauth-refresh")

    if (token && id) {
      const { exp } = decodeToken(token)
      const isExpired = Date.now() / 1000 > exp

      if (isExpired && refresh) {
        refreshToken()
      } else {
        setUser({ id, token })
      }
    }

    setLoading(false)
  }, [])

  
  const login = async () => {
    // 📱 Generate or reuse device ID
    let deviceId = localStorage.getItem("uauth-device-id")
    if (!deviceId) {
      deviceId = crypto.randomUUID()
      localStorage.setItem("uauth-device-id", deviceId)
    }
  
    // 🔐 Request tokens from backend
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ device_id: deviceId }),
    })
  
    const data = await res.json()
    const token = data.access_token
    const refresh_token = data.refresh_token
  
    const { sub } = decodeToken(token)
  
    // 🧠 Store tokens + user ID
    localStorage.setItem("uauth-token", token)
    localStorage.setItem("uauth-refresh", refresh_token)
    localStorage.setItem("uauth-id", sub)
  
    setUser({ id: sub, token })
  
    // 📧 Optional: ask for contact email
    const email = prompt("Enter your contact email (optional):")
    if (email) {
      await fetch(`${API_URL}/auth/email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: sub, email }),
      })
    }
  }   

  const logout = () => {
    localStorage.clear()
    setUser(null)
  }

  return { user, login, logout, loading }
}
