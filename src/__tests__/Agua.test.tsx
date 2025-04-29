import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from '@jest/globals'
import AguaPage from '@/app/agua/page'

// Mock dos componentes que usam 'use client'
jest.mock('next/navigation', () => ({
  usePathname: () => '/agua',
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn()
  })
}))

describe('Calculadora de Consumo de Água', () => {
  it('deve renderizar o formulário de consumo de água', () => {
    render(<AguaPage />)
    
    expect(screen.getByText('Calculadora de Consumo de Água')).toBeInTheDocument()
    expect(screen.getByLabelText('Peso (kg)')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /calcular consumo de água/i })).toBeInTheDocument()
  })

  it('deve calcular o consumo de água corretamente para nível moderado', () => {
    render(<AguaPage />)
    
    // Preenche o campo de peso
    fireEvent.change(screen.getByLabelText('Peso (kg)'), { target: { value: '70' } })
    
    // Seleciona o nível de atividade moderado (já é o padrão)
    fireEvent.click(screen.getByLabelText('Moderado (exercício regular)'))
    
    // Clica no botão de calcular
    fireEvent.click(screen.getByRole('button', { name: /calcular consumo de água/i }))
    
    // Verifica se o resultado foi calculado corretamente
    // Consumo = 70 * 0.035 = 2.45 litros
    expect(screen.getByText('2.45 litros')).toBeInTheDocument()
    
    // Verifica se a conversão para copos está correta
    // Copos = 2.45 * 1000 / 250 = 9.8 = 10 copos (arredondado para cima)
    expect(screen.getByText('10 copos de água (250ml)')).toBeInTheDocument()
  })

  it('deve ajustar o consumo de água com base no nível de atividade', () => {
    render(<AguaPage />)
    
    // Preenche o campo de peso
    fireEvent.change(screen.getByLabelText('Peso (kg)'), { target: { value: '70' } })
    
    // Seleciona o nível de atividade sedentário
    fireEvent.click(screen.getByLabelText('Sedentário (pouco ou nenhum exercício)'))
    
    // Clica no botão de calcular
    fireEvent.click(screen.getByRole('button', { name: /calcular consumo de água/i }))
    
    // Verifica se o resultado foi ajustado para nível sedentário
    // Consumo = 70 * 0.03 = 2.1 litros
    expect(screen.getByText('2.1 litros')).toBeInTheDocument()
    
    // Seleciona o nível de atividade intenso
    fireEvent.click(screen.getByLabelText('Intenso (exercício diário ou trabalho físico)'))
    
    // Clica no botão de calcular
    fireEvent.click(screen.getByRole('button', { name: /calcular consumo de água/i }))
    
    // Verifica se o resultado foi ajustado para nível intenso
    // Consumo = 70 * 0.04 = 2.8 litros
    expect(screen.getByText('2.8 litros')).toBeInTheDocument()
  })
})
