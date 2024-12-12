"use client"

import React, { ReactNode, useState } from 'react'
import CategorySideBar from './_components/CategorySideBar'
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu } from 'lucide-react'

type LayoutProps = {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="container px-4 py-6 md:py-8">
      {/* Mobile Category Menu Button */}
      <div className="md:hidden mb-6">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full flex items-center justify-between">
              <span>Categories</span>
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px] p-0">
            <CategorySideBar onSelect={() => setIsOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="hidden md:block">
          <CategorySideBar />
        </div>
        <div className="md:col-span-3">
          {children}
        </div>
      </div>
    </div>
  )
}

