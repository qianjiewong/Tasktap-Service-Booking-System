// "use client"

// import React, { useEffect, useState } from "react"
// import { useSession } from "next-auth/react"
// import { Building2, Calendar, DollarSign, Star, TrendingUp } from 'lucide-react'
// import { Card, CardContent } from "@/components/ui/card"
// import Skeleton from 'react-loading-skeleton'
// import TaskerSignInForm from "@/app/_components/form/TaskerSignInForm"
// import Link from "next/link"

// import { Button } from "@/components/ui/button"
// import { BusinessCard } from "./_components/BusinessCard"

// interface BusinessData {
//   id: number;
//   name: string;
//   about: string;
//   address: string;
//   image: string[];
//   category?: {
//     name: string;
//   }
//   bookings: number;
//   price: number;
//   rating: number;
//   averageRating?: number;
//   businessStatus: string;
//   adminStatus: string;
// }

// const StatCard = ({ title, value, icon: Icon }: { title: string; value: string | number; icon: React.ElementType }) => (
//   <Card className="relative overflow-hidden">
//     <CardContent className="p-4 sm:p-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <p className="text-xs sm:text-sm font-medium text-muted-foreground">{title}</p>
//           <h3 className="text-lg sm:text-2xl font-bold mt-1">{value}</h3>
//         </div>
//         <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-purple-100 flex items-center justify-center">
//           <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
//         </div>
//       </div>
//     </CardContent>
//   </Card>
// )

// const EmptyBusinessState = () => (
//   <Card className="text-center p-4 sm:p-8">
//     <div className="flex flex-col items-center max-w-sm mx-auto">
//       <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-purple-100 flex items-center justify-center mb-4 sm:mb-6">
//         <Building2 className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
//       </div>
//       <h3 className="text-lg sm:text-xl font-semibold mb-2 mt-2">No businesses found</h3>
//       <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
//         Get started by creating your first business listing
//       </p>
//       <Link href="/taskerAddService">
//         <Button className="bg-violet-700 hover:bg-violet-800 w-full sm:w-auto">
//           Add Your First Business
//         </Button>
//       </Link>
//     </div>
//   </Card>
// )


// export default function TaskerDashboard() {
//   const { data: session, status } = useSession()
//   const [businesses, setBusinesses] = useState<BusinessData[]>([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)

//   const fetchBusinessData = async () => {
//     if (status === 'authenticated' && session?.user?.email) {
//       try {
//         const response = await fetch(`/api/getMyBusiness?userId=${session.user.email}`)
//         if (!response.ok) {
//           if (response.status === 404) {
//             setBusinesses([])
//             return
//           }
//           throw new Error('Failed to fetch business data')
//         }
//         const data = await response.json()
//         const updatedData = data.map((business: BusinessData) => ({
//           ...business,
//           image: Array.isArray(business.image) ? business.image : [],
//         }));
//         setBusinesses(updatedData)
//       } catch (err) {
//         setError((err as Error).message)
//       } finally {
//         setLoading(false)
//       }
//     } else {
//       setLoading(false)
//     }
//   }

//   // useEffect(() => {
//   //   fetchBusinessData()
//   // }, [status, session])

//   useEffect(() => {
//     if (status === 'loading') return;

//     if (status === 'authenticated' && session?.user?.email) {
//       fetchBusinessData();
//     } else if (status === 'unauthenticated') {
//       // Add a small delay before showing the sign-in form
//       const timer = setTimeout(() => {
//         setLoading(false);
//       }, 600);

//       return () => clearTimeout(timer);
//     }
//   }, [status, session])

//     if (status === 'loading' || loading) {
//     return (
//       <div className="container mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
//         <Skeleton className="h-6 sm:h-8 w-48 sm:w-64" />
//         <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
//           {[...Array(4)].map((_, i) => (
//             <Skeleton key={i} className="h-24 sm:h-32" />
//           ))}
//         </div>
//         <Skeleton className="h-[200px] sm:h-[300px]" />
//       </div>
//     )
//   }

