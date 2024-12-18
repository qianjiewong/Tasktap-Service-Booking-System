"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Loader2, Search, MapPin } from 'lucide-react';
import { useSession } from "next-auth/react";

type Business = {
  category: string;
  id: number;
  name: string;
  contactPerson: string;
  address: string;
  about: string;
  image: string[];
  bookings: number;
  distance: number;
};

type Category = {
  name: string;
};

export default function BusinessByCategory() {
  const { data: session } = useSession();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchAddress, setSearchAddress] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('searchAddress') || "";
    }
    return "";
  });
  const params = useParams();
  const router = useRouter();
  const categoryId = params?.category;

  const fetchNearbyBusinesses = async (latitude: number, longitude: number) => {
    try {
      const response = await fetch(
        `/api/fetchNearby?latitude=${latitude}&longitude=${longitude}&categoryId=${categoryId}&t=${Date.now()}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch nearby businesses");
      }
      const { businesses, category } = await response.json();
      setBusinesses(businesses);
      setCategory(category);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchAddress.trim()) {
      setError("Please enter a valid address.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const response = await fetch(
        `/api/geocodeAddress?address=${encodeURIComponent(searchAddress)}`
      );
      const data = await response.json();

      if (data.error) {
        setError(data.error);
        setLoading(false);
        return;
      }

      const { latitude, longitude } = data;
      await fetchNearbyBusinesses(latitude, longitude);
      localStorage.setItem('searchAddress', searchAddress);
    } catch (err) {
      setError("Address lookup failed. Please try again.");
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (searchAddress) {
        await handleSearch();
      } else {
        try {
          const position = await new Promise<GeolocationPosition>(
            (resolve, reject) =>
              navigator.geolocation.getCurrentPosition(resolve, reject)
          );
          const { latitude, longitude } = position.coords;
          await fetchNearbyBusinesses(latitude, longitude);
        } catch (err) {
          setError(
            "Unable to fetch your location. Please allow location access or enter an address."
          );
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [categoryId]);

  const handleUseCurrentLocation = async () => {
    setSearchAddress("");
    localStorage.removeItem('searchAddress');
    setLoading(true);
    try {
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) =>
          navigator.geolocation.getCurrentPosition(resolve, reject)
      );
      const { latitude, longitude } = position.coords;
      await fetchNearbyBusinesses(latitude, longitude);
    } catch (err) {
      setError(
        "Unable to fetch your location. Please allow location access or enter an address."
      );
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="top-0 z-10 bg-white border-b w-full">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 mb-6">
            <div className="relative flex-grow w-full sm:w-auto">
              <Input
                type="text"
                value={searchAddress}
                onChange={(e) => setSearchAddress(e.target.value)}
                placeholder="Enter an address..."
                className="w-full pl-12 pr-4 py-3 rounded-full border-gray-300 focus:border-violet-500 focus:ring-violet-500"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <div className="flex space-x-2 w-full sm:w-auto">
              <Button onClick={handleSearch} className="rounded-full bg-violet-600 hover:bg-violet-700 flex-grow sm:flex-grow-0">
                Search
              </Button>
              <Button onClick={handleUseCurrentLocation} variant="outline" className="rounded-full flex-grow sm:flex-grow-0">
                <MapPin className="w-5 h-5 mr-2 text-violet-600" />
                Use Current Location
              </Button>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
        </div>
      ) : error ? (
        <div className="text-red-500 p-4">{error}</div>
      ) : businesses.length === 0 ? (
        <div className="text-center p-8 text-gray-500">
          No businesses found nearby.
        </div>
      ) : (
        <>
          <h1 className="text-2xl font-extrabold px-4">
            {category ? category.name : "Nearby Businesses"}
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 px-4">
            {businesses.map((business) => (
              <Link key={business.id} href={`/details/${business.id}`}>
                <div className="group h-full p-4 border rounded-lg shadow-sm hover:shadow-lg transition-all duration-200 bg-white">
                  <div className="aspect-video w-full overflow-hidden rounded-md mb-4">
                    <img
                      src={business.image[0]}
                      alt={business.name}
                      className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                    />
                  </div>
                  <span className="inline-block bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    {business.category || "Uncategorized"}
                  </span>
                  <h3 className="text-lg font-bold mt-2 line-clamp-1">
                    {business.name}
                  </h3>
                  <p className="text-sm text-primary line-clamp-1">
                    {business.contactPerson}
                  </p>
                  <p className="text-sm text-gray-500 line-clamp-1 mb-4">
                    {business.address}
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    Distance: {business.distance.toFixed(2)} km
                  </p>
                  <Button className="mt-2 bg-violet-600 text-white px-4 py-2 rounded">
                    Book Now
                  </Button>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
