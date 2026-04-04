"use client"

type AuthFormShellProps = {
  title: string
  description: string
  submitLabel: string
  footer?: React.ReactNode
  children: React.ReactNode
  isSubmitting?: boolean
  onSubmit: React.ComponentProps<"form">["onSubmit"]
}

export function AuthFormShell({
  title,
  description,
  submitLabel,
  footer,
  children,
  isSubmitting = false,
  onSubmit,
}: AuthFormShellProps) {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6">
      <div className="w-full max-w-md rounded-4xl border border-white/15 bg-surface/88 p-6 text-background shadow-[0_24px_80px_rgba(var(--shadow),0.28)] backdrop-blur sm:p-8">
        <div className="mb-8 space-y-3">
          <span className="inline-flex rounded-full border border-accent/30 bg-accent/12 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-accent">
            Saathi
          </span>
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight text-background">
              {title}
            </h1>
            <p className="text-sm leading-6 text-muted">
              {description}
            </p>
          </div>
        </div>

        <form className="space-y-5" onSubmit={onSubmit}>
          <div className="space-y-4">{children}</div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex w-full items-center justify-center rounded-2xl bg-accent px-4 py-3 text-sm font-semibold text-surface shadow-[0_18px_40px_rgb(24_173_181/0.28)] hover:-translate-y-0.5 hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
          >
            {isSubmitting ? `${submitLabel}...` : submitLabel}
          </button>
        </form>

        {footer ? (
          <div className="mt-6 text-center text-sm text-muted">{footer}</div>
        ) : null}
      </div>
    </main>
  )
}

type AuthInputProps = React.ComponentProps<"input"> & {
  label: string
}

export function AuthInput({ label, className, ...props }: AuthInputProps) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-background">{label}</span>
      <input
        className={[
          "w-full rounded-2xl border border-white/12 bg-background/8 px-4 py-3 text-sm text-background outline-none",
          "placeholder:text-muted/80 focus:border-accent focus:bg-background/12 focus:ring-2 focus:ring-accent/25",
          "disabled:cursor-not-allowed disabled:border-white/8 disabled:bg-background/5 disabled:text-muted/75",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      />
    </label>
  )
}

type AuthMessageProps = {
  tone: "error" | "success"
  children: React.ReactNode
}

export function AuthMessage({ tone, children }: AuthMessageProps) {
  const toneClassName =
    tone === "error"
      ? "border-red-300/35 bg-red-500/10 text-red-100"
      : "border-accent/35 bg-accent/12 text-background"

  return (
    <p
      className={`rounded-2xl border px-4 py-3 text-sm leading-6 ${toneClassName}`}
    >
      {children}
    </p>
  )
}
