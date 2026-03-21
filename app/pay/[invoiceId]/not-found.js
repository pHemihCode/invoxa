import Link from "next/link"
import { Zap, FileX } from "lucide-react"

export default function InvoiceNotFound() {
  return (
    <div className="min-h-screen bg-[#F7F6F3] flex flex-col items-center justify-center px-4">
      <div className="flex items-center gap-2 mb-12">
        <div className="w-8 h-8 rounded-lg bg-stone-900 flex items-center justify-center">
          <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
        </div>
        <span className="text-base font-semibold text-stone-900">Invoxa</span>
      </div>

      <div className="text-center mt-4">
        <h1 className="text-xl font-display font-bold text-stone-900 mb-2">
          Invoice Not Found
        </h1>
        <p className="text-sm text-stone-500 max-w-xs leading-relaxed">
          This invoice link may have expired or doesn't exist. Please contact the sender for a new link.
        </p>
      </div>
    </div>
  )
}