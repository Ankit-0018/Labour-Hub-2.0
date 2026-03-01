"use client"

import { onAuthStateChanged } from "firebase/auth"
import { auth } from "@/lib/firebase/firebase"
import { ReactNode, useEffect } from "react"
import { type UserRole, useUserStore } from "@/lib/stores/useUserStore"
import { getUserProfile } from "@/lib/services/user"

export default function AuthProvider({ children }: { children: ReactNode }) {

  const { setUser, setLoading } = useUserStore()

  useEffect(() => {

    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {

      try {

        if (!firebaseUser) {
          setUser(null)
          setLoading(false)
          return
        }

        const [token, profile] = await Promise.all([
          firebaseUser.getIdTokenResult(),
          getUserProfile(firebaseUser.uid)
        ])

        if (!profile) {
          console.error("User profile not found")
          setUser(null)
          setLoading(false)
          return
        }

        const role = token.claims.role

        if (role !== "worker" && role !== "employer") {
          console.error("Invalid role claim")
          setUser(null)
          setLoading(false)
          return
        }

        setUser({
          uid: firebaseUser.uid,
          role: role as UserRole,
          dailyWage: profile.dailyWage,
          phone: profile.phone,
          rating: profile.rating,
          workStatus: profile.workStatus,
          email: profile.email,
          skills: profile.skills
        })

      } catch (err) {
        console.error("Auth initialization failed:", err)
        setUser(null)
      } finally {
        setLoading(false)
      }

    })

    return () => unsub()

  }, [setUser, setLoading])

  return <>{children}</>
}