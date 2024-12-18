'use client'

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from '@/hooks/use-toast'
import { Calendar, Clock, Mail, CheckCircle2, XCircle, ChevronRight, Filter, Search, AlertCircle, ArrowUpRight, User, DollarSign, Loader2, Star, MessageCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"

interface Booking {
  id: number
  contactPerson: {
    name: string
    image: string
    price: string
  }
  category: {
    name: string
    iconUrl: string
  }
  userEmail: string
  date: string
  time: string
  location: string
  status: string
  price: number
  rating: number
  reviews: string
}

const OrderCard = ({ booking, onComplete }: { booking: Booking; onComplete?: (id: number) => void }) => {
  const isCompleted = booking.status === 'completed'

  const renderStars = (rating: number) => {
    const fullStars = Array.from({ length: rating }, (_, index) => (
      <span key={index} className="text-yellow-500">★</span>
    ));
    const emptyStars = Array.from({ length: 5 - rating }, (_, index) => (
      <span key={index} className="text-gray-400">★</span>
    ));
    return [...fullStars, ...emptyStars];
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/4 md:min-w-[200px] md:max-w-[300px]">
            <img 
              src={booking.contactPerson.image[0]}
              alt={booking.contactPerson.name}
              className="w-full h-48 md:h-full object-cover"
            />
          </div>
          <CardContent className="flex-1 p-4 md:p-6">
            <div className="flex flex-col md:flex-row md:items-start justify-between">
              <div>
                <h3 className="text-lg md:text-xl font-semibold">{booking.contactPerson.name}</h3>
                <Badge variant={isCompleted ? "secondary" : "default"} className="mt-2 md:mt-3 mb-2 bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  {booking.category.name}
                </Badge>
              </div>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full mt-2 md:mt-0">
                    <ArrowUpRight className="h-4 w-4" />
                    <span className="sr-only">View details</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 sm:p-6 rounded-lg shadow-lg w-[90vw] max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Booking Details</DialogTitle>
                    <DialogDescription>
                      Complete information about this booking
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <span className="text-sm font-medium col-span-1">ID</span>
                      <span className="col-span-3">#{booking.id}</span>
                    </div>
                    <Separator />
                    <div className="grid grid-cols-4 items-center gap-4">
                      <span className="text-sm font-medium col-span-1">Status</span>
                      <span className={`col-span-3 ${isCompleted ? 'text-green-600' : 'text-yellow-600'} flex items-center gap-2`}>
                        {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                        {isCompleted ? 'Completed' : 'Pending'}
                      </span>
                    </div>
                    <Separator />
                    <div className="grid grid-cols-4 items-center gap-4">
                      <span className="text-sm font-medium col-span-1">Customer</span>
                      <span className="col-span-3">{booking.userEmail}</span>
                    </div>
                    <Separator />
                    <div className="grid grid-cols-4 items-center gap-4">
                      <span className="text-sm font-medium col-span-1">Date</span>
                      <span className="col-span-3">{booking.date}</span>
                    </div>
                    <Separator />
                    <div className="grid grid-cols-4 items-center gap-4">
                      <span className="text-sm font-medium col-span-1">Time</span>
                      <span className="col-span-3">{booking.time}</span>
                    </div>
                    <Separator />
                    <div className="grid grid-cols-4 items-center gap-4">
                      <span className="text-sm font-medium col-span-1">Address</span>
                      <span className="col-span-3">{booking.location}</span>
                    </div>
                    <Separator />
                    <div className="grid grid-cols-4 items-center gap-4">
                      <span className="text-sm font-medium col-span-1">Price</span>
                      <span className="col-span-3">RM{booking.contactPerson.price}</span>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Customer</p>
                  <p className="text-sm font-medium truncate max-w-[120px]">{booking.userEmail}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Date</p>
                  <p className="text-sm font-medium">{booking.date}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Clock className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Time</p>
                  <p className="text-sm font-medium">{booking.time}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <DollarSign className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Price</p>
                  <p className="text-sm font-medium">RM{booking.contactPerson.price}</p>
                </div>
              </div>
            </div>

          {isCompleted && (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Star className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Rating</p>
                    <p className="text-lg font-medium truncate max-w-[120px]">{renderStars(booking.rating)}</p>
                  </div>
                </div>
              </div>

              <div className="mt-2">
                <div className="flex items-center gap-3 mt-4">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <MessageCircle className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Review</p>
                    <p className="text-sm text-muted-foreground">{booking.reviews || "No reviews yet"}</p>
                  </div>
                </div>
              </div>
              </div>
            )}
            
            {!isCompleted && onComplete && (
              <div className="mt-4 flex justify-end">
                <Button 
                  onClick={() => onComplete(booking.id)}
                  className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700"
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Mark as Completed
                </Button>
              </div>
            )}
          </CardContent>
        </div>
      </Card>
    </motion.div>
  )
}

export default function TaskerOrdersPage() {
  const { data: session, status } = useSession()
  const [incompletedBookings, setIncompletedBookings] = useState<Booking[]>([])
  const [completedBookings, setCompletedBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const router = useRouter();

  useEffect(() => {
    const fetchBookingData = async () => {
      if (status === 'loading') {
        // If the session is still loading, wait for it to finish
        return;
      }

      if (status === 'authenticated' && session?.user?.email) {
        try {
          // Fetch booked history
          const response = await fetch(`/api/getMyOrders?email=${session.user.email}`);
          if (!response.ok) {
            throw new Error('Failed to fetch booking history');
          }
          const data = await response.json();
          setIncompletedBookings(data.filter((booking: Booking) => booking.status === 'incompleted'));
          setCompletedBookings(data.filter((booking: Booking) => booking.status === 'completed'));
        } catch (err) {
          setError((err as Error).message);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false); // If not authenticated, stop loading
        router.push("/tasker-sign-in"); // Redirect to the sign-in page
        toast({ title: "User Not Authenticated", description: "Please login to view orders.", variant: "destructive" });
      }
    };

    fetchBookingData();
  }, [status, session, router]); // Add router to the dependency array

  if (loading) {
    return <div className="flex justify-center items-center min-h-[200px]">
    <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
  </div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  const handleComplete = async (bookingId: number) => {
    try {
      const response = await fetch('/api/markBookingComplete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: bookingId }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Order has been marked as completed!",
          variant: "default",
          className:"bg-green-500 text-white border-2 border-green-500 rounded-md",
        })
        
        // Update local state
        const completedBooking = incompletedBookings.find(b => b.id === bookingId)
        if (completedBooking) {
          setIncompletedBookings(prev => prev.filter(b => b.id !== bookingId))
          setCompletedBookings(prev => [...prev, { ...completedBooking, status: 'completed' }])
        }
      } else {
        throw new Error('Failed to update booking status')
      }
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: "Failed to mark order as completed",
        variant: "destructive",
        className:"bg-red-500 text-white border-2 border-green-500 rounded-md",
      })
    }
  }

  const filterBookings = (bookings: Booking[]) => {
    return bookings.filter(booking => {
      const matchesSearch = 
        booking.contactPerson.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.userEmail.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesCategory = filterCategory === 'all' || booking.category.name === filterCategory

      return matchesSearch && matchesCategory
    })
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <Card key={i} className="w-full">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="h-6 bg-muted rounded w-1/4 animate-pulse" />
                  <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
                  <div className="h-4 bg-muted rounded w-1/2 animate-pulse" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card className="border-destructive">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-destructive">
              <XCircle className="h-5 w-5" />
              <p>{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const categories = Array.from(
    new Set([...incompletedBookings, ...completedBookings].map(b => b.category.name))
  )

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 md:p-6 space-y-6 md:space-y-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">My Orders</h1>
          <p className="text-sm md:text-base text-muted-foreground mt-2">Manage and track your service orders</p>
        </div>

        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by customer or service..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="incomplete" className="w-full">
          <TabsList className="w-full justify-start overflow-x-auto">
            <TabsTrigger value="incomplete" className="flex gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-400 data-[state=active]:to-orange-500 data-[state=active]:text-white">
              <AlertCircle className="h-4 w-4" />
              Upcoming
              {incompletedBookings.length > 0 && (
                <Badge variant="secondary" className="ml-2 bg-white/20 text-white">
                  {incompletedBookings.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="complete" className="flex gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-400 data-[state=active]:to-blue-500 data-[state=active]:text-white">
              <CheckCircle2 className="h-4 w-4" />
              Completed
              {completedBookings.length > 0 && (
                <Badge variant="secondary" className="ml-2 bg-white/20 text-white">
                  {completedBookings.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="incomplete" className="space-y-4 mt-4 md:mt-6">
            <AnimatePresence>
              {filterBookings(incompletedBookings).map((booking) => (
                <OrderCard
                  key={booking.id}
                  booking={booking}
                  onComplete={handleComplete}
                />
              ))}
              {filterBookings(incompletedBookings).length === 0 && (
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <CheckCircle2 className="h-6 w-6 text-primary" />
                      </div>
                      <p className="text-muted-foreground">No incomplete orders found</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </AnimatePresence>
          </TabsContent>
          
          <TabsContent value="complete" className="space-y-4 mt-4 md:mt-6">
            <AnimatePresence>
              {filterBookings(completedBookings).map((booking) => (
                <OrderCard
                  key={booking.id}
                  booking={booking}
                />
              ))}
              {filterBookings(completedBookings).length === 0 && (
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <CheckCircle2 className="h-6 w-6 text-primary" />
                      </div>
                      <p className="text-muted-foreground">No completed orders found</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </AnimatePresence>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}