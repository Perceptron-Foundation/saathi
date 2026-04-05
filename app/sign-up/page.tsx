"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import {
  AuthFormShell,
  AuthInput,
  AuthMessage,
} from "@/components/auth/auth-form-shell"
import { signUp } from "@/utils/auth"

type SubmitEvent = Parameters<NonNullable<React.ComponentProps<"form">["onSubmit"]>>[0]

export default function SignUp() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [emailSent, setEmailSent] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSignup = async (event: SubmitEvent) => {
    event.preventDefault()
    setErrorMessage("")

    if (!password) {
      setErrorMessage("Password is required.")
      return
    }
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.")
      return
    }

    setIsSubmitting(true)
    const result = await signUp(email, password, name)
    setIsSubmitting(false)

    if (result.status === "EXISTING_USER") {
      router.replace("/sign-in")
      return
    }
    if (result.status === "ERROR") {
      setErrorMessage(result.message ?? "Something went wrong. Please try again.")
      return
    }
    setEmailSent(true)
  }

  if (emailSent) {
    return (
      <AuthFormShell
        title="Check your inbox"
        description="Almost there."
        submitLabel="Done"
        onSubmit={(event) => event.preventDefault()}
      >
        <AuthMessage tone="success">
          We sent a verification link to <strong>{email}</strong>.
          Click it to activate your account and you will be signed in automatically.
        </AuthMessage>
      </AuthFormShell>
    )
  }

  return (
    <AuthFormShell
      title="Create your account"
      description="Join Saathi."
      submitLabel="Sign up"
      isSubmitting={isSubmitting}
      onSubmit={handleSignup}
      footer={
        <>
          Already have an account?{" "}
          <Link className="font-semibold text-accent hover:text-accent/80" href="/sign-in">
            Sign in
          </Link>
        </>
      }
    >
      <AuthInput
        label="Full name"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        autoComplete="name"
        required
      />
      <AuthInput
        label="Email"
        placeholder="you@example.com"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="email"
        required
      />
      <AuthInput
        label="Password"
        placeholder="Create a password"
        type="password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value)
          if (!e.target.value) setConfirmPassword("")
        }}
        autoComplete="new-password"
        required
      />
      <AuthInput
        label="Confirm password"
        placeholder="Re-enter your password"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        autoComplete="new-password"
        disabled={!password}
        required
      />
      {errorMessage && <AuthMessage tone="error">{errorMessage}</AuthMessage>}
    </AuthFormShell>
  )
}