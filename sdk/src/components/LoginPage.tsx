import React, { useState } from "react"
import { LoginComponentProps } from "./LoginComponentProps"

const LoginPage: React.FC<
  { onSubmit?: (email: string) => Promise<void> } & LoginComponentProps
> = ({
  onSubmit,
  logo,
  primaryColor = "#2563eb",
  translations = {},
}) => {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email)
  }

  const handleSubmit = async () => {
    if (email && !validateEmail(email)) {
      setError(translations.errorInvalidEmail ?? "Please enter a valid email address")
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      await onSubmit?.(email)
    } catch {
      setError(translations.errorLoginFailed ?? "Login failed.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif", maxWidth: "600px", margin: "40px auto" }}>
      <div style={{
        backgroundColor: "white",
        borderRadius: "1rem",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        padding: "2rem",
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem"
      }}>
        {logo && <div style={{ marginBottom: "1rem", textAlign: "center" }}>{logo}</div>}

        <div style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: "1.75rem", fontWeight: 600 }}>
            {translations.welcomeMessage ?? "Welcome 👋"}
          </h2>
          <p style={{ color: "#6b7280", marginTop: "0.25rem" }}>
            {translations.loginButton ?? "Login with 1 click"}
          </p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          style={{
            width: "100%",
            background: `linear-gradient(to bottom right, ${primaryColor}, ${primaryColor})`,
            color: "white",
            padding: "0.75rem 1.5rem",
            borderRadius: "0.5rem",
            fontWeight: 500,
            fontSize: "1rem",
            border: "none",
            cursor: "pointer",
            opacity: isSubmitting ? 0.5 : 1,
            transition: "opacity 0.2s ease"
          }}
        >
          {isSubmitting
            ? translations.loggingIn ?? "Logging in..."
            : translations.loginButton ?? "Login with Universal ID"}
        </button>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "1rem" }}>
          <label style={{ fontSize: "0.875rem", color: "#374151" }}>
            {translations.emailLabel ?? "Email"}{" "}
            <span style={{ color: "#9ca3af", marginLeft: "0.25rem" }}>
              {translations.emailOptionalHint ?? "(optional for recovery)"}
            </span>
          </label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value.trim())}
            disabled={isSubmitting}
            style={{
              padding: "0.75rem",
              border: "1px solid #d1d5db",
              borderRadius: "0.5rem",
              fontSize: "0.875rem",
              backgroundColor: isSubmitting ? "#f3f4f6" : "white"
            }}
          />
          {error && <p style={{ color: "#ef4444", fontSize: "0.875rem" }}>{error}</p>}
        </div>
      </div>
    </div>
  )
}

export default LoginPage
