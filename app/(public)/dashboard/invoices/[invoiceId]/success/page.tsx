import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { SuccessClient } from "@/components/dashboard/SuccessClient"

interface Props {
  params: Promise<{ invoiceId: string }>
}

export default async function InvoiceSuccessPage({ params }: Props) {
    const { invoiceId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const { data: invoice } = await supabase
    .from("invoices")
    .select("*")
    .eq("id", invoiceId)
    .eq("freelancer_id", user.id)
    .single()

  if (!invoice) redirect("/dashboard/invoices")

  return <SuccessClient invoice={invoice} />
}