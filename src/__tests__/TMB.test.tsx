import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from '@jest/globals'
import TMBPage from '@/app/tmb/page'

// Mock dos componentes que usam 'use client'
jest.mock('next/navigation', () => ({
  usePathname: () => '/tmb',
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn()
  })
}))

describe('Calculadora de TMB', () => {
  it('deve renderizar o formulário de TMB', () => {
    render(<TMBPage />)
    
    expect(screen.getByText('Calculadora de TMB')).toBeInTheDocument()
    expect(screen.getByLabelText('Peso (kg)')).toBeInTheDocument()
    expect(screen.getByLabelText('Altura (m)')).toBeInTheDocument()
    expect(screen.getByLabelText('Idade (anos)')).toBeInTheDocument()
    expect(screen.getByLabelText('Masculino')).toBeInTheDocument()
    expect(screen.getByLabelText('Feminino')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /calcular tmb/i })).toBeInTheDocument()
  })

  it('deve calcular a TMB corretamente para homem', () => {
    render(<TMBPage />)
    
    // Preenche os campos do formulário
    fireEvent.change(screen.getByLabelText('Peso (kg)'), { target: { value: '70' } })
    fireEvent.change(screen.getByLabelText('Altura (m)'), { target: { value: '1.75' } })
    fireEvent.change(screen.getByLabelText('Idade (anos)'), { target: { value: '30' } })
    fireEvent.click(screen.getByLabelText('Masculino'))
    
    // Clica no botão de calcular
    fireEvent.click(screen.getByRole('button', { name: /calcular tmb/i }))
    
    // Verifica se o resultado foi calculado corretamente
    // TMB = 10 * 70 + 6.25 * 175 - 5 * 30 + 5 = 1662.5
    expect(screen.getByText('1663 calorias/dia')).toBeInTheDocument()
  })

  it('deve calcular a TMB corretamente para mulher', () => {
    render(<TMBPage />)
    
    // Preenche os campos do formulário
    fireEvent.change(screen.getByLabelText('Peso (kg)'), { target: { value: '60' } })
    fireEvent.change(screen.getByLabelText('Altura (m)'), { target: { value: '1.65' } })
    fireEvent.change(screen.getByLabelText('Idade (anos)'), { target: { value: '25' } })
    fireEvent.click(screen.getByLabelText('Feminino'))
    
    // Clica no botão de calcular
    fireEvent.click(screen.getByRole('button', { name: /calcular tmb/i }))
    
    // Verifica se o resultado foi calculado corretamente
    // TMB = 10 * 60 + 6.25 * 165 - 5 * 25 - 161 = 1270.25
    expect(screen.getByText('1270 calorias/dia')).toBeInTheDocument()
  })

  it('deve ajustar as calorias totais com base no nível de atividade', () => {
    render(<TMBPage />)
    
    // Preenche os campos do formulário
    fireEvent.change(screen.getByLabelText('Peso (kg)'), { target: { value: '70' } })
    fireEvent.change(screen.getByLabelText('Altura (m)'), { target: { value: '1.75' } })
    fireEvent.change(screen.getByLabelText('Idade (anos)'), { target: { value: '30' } })
    
    // Seleciona o nível de atividade
    fireEvent.click(screen.getByRole('button', { name: /selecione seu nível de atividade/i }))
    fireEvent.click(screen.getByText('Muito ativo (exercício intenso 6-7 dias/semana)'))
    
    // Clica no botão de calcular
    fireEvent.click(screen.getByRole('button', { name: /calcular tmb/i }))
    
    // Verifica se o resultado foi ajustado para o nível de atividade
    // TMB = 1663, Fator = 1.725, Total = 1663 * 1.725 = 2868.675
    expect(screen.getByText('2869 calorias/dia')).toBeInTheDocument()
  })
})
