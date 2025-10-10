"use client"

import { cn } from "../../lib/utils"

interface LogoProps {
  className?: string
  size?: "sm" | "md" | "lg"
  onClick?: () => void
  clickable?: boolean
  showGoldMember?: boolean
}

export default function Logo({ className, size = "md", onClick, clickable = false, showGoldMember = false }: LogoProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8", 
    lg: "h-12 w-12"
  }

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-3xl"
  }

  return (
    <div 
      className={cn(
        "flex flex-col items-start", 
        clickable && "cursor-pointer hover:opacity-80 transition-opacity",
        className
      )}
      onClick={clickable ? onClick : undefined}
    >
      <div className="flex items-center gap-2">
        <img
          src="/logo.png"
          alt="EmoCare Logo"
          className={cn(sizeClasses[size], "object-contain")}
          onError={(e) => {
            // Fallback to text logo if image fails to load
            e.currentTarget.style.display = 'none'
            const parent = e.currentTarget.parentElement
            if (parent && !parent.querySelector('.fallback-logo')) {
              const fallback = document.createElement('div')
              fallback.className = `fallback-logo ${sizeClasses[size]} bg-primary rounded-lg flex items-center justify-center text-white font-bold`
              fallback.textContent = 'E'
              parent.insertBefore(fallback, e.currentTarget)
            }
          }}
        />
        <span className={cn("font-bold text-foreground", textSizeClasses[size])}>EmoCare</span>
      </div>
      {showGoldMember && (
        <span className="text-sm text-gray-500 mt-1 text-left">Gold Member</span>
      )}
    </div>
  )
}
