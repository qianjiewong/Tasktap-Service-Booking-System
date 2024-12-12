"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { useRole } from "@/context/RoleContext"
import { Menu, X, LogOut, User, DoorOpen, ChevronRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function Header() {
  const { data: session, status } = useSession()
  const { role, switchRole } = useRole()
  const [showLogoutDialog, setShowLogoutDialog] = React.useState(false)
  const [showRoleDialog, setShowRoleDialog] = React.useState(false)
  const [isSheetOpen, setIsSheetOpen] = React.useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const taskerLinks = [
    { href: "/tasker", label: "My Business" },
    { href: "/taskerViewOrder", label: "My Orders" },
    { href: "/taskerAddService", label: "Add Service" },
  ]

  const customerLinks = [
    { href: "/", label: "Home" },
    { href: "/search/1", label: "Services" },
    { href: "/mybooking", label: "My Booking" },
  ]

  const currentLinks = role === "tasker" ? taskerLinks : customerLinks

  const handleLogout = () => {
    setShowLogoutDialog(true)
    setIsSheetOpen(false)
  }

  const confirmLogout = () => {
    signOut()
    setShowLogoutDialog(false)
  }

  const handleRoleSwitch = () => {
    setShowRoleDialog(true)
    setIsSheetOpen(false)
  }

  const confirmRoleSwitch = () => {
    switchRole()
    setShowRoleDialog(false)
    if (role === "customer") {
      router.push("/tasker")
    } else {
      router.push("/")
    }
  }

  const handleTasktapClick = () => {
    if (role === "tasker") {
      router.push("/tasker")
    } else {
      router.push("/")
    }
  }

  if (status === "loading") return null

  return (
    <header className="top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="flex items-center gap-8 flex-1">
          <button onClick={handleTasktapClick} className="flex items-center">
            <span className="font-bold font-sans text-2xl md:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
              tasktap.
            </span>
          </button>

          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              {currentLinks.map((link) => (
                <NavigationMenuItem key={link.href}>
                  <Link href={link.href} legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      {link.label}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            className="hidden md:flex"
            onClick={handleRoleSwitch}
          >
            {role === "customer" ? "Become a Tasker" : "Switch to Customer"}
          </Button>

          {session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={session.user.image || ''} alt={session.user.name || ''} />
                    <AvatarFallback>{session.user.name?.[0] || 'U'}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{session.user.name}</p>
                    <p className="text-sm font-medium leading-none">{session.user.username}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {session.user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {/* <DropdownMenuItem onClick={profilePage}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem> */}
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href={role === "customer" ? "/sign-in" : "/tasker-sign-in"}>
              <Button className="bg-violet-600 hover:bg-violet-700">
                Login / SignUp
              </Button>
            </Link>
          )}

          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-slate-50">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-4 py-6">
                {currentLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center py-2 text-base font-medium transition-colors hover:text-violet-600"
                    onClick={() => setIsSheetOpen(false)}
                  >
                    {link.label}
                    <ChevronRight className="ml-auto h-4 w-4" />
                  </Link>
                ))}
                <Button
                  variant="outline"
                  onClick={handleRoleSwitch}
                  className="w-full mt-4"
                >
                  {role === "customer" ? "Become a Tasker" : "Switch to Customer"}
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 sm:p-6 rounded-lg shadow-lg w-[90vw] max-w-[500px]">
          <div className="mb-6 rounded-full bg-violet-100 p-3 mt-10 flex items-center justify-center w-16 h-16 mx-auto">
            <DoorOpen className="h-12 w-12 text-violet-600" />
          </div>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-center">Confirm Logout</DialogTitle>
            <DialogDescription className="text-base mt-2 text-center">
              Are you sure you want to log out of your account?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col w-full gap-2 mt-6 mb-6">
            <Button
              type="button"
              variant="default"
              onClick={confirmLogout}
              className="w-full bg-red-600 hover:bg-red-700"
            >
              Logout
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowLogoutDialog(false)}
              className="w-full border-gray-200 hover:bg-gray-200 hover:text-zinc-700"
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
        <DialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 sm:p-6 rounded-lg shadow-lg w-[90vw] max-w-[500px]">
          <div className="mb-6 rounded-full bg-violet-100 p-3 mt-10 flex items-center justify-center w-16 h-16 mx-auto">
            <User className="h-12 w-12 text-violet-600" />
          </div>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-center">
              Switch to {role === "customer" ? "Tasker" : "Customer"}?
            </DialogTitle>
            <DialogDescription className="text-base mt-2 text-center">
              {role === "customer" 
                ? "You'll be switched to Tasker mode where you can manage your services and orders."
                : "You'll be switched to Customer mode where you can browse and book services."
              }
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col w-full gap-2 mt-6 mb-6">
            <Button
              type="button"
              variant="default"
              onClick={confirmRoleSwitch}
              className="w-full bg-violet-600 hover:bg-violet-700"
            >
              Yes, Switch Role
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowRoleDialog(false)}
              className="w-full border-gray-200 hover:bg-gray-100"
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  )
}