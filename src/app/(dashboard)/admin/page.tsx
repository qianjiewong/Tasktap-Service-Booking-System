"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AdminDashboard from "./_components/businessList";

export default function AdminPage() {
  const [showLogoutDialog, setShowLogoutDialog] = React.useState(false);
  const router = useRouter();

  const handleLogout = () => {
    setShowLogoutDialog(true);
  };

  const confirmLogout = async () => {
    await signOut({ redirect: false }); // Prevent auto-redirection
    setShowLogoutDialog(false);
    router.push('/sign-in'); // Redirect to the sign-in page
  };

  return (
    <div>
    <header className="top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="flex items-center gap-8 flex-1">
          <Link href="/admin" className="flex items-center">
            <span className="font-bold font-sans text-2xl md:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
              tasktap.
            </span>
          </Link>

          <NavigationMenu>
            <NavigationMenuList>
              {/* <NavigationMenuItem>
                <Link href="/admin" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Dashboard
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem> */}
              {/* <NavigationMenuItem>
                <Link href="/admin/review-business" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Review Business
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem> */}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="flex items-center"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </Button>
        </div>
      </div>

      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent className="sm:max-w-[425px] bg-slate-50">
          <DialogHeader>
            <DialogTitle>Confirm Logout</DialogTitle>
            <DialogDescription>
              Are you sure you want to log out of your admin account?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLogoutDialog(false)}>
              Cancel
            </Button>
            <Button onClick={confirmLogout}>Logout</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
      <div className="mt-4">
        <AdminDashboard />
      </div>
    </div>
    

  );
}
