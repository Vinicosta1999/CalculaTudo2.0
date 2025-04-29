'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Calculator, Droplets, DollarSign, Flame, Home } from 'lucide-react'

export default function Navbar() {
  const pathname = usePathname()
  
  return (
    <nav className="bg-slate-900 p-4 sticky top-0 z-10 shadow-md" role="navigation" aria-label="Navegação principal">
      <div className="container mx-auto flex flex-wrap justify-between items-center">
        <Link href="/" className="text-xl font-bold flex items-center">
          <span className="sr-only">CalculaTudo - Página Inicial</span>
          <span aria-hidden="true">CalculaTudo</span>
        </Link>
        
        <div className="flex space-x-1 sm:space-x-4 overflow-x-auto pb-2 sm:pb-0">
          <NavLink href="/" icon={<Home className="h-4 w-4 mr-1" />} label="Início" isActive={pathname === '/'} />
          <NavLink href="/moeda" icon={<DollarSign className="h-4 w-4 mr-1" />} label="Moedas" isActive={pathname === '/moeda'} />
          <NavLink href="/imc" icon={<Calculator className="h-4 w-4 mr-1" />} label="IMC" isActive={pathname === '/imc'} />
          <NavLink href="/tmb" icon={<Flame className="h-4 w-4 mr-1" />} label="TMB" isActive={pathname === '/tmb'} />
          <NavLink href="/agua" icon={<Droplets className="h-4 w-4 mr-1" />} label="Água" isActive={pathname === '/agua'} />
        </div>
      </div>
    </nav>
  )
}

function NavLink({ href, icon, label, isActive }: { href: string; icon: React.ReactNode; label: string; isActive: boolean }) {
  return (
    <Link 
      href={href}
      className={`px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors
        ${isActive 
          ? 'bg-slate-800 text-white' 
          : 'text-gray-300 hover:bg-slate-800 hover:text-white'
        }`}
      aria-current={isActive ? 'page' : undefined}
    >
      {icon}
      {label}
    </Link>
  )
}
