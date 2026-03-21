import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { ProfileClient } from "./ProfileClient"

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("name, bio, photo_url, email, github, behance, linkedin, portfolio")
    .eq("id", user.id)
    .single()

  return (
    <ProfileClient
      userId={user.id}
      initialProfile={{
        name: profile?.name ?? "",
        bio: profile?.bio ?? "",
        photo_url: profile?.photo_url ?? "",
        email: profile?.email ?? user.email ?? "",
        github: profile?.github ?? "",
        behance: profile?.behance ?? "",
        linkedin: profile?.linkedin ?? "",
        portfolio: profile?.portfolio ?? "",
      }}
    />
  )
}