//   if (error) {
//     return (
//       <div className="container mx-auto p-4 sm:p-6">
//         <Card className="bg-red-50 border-red-200">
//           <CardContent className="p-4 sm:p-6">
//             <p className="text-red-600 text-sm sm:text-base">{error}</p>
//           </CardContent>
//         </Card>
//       </div>
//     )
//   }

//   if (status === 'unauthenticated' && !loading) {
//     return <TaskerSignInForm />
//   }

//   const totalBookings = businesses.reduce((sum, business) => sum + (business.bookings || 0), 0)
//   const totalRevenue = businesses.reduce((sum, business) => sum + ((business.price || 0) * (business.bookings || 0)), 0)
  
//   const totalAverageRating = businesses.reduce((sum, business) => {
//     if (business.averageRating && business.averageRating > 0) {
//       return sum + business.averageRating;
//     }
//     return sum;
//   }, 0);

//   const ratedBusinessesCount = businesses.filter(
//     (business) => business.averageRating && business.averageRating > 0
//   ).length;
  
//   const finalaverageRating = ratedBusinessesCount > 0 
//     ? (totalAverageRating / ratedBusinessesCount).toFixed(1) 
//     : "0";

//   return (
//     <div className="container mx-auto px-4 py-6 sm:py-8">
//       <h1 className="text-2xl sm:text-3xl font-bold mb-2">
//         Welcome, {session?.user?.username || session?.user?.name}
//       </h1>
//       <p className="text-gray-500 mb-6 sm:mb-8 text-sm sm:text-base">
//         Manage your businesses and track performance
//       </p>
      
//       <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 sm:mb-8">
//         <StatCard
//           title="Total Bookings"
//           value={totalBookings || 0}
//           icon={Calendar}
//         />
//         <StatCard
//           title="Active Businesses"
//           value={businesses.length || 0}
//           icon={Building2}
//         />
//         <StatCard
//           title="Average Rating"
//           value={businesses.length ? `${finalaverageRating}/5` : "0"}
//           icon={Star}
//         />
//         <StatCard
//           title="Total Revenue"
//           value={`RM${totalRevenue || 0}`}
//           icon={TrendingUp}
//         />
//       </div>

//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-xl sm:text-2xl font-bold">My Businesses</h2>
//         <Link href="/taskerAddService">
//           <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105">
//             Add New Business
//           </Button>
//         </Link>
//       </div>

//       <div className="space-y-4 sm:space-y-6">
//         {businesses.length > 0 ? (
//           businesses.map((business) => (
//             <BusinessCard 
//               key={business.id} 
//               business={business} 
//               onBusinessUpdated={fetchBusinessData}
//             />
//           ))
//         ) : (
//           <EmptyBusinessState />
//         )}
//       </div>
//     </div>
//   )
// }

"use client"

import React, { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Building2, Calendar, DollarSign, Star, TrendingUp } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"
import Skeleton from 'react-loading-skeleton'
import TaskerSignInForm from "@/app/_components/form/TaskerSignInForm"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { BusinessCard } from "./_components/BusinessCard"
import { useAuthenticatedSession } from "../../../../pages/api/useAuthenticatedSession"

interface BusinessData {
  id: number;
  name: string;
  about: string;
  address: string;
  image: string[];
  category?: {
    name: string;
  }
  bookings: number;
  price: number;
  rating: number;
  averageRating?: number;
  businessStatus: string;
  adminStatus: string;
}

const StatCard = ({ title, value, icon: Icon }: { title: string; value: string | number; icon: React.ElementType }) => (
  <Card className="relative overflow-hidden">
    <CardContent className="p-4 sm:p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs sm:text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-lg sm:text-2xl font-bold mt-1">{value}</h3>
        </div>
        <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-purple-100 flex items-center justify-center">
          <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
        </div>
      </div>
    </CardContent>
  </Card>
)

const EmptyBusinessState = () => (
  <Card className="text-center p-4 sm:p-8">
    <div className="flex flex-col items-center max-w-sm mx-auto">
      <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-purple-100 flex items-center justify-center mb-4 sm:mb-6">
        <Building2 className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
      </div>
      <h3 className="text-lg sm:text-xl font-semibold mb-2 mt-2">No businesses found</h3>
      <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
        Get started by creating your first business listing
      </p>
      <Link href="/taskerAddService">
        <Button className="bg-violet-700 hover:bg-violet-800 w-full sm:w-auto">
          Add Your First Business
        </Button>
      </Link>
    </div>
  </Card>
)


export default function TaskerDashboard() {
  const { session, isAuthenticated } = useAuthenticatedSession()
  const [businesses, setBusinesses] = useState<BusinessData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchBusinessData = async () => {
    if (session?.user?.email) {
      try {
        const response = await fetch(`/api/getMyBusiness?userId=${session.user.email}`)
        if (!response.ok) {
          if (response.status === 404) {
            setBusinesses([])
            return
          }
          throw new Error('Failed to fetch business data')
        }
        const data = await response.json()
        const updatedData = data.map((business: BusinessData) => ({
          ...business,
          image: Array.isArray(business.image) ? business.image : [],
        }));
        setBusinesses(updatedData)
      } catch (err) {
        setError((err as Error).message)
      } finally {
        setLoading(false)
      }
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      fetchBusinessData()
    }
  }, [isAuthenticated])

  if (isAuthenticated === null || loading) {
    return (
      <div className="container mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
        <Skeleton className="h-6 sm:h-8 w-48 sm:w-64" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24 sm:h-32" />
          ))}
        </div>
        <Skeleton className="h-[200px] sm:h-[300px]" />
      </div>
    )
  }

  if (isAuthenticated === false) {
    return null // The user will be redirected to the sign-in page by the custom hook
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 sm:p-6">
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4 sm:p-6">
            <p className="text-red-600 text-sm sm:text-base">{error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const totalBookings = businesses.reduce((sum, business) => sum + (business.bookings || 0), 0)
  const totalRevenue = businesses.reduce((sum, business) => sum + ((business.price || 0) * (business.bookings || 0)), 0)
  
  const totalAverageRating = businesses.reduce((sum, business) => {
    if (business.averageRating && business.averageRating > 0) {
      return sum + business.averageRating;
    }
    return sum;
  }, 0);

  const ratedBusinessesCount = businesses.filter(
    (business) => business.averageRating && business.averageRating > 0
  ).length;
  
  const finalaverageRating = ratedBusinessesCount > 0 
    ? (totalAverageRating / ratedBusinessesCount).toFixed(1) 
    : "0";

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-2">
        Welcome, {session?.user?.username || session?.user?.name}
      </h1>
      <p className="text-gray-500 mb-6 sm:mb-8 text-sm sm:text-base">
        Manage your businesses and track performance
      </p>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 sm:mb-8">
        <StatCard
          title="Total Bookings"
          value={totalBookings || 0}
          icon={Calendar}
        />
        <StatCard
          title="Active Businesses"
          value={businesses.length || 0}
          icon={Building2}
        />
        <StatCard
          title="Average Rating"
          value={businesses.length ? `${finalaverageRating}/5` : "0"}
          icon={Star}
        />
        <StatCard
          title="Total Revenue"
          value={`RM${totalRevenue || 0}`}
          icon={TrendingUp}
        />
      </div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl sm:text-2xl font-bold">My Businesses</h2>
        <Link href="/taskerAddService">
          <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105">
            Add New Business
          </Button>
        </Link>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {businesses.length > 0 ? (
          businesses.map((business) => (
            <BusinessCard 
              key={business.id} 
              business={business} 
              onBusinessUpdated={fetchBusinessData}
            />
          ))
        ) : (
          <EmptyBusinessState />
        )}
      </div>
    </div>
  )
}