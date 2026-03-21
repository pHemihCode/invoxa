"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  FileText,
  Plus,
  User,
  LogOut,
  Zap,
} from "lucide-react"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

const navItems = [
  {
    label: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Invoices",
    href: "/dashboard/invoices",
    icon: FileText,
  },
  {
    label: "Profile",
    href: "/dashboard/profile",
    icon: User,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col fixed inset-y-0 left-0 w-72 bg-white border-r border-stone-200 z-30">
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-6 h-16 border-b border-stone-200">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-stone-900">
            <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-lg font-semibold tracking-tight text-stone-900">
            Invoxa
          </span>
        </div>

        {/* New Invoice CTA */}
        <div className="px-4 py-4 border-b border-stone-100">
          <Link href="/dashboard/invoices/new">
            <Button className="w-full gap-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl h-10 text-sm font-medium">
              <Plus className="w-4 h-4" />
              New Invoice
            </Button>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          <p className="px-3 mb-2 text-[11px] font-medium text-stone-400 uppercase tracking-widest">
            Menu
          </p>
          {navItems.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
                  isActive
                    ? "bg-stone-100 text-stone-900"
                    : "text-stone-500 hover:text-stone-900 hover:bg-stone-50"
                )}
              >
                <item.icon
                  className={cn(
                    "w-4 h-4 shrink-0",
                    isActive ? "text-stone-900" : "text-stone-400"
                  )}
                />
                {item.label}
                {item.label === "Invoices" && (
                  <span className="ml-auto text-[11px] font-medium bg-stone-100 text-stone-500 px-2 py-0.5 rounded-full">
                    3
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Sign out */}
        <div className="p-4 border-t border-stone-100">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-stone-500 hover:text-stone-900 hover:bg-stone-50 transition-all duration-150"
          >
            <LogOut className="w-4 h-4 text-stone-400" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-white border-t border-stone-200 flex items-center justify-around px-2 h-16">
        {navItems.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 px-4 py-2 rounded-xl text-[11px] font-medium transition-colors",
                isActive ? "text-stone-900" : "text-stone-400"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          )
        })}
        <Link
          href="/dashboard/invoices/new"
          className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl text-[11px] font-medium text-stone-400"
        >
          <div className="w-8 h-8 rounded-full bg-stone-900 flex items-center justify-center -mt-5 shadow-lg">
            <Plus className="w-4 h-4 text-white" />
          </div>
          <span className="mt-0.5">New</span>
        </Link>
      </nav>
    </>
  )
}