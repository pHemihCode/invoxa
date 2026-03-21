"use client"

import { useState } from "react"
import {
  Github,
  Linkedin,
  Globe,
  ExternalLink,
  Zap,
  Calendar,
  CheckCircle,
  Loader2,
  ShieldCheck,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Profile {
  name?: string | null
  photo_url?: string | null
  bio?: string | null
  github?: string | null
  behance?: string | null
  linkedin?: string | null
  portfolio?: string | null
}

interface Invoice {
  id: string
  client_name: string
  amount: number
  currency: string
  description: string
  due_date: string
  status: string
  payment_link: string | null
  note?: string | null
  profiles: Profile | null
}

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: currency ?? "NGN",
    maximumFractionDigits: 0,
  }).format(amount)
}

function getInitials(name?: string | null) {
  if (!name) return "?"
  return name
    .trim()
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

export function PaymentPageClient({ invoice }: { invoice: Invoice }) {
  const [paying, setPaying] = useState(false)
  const profile = invoice.profiles
  const isPaid = invoice.status === "paid"
  const hasLinks =
    profile?.github || profile?.behance || profile?.linkedin || profile?.portfolio

  const handlePay = () => {
    if (!invoice.payment_link) return
    setPaying(true)
    window.location.href = invoice.payment_link
  }

  return (
    <div className="min-h-screen bg-[#F7F6F3] flex flex-col">

      {/* ── Top bar ── */}
      <div className="bg-white border-b border-stone-200">
        <div className="w-full max-w-xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-stone-900 flex items-center justify-center shrink-0">
              <Zap className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-sm font-semibold text-stone-900">Invoxa</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-stone-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            Secured by Paystack
          </div>
        </div>
      </div>

      {/* ── Page body ── */}
      <div
        className="flex-1 w-full max-w-xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 pb-28 sm:pb-32 space-y-3 sm:space-y-4"
        style={{ animation: "fade-up 0.4s ease both" }}
      >
        {/* Paid banner */}
        {isPaid && (
          <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-2xl px-4 sm:px-5 py-3 sm:py-3.5">
            <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500 shrink-0" />
            <div>
              <p className="text-sm sm:text-base font-semibold text-emerald-800">
                Payment Received
              </p>
              <p className="text-xs sm:text-sm text-emerald-600 mt-0.5">
                This invoice has been paid. Thank you!
              </p>
            </div>
          </div>
        )}

        {/* ── Freelancer card ── */}
        <div className="bg-stone-900 rounded-2xl p-5 sm:p-6 text-white relative overflow-hidden">
          {/* Subtle dot pattern */}
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 50%, #fff 1px, transparent 1px), radial-gradient(circle at 80% 20%, #fff 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />
          <div className="relative">
            <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
              <Avatar className="w-12 h-12 sm:w-14 sm:h-14 border-2 border-stone-700 shrink-0">
                <AvatarImage src={profile?.photo_url ?? undefined} />
                <AvatarFallback className="bg-stone-700 text-white text-sm sm:text-base font-semibold">
                  {getInitials(profile?.name)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="text-sm sm:text-base font-semibold truncate">
                  {profile?.name ?? "Freelancer"}
                </p>
                {profile?.bio && (
                  <p className="text-xs sm:text-sm text-stone-400 mt-0.5 line-clamp-2 leading-relaxed">
                    {profile.bio}
                  </p>
                )}
              </div>
            </div>

            {hasLinks && (
              <div className="flex items-center gap-3 sm:gap-4 flex-wrap pt-3 sm:pt-4 border-t border-stone-800">
                {profile?.github && (
                  <a
                    href={profile.github}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-[11px] sm:text-xs text-stone-400 hover:text-white transition-colors"
                  >
                    <Github className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                    GitHub
                  </a>
                )}
                {profile?.linkedin && (
                  <a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-[11px] sm:text-xs text-stone-400 hover:text-white transition-colors"
                  >
                    <Linkedin className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                    LinkedIn
                  </a>
                )}
                {profile?.behance && (
                  <a
                    href={profile.behance}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-[11px] sm:text-xs text-stone-400 hover:text-white transition-colors"
                  >
                    <Globe className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                    Behance
                  </a>
                )}
                {profile?.portfolio && (
                  <a
                    href={profile.portfolio}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-[11px] sm:text-xs text-stone-400 hover:text-white transition-colors"
                  >
                    <ExternalLink className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                    Portfolio
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── Invoice details card ── */}
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
          {/* Client name */}
          <div className="px-5 sm:px-6 pt-5 sm:pt-6 pb-4 border-b border-stone-100">
            <p className="text-[10px] sm:text-[11px] font-medium text-stone-400 uppercase tracking-widest mb-1">
              Invoice for
            </p>
            <p className="text-lg sm:text-xl font-display font-bold text-stone-900 truncate">
              {invoice.client_name}
            </p>
          </div>

          {/* Description */}
          <div className="px-5 sm:px-6 py-4 border-b border-stone-100">
            <p className="text-[10px] sm:text-[11px] font-medium text-stone-400 uppercase tracking-widest mb-1.5">
              Description
            </p>
            <p className="text-sm sm:text-[15px] text-stone-700 leading-relaxed">
              {invoice.description}
            </p>
          </div>

          {/* Due date */}
          {invoice.due_date && (
            <div className="px-5 sm:px-6 py-3.5 sm:py-4 border-b border-stone-100 flex items-center gap-3">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-stone-100 flex items-center justify-center shrink-0">
                <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-stone-500" />
              </div>
              <div>
                <p className="text-[10px] sm:text-[11px] font-medium text-stone-400 uppercase tracking-widest">
                  Due Date
                </p>
                <p className="text-sm sm:text-[15px] font-medium text-stone-800">
                  {formatDate(invoice.due_date)}
                </p>
              </div>
            </div>
          )}

          {/* Note */}
          {invoice.note && (
            <div className="px-5 sm:px-6 py-4 border-b border-stone-100">
              <div className="bg-amber-50 rounded-xl px-4 py-3 border border-amber-100">
                <p className="text-xs sm:text-sm text-amber-800 leading-relaxed">
                  {invoice.note}
                </p>
              </div>
            </div>
          )}

          {/* Amount */}
          <div className="px-5 sm:px-6 py-4 sm:py-5 bg-stone-50 flex items-center justify-between gap-4">
            <p className="text-sm sm:text-base font-medium text-stone-500 shrink-0">
              Total Due
            </p>
            <p className="text-2xl sm:text-3xl font-display font-bold text-stone-900 truncate text-right">
              {formatCurrency(invoice.amount, invoice.currency)}
            </p>
          </div>
        </div>

        {/* Paid badge */}
        {isPaid && (
          <div className="text-center pt-2 sm:pt-3">
            <span className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-emerald-50 border border-emerald-200 text-sm sm:text-base font-medium text-emerald-700">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
              Invoice Paid
            </span>
          </div>
        )}
      </div>

      {/* ── Sticky CTA footer ── */}
      {!isPaid && (
        <div
          className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-sm border-t border-stone-200"
          style={{ animation: "slide-up 0.4s ease both 0.2s" }}
        >
          <div className="w-full max-w-xl mx-auto px-4 sm:px-6 py-3 sm:py-4 space-y-2">
            <button
              onClick={handlePay}
              disabled={paying || !invoice.payment_link}
              className="w-full bg-stone-900 hover:bg-stone-800 active:scale-[0.98] disabled:opacity-60 text-white rounded-2xl font-semibold text-[15px] sm:text-base tracking-wide transition-all flex items-center justify-center gap-2"
              style={{ height: 52 }}
            >
              {paying ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                  Redirecting to Paystack...
                </>
              ) : (
                <>Pay {formatCurrency(invoice.amount, invoice.currency)} →</>
              )}
            </button>
            <p className="text-center text-[11px] sm:text-xs text-stone-400 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-500 shrink-0" />
              Payments processed securely by Paystack
            </p>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes fade-up {
          from {
            opacity: 0;
            transform: translateY(14px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(100%);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}