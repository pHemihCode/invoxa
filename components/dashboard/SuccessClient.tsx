"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  CheckCircle,
  Copy,
  Check,
  ExternalLink,
  ArrowLeft,
  FileText,
  Share2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface Invoice {
  id: string
  client_name: string
  amount: number
  currency: string
  description: string
  due_date: string
  status: string
  payment_link: string | null
}

interface SuccessClientProps {
  invoice: Invoice
}

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: currency ?? "NGN",
    maximumFractionDigits: 0,
  }).format(amount)
}

export function SuccessClient({ invoice }: SuccessClientProps) {
  const router = useRouter()
  const [copied, setCopied] = useState(false)

  const publicUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/pay/${invoice.id}`

  const handleCopy = async () => {
    await navigator.clipboard.writeText(publicUrl)
    setCopied(true)
    toast.success("Link copied!", { description: "Send it to your client." })
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: `Invoice for ${invoice.client_name}`,
        text: `Here is your payment link for ${formatCurrency(invoice.amount, invoice.currency)}`,
        url: publicUrl,
      })
    } else {
      handleCopy()
    }
  }

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 pb-24 lg:pb-0">
      <div
        className="w-full max-w-md"
        style={{ animation: "fade-up 0.4s ease both" }}
      >
        {/* Success icon */}
        <div className="flex flex-col items-center">
          <div
            className="w-20 h-20 rounded-full bg-emerald-50 border-4 border-emerald-100 flex items-center justify-center mb-5"
            style={{ animation: "pop-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) both 0.1s" }}
          >
            <CheckCircle className="w-10 h-10 text-emerald-500" strokeWidth={1.5} />
          </div>
          <h2 className="text-2xl font-display font-bold text-stone-900 text-center">
            Invoice Created!
          </h2>
          <p className="mt-2 text-sm text-stone-500 text-center leading-relaxed">
            Share the link with{" "}
            <span className="font-medium text-stone-700">{invoice.client_name}</span>{" "}
            to get paid.
          </p>
        </div>

        {/* Invoice summary card */}
        <div className="bg-white mt-5 rounded-2xl border border-stone-200 overflow-hidden mb-4">
          <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center">
                <FileText className="w-4 h-4 text-stone-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-stone-900">
                  {invoice.client_name}
                </p>
                <p className="text-xs text-stone-400 truncate max-w-[180px]">
                  {invoice.description}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-base font-bold text-stone-900">
                {formatCurrency(invoice.amount, invoice.currency)}
              </p>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-50 text-amber-700">
                Pending
              </span>
            </div>
          </div>

          {/* Payment link row */}
          <div className="px-5 py-4">
            <p className="text-[11px] font-medium text-stone-400 uppercase tracking-wider mb-2">
              Payment link
            </p>
            <div className="flex items-center gap-2 bg-stone-50 rounded-xl border border-stone-200 px-3 py-2.5">
              <p className="flex-1 text-xs text-stone-600 truncate font-mono">
                {publicUrl}
              </p>
              <button
                onClick={handleCopy}
                className="shrink-0 w-7 h-7 flex items-center justify-center rounded-lg hover:bg-stone-200 transition-colors"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-stone-400" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="space-y-3">
          <Button
            onClick={handleCopy}
            className="w-full h-11 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-semibold text-sm gap-2"
          >
            {copied ? (
              <><Check className="w-4 h-4" /> Copied!</>
            ) : (
              <><Copy className="w-4 h-4" /> Copy payment link</>
            )}
          </Button>

          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={handleShare}
              variant="outline"
              className="h-10 rounded-xl border-stone-200 text-stone-700 hover:bg-stone-50 text-sm gap-2"
            >
              <Share2 className="w-4 h-4" />
              Share
            </Button>

            {invoice.payment_link && (
              <Button
                onClick={() => window.open(invoice.payment_link!, "_blank")}
                variant="outline"
                className="h-10 rounded-xl border-stone-200 text-stone-700 hover:bg-stone-50 text-sm gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Preview
              </Button>
            )}
          </div>

          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center justify-center gap-2 w-full py-3 text-sm text-stone-400 hover:text-stone-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to dashboard
          </button>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pop-in {
          from { opacity: 0; transform: scale(0.6); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  )
}