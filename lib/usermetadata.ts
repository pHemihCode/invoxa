export type UserMetadata = {
  full_name?: string
  avatar_url?: string
  email?: string
  name?: string       
  picture?: string  
}

export function getUserMetadata(user: { user_metadata?: object | null }): UserMetadata {
  return (user.user_metadata ?? {}) as UserMetadata
}