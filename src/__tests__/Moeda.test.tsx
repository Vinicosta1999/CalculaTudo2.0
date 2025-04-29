import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, jest } from '@jest/globals'
import MoedaPage from '@/app/moeda/page'

// Mock da API de moedas
jest.mock('@/lib/api/currency', () => ({
  convertCurrency: jest.fn().mockImplementation((amount, fromCurrency, toCurrency) => {
    // Simula taxas de conversão fixas para testes
    const rates = {
      'BRL-USD': 0.20,
      'USD-BRL': 5.00,
      'EUR-USD': 1.09,
      'USD-EUR': 0.92
    }
    
    // Se as moedas são iguais, retorna o mesmo valor
    if (fromCurrency === toCurrency) {
      return Promise.resolve({
        convertedAmount: amount,
        exchangeRate: 1
      })
    }
    
    // Busca a taxa de câmbio
    const key = `${fromCurrency}-${toCurrency}`
    const rate = rates[key] || 1
    
    return Promise.resolve({
      convertedAmount: parseFloat((amount * rate).toFixed(2)),
      exchangeRate: rate
    })
  })
}))

// Mock dos componentes que usam 'use client'
jest.mock('next/navigation', () => ({
  usePathname: () => '/moeda',
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn()
  })
}))

describe('Conversor de Moedas', () => {
  it('deve renderizar o formulário de conversão de moedas', () => {
    render(<MoedaPage />)
    
    expect(screen.getByText('Conversor de Moedas')).toBeInTheDocument()
    expect(screen.getByLabelText('Valor')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /converter/i })).toBeInTheDocument()
  })

  it('deve converter de BRL para USD corretamente', async () => {
    render(<MoedaPage />)
    
    // Preenche o campo de valor
    fireEvent.change(screen.getByLabelText('Valor'), { target: { value: '100' } })
    
    // Seleciona as moedas (BRL e USD já são os valores padrão)
    
    // Clica no botão de converter
    fireEvent.click(screen.getByRole('button', { name: /converter/i }))
    
    // Aguarda o resultado da conversão
    await waitFor(() => {
      // Verifica se o resultado foi calculado corretamente
      // 100 BRL = 20 USD (taxa 0.20)
      expect(screen.getByText(/R\$\s*100,00\s*=/)).toBeInTheDocument()
      expect(screen.getByText(/US\$\s*20\.00/)).toBeInTheDocument()
    })
  })

  it('deve converter de USD para BRL corretamente', async () => {
    render(<MoedaPage />)
    
    // Preenche o campo de valor
    fireEvent.change(screen.getByLabelText('Valor'), { target: { value: '50' } })
    
    // Seleciona as moedas
    fireEvent.click(screen.getByRole('button', { name: /de/i }))
    fireEvent.click(screen.getByText(/dólar americano/i))
    
    fireEvent.click(screen.getByRole('button', { name: /para/i }))
    fireEvent.click(screen.getByText(/real brasileiro/i))
    
    // Clica no botão de converter
    fireEvent.click(screen.getByRole('button', { name: /converter/i }))
    
    // Aguarda o resultado da conversão
    await waitFor(() => {
      // Verifica se o resultado foi calculado corretamente
      // 50 USD = 250 BRL (taxa 5.00)
      expect(screen.getByText(/US\$\s*50\.00\s*=/)).toBeInTheDocument()
      expect(screen.getByText(/R\$\s*250,00/)).toBeInTheDocument()
    })
  })

  it('deve permitir inverter as moedas', async () => {
    render(<MoedaPage />)
    
    // Preenche o campo de valor
    fireEvent.change(screen.getByLabelText('Valor'), { target: { value: '100' } })
    
    // Clica no botão de inverter moedas
    fireEvent.click(screen.getByRole('button', { name: /inverter moedas/i }))
    
    // Clica no botão de converter
    fireEvent.click(screen.getByRole('button', { name: /converter/i }))
    
    // Aguarda o resultado da conversão
    await waitFor(() => {
      // Verifica se as moedas foram invertidas e o resultado foi calculado corretamente
      // 100 USD = 500 BRL (taxa 5.00)
      expect(screen.getByText(/US\$\s*100\.00\s*=/)).toBeInTheDocument()
      expect(screen.getByText(/R\$\s*500,00/)).toBeInTheDocument()
    })
  })
})
