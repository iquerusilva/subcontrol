import { AuthProvider } from '@/components/AuthProvider';
import '@/app/globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="dark">
      <body className="antialiased font-sans bg-slate-950 text-slate-200 selection:bg-indigo-500/30" suppressHydrationWarning>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
