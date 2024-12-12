"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  Building2,
  DollarSign,
  Calendar,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  Users,
  Star,
  BarChart3,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Business {
  id: number;
  name: string;
  about: string;
  address: string[];
  image: string;
  email: string;
  category?: {
    name: string;
  };
  bookings: number;
  price: number;
  rating: number;
  averageRating?: number;
  businessStatus: string;
  adminStatus: string;
  contactPerson: string;
}

interface Stats {
  totalRevenue: number;
  totalBusinesses: number;
  totalBookings: number;
  revenueGrowth: number;
  bookingsGrowth: number;
  businessGrowth: number;
}

const StatCard = ({
  title,
  value,
  icon: Icon,
  growth,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  growth?: number;
}) => (
  <Card className="bg-white hover:shadow-lg transition-all duration-300">
  <CardContent className="p-6">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-violet-100 p-3">
          <Icon className="h-6 w-6 text-violet-600" />
        </div>
        <h3 className="text-3xl font-bold">{value}</h3>
      </div>
      {growth !== undefined && (
        <div
          className={`flex items-center gap-1 text-sm ${
            growth >= 0 ? "text-green-600" : "text-red-600"
          }`}
        >
          {growth >= 0 ? (
            <ArrowUpRight className="h-4 w-4" />
          ) : (
            <ArrowDownRight className="h-4 w-4" />
          )}
          <span>{Math.abs(growth)}%</span>
        </div>
      )}
    </div>
    <div className="mt-2">
      <p className="text-sm text-muted-foreground ml-16">{title}</p>
    </div>
  </CardContent>
</Card>
);

