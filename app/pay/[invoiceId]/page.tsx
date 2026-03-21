import { createClient } from "@/utils/supabase/server"
import { notFound } from "next/navigation"
import { PaymentPageClient } from "./PaymentPageClient"

interface Props {
  params: Promise<{ invoiceId: string }>
}

export default async function PaymentPage({ params }: Props) {
  const { invoiceId } = await params
  const supabase = await createClient()

  const { data: invoice, error } = await supabase
    .from("invoices")
    .select("*, profiles(name, photo_url, bio, github, behance, linkedin, portfolio)")
    .eq("id", invoiceId)
    .single()

  // Log the actual error so we can see it
  if (error) {
    console.error("Payment page error:", error)
    notFound()
  }

  if (!invoice) notFound()

  return <PaymentPageClient invoice={invoice} />
}