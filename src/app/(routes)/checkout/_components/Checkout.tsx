"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { CheckCircle, CheckCircleIcon, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Suspense } from "react";

const Checkout = () => {
  const searchParams = useSearchParams();
  const businessId = searchParams?.get("businessId") || "";
  const total = parseFloat(searchParams?.get("total") || "0");
  const email = searchParams?.get("email") || "";
  const categoryId = searchParams?.get("categoryId") || "";
  const selectedDate = searchParams?.get("selectedDate") || "";
  const selectedTime = searchParams?.get("selectedTime") || "";
  const location = searchParams?.get("location") || "";

  const router = useRouter();

  const parseLocation = (location: string | null) => {
    if (!location) return { addressLine1: "", addressLine2: "", zip: "", city: "", state: "" };
    
    // Split location by commas and trim each part
    const parts = location.split(",").map((part) => part.trim());
  
    return {
      addressLine1: parts.slice(0, 2).join(", ") || "", // First part is Address Line 1
      addressLine2: parts[2] || "",
      zip: parts[3]?.match(/\d{5}/)?.[0] || "", // Extract 5-digit ZIP code
      city: parts[4] || "", // Third part is the city
      state: parts[5] || "", // Fourth part is the state
    };
  };

  const locationParam = searchParams?.get("location") || null; // Ensures the value is string or null
  const parsedLocation = parseLocation(locationParam);
  
  const [billingDetails, setBillingDetails] = useState({
    name: "",
    email: "",
    phone: "",
    addressLine1: parsedLocation.addressLine1,
    addressLine2: parsedLocation.addressLine2,
    zip: parsedLocation.zip,
    city: parsedLocation.city,
    state: parsedLocation.state,
  });
  


  const [cart, setCart] = useState({
    items: [{ name: "Service", price: total }],
    subtotal: total,
    tax: 0.06,
    total: total * 1.06,
  });

  const [businessName, setBusinessName] = useState<string>("");
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [showPaypalButton, setShowPaypalButton] = useState(true);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch business details to get the service name
  const fetchBusinessDetails = async () => {
    try {
      const response = await fetch(`/api/getBusinessDetails?businessId=${businessId}`);
      if (response.ok) {
        const data = await response.json();
        setBusinessName(data.name); // Update the service name
        setCart((prevCart) => ({
          ...prevCart,
          items: [{ name: data.name, price: total }], // Update the item name in the cart
        }));
      } else {
        throw new Error("Failed to fetch business details");
      }
    } catch (error) {
      console.error("Error fetching business details:", error);
    }
  };

  const fetchUserDetails = async () => {
    try {
      const response = await fetch("/api/userDetails"); // Replace with your API route
      if (response.ok) {
        const userData = await response.json();
        setBillingDetails((prevDetails) => ({
          ...prevDetails,
          name: userData.username || "",
          email: userData.email || "",
          phone: userData.phone || "",
        }));
      } else {
        throw new Error("Failed to fetch user details");
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const addPayalScript = () => {
    if (window.paypal) {
      setScriptLoaded(true);
      setLoading(false); 
      return;
    }
    const script = document.createElement("script");
    script.src = "https://www.paypal.com/sdk/js?client-id=Aa0UdlWw06CH8UsVh61BIsbbmf3ippSsyVir6QUW5jxiQgovziHo-tfMIhDVJYc0upChriQE3MK3wHRP&currency=MYR&locale=en_US";
    script.type = "text/javascript";
    script.async = true;
    script.onload = () => {
        setScriptLoaded(true);
        setLoading(false);
    }
    document.body.appendChild(script);
  };

  const validateFields = () => {
    const validPostcode = /^\d{5}$/.test(billingDetails.zip);
    const allFieldsFilled = Object.values(billingDetails).every((value) => value.trim() !== "");
    setShowPaypalButton(allFieldsFilled && validPostcode);
  };

  useEffect(() => {
    addPayalScript();
    fetchUserDetails();
    fetchBusinessDetails();
    validateFields();
  }, []);

  useEffect(() => {
    validateFields(); // Validate fields whenever billing details change
  }, [billingDetails]);

  const handlePaymentSuccess = async (details: any) => {
    console.log("Payment success:", details);

    const captureId = details?.purchase_units[0]?.payments?.captures[0]?.id;
    if (!captureId) throw new Error("Capture ID not found.");
    

    const bookingData = {
        businessId: businessId,
        email: email,
        categoryId: categoryId ,
        selectedDate: selectedDate,
        selectedTime: selectedTime,
        status: "incompleted",
        location: location,
        total: total,
        captureId: captureId,
      };

      console.log(bookingData)
    
    //Update the business bookings count after a successful booking
    const updateBusinessBookings = async (businessId: string) => {
        console.log("Updating bookings for businessId:", businessId); 
        try {
        const response = await fetch("/api/updateBusinessBookings", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({ businessId }),
        });

        if (!response.ok) {
            throw new Error("Failed to update business bookings");
        }
        } catch (error) {
        console.error("Error updating bookings count:", error);
        }
    };

    //Update User Address
    const updateUserAddress = async () => {
      const { email, addressLine1, addressLine2, city, state, zip } = billingDetails;

      console.log("Updating address with:", {
        email,
        addressLine1,
        addressLine2,
        city,
        state,
        zip,
      });
    
      if (!email || !addressLine1 || !addressLine2 || !city || !state || !zip) {
        toast({
          title: "Error",
          description: "Please ensure all address fields are filled.",
          variant: "destructive",
        });
        return;
      }
    
      try {
        const response = await fetch("/api/updateUserAddress", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            addressLine1,
            addressLine2,
            zip,
            city,
            state,
          }),
        });
    
        if (response.ok) {
          console.log("Address Update: Successful")
        } else {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to update address.");
        }
      } catch (error) {
        console.error("Error updating address:", error);
        console.log("Address Update: Failed")
      }
    };

      try {
        const response = await fetch("/api/booking", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bookingData),
        });
  
        if (response.ok) {
          toast({
            title: "Success",
            description: "Booking completed successfully!",
            variant: "default",
            className: "bg-green-500 text-white border-2 border-green-500 rounded-md",
          });

          await updateBusinessBookings(businessId);
          await updateUserAddress();

          setPaymentSuccess(true);
          setShowPaypalButton(false);

        //   router.push("/");  // Redirect to the homepage after successful booking
        } else {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to save booking.");
        }
      } catch (error) {
        console.error("Error saving booking:", error);
        toast({
          title: "Error",
          description: "There was an issue processing your booking.",
          variant: "destructive",
        });
      }  

    console.log("Saving billing details:", billingDetails);
  };



  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedDetails = {
      ...billingDetails,
      [e.target.name]: e.target.value,
    };
    setBillingDetails(updatedDetails);

    // Enable PayPal button if all fields are filled
    const validPostcode = /^\d{5}$/.test(updatedDetails.zip);
    const allFieldsFilled = Object.values(updatedDetails).every((value) => value.trim() !== "");
    setShowPaypalButton(allFieldsFilled && validPostcode);
  };

  const handleContinueBrowsing = () => {
    router.push("/");
  };

  const handleDialogClose = () => {
    router.push("/");
  };

  if (!scriptLoaded) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
      </div>)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
              <p className="ml-4 text-xl font-semibold text-gray-700">Preparing your checkout...</p>
          </div>
        ) : (
          <div className="space-y-8">
            <h1 className="text-4xl font-bold text-center text-gray-800 mb-2">Checkout</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="bg-white shadow-lg rounded-lg overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-purple-500 to-violet-600 text-white p-6">
                  <CardTitle className="text-2xl font-semibold">Billing Details</CardTitle>
                  <CardDescription className="text-violet-100">Please fill in all fields to proceed with payment</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-medium text-gray-700">Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={billingDetails.name}
                        onChange={handleChange}
                        placeholder="Full Name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-violet-500 focus:border-violet-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={billingDetails.email}
                        onChange={handleChange}
                        placeholder="email@example.com"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-violet-500 focus:border-violet-500"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={billingDetails.phone}
                      onChange={handleChange}
                      placeholder="Phone Number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-violet-500 focus:border-violet-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-sm font-medium text-gray-700">Address Line 1</Label>
                    <Input
                      id="addressLine1"
                      name="address"
                      value={billingDetails.addressLine1}
                      onChange={handleChange}
                      placeholder="Street Address"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-violet-500 focus:border-violet-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-sm font-medium text-gray-700">Address Line 2</Label>
                    <Input
                      id="addressLine2"
                      name="address"
                      value={billingDetails.addressLine2}
                      onChange={handleChange}
                      placeholder="Street Address"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-violet-500 focus:border-violet-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-sm font-medium text-gray-700">City</Label>
                      <Input
                        id="city"
                        name="city"
                        value={billingDetails.city}
                        onChange={handleChange}
                        placeholder="City"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-violet-500 focus:border-violet-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state" className="text-sm font-medium text-gray-700">State</Label>
                      <Input
                        id="state"
                        name="state"
                        value={billingDetails.state}
                        onChange={handleChange}
                        placeholder="State"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-violet-500 focus:border-violet-500"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zip" className="text-sm font-medium text-gray-700">ZIP Code</Label>
                    <Input
                      id="zip"
                      name="zip"
                      value={billingDetails.zip}
                      onChange={handleChange}
                      placeholder="ZIP / Postal Code eg.30020"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-violet-500 focus:border-violet-500"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-lg rounded-lg overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white p-6">
                  <CardTitle className="text-2xl font-semibold">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  {cart.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm text-gray-600">
                      {/* <span>{item.name}</span> */}
                      <span>Service: {businessName}</span>
                      <span className="font-medium">RM{item.price.toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Subtotal:</span>
                      <span className="font-medium">RM{cart.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600 mt-2">
                      <span>Tax (6%):</span>
                      <span className="font-medium">RM{(cart.subtotal * cart.tax).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-semibold text-gray-800 mt-4">
                      <span>Total:</span>
                      <span>RM{cart.total.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-gray-50 p-6">
                  {cart.total > 0 && scriptLoaded && showPaypalButton && (
                    <div className="w-full">
                      <PayPalScriptProvider options={{ "clientId": "Aa0UdlWw06CH8UsVh61BIsbbmf3ippSsyVir6QUW5jxiQgovziHo-tfMIhDVJYc0upChriQE3MK3wHRP", currency: "MYR" }}>
                        <PayPalButtons
                          style={{ layout: "vertical", height: 48 }}
                          createOrder={(data, actions) => {
                            if (!showPaypalButton) {
                              return Promise.reject();
                            }
                            return actions.order.create({
                              purchase_units: [
                                {
                                  amount: {
                                    value: cart.total.toFixed(2),
                                    currency_code: "MYR",
                                  },
                                },
                              ],
                              intent: "CAPTURE",
                            });
                          }}
                          onInit={(data, actions) => {
                            if (!showPaypalButton) {
                              actions.disable();
                            } else {
                              actions.enable();
                            }
                          }}
                          onApprove={(data, actions) => {
                            if (actions.order) {
                              return actions.order
                                .capture()
                                .then((details) => {
                                  handlePaymentSuccess(details);
                                })
                                .catch((err) => {
                                  console.error("PayPal Error: ", err);
                                });
                            } else {
                              console.error("Order action is undefined");
                              return Promise.resolve();
                            }
                          }}
                          onError={(err) => {
                            console.error("PayPal Error: ", err);
                            return Promise.resolve();
                          }}
                          disabled={!showPaypalButton}
                        />
                      </PayPalScriptProvider>
                    </div>
                  )}
                  {!showPaypalButton && (
                    <p className="text-sm text-center text-gray-500 w-full">Please fill in all billing details to proceed with payment</p>
                  )}
                </CardFooter>
              </Card>
            </div>
          </div>
        )}
      </div>

      {paymentSuccess && (
        <Dialog open={paymentSuccess} onOpenChange={(open) => open || handleDialogClose()}>
          <DialogContent className="sm:max-w-[425px] bg-white rounded-2xl shadow-2xl">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center text-center px-4 pt-6"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <div className="rounded-full bg-green-100 p-3 mb-4">
                  <CheckCircle className="w-12 h-12 text-green-500" />
                </div>
              </motion.div>

              <DialogHeader className="space-y-4">
                <DialogTitle className="text-2xl font-bold text-gray-900 ml-14">
                  Payment Successful!
                </DialogTitle>
                <DialogDescription className="text-gray-600 text-base ml-2">
                  Thank you for your payment. Your transaction has been processed successfully.
                </DialogDescription>
              </DialogHeader>
            </motion.div>

            <DialogFooter className="px-6 pb-6 pt-2">
              <Button
                onClick={handleContinueBrowsing}
                className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-6 rounded-xl text-lg transition-all duration-200 ease-in-out hover:shadow-lg"
              >
                Continue Browsing
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Checkout;