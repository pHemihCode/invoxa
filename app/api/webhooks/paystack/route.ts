import { createClient } from "@/utils/supabase/server"
import { NextResponse } from "next/server"
import crypto from "crypto"

export async function POST(request: Request) {
  try {
    const rawBody = await request.text()
    const signature = request.headers.get("x-paystack-signature")

    if (!signature) {
      console.error("[webhook] Missing Paystack signature")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const hash = crypto
      .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY!)
      .update(rawBody)
      .digest("hex")

    if (hash !== signature) {
      console.error("[webhook] Invalid Paystack signature")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // ── Step 2: Parse the event ──
    const event = JSON.parse(rawBody)
    console.log("[webhook] Event received:", event.event)

    // ── Step 3: Handle charge.success ──
    if (event.event === "charge.success") {
      const { reference, metadata, status } = event.data

      if (status !== "success") {
        return NextResponse.json({ received: true })
      }

      // We stored invoiceId in metadata when creating the Paystack link
      const invoiceId = metadata?.invoice_id ?? reference

      if (!invoiceId) {
        console.error("[webhook] No invoiceId in metadata")
        return NextResponse.json({ error: "No invoice ID" }, { status: 400 })
      }

      // ── Step 4: Update invoice status in Supabase ──
      const supabase = await createClient()

      const { error } = await supabase
        .from("invoices")
        .update({
          status: "paid",
          paid_at: new Date().toISOString(),
        })
        .eq("id", invoiceId)

      if (error) {
        console.error("[webhook] Supabase update error:", error)
        return NextResponse.json({ error: "DB update failed" }, { status: 500 })
      }

      console.log(`[webhook] Invoice ${invoiceId} marked as paid ✓`)
    }

    return NextResponse.json({ received: true })

  } catch (err) {
    console.error("[webhook] Unexpected error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}