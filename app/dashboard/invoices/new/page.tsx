import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { InvoiceBuilderForm } from "@/components/dashboard/InvoiceBuilderForm"

export default async function NewInvoicePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("name, photo_url, bio")
    .eq("id", user.id)
    .single()

  return (
    <div className="pb-24 lg:pb-0">
      {/* Page header */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-stone-900">New Invoice</h2>
        <p className="mt-1 text-sm text-stone-500">
          Fill in the details — your payment page updates live on the right.
        </p>
      </div>

      <InvoiceBuilderForm
        userId={user.id}
        profile={{
          name: profile?.name,
          photo_url: profile?.photo_url,
          bio: profile?.bio,
        }}
      />
    </div>
  )
}