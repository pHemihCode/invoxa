"use client"

import { InvoiceFormValues, currencySymbols, formatAmount } from "@/lib/invoice-schema"
import { Github, Linkedin, Globe, ExternalLink } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface InvoicePreviewProps {
  values: Partial<InvoiceFormValues>
  profile: {
    name?: string | null
    photo_url?: string | null
    bio?: string | null
  }
}

function getInitials(name?: string | null) {
  if (!name) return "?"
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
}

export function InvoicePreview({ values, profile }: InvoicePreviewProps) {
  const {
    client_name,
    amount,
    currency = "NGN",
    description,
    due_date,
    github,
    behance,
    linkedin,
    portfolio,
    note,
  } = values

  const hasLinks = github || behance || linkedin || portfolio
  const symbol = currencySymbols[currency] ?? "₦"

  const isEmpty =
    !client_name && !amount && !description && !due_date

  return (
    <div className="h-full flex flex-col">
      {/* Preview header */}
      <div className="flex items-center justify-center mb-4 shrink-0">
        <p className="text-xs font-medium text-stone-400 uppercase tracking-widest">
          Live Preview
        </p>
      </div>

      {/* Phone frame */}
      <div className="flex-1 overflow-hidden">
        <div className="relative mx-auto w-full max-w-[320px] rounded-[2rem] border-[6px] border-stone-800 bg-white overflow-hidden" style={{ minHeight: 560 }}>
          {/* Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 bg-stone-800 rounded-b-xl z-10" />

          {/* Screen content */}
          <div className="pt-7 pb-6 px-5 overflow-y-auto h-full">

            {isEmpty ? (
              <div className="flex flex-col items-center justify-center h-full text-center pt-16">
                <div className="w-12 h-12 rounded-2xl bg-stone-100 flex items-center justify-center mb-3">
                  <span className="text-xl">✦</span>
                </div>
                <p className="text-xs font-medium text-stone-400">
                  Start filling the form
                </p>
                <p className="text-[11px] text-stone-300 mt-1">
                  Your payment page previews here
                </p>
              </div>
            ) : (
              <>
                {/* Freelancer card */}
                <div className="bg-stone-900 rounded-2xl p-4 mb-4 text-white">
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar className="w-10 h-10 border-2 border-stone-700">
                      <AvatarImage src={profile.photo_url ?? undefined} />
                      <AvatarFallback className="bg-stone-700 text-white text-xs font-medium">
                        {getInitials(profile.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate">
                        {profile.name ?? "Your Name"}
                      </p>
                      {profile.bio && (
                        <p className="text-[11px] text-stone-400 truncate">
                          {profile.bio}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Social links */}
                  {hasLinks && (
                    <div className="flex items-center gap-2 flex-wrap">
                      {github && (
                        <a
                          href={github}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-[10px] text-stone-300 hover:text-white transition-colors"
                        >
                          <Github className="w-3 h-3" />
                          GitHub
                        </a>
                      )}
                      {linkedin && (
                        <a
                          href={linkedin}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-[10px] text-stone-300 hover:text-white transition-colors"
                        >
                          <Linkedin className="w-3 h-3" />
                          LinkedIn
                        </a>
                      )}
                      {behance && (
                        <a
                          href={behance}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-[10px] text-stone-300 hover:text-white transition-colors"
                        >
                          <Globe className="w-3 h-3" />
                          Behance
                        </a>
                      )}
                      {portfolio && (
                        <a
                          href={portfolio}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-[10px] text-stone-300 hover:text-white transition-colors"
                        >
                          <ExternalLink className="w-3 h-3" />
                          Portfolio
                        </a>
                      )}
                    </div>
                  )}
                </div>

                {/* Invoice details */}
                <div className="space-y-3 mb-4">
                  <div>
                    <p className="text-[10px] font-medium text-stone-400 uppercase tracking-wider mb-0.5">
                      Invoice for
                    </p>
                    <p className="text-sm font-semibold text-stone-900">
                      {client_name || (
                        <span className="text-stone-300">Client Name</span>
                      )}
                    </p>
                  </div>

                  {description && (
                    <div>
                      <p className="text-[10px] font-medium text-stone-400 uppercase tracking-wider mb-0.5">
                        Description
                      </p>
                      <p className="text-xs text-stone-600 leading-relaxed">
                        {description}
                      </p>
                    </div>
                  )}

                  {due_date && (
                    <div>
                      <p className="text-[10px] font-medium text-stone-400 uppercase tracking-wider mb-0.5">
                        Due Date
                      </p>
                      <p className="text-xs text-stone-700">
                        {new Date(due_date).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  )}

                  {note && (
                    <div className="bg-amber-50 rounded-xl p-3 border border-amber-100">
                      <p className="text-[11px] text-amber-700 leading-relaxed">
                        {note}
                      </p>
                    </div>
                  )}
                </div>

                {/* Amount + CTA */}
                <div className="bg-stone-50 rounded-2xl p-4 border border-stone-100">
                  <div className="flex items-baseline justify-between mb-3">
                    <p className="text-[10px] font-medium text-stone-400 uppercase tracking-wider">
                      Total Due
                    </p>
                    <p className="text-xl font-bold text-stone-900">
                      {amount
                        ? formatAmount(amount, currency)
                        : `${symbol}0`}
                    </p>
                  </div>
                  <button
                    className="w-full bg-stone-900 text-white text-xs font-semibold rounded-xl py-3 tracking-wide"
                    disabled
                  >
                    Pay with Raenest →
                  </button>
                </div>

                {/* Powered by */}
                <p className="text-center text-[10px] text-stone-300 mt-3">
                  Powered by Invoxa · Secured by Raenest
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}