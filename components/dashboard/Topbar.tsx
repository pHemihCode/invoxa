"use client"

import { Bell } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { createClient } from "@/utils/supabase/client"
import { useRouter, usePathname } from "next/navigation"

interface TopbarProps {
  user: {
    email: string
    name?: string | null
    photo_url?: string | null
  }
}

function getInitials(name?: string | null, email?: string) {
  if (name) {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }
  return email?.[0]?.toUpperCase() ?? "U"
}

function getPageTitle(pathname: string) {
  if (pathname === "/dashboard") return "Overview"
  if (pathname.startsWith("/dashboard/invoices/new")) return "New Invoice"
  if (pathname.startsWith("/dashboard/invoices")) return "Invoices"
  if (pathname.startsWith("/dashboard/profile")) return "Profile"
  return "Dashboard"
}

export function Topbar({ user }: TopbarProps) {
  const router = useRouter()
  const supabase = createClient()

  // Get pathname client-side
  const pathname = usePathname()
  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between h-16 px-6 bg-[#F7F6F3] border-b border-stone-200">
      {/* Page title */}
      <h1 className="text-base font-semibold text-stone-900">
        {getPageTitle(pathname)}
      </h1>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Notification bell */}
        <button className="relative flex items-center justify-center w-9 h-9 rounded-xl text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500" />
        </button>

        {/* Avatar dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-xl hover:bg-stone-100 transition-colors">
              <Avatar className="w-7 h-7">
                <AvatarImage src={user.photo_url ?? undefined} />
                <AvatarFallback className="bg-stone-200 text-stone-600 text-xs font-medium">
                  {getInitials(user.name, user.email)}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col gap-0.5">
                {user.name ? (
                  <span className="text-sm font-medium text-stone-900">
                    {user.name}
                  </span>
                ):"Freelancer"}
                <span className="text-xs text-stone-500 truncate">
                  {user.email}
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => router.push("/dashboard/profile")}
            >
              Profile settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleSignOut}
              className="text-red-600 focus:text-red-600"
            >
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}