"use client"

import React, { useEffect, useState, useCallback } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Loader2 } from 'lucide-react'
import { toast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import BookingHistoryList from "./_components/BookingHistoryList"
import CompletedBookingList from "./_components/CompletedBookingList"
import DeletedBookingList from "./_components/DeletedBookingList"

export default function MyBookingPage() {
  const { data: session, status } = useSession()
  const [bookingHistory, setBookingHistory] = useState([])
  const [completedBookings, setCompletedBookings] = useState([])
  const [deletedBookings, setDeletedBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const fetchBookingData = useCallback(async () => {
    if (!session?.user?.email) return 

    try {
      const [bookingsResponse, completedResponse, deletedResponse] = await Promise.all([
        fetch(`/api/getUserBookingHistory?userId=${session.user.email}`),
        fetch(`/api/getCompletedBooking?userId=${session.user.email}`),
        fetch(`/api/getDeletedBooking?userId=${session.user.email}`)
      ])

      if (!bookingsResponse.ok || !completedResponse.ok || !deletedResponse.ok) {
        throw new Error("Failed to fetch booking data")
      }

      const [bookingData, completedData, deletedData] = await Promise.all([
        bookingsResponse.json(),
        completedResponse.json(),
        deletedResponse.json()
      ])

      setBookingHistory(bookingData)
      setCompletedBookings(completedData)
      setDeletedBookings(deletedData)
      
    } catch (err) {
      setError((err as Error).message)
      toast({
        title: "Error",
        description: "Failed to fetch booking data. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }, [session])

  useEffect(() => {
    if (status === "loading") return

    if (status === "authenticated") {
      fetchBookingData()
    } else if (status === "unauthenticated") {
      setLoading(false)
      router.push("/sign-in")
      toast({ 
        title: "User Not Authenticated", 
        description: "Please login to view bookings.", 
        variant: "destructive" 
      })
    }
  }, [status, fetchBookingData, router])

  const refreshBookings = useCallback(() => {
    window.location.reload();
    setLoading(true)
    fetchBookingData()
  }, [fetchBookingData])

  if (status === "loading" || loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
      </div>
    )
  }

  if (status === "unauthenticated") {
    return null
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="text-red-500 text-center">
          <p>{error}</p>
          <button 
            onClick={refreshBookings}
            className="mt-4 px-4 py-2 bg-violet-600 text-white rounded hover:bg-violet-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <h1 className="text-2xl md:text-3xl font-bold text-zinc-900 mb-6 md:mb-8">My Bookings</h1>
      <div className="bg-white rounded-lg shadow-sm">
        <Tabs defaultValue="booked" className="w-full">
          <div className="border-b">
            <TabsList className="w-full flex bg-gray-50/50">
              <TabsTrigger 
                value="booked" 
                className="flex-1 px-3 md:px-6 py-3 md:py-4 text-sm md:text-base font-medium
                          data-[state=active]:bg-white data-[state=active]:text-zinc-900
                          data-[state=inactive]:bg-transparent data-[state=inactive]:text-zinc-500
                          border-0 rounded-none transition-colors
                          focus-visible:outline-none focus-visible:ring-0
                          relative after:absolute after:bottom-0 after:left-0 after:right-0 
                          after:h-[2px] after:bg-violet-600
                          after:opacity-0 data-[state=active]:after:opacity-100
                          after:transition-opacity"
              >
                Upcoming 
              </TabsTrigger>
              <TabsTrigger 
                value="completed"
                className="flex-1 px-3 md:px-6 py-3 md:py-4 text-sm md:text-base font-medium
                          data-[state=active]:bg-white data-[state=active]:text-zinc-900
                          data-[state=inactive]:bg-transparent data-[state=inactive]:text-zinc-500
                          border-0 rounded-none transition-colors
                          focus-visible:outline-none focus-visible:ring-0
                          relative after:absolute after:bottom-0 after:left-0 after:right-0 
                          after:h-[2px] after:bg-violet-600
                          after:opacity-0 data-[state=active]:after:opacity-100
                          after:transition-opacity"
              >
                Completed 
              </TabsTrigger>
              <TabsTrigger 
                value="deleted"
                className="flex-1 px-3 md:px-6 py-3 md:py-4 text-sm md:text-base font-medium
                          data-[state=active]:bg-white data-[state=active]:text-zinc-900
                          data-[state=inactive]:bg-transparent data-[state=inactive]:text-zinc-500
                          border-0 rounded-none transition-colors
                          focus-visible:outline-none focus-visible:ring-0
                          relative after:absolute after:bottom-0 after:left-0 after:right-0 
                          after:h-[2px] after:bg-violet-600
                          after:opacity-0 data-[state=active]:after:opacity-100
                          after:transition-opacity"
              >
                Cancelled 
              </TabsTrigger>
            </TabsList>
          </div>
          <div className="p-3 md:p-6">
            <TabsContent value="booked" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
              {bookingHistory.length > 0 ? (
                <BookingHistoryList bookingHistory={bookingHistory} refreshBookings={refreshBookings} />
              ) : (
                <p className="text-zinc-500 text-center py-6 md:py-8">No booking history available.</p>
              )}
            </TabsContent>
            <TabsContent value="completed" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
              {completedBookings.length > 0 ? (
                <CompletedBookingList completedBookings={completedBookings} />
              ) : (
                <p className="text-zinc-500 text-center py-6 md:py-8">No completed bookings available.</p>
              )}
            </TabsContent>
            <TabsContent value="deleted" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
              {deletedBookings.length > 0 ? (
                <DeletedBookingList deletedBookings={deletedBookings} />
              ) : (
                <p className="text-zinc-500 text-center py-6 md:py-8">No deleted bookings available.</p>
              )}
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  )
}