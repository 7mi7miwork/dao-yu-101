import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface MinecraftCardProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'grass' | 'stone' | 'dirt' | 'wood'
  hover?: boolean
}

export const MinecraftCard: React.FC<MinecraftCardProps> = ({
  children,
  className,
  variant = 'default',
  hover = true,
}) => {
  const baseClasses = 'minecraft-block p-6 backdrop-blur-sm'
  
  const variantClasses = {
    default: 'bg-white/90',
    grass: 'minecraft-grass',
    stone: 'minecraft-stone',
    dirt: 'minecraft-dirt',
    wood: 'minecraft-wood',
  }
  
  const hoverClasses = hover ? 'transition-all duration-200 hover:scale-105 hover:shadow-lg' : ''
  
  const classes = cn(
    baseClasses,
    variantClasses[variant],
    hoverClasses,
    className
  )
  
  return (
    <motion.div
      className={classes}
      whileHover={hover ? { scale: 1.02 } : {}}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  )
}
