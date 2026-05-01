'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Settings, LayoutGrid, Menu, X } from 'lucide-react';

export const AzentosLogo = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg viewBox="0 0 100 100" fill="currentColor" className={className}>
    <path d="M50 0 L57 35 L95 15 L65 43 L100 50 L65 57 L95 85 L57 65 L50 100 L43 65 L5 85 L35 57 L0 50 L35 43 L5 15 L43 35 Z" />
  </svg>
);

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <nav className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/">
            <AzentosLogo className="w-10 h-10 text-white hover:text-white/80 transition-colors cursor-pointer" />
          </Link>
          <div className="hidden lg:flex items-center gap-2">
            <div className="w-8 h-[2px] bg-white"></div>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-8 text-[11px] font-medium tracking-[0.15em] uppercase text-white/80">
          <Link href="/trabalhos" className="hover:text-white transition-colors"><span className="text-white/50 mr-1">01/</span> Trabalhos</Link>
          <Link href="/servicos" className="hover:text-white transition-colors"><span className="text-white/50 mr-1">02/</span> Serviços</Link>
          <Link href="/sobre" className="hover:text-white transition-colors"><span className="text-white/50 mr-1">03/</span> Sobre</Link>
          <Link href="/contato" className="hover:text-white transition-colors"><span className="text-white/50 mr-1">04/</span> Contato</Link>
        </div>

        <div className="flex items-center gap-4">
          <button className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors hidden lg:flex">
            <Settings className="w-4 h-4 text-white" />
          </button>
          <button className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors hidden lg:flex">
             <LayoutGrid className="w-4 h-4 text-white" />
          </button>
          <button 
            className="lg:hidden w-12 h-12 flex items-center justify-center text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div className="absolute top-20 left-4 right-4 bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 z-50 flex flex-col gap-6">
          <Link href="/trabalhos" onClick={() => setIsMobileMenuOpen(false)} className="text-sm tracking-widest uppercase"><span className="text-white/50 mr-1">01/</span> Trabalhos</Link>
          <Link href="/servicos" onClick={() => setIsMobileMenuOpen(false)} className="text-sm tracking-widest uppercase"><span className="text-white/50 mr-1">02/</span> Serviços</Link>
          <Link href="/sobre" onClick={() => setIsMobileMenuOpen(false)} className="text-sm tracking-widest uppercase"><span className="text-white/50 mr-1">03/</span> Sobre</Link>
          <Link href="/contato" onClick={() => setIsMobileMenuOpen(false)} className="text-sm tracking-widest uppercase"><span className="text-white/50 mr-1">04/</span> Contato</Link>
        </div>
      )}
    </>
  );
}
