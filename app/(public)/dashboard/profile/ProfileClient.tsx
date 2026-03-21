"use client"

import { useState, useRef, useTransition } from "react"
import { createClient } from "@/utils/supabase/client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Camera,
  Loader2,
  Check,
  Github,
  Linkedin,
  Globe,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface ProfileData {
  name: string
  bio: string
  photo_url: string
  email: string
  github: string
  behance: string
  linkedin: string
  portfolio: string
}

interface ProfileClientProps {
  userId: string
  initialProfile: ProfileData
}

function getInitials(name: string) {
  if (!name.trim()) return "?"
  return name.trim().split(" ").filter(Boolean).map((n) => n[0]).join("").toUpperCase().slice(0, 2)
}

const supabase = createClient()

export function ProfileClient({ userId, initialProfile }: ProfileClientProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isPending, startTransition] = useTransition()
  const [showLinks, setShowLinks] = useState(false)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [saved, setSaved] = useState(false)
  const router = useRouter()

  const [profile, setProfile] = useState<ProfileData>(initialProfile)
  const [preview, setPreview] = useState<string>(initialProfile.photo_url)

  const update = (key: keyof ProfileData, value: string) => {
    setProfile((p) => ({ ...p, [key]: value }))
  }

  // ── Photo upload ──
  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Show local preview immediately
    const localUrl = URL.createObjectURL(file)
    setPreview(localUrl)
    setUploadingPhoto(true)

    try {
      const ext = file.name.split(".").pop()
      const path = `avatars/${userId}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, file, { upsert: true })

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(path)

      setProfile((p) => ({ ...p, photo_url: publicUrl }))
      setPreview(publicUrl)
      toast.success("Photo uploaded!")
    } catch (err) {
      console.error(err)
      toast.error("Photo upload failed", { description: "Try a smaller image." })
      setPreview(initialProfile.photo_url)
    } finally {
      setUploadingPhoto(false)
    }
  }

  // ── Save profile ──
  const handleSave = () => {
    startTransition(async () => {
      const { error } = await supabase
        .from("profiles")
        .update({
          name: profile.name,
          bio: profile.bio,
          photo_url: profile.photo_url,
          github: profile.github || null,
          behance: profile.behance || null,
          linkedin: profile.linkedin || null,
          portfolio: profile.portfolio || null,
        })
        .eq("id", userId)

      if (error) {
        toast.error("Failed to save profile")
        return
      }

      setSaved(true)
      toast.success("Profile saved!", {
        description: "Your payment page has been updated.",
      })
      setTimeout(() => setSaved(false), 3000)
      router.refresh()
    })
  }

  const hasChanges = JSON.stringify(profile) !== JSON.stringify(initialProfile)

  return (
    <div className="max-w-2xl space-y-5 pb-24 lg:pb-0">

      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold text-stone-900">Profile</h2>
        <p className="mt-1 text-sm text-stone-500">
          This information appears on your public payment page.
        </p>
      </div>

      {/* Photo + name card */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6">
        <h3 className="text-sm font-semibold text-stone-900 mb-5">Identity</h3>

        {/* Photo upload */}
        <div className="flex items-center gap-5 mb-6">
          <div className="relative shrink-0">
            <Avatar className="w-20 h-20 border-2 border-stone-200">
              <AvatarImage src={preview || undefined} />
              <AvatarFallback className="bg-stone-100 text-stone-600 text-xl font-semibold">
                {getInitials(profile.name)}
              </AvatarFallback>
            </Avatar>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingPhoto}
              className="absolute -bottom-1 -right-1 w-7 h-7 bg-stone-900 hover:bg-stone-700 rounded-full flex items-center justify-center transition-colors border-2 border-white"
            >
              {uploadingPhoto
                ? <Loader2 className="w-3 h-3 text-white animate-spin" />
                : <Camera className="w-3 h-3 text-white" />
              }
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={handlePhotoChange}
            />
          </div>
          <div>
            <p className="text-sm font-medium text-stone-800">Profile photo</p>
            <p className="text-xs text-stone-400 mt-0.5">
              PNG, JPG or WebP. Max 2MB.
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-xs text-stone-600 underline underline-offset-2 hover:text-stone-900 transition-colors mt-1"
            >
              {preview ? "Change photo" : "Upload photo"}
            </button>
          </div>
        </div>

        {/* Name + Bio */}
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-stone-600 mb-1.5 block">
              Full name <span className="text-red-400">*</span>
            </label>
            <Input
              placeholder="Femi Akintan"
              value={profile.name}
              onChange={(e) => update("name", e.target.value)}
              className="rounded-xl border-stone-200 bg-stone-50 focus:bg-white h-10 text-sm transition-colors"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-stone-600 mb-1.5 block">
              Bio
              <span className="text-stone-400 font-normal ml-1">(optional)</span>
            </label>
            <textarea
              placeholder="Frontend developer specialising in React & TypeScript. Based in Lagos."
              value={profile.bio}
              onChange={(e) => update("bio", e.target.value)}
              maxLength={160}
              rows={3}
              className="w-full rounded-xl border border-stone-200 bg-stone-50 focus:bg-white px-3 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-400 transition-colors resize-none"
            />
            <p className={`text-[11px] text-right mt-0.5 ${
              profile.bio.length > 140 ? "text-amber-500" : "text-stone-300"
            }`}>
              {profile.bio.length}/160
            </p>
          </div>

          <div>
            <label className="text-xs font-medium text-stone-600 mb-1.5 block">
              Email
            </label>
            <Input
              value={profile.email}
              disabled
              className="rounded-xl border-stone-200 bg-stone-100 h-10 text-sm text-stone-400 cursor-not-allowed"
            />
            <p className="text-[11px] text-stone-400 mt-1">
              Email is managed by your login provider.
            </p>
          </div>
        </div>
      </div>

      {/* Portfolio links (collapsible) */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
        <button
          type="button"
          onClick={() => setShowLinks((v) => !v)}
          className="flex items-center justify-between w-full px-6 py-4 text-left hover:bg-stone-50 transition-colors"
        >
          <div>
            <h3 className="text-sm font-semibold text-stone-900">Portfolio Links</h3>
            <p className="text-xs text-stone-400 mt-0.5">
              Show your work on every payment page
            </p>
          </div>
          {showLinks
            ? <ChevronUp className="w-4 h-4 text-stone-400 shrink-0" />
            : <ChevronDown className="w-4 h-4 text-stone-400 shrink-0" />
          }
        </button>

        {showLinks && (
          <div className="px-6 pb-6 border-t border-stone-100 pt-5 space-y-4">
            {([
              { key: "github", label: "GitHub", icon: Github, placeholder: "https://github.com/username" },
              { key: "linkedin", label: "LinkedIn", icon: Linkedin, placeholder: "https://linkedin.com/in/username" },
              { key: "behance", label: "Behance", icon: Globe, placeholder: "https://behance.net/username" },
              { key: "portfolio", label: "Portfolio site", icon: ExternalLink, placeholder: "https://yoursite.com" },
            ] as const).map(({ key, label, icon: Icon, placeholder }) => (
              <div key={key}>
                <label className="text-xs font-medium text-stone-600 mb-1.5 flex items-center gap-1.5">
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </label>
                <Input
                  placeholder={placeholder}
                  value={profile[key]}
                  onChange={(e) => update(key, e.target.value)}
                  className="rounded-xl border-stone-200 bg-stone-50 focus:bg-white h-10 text-sm transition-colors"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Payment page preview card */}
      <div className="bg-stone-900 rounded-2xl p-5 text-white">
        <p className="text-[11px] font-medium text-stone-500 uppercase tracking-widest mb-4">
          Preview on payment page
        </p>
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="w-11 h-11 border-2 border-stone-700 shrink-0">
            <AvatarImage src={preview || undefined} />
            <AvatarFallback className="bg-stone-700 text-white text-sm font-semibold">
              {getInitials(profile.name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate">
              {profile.name || <span className="text-stone-500">Your name</span>}
            </p>
            {profile.bio && (
              <p className="text-xs text-stone-400 mt-0.5 line-clamp-1">{profile.bio}</p>
            )}
          </div>
        </div>
        {(profile.github || profile.linkedin || profile.behance || profile.portfolio) && (
          <div className="flex items-center gap-3 flex-wrap pt-3 border-t border-stone-800">
            {profile.github && (
              <span className="flex items-center gap-1 text-[11px] text-stone-400">
                <Github className="w-3 h-3" />GitHub
              </span>
            )}
            {profile.linkedin && (
              <span className="flex items-center gap-1 text-[11px] text-stone-400">
                <Linkedin className="w-3 h-3" />LinkedIn
              </span>
            )}
            {profile.behance && (
              <span className="flex items-center gap-1 text-[11px] text-stone-400">
                <Globe className="w-3 h-3" />Behance
              </span>
            )}
            {profile.portfolio && (
              <span className="flex items-center gap-1 text-[11px] text-stone-400">
                <ExternalLink className="w-3 h-3" />Portfolio
              </span>
            )}
          </div>
        )}
      </div>

      {/* Save button */}
      <Button
        onClick={handleSave}
        disabled={isPending || !hasChanges}
        className="w-full h-11 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-semibold text-sm gap-2 disabled:opacity-40"
      >
        {isPending ? (
          <><Loader2 className="w-4 h-4 animate-spin" />Saving...</>
        ) : saved ? (
          <><Check className="w-4 h-4" />Saved!</>
        ) : (
          "Save profile"
        )}
      </Button>
    </div>
  )
}