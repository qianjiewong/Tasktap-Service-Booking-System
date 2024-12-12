"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

type Business = {
  id: number;
  name: string;
  contactPerson: string;
  address: string;
  about: string;
  image: string[];
  category: {
    name: string;
  };
  bookings: number;
};

const BusinessList = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const response = await fetch('/api/businesses');
        if (!response.ok) {
          throw new Error('Failed to fetch businesses');
        }
        const data: Business[] = await response.json();
        setBusinesses(data);
      } catch (error) {
        setError((error as Error).message);
      }
    };

    fetchBusinesses();
  }, []);

  if (error) {
    return <div className="text-center p-4 text-red-500">Error: {error}</div>;
  }

  if (businesses.length === 0) {
    return <div className="text-center p-4">No businesses found.</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {businesses.map((business) => (
        business && business.name ? (
          <Link key={business.id} href={`/details/${business.id}`} passHref>
            <div className="p-4 md:p-6 border rounded-lg shadow-lg transition-transform transform 
            hover:scale-105 hover:shadow-violet-300 cursor-pointer duration-200">
              <img
                src={business.image[0]}
                alt={business.name}
                className="w-full h-100 object-cover rounded-md mb-4"
              />
              <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded">
                {business.category?.name || 'Unknown Category'}
              </span>
              <h3 className="text-xl md:text-2xl font-bold mt-2">{business.name}</h3>
              <p className="text-sm md:text-md text-primary">{business.contactPerson}</p>
              <p className="text-sm md:text-md text-gray-500 truncate">{business.address}</p>
              <Button className="mt-4 w-30 bg-violet-500 text-white px-4 py-2 rounded">Book Now</Button>
            </div>
          </Link>
        ) : null
      ))}
    </div>
  );
};

export default BusinessList;