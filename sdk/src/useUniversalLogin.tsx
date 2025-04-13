// useUniversalLogin.tsx
import { useState, useEffect } from "react";

const API_URL = "https://universal-auth.onrender.com";

interface User {
  id: string;
  token: string;
}

interface DecodedToken {
  exp: number;
  sub: string;
}

export function useUniversalLogin() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const decodeToken = (token: string): DecodedToken => {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return { exp: Number(payload.exp), sub: payload.sub };
  };

  const refreshToken = async () => {
    const refresh_token = localStorage.getItem("uauth-refresh");
    if (!refresh_token) return logout();

    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token }),
    });

    if (!res.ok) return logout();

    const data = await res.json();
    const newToken = data.access_token;
    const { sub } = decodeToken(newToken);

    localStorage.setItem("uauth-token", newToken);
    setUser({ id: sub, token: newToken });
  };

  useEffect(() => {
    const token = localStorage.getItem("uauth-token");
    const id = localStorage.getItem("uauth-id");
    const refresh = localStorage.getItem("uauth-refresh");

    if (token && id) {
      const { exp } = decodeToken(token);
      const currentTime = Math.floor(Date.now() / 1000);
      const isExpired = currentTime > exp;

      if (isExpired && refresh) {
        refreshToken();
      } else {
        setUser({ id, token });
      }
    }

    setLoading(false);
  }, []);

  const handleLogin = async (email: string) => {
    let deviceId = localStorage.getItem("uauth-device-id");
    if (!deviceId) {
      deviceId = crypto.randomUUID();
      localStorage.setItem("uauth-device-id", deviceId);
    }

    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ device_id: deviceId }),
    });

    const data = await res.json();
    const token = data.access_token;
    const refresh_token = data.refresh_token;
    const { sub } = decodeToken(token);

    localStorage.setItem("uauth-token", token);
    localStorage.setItem("uauth-refresh", refresh_token);
    localStorage.setItem("uauth-id", sub);

    if (email) {
      await fetch(`${API_URL}/auth/email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: sub, email }),
      });
    }

    setUser({ id: sub, token });
  };

  const logout = () => {
    localStorage.removeItem("uauth-token");
    localStorage.removeItem("uauth-refresh");
    localStorage.removeItem("uauth-id");
    setUser(null);
  };

  return {
    user,
    handleLogin,
    logout,
    loading
  };
}
