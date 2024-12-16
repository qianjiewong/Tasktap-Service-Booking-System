import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export function useAuthenticatedSession() {
  const { data: session, status } = useSession()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (status === "authenticated") {
      setIsAuthenticated(true)
    } else if (status === "unauthenticated") {
      setIsAuthenticated(false)
      router.push("/tasker-sign-in")
    }
  }, [status, router])

  return { session, isAuthenticated }
}