'use client';
import { Calendar, CheckCircle2, Clock, MapPin, MessageCircle, MoreVertical, Star, User } from 'lucide-react';
import React, { useState } from 'react';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogOverlay, DialogTitle } from "@/components/ui/dialog"
import { StarRating } from './StarRating';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AnimatePresence, motion } from 'framer-motion';
import { Textarea } from "@/components/ui/textarea";

interface Booking {
  status: any;
  rating: any;
  contactPerson: any; // Adjust this type based on your actual data structure
  id: string;
  businessList: {
    name: string;
    contactPerson: string;
    address: string;
    images?: { url: string }[]; // Optional
  };
  date: string;
  time: string;
}

interface StarRatingProps {
  rating: number;
  onChange: (newRating: number) => void; // Function to handle rating change
  review: string; // Add review as a prop
  onReviewChange: (newReview: string) => void; // Function to handle review change
}


interface CompletedBookingListProps {
  completedBookings: Booking[]; // Use the Booking type
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'incompleted':
      return 'bg-purple-100 text-purple-600 hover:bg-purple-200'
    case 'completed':
      return 'bg-green-100 text-green-600 hover:bg-green-200'
    default:
      return 'bg-gray-100 text-gray-600 hover:bg-gray-200'
  }
}

function CompletedBookingList({ completedBookings }: CompletedBookingListProps) {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [rating, setRating] = useState(0); // State to hold rating value
  const [ratingSubmitted, setRatingSubmitted] = useState<boolean>(false);
  const [review, setReview] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0)

  const getRatingLabel = (rating: number) => {
    switch (rating) {
      case 1:
        return "Poor"
      case 2:
        return "Fair"
      case 3:
        return "Good"
      case 4:
        return "Very Good"
      case 5:
        return "Excellent"
      default:
        return "Rate your experience"
    }
  }


  const handleRateService = (booking: Booking) => {
    setSelectedBooking(booking);
    setOpenDialog(true); // Open dialog on button click
    setRating(0); 
    setReview('');
    setHoveredRating(0);
    
  };

  const handleSubmitRating = async () => {
    if (!selectedBooking) return;
  
    try {
      const response = await fetch('/api/saveRating', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId: selectedBooking.id, // Use the ID of the selected booking
          rating: rating, // The rating value submitted by the user
          review: review,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to submit rating');
      }
  
      const data = await response.json();
      console.log('Rating submitted successfully:', data);
  
      // Show toast message or handle success
      toast({ 
        title: "Success", 
        description: "Rating and review submitted successfully!",
        variant: "default",
        className:
          "bg-green-500 text-white border-2 border-green-500 rounded-md",
      
      });
      
      setOpenDialog(false);
      setRating(0); // Reset the rating
      setReview('');
      setRatingSubmitted(true);
      window.location.reload();
    } catch (error) {
      console.error('Error submitting rating:', error);
      toast({ title: "Error", description: "Failed to submit rating.", variant: "destructive" });
    }
  };

  return (
    <div className='grid grid-cols-1 gap-4'>
      {completedBookings.length === 0 ? (
        <p className="text-center text-gray-500 py-4">No completed bookings available.</p>
      ) : (
        completedBookings.map((booking, index) => (
          <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row">
                <div className="relative w-full md:w-[410px] aspect-video md:aspect-auto md:h-[300px]">
                  <img
                    src={booking.contactPerson.image}
                    alt={booking.contactPerson.name}
                    className="w-full h-48 md:h-full object-cover"
                  />
                </div>
                <div className="flex-1 p-4 md:p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <Badge className={getStatusColor(booking.status)}>
                        {booking.status === 'completed' && <CheckCircle2 className="w-4 h-4 mr-1" />}
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </Badge>
                      <h3 className="text-lg md:text-xl font-semibold mt-2">{booking.contactPerson.name}</h3>
                    </div>
                    <Button variant="ghost" size="icon" className="hidden md:flex">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid gap-2 mt-4">
                    <div className="flex items-center text-gray-600">
                      <User className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="line-clamp-1">{booking.contactPerson.contactPerson}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="line-clamp-1">{booking.contactPerson.address}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span>Service on: {booking.date}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span>Time: {booking.time}</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button 
                      size="sm"
                      className={`w-full sm:w-auto ${
                        booking.rating ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-violet-600 hover:bg-violet-700 text-white'
                      }`}
                      onClick={() => handleRateService(booking)}
                      disabled={booking.rating > 0 || ratingSubmitted} 
                    >
                      {booking.rating > 0 || ratingSubmitted ? 'Done Rating' : 'Rate Service'}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogOverlay className="fixed inset-0 bg-black bg-opacity-50" />
        <DialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 sm:p-6 rounded-lg shadow-lg w-[90vw] max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl font-bold text-center">Rate & Review</DialogTitle>
            <DialogDescription className="text-center mt-1 text-sm sm:text-base">
              Rate and review your experience to help us improve!
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 sm:py-6">
            <div className="flex flex-col items-center gap-4 mb-4 sm:mb-6">
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.button
                    key={star}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`w-6 h-6 sm:w-8 sm:h-8 transition-colors duration-200 ${
                        star <= (hoveredRating || rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  </motion.button>
                ))}
              </div>
              <AnimatePresence mode="wait">
                <motion.span
                  key={hoveredRating || rating}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-sm sm:text-md font-medium text-gray-600"
                >
                  {getRatingLabel(hoveredRating || rating)}
                </motion.span>
              </AnimatePresence>
            </div>

            <div className="space-y-2">
              <label htmlFor="review" className="text-sm font-medium text-gray-600">
                Your Review
              </label>
              <Textarea
                id="review"
                placeholder="Tell us about your experience..."
                value={review}
                onChange={(e) => setReview(e.target.value)}
                className="min-h-[100px] sm:min-h-[120px]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              onClick={handleSubmitRating}
              disabled={rating === 0 || review === ''}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700"
            >
              Submit Review
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CompletedBookingList;
