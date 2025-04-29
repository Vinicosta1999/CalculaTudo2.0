import { render, screen } from '@testing-library/react'
import { describe, it, expect } from '@jest/globals'
import Home from '@/app/page'

// Mock dos componentes que usam 'use client'
jest.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn()
  })
}))

describe('Página Inicial', () => {
  it('deve renderizar o título principal', () => {
    render(<Home />)
    const heading = screen.getByText('CalculaTudo')
    expect(heading).toBeInTheDocument()
  })

  it('deve renderizar os quatro cards de calculadoras', () => {
    render(<Home />)
    
    // Verifica se os títulos das calculadoras estão presentes
    expect(screen.getByText('Conversão de Moedas')).toBeInTheDocument()
    expect(screen.getByText('Cálculo de IMC')).toBeInTheDocument()
    expect(screen.getByText('Taxa Metabólica Basal')).toBeInTheDocument()
    expect(screen.getByText('Consumo de Água')).toBeInTheDocument()
  })

  it('deve ter links para as páginas de calculadoras', () => {
    render(<Home />)
    
    // Verifica se os links para as calculadoras estão presentes
    const links = screen.getAllByRole('link')
    const hrefs = links.map(link => link.getAttribute('href'))
    
    expect(hrefs).toContain('/moeda')
    expect(hrefs).toContain('/imc')
    expect(hrefs).toContain('/tmb')
    expect(hrefs).toContain('/agua')
  })
})
