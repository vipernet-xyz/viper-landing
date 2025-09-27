'use client'

import { Button } from "@/components/ui/button"
import { Diamond, Atom, Link2, Blocks } from "lucide-react"
import GradientPolygonIcon from "@/components/icons/GradientPolygonIcon"
import Navbar from "../components/Navbar"
import Image from "next/image"
import { motion } from "motion/react"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Animated Background gradient with polygon */}
      <motion.div 
        className="absolute inset-0 gradient-purple-radial"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
      />
      
      <motion.div 
        className="absolute inset-0 flex items-center justify-center opacity-20"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.2 }}
        transition={{ duration: 3, ease: "easeOut", delay: 0.5 }}
      >
        <motion.div
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
            scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          <GradientPolygonIcon width={600} height={600} />
        </motion.div>
      </motion.div>

      <Navbar />

      {/* Hero Content */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main Heading */}
          <motion.h1 
            className="text-7xl md:text-8xl font-bold text-white mb-6 font-inter"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
            >
              Viper Network
            </motion.span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            className="text-xl md:text-2xl text-white/80 mb-4 font-space-grotesk"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
          >
            The Trustless Gateway to Web3.
          </motion.p>

          {/* Description */}
          <motion.p 
            className="text-lg text-white/70 mb-12 font-space-grotesk"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.8 }}
          >
            Powering the Multichain Future.
          </motion.p>

          {/* Action Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 1 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Button 
                size="lg" 
                className="bg-white text-black hover:bg-white/90 font-space-grotesk font-medium transition-all duration-300 hover:shadow-lg hover:shadow-white/20"
              >
                Get Started
              </Button>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white/30 text-white hover:bg-white/10 font-space-grotesk transition-all duration-300 hover:shadow-lg hover:shadow-white/10"
              >
                Run a Node
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Animated Hero Image */}
      <motion.div 
        className="relative z-10 flex justify-center pb-20"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut", delay: 1.2 }}
      >
        <motion.div 
          className="relative"
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 1, -1, 0]
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          whileHover={{ 
            scale: 1.05,
            rotate: 0
          }}
        >
          <motion.div
            animate={{ 
              scale: [1, 1.02, 1],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Image 
              src="/assets/hero.svg" 
              alt="Viper Network Hero Illustration" 
              width={1000} 
              height={833}
              className="max-w-full h-auto transition-all duration-500"
              priority
            />
          </motion.div>
          
          {/* Floating particles effect */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full"
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + i * 10}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.8, 0.2],
                scale: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 2 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.3
              }}
            />
          ))}
        </motion.div>
      </motion.div>

      {/* Animated background elements */}
      <motion.div
        className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-xl"
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
          scale: [1, 1.2, 1]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div
        className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-xl"
        animate={{
          x: [0, -80, 0],
          y: [0, 60, 0],
          scale: [1, 0.8, 1]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      />
    </section>
  )
}
