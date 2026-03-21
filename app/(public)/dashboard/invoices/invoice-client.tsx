"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { EmptyInvoices, EmptySearchResults } from "@/components/ui/empty-states"
import {
  Plus,
  Search,
  Copy,
  Check,
  ExternalLink,
  FileText,
  Clock,
  CheckCircle,
  ChevronRight,
} from "lucide-react"
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
  created_at: string
}

type Filter = "all" | "unpaid" | "paid"

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: currency ?? "NGN",
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

function isOverdue(due_date: string, status: string) {
  return status === "unpaid" && new Date(due_date) < new Date()
}

function CopiedLink({ paymentLink, invoiceId }: { paymentLink: string | null; invoiceId: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const url = `${window.location.origin}/pay/${invoiceId}`
    await navigator.clipboard.writeText(url)
    setCopied(true)
    toast.success("Payment link copied!")
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-stone-100 transition-colors shrink-0"
      title="Copy payment link"
    >
      {copied
        ? <Check className="w-3.5 h-3.5 text-emerald-500" />
        : <Copy className="w-3.5 h-3.5 text-stone-400" />
      }
    </button>
  )
}

export function InvoicesClient({ invoices }: { invoices: Invoice[] }) {
  const [filter, setFilter] = useState<Filter>("all")
  const [search, setSearch] = useState("")

  const filtered = useMemo(() => {
    return invoices.filter((inv) => {
      const matchesFilter =
        filter === "all" ||
        (filter === "paid" && inv.status === "paid") ||
        (filter === "unpaid" && inv.status === "unpaid")

      const matchesSearch =
        !search ||
        inv.client_name.toLowerCase().includes(search.toLowerCase()) ||
        inv.description.toLowerCase().includes(search.toLowerCase())

      return matchesFilter && matchesSearch
    })
  }, [invoices, filter, search])

  const counts = useMemo(() => ({
    all: invoices.length,
    unpaid: invoices.filter((i) => i.status === "unpaid").length,
    paid: invoices.filter((i) => i.status === "paid").length,
  }), [invoices])

  const totalPending = invoices
    .filter((i) => i.status === "unpaid")
    .reduce((sum, i) => sum + i.amount, 0)

  const tabs: { key: Filter; label: string }[] = [
    { key: "all", label: "All" },
    { key: "unpaid", label: "Pending" },
    { key: "paid", label: "Paid" },
  ]

{filtered.length === 0 && (
  search ? <EmptySearchResults query={search} /> : <EmptyInvoices />
)}
  return (
    <div className="space-y-5 pb-24 lg:pb-0">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-stone-900">Invoices</h2>
          {totalPending > 0 && (
            <p className="mt-1 text-sm text-stone-500">
              <span className="font-medium text-amber-600">
                {formatCurrency(totalPending, "NGN")}
              </span>{" "}
              pending collection
            </p>
          )}
        </div>
        <Link href="/dashboard/invoices/new">
          <button className="flex items-center gap-2 h-9 px-4 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-sm font-medium transition-colors">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:block">New Invoice</span>
          </button>
        </Link>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            placeholder="Search by client or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-9 pr-4 bg-white border border-stone-200 rounded-xl text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-stone-400 transition-colors"
          />
        </div>

        {/* Filter tabs */}
        <div className="flex items-center bg-white border border-stone-200 rounded-xl p-1 gap-0.5 shrink-0 w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                filter === tab.key
                  ? "bg-stone-900 text-white"
                  : "text-stone-500 hover:text-stone-900"
              }`}
            >
              {tab.label}
              <span className={`text-[11px] px-1.5 py-0.5 rounded-full font-medium ${
                filter === tab.key
                  ? "bg-white/20 text-white"
                  : "bg-stone-100 text-stone-400"
              }`}>
                {counts[tab.key]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Invoice list */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-stone-200 p-12 text-center">
          <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center mx-auto mb-3">
            <FileText className="w-5 h-5 text-stone-400" />
          </div>
          <p className="text-sm font-medium text-stone-700">
            {search ? "No invoices match your search" : "No invoices yet"}
          </p>
          <p className="text-xs text-stone-400 mt-1 mb-4">
            {search ? "Try a different search term" : "Create your first invoice to get paid"}
          </p>
          {!search && (
            <Link href="/dashboard/invoices/new">
              <button className="h-9 px-4 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-sm font-medium transition-colors">
                Create invoice
              </button>
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((invoice, i) => {
            const overdue = isOverdue(invoice.due_date, invoice.status)

            return (
              <div
                key={invoice.id}
                className="bg-white rounded-2xl border border-stone-200 hover:border-stone-300 transition-all group"
                style={{ animation: `fade-up 0.3s ease both ${i * 40}ms` }}
              >
                <div className="flex items-center gap-3 px-4 py-4">

                  {/* Status icon */}
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    invoice.status === "paid"
                      ? "bg-emerald-50"
                      : overdue
                      ? "bg-red-50"
                      : "bg-amber-50"
                  }`}>
                    {invoice.status === "paid" ? (
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                    ) : overdue ? (
                      <Clock className="w-4 h-4 text-red-400" />
                    ) : (
                      <Clock className="w-4 h-4 text-amber-500" />
                    )}
                  </div>

                  {/* Invoice info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-semibold text-stone-900 truncate">
                        {invoice.client_name}
                      </p>
                      {/* Status badge */}
                      <span className={`shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide ${
                        invoice.status === "paid"
                          ? "bg-emerald-50 text-emerald-700"
                          : overdue
                          ? "bg-red-50 text-red-600"
                          : "bg-amber-50 text-amber-700"
                      }`}>
                        {invoice.status === "paid" ? "Paid" : overdue ? "Overdue" : "Pending"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-xs text-stone-400 truncate max-w-[200px]">
                        {invoice.description}
                      </p>
                      <span className="text-stone-200 text-xs">·</span>
                      <p className="text-xs text-stone-400 shrink-0">
                        Due {formatDate(invoice.due_date)}
                      </p>
                    </div>
                  </div>

                  {/* Amount + actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    <p className={`text-sm font-bold mr-1 ${
                      invoice.status === "paid" ? "text-emerald-600" : "text-stone-900"
                    }`}>
                      {formatCurrency(invoice.amount, invoice.currency)}
                    </p>

                    {/* Copy link */}
                    <CopiedLink
                      paymentLink={invoice.payment_link}
                      invoiceId={invoice.id}
                    />

                    {/* Open payment page */}
                    <Link
                      href={`/pay/${invoice.id}`}
                      target="_blank"
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-stone-100 transition-colors"
                      title="Open payment page"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
                    </Link>
                  </div>
                </div>

                {/* Overdue warning bar */}
                {overdue && (
                  <div className="px-4 pb-3">
                    <div className="bg-red-50 rounded-xl px-3 py-2 border border-red-100">
                      <p className="text-xs text-red-600 font-medium">
                        This invoice is overdue — follow up with {invoice.client_name}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      <style>{`
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}