"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ChevronRight, Loader2 } from 'lucide-react'

type Category = {
  id: number
  name: string
  iconUrl: string
}

const categoryStyles = {
  1: "bg-blue-50 hover:bg-blue-100 border-blue-200",
  2: "bg-pink-50 hover:bg-pink-100 border-pink-200",
  3: "bg-orange-50 hover:bg-orange-100 border-orange-200",
  4: "bg-purple-50 hover:bg-purple-100 border-purple-200",
}

export default function Component() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories")
        if (!response.ok) {
          throw new Error("Failed to fetch categories")
        }
        const data: Category[] = await response.json()
        setCategories(data)
      } catch (error) {
        setError((error as Error).message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategories()
  }, [])

  if (error) {
    return (
      <div className="text-center p-4 md:p-8 text-red-500">
        <p>Error: {error}</p>
      </div>
    )
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-2 mb-8">
      <div className="flex items-center justify-between mb-4 md:mb-8">
        {/* Commented out sections remain unchanged */}
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Link href={`/search/${category.id}`}>
                <div
                  className={`
                    relative rounded-xl md:rounded-2xl p-3 md:p-5 
                    border-2 transition-all duration-300
                    ${categoryStyles[category.id as keyof typeof categoryStyles]}
                    hover:shadow-lg hover:-translate-y-1
                    flex flex-col items-center justify-center gap-2 md:gap-4 
                  `}
                >
                  <div className="w-12 h-12 md:w-16 md:h-16 relative">
                    <img
                      src={category.iconUrl}
                      alt={category.name}
                      className="w-full h-full object-contain transform transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <h3 className="font-medium text-sm md:text-lg text-gray-900 text-center">{category.name}</h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

