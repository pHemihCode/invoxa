import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { CheckCircle, Zap } from "lucide-react"

interface Props {
  params: Promise<{ invoiceId: string }>
}

export default async function PaymentSuccessPage({ params }: Props) {
  const { invoiceId } = await params
  const supabase = await createClient()

  const { data: invoice } = await supabase
    .from("invoices")
    .select("client_name, amount, currency, status")
    .eq("id", invoiceId)
    .single()

  if (!invoice) redirect("/")

  // Mark as paid if webhook hasn't fired yet
  await supabase
    .from("invoices")
    .update({ status: "paid", paid_at: new Date().toISOString() })
    .eq("id", invoiceId)
    .eq("status", "unpaid") // only update if still unpaid

  function formatCurrency(amount: number, currency: string) {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: currency ?? "NGN",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="min-h-screen bg-[#F7F6F3] flex flex-col">
      {/* Top bar */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-120 mx-auto px-5 py-4 flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-stone-900 flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-sm font-semibold text-stone-900">Invoxa</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div
          className="w-full max-w-120 text-center"
          style={{ animation: "fade-up 0.4s ease both" }}
        >
          {/* Success icon */}
          <div
            className="w-20 h-20 rounded-full bg-emerald-50 border-4 border-emerald-100 flex items-center justify-center mx-auto mb-6"
            style={{ animation: "pop-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) both 0.1s" }}
          >
            <CheckCircle className="w-10 h-10 text-emerald-500" strokeWidth={1.5} />
          </div>

          <h1 className="text-2xl font-display font-bold text-stone-900 mb-2">
            Payment Successful!
          </h1>
          <p className="text-sm text-stone-500 leading-relaxed mb-8">
            Your payment of{" "}
            <span className="font-semibold text-stone-800">
              {formatCurrency(invoice.amount, invoice.currency)}
            </span>{" "}
            to{" "}
            <span className="font-semibold text-stone-800">
              {invoice.client_name}
            </span>{" "}
            has been confirmed.
          </p>

          {/* Receipt card */}
          <div className="bg-white rounded-2xl border border-stone-200 p-5 text-left mb-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-stone-400 uppercase tracking-widest font-medium">Amount Paid</span>
              <span className="text-base font-bold text-stone-900">
                {formatCurrency(invoice.amount, invoice.currency)}
              </span>
            </div>
            <div className="h-px bg-stone-100" />
            <div className="flex items-center justify-between">
              <span className="text-xs text-stone-400 uppercase tracking-widest font-medium">Paid to</span>
              <span className="text-sm font-medium text-stone-800">{invoice.client_name}</span>
            </div>
            <div className="h-px bg-stone-100" />
            <div className="flex items-center justify-between">
              <span className="text-xs text-stone-400 uppercase tracking-widest font-medium">Status</span>
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                <CheckCircle className="w-3 h-3" />
                Confirmed
              </span>
            </div>
          </div>

          <p className="text-xs text-stone-400">
            Powered by Invoxa · Payments secured by Paystack
          </p>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(14px); }
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