import { createClient } from "@/utils/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { invoiceId, amount, currency, client_name, client_email } = await request.json()

    if (!invoiceId || !amount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // ── TODO: Replace this stub with real Raenest API call ──
    const res = await fetch("https://api.paystack.co/transaction/initialize", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    email: client_email || "client@invoxa.app",
    amount: amount * 100, // Paystack uses kobo
    currency: currency,
    reference: invoiceId,
    callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/pay/${invoiceId}/success`,
    metadata: {
      invoice_id: invoiceId,
      client_name: client_name,
    },
  }),
})

const data = await res.json()
const paymentLink = data.data.authorization_url

    // Save payment link to Supabase
    const supabase = await createClient()
    const { error } = await supabase
      .from("invoices")
      .update({ payment_link: paymentLink })
      .eq("id", invoiceId)

    if (error) throw error

    return NextResponse.json({ paymentLink })
  } catch (err) {
    console.error("[generate-link]", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}