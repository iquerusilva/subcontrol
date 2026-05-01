'use client';

import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar, { AzentosLogo } from '@/components/Navbar';

export default function Home() {
  return (
    <main className="relative min-h-screen bg-[#050505] overflow-hidden text-white font-sans selection:bg-white selection:text-[#C1121F]">
      {/* Background gradient & atmosphere */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FF5A00] via-[#C1121F] to-[#2a0404] opacity-90"></div>
        
        {/* Model Image from User */}
        <div className="absolute top-[20%] lg:top-[10%] left-1/2 -translate-x-1/2 w-[600px] lg:w-[850px] h-[70vh] lg:h-[80vh] flex items-center justify-center mix-blend-luminosity opacity-90">
            {/* O modelo. A classe -scale-x-100 inverte a imagem horizontalmente para ele olhar para a direita */}
            {/* mix-blend-luminosity ou mix-blend-screen ajudam a mesclar o fundo escuro da foto com o gradiente */}
            <img 
              src="/modelo.png" 
              alt="Modelo" 
              className="object-contain object-center w-full h-full -scale-x-100 drop-shadow-2xl" 
            />
        </div>
      </div>

      {/* Main Content Wrapper */}
      <div className="relative z-10 min-h-screen flex flex-col justify-between max-w-screen-2xl mx-auto md:px-8 px-4 py-6">
        
        {/* Navigation */}
        <Navbar />

        {/* Hero Body */}
        <div className="flex flex-col lg:flex-row items-center justify-between mt-12 lg:mt-20 flex-grow relative">
          
          {/* Left Column (Desktop) / Top Section (Mobile) */}
          <div className="w-full lg:w-1/3 flex flex-col gap-6 lg:gap-12 z-20">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h1 className="text-3xl md:text-5xl lg:text-[56px] font-medium leading-[1.05] tracking-tight uppercase">
                Desbloqueie o<br/>potencial do seu<br/>negócio com nossas<br/>soluções.
              </h1>
            </motion.div>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
              className="text-white/80 text-sm md:text-base max-w-sm lg:pr-8 leading-relaxed"
            >
              De estratégias inovadoras de <strong className="text-white font-semibold">marketing</strong> à excelência operacional.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Link
                href="/sobre"
                className="bg-[#6b080f] hover:bg-[#850b14] transition-colors text-white uppercase tracking-[0.1em] text-xs font-semibold py-4 md:py-5 px-8 md:px-10 rounded-full w-fit mt-4 inline-block text-center"
              >
                Saiba Mais
              </Link>
            </motion.div>

            {/* Left Bento Cards Group */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-4 mt-12 lg:mt-24 w-full max-w-xl">
              
              {/* White Card */}
              <motion.div 
                whileHover={{ y: -5 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-white rounded-3xl p-6 lg:p-8 flex flex-col justify-between aspect-[4/3] sm:aspect-square lg:aspect-auto lg:h-[220px] text-black w-full"
              >
                <div className="flex justify-between items-start mb-10">
                  <AzentosLogo className="w-8 h-8 text-black" />
                </div>
                <div>
                  <h3 className="text-5xl md:text-6xl font-medium tracking-tighter">472+</h3>
                  <p className="text-xs md:text-sm font-medium mt-2 tracking-wide text-black/70">Soluções completas.</p>
                </div>
              </motion.div>

            </div>
          </div>

          {/* Right Column / Bento Cards */}
          <div className="w-full lg:w-1/3 flex flex-col items-end gap-6 lg:gap-12 z-20 mt-16 lg:mt-0">
             
             {/* Large Right Side Headline */}
             <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className="text-right w-full flex flex-col items-end"
             >
              <h2 className="text-5xl sm:text-7xl lg:text-[80px] xl:text-[100px] leading-[0.85] font-medium tracking-tighter uppercase text-right">
                Estúdio<br/>
                <span className="opacity-60 text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40">Criativo</span><br/>
                Digital
              </h2>
             </motion.div>
             
             <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
              className="text-white/80 text-sm md:text-base max-w-xs text-right mt-6 lg:mt-8 leading-relaxed"
            >
              De estratégias inovadoras de <strong className="text-white">marketing</strong> à excelência operacional, oferecemos orientação especializada para o seu negócio crescer e prosperar.
            </motion.p>

            {/* Right Cards Group */}
            <div className="flex flex-col sm:flex-row lg:flex-row justify-end items-stretch gap-4 mt-8 lg:mt-12 w-full">
              
               {/* Orange Gradient Card */}
               <motion.div 
                whileHover={{ y: -5 }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-gradient-to-br from-[#FF5A00] to-[#E04000] rounded-3xl p-6 lg:p-8 flex flex-col justify-between aspect-[4/3] sm:aspect-square lg:aspect-auto lg:h-[220px] lg:w-[220px] w-full flex-shrink-0 relative overflow-hidden"
              >
                <div className="absolute -top-4 -right-4 blur-xl opacity-50 bg-white w-20 h-20 rounded-full"></div>
                <div className="flex justify-between items-start mb-10 z-10">
                  <span className="text-white/90 text-sm font-medium leading-tight w-24">Inicie o crescimento da sua agência</span>
                  <div className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13"/>
                    </svg>
                  </div>
                </div>
                <div className="z-10">
                  <h3 className="text-5xl md:text-6xl font-medium tracking-tighter text-white">597+</h3>
                  <p className="text-xs md:text-sm font-medium mt-2 tracking-wide text-white/80">Empresas Prósperas</p>
                </div>
              </motion.div>

              {/* Dark Glass Card */}
              <motion.div 
                whileHover={{ y: -5 }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="bg-black/20 backdrop-blur-md border border-white/10 rounded-3xl p-6 flex flex-col justify-between aspect-[4/3] sm:aspect-square lg:aspect-auto lg:h-[220px] flex-grow sm:flex-grow lg:w-auto w-full relative"
              >
                <div className="flex justify-between items-start mb-6">
                  <span className="text-xl md:text-2xl font-medium leading-[1.1] max-w-[120px]">Seu Parceiro de Negócios</span>
                  <Link href="/contato" className="w-10 h-10 rounded-full bg-red-900/40 border border-red-500/30 flex items-center justify-center shrink-0 hover:bg-red-800/60 transition-colors">
                    <ArrowUpRight className="w-5 h-5 text-[#FF5A00]" />
                  </Link>
                </div>
                
                <div className="flex flex-col gap-4 mt-auto">
                   <p className="text-[10px] text-white/60 leading-relaxed uppercase tracking-wider">
                     / De estratégias de marketing<br/>inovadoras à excelência<br/>operacional /
                   </p>
                   <div className="flex items-center gap-2 border border-white/20 rounded-full p-1 pl-3 w-fit bg-black/30">
                     <div className="flex -space-x-2">
                       <div className="w-6 h-6 rounded-full bg-gray-600 border border-[#111] overflow-hidden relative">
                         <Image src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50&h=50&fit=crop" width={24} height={24} alt="User" referrerPolicy="no-referrer" />
                       </div>
                       <div className="w-6 h-6 rounded-full bg-gray-500 border border-[#111] overflow-hidden relative">
                         <Image src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=50&h=50&fit=crop" width={24} height={24} alt="User" referrerPolicy="no-referrer" />
                       </div>
                     </div>
                     <span className="text-[10px] font-semibold tracking-wider px-2 border-l border-white/20 h-4 flex items-center">1000K+</span>
                   </div>
                </div>
              </motion.div>

            </div>
          </div>
        </div>

        {/* Giant Bottom Text */}
        <div className="w-full mt-24 lg:mt-32 overflow-hidden flex justify-center -mb-8 lg:-mb-16 pointer-events-none select-none">
          <motion.h1 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 0.15, y: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
            className="text-[16vw] font-bold leading-[0.75] tracking-tighter uppercase text-white mix-blend-overlay max-h-[14vw]"
          >
            BRANDING
          </motion.h1>
        </div>

      </div>
    </main>
  );
}
