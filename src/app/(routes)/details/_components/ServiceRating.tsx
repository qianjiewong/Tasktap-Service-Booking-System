'use client'

import React, { useEffect, useState, useCallback } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Star } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { useParams } from "next/navigation";

type Review = {
  name: string;
  rating: number;
  comment: string;
  date: string;
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`h-5 w-5 ${
            i < rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"
          }`}
        />
      ))}
    </div>
  );
}

export default function ServiceRating() {
  const params = useParams();
  const businessId = params?.businessId || "";
  const [reviews, setReviews] = useState<Review[]>([]);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000 })]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!businessId) return;

    const fetchReviews = async () => {
      try {
        const response = await fetch(`/api/getServiceRating?businessId=${businessId}`);
        const data = await response.json();
        setReviews(data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchReviews();
  }, [businessId]);

  useEffect(() => {
    if (!emblaApi) return;

    emblaApi.on("select", () => {
      setCurrent(emblaApi.selectedScrollSnap());
    });
  }, [emblaApi]);

  const onMouseEnter = useCallback(() => emblaApi?.plugins().autoplay.stop(), [emblaApi]);
  const onMouseLeave = useCallback(() => emblaApi?.plugins().autoplay.play(), [emblaApi]);

  return (
    <div className="w-full mx-auto px-4 py-2 sm:px-6 lg:px-6">
      <h2 className="text-1xl md:text-2xl font-bold mb-8 text-left">
        Customer Reviews
      </h2>

      {/* Conditional Rendering: If No Reviews */}
      {reviews.length === 0 ? (
        <p className="text-gray-500 text-center py-6 mb-20">
          No rating and review available.
        </p>
      ) : (
        <>
          {/* Carousel */}
          <div
            className="overflow-hidden"
            ref={emblaRef}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          >
            <div className="flex">
              {reviews.map((review, index) => (
                <div
                  key={index}
                  className="flex-[0_0_100%] sm:flex-[0_0_70%] lg:flex-[0_0_34%] min-w-0 px-3 pb-5"
                >
                  <Card className="h-full border border-gray-200 shadow-sm rounded-lg hover:shadow-md transition-all duration-300">
                    <CardContent className="p-6 sm:p-8">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-gray-800 text-lg">
                          {review.name}
                        </h3>
                        <StarRating rating={review.rating} />
                      </div>
                      <p className="text-gray-600 text-base leading-relaxed mb-4">
                        {review.comment}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination Buttons */}
          <div className="flex items-center justify-center gap-2 mt-6 mb-16">
            {reviews.slice(0, Math.min(reviews.length, 5)).map((_, index) => (
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
        </>
      )}
    </div>
  );
}