import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from '@jest/globals'
import IMCPage from '@/app/imc/page'

// Mock dos componentes que usam 'use client'
jest.mock('next/navigation', () => ({
  usePathname: () => '/imc',
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn()
  })
}))

describe('Calculadora de IMC', () => {
  it('deve renderizar o formulário de IMC', () => {
    render(<IMCPage />)
    
    expect(screen.getByText('Calculadora de IMC')).toBeInTheDocument()
    expect(screen.getByLabelText('Peso (kg)')).toBeInTheDocument()
    expect(screen.getByLabelText('Altura (m)')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /calcular imc/i })).toBeInTheDocument()
  })

  it('deve calcular o IMC corretamente', () => {
    render(<IMCPage />)
    
    // Preenche os campos do formulário
    fireEvent.change(screen.getByLabelText('Peso (kg)'), { target: { value: '70' } })
    fireEvent.change(screen.getByLabelText('Altura (m)'), { target: { value: '1.75' } })
    
    // Clica no botão de calcular
    fireEvent.click(screen.getByRole('button', { name: /calcular imc/i }))
    
    // Verifica se o resultado foi calculado corretamente
    // IMC = 70 / (1.75 * 1.75) = 22.86
    expect(screen.getByText('22.86')).toBeInTheDocument()
    expect(screen.getByText('Peso normal')).toBeInTheDocument()
  })

  it('deve mostrar classificação correta para diferentes faixas de IMC', () => {
    render(<IMCPage />)
    
    // Teste para IMC abaixo do peso
    fireEvent.change(screen.getByLabelText('Peso (kg)'), { target: { value: '50' } })
    fireEvent.change(screen.getByLabelText('Altura (m)'), { target: { value: '1.75' } })
    fireEvent.click(screen.getByRole('button', { name: /calcular imc/i }))
    expect(screen.getByText('Abaixo do peso')).toBeInTheDocument()
    
    // Teste para IMC sobrepeso
    fireEvent.change(screen.getByLabelText('Peso (kg)'), { target: { value: '85' } })
    fireEvent.change(screen.getByLabelText('Altura (m)'), { target: { value: '1.75' } })
    fireEvent.click(screen.getByRole('button', { name: /calcular imc/i }))
    expect(screen.getByText('Sobrepeso')).toBeInTheDocument()
  })
})
