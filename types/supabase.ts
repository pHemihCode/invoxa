import { User } from "@supabase/supabase-js"

export type UserMetadata = {
  full_name?: string
  name?: string
  avatar_url?: string
  picture?: string
  email?: string
}

export function extractUserProfile(user: User) {
  const meta = (user.user_metadata ?? {}) as UserMetadata

  const identityData = (user.identities?.[0]?.identity_data ?? {}) as UserMetadata

  const username =
    meta.full_name ??
    meta.name ??
    identityData.full_name ??
    identityData.name ??
    user.email?.split("@")[0] ?? 
    "Freelancer"

  const avatar =
    meta.avatar_url ??
    meta.picture ??
    identityData.avatar_url ??
    identityData.picture ??
    null

  return { username, avatar }
}