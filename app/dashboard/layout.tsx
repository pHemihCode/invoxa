import { Sidebar } from "@/components/dashboard/Sidebar"
import { Topbar } from "@/components/dashboard/Topbar"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("name, photo_url")
    .eq("id", user.id)
    .single()

  return (
    <div className="flex h-screen bg-[#F7F6F3] overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 lg:ml-72">
        <Topbar user={{ email: user.email ?? "", name: profile?.name, photo_url: profile?.photo_url }} />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}