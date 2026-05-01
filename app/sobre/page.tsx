import Navbar from '@/components/Navbar';

export default function SobrePage() {
  return (
    <main className="relative min-h-screen bg-[#050505] overflow-hidden text-white font-sans selection:bg-white selection:text-[#C1121F]">
      {/* Background gradient & atmosphere */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FF5A00] via-[#C1121F] to-[#2a0404] opacity-90"></div>
        <div className="absolute top-[10%] lg:top-[5%] left-1/2 -translate-x-1/2 w-[800px] lg:w-[1200px] h-[800px] lg:h-[1200px] opacity-70 mix-blend-multiply flex items-center justify-center">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#FF5A00]/80 via-[#C1121F]/30 to-transparent blur-[100px] rounded-full"></div>
        </div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col max-w-screen-2xl mx-auto md:px-8 px-4 py-6">
        <Navbar />
        
        <div className="flex-grow flex items-center justify-center flex-col text-center">
          <h1 className="text-5xl md:text-7xl font-bold uppercase tracking-tighter mb-6">Sobre Nós</h1>
          <p className="text-white/60 max-w-lg leading-relaxed">
            Nossa missão é desbloquear o potencial do seu negócio através de estratégias inovadoras. Em breve.
          </p>
        </div>
      </div>
    </main>
  );
}
