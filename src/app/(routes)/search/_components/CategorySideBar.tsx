"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { Loader2 } from 'lucide-react'
import { motion } from "framer-motion"

type Category = {
  id: number
  name: string
  iconUrl: string
}

interface CategorySideBarProps {
  onSelect?: () => void
}

export default function CategorySideBar({ onSelect }: CategorySideBarProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const pathname = usePathname()
  const selectedCategory = pathname?.split('/')[2]

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories')
        if (!response.ok) throw new Error('Failed to fetch categories')
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
      <div className="p-4 text-red-500">
        <p>Error: {error}</p>
      </div>
    )
  }

  return (
    <div className="w-full min-h-full p-4 bg-white overflow-y-auto">
     
      <h2 className="text-2xl font-extrabold text-violet-700 mb-6">Categories</h2>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-40 ">
          <Loader2 className="w-6 h-6 animate-spin text-violet-600" />
        </div>
      ) : (
        <motion.ul
          className="space-y-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {categories.map((category, index) => (
            <motion.li
              key={category.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: index * 0.1 }}
            >
              <Link 
                href={`/search/${category.id}`}
                onClick={onSelect}
              >
                <div
                  className={`
                    group flex items-center gap-3 p-3 rounded-lg border transition-all duration-200
                    hover:border-violet-400 hover:bg-purple-50/50
                    ${selectedCategory === String(category.id)
                      ? "border-violet-400 bg-purple-50 shadow-sm"
                      : "border-gray-200 bg-white"
                    }
                  `}
                >
                  <div className="w-8 h-8 flex-shrink-0 ">
                    <img
                      src={category.iconUrl}
                      alt=""
                      className="w-full h-full object-contain "
                    />
                  </div>
                  <span className={`font-bold transition-colors duration-200 
                    ${selectedCategory === String(category.id)
                      ? "text-violet-700"
                      : "text-gray-800 group-hover:text-violet-600"
                    }
                  `}>
                    {category.name}
                  </span>
                </div>
              </Link>
            </motion.li>
          ))}
        </motion.ul>
      )}
    </div>
  )
}