'use client'
import React, { useEffect, useState } from 'react';
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from 'lucide-react';
import { useParams } from "next/navigation";

// Define Review type
type Review = {
  name: string;
  rating: number;
  comment: string;
  date: string;
};

// StarRating component to display star ratings
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className={`h-5 w-5 ${i < rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}`} />
      ))}
    </div>
  );
}

export default function ServiceDetails() {
  const params = useParams();
  const businessId = params?.businessId || "";
  const [reviews, setReviews] = useState<Review[]>([]); // Ensuring reviews are always an array


  // Fetch reviews from API
  useEffect(() => {
    if (!businessId) return;

    const fetchReviews = async () => {
        try {
            const response = await fetch(`/api/getServiceRating?businessId=${businessId}`);
            const data = await response.json();
            setReviews(data);
            console.log(data);
          } catch (error) {
            console.error('Error fetching reviews:', error);
          }
        };
        
        fetchReviews();
      }, [businessId]);

  return (
    <div className='container mx-auto px-6 py-4 mb-8'>
      {/* Reviews Section */}
      <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {reviews.length > 0 ? (
          reviews.map((review, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold">{review.name}</h3>
                  </div>
                  <div className="flex gap-1">
                    <StarRating rating={review.rating} />
                  </div>
                </div>
                <p className="text-gray-600">{review.comment}</p>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-gray-600">No reviews available at the moment.</p> // Fallback message when there are no reviews
        )}
      </div>
    </div>
  );
}
