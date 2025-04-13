# ✨ Universal Auth

One-click login SDK for modern web apps.  
No passwords. No redirects. No config.

---

## 🚀 Features

- 🔓 1-click login — no passwords or forms  
- ⚡ Super fast integration — plug & play  
- 🎨 Customizable UI (logo, color, text)  
- 🔁 Automatic token refresh  
- 📦 Fully self-contained — no backend setup needed  

---

## 📦 Installation

```bash
npm install @ashahrour/universal-auth
```

---

## ⚙️ Quick Start

### 1. Wrap your app with the provider

```tsx
import { UniversalAuthProvider } from "@ashahrour/universal-auth"

<UniversalAuthProvider>
  <App />
</UniversalAuthProvider>
```

---

### 2. Use the hook and `<LoginPage />` component

```tsx
import { useAuth, LoginPage } from "@ashahrour/universal-auth"

function App() {
  const { user, login, logout, loading } = useAuth()

  if (loading) return <p>Loading...</p>

  return user ? (
    <>
      <p>Welcome: {user.id}</p>
      <button onClick={logout}>Logout</button>
    </>
  ) : (
    <LoginPage
      onSubmit={login}
      primaryColor="#2563eb"
      translations={{
        welcomeMessage: "Welcome to My App",
        loginButton: "Sign In Securely",
        emailLabel: "Recovery Email",
        emailOptionalHint: "(optional)",
        loggingIn: "Logging in...",
        errorInvalidEmail: "Invalid email",
        errorLoginFailed: "Login failed",
      }}
    />
  )
}
```

---

## 🎨 Customization

```tsx
<LoginPage
  logo={<img src="/logo.svg" width={40} />}
  primaryColor="#10b981"
  translations={{
    welcomeMessage: "Hello 👋",
    loginButton: "Login",
    loggingIn: "Logging in...",
    emailLabel: "Email",
    emailOptionalHint: "(optional)",
    errorInvalidEmail: "Please enter a valid email",
    errorLoginFailed: "Login failed. Try again.",
  }}
/>
```

---

## 🛡️ Security Notes

- ✅ Uses `localStorage` to store JWT and refresh tokens  
- 🔁 Automatically refreshes access tokens before expiration  
- 🔐 Email is optional and used for account recovery  

---

## 💡 Why Universal Auth?

Firebase, Clerk, and Auth0 are great — but not always simple.  
Universal Auth is for when you want:

✅ 1-click login  
✅ Zero config  
✅ Lightweight integration with beautiful defaults  

Perfect for MVPs, internal tools, dashboards, and indie SaaS products.

---

## 🧪 Coming Soon

- ✉️ Magic link fallback  
- 🔐 Secure storage support  
- 📱 React Native compatibility  
- 📊 Analytics hooks (opt-in)  
- 📄 Full documentation site  

---

## 📣 Try It

Just install. Wrap your app.  
You're done ✅  
No passwords. No redirects. Just ✨ one-click login ✨