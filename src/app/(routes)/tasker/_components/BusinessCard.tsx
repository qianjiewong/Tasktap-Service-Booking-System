"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { DollarSign, Edit3, MapPin, Star, Users } from 'lucide-react'
import { BusinessEditDialog } from "./BusinessEditDialog"

interface BusinessData {
  id: number
  name: string
  about: string
  address: string
  image: string[]
  category?: {
    name: string
  }
  bookings: number
  price: number
  rating: number
  averageRating?: number
  businessStatus: string
  adminStatus: string
}

interface BusinessCardProps {
  business: BusinessData
  onBusinessUpdated: () => void
}

export function BusinessCard({ business, onBusinessUpdated }: BusinessCardProps) {
  const [showEditDialog, setShowEditDialog] = useState(false)

  return (
    <>
      <Card className="overflow-hidden">
        <div className="flex flex-col sm:flex-row">
          <div className="relative w-full sm:w-72 h-48 sm:h-56 bg-gray-100 border border-gray-300 rounded-sm overflow-hidden flex items-center justify-center">
            <img
              src={business.image[0] || "/placeholder.svg"}
              alt={business.name}
              className="w-full h-full object-cover"
              style={{
                width: "100%", // Ensure the image takes up the full width of its container
                height: "100%", // Ensure the image takes up the full height of its container
                objectFit: "cover", // Crop or expand the image to cover the container without distorting
              }}
            />
            <Badge className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-purple-100 text-purple-800">
              {business.category?.name}
            </Badge>
          </div>
          <div className="flex-1 p-4 sm:p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold mb-2">{business.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge
                    variant={business.businessStatus === 'active' ? 'default' : 'destructive'}
                    className="text-xs sm:text-xs font-normal mt-2 mb-2"
                  >
                    {business.businessStatus}
                  </Badge>
                  <Badge
                    variant={business.adminStatus === 'approved' ? 'default' : 'destructive'}
                    className="text-xs sm:text-xs font-normal mt-2 mb-2"
                  >
                    {business.adminStatus}
                  </Badge>
                </div>
                <p className="flex items-center text-muted-foreground mt-2 text-sm sm:text-base">
                  <MapPin className="w-4 h-4 mr-1" />
                  {business.address}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowEditDialog(true)}
                >
                  <Edit3 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            {/* <p className="text-muted-foreground mt-4 text-sm sm:text-base">
              {business.about}
            </p> */}
            <div className="grid grid-cols-3 gap-4 sm:gap-6 mt-4 sm:mt-6">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <Users className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Bookings
                  </p>
                  <p className="font-semibold text-sm sm:text-base">
                    {business.bookings}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Price
                  </p>
                  <p className="font-semibold text-sm sm:text-base">
                    RM{business.price}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                  <Star className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Overall Rating
                  </p>
                  <p className="font-semibold text-sm sm:text-base">
                    {business.averageRating
                      ? business.averageRating.toFixed(1)
                      : "0"}
                    /5
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <BusinessEditDialog
        business={business}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        onBusinessUpdated={onBusinessUpdated}
      />
    </>
  )
}