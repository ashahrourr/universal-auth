// sdk/src/components/LoginComponentProps.ts

import { ReactNode } from "react"

export interface LoginComponentProps {
  logo?: ReactNode
  primaryColor?: string
  translations?: {
    welcomeMessage?: string
    emailLabel?: string
    loginButton?: string
    emailOptionalHint?: string
    errorInvalidEmail?: string
    errorLoginFailed?: string
  }
}
