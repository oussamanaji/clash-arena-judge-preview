'use client'

import { useState, useEffect } from 'react'

interface TimerProps {
  initialSeconds: number
  onComplete?: () => void
  title?: string
}

export default function Timer({ initialSeconds, onComplete, title }: TimerProps) {
  const [seconds, setSeconds] = useState(initialSeconds)
  const [isActive, setIsActive] = useState(true)

  useEffect(() => {
    setSeconds(initialSeconds)
    setIsActive(true)
  }, [initialSeconds])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds(seconds => {
          if (seconds === 1) {
            setIsActive(false)
          }
          return seconds - 1
        })
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, seconds])

  // Handle completion in separate effect
  useEffect(() => {
    if (!isActive && seconds === 0) {
      onComplete?.()
    }
  }, [isActive, seconds, onComplete])

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const secs = time % 60
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  const getColorClasses = () => {
    const progress = seconds / initialSeconds
    
    if (progress > 0.5) {
      return {
        bg: 'bg-green-500',
        text: 'text-green-600',
        border: 'border-green-200'
      }
    } else if (progress > 0.2) {
      return {
        bg: 'bg-orange-500',
        text: 'text-orange-600',
        border: 'border-orange-200'
      }
    } else {
      return {
        bg: 'bg-red-500',
        text: 'text-red-600',
        border: 'border-red-200'
      }
    }
  }

  const colors = getColorClasses()
  const progress = (seconds / initialSeconds) * 100

  return (
    <div className="text-center">
      {title && (
        <h3 className="text-lg font-semibold text-gray-700 mb-4">{title}</h3>
      )}
      
      <div className="relative w-48 h-48 mx-auto">
        {/* Background Circle */}
        <div className={`absolute inset-0 rounded-full border-8 ${colors.border}`}></div>
        
        {/* Progress Circle */}
        <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="42"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className={colors.bg}
            strokeDasharray={`${progress * 2.64} 264`}
            strokeLinecap="round"
          />
        </svg>
        
        {/* Timer Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className={`text-4xl font-bold ${colors.text}`}>
            {formatTime(seconds)}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            {seconds === 1 ? 'second' : 'seconds'}
          </div>
        </div>
      </div>
    </div>
  )
}