import { createClient } from "@/utils/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { invoiceId, amount, currency, client_name, client_email } = await request.json()

    if (!invoiceId || !amount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = await createClient()

    // Fetch the invoice to get the freelancer's ID
    const { data: invoice } = await supabase
      .from("invoices")
      .select("freelancer_id")
      .eq("id", invoiceId)
      .single()

    // Fetch the freelancer's subaccount code
    const { data: profile } = await supabase
      .from("profiles")
      .select("subaccount_code")
      .eq("id", invoice?.freelancer_id)
      .single()

    const origin = request.headers.get("origin") ||
      process.env.NEXT_PUBLIC_APP_URL

    const res = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: client_email || "client@invoxa.app",
        amount: amount * 100,
        reference: invoiceId,
        callback_url: `${origin}/pay/${invoiceId}/success`,
        metadata: {
          invoice_id: invoiceId,
          client_name,
        },
        // Use subaccount if freelancer has connected their bank
        ...(profile?.subaccount_code && {
          subaccount: profile.subaccount_code,
          bearer: "subaccount",
        }),
      }),
    })

    const data = await res.json()
    console.log("[generate-link] Paystack response:", data)

    if (!res.ok || !data.data) {
      return NextResponse.json(
        { error: data.message || "Paystack error" },
        { status: 400 }
      )
    }

    const paymentLink = data.data.authorization_url

    // Save payment link to Supabase
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