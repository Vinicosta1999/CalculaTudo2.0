'use client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import { Calculator, Droplets, DollarSign, Flame } from 'lucide-react'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-8 sm:p-24">
      <h1 className="text-4xl font-bold mb-8 text-center">CalculaTudo</h1>
      <p className="text-xl mb-12 text-center max-w-2xl">
        Facilitando seu dia a dia com cálculos rápidos e precisos para suas necessidades diárias
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        <Link href="/moeda" className="w-full">
          <Card className="p-6 h-full hover:bg-slate-800 transition-colors">
            <div className="flex flex-col items-center text-center h-full">
              <DollarSign className="h-12 w-12 mb-4 text-green-500" />
              <h2 className="text-2xl font-medium mb-2">Conversão de Moedas</h2>
              <p className="text-muted-foreground">
                Converta valores entre diferentes moedas com taxas atualizadas em tempo real
              </p>
            </div>
          </Card>
        </Link>
        
        <Link href="/imc" className="w-full">
          <Card className="p-6 h-full hover:bg-slate-800 transition-colors">
            <div className="flex flex-col items-center text-center h-full">
              <Calculator className="h-12 w-12 mb-4 text-blue-500" />
              <h2 className="text-2xl font-medium mb-2">Cálculo de IMC</h2>
              <p className="text-muted-foreground">
                Calcule seu Índice de Massa Corporal e descubra sua faixa de peso ideal
              </p>
            </div>
          </Card>
        </Link>
        
        <Link href="/tmb" className="w-full">
          <Card className="p-6 h-full hover:bg-slate-800 transition-colors">
            <div className="flex flex-col items-center text-center h-full">
              <Flame className="h-12 w-12 mb-4 text-orange-500" />
              <h2 className="text-2xl font-medium mb-2">Taxa Metabólica Basal</h2>
              <p className="text-muted-foreground">
                Descubra quantas calorias seu corpo necessita diariamente em repouso
              </p>
            </div>
          </Card>
        </Link>
        
        <Link href="/agua" className="w-full">
          <Card className="p-6 h-full hover:bg-slate-800 transition-colors">
            <div className="flex flex-col items-center text-center h-full">
              <Droplets className="h-12 w-12 mb-4 text-cyan-500" />
              <h2 className="text-2xl font-medium mb-2">Consumo de Água</h2>
              <p className="text-muted-foreground">
                Calcule a quantidade ideal de água que você deve consumir diariamente
              </p>
            </div>
          </Card>
        </Link>
      </div>
      
      <footer className="mt-16 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} CalculaTudo - Todos os direitos reservados</p>
      </footer>
    </main>
  )
}
