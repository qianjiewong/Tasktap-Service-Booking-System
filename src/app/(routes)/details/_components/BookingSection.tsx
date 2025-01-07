"use client";
import React, { ReactNode, useEffect, useState } from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { Building, Mail, MapPin, Map   } from "lucide-react";
import MyComponent from "../../../_components/DropDownStateMenu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type TimeSlot = {
  time: string;
};

type BusinessInfo = {
  id: string;
  name: string;
  contactPerson: string;
  address: string;
  image: string[];
  category: {
    id: string;
    name: string;
  };
  email: string;
  price: string;
};

type BookingSectionProps = {
  children: ReactNode;
  business: BusinessInfo;
};

function BookingSection({ children, business }: BookingSectionProps) {
  const [date, setDate] = useState<Date | undefined>();
  const [timeSlot, setTimeSlot] = useState<TimeSlot[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | undefined>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);

  const [addressLine1, setAddressLine1] = useState<string>("");
  const [addressLine2, setAddressLine2] = useState<string>("");
  const [postcode, setPostcode] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [prefilling, setPrefilling] = useState<boolean>(true); 

  const { data: session, status } = useSession();
  const router = useRouter();

  const disablePastDates = (date: Date) => {
    return date < new Date();
  };

  // Redirect to sign-in if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      toast({
        title: "Access Required!",
        description: "Please log in to proceed with the booking.",
        variant: "destructive",
      });
      router.push("/sign-in");
    }
  }, [status, router]);

  // Generate time slots on component mount
  useEffect(() => {
    const generateTimeSlots = () => {
      const timeList: TimeSlot[] = [];
      for (let i = 10; i <= 11; i++) {
        timeList.push({ time: `${i}:00 AM` });
        timeList.push({ time: `${i}:30 AM` });
      }
      timeList.push({ time: `12:00 PM` }); 
      timeList.push({ time: `12:30 PM` });
      for (let i = 1; i <= 6; i++) {
        timeList.push({ time: `${i}:00 PM` });
        timeList.push({ time: `${i}:30 PM` });
      }
      setTimeSlot(timeList);
    };
    generateTimeSlots();
  }, []);

  const formatDateToYYYYMMDD = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Fetch booked slots whenever date is selected
  useEffect(() => {
    if (!date) return;
    const fetchBookedSlots = async () => {
      const formattedDate = formatDateToYYYYMMDD(date);
      try {
        const response = await fetch(
          `/api/getBookingsByDate?date=${formattedDate}&businessId=${business.id}`
        );
        if (response.ok) {
          const bookings = await response.json();
          const bookedTimes = bookings.map(
            (booking: { time: string }) => booking.time
          );
          setBookedSlots(bookedTimes);
        } else {
          throw new Error("Failed to fetch booked slots.");
        }
      } catch (error) {
        console.error("Error fetching booked slots:", error);
      }
    };
    fetchBookedSlots();
  }, [date]);

  useEffect(() => {
    const fetchUserAddress = async () => {
      if (status !== "authenticated" || !session?.user?.email) {
        console.warn("User is not authenticated or email is missing.");
        return;
      }

      try {
        const response = await fetch(`/api/userDetails`);
        if (!response.ok) {
          throw new Error(`Failed to fetch user details. Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("API Response:", data);

        const userAddress = data.address || "";
        console.log("Fetched User Address:", userAddress);

        if (!userAddress) {
          console.warn("No address found for the user.");
          return;
        }

        const addressParts = userAddress.split(",").map((part: string) => part.trim());
        const zipIndex = addressParts.findIndex((part: string) => /^\d{5}$/.test(part));
        if (zipIndex === -1) {
          throw new Error("Invalid address format. ZIP code not found.");
        }

        setAddressLine1(addressParts.slice(0, zipIndex - 1).join(", "));
        setAddressLine2(addressParts[zipIndex - 1]);
        setPostcode(addressParts[zipIndex]);
        setCity(addressParts[zipIndex + 1] || "");
        setState(addressParts[zipIndex + 2] || "");
      } catch (error) {
        console.error("Error fetching user address:", error);
      }
    };

    fetchUserAddress();
  }, [status, session]);
  
  // Save booking
  const saveBooking = async () => {
    if (!business || status !== "authenticated" || !session?.user?.email) {
      toast({
        title: "Error",
        description:
          "You must be logged in and have valid business information to make a booking.",
        variant: "destructive",
      });
      return;
    }

    if (!date || !selectedTime || !addressLine1 || !addressLine2|| !postcode || !city || !state) {
      toast({
        title: "Error",
        description: "Please select a date and time.",
        variant: "destructive",
      });
      return;
    }

    if (!/^\d{5}$/.test(postcode)) {
      toast({
        title: "Error",
        description: "Postcode must be a valid 5-digit Malaysian postcode.",
        variant: "destructive",
      });
      return;
    }

    const formattedAddress = `${addressLine1}, ${addressLine2}, ${postcode}, ${city}, ${state}`;

    setLoading(true);
    setError(null);

    try {
      const bookingData = {
        businessId: business.id,
        email: session.user.email,
        categoryId: business.category.id,
        selectedDate: formatDateToYYYYMMDD(date),
        selectedTime,
        status: "incompleted",
        location: formattedAddress,
        total: business.price,
      };

      router.push(`/checkout?businessId=${business.id}&total=${bookingData.total}&email=${session.user.email}&categoryId=${business.category.id}&selectedDate=${bookingData.selectedDate}&selectedTime=${selectedTime}&location=${formattedAddress}`);
      } catch (error: any) {
        setError(error.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
  };

  return (
    <div>
      <Sheet>
        <SheetTrigger asChild>{children}</SheetTrigger>
        <SheetContent className="overflow-auto bg-white text-gray-800 w-[800px] max-w-full">
          <SheetHeader>
            <SheetTitle>
              <h2 className="text-2xl font-bold text-black">Book a Service</h2>
            </SheetTitle>
            <SheetDescription>
              {error && <p className="text-red-500 font-semibold">{error}</p>}
              <p className="text-md text-gray-600 mb-4">Select Date and Time slot to book a service</p>
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-violet-600 mb-3">Select Date</h2>
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={disablePastDates}
                    className="rounded-lg border-2 border-violet-200 p-3 bg-white shadow-lg ml-4 mr-6"
                  />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-violet-600 mb-3">Select Time Slot</h2>
                  <div className="grid grid-cols-3 gap-3">
                    {timeSlot.map((item, index) => (
                      <Button
                        key={index}
                        className={`rounded-full px-4 py-2 transition-all duration-200 ${
                          selectedTime === item.time
                            ? "bg-violet-600 text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-violet-200"
                        } ${
                          bookedSlots.includes(item.time)
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                        onClick={() => {
                          if (!bookedSlots.includes(item.time)) {
                            setSelectedTime(item.time);
                          }
                        }}
                        disabled={bookedSlots.includes(item.time)}
                      >
                        {item.time}
                      </Button>
                    ))}
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-violet-600 mb-3">Address</h2>
                  <div className="space-y-4 bg-white p-4 rounded-lg shadow-md ">
                    <div>
                      <Label htmlFor="addressLine1" className="text-sm font-medium text-gray-700">Address Line 1</Label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <MapPin className="h-5 w-5 text-gray-400" />
                        </div>
                        <Input
                          type="text"
                          id="addressLine1"
                          placeholder="Enter Address Line 1"
                          value={addressLine1}
                          onChange={(e) => setAddressLine1(e.target.value)}
                          className="pl-10 block w-full border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500 text-zinc-800"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="addressLine2" className="text-sm font-medium text-gray-700">Address Line 2</Label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ">
                          <MapPin className="h-5 w-5 text-gray-400" />
                        </div>
                        <Input
                          type="text"
                          id="addressLine2"
                          placeholder="Enter Address Line 2"
                          value={addressLine2}
                          onChange={(e) => setAddressLine2(e.target.value)}
                          className="pl-10 block w-full border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500 text-zinc-800"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="postcode" className="text-sm font-medium text-gray-700">Postcode</Label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-gray-400" />
                          </div>
                          <Input
                            type="text"
                            id="postcode"
                            placeholder="Enter 5-digit Postcode"
                            value={postcode}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, "");
                              if (value.length <= 5) {
                                setPostcode(value);
                              }
                            }}
                            className="pl-10 block w-full border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500 text-zinc-800"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="city" className="text-sm font-medium text-gray-700">City</Label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Building className="h-5 w-5 text-gray-400" />
                          </div>
                          <Input
                            type="text"
                            id="city"
                            placeholder="Enter City"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className="pl-10 block w-full border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500 text-zinc-800"
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="state" className="text-sm font-medium text-gray-700">State</Label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        </div>
                        <MyComponent setState={setState} state={state} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SheetDescription>
          </SheetHeader>
          <SheetFooter className="mt-8">
            <div className="flex gap-4 w-full">
              <SheetClose asChild>
                <Button variant="outline" className="flex-1">Cancel</Button>
              </SheetClose>
              <Button
                onClick={async () => {
                  setLoading(true);
                  await new Promise((resolve) => setTimeout(resolve, 1000));
                  await saveBooking();
                }}
                disabled={
                  !date ||
                  !selectedTime ||
                  loading ||
                  !addressLine1 ||
                  !addressLine2 ||
                  !postcode ||
                  !city ||
                  !state ||
                  !/^\d{5}$/.test(postcode)
                }
                className="flex-1 bg-violet-600 hover:bg-violet-700 text-white"
              >
                {loading ? "Booking..." : "Book Now"}
              </Button>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default BookingSection;
