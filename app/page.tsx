import Link from "next/link";

const quickLinks = [
  {
    href: "/sign-in",
    title: "Sign in",
    description: "Return to your care circle and pick up where you left off.",
  },
  {
    href: "/sign-up",
    title: "Create account",
    description: "Set up your profile and start building your support network.",
  },
];

export default function Home() {
  return (
    <main className="relative flex min-h-screen items-center overflow-hidden px-6 py-10 text-foreground sm:px-8 lg:px-16">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(24,173,181,0.2),transparent_22%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.16),transparent_26%)]" />
      <div className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="flex flex-col justify-between rounded-4xl border border-white/12 bg-[#212831]/92 p-8 text-white shadow-[0_32px_80px_rgba(33,40,49,0.34)] sm:p-10">
          <div className="space-y-6">
            <div className="inline-flex w-fit items-center rounded-full border border-accent/30 bg-accent/12 px-4 py-2 text-sm font-medium tracking-[0.2em] text-accent uppercase">
              Saathi
            </div>
            <div className="space-y-4">
              <p className="max-w-sm text-sm leading-7 text-white/70 sm:text-base">
                A calm, supportive space designed for care, connection, and
                everyday coordination.
              </p>
              <h1 className="max-w-xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                Thoughtful access screens that feel warm before the first click.
              </h1>
            </div>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {quickLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group rounded-3xl border border-white/10 bg-white/6 p-5 backdrop-blur-sm hover:-translate-y-1 hover:border-accent/50 hover:bg-white/10"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">{item.title}</h2>
                  <span className="text-xl text-accent group-hover:translate-x-1">
                    →
                  </span>
                </div>
                <p className="mt-3 text-sm leading-6 text-white/68">
                  {item.description}
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section className="rounded-4xl border border-black/6 bg-background/92 p-8 shadow-[0_28px_70px_rgba(33,40,49,0.16)] backdrop-blur-sm sm:p-10">
          <div className="space-y-5">
            <p className="text-sm font-semibold tracking-[0.22em] text-surface/70 uppercase">
              Design direction
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-surface sm:text-4xl">
              Built from your palette:
              <span className="mt-2 block text-accent">deep, steady, and clear.</span>
            </h2>
            <p className="max-w-lg text-base leading-7 text-surface/72">
              The auth experience uses dark foundations, a calm teal accent, and
              soft light surfaces to make the first interaction feel trustworthy
              rather than clinical.
            </p>
          </div>

          <div className="mt-10 grid gap-4">
            <div className="grid grid-cols-[96px_1fr] overflow-hidden rounded-[1.4rem] border border-black/6">
              <div className="bg-[#212831]" />
              <div className="bg-white px-5 py-4">
                <p className="text-sm font-medium text-surface">Primary depth</p>
                <p className="text-sm text-surface/60">#212831</p>
              </div>
            </div>
            <div className="grid grid-cols-[96px_1fr] overflow-hidden rounded-[1.4rem] border border-black/6">
              <div className="bg-[#3f4651]" />
              <div className="bg-white px-5 py-4">
                <p className="text-sm font-medium text-surface">Secondary slate</p>
                <p className="text-sm text-surface/60">#3F4651</p>
              </div>
            </div>
            <div className="grid grid-cols-[96px_1fr] overflow-hidden rounded-[1.4rem] border border-black/6">
              <div className="bg-[#18adb5]" />
              <div className="bg-white px-5 py-4">
                <p className="text-sm font-medium text-surface">Accent teal</p>
                <p className="text-sm text-surface/60">#18ADB5</p>
              </div>
            </div>
            <div className="grid grid-cols-[96px_1fr] overflow-hidden rounded-[1.4rem] border border-black/6">
              <div className="bg-[#f3f2f2]" />
              <div className="bg-white px-5 py-4">
                <p className="text-sm font-medium text-surface">Soft canvas</p>
                <p className="text-sm text-surface/60">#F3F2F2</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
