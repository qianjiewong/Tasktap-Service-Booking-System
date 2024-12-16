"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Building2, MapPin, FileText, ImageIcon, DollarSign, Loader2, CheckCircle2, Upload, X } from 'lucide-react';
import { useSession } from "next-auth/react";
import { toast } from "@/hooks/use-toast";
import { useEdgeStore } from "@/lib/edgestore";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import MyComponent from "@/app/_components/DropDownStateMenu";

interface UserAddress {
  split: any;
  addressLine1: string;
  addressLine2: string;
  postcode: string;
  city: string;
  state: string;
}

interface UserData {
  address?: UserAddress;
}

export default function AddService() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [showAuthDialog, setShowAuthDialog] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: "",
    addressLine1: "",
    addressLine2: "",
    postcode: "",
    city: "",
    state: "",
    about: "",
    categoryId: "",
    price: "",
    images: [] as File[],
  });
  const { edgestore } = useEdgeStore();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState<number[]>([]);

  // React.useEffect(() => {
  //   const fetchUserAddress = async () => {
  //     if (!session?.user?.email) {
  //       console.warn("User is not authenticated or email is missing.");
  //       return;
  //     }
    
  //     try {
  //       const response = await fetch(`/api/userDetails?email=${session.user.email}`);
  //       if (!response.ok) {
  //         throw new Error(`Failed to fetch user details. Status: ${response.status}`);
  //       }
    
  //       const data: UserData = await response.json();
  //       console.log("API Response:", data);
    
  //       const fullAddress = data.address || "";
  //       console.log("Fetched Address:", fullAddress);
    
  //       if (!fullAddress) {
  //         console.warn("No address found for the user.");
  //         return;
  //       }
    
  //       // Split and parse the address
  //       const addressParts = fullAddress
  //         .split(",")
  //         .map((part: string) => part.trim());
  //       console.log("Parsed Address Parts:", addressParts);
    
  //       // Ensure all components exist and set them in the formData state
  //       setFormData((prev) => ({
  //         ...prev,
  //         addressLine1: `${addressParts[0]}, ${addressParts[1]}` || "",
  //         addressLine2: addressParts[2] || "",
  //         postcode: addressParts[3] || "",
  //         city: addressParts[4] || "",
  //         state: addressParts[5] || "",
  //       }));
  //     } catch (error) {
  //       console.error("Error fetching user address:", error);
  //     }
  //   };

  //   fetchUserAddress();
  // }, [session]);

  React.useEffect(() => {
    const fetchUserAddress = async () => {
      if (!session?.user?.email) {
        console.warn("User is not authenticated or email is missing.");
        return;
      }
  
      try {
        const response = await fetch(`/api/userDetails?email=${session.user.email}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch user details. Status: ${response.status}`);
        }
  
        const data: UserData = await response.json();
        console.log("API Response:", data);
  
        const fullAddress = data.address;
        if (!fullAddress) {
          console.warn("No address found for the user.");
          return;
        }
  
        console.log("Fetched Address:", fullAddress);
  
        // Handle fullAddress as a string
        let addressString = "";
        if (typeof fullAddress === "string") {
          addressString = fullAddress;
        } else if (typeof fullAddress === "object") {
          // Handle if `fullAddress` is an object
          addressString = [
            fullAddress.addressLine1,
            fullAddress.addressLine2,
            fullAddress.postcode,
            fullAddress.city,
            fullAddress.state,
          ]
            .filter((part) => part && part.trim() !== "") // Filter out empty or undefined parts
            .join(", ");
        }
  
        console.log("Address String:", addressString);
  
        // Split the address string into parts
        const addressParts = addressString.split(",").map((part) => part.trim());
        console.log("Address Parts:", addressParts);
  
        // Find the ZIP code index
        const zipIndex = addressParts.findIndex((part) => /^\d{5}$/.test(part));
        if (zipIndex === -1) {
          throw new Error("Invalid address format. ZIP code not found.");
        }
  
        // Ensure valid parsing and set formData
        setFormData((prev) => ({
          ...prev,
          addressLine1: addressParts.slice(0, zipIndex - 1).join(", "), // Combine all parts before ZIP - 1
          addressLine2: addressParts[zipIndex - 1] || "", // Part just before ZIP
          postcode: addressParts[zipIndex] || "", // ZIP code
          city: addressParts[zipIndex + 1] || "", // City (next part after ZIP)
          state: addressParts[zipIndex + 2] || "", // State (next part after City)
        }));
      } catch (error) {
        console.error("Error fetching address:", error);
      }
    };
  
    fetchUserAddress();
  }, [session]);


  React.useEffect(() => {
    if (!session) setShowAuthDialog(true);
  }, [session]);

  React.useEffect(() => {
    const fields = Object.entries(formData);
    const filledFields = fields.filter(([key, value]) => value && value !== "").length;
    setProgress((filledFields / fields.length) * 100);
  }, [formData]);


  React.useEffect(() => {
    const totalFields = 9; // Total number of required fields
    let filledFields = 0;

    // Check each field for meaningful values
    if (formData.name.trim() !== "") filledFields++;
    if (formData.categoryId !== "") filledFields++;
    if (formData.price.trim() !== "") filledFields++;
    if (formData.about.trim() !== "") filledFields++;
    if (formData.addressLine1.trim() !== "") filledFields++;
    if (formData.city.trim() !== "") filledFields++;
    if (formData.postcode.trim() !== "") filledFields++;
    if (formData.state !== "") filledFields++;
    if (formData.images.length > 0) filledFields++;

    // Calculate progress percentage
    const progressValue = (filledFields / totalFields) * 100;

    // Set progress value
    setProgress(progressValue > 0 ? progressValue : 0);
  }, [formData]);

  const handleInputChange = (field: string, value: string | File[] | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // const handleImageClick = () => {
  //   fileInputRef.current?.click();
  // };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files) {
      const files = Array.from(e.dataTransfer.files);
      handleImageUpload(files);
    }
  };

  const handleImageUpload = (files: File[]) => {
    const newImages = [...formData.images, ...files].slice(0, 5); // Limit to 5 images
    setFormData(prev => ({ ...prev, images: newImages }));
    setUploadProgress(new Array(newImages.length).fill(0));
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    setUploadProgress(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const postcodeRegex = /^\d{5}$/;
      if (!postcodeRegex.test(formData.postcode)) {
        throw new Error("Invalid postcode. Please enter a valid 5-digit Malaysia postcode.");
      }

      if (formData.images.length === 0) {
        throw new Error("Please upload at least one image");
      }

      const uploadPromises = formData.images.map((image, index) => {
        return edgestore.myPublicImages.upload({
          file: image,
          onProgressChange: (progress) => {
            setUploadProgress(prev => {
              const newProgress = [...prev];
              newProgress[index] = progress;
              return newProgress;
            });
          },
        });
      });

      
      const uploadResults = await Promise.all(uploadPromises);
      const imageUrls = uploadResults.map((result) => result.url);


      const { addressLine1, addressLine2, city, state, postcode } = formData;
      const email = session?.user?.email;

      if (!email) {
        throw new Error("User email is required to update the address.");
      }

      // Update user address
      const updateAddressResponse = await fetch("/api/updateUserAddress", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          addressLine1,
          addressLine2,
          zip: postcode, // Assuming `zip` in your API corresponds to `postcode`
          city,
          state,
        }),
      });

      if (!updateAddressResponse.ok) {
        const errorData = await updateAddressResponse.json();
        throw new Error(errorData.error || "Failed to update user address.");
      }


      const response = await fetch("/api/addService", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          contactPerson: session?.user?.username || session?.user?.name,
          address: {
            addressLine1: formData.addressLine1,
            addressLine2: formData.addressLine2,
            postcode: formData.postcode,
            city: formData.city,
            state: formData.state,
          },
          about: formData.about,
          categoryId: formData.categoryId,
          email: session?.user?.email || "",
          price: parseFloat(formData.price),
          images: imageUrls,
        }),
      });

      if (!response.ok) throw new Error("Failed to create business");

      toast({
        title: "Success!",
        description: "Your business has been successfully created. It is under pending to be approve now.",
        variant: "default",
        className: "bg-green-500 text-white border-green-600",
      });

      setFormData({
        name: "",
        addressLine1: "",
        addressLine2: "",
        postcode: "",
        city: "",
        state: "",
        about: "",
        categoryId: "",
        price: "",
        images: [] as File[],
      });
      setUploadProgress([]);

      router.push('/taskerAddService');
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create business",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!session) {
    return (
      <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Authentication Required</DialogTitle>
            <DialogDescription>
              You need to be signed in to add a new service.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => router.push('/tasker-sign-in')}>Sign In</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Add New Service</h1>
          <p className="text-gray-500 mt-2">Create your business profile and start receiving orders</p>
          <Progress value={progress} className="h-1.5 mt-4" />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Business Information */}
            <div className="space-y-6 border rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="w-5 h-5 text-violet-500" />
                <h2 className="font-semibold text-gray-900">Business Information</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Business Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter your business name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    onValueChange={(value) => handleInputChange("categoryId", value)}
                    value={formData.categoryId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Cleaning Services</SelectItem>
                      <SelectItem value="2">Handyman Services</SelectItem>
                      <SelectItem value="3">Event Planning</SelectItem>
                      <SelectItem value="4">Personal Services</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="price">Price (RM)</Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="Enter your service price"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="about">About</Label>
                  <Textarea
                    id="about"
                    placeholder="Tell us about your business..."
                    value={formData.about}
                    onChange={(e) => handleInputChange("about", e.target.value)}
                    className="min-h-[120px] resize-none"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              {/* Location Details */}
              <div className="border rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-5 h-5 text-violet-500" />
                  <h2 className="font-semibold text-gray-900">Location Details</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="addressLine1">Address Line 1</Label>
                    <Input
                      id="addressLine1"
                      placeholder="e.g. 14, Jalan Jalil 5"
                      value={formData.addressLine1}
                      onChange={(e) => handleInputChange("addressLine1", e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="addressLine2">Address Line 2</Label>
                    <Input
                      id="addressLine2"
                      placeholder="e.g. Jalil PSN"
                      value={formData.addressLine2}
                      onChange={(e) => handleInputChange("addressLine2", e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        placeholder="e.g. Bukit Jalil"
                        value={formData.city}
                        onChange={(e) => handleInputChange("city", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="postcode">Postcode</Label>
                      <Input
                        id="postcode"
                        placeholder="e.g. 57000"
                        value={formData.postcode}
                        onChange={(e) => handleInputChange("postcode", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="state">State</Label>
                    <MyComponent 
                      setState={(value: string) => handleInputChange("state", value)} 
                      state={formData.state}
                    />
                  </div>
                </div>
              </div>

              {/* Business Image Upload Section */}
              <div className="border rounded-lg p-6 bg-gray-50">
                <div className="flex items-center gap-2 mb-4">
                  <ImageIcon className="w-5 h-5 text-violet-500" />
                  <h2 className="font-semibold text-gray-900">Business Images</h2>
                </div>

                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-lg p-8 cursor-pointer transition-colors ${
                    dragOver ? 'border-violet-500 bg-violet-50' : 'border-gray-300 hover:border-violet-500'
                  }`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleImageUpload(Array.from(e.target.files || []))}
                  />
                  <div className="flex flex-col items-center gap-3 text-gray-500">
                    <Upload className="w-12 h-12 text-violet-500" />
                    <p className="text-sm text-center font-medium">
                      Click to upload or drag and drop your business images
                    </p>
                    <p className="text-xs text-gray-400">
                      PNG, JPG up to 10MB (Max 5 images)
                    </p>
                  </div>
                </div>

                {formData.images.length > 0 && (
                  <div className="mt-6 space-y-4">
                    <Label className="text-sm font-medium text-gray-700">Uploaded Images</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {formData.images.map((file, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Uploaded ${index + 1}`}
                            className="w-full h-32 object-cover rounded-md"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleRemoveImage(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          {uploadProgress[index] > 0 && uploadProgress[index] < 100 && (
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-violet-200">
                              <div
                                className="h-full bg-violet-500 transition-all duration-300 ease-in-out"
                                style={{ width: `${uploadProgress[index]}%` }}
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 max-w-md mx-auto">
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white py-6 rounded-lg text-lg font-semibold transition-all duration-300"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Creating your business...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  Create Business
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}