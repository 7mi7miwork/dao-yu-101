import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface MinecraftButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  onClick?: () => void
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}

export const MinecraftButton: React.FC<MinecraftButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className,
  onClick,
  disabled = false,
  type = 'button',
}) => {
  const baseClasses = 'minecraft-block font-bold text-minecraft transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2'
  
  const variantClasses = {
    primary: 'bg-gradient-to-b from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 focus:ring-emerald-500 text-white',
    secondary: 'bg-gradient-to-b from-stone-500 to-stone-600 hover:from-stone-600 hover:to-stone-700 focus:ring-stone-500 text-white',
    danger: 'bg-gradient-to-b from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 focus:ring-red-500 text-white',
    ghost: 'bg-transparent hover:bg-gray-100 focus:ring-gray-500 text-gray-700 hover:text-gray-900',
  }
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  }
  
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed hover:scale-100' : 'hover:scale-105 active:scale-95'
  
  const classes = cn(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    disabledClasses,
    className
  )
  
  return (
    <motion.button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.button>
  )
}
