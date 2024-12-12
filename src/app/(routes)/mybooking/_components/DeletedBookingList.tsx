'use client';
import { Calendar, Trash2, Clock, MapPin, User } from 'lucide-react';
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

interface Booking {
  id: string;
  status: string;
  contactPerson: {
    name: string;
    contactPerson: string;
    address: string;
    image?: string; // Optional image URL
    price?: string;
  };
  date: string;
  time: string;
  price?: number | null; // Allow for null or missing prices
  deletedAt?: string | null; // Timestamp of when it was deleted
}

interface DeletedBookingListProps {
  deletedBookings: Booking[];
}

const getStatusColor = () => 'bg-red-100 text-red-600 hover:bg-red-200';

function DeletedBookingList({ deletedBookings }: DeletedBookingListProps) {
  return (
    <div className="grid grid-cols-1 gap-4">
      {deletedBookings.length === 0 ? (
        <p className="text-center text-gray-500 py-4">No deleted bookings available.</p>
      ) : (
        deletedBookings.map((booking,index) => (
          <Card
            key={index}
            className="overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row">
                {/* Image Section */}
                <div className="relative w-full md:w-[410px] aspect-video md:aspect-auto md:h-[300px]">
                    <img
                        src={booking.contactPerson.image}
                        alt={booking.contactPerson.name}
                        className="w-full h-48 md:h-full object-cover"
                        />
                </div>

                {/* Details Section */}
                <div className="flex-1 p-4 md:p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <Badge className={getStatusColor()}>
                        <Trash2 className="w-4 h-4 mr-1" />
                        Cancelled
                      </Badge>
                      <h3 className="text-lg md:text-xl font-semibold mt-2">
                        {booking.contactPerson.name}
                      </h3>
                    </div>
                  </div>

                  {/* Details Grid */}
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

                  <div className="mt-4">
                    {/* <p className="text-lg font-semibold text-gray-900 mt-2">
                      RM {booking.contactPerson.price !== undefined && booking.contactPerson.price !== null ? booking.contactPerson.price : 'N/A'}
                    </p> */}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}

export default DeletedBookingList;
