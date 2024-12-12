'use client'

import React, { useState } from 'react';
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Clock, Mail, MapPin, Share2, Star, User, X } from 'lucide-react'
import BookingSection from './BookingSection';
import { motion, AnimatePresence } from 'framer-motion';

type BusinessInfoProps = {
    description: string;
    galleryImages: string[];
    business: {
      id: string;
      name: string;
      contactPerson: string;
      address: string;
      image: string[];
      category: {
        id: string;
        name: string;
      };
      bookings: number;
      email: string;
      price: string;
      averageRating: string;
      totalRatings: string;
    };
  };

const ServiceDetails: React.FC<BusinessInfoProps> = ({ description, galleryImages, business }) => {
    const [selectedImage, setSelectedImage] = useState(0);
    const [lightboxOpen, setLightboxOpen] = useState(false);

    const openLightbox = (index: number) => {
      setSelectedImage(index);
      setLightboxOpen(true);
    };

    const closeLightbox = () => {
        setLightboxOpen(false);
    };

    const nextImage = () => {
        setSelectedImage((prev) => (prev + 1) % business.image.length);
    };

    const prevImage = () => {
        setSelectedImage((prev) => (prev - 1 + business.image.length) % business.image.length);
    };

    return (
        <div className="container mx-auto px-4 py-2">
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row gap-8 mb-8">
            <div className="lg:w-2/3">
              <div className="flex flex-col sm:flex-row items-start gap-4 mb-6">
                <div className="flex-1">
                  <h1 className="text-2xl sm:text-4xl font-bold mb-2">{business.name}</h1>
                    <Badge className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded mt-2">
                        {business.category?.name || 'Unknown Category'}
                    </Badge>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-gray-600 mt-4">
                    <div className="flex items-center gap-1">
                      <User className="w-5 h-5 text-violet-500" />
                      <span className='text-violet-500'>{business.contactPerson}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span>{business.averageRating} ({business.totalRatings} reviews)</span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="icon" className="mt-4 sm:mt-0">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
    
              {/* Gallery Section */}
             <div className="relative">
                <motion.img
                  src={business.image[selectedImage]}
                  alt={`${business.name} - Image ${selectedImage + 1}`}
                  className="w-full h-[450px] object-cover rounded-lg shadow-md"
                  onClick={() => openLightbox(selectedImage)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
                {/* Left Arrow */}
                <button
                  onClick={prevImage}
                  className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-gray-300 bg-opacity-30 text-white rounded-full p-2 hover:bg-opacity-70"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                {/* Right Arrow */}
                <button
                  onClick={nextImage}
                  className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-gray-300 bg-opacity-30 text-white rounded-full p-2 hover:bg-opacity-70"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
                {/* Thumbnail Images */}
                <div className="flex gap-2 overflow-x-auto py-2 mt-2">
                  {business.image.map((img, index) => (
                    <motion.img
                      key={index}
                      src={img}
                      alt={`Thumbnail ${index + 1}`}
                      onClick={() => setSelectedImage(index)}
                      className={`w-20 h-20 object-cover rounded-md cursor-pointer transition-all duration-200 ${
                        selectedImage === index
                          ? "border-2 border-violet-500 shadow-lg"
                          : "border border-gray-300 hover:border-violet-300"
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    />
                  ))}
                </div>
              </div>
            
            {/* Booking Card */}
            <Card className="lg:w-1/3">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="text-center">
                    <span className="text-2xl sm:text-3xl font-bold">RM {business.price}</span>
                    <span className="text-gray-500"> /service</span>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="w-5 h-5 flex-shrink-0 text-violet-500" />
                      <span className="text-md">Available 8:00 AM to 10:00 PM</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-5 h-5 flex-shrink-0 text-violet-500" />
                      <span className="text-md">{business.address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="w-5 h-5 flex-shrink-0 text-violet-500" />
                      <span className="text-md">{business.email}</span>
                    </div>
                  </div>
    
                  <BookingSection business={business}>
                    <Button className="w-full mt-2 bg-violet-700" size="lg">
                        <Calendar className="w-4 h-4 mr-2" />
                        Book Appointment
                    </Button>
                  </BookingSection>
                </div>
              </CardContent>
            </Card>
          </div>
    
          {/* Description Section */}
          <div className="mb-12 bg-white p-6 rounded-lg border">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800">About This Service</h2>
            <p className="text-gray-700 leading-relaxed text-base sm:text-md">
              {description}
            </p>
          </div>
          
          {/* Lightbox */}
          <AnimatePresence>
            {lightboxOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
                //onClick={closeLightbox}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4 text-white"
                  onClick={closeLightbox}
                >
                  <X className="h-6 w-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white"
                  onClick={prevImage}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-8 w-8">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white"
                  onClick={nextImage}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-8 w-8">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Button>
                <motion.img
                  key={selectedImage}
                  src={business.image[selectedImage]}
                  alt={`${business.name} - Image ${selectedImage + 1}`}
                  className="max-w-full max-h-full object-contain"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            )}
          </AnimatePresence>




        </div>
    )
};

export default ServiceDetails;