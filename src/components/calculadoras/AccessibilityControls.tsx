'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Sun, 
  Moon, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  PanelLeftClose, 
  PanelLeftOpen 
} from 'lucide-react'
import { useAccessibility } from './AccessibilityProvider'

export default function AccessibilityControls() {
  const [isOpen, setIsOpen] = useState(false)
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const { 
    highContrast, 
    toggleHighContrast, 
    increaseFontSize, 
    decreaseFontSize, 
    resetFontSize 
  } = useAccessibility()

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    
    // Aplica o tema ao elemento HTML
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark')
      document.documentElement.classList.remove('light')
    } else {
      document.documentElement.classList.add('light')
      document.documentElement.classList.remove('dark')
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="bg-slate-900 border border-slate-700 rounded-lg shadow-lg p-4 flex flex-col gap-2">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Acessibilidade</span>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsOpen(false)}
              aria-label="Fechar painel de acessibilidade"
            >
              <PanelLeftClose className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <Button 
              variant={theme === 'dark' ? 'default' : 'outline'} 
              size="sm" 
              onClick={toggleTheme}
              aria-pressed={theme === 'dark'}
              aria-label="Alternar tema escuro"
              className="flex items-center justify-start"
            >
              <Moon className="h-4 w-4 mr-2" />
              <span>Escuro</span>
            </Button>
            
            <Button 
              variant={theme === 'light' ? 'default' : 'outline'} 
              size="sm" 
              onClick={toggleTheme}
              aria-pressed={theme === 'light'}
              aria-label="Alternar tema claro"
              className="flex items-center justify-start"
            >
              <Sun className="h-4 w-4 mr-2" />
              <span>Claro</span>
            </Button>
            
            <Button 
              variant={highContrast ? 'default' : 'outline'} 
              size="sm" 
              onClick={toggleHighContrast}
              aria-pressed={highContrast}
              aria-label="Alternar alto contraste"
              className="col-span-2 flex items-center justify-start"
            >
              <span>Alto Contraste</span>
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={increaseFontSize}
              aria-label="Aumentar tamanho da fonte"
              className="flex items-center justify-start"
            >
              <ZoomIn className="h-4 w-4 mr-2" />
              <span>Aumentar</span>
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={decreaseFontSize}
              aria-label="Diminuir tamanho da fonte"
              className="flex items-center justify-start"
            >
              <ZoomOut className="h-4 w-4 mr-2" />
              <span>Diminuir</span>
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={resetFontSize}
              aria-label="Resetar tamanho da fonte"
              className="col-span-2 flex items-center justify-start"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              <span>Resetar Fonte</span>
            </Button>
          </div>
        </div>
      ) : (
        <Button 
          variant="default" 
          size="icon" 
          onClick={() => setIsOpen(true)}
          aria-label="Abrir painel de acessibilidade"
          className="rounded-full shadow-lg"
        >
          <PanelLeftOpen className="h-5 w-5" />
        </Button>
      )}
    </div>
  )
}
