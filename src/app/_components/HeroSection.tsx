"use client"

import { Input } from '@/components/ui/input'
import { ArrowRight, Search, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

function HeroSection() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-indigo-50 to-white">
      <div className="absolute inset-0">
        {/* Background pattern can be added here if needed */}
      </div>
      <div className='relative flex items-center gap-4 sm:gap-6 md:gap-8 flex-col justify-center pt-10 sm:pt-16 md:pt-10 pb-10 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto mt-2'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2 px-3 sm:px-4 py-1 sm:py-2 rounded-full bg-white shadow-md border border-violet-100"
        >
          <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-yellow-400" />
          <span className="text-xs sm:text-sm text-gray-600">Your trusted service marketplace</span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className='text-center max-w-4xl'
        >
           <div className='text-zinc-800 font-bold text-3xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-[65px] text-center leading-tight mt-2 sm:mt-4'>
             Find 
             <span className='gradient-text'> Service / Repair </span>
             <br className="hidden sm:inline" />Near You
           </div>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className='text-gray-500 text-sm sm:text-md md:text-lg text-center max-w-2xl'
        >
          Connect with skilled professionals for all your home service and repair needs, all in one place.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-md mx-auto"
        >
          <Link href="/search/1" className="block">
            <Button 
              className="w-full h-14 text-xl font-medium rounded-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
            >
              <span className="mr-2">Browse Services</span>
              <ArrowRight className="h-6 w-6 inline-block transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

export default HeroSection