import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'
import Navbar from '@/components/calculadoras/Navbar'
import { AccessibilityProvider } from '@/components/calculadoras/AccessibilityProvider'
import AccessibilityControls from '@/components/calculadoras/AccessibilityControls'

export const metadata: Metadata = {
  title: 'CalculaTudo - Facilitando Seu Dia a Dia com Cálculos',
  description: 'Plataforma para cálculos de conversão de moedas, IMC, TMB e quantidade de água diária'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <a href="#conteudo-principal" className="skip-link">
          Pular para o conteúdo principal
        </a>
        <AccessibilityProvider>
          <Navbar />
          <main id="conteudo-principal" tabIndex={-1}>
            {children}
          </main>
          <AccessibilityControls />
        </AccessibilityProvider>
      </body>
    </html>
  )
}
