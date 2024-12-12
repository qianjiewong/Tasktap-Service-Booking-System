"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; 
import ServiceDetails from "../_components/ServiceDetails";
import ServiceRating from "../_components/ServiceRating";
import { Loader2 } from "lucide-react";

type Business = {
  id: number; // Adjust based on your API response
  name: string;
  contactPerson: string;
  address: string;
  about: string;
  image: string[];
  category: {
    id: number; // Adjust based on your API response
    name: string;
  };
  bookings: number;
  email: string;
  price: string;
  averageRating: string;
  totalRatings: string;
};


const BusinessDetails = () => {
  const params = useParams();
  const businessId = params?.businessId || ""; // Get businessId from dynamic route
  const [business, setBusiness] = useState<Business | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // To show a loading state

  useEffect(() => {
    const fetchBusinessDetails = async () => {
      try {
        const response = await fetch(
          `/api/businessDetails?businessId=${businessId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch business details");
        }
        const data: Business = await response.json();
        setBusiness(data);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    if (businessId) {
      fetchBusinessDetails();
    }
  }, [businessId]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-[200px]">
              <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
          </div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!business) {
    return <div>No business found.</div>;
  }

  // Log to see what business data is being passed
  console.log("Fetched Business:", business);

  return (
    <div className="p-6 ">
      {/* Use BusinessInfo component
      <BusinessInfo business={business} /> */}

      {/* Use BusinessDescription component */}
      {/* <BusinessDescription
        description={business.about}
        galleryImages={[business.image]} // You can add more images if needed
        business={{
          id: business.id.toString(), // Ensure this is a string if BusinessDescription expects a string
          name: business.name,
          contactPerson: business.contactPerson,
          address: business.address,
          image: business.image,
          category: {
            id: business.category.id.toString(), // Ensure this is a string
            name: business.category.name,
          },
          email: business.email,
          price: business.price,
        }}
      /> */}
  
      <div className="mt-4 hidden md:block"></div> 

        <ServiceDetails 
          description={business.about}
          galleryImages={business.image} // You can add more images if needed
          business={{
            id: business.id.toString(), // Ensure this is a string if BusinessDescription expects a string
            name: business.name,
            contactPerson: business.contactPerson,
            address: business.address,
            image: business.image,
            category: {
              id: business.category.id.toString(), // Ensure this is a string
              name: business.category.name,
            },
            email: business.email,
            price: business.price,
            averageRating:business.averageRating,
            bookings: business.bookings,
            totalRatings: business.totalRatings,

          }}
        />
        <ServiceRating />

    </div>
    
  );
};

export default BusinessDetails;
