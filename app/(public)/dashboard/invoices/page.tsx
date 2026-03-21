import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { InvoicesClient } from "./invoice-client"

export default async function InvoicesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const { data: invoices } = await supabase
    .from("invoices")
    .select("id, client_name, amount, currency, description, due_date, status, payment_link, created_at")
    .eq("freelancer_id", user.id)
    .order("created_at", { ascending: false })

  return <InvoicesClient invoices={invoices ?? []} />
}