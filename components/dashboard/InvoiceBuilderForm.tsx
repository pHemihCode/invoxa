"use client"

import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { invoiceSchema, InvoiceFormValues } from "@/lib/invoice-schema"
import { InvoicePreview } from "@/components/dashboard/InvoicePreview"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { Loader2, ChevronDown, ChevronUp, Eye } from "lucide-react"
import { toast } from "sonner"

interface InvoiceBuilderFormProps {
  userId: string
  profile: {
    name?: string | null
    photo_url?: string | null
    bio?: string | null
  }
}

export function InvoiceBuilderForm({ userId, profile }: InvoiceBuilderFormProps) {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [showLinks, setShowLinks] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      client_name: "",
      client_email: "",
      amount: "",
      currency: "NGN",
      description: "",
      due_date: "",
      github: "",
      behance: "",
      linkedin: "",
      portfolio: "",
      note: "",
    },
    mode: "onChange",
  })

  // Watch all values for live preview
  const watchedValues = useWatch({ control: form.control })

  const onSubmit = async (values: InvoiceFormValues) => {
    setLoading(true)
    try {
      const amount = Number(values.amount.replace(/,/g, ""))

      const { data, error } = await supabase
        .from("invoices")
        .insert({
          freelancer_id: userId,
          client_name: values.client_name,
          client_email: values.client_email || null,
          amount,
          currency: values.currency,
          description: values.description,
          due_date: values.due_date,
          note: values.note || null,
          github: values.github || null,
          behance: values.behance || null,
          linkedin: values.linkedin || null,
          portfolio: values.portfolio || null,
          status: "unpaid",
        })
        .select("id")
        .single()

      if (error) throw error

      toast.success("Invoice created!", {
        description: "Now generating your payment link...",
      })

      // Trigger Raenest payment link generation
      const res = await fetch("/api/invoices/generate-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoiceId: data.id, amount, currency: values.currency, client_name: values.client_name,client_email: values.client_email }),
      })

      if (!res.ok) throw new Error("Failed to generate payment link")

      router.push(`/dashboard/invoices/${data.id}/success`)
    } catch (err) {
      console.error(err)
      toast.error("Something went wrong", {
        description: "Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 min-h-[calc(100vh-8rem)]">

      {/* ── Left: Form ── */}
      <div className="flex-1 min-w-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

            {/* Section: Client details */}
            <div className="bg-white rounded-2xl border border-stone-200 p-5 space-y-4">
              <h2 className="text-sm font-semibold text-stone-900">
                Client Details
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="client_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-stone-600">
                        Client Name <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Acme Corp"
                          className="rounded-xl border-stone-200 bg-stone-50 focus:bg-white h-10 text-sm transition-colors"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="client_email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-stone-600">
                        Client Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="client@company.com"
                          className="rounded-xl border-stone-200 bg-stone-50 focus:bg-white h-10 text-sm transition-colors"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Section: Invoice details */}
            <div className="bg-white rounded-2xl border border-stone-200 p-5 space-y-4">
              <h2 className="text-sm font-semibold text-stone-900">
                Invoice Details
              </h2>

              {/* Amount + Currency */}
              <div className="flex gap-3">
                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem className="w-28 shrink-0">
                      <FormLabel className="text-xs font-medium text-stone-600">
                        Currency
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="rounded-xl border-stone-200 bg-stone-50 h-10 text-sm">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="NGN">₦ NGN</SelectItem>
                          <SelectItem value="USD">$ USD</SelectItem>
                          <SelectItem value="GBP">£ GBP</SelectItem>
                          <SelectItem value="EUR">€ EUR</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel className="text-xs font-medium text-stone-600">
                        Amount <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="150,000"
                          inputMode="numeric"
                          className="rounded-xl border-stone-200 bg-stone-50 focus:bg-white h-10 text-sm transition-colors"
                          {...field}
                          onChange={(e) => {
                            // Strip non-numeric except commas
                            const raw = e.target.value.replace(/[^\d,]/g, "")
                            field.onChange(raw)
                          }}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium text-stone-600">
                      Description <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Brand identity design for Q3 product launch — includes logo, color system, and usage guidelines."
                        className="rounded-xl border-stone-200 bg-stone-50 focus:bg-white text-sm resize-none min-h-[88px] transition-colors"
                        {...field}
                      />
                    </FormControl>
                    <div className="flex justify-between">
                      <FormMessage className="text-xs" />
                      <span className={cn(
                        "text-[11px] ml-auto",
                        (field.value?.length ?? 0) > 450 ? "text-amber-500" : "text-stone-300"
                      )}>
                        {field.value?.length ?? 0}/500
                      </span>
                    </div>
                  </FormItem>
                )}
              />

              {/* Due date */}
              <FormField
                control={form.control}
                name="due_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium text-stone-600">
                      Due Date <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        min={new Date().toISOString().split("T")[0]}
                        className="rounded-xl border-stone-200 bg-stone-50 focus:bg-white h-10 text-sm transition-colors"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              {/* Note (optional) */}
              <FormField
                control={form.control}
                name="note"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium text-stone-600">
                      Note to client{" "}
                      <span className="text-stone-400 font-normal">(optional)</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Payment within 7 days. Thank you!"
                        className="rounded-xl border-stone-200 bg-stone-50 focus:bg-white h-10 text-sm transition-colors"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>

            {/* Section: Portfolio links (collapsible) */}
            <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
              <button
                type="button"
                onClick={() => setShowLinks((v) => !v)}
                className="flex items-center justify-between w-full px-5 py-4 text-left hover:bg-stone-50 transition-colors"
              >
                <div>
                  <h2 className="text-sm font-semibold text-stone-900">
                    Portfolio Links
                  </h2>
                  <p className="text-xs text-stone-400 mt-0.5">
                    Show your work on the payment page
                  </p>
                </div>
                {showLinks ? (
                  <ChevronUp className="w-4 h-4 text-stone-400 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-stone-400 shrink-0" />
                )}
              </button>

              {showLinks && (
                <div className="px-5 pb-5 space-y-4 border-t border-stone-100">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                    {(
                      [
                        { name: "github", label: "GitHub", placeholder: "https://github.com/username" },
                        { name: "linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/in/username" },
                        { name: "behance", label: "Behance", placeholder: "https://behance.net/username" },
                        { name: "portfolio", label: "Portfolio site", placeholder: "https://yoursite.com" },
                      ] as const
                    ).map((link) => (
                      <FormField
                        key={link.name}
                        control={form.control}
                        name={link.name}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-medium text-stone-600">
                              {link.label}
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder={link.placeholder}
                                className="rounded-xl border-stone-200 bg-stone-50 focus:bg-white h-10 text-sm transition-colors"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile: preview toggle */}
            <button
              type="button"
              onClick={() => setShowPreview((v) => !v)}
              className="lg:hidden flex items-center justify-center gap-2 w-full py-3 rounded-2xl border border-stone-200 bg-white text-sm font-medium text-stone-600 hover:bg-stone-50 transition-colors"
            >
              <Eye className="w-4 h-4" />
              {showPreview ? "Hide preview" : "Show preview"}
            </button>

            {/* Mobile preview */}
            {showPreview && (
              <div className="lg:hidden bg-white rounded-2xl border border-stone-200 p-5">
                <InvoicePreview values={watchedValues} profile={profile} />
              </div>
            )}

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-stone-900 hover:bg-stone-800 text-white rounded-2xl text-sm font-semibold tracking-wide"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating payment link...
                </>
              ) : (
                "Generate Invoice & Payment Link →"
              )}
            </Button>
          </form>
        </Form>
      </div>

      {/* ── Right: Live preview (desktop only) ── */}
      <div className="hidden lg:block w-[340px] xl:w-[380px] shrink-0 sticky top-24 self-start">
        <InvoicePreview values={watchedValues} profile={profile} />
      </div>
    </div>
  )
}