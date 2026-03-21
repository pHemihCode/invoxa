import Link from "next/link"

export function EmptyInvoices() {
  return (
    <div className="bg-white rounded-2xl border border-dashed border-stone-200 p-16 text-center">
      {/* Illustration */}
      <div className="flex items-center justify-center mx-auto mb-6">
        <svg width="120" height="96" viewBox="0 0 120 96" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Document stack */}
          <rect x="24" y="18" width="56" height="68" rx="6" fill="#F5F5F4" stroke="#E7E5E4" strokeWidth="1.5"/>
          <rect x="30" y="12" width="56" height="68" rx="6" fill="#FAFAF9" stroke="#E7E5E4" strokeWidth="1.5"/>
          <rect x="36" y="6" width="56" height="68" rx="6" fill="white" stroke="#D6D3D1" strokeWidth="1.5"/>
          {/* Lines on top document */}
          <rect x="46" y="22" width="36" height="3" rx="1.5" fill="#E7E5E4"/>
          <rect x="46" y="30" width="28" height="3" rx="1.5" fill="#E7E5E4"/>
          <rect x="46" y="38" width="32" height="3" rx="1.5" fill="#E7E5E4"/>
          {/* Amount area */}
          <rect x="46" y="50" width="36" height="12" rx="4" fill="#F5F5F4"/>
          <rect x="50" y="54" width="16" height="3" rx="1.5" fill="#D6D3D1"/>
          {/* Plus circle */}
          <circle cx="88" cy="72" r="14" fill="#1C1917"/>
          <path d="M88 66v12M82 72h12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>

      <h3 className="text-base font-semibold text-stone-900 mb-1.5">
        No invoices yet
      </h3>
      <p className="text-sm text-stone-400 max-w-xs mx-auto leading-relaxed mb-6">
        Create your first invoice and share a payment link with your client in seconds.
      </p>
      <Link href="/dashboard/invoices/new">
        <button className="h-10 px-5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-sm font-medium transition-colors">
          Create your first invoice
        </button>
      </Link>
    </div>
  )
}

export function EmptySearchResults({ query }: { query: string }) {
  return (
    <div className="bg-white rounded-2xl border border-dashed border-stone-200 p-12 text-center">
      <div className="w-12 h-12 rounded-2xl bg-stone-100 flex items-center justify-center mx-auto mb-4">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <circle cx="9" cy="9" r="6" stroke="#A8A29E" strokeWidth="1.5"/>
          <path d="M13.5 13.5L17 17" stroke="#A8A29E" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M7 9h4M9 7v4" stroke="#A8A29E" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </div>
      <p className="text-sm font-medium text-stone-700 mb-1">
        No results for &ldquo;{query}&rdquo;
      </p>
      <p className="text-xs text-stone-400">
        Try searching by client name or description
      </p>
    </div>
  )
}

export function EmptyOverview() {
  return (
    <div className="bg-white rounded-2xl border border-dashed border-stone-200 p-12 text-center">
      <div className="flex items-center justify-center mx-auto mb-5">
        <svg width="80" height="72" viewBox="0 0 80 72" fill="none">
          <rect x="8" y="20" width="64" height="44" rx="8" fill="#FAFAF9" stroke="#E7E5E4" strokeWidth="1.5"/>
          <rect x="8" y="20" width="64" height="16" rx="8" fill="#F5F5F4" stroke="#E7E5E4" strokeWidth="1.5"/>
          <rect x="8" y="28" width="64" height="8" fill="#F5F5F4"/>
          <rect x="18" y="47" width="20" height="3" rx="1.5" fill="#E7E5E4"/>
          <rect x="18" y="54" width="14" height="3" rx="1.5" fill="#E7E5E4"/>
          <rect x="50" y="47" width="14" height="10" rx="3" fill="#D6D3D1"/>
          {/* Zap icon */}
          <circle cx="62" cy="16" r="12" fill="#1C1917"/>
          <path d="M63.5 9L59 16h4l-3.5 7L66 16h-4l1.5-7z" fill="white"/>
        </svg>
      </div>
      <h3 className="text-base font-semibold text-stone-900 mb-1.5">
        Ready to get paid?
      </h3>
      <p className="text-sm text-stone-400 max-w-xs mx-auto leading-relaxed mb-6">
        Create your first invoice and share a professional payment page with your client.
      </p>
      <Link href="/dashboard/invoices/new">
        <button className="h-10 px-5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-sm font-medium transition-colors">
          + New Invoice
        </button>
      </Link>
    </div>
  )
}