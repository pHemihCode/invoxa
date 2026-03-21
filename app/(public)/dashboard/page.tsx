import { createClient } from "@/utils/supabase/server"
import { FileText, DollarSign, Clock, CheckCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { EmptyOverview } from "@/components/ui/empty-states"

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount)
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: invoices } = await supabase
    .from("invoices")
    .select("*")
    .eq("freelancer_id", user!.id)
    .order("created_at", { ascending: false })

  const { data: profile } = await supabase
    .from("profiles")
    .select("name")
    .eq("id", user!.id)
    .single()

  const total = invoices?.reduce((sum, inv) => sum + (inv.amount ?? 0), 0) ?? 0
  const paid = invoices?.filter((i) => i.status === "paid") ?? []
  const unpaid = invoices?.filter((i) => i.status === "unpaid") ?? []
  const paidTotal = paid.reduce((sum, inv) => sum + (inv.amount ?? 0), 0)

  const stats = [
    {
      label: "Total Invoiced",
      value: formatCurrency(total),
      icon: DollarSign,
      sub: `${invoices?.length ?? 0} invoices`,
      color: "text-stone-700",
      bg: "bg-stone-100",
    },
    {
      label: "Amount Received",
      value: formatCurrency(paidTotal),
      icon: CheckCircle,
      sub: `${paid.length} paid`,
      color: "text-emerald-700",
      bg: "bg-emerald-50",
    },
    {
      label: "Pending",
      value: formatCurrency(total - paidTotal),
      icon: Clock,
      sub: `${unpaid.length} unpaid`,
      color: "text-amber-700",
      bg: "bg-amber-50",
    },
    {
      label: "Total Invoices",
      value: invoices?.length ?? 0,
      icon: FileText,
      sub: "all time",
      color: "text-blue-700",
      bg: "bg-blue-50",
    },
  ]

  const firstName = profile?.name?.split(" ")[0] || user?.user_metadata?.full_name
  {(!invoices || invoices.length === 0) && <EmptyOverview />}
  
  return (
    <div className="space-y-8 pb-20 lg:pb-0">
      {/* Greeting */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-stone-900">
            Hey, {firstName} 
          </h2>
          <p className="mt-1 text-sm text-stone-500">
            Here's what's happening with your invoices.
          </p>
        </div>
        <Link href="/dashboard/invoices/new" className="hidden sm:block">
          <Button className="bg-stone-900 hover:bg-stone-800 text-white rounded-xl h-9 text-sm">
            + New Invoice
          </Button>
        </Link>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl border border-stone-200 p-4 space-y-3"
          >
            <div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center`}>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
            <div>
              <p className="text-[11px] font-medium text-stone-400 uppercase tracking-wider">
                {stat.label}
              </p>
              <p className="mt-0.5 text-xl font-semibold text-stone-900 truncate">
                {stat.value}
              </p>
              <p className="text-xs text-stone-400 mt-0.5">{stat.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent invoices */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-stone-900">
            Recent Invoices
          </h3>
          <Link
            href="/dashboard/invoices"
            className="text-xs text-stone-500 hover:text-stone-900 transition-colors"
          >
            View all →
          </Link>
        </div>

        {!invoices || invoices.length === 0 ? (
          <div className="bg-white rounded-2xl border border-stone-200 border-dashed p-12 text-center">
            <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center mx-auto mb-3">
              <FileText className="w-5 h-5 text-stone-400" />
            </div>
            <p className="text-sm font-medium text-stone-700">No invoices yet</p>
            <p className="text-xs text-stone-400 mt-1 mb-4">
              Create your first invoice and get paid
            </p>
            <Link href="/dashboard/invoices/new">
              <Button
                size="sm"
                className="bg-stone-900 hover:bg-stone-800 text-white rounded-xl"
              >
                Create invoice
              </Button>
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-100">
                  <th className="text-left text-[11px] font-medium text-stone-400 uppercase tracking-wider px-5 py-3">
                    Client
                  </th>
                  <th className="text-left text-[11px] font-medium text-stone-400 uppercase tracking-wider px-5 py-3 hidden sm:table-cell">
                    Due Date
                  </th>
                  <th className="text-right text-[11px] font-medium text-stone-400 uppercase tracking-wider px-5 py-3">
                    Amount
                  </th>
                  <th className="text-right text-[11px] font-medium text-stone-400 uppercase tracking-wider px-5 py-3">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {invoices.slice(0, 5).map((invoice) => (
                  <tr
                    key={invoice.id}
                    className="hover:bg-stone-50 transition-colors cursor-pointer"
                  >
                    <td className="px-5 py-3.5">
                      <div>
                        <p className="font-medium text-stone-900">
                          {invoice.client_name}
                        </p>
                        <p className="text-xs text-stone-400 truncate max-w-[160px]">
                          {invoice.description}
                        </p>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-stone-500 hidden sm:table-cell">
                      {invoice.due_date
                        ? new Date(invoice.due_date).toLocaleDateString(
                            "en-GB",
                            { day: "numeric", month: "short", year: "numeric" }
                          )
                        : "—"}
                    </td>
                    <td className="px-5 py-3.5 text-right font-medium text-stone-900">
                      {formatCurrency(invoice.amount)}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                          invoice.status === "paid"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {invoice.status === "paid" ? "Paid" : "Pending"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}