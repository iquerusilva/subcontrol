'use client';

import Layout from '@/components/Layout';
import { Modal } from '@/components/Modal';
import { api } from '@/services';
import { Subscription, Customer, Plan, Payment } from '@/services/types';
import { toast } from '@/lib/toast';
import { useEffect, useState } from 'react';
import { Plus, Search, CheckCircle } from 'lucide-react';

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [subs, setSubs] = useState<Subscription[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    subscription_id: '',
    amount: 0,
    paid_at: new Date().toISOString().split('T')[0]
  });

  const loadData = async () => {
    try {
      const [payData, subsData, custData, plansData] = await Promise.all([
        api.getPayments(),
        api.getSubscriptions(),
        api.getCustomers(),
        api.getPlans()
      ]);
      // Sort payments newest first
      payData.sort((a,b) => new Date(b.paid_at).getTime() - new Date(a.paid_at).getTime());
      
      setPayments(payData);
      setSubs(subsData);
      setCustomers(custData);
      setPlans(plansData);
    } catch (err) {
      toast('Erro ao carregar pagamentos', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Update amount automatically when subscription changes
  useEffect(() => {
    if (formData.subscription_id && plans.length > 0) {
      const sub = subs.find(s => s.id === formData.subscription_id);
      if (sub) {
        const plan = plans.find(p => p.id === sub.plan_id);
        if (plan) {
          setFormData(prev => ({ ...prev, amount: plan.price }));
        }
      }
    }
  }, [formData.subscription_id, subs, plans]);

  const handleOpenModal = () => {
    setFormData({ 
      subscription_id: '', 
      amount: 0, 
      paid_at: new Date().toISOString()
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.subscription_id) {
       toast('Selecione uma assinatura válida.', 'error');
       return;
    }
    setSaving(true);
    try {
      // Convert paid_at back to full ISO string
      const fullDate = new Date(formData.paid_at).toISOString();
      await api.createPayment(formData.subscription_id, formData.amount, fullDate);
      toast('Pagamento registrado. Assinatura renovada.', 'success');
      setIsModalOpen(false);
      loadData();
    } catch (err: any) {
      toast(err.message || 'Erro ao registrar pagamento', 'error');
    } finally {
      setSaving(false);
    }
  };

  const formatDateTime = (isoStr: string) => {
    const d = new Date(isoStr);
    return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(d);
  };

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  return (
    <Layout>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Pagamentos</h1>
          <p className="text-slate-400">Histórico de pagamentos recebidos.</p>
        </div>
        <button 
          onClick={handleOpenModal} 
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Registrar Pagamento
        </button>
      </div>

      <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-950/50 text-slate-500 border-b border-slate-800">
              <tr>
                <th className="px-5 py-3 font-medium uppercase text-[10px] tracking-wider">Cliente</th>
                <th className="px-5 py-3 font-medium uppercase text-[10px] tracking-wider">Plano</th>
                <th className="px-5 py-3 font-medium uppercase text-[10px] tracking-wider">Valor Pago</th>
                <th className="px-5 py-3 font-medium uppercase text-[10px] tracking-wider">Data do Pagamento</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {loading ? (
                <tr>
                   <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                    <div className="flex justify-center"><div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div></div>
                  </td>
                </tr>
              ) : payments.length === 0 ? (
                <tr>
                   <td colSpan={4} className="px-6 py-8 text-center text-slate-500">Nenhum pagamento registrado.</td>
                </tr>
              ) : (
                payments.map((pay) => {
                  const sub = subs.find(s => s.id === pay.subscription_id);
                  const cust = customers.find(c => c.id === sub?.customer_id);
                  const plan = plans.find(p => p.id === sub?.plan_id);

                  return (
                    <tr key={pay.id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-white">{cust?.name || 'Desconhecido'}</td>
                      <td className="px-6 py-4 text-slate-300">
                        {plan?.name || '...'}
                      </td>
                      <td className="px-6 py-4 text-white font-medium flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                        {formatCurrency(pay.amount)}
                      </td>
                      <td className="px-6 py-4 text-slate-400">
                        {formatDateTime(pay.paid_at)}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => !saving && setIsModalOpen(false)} 
        title="Registrar Pagamento Manual"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-sm text-indigo-200 mb-4">
            Registrar um pagamento renovará a assinatura automaticamente por +30 dias a partir do vencimento.
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Assinatura</label>
            <select 
              required
              value={formData.subscription_id}
              onChange={e => setFormData({ ...formData, subscription_id: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-indigo-500 transition-colors appearance-none"
            >
              <option value="" disabled>Selecione a assinatura (Cliente - Plano)</option>
              {subs.filter(s => s.status !== 'cancelled').map(s => {
                const c = customers.find(x => x.id === s.customer_id);
                const p = plans.find(x => x.id === s.plan_id);
                return (
                  <option key={s.id} value={s.id}>
                    {c?.name} - {p?.name} {s.status === 'expired' ? ' (Vencida)' : ''}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Valor do Pagamento</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">R$</span>
                <input 
                  required
                  type="number" 
                  step="0.01"
                  min="0"
                  value={formData.amount}
                  onChange={e => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                  className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-indigo-500 transition-colors" 
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Data e Hora</label>
              <input 
                required
                type="datetime-local" 
                value={formData.paid_at.slice(0, 16)} // slice to handle standard HTML input format
                onChange={e => setFormData({ ...formData, paid_at: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-indigo-500 transition-colors [color-scheme:dark]" 
              />
            </div>
          </div>
          
          <div className="pt-4 flex justify-end gap-3">
            <button 
              type="button" 
              onClick={() => setIsModalOpen(false)}
              disabled={saving}
              className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={saving}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              {saving ? 'Registrando...' : 'Confirmar'}
            </button>
          </div>
        </form>
      </Modal>
    </Layout>
  );
}
