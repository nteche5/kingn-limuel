'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const welcomeMessages = [
    {
        main: "Welcome to King Lemuel Properties",
        sub: "Ghana's Premier Real Estate Partner"
    },
    {
        main: "Leading Property Provider in Ghana",
        sub: "Excellence in Real Estate Since 2018"
    },
    {
        main: "Your Trusted Partner Across Africa",
        sub: "Connecting You with Your Dream Property"
    }
]

export default function WelcomeBanner() {
    const [currentIndex, setCurrentIndex] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % welcomeMessages.length)
        }, 4500) // Change message every 4.5 seconds

        return () => clearInterval(interval)
    }, [])

    const currentMessage = welcomeMessages[currentIndex]

    return (
        <div className="welcome-banner-container relative overflow-hidden bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 py-2 border-b border-blue-800/30">
            {/* Subtle animated background */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-shimmer"></div>
            </div>

            {/* Content */}
            <div className="relative max-w-6xl mx-auto px-4 text-center">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                    >
                        {/* Single line with main message and subtle accent */}
                        <div className="flex items-center justify-center gap-2 sm:gap-3">
                            <div className="w-6 sm:w-8 h-px bg-gradient-to-r from-transparent to-yellow-400/50"></div>
                            <h1 className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-yellow-100 via-white to-blue-100 whitespace-nowrap">
                                {currentMessage.main}
                            </h1>
                            <div className="w-6 sm:w-8 h-px bg-gradient-to-l from-transparent to-yellow-400/50"></div>
                        </div>

                        {/* Compact subtitle */}
                        <p className="text-[9px] sm:text-[10px] md:text-xs text-blue-200/70 font-light mt-0.5">
                            {currentMessage.sub}
                        </p>
                    </motion.div>
                </AnimatePresence>

                {/* Minimal progress dots */}
                <div className="flex justify-center gap-1 mt-1.5">
                    {welcomeMessages.map((_, index) => (
                        <div
                            key={index}
                            className={`h-0.5 rounded-full transition-all duration-300 ${index === currentIndex
                                ? 'w-4 bg-yellow-400/80'
                                : 'w-1.5 bg-blue-400/30'
                                }`}
                        />
                    ))}
                </div>
            </div>

            {/* Removed large decorative elements for cleaner look */}
        </div>
    )
}
