"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle, Building2, AlertCircle } from "lucide-react"
import { toast } from "sonner"

// Nigerian banks list
const BANKS = [
  { name: "Access Bank", code: "044" },
  { name: "Citibank Nigeria", code: "023" },
  { name: "Ecobank Nigeria", code: "050" },
  { name: "Fidelity Bank", code: "070" },
  { name: "First Bank of Nigeria", code: "011" },
  { name: "First City Monument Bank", code: "214" },
  { name: "Globus Bank", code: "00103" },
  { name: "Guaranty Trust Bank", code: "058" },
  { name: "Heritage Bank", code: "030" },
  { name: "Keystone Bank", code: "082" },
  { name: "Kuda Bank", code: "50211" },
  { name: "Opay", code: "999992" },
  { name: "Palmpay", code: "999991" },
  { name: "Polaris Bank", code: "076" },
  { name: "Providus Bank", code: "101" },
  { name: "Stanbic IBTC Bank", code: "221" },
  { name: "Standard Chartered Bank", code: "068" },
  { name: "Sterling Bank", code: "232" },
  { name: "Union Bank of Nigeria", code: "032" },
  { name: "United Bank for Africa", code: "033" },
  { name: "Unity Bank", code: "215" },
  { name: "VFD Microfinance Bank", code: "566" },
  { name: "Wema Bank", code: "035" },
  { name: "Zenith Bank", code: "057" },
]

interface BankDetailsFormProps {
  initialData: {
    bank_name?: string | null
    account_number?: string | null
    account_name?: string | null
    subaccount_code?: string | null
  }
  profileName: string
}

export function BankDetailsForm({ initialData, profileName }: BankDetailsFormProps) {
  const [bankCode, setBankCode] = useState("")
  const [accountNumber, setAccountNumber] = useState(initialData.account_number ?? "")
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(!!initialData.subaccount_code)
  const [accountData, setAccountData] = useState({
    bank_name: initialData.bank_name ?? "",
    account_name: initialData.account_name ?? "",
    subaccount_code: initialData.subaccount_code ?? "",
  })

  const handleSave = async () => {
    if (!bankCode || !accountNumber || accountNumber.length !== 10) {
      toast.error("Please select a bank and enter a valid 10-digit account number")
      return
    }

    setLoading(true)

    try {
      const res = await fetch("/api/subaccount", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bank_code: bankCode,
          account_number: accountNumber,
          business_name: profileName || "Freelancer",
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || "Failed to save bank details")
        return
      }

      setAccountData({
        bank_name: data.bank_name,
        account_name: data.account_name,
        subaccount_code: data.subaccount_code,
      })
      setSaved(true)
      toast.success("Bank account connected!", {
        description: "Payments will now go directly to your account.",
      })
    } catch (err) {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl bg-white rounded-2xl border border-stone-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-stone-900">Bank Account</h3>
          <p className="text-xs text-stone-400 mt-0.5">
            Payments go directly to this account via Paystack
          </p>
        </div>
        {saved && (
          <span className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            <CheckCircle className="w-3 h-3" />
            Connected
          </span>
        )}
      </div>

      <div className="px-6 py-5 space-y-4">
        {/* Already connected — show details */}
        {saved && accountData.subaccount_code ? (
          <div className="space-y-4">
            <div className="bg-emerald-50 rounded-xl px-4 py-3 border border-emerald-100 flex items-start gap-3">
              <Building2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-emerald-800">
                  {accountData.account_name}
                </p>
                <p className="text-xs text-emerald-600 mt-0.5">
                  {accountData.bank_name} · {initialData.account_number}
                </p>
                <p className="text-[11px] text-emerald-500 mt-1 font-mono">
                  {accountData.subaccount_code}
                </p>
              </div>
            </div>

            <button
              onClick={() => setSaved(false)}
              className="text-xs text-stone-400 hover:text-stone-700 underline underline-offset-2 transition-colors"
            >
              Update bank account
            </button>
          </div>
        ) : (
          // Bank details form
          <div className="space-y-4">
            <div className="bg-amber-50 rounded-xl px-4 py-3 border border-amber-100 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700 leading-relaxed">
                Add your bank account so clients can pay you directly. Funds settle within 24 hours.
              </p>
            </div>

            {/* Bank selector */}
            <div>
              <label className="text-xs font-medium text-stone-600 mb-1.5 block">
                Bank <span className="text-red-400">*</span>
              </label>
              <select
                value={bankCode}
                onChange={(e) => setBankCode(e.target.value)}
                className="w-full h-10 rounded-xl border border-stone-200 bg-stone-50 px-3 text-sm text-stone-800 focus:outline-none focus:border-stone-400 transition-colors"
              >
                <option value="">Select your bank</option>
                {BANKS.map((bank) => (
                  <option key={bank.code} value={bank.code}>
                    {bank.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Account number */}
            <div>
              <label className="text-xs font-medium text-stone-600 mb-1.5 block">
                Account Number <span className="text-red-400">*</span>
              </label>
              <Input
                placeholder="0123456789"
                value={accountNumber}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "").slice(0, 10)
                  setAccountNumber(val)
                }}
                inputMode="numeric"
                maxLength={10}
                className="rounded-xl border-stone-200 bg-stone-50 focus:bg-white h-10 text-sm font-mono transition-colors"
              />
              <p className={`text-[11px] text-right mt-0.5 ${
                accountNumber.length === 10 ? "text-emerald-500" : "text-stone-300"
              }`}>
                {accountNumber.length}/10
              </p>
            </div>

            <Button
              onClick={handleSave}
              disabled={loading || !bankCode || accountNumber.length !== 10}
              className="w-full h-10 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-sm font-semibold gap-2 disabled:opacity-40"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" />Connecting account...</>
              ) : (
                "Connect bank account"
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}