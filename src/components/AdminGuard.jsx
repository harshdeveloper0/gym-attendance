"use client"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function AdminGuard({ children }) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "loading") return

    // Not logged in
    if (!session) {
      router.push("/api/auth/signin")
      return
    }

    // Logged in but not admin
    if (session.user.role !== "admin") {
      router.push("/") // redirect non-admin users
    }
  }, [session, status, router])

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg font-semibold">Checking access...</p>
      </div>
    )
  }

  // Only render content if user is admin
  if (session?.user?.role === "admin") {
    return children
  }

  return null
}
