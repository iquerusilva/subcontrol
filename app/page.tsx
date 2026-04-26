'use client';

import Layout from '@/components/Layout';
import { api } from '@/services';
import { Customer, Subscription } from '@/services/types';
import { useEffect, useState } from 'react';
import { Users, CreditCard, RefreshCcw, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    customers: 0,
    activeSubs: 0,
    expiredSubs: 0,
    mrr: 0,
  });
  const [expiringSubs, setExpiringSubs] = useState<Array<Subscription & { customerName: string; planName: string; price: number }>>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const [customers, plans, subscriptions] = await Promise.all([
          api.getCustomers(),
          api.getPlans(),
          api.getSubscriptions()
        ]);

        const activeSubs = subscriptions.filter(s => s.status === 'active');
        const expiredSubs = subscriptions.filter(s => s.status === 'expired');

        // Calculate MRR (Monthly Recurring Revenue)
        const mrr = activeSubs.reduce((acc, sub) => {
          const plan = plans.find(p => p.id === sub.plan_id);
          return acc + (plan?.price || 0);
        }, 0);

        setStats({
          customers: customers.length,
          activeSubs: activeSubs.length,
          expiredSubs: expiredSubs.length,
          mrr
        });

        // Get expiring/expired soon
        const todayStr = new Date().toISOString().split('T')[0];
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        const nextWeekStr = nextWeek.toISOString().split('T')[0];

        const alertSubs = subscriptions
          .filter(s => (s.status === 'expired') || (s.status === 'active' && s.next_renewal <= nextWeekStr))
          .map(s => {
            const customer = customers.find(c => c.id === s.customer_id);
            const plan = plans.find(p => p.id === s.plan_id);
            return {
              ...s,
              customerName: customer?.name || 'Desconhecido',
              planName: plan?.name || 'Desconhecido',
              price: plan?.price || 0
            };
          })
          .sort((a, b) => new Date(a.next_renewal).getTime() - new Date(b.next_renewal).getTime());

        setExpiringSubs(alertSubs);
      } catch (error) {
        console.error('Failed to load dashboard data', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const formatDate = (dateStr: string) => 
    new Intl.DateTimeFormat('pt-BR').format(new Date(dateStr));

  if (loading) {
    return (
      <Layout>
        <div className="flex h-64 items-center justify-center">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Dashboard Overview</h1>
          <p className="text-slate-400">Suas métricas principais hoje.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <KpiCard title="Total de Clientes" value={stats.customers} icon={Users} color="text-indigo-500" bg="bg-indigo-500/10" />
          <KpiCard title="Assinaturas Ativas" value={stats.activeSubs} icon={RefreshCcw} color="text-emerald-500" bg="bg-emerald-500/10" />
          <KpiCard title="Assinaturas Vencidas" value={stats.expiredSubs} icon={CreditCard} color="text-rose-500" bg="bg-rose-500/10" borderClass="border-l-4 border-l-rose-500" />
          <KpiCard title="MRR (Receita Mensal)" value={formatCurrency(stats.mrr)} icon={TrendingUp} color="text-slate-500" bg="bg-slate-800" />
        </div>

        <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
          <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-900">
            <div>
              <h2 className="text-lg font-semibold text-white">Próximos Vencimentos e Atrasos</h2>
              <p className="text-sm text-slate-400">Assinaturas que exigem sua atenção (Vencem em até 7 dias).</p>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-950/50 text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-medium uppercase text-[10px] tracking-wider">Cliente</th>
                  <th className="px-5 py-3 font-medium uppercase text-[10px] tracking-wider">Plano / Valor</th>
                  <th className="px-5 py-3 font-medium uppercase text-[10px] tracking-wider">Vencimento</th>
                  <th className="px-5 py-3 font-medium uppercase text-[10px] tracking-wider text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {expiringSubs.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                      Nenhuma assinatura com vencimento próximo.
                    </td>
                  </tr>
                ) : (
                  expiringSubs.map((sub) => (
                    <tr key={sub.id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="px-5 py-4 font-medium text-white">{sub.customerName}</td>
                      <td className="px-5 py-4 text-slate-400">
                        {sub.planName} <span className="text-slate-500">({formatCurrency(sub.price)})</span>
                      </td>
                      <td className="px-5 py-4 text-slate-400">{formatDate(sub.next_renewal)}</td>
                      <td className="px-5 py-4 text-right">
                        <span className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold ${
                          sub.status === 'expired' 
                            ? 'bg-rose-500/10 text-rose-500' 
                            : 'bg-amber-500/10 text-amber-500'
                        }`}>
                          {sub.status === 'expired' ? 'VENCIDA' : 'VENCE EM BREVE'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function KpiCard({ title, value, icon: Icon, color, bg, borderClass }: { title: string, value: string | number, icon: any, color: string, bg: string, borderClass?: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-slate-900 rounded-2xl border border-slate-800 p-5 overflow-hidden ${borderClass || ''}`}
    >
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${bg} ${color}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-400 mb-1">{title}</p>
          <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
        </div>
      </div>
    </motion.div>
  );
}
