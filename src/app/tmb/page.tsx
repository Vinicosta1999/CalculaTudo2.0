'use client'
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Flame } from 'lucide-react'

export default function TMBPage() {
  const [peso, setPeso] = useState<string>('')
  const [altura, setAltura] = useState<string>('')
  const [idade, setIdade] = useState<string>('')
  const [genero, setGenero] = useState<string>('masculino')
  const [nivelAtividade, setNivelAtividade] = useState<string>('sedentario')
  const [resultado, setResultado] = useState<{tmb: number, total: number} | null>(null)
  
  const calcularTMB = () => {
    if (!peso || !altura || !idade) return
    
    const pesoNum = parseFloat(peso.replace(',', '.'))
    const alturaNum = parseFloat(altura.replace(',', '.'))
    const idadeNum = parseInt(idade)
    
    if (isNaN(pesoNum) || isNaN(alturaNum) || isNaN(idadeNum) || 
        pesoNum <= 0 || alturaNum <= 0 || idadeNum <= 0) {
      alert('Por favor, insira valores válidos para peso, altura e idade.')
      return
    }
    
    // Altura em cm para a fórmula
    const alturaCm = alturaNum * 100
    
    // Cálculo da TMB usando a equação Mifflin-St Jeor
    let tmb = 0
    if (genero === 'masculino') {
      tmb = 10 * pesoNum + 6.25 * alturaCm - 5 * idadeNum + 5
    } else {
      tmb = 10 * pesoNum + 6.25 * alturaCm - 5 * idadeNum - 161
    }
    
    // Fator de atividade física
    let fatorAtividade = 1.2 // Sedentário
    switch (nivelAtividade) {
      case 'leve':
        fatorAtividade = 1.375
        break
      case 'moderado':
        fatorAtividade = 1.55
        break
      case 'intenso':
        fatorAtividade = 1.725
        break
      case 'muito_intenso':
        fatorAtividade = 1.9
        break
    }
    
    // Calorias totais diárias
    const totalCalorias = tmb * fatorAtividade
    
    setResultado({
      tmb: Math.round(tmb),
      total: Math.round(totalCalorias)
    })
  }
  
  return (
    <main className="flex min-h-screen flex-col items-center p-8 pt-24 sm:p-24">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-center mb-2">
              <Flame className="h-8 w-8 text-orange-500 mr-2" />
              <CardTitle>Calculadora de TMB</CardTitle>
            </div>
            <CardDescription className="text-center">
              Calcule sua Taxa Metabólica Basal e descubra suas necessidades calóricas diárias
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form 
              onSubmit={(e) => {
                e.preventDefault()
                calcularTMB()
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
              
              <div className="space-y-2">
                <Label htmlFor="idade">Idade (anos)</Label>
                <Input
                  id="idade"
                  type="text"
                  placeholder="Ex: 30"
                  value={idade}
                  onChange={(e) => setIdade(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label>Gênero</Label>
                <RadioGroup 
                  value={genero} 
                  onValueChange={setGenero}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="masculino" id="masculino" />
                    <Label htmlFor="masculino">Masculino</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="feminino" id="feminino" />
                    <Label htmlFor="feminino">Feminino</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="nivel-atividade">Nível de Atividade Física</Label>
                <Select value={nivelAtividade} onValueChange={setNivelAtividade}>
                  <SelectTrigger id="nivel-atividade">
                    <SelectValue placeholder="Selecione seu nível de atividade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedentario">Sedentário (pouco ou nenhum exercício)</SelectItem>
                    <SelectItem value="leve">Levemente ativo (exercício leve 1-3 dias/semana)</SelectItem>
                    <SelectItem value="moderado">Moderadamente ativo (exercício moderado 3-5 dias/semana)</SelectItem>
                    <SelectItem value="intenso">Muito ativo (exercício intenso 6-7 dias/semana)</SelectItem>
                    <SelectItem value="muito_intenso">Extremamente ativo (exercício muito intenso, trabalho físico)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button type="submit" className="w-full">Calcular TMB</Button>
            </form>
            
            {resultado !== null && (
              <div className="mt-6 p-4 bg-slate-800 rounded-md">
                <h3 className="font-medium text-center mb-2">Resultado</h3>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Taxa Metabólica Basal:</p>
                    <p className="text-xl font-bold">{resultado.tmb} calorias/dia</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Necessidade calórica diária total:</p>
                    <p className="text-2xl font-bold text-orange-500">{resultado.total} calorias/dia</p>
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
