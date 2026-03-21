import { z } from "zod"

export const invoiceSchema = z.object({
  client_name: z
    .string()
    .min(2, "Client name must be at least 2 characters")
    .max(100, "Client name is too long"),

  client_email: z
    .string()
    .email("Enter a valid email address")
    .optional()
    .or(z.literal("")),

  amount: z
    .string()
    .min(1, "Amount is required")
    .refine((val) => !isNaN(Number(val.replace(/,/g, ""))) && Number(val.replace(/,/g, "")) > 0, {
      message: "Enter a valid amount greater than 0",
    }),

  currency: z.enum(["NGN", "USD", "GBP", "EUR"]),

  description: z
    .string()
    .min(5, "Description must be at least 5 characters")
    .max(500, "Description is too long"),

  due_date: z
    .string()
    .min(1, "Due date is required")
    .refine((val) => new Date(val) > new Date(), {
      message: "Due date must be in the future",
    }),

  github: z
    .string()
    .url("Enter a valid URL")
    .optional()
    .or(z.literal("")),

  behance: z
    .string()
    .url("Enter a valid URL")
    .optional()
    .or(z.literal("")),

  linkedin: z
    .string()
    .url("Enter a valid URL")
    .optional()
    .or(z.literal("")),

  portfolio: z
    .string()
    .url("Enter a valid URL")
    .optional()
    .or(z.literal("")),

  note: z
    .string()
    .max(300, "Note is too long")
    .optional()
    .or(z.literal("")),
})

export type InvoiceFormValues = z.infer<typeof invoiceSchema>

export const currencySymbols: Record<string, string> = {
  NGN: "₦",
  USD: "$",
  GBP: "£",
  EUR: "€",
}

export function formatAmount(value: string, currency: string): string {
  const num = Number(value.replace(/,/g, ""))
  if (isNaN(num)) return value
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(num)
}