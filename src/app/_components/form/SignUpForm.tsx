'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from 'zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useToast } from "@/hooks/use-toast"
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { FcGoogle } from 'react-icons/fc'
import { motion } from 'framer-motion'
import GoogleSignInButton from '@/components/GoogleSignInButton'

const FormSchema = z
  .object({
    username: z.string().min(1, 'Username is required').max(100),
    email: z.string().min(1, 'Email is required').email('Invalid email'),
    phone: z
      .string()
      .min(1, 'Phone number is required')
      .regex(/^(\+?\d{1,3}[-.\s]?)?\d{10}$/, 'Invalid phone number format'),
    // zipCode: z
    //   .string()
    //   .min(5, 'Zip Code must be exactly 5 digits')
    //   .max(5, 'Zip Code must be exactly 5 digits')
    //   .regex(/^\d{5}$/, 'Zip Code must be numeric and 5 digits only'),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must have than 8 characters'),
    confirmPassword: z.string().min(1, 'Password confirmation is required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

const testimonials = [
  {
    name: "David Chen",
    role: "Business Owner",
    company: "Urban Services LLC",
    quote: "Joining Tasktap was the best decision for my service business. The platform has helped me reach more customers and grow my business significantly."
  },
  {
    name: "Lisa Thompson",
    role: "Professional Cleaner",
    company: "Sparkle Clean Co.",
    quote: "The sign-up process was smooth, and I started getting bookings within days. The platform is exactly what service providers need!"
  }
]

const TestimonialCard = ({ testimonial, isActive }: { 
  testimonial: typeof testimonials[0]
  isActive: boolean 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 20 }}
      transition={{ duration: 0.5 }}
      className="absolute bottom-16 left-16 right-16"
    >
      <div className="backdrop-blur-md bg-white/30 rounded-xl p-8 shadow-lg">
        <div className="space-y-4">
          <p className="text-lg font-medium leading-relaxed text-white">
            "{testimonial.quote}"
          </p>
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold text-white">{testimonial.name}</p>
              <p className="text-sm text-white/80">
                {testimonial.role}, {testimonial.company}
              </p>
            </div>
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className="w-5 h-5 text-yellow-400 fill-current"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
                </svg>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function SignUpForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: '',
      email: '',
      phone: '',
      // zipCode: '',
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    const response = await fetch('/api/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: values.username,
        email: values.email,
        phone: values.phone,
        // zipCode: values.zipCode,
        password: values.password,
      })
    })

    if(response.ok) {
      router.push('/sign-in')
      toast({
        title: "Success",
        description: "Account created successfully! Please sign in.",
        variant: 'default',
        className: "bg-green-500 text-white border-2 border-green-500 rounded-md",
      })
    } else {
      const errorData = await response.json();
      toast({
        title: "Registration Failed",
        description: errorData.message || "Something went wrong.",
        variant: 'destructive',
      })
    }
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen flex mt-6">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 p-8 sm:p-12 xl:p-16">
        <div className="max-w-md w-full mx-auto space-y-8">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold tracking-tight">Create an account</h1>
            <p className="text-gray-500">Start your journey with Tasktap today</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="johndoe" 
                        {...field}
                        className="h-11"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="mail@example.com" 
                        {...field}
                        className="h-11"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="+0125557777" 
                        {...field}
                        className="h-11"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* <FormField
                control={form.control}
                name="zipCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Zip Code</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="30020" 
                        {...field}
                        className="h-11"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Create a password"
                        {...field}
                        className="h-11"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Re-enter your password"
                        {...field}
                        className="h-11"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full h-11 bg-violet-600 hover:bg-violet-700"
              >
                Create Account
              </Button>
            </form>
          </Form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">or continue with</span>
            </div>
          </div>
          
          <GoogleSignInButton>
            <FcGoogle className="mr-2 h-5 w-5" />
            Sign up with Google
          </GoogleSignInButton>
          
          <p className="text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link 
              href="/sign-in" 
              className="text-violet-600 hover:text-violet-700 font-medium"
            >
              Login
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Image & Testimonials */}
      <div className="hidden lg:block relative w-1/2">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/10 via-gray-900/50 to-gray-900/80" />
        <img
          src="/images/door.jpg"
          alt="Service professionals at work"
          className="absolute inset-0 h-full w-full object-cover"
        />
        
        {testimonials.map((testimonial, index) => (
          <TestimonialCard
            key={index}
            testimonial={testimonial}
            isActive={currentTestimonial === index}
          />
        ))}

        {/* Navigation arrows */}
        <div className="absolute bottom-16 right-16 flex gap-2">
          <button
            onClick={() => setCurrentTestimonial((prev) => 
              prev === 0 ? testimonials.length - 1 : prev - 1
            )}
            className="p-2 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 transition-colors"
          >
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => setCurrentTestimonial((prev) => 
              (prev + 1) % testimonials.length
            )}
            className="p-2 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 transition-colors"
          >
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}