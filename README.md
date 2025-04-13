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
npm install @yourname/universal-auth
```

---

## ⚙️ Quick Start

### 1. Wrap your app

```tsx
import { UniversalAuthProvider } from "@yourname/universal-auth"

<UniversalAuthProvider>
  <App />
</UniversalAuthProvider>
```

---

### 2. Add the login page route

```tsx
import { LoginPage } from "@yourname/universal-auth"

<Route path="/login" element={<LoginPage />} />
```

---

### 3. Use the hook

```tsx
import { useAuth } from "@yourname/universal-auth"

const { user, login, logout, loading } = useAuth()

if (loading) return <p>Loading...</p>

return user ? (
  <>
    <p>Logged in as: {user.id}</p>
    <button onClick={logout}>Logout</button>
  </>
) : (
    <button onClick={login}>Login</button>
)
```

---

## 🎨 Customization

```tsx
<LoginPage
  logo={<img src="/logo.svg" width={40} />}
  primaryColor="#10b981"
  translations={{
    welcomeMessage: "Welcome to MyApp",
    emailLabel: "Recovery Email",
    loginButton: "Continue",
    loggingIn: "Logging in..."
  }}
/>
```

---

## 🛡️ Security Notes

- ✅ Uses `localStorage` to store JWT tokens  
- ✅ Refresh tokens handled automatically  
- 🔐 For production, use HTTPS and implement CSRF protection  
- 🔐 Email is optional, used for recovery only

---

## 💡 Why Universal Auth?

Firebase, Clerk, and Auth0 are great — but not always simple.  
Universal Auth is for when you want:

✅ 1-click login  
✅ No config or setup  
✅ Fast integration with beautiful defaults  

Perfect for MVPs, dashboards, internal tools, and indie projects.

---

## 🧪 Coming Soon

- ✉️ Magic link fallback  
- 🔐 Secure storage support  
- 📱 React Native compatibility  
- 📊 Analytics hooks (opt-in)  
- 📄 Full documentation site

---

## 📣 Try It

Just install. Add one provider. You’re done ✅  
No passwords. No redirects. Just ✨ one-click login ✨