export default function AdminDashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<Stats>({
    totalRevenue: 0,
    totalBusinesses: 0,
    totalBookings: 0,
    revenueGrowth: 0,
    bookingsGrowth: 0,
    businessGrowth: 0,
  });
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(
    null
  );
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isStatsLoading, setIsStatsLoading] = useState(false);
  const [isBusinessesLoading, setIsBusinessesLoading] = useState(false);


  //fetch business
  useEffect(() => {
    const fetchBusinesses = async () => {
      setIsBusinessesLoading(true);
      try {
        const response = await fetch("/api/admin/businesses");
        if (!response.ok) {
          throw new Error("Failed to fetch businesses");
        }

        const data = await response.json();
        setBusinesses(data);
      } catch (error) {
        console.error("Error fetching businesses:", error);
        toast({
          title: "Error",
          description: "Unable to fetch businesses",
          variant: "destructive",
        });
      } finally {
        setIsBusinessesLoading(false);
      }
    };

    fetchBusinesses();
  }, []);

  //fetch stats
  useEffect(() => {
    const fetchStats = async () => {
      setIsStatsLoading(true);
      try {
        const response = await fetch("/api/admin/stats");
        if (!response.ok) {
          throw new Error("Failed to fetch stats");
        }
  
        const data = await response.json();
        const {
          totalBusinesses,
          currentMonthRevenue,
          previousMonthRevenue,
          currentMonthBookings,
          previousMonthBookings,
        } = data;
  
        const revenueGrowth =
          previousMonthRevenue > 0
            ? ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100
            : currentMonthRevenue > 0
            ? 100
            : 0;
  
        const bookingsGrowth =
          previousMonthBookings > 0
            ? ((currentMonthBookings - previousMonthBookings) / previousMonthBookings) * 100
            : currentMonthBookings > 0
            ? 100
            : 0;
  
        setStats({
          totalBusinesses,
          totalRevenue: currentMonthRevenue,
          totalBookings: currentMonthBookings,
          revenueGrowth: Math.round(revenueGrowth),
          bookingsGrowth: Math.round(bookingsGrowth),
          businessGrowth: 0, // Placeholder if you have logic for business growth
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
        toast({
          title: "Error",
          description: "Unable to fetch statistics",
          variant: "destructive",
        });
      } finally {
        setIsStatsLoading(false);
      }
    };
  
    fetchStats();
  }, []);
  
  //Approve business, update approval status
  const handleApprove = async (businessId: number) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/admin/approveBusiness/${businessId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ adminStatus: "approved" }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Business has been approved!",
          className:
            "bg-green-500 text-white border-2 border-green-500 rounded-md",
        });

        setBusinesses(
          businesses.map((business) =>
            business.id === businessId
              ? { ...business, adminStatus: "approved" }
              : business
          )
        );
        setShowDetailsDialog(false);
      } else {
        throw new Error("Failed to approve business");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve business",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const viewBusinessDetails = (business: Business) => {
    setSelectedBusiness(business);
    setShowDetailsDialog(true);
  };

  const tabStyles = {
    list: "bg-gradient-to-r from-violet-500 to-purple-500 p-1 rounded-lg text-white",
    trigger:
      "data-[state=active]:bg-white data-[state=active]:text-violet-700 data-[state=active]:shadow-sm rounded-md px-6 transition-all",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-br from-violet-600 via-violet-500 to-purple-500">
        <div className="relative container mx-auto px-4 py-16">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Welcome back, {session?.user?.name}
              </h1>
              <p className="text-violet-100 text-lg mt-4">
                Monitor your platform's performance and manage business listings
                from your dashboard.
              </p>
            </div>
            <div className="hidden md:block">
              <BarChart3 className="h-24 w-24 text-violet-200 opacity-50" />
            </div>
          </div>
          {/* Stats Grid */}
          <div className="absolute bottom-0 left-0 right-0 transform translate-y-1/2">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                  title="Total Businesses"
                  value={stats.totalBusinesses}
                  icon={Building2}
                  growth={stats.businessGrowth}
                />
                <StatCard
                  title="Monthly Bookings"
                  value={stats.totalBookings}
                  icon={Calendar}
                  growth={stats.bookingsGrowth}
                />
                <StatCard
                  title="Total Monthly Revenue"
                  value={`RM${stats.totalRevenue.toFixed(2)}`}
                  icon={DollarSign}
                  growth={stats.revenueGrowth}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 pt-24">
        {/* Business Listings */}
        <Tabs defaultValue="all" className="space-y-6 mt-4">
          <div className="flex items-center justify-between">
            <TabsList className={tabStyles.list}>
              <TabsTrigger className={tabStyles.trigger} value="all">
                All Businesses
              </TabsTrigger>
              <TabsTrigger className={tabStyles.trigger} value="not approved">
                Pending Approval
              </TabsTrigger>
              <TabsTrigger className={tabStyles.trigger} value="approved">
                Approved
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="all" className="space-y-4">
            <Card>
              <ScrollArea className="h-[600px]">
                <div className="p-6 space-y-6">
                  {businesses.map((business) => (
                    <Card
                      key={business.id}
                      className="p-6 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="flex items-center gap-6">
                        <div className="w-48 h-32 flex-shrink-0 overflow-hidden rounded-lg">
                          <img
                            src={business.image[0]}
                            alt={business.name}
                            className="w-full h-full object-cover transition-transform duration-200 hover:scale-110"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="text-lg font-semibold">
                              {business.name}
                            </h3>
                            <Badge
                              variant={
                                business.businessStatus === "active"
                                  ? "default"
                                  : "secondary"
                              }
                              className="capitalize"
                            >
                              {business.businessStatus}
                            </Badge>
                            <Badge
                              variant={
                                business.adminStatus === "approved"
                                  ? "default"
                                  : "destructive"
                              }
                              className={`capitalize ${
                                business.adminStatus === "approved"
                                  ? "bg-green-100 text-green-700 hover:bg-green-200"
                                  : ""
                              }`}
                            >
                              {business.adminStatus}
                            </Badge>
                            {business.rating && (
                              <div className="flex items-center gap-1 text-yellow-500">
                                <Star className="h-4 w-4 fill-current" />
                                <span className="text-sm font-medium">
                                  {business.rating.toFixed(1)}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-muted-foreground">
                                Contact Person
                              </p>
                              <p className="text-sm font-medium">
                                {business.contactPerson}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">
                                Email
                              </p>
                              <p className="text-sm font-medium">
                                {business.email}
                              </p>
                            </div>
                          </div>
                        </div>

                        <Button
                          variant="outline"
                          onClick={() => viewBusinessDetails(business)}
                          className="flex-shrink-0 hover:bg-violet-50"
                        >
                          View Details
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </Card>
          </TabsContent>

          <TabsContent value="not approved">
            <Card>
              <ScrollArea className="h-[600px]">
                <div className="p-6 space-y-6">
                  {businesses
                    .filter((b) => b.adminStatus === "not approved")
                    .map((business) => (
                      // Same business card component as above
                      <Card
                        key={business.id}
                        className="p-6 hover:shadow-lg transition-all duration-300"
                      >
                        {/* Business card content */}
                        <div className="flex items-center gap-6">
                          <div className="w-48 h-32 flex-shrink-0 overflow-hidden rounded-lg">
                            <img
                              src={business.image[0]}
                              alt={business.name}
                              className="w-full h-full object-cover transition-transform duration-200 hover:scale-110"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <h3 className="text-lg font-semibold">
                                {business.name}
                              </h3>
                              <Badge
                                variant={
                                  business.businessStatus === "active"
                                    ? "default"
                                    : "secondary"
                                }
                                className="capitalize"
                              >
                                {business.businessStatus}
                              </Badge>
                              <Badge
                                variant={
                                  business.adminStatus === "approved"
                                    ? "default"
                                    : "destructive"
                                }
                                className={`capitalize ${
                                  business.adminStatus === "approved"
                                    ? "bg-green-100 text-green-700 hover:bg-green-200"
                                    : ""
                                }`}
                              >
                                {business.adminStatus}
                              </Badge>
                              {business.rating && (
                                <div className="flex items-center gap-1 text-yellow-500">
                                  <Star className="h-4 w-4 fill-current" />
                                  <span className="text-sm font-medium">
                                    {business.rating.toFixed(1)}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm text-muted-foreground">
                                  Contact Person
                                </p>
                                <p className="text-sm font-medium">
                                  {business.contactPerson}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">
                                  Email
                                </p>
                                <p className="text-sm font-medium">
                                  {business.email}
                                </p>
                              </div>
                            </div>
                          </div>

                          <Button
                            variant="outline"
                            onClick={() => viewBusinessDetails(business)}
                            className="flex-shrink-0 hover:bg-violet-50"
                          >
                            View Details
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </Card>
                    ))}
                </div>
              </ScrollArea>
            </Card>
          </TabsContent>
          <TabsContent value="approved">
            <Card>
              <ScrollArea className="h-[600px]">
                <div className="p-6 space-y-6">
                  {businesses
                    .filter((b) => b.adminStatus === "approved")
                    .map((business) => (
                      // Same business card component as above
                      <Card
                        key={business.id}
                        className="p-6 hover:shadow-lg transition-all duration-300"
                      >
                        {/* Business card content */}
                        <div className="flex items-center gap-6">
                          <div className="w-48 h-32 flex-shrink-0 overflow-hidden rounded-lg">
                            <img
                              src={business.image[0]}
                              alt={business.name}
                              className="w-full h-full object-cover transition-transform duration-200 hover:scale-110"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <h3 className="text-lg font-semibold">
                                {business.name}
                              </h3>
                              <Badge
                                variant={
                                  business.businessStatus === "active"
                                    ? "default"
                                    : "secondary"
                                }
                                className="capitalize"
                              >
                                {business.businessStatus}
                              </Badge>
                              <Badge
                                variant={
                                  business.adminStatus === "approved"
                                    ? "default"
                                    : "destructive"
                                }
                                className={`capitalize ${
                                  business.adminStatus === "approved"
                                    ? "bg-green-100 text-green-700 hover:bg-green-200"
                                    : ""
                                }`}
                              >
                                {business.adminStatus}
                              </Badge>
                              {business.rating && (
                                <div className="flex items-center gap-1 text-yellow-500">
                                  <Star className="h-4 w-4 fill-current" />
                                  <span className="text-sm font-medium">
                                    {business.rating.toFixed(1)}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm text-muted-foreground">
                                  Contact Person
                                </p>
                                <p className="text-sm font-medium">
                                  {business.contactPerson}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">
                                  Email
                                </p>
                                <p className="text-sm font-medium">
                                  {business.email}
                                </p>
                              </div>
                            </div>
                          </div>

                          <Button
                            variant="outline"
                            onClick={() => viewBusinessDetails(business)}
                            className="flex-shrink-0 hover:bg-violet-50"
                          >
                            View Details
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </Card>
                    ))}
                </div>
              </ScrollArea>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {selectedBusiness && (
        <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
          <DialogContent className="sm:max-w-[600px] bg-white max-h-[90vh] overflow-hidden">
            <DialogHeader className="px-6 py-2 border-b">
              <DialogTitle className="text-2xl font-semibold">
                Business Details
              </DialogTitle>
              <DialogDescription>
                Review the business information below
              </DialogDescription>
            </DialogHeader>

            <ScrollArea
              className="flex-1 px-6 py-4"
              style={{ maxHeight: "calc(90vh - 200px)" }}
            >
              <div className="grid gap-8">
                <div className="aspect-video w-full overflow-hidden rounded-lg">
                  <img
                    src={selectedBusiness.image[0]}
                    alt={selectedBusiness.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="grid gap-6">
                  {/* Business Information */}
                  <div className="grid gap-2">
                    <h3 className="font-semibold text-lg">
                      Business Information
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Name</p>
                        <p className="font-medium">{selectedBusiness.name}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Category</p>
                        <p className="font-medium">
                          {selectedBusiness.category?.name || "No Category"}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Price</p>
                        <p className="font-medium">
                          RM{selectedBusiness.price}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Status</p>
                        <div className="flex gap-2">
                          <Badge
                            variant={
                              selectedBusiness.businessStatus === "active"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {selectedBusiness.businessStatus}
                          </Badge>
                          <Badge
                            variant={
                              selectedBusiness.adminStatus === "approved"
                                ? "default"
                                : "destructive"
                            }
                          >
                            {selectedBusiness.adminStatus}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Address Section */}
                  <div className="grid gap-2">
                    <h3 className="font-semibold text-lg">Address</h3>
                    <p className="text-sm text-gray-600">
                      {selectedBusiness.address}
                    </p>
                  </div>

                  {/* About Section */}
                  <div className="grid gap-2">
                    <h3 className="font-semibold text-lg">About</h3>
                    <p className="text-sm text-gray-600">
                      {selectedBusiness.about}
                    </p>
                  </div>

                  {/* Owner Information */}
                  <div className="grid gap-2">
                    <h3 className="font-semibold text-lg">Owner Information</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Name</p>
                        <p className="font-medium">
                          {selectedBusiness.contactPerson}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Email</p>
                        <p className="font-medium">{selectedBusiness.email}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>

            <DialogFooter className="px-6 pt-4 pb-6 border-t">
              <div className="flex gap-2 w-full justify-end">
                {selectedBusiness.adminStatus !== "approved" && (
                  <Button
                    onClick={() => handleApprove(selectedBusiness.id)}
                    disabled={isLoading}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    {isLoading ? "Approving..." : "Approve Business"}
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => setShowDetailsDialog(false)}
                >
                  Close
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
