"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import {
  AuthFormShell,
  AuthInput,
  AuthMessage,
} from "@/components/auth/auth-form-shell"
import { signIn } from "@/utils/auth" 

type SubmitEvent = Parameters<
  NonNullable<React.ComponentProps<"form">["onSubmit"]>
>[0]

export default function SignIn() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleLogin = async (event: SubmitEvent) => {
  event.preventDefault();

  setErrorMessage("");
  setSuccessMessage("");
  setIsSubmitting(true);

  const res = await signIn(email, password);

  switch (res.status) {
    case "SUCCESS":
      setSuccessMessage("Logged in successfully.");
      router.push("/dashboard");
      break;

    case "INVALID_CREDENTIALS":
      setErrorMessage("Invalid email or password.");
      break;

    case "EMAIL_NOT_VERIFIED":
      setErrorMessage("Please verify your email first.");
      break;

    case "UNKNOWN_ERROR":
      setErrorMessage(res.message || "Something went wrong.");
      break;

    default:
      setErrorMessage("Unexpected error occurred.");
  }

    setIsSubmitting(false);
  };

  return (
    <AuthFormShell
      title="Welcome back"
      description="Access your Saathi dashboard."
      submitLabel="Sign in"
      isSubmitting={isSubmitting}
      onSubmit={handleLogin}
      footer={
        <>
          New here?{" "}
          <Link className="font-semibold text-accent hover:text-accent/80" href="/sign-up">
            Create an account
          </Link>
        </>
      }
    >
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
        placeholder="Enter your password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="current-password"
        required
      />
      {errorMessage ? <AuthMessage tone="error">{errorMessage}</AuthMessage> : null}
      {successMessage ? (
        <AuthMessage tone="success">{successMessage}</AuthMessage>
      ) : null}
    </AuthFormShell>
  )
}
