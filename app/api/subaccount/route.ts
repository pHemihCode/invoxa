import { createClient } from "@/utils/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { bank_code, account_number, business_name } = await request.json()

    if (!bank_code || !account_number || !business_name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // ── Step 1: Create subaccount on Paystack ──
    const res = await fetch("https://api.paystack.co/subaccount", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        business_name,
        bank_code,
        account_number,
        percentage_charge: 0, // platform takes 0% — freelancer gets 100%
      }),
    })

    const data = await res.json()
    console.log("[subaccount] Paystack response:", data)

    if (!res.ok || !data.data) {
      return NextResponse.json(
        { error: data.message || "Failed to create subaccount" },
        { status: 400 }
      )
    }

    const subaccount_code = data.data.subaccount_code
    const account_name = data.data.account_name

    // ── Step 2: Save subaccount code to profile ──
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        bank_name: data.data.settlement_bank,
        account_number,
        account_name,
        subaccount_code,
      })
      .eq("id", user.id)

    if (updateError) {
      console.error("[subaccount] Supabase update error:", updateError)
      return NextResponse.json({ error: "Failed to save bank details" }, { status: 500 })
    }

    return NextResponse.json({
      subaccount_code,
      account_name,
      bank_name: data.data.settlement_bank,
    })

  } catch (err) {
    console.error("[subaccount] Error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}