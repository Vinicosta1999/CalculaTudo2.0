'use client'
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Droplets } from 'lucide-react'

export default function AguaPage() {
  const [peso, setPeso] = useState<string>('')
  const [nivelAtividade, setNivelAtividade] = useState<string>('moderado')
  const [resultado, setResultado] = useState<{litros: number, copos: number} | null>(null)
  
  const calcularConsumoAgua = () => {
    if (!peso) return
    
    const pesoNum = parseFloat(peso.replace(',', '.'))
    
    if (isNaN(pesoNum) || pesoNum <= 0) {
      alert('Por favor, insira um valor válido para o peso.')
      return
    }
    
    // Fator base: 0,033L por kg de peso corporal
    let fatorBase = 0.033
    
    // Ajuste pelo nível de atividade física
    switch (nivelAtividade) {
      case 'sedentario':
        fatorBase = 0.03
        break
      case 'moderado':
        fatorBase = 0.035
        break
      case 'intenso':
        fatorBase = 0.04
        break
    }
    
    // Cálculo do consumo de água em litros
    const consumoAgua = pesoNum * fatorBase
    
    // Conversão para copos (considerando 250ml por copo)
    const coposAgua = Math.ceil(consumoAgua * 1000 / 250)
    
    setResultado({
      litros: parseFloat(consumoAgua.toFixed(2)),
      copos: coposAgua
    })
  }
  
  return (
    <main className="flex min-h-screen flex-col items-center p-8 pt-24 sm:p-24">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-center mb-2">
              <Droplets className="h-8 w-8 text-cyan-500 mr-2" />
              <CardTitle>Calculadora de Consumo de Água</CardTitle>
            </div>
            <CardDescription className="text-center">
              Calcule a quantidade ideal de água que você deve consumir diariamente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form 
              onSubmit={(e) => {
                e.preventDefault()
                calcularConsumoAgua()
              }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="peso">Peso (kg)</Label>
                <Input
                  id="peso"
                  type="text"
                  placeholder="Ex: 70.5"
                  value={peso}
                  onChange={(e) => setPeso(e.target.value)}
                  aria-describedby="peso-desc"
                  required
                />
                <p id="peso-desc" className="text-xs text-muted-foreground">
                  Insira seu peso em quilogramas (kg)
                </p>
              </div>
              
              <div className="space-y-2">
                <Label>Nível de Atividade Física</Label>
                <RadioGroup 
                  value={nivelAtividade} 
                  onValueChange={setNivelAtividade}
                  className="space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="sedentario" id="sedentario" />
                    <Label htmlFor="sedentario">Sedentário (pouco ou nenhum exercício)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="moderado" id="moderado" />
                    <Label htmlFor="moderado">Moderado (exercício regular)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="intenso" id="intenso" />
                    <Label htmlFor="intenso">Intenso (exercício diário ou trabalho físico)</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <Button type="submit" className="w-full">Calcular Consumo de Água</Button>
            </form>
            
            {resultado !== null && (
              <div className="mt-6 p-4 bg-slate-800 rounded-md">
                <h3 className="font-medium text-center mb-2">Resultado</h3>
                <div className="space-y-2">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Consumo diário recomendado:</p>
                    <p className="text-2xl font-bold text-cyan-500">{resultado.litros} litros</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Equivalente a aproximadamente:</p>
                    <p className="text-xl font-bold">{resultado.copos} copos de água (250ml)</p>
                  </div>
                  <div className="mt-4 text-xs text-muted-foreground text-center">
                    <p>Lembre-se: Esta é uma estimativa. Suas necessidades podem variar de acordo com o clima, 
                    atividade física e condições de saúde específicas.</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
