'use client'
import React, { createContext, useContext, useState, useEffect } from 'react'

type AccessibilityContextType = {
  highContrast: boolean
  toggleHighContrast: () => void
  fontSize: number
  increaseFontSize: () => void
  decreaseFontSize: () => void
  resetFontSize: () => void
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined)

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [highContrast, setHighContrast] = useState(false)
  const [fontSize, setFontSize] = useState(100) // 100% é o tamanho padrão

  // Carrega as preferências do usuário do localStorage quando o componente é montado
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedHighContrast = localStorage.getItem('highContrast') === 'true'
      const savedFontSize = parseInt(localStorage.getItem('fontSize') || '100')
      
      setHighContrast(savedHighContrast)
      setFontSize(savedFontSize)
      
      // Aplica as configurações salvas
      if (savedHighContrast) {
        document.documentElement.classList.add('high-contrast')
      }
      document.documentElement.style.fontSize = `${savedFontSize}%`
    }
  }, [])

  // Salva as preferências do usuário no localStorage quando elas mudam
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('highContrast', highContrast.toString())
      localStorage.setItem('fontSize', fontSize.toString())
      
      // Aplica as configurações
      if (highContrast) {
        document.documentElement.classList.add('high-contrast')
      } else {
        document.documentElement.classList.remove('high-contrast')
      }
      document.documentElement.style.fontSize = `${fontSize}%`
    }
  }, [highContrast, fontSize])

  const toggleHighContrast = () => {
    setHighContrast(prev => !prev)
  }

  const increaseFontSize = () => {
    setFontSize(prev => Math.min(prev + 10, 150)) // Limita o aumento a 150%
  }

  const decreaseFontSize = () => {
    setFontSize(prev => Math.max(prev - 10, 80)) // Limita a diminuição a 80%
  }

  const resetFontSize = () => {
    setFontSize(100)
  }

  return (
    <AccessibilityContext.Provider
      value={{
        highContrast,
        toggleHighContrast,
        fontSize,
        increaseFontSize,
        decreaseFontSize,
        resetFontSize
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  )
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext)
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider')
  }
  return context
}
