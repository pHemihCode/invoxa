"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"
import { Zap, ArrowRight, Loader2, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
type Step = "idle" | "loading" | "sent"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [step, setStep] = useState<Step>("idle")
  const [oauthLoading, setOauthLoading] = useState(false)
  const [error, setError] = useState("")
  const supabase = createClient()
  const router = useRouter()
  const handleMagicLink = async () => {
    if (!email) return setError("Please enter your email address.")
    setError("")
    setStep("loading")

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
        data: { full_name: name },
      },
    })

    if (error) {
      setError(error.message)
      setStep("idle")
    } else {
      setStep("sent")
    }
  }

  const handleGoogle = async () => {
    setOauthLoading(true)
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${location.origin}/auth/callback` },
    })
    setOauthLoading(false)
  }

  useEffect(() => {
  const checkSession = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (session) router.replace("/dashboard")
  }
  checkSession()
}, [])

  return (
    <div className="relative min-h-screen bg-stone-950 flex items-center justify-center px-4 overflow-hidden">

      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="orb-glow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #d6d3d1 0%, transparent 70%)" }} />
        <div className="orb-a absolute top-[15%] left-[10%] w-72 h-72 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #a8a29e, transparent 70%)" }} />
        <div className="orb-b absolute bottom-[10%] right-[8%] w-96 h-96 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #78716c, transparent 70%)" }} />
        <div className="orb-c absolute top-[55%] right-[20%] w-48 h-48 rounded-full opacity-[0.08]"
          style={{ background: "radial-gradient(circle, #d6d3d1, transparent 70%)" }} />
        <div className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }} />
      </div>

      {/* Card */}
      <div className="card-enter relative z-10 w-full max-w-md">

        {/* Logo */}
        <div className="flex flex-col items-center mb-5">
          <div className="flex flex-row items-center gap-3 pb-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-white shadow-xl">
            <Zap className="w-6 h-6 text-stone-900" strokeWidth={2.5} />
          </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
            Invoxa
          </h1>
          </div>
          <p className="mt-1.5 text-sm text-stone-400 text-center max-w-xs leading-relaxed">
            Professional invoices & payment pages for freelancers
          </p>
        </div>

        {/* Glass card */}
        <div className="bg-white/[0.06] backdrop-blur-sm border border-white/10 rounded-3xl p-8 shadow-2xl">

          {step === "sent" ? (
            <div className="text-center py-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-emerald-400" />
              </div>
              <h2 className="text-lg font-semibold text-white mb-2">Check your inbox</h2>
              <p className="text-sm text-stone-400 leading-relaxed">
                We sent a magic link to{" "}
                <span className="text-white font-medium">{email}</span>.
                Click it to sign in instantly.
              </p>
              <button
                onClick={() => setStep("idle")}
                className="mt-5 text-xs text-stone-500 hover:text-stone-300 transition-colors underline underline-offset-2"
              >
                Use a different email
              </button>
            </div>
          ) : (
            <>
              {/* Google OAuth */}
              <Button
                onClick={handleGoogle}
                disabled={oauthLoading}
                variant="outline"
                className="w-full h-11 rounded-xl bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white gap-2.5 font-medium text-sm mb-6 transition-all"
              >
                {oauthLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                )}
                Continue with Google
              </Button>

              {/* Divider */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-xs text-stone-500 font-medium">or use email</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              {/* Form */}
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-stone-400 mb-1.5 block">
                    Your name
                  </label>
                  <Input
                    placeholder="Femi Akintan"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-11 rounded-xl bg-white/5 border-white/10 text-white placeholder:text-stone-600 focus-visible:ring-0 focus-visible:border-white/30 text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-stone-400 mb-1.5 block">
                    Email address <span className="text-red-400">*</span>
                  </label>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError("") }}
                    onKeyDown={(e) => e.key === "Enter" && handleMagicLink()}
                    className="h-11 rounded-xl bg-white/5 border-white/10 text-white placeholder:text-stone-600 focus-visible:ring-0 focus-visible:border-white/30 text-sm"
                  />
                </div>

                {error && <p className="text-xs text-red-400 pl-1">{error}</p>}

                <Button
                  onClick={handleMagicLink}
                  disabled={step === "loading"}
                  className="w-full h-11 bg-white text-stone-900 hover:bg-stone-100 rounded-xl font-semibold text-sm gap-2 mt-1"
                >
                  {step === "loading" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>Send magic link <ArrowRight className="w-4 h-4" /></>
                  )}
                </Button>
              </div>
            </>
          )}
        </div>

        {/* Feature pills */}
        <div className="flex items-center justify-center gap-2 mt-5 flex-wrap">
          {["✦ Free to start", "✦ Paystack payments", "✦ Instant links"].map((f) => (
            <span key={f} className="text-[11px] text-stone-600 font-medium px-3 py-1 rounded-full border border-white/5 bg-white/[0.03]">
              {f}
            </span>
          ))}
        </div>

        <p className="text-center text-xs text-stone-600 mt-4">
          By signing in you agree to our{" "}
          <span className="text-stone-500 hover:text-stone-300 cursor-pointer transition-colors">Terms</span>
          {" "}&{" "}
          <span className="text-stone-500 hover:text-stone-300 cursor-pointer transition-colors">Privacy Policy</span>
        </p>
      </div>

      <style jsx global>{`
        .orb-glow { animation: pulse-glow 6s ease-in-out infinite; }
        .orb-a { animation: float-a 9s ease-in-out infinite; }
        .orb-b { animation: float-b 12s ease-in-out infinite; }
        .orb-c { animation: float-c 7s ease-in-out infinite; }
        .card-enter { animation: fade-up 0.5s ease both; }

        @keyframes pulse-glow {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.2; }
          50% { transform: translate(-50%, -50%) scale(1.15); opacity: 0.28; }
        }
        @keyframes float-a {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(24px, -32px); }
        }
        @keyframes float-b {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-28px, 20px); }
        }
        @keyframes float-c {
          0%, 100% { transform: translate(0, 0); }
          40% { transform: translate(16px, -16px); }
        }
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}