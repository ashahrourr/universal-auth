// sdk/src/config.ts

export interface AuthConfig {
    apiUrl?: string
    tokenStorage?: Storage
    refreshTokenStorage?: Storage
  }
  
  let config: AuthConfig = {
    apiUrl: "https://universal-auth.onrender.com",
    tokenStorage: typeof window !== "undefined" ? localStorage : undefined,
    refreshTokenStorage: typeof window !== "undefined" ? localStorage : undefined,
  }
  
  export const configureAuth = (newConfig: AuthConfig) => {
    config = { ...config, ...newConfig }
  }
  
  export const getAuthConfig = () => config
  