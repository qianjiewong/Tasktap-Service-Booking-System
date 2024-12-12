'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'
import { Dialog, DialogOverlay, DialogContent } from '@radix-ui/react-dialog'
import { useSession } from 'next-auth/react' // Example session hook

type Business = {
  id: number
  name: string
  contactPerson: string
  address: string
  about: string
  image: string
  bookings: number
}

type Category = {
  name: string
}

export default function BusinessByCategory() {
  const { data: session } = useSession() // Use session data to determine user status
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [category, setCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [zipCode, setZipCode] = useState<string>(() => (typeof window !== 'undefined' ? localStorage.getItem('zipCode') || '' : ''))
  const [filteredBusinesses, setFilteredBusinesses] = useState<Business[]>([])
  //const [isDialogOpen, setIsDialogOpen] = useState<boolean>(() => session && !localStorage.getItem('zipCode'))
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(() => !!session && !localStorage.getItem('zipCode')) // Ensure the result is always boolean
  const params = useParams()
  const categoryId = params?.category

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        if (!categoryId) return
        const response = await fetch(`/api/businessByCategory?categoryId=${categoryId}`)
        if (!response.ok) {
          throw new Error('Failed to fetch businesses')
        }
        const { businesses, category } = await response.json()
        setBusinesses(businesses)
        setCategory(category)
      } catch (error) {
        setError((error as Error).message)
      } finally {
        setLoading(false)
      }
    }

    fetchBusinesses()
  }, [categoryId])

  useEffect(() => {
    if (zipCode.length >= 2) {
      const prefix = zipCode.slice(0, 2)
      setFilteredBusinesses(
        businesses.filter((business) => business.address.includes(prefix))
      )
    } else {
      setFilteredBusinesses(businesses)
    }
  }, [zipCode, businesses])

  // Handle session changes
  useEffect(() => {
    if (!session) {
      // User is logged out or not logged in
      localStorage.removeItem('zipCode') // Clear zip code from localStorage
      setZipCode('') // Reset the zip code state
      setIsDialogOpen(false) // Close the dialog
    } else if (!localStorage.getItem('zipCode')) {
      // User is logged in but hasn't entered a zip code
      setIsDialogOpen(true)
    }
  }, [session])

  const handleZipCodeSubmit = () => {
    if (zipCode.length !== 5 || isNaN(Number(zipCode))) {
      alert('Please enter a valid 5-digit zip code.')
    } else {
      localStorage.setItem('zipCode', zipCode) // Save zip code in local storage
      setIsDialogOpen(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
      </div>
    )
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>
  }

  if (businesses.length === 0) {
    return (
      <div className="text-center p-8 text-gray-500">
        No businesses found for this category.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {session && (
        <Dialog open={isDialogOpen}>
          <DialogOverlay className="fixed inset-0 bg-black bg-opacity-50" />
          <DialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-bold mb-2">Enter Your Zip Code</h2>
            <p className="mb-4 text-gray-600">
              Please provide your 5-digit zip code to help us show relevant services near you.
            </p>
            <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
              Zip Code
            </label>
            <input
              id="zipCode"
              type="text"
              maxLength={5}
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              className="border rounded p-2 w-full mt-1 mb-4"
              placeholder="Enter 5-digit zip code"
            />
            <Button
              onClick={handleZipCodeSubmit}
              className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
            >
              Submit
            </Button>
          </DialogContent>
        </Dialog>
      )}

      <h1 className="text-2xl font-extrabold">{category?.name}</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {filteredBusinesses.map((business) => (
          <Link key={business.id} href={`/details/${business.id}`}>
            <div className="group h-full p-4 border rounded-lg shadow-sm hover:shadow-lg transition-all duration-200 bg-white">
              <div className="aspect-video w-full overflow-hidden rounded-md mb-4">
                <img
                  src={business.image[0]}
                  alt={business.name}
                  className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                />
              </div>
              <span className="inline-block bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded">
                {category?.name}
              </span>
              <h3 className="text-lg font-bold mt-2 line-clamp-1">{business.name}</h3>
              <p className="text-sm text-primary line-clamp-1">{business.contactPerson}</p>
              <p className="text-sm text-gray-500 line-clamp-1 mb-4">{business.address}</p>
              <Button className="wmt-4 w-30 bg-violet-500 text-white px-4 py-2 rounded">
                Book Now
              </Button>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
