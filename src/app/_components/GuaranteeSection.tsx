"use client"

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Shield, CheckCircle, Clock } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

interface FeatureProps {
  icon: React.ElementType
  title: string
  description: string
  delay: number
}

const Feature = ({ icon: Icon, title, description, delay }: FeatureProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    viewport={{ once: true }}
    className="flex items-start space-x-4 p-6 bg-white rounded-2xl border border-gray-100 transition-all duration-300 hover:shadow-lg hover:border-violet-100"
  >
    <div className="flex-shrink-0">
      <div className="p-3 bg-violet-50 rounded-xl">
        <Icon className="w-6 h-6 text-violet-600" />
      </div>
    </div>
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  </motion.div>
)

export default function GuaranteeSection() {
  const router = useRouter()

  const features = [
    {
      icon: Shield,
      title: "Happiness Pledge",
      description: "Your satisfaction is our top priority. We'll work tirelessly to ensure your complete satisfaction with our services."
    },
    {
      icon: CheckCircle,
      title: "Vetted Professionals",
      description: "Every service provider undergoes a thorough background check and verification process to ensure quality and reliability."
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description: "Our dedicated support team is available around the clock to assist you with any questions or concerns you may have."
    }
  ]

  const handleGetStarted = () => {
    router.push('/')
  }

  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
            Your satisfaction is{" "}
            <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              guaranteed
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Experience excellence in service with our unwavering commitment to quality and customer satisfaction
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute inset-0 bg-violet-200 transform rotate-2 rounded-2xl opacity-20"></div>
            <div className="relative overflow-hidden rounded-2xl aspect-[4/3]">
              <Image
                src="/images/sweap.jpg"
                alt="Professional cleaning service"
                fill
                className="object-cover transform transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent">
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <p className="text-2xl font-bold text-white mb-2">Experience Excellence</p>
                  <p className="text-gray-200">Join our community of satisfied customers</p>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="space-y-6">
            {features.map((feature, index) => (
              <Feature 
                key={index} 
                {...feature} 
                delay={index * 0.1}
              />
            ))}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="pt-6"
            >
              <Button 
                className="w-full sm:w-auto bg-violet-600 hover:bg-violet-700 text-white px-8 py-6 rounded-xl text-lg font-medium transition-all duration-200 hover:shadow-lg hover:shadow-violet-100"
                onClick={handleGetStarted}
              >
                Get Started Today
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}