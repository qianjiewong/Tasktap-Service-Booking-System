'use client'

import * as React from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star } from 'lucide-react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'

type Review = {
  name: string
  rating: number
  review: string
  serviceType: string
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 md:h-5 md:w-5 ${
            i < rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"
          }`}
        />
      ))}
    </div>
  )
}

export default function ReviewCarousel() {
  const [reviews, setReviews] = React.useState<Review[]>([])
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay()])
  const [current, setCurrent] = React.useState(0)

  React.useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch('/api/getReview')
        const data = await response.json()
        setReviews(data)
      } catch (error) {
        console.error('Failed to fetch reviews:', error)
        setReviews([
          {
            name: "Jenny Wilson",
            rating: 5,
            review: "Great Service!",
            serviceType: "Event Planning"
          },
          {
            name: "Jennie Ruby",
            rating: 5,
            review: "Jenny did a great job helping us to clean our house. She was patient and she completed the task so quickly. Thank you Jenny!",
            serviceType: "Cleaning"
          },
          {
            name: "Jennie Ruby",
            rating: 5,
            review: "The cleaning service by Jenny is very good and professional. She keeps our house clean all the time and I will definitely book the service from her again!",
            serviceType: "Cleaning"
          }
        ])
      }
    }

    fetchReviews()
  }, [])

  React.useEffect(() => {
    if (!emblaApi) return

    emblaApi.on("select", () => {
      setCurrent(emblaApi.selectedScrollSnap())
    })
  }, [emblaApi])

  const onMouseEnter = React.useCallback(() => {
    if (emblaApi) emblaApi.plugins().autoplay.stop()
  }, [emblaApi])

  const onMouseLeave = React.useCallback(() => {
    if (emblaApi) emblaApi.plugins().autoplay.play()
  }, [emblaApi])

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 md:py-16 mt-8 md:mt-12">
      <h1 className="text-2xl md:text-4xl font-bold mb-6 md:mb-8 text-center">
        See what our {" "} 
        <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
           happy customers say about Tasktap
        </span>
      </h1>
      
      <div 
        className="overflow-hidden" 
        ref={emblaRef}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <div className="flex">
          {reviews.map((review, index) => (
            <div key={index} className="flex-[0_0_100%] min-w-0 pl-4 md:flex-[0_0_50%] lg:flex-[0_0_33.333%] pb-8">
              <Card className="border-0 shadow-lg rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl h-full flex flex-col mt-2">
                <CardContent className="p-4 md:p-6 flex-grow">
                  <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-lg md:text-xl text-gray-800">{review.name}</h3>
                      <StarRating rating={review.rating} />
                    </div>
                    <p className="text-gray-600 text-sm md:text-md leading-relaxed flex-grow">
                      {review.review}
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="px-4 md:px-6 pb-4 md:pb-6 pt-0 mt-auto">
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    {review.serviceType}
                  </Badge>
                </CardFooter>
              </Card>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex items-center justify-center gap-2 mt-6 md:mt-8">
        {reviews.map((_, index) => (
          <button
            key={index}
            className={`h-2 w-2 rounded-full transition-colors duration-300 ${
              current === index ? "bg-purple-600" : "bg-gray-300"
            }`}
            onClick={() => emblaApi?.scrollTo(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}