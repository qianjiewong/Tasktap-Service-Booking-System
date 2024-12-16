'use client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, CheckCircle2, Clock, MapPin, User } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface Booking {
  captureId: string;
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


interface BookingHistoryListProps {
  bookingHistory: Booking[];
  refreshBookings: () => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'incompleted':
      return 'bg-purple-100 text-purple-600 hover:bg-purple-200';
    case 'completed':
      return 'bg-green-100 text-green-600 hover:bg-green-200';
    default:
      return 'bg-gray-100 text-gray-600 hover:bg-gray-200';
  }
};

// Helper function to check if the date is tomorrow
const isTomorrow = (date: string): boolean => {
  const today = new Date();
  const serviceDate = new Date(date);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  return (
    serviceDate.getDate() === tomorrow.getDate() &&
    serviceDate.getMonth() === tomorrow.getMonth() &&
    serviceDate.getFullYear() === tomorrow.getFullYear()
  );
};

async function cancelAndRefundBooking(bookingId: string, captureId: string) {
  try {
    const response = await fetch('/api/refundBooking', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ bookingId, captureId }),
    });

    if (response.ok) {
      toast({
        title: 'Success',
        description: 'Booking canceled and refund processed successfully!',
        variant: 'default',
        className: 'bg-blue-500 text-white border-2 border-blue-500 rounded-md',
      });
      return true;
    } else {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to cancel booking and process refund.');
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error canceling booking:', error);
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      console.error('Unknown error:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred.',
        variant: 'destructive',
      });
    }
    return false;
  }
}

function BookingHistoryList({ bookingHistory, refreshBookings }: BookingHistoryListProps) {
  const [loadingBookingId, setLoadingBookingId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState<{ id: string; captureId: string } | null>(null);

  const handleCancelBooking = (id: string, captureId: string, date: string) => {
    if (isTomorrow(date)) {
      toast({
        title: "Late Cancellation Not Allow",
        description: "Bookings cannot be cancelled if the service date is tomorrow.",
        variant: "destructive",
      });
      return;
    }
    setBookingToCancel({ id, captureId });
    setIsDialogOpen(true);
  };

  const confirmCancelBooking = async () => {
    if (bookingToCancel) {
      setLoadingBookingId(bookingToCancel.id);
      const isSuccess = await cancelAndRefundBooking(bookingToCancel.id, bookingToCancel.captureId);
      if (isSuccess) {
        refreshBookings();
      }
      setLoadingBookingId(null);
      setIsDialogOpen(false);
      setBookingToCancel(null);
    }
  };

  return (
    <TooltipProvider>
      <div className='grid grid-cols-1 gap-4'>
        {bookingHistory.length === 0 ? (
          <p className="text-center text-gray-500">No booking history available.</p>
        ) : (
          bookingHistory.map((booking) => {
            const serviceIsTomorrow = isTomorrow(booking.date);

            return (
              <Card key={booking.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    <div className="relative w-full md:w-[410px] aspect-video md:aspect-auto md:h-[300px]">
                      <img
                        src={booking.contactPerson.image[0]}
                        alt={booking.contactPerson.name}
                        className="w-full h-48 md:h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 p-4 md:p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <Badge className={getStatusColor(booking.status)}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </Badge>
                          <h3 className="text-lg md:text-xl font-semibold mt-2">{booking.contactPerson.name}</h3>
                        </div>
                      </div>
                      <div className="grid gap-2 mt-4">
                        <div className="flex items-center text-gray-600">
                          <User className="w-4 h-4 mr-2 flex-shrink-0" />
                          <span>{booking.contactPerson.contactPerson}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                          <span>{booking.contactPerson.address}</span>
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
                      {booking.status === 'incompleted' && (
                        <Button
                          size="sm"
                          variant="destructive"
                          className="w-full sm:w-auto mt-4"
                          onClick={() => handleCancelBooking(booking.id, booking.captureId, booking.date)}
                        >
                          {loadingBookingId === booking.id ? 'Cancelling...' : 'Cancel Booking'}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className='bg-slate-50'>
          <DialogHeader>
            <DialogTitle>Cancel Booking</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this booking? A refund will be issued.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              No, Keep Booking
            </Button>
            <Button variant="destructive" onClick={confirmCancelBooking}>
              Yes, Cancel Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );


}

export default BookingHistoryList;