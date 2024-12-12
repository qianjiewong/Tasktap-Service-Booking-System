"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Ban, Loader2, CheckCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const businessFormSchema = z.object({
  name: z.string().min(2, "Business name must be at least 2 characters"),
  about: z.string().min(10, "Description must be at least 10 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Price must be a valid number greater than 0",
  }),
})

interface BusinessEditDialogProps {
  business: any
  open: boolean
  onOpenChange: (open: boolean) => void
  onBusinessUpdated: () => void
}

export function BusinessEditDialog({
  business,
  open,
  onOpenChange,
  onBusinessUpdated,
}: BusinessEditDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showDeactivateAlert, setShowDeactivateAlert] = useState(false)
  const [showActivateAlert, setShowActivateAlert] = useState(false)

  const form = useForm<z.infer<typeof businessFormSchema>>({
    resolver: zodResolver(businessFormSchema),
    defaultValues: {
      name: business.name,
      about: business.about,
      address: business.address,
      price: business.price.toString(),
    },
  })

  async function onSubmit(values: z.infer<typeof businessFormSchema>) {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/updateBusinessInformation/${business.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })

      if (!response.ok) throw new Error("Failed to update business")

      toast({
        title: "Success",
        description: "Business information updated successfully!",
        variant: "default",
        className: "bg-green-500 text-white border-2 border-green-500 rounded-md",
      })
      onBusinessUpdated()
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update business information",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function onDeactivate() {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/updateBusinessStatus/${business.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessStatus: "not active" }),
      })

      if (!response.ok) throw new Error("Failed to deactivate business")

      toast({
        title: "Success",
        description: "Business deactivated successfully!",
        variant: "default",
        className: "bg-blue-500 text-white border-2 border-blue-500 rounded-md",
      })
      onBusinessUpdated()
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to deactivate business",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setShowDeactivateAlert(false)
    }
  }

  async function onActivate() {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/updateBusinessStatus/${business.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessStatus: "active" }),
      })

      if (!response.ok) throw new Error("Failed to activate business")

      toast({
        title: "Success",
        description: "Business activated successfully!",
        variant: "default",
        className: "bg-green-500 text-white border-2 border-green-500 rounded-md",
      })
      onBusinessUpdated()
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to activate business",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setShowActivateAlert(false)
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[700px] bg-slate-50">
          <DialogHeader>
            <DialogTitle>Edit Business</DialogTitle>
            <DialogDescription>
              Make changes to your business information here.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="about"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (RM)</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" min="0" step="0.01" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className="gap-2 sm:gap-0">
                {business.businessStatus === "active" ? (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => setShowDeactivateAlert(true)}
                    disabled={isLoading}
                  >
                    <Ban className="w-4 h-4 mr-2" />
                    Deactivate Business
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowActivateAlert(true)}
                    disabled={isLoading}
                    className="bg-green-500 hover:bg-green-600 text-white hover:text-white"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Activate Business
                  </Button>
                )}
                <Button type="submit" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeactivateAlert} onOpenChange={setShowDeactivateAlert}>
        <AlertDialogContent className="bg-slate-50">
          <AlertDialogHeader>
            <AlertDialogTitle>Deactivate Business?</AlertDialogTitle>
            <AlertDialogDescription>
              This will deactivate your business listing. Your business will no longer be visible to customers,
              but you can reactivate it later. All existing bookings will be maintained.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={onDeactivate}
              className="bg-red-600 hover:bg-red-700"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Deactivating..." : "Deactivate Business"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showActivateAlert} onOpenChange={setShowActivateAlert}>
        <AlertDialogContent className="bg-slate-50">
          <AlertDialogHeader>
            <AlertDialogTitle>Activate Business?</AlertDialogTitle>
            <AlertDialogDescription>
              This will reactivate your business listing. Your business will be visible to customers again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={onActivate}
              className="bg-green-500 hover:bg-green-600"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Activating..." : "Activate Business"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}