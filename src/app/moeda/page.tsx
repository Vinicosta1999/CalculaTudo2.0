'use client'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DollarSign, ArrowRightLeft, RefreshCw } from 'lucide-react'
import { convertCurrency } from '@/lib/api/currency'

export default function MoedaPage() {
  const [valor, setValor] = useState<string>('')
  const [moedaOrigem, setMoedaOrigem] = useState<string>('BRL')
  const [moedaDestino, setMoedaDestino] = useState<string>('USD')
  const [resultado, setResultado] = useState<{valorConvertido: number, taxa: number} | null>(null)
  const [carregando, setCarregando] = useState<boolean>(false)
  const [ultimaAtualizacao, setUltimaAtualizacao] = useState<string>('')
  
  const moedas = [
    { valor: 'BRL', nome: 'Real Brasileiro (BRL)' },
    { valor: 'USD', nome: 'Dólar Americano (USD)' },
    { valor: 'EUR', nome: 'Euro (EUR)' },
    { valor: 'GBP', nome: 'Libra Esterlina (GBP)' },
    { valor: 'JPY', nome: 'Iene Japonês (JPY)' },
    { valor: 'CAD', nome: 'Dólar Canadense (CAD)' },
    { valor: 'AUD', nome: 'Dólar Australiano (AUD)' },
    { valor: 'CNY', nome: 'Yuan Chinês (CNY)' }
  ]
  
  useEffect(() => {
    // Atualiza a hora da última atualização
    setUltimaAtualizacao(new Date().toLocaleTimeString('pt-BR'))
  }, [])
  
  const converterMoeda = async () => {
    if (!valor || !moedaOrigem || !moedaDestino) return
    
    const valorNum = parseFloat(valor.replace(',', '.'))
    
    if (isNaN(valorNum) || valorNum <= 0) {
      alert('Por favor, insira um valor válido.')
      return
    }
    
    setCarregando(true)
    
    try {
      // Chama a API para converter a moeda
      const resultado = await convertCurrency(valorNum, moedaOrigem, moedaDestino)
      
      setResultado({
        valorConvertido: resultado.convertedAmount,
        taxa: resultado.exchangeRate
      })
      
      // Atualiza a hora da última atualização
      setUltimaAtualizacao(new Date().toLocaleTimeString('pt-BR'))
    } catch (error) {
      console.error('Erro ao converter moeda:', error)
      alert('Ocorreu um erro ao converter a moeda. Por favor, tente novamente.')
    } finally {
      setCarregando(false)
    }
  }
  
  const inverterMoedas = () => {
    const temp = moedaOrigem
    setMoedaOrigem(moedaDestino)
    setMoedaDestino(temp)
    
    // Se já houver um resultado, recalcula com as moedas invertidas
    if (resultado && valor) {
      converterMoeda()
    }
  }
  
  const formatarMoeda = (valor: number, moeda: string) => {
    const opcoes = {
      BRL: { style: 'currency', currency: 'BRL' },
      USD: { style: 'currency', currency: 'USD' },
      EUR: { style: 'currency', currency: 'EUR' },
      GBP: { style: 'currency', currency: 'GBP' },
      JPY: { style: 'currency', currency: 'JPY' },
      CAD: { style: 'currency', currency: 'CAD' },
      AUD: { style: 'currency', currency: 'AUD' },
      CNY: { style: 'currency', currency: 'CNY' }
    }
    
    return new Intl.NumberFormat('pt-BR', opcoes[moeda]).format(valor)
  }
  
  return (
    <main className="flex min-h-screen flex-col items-center p-8 pt-24 sm:p-24">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-center mb-2">
              <DollarSign className="h-8 w-8 text-green-500 mr-2" />
              <CardTitle>Conversor de Moedas</CardTitle>
            </div>
            <CardDescription className="text-center">
              Converta valores entre diferentes moedas com taxas atualizadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form 
              onSubmit={(e) => {
                e.preventDefault()
                converterMoeda()
              }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="valor">Valor</Label>
                <Input
                  id="valor"
                  type="text"
                  placeholder="Ex: 100.00"
                  value={valor}
                  onChange={(e) => setValor(e.target.value)}
                  required
                  aria-describedby="valor-desc"
                />
                <p id="valor-desc" className="text-xs text-muted-foreground">
                  Insira o valor que deseja converter
                </p>
              </div>
              
              <div className="grid grid-cols-[1fr,auto,1fr] items-end gap-2">
                <div className="space-y-2">
                  <Label htmlFor="moeda-origem">De</Label>
                  <Select value={moedaOrigem} onValueChange={setMoedaOrigem}>
                    <SelectTrigger id="moeda-origem">
                      <SelectValue placeholder="Selecione a moeda" />
                    </SelectTrigger>
                    <SelectContent>
                      {moedas.map((moeda) => (
                        <SelectItem key={moeda.valor} value={moeda.valor}>
                          {moeda.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  size="icon" 
                  onClick={inverterMoedas}
                  className="mb-0.5"
                  aria-label="Inverter moedas"
                >
                  <ArrowRightLeft className="h-4 w-4" />
                </Button>
                
                <div className="space-y-2">
                  <Label htmlFor="moeda-destino">Para</Label>
                  <Select value={moedaDestino} onValueChange={setMoedaDestino}>
                    <SelectTrigger id="moeda-destino">
                      <SelectValue placeholder="Selecione a moeda" />
                    </SelectTrigger>
                    <SelectContent>
                      {moedas.map((moeda) => (
                        <SelectItem key={moeda.valor} value={moeda.valor}>
                          {moeda.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full"
                disabled={carregando}
              >
                {carregando ? 'Convertendo...' : 'Converter'}
              </Button>
            </form>
            
            {resultado !== null && (
              <div className="mt-6 p-4 bg-slate-800 rounded-md">
                <h3 className="font-medium text-center mb-2">Resultado</h3>
                <div className="space-y-2">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      {formatarMoeda(parseFloat(valor.replace(',', '.')), moedaOrigem)} =
                    </p>
                    <p className="text-2xl font-bold text-green-500">
                      {formatarMoeda(resultado.valorConvertido, moedaDestino)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">
                      Taxa de câmbio: 1 {moedaOrigem} = {resultado.taxa} {moedaDestino}
                    </p>
                    <div className="flex items-center justify-center mt-2 text-xs text-muted-foreground">
                      <RefreshCw className="h-3 w-3 mr-1" />
                      <span>Última atualização: {ultimaAtualizacao}</span>
                    </div>
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
