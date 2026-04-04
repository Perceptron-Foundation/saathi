"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import {
  AuthFormShell,
  AuthInput,
  AuthMessage,
} from "@/components/auth/auth-form-shell"

import { signUp } from "@/utils/auth"

type SubmitEvent = Parameters<
  NonNullable<React.ComponentProps<"form">["onSubmit"]>
>[0]

export default function SignUp() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const redirectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current)
      }
    }
  }, [])

  const handleSignup = async (event: SubmitEvent) => {
    event.preventDefault()
    if (redirectTimeoutRef.current) {
      clearTimeout(redirectTimeoutRef.current)
      redirectTimeoutRef.current = null
    }
    setErrorMessage("")
    setSuccessMessage("")

    if (!password) {
      setErrorMessage("Password is required.")
      return
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.")
      return
    }

    setIsSubmitting(true)

    const { data, error } = await signUp(email, password, name);

    const isExistingUserResponse =
      error?.code === "user_already_exists" ||
      error?.code === "email_exists" ||
      error?.code === "conflict" ||
      /already registered|already exists/i.test(error?.message ?? "") ||
      (!!data.user && (data.user.identities?.length ?? 0) === 0)

    if (isExistingUserResponse) {
      setErrorMessage("Account already exists. Please sign in. Redirecting you now.")
      redirectTimeoutRef.current = setTimeout(() => {
        router.replace("/sign-in")
      }, 2000)
    } else if (error) {
      setErrorMessage(error.message)
    } else {
      setSuccessMessage("Account created successfully.")
      console.log("User created", data)
    }

    setIsSubmitting(false)
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
          const nextPassword = e.target.value
          setPassword(nextPassword)

          if (!nextPassword) {
            setConfirmPassword("")
          }
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
      {errorMessage ? <AuthMessage tone="error">{errorMessage}</AuthMessage> : null}
      {successMessage ? (
        <AuthMessage tone="success">{successMessage}</AuthMessage>
      ) : null}
    </AuthFormShell>
  )
}
