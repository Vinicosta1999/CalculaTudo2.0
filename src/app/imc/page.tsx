'use client'
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Calculator } from 'lucide-react'

export default function IMCPage() {
  const [peso, setPeso] = useState<string>('')
  const [altura, setAltura] = useState<string>('')
  const [resultado, setResultado] = useState<number | null>(null)
  const [classificacao, setClassificacao] = useState<string>('')
  
  const calcularIMC = () => {
    if (!peso || !altura) return
    
    const pesoNum = parseFloat(peso.replace(',', '.'))
    const alturaNum = parseFloat(altura.replace(',', '.'))
    
    if (isNaN(pesoNum) || isNaN(alturaNum) || pesoNum <= 0 || alturaNum <= 0) {
      alert('Por favor, insira valores válidos para peso e altura.')
      return
    }
    
    // Cálculo do IMC: peso (kg) / altura² (m)
    const imc = pesoNum / (alturaNum * alturaNum)
    setResultado(imc)
    
    // Classificação do IMC
    if (imc < 18.5) {
      setClassificacao('Abaixo do peso')
    } else if (imc < 25) {
      setClassificacao('Peso normal')
    } else if (imc < 30) {
      setClassificacao('Sobrepeso')
    } else if (imc < 35) {
      setClassificacao('Obesidade grau 1')
    } else if (imc < 40) {
      setClassificacao('Obesidade grau 2')
    } else {
      setClassificacao('Obesidade grau 3')
    }
  }
  
  return (
    <main className="flex min-h-screen flex-col items-center p-8 pt-24 sm:p-24">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-center mb-2">
              <Calculator className="h-8 w-8 text-blue-500 mr-2" />
              <CardTitle>Calculadora de IMC</CardTitle>
            </div>
            <CardDescription className="text-center">
              Calcule seu Índice de Massa Corporal e descubra sua faixa de peso ideal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form 
              onSubmit={(e) => {
                e.preventDefault()
                calcularIMC()
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
                <Label htmlFor="altura">Altura (m)</Label>
                <Input
                  id="altura"
                  type="text"
                  placeholder="Ex: 1.75"
                  value={altura}
                  onChange={(e) => setAltura(e.target.value)}
                  aria-describedby="altura-desc"
                  required
                />
                <p id="altura-desc" className="text-xs text-muted-foreground">
                  Insira sua altura em metros (m)
                </p>
              </div>
              
              <Button type="submit" className="w-full">Calcular IMC</Button>
            </form>
            
            {resultado !== null && (
              <div className="mt-6 p-4 bg-slate-800 rounded-md">
                <h3 className="font-medium text-center mb-2">Resultado</h3>
                <p className="text-center text-2xl font-bold mb-2">
                  {resultado.toFixed(2)}
                </p>
                <p className="text-center font-medium" style={{ 
                  color: 
                    classificacao === 'Peso normal' ? 'rgb(34, 197, 94)' : 
                    classificacao === 'Abaixo do peso' ? 'rgb(250, 204, 21)' : 
                    'rgb(239, 68, 68)' 
                }}>
                  {classificacao}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
