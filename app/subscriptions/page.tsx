'use client';

import Layout from '@/components/Layout';
import { Modal } from '@/components/Modal';
import { api } from '@/services';
import { Subscription, Customer, Plan } from '@/services/types';
import { toast } from '@/lib/toast';
import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Search, AlertCircle, Ban } from 'lucide-react';

export default function SubscriptionsPage() {
  const [subs, setSubs] = useState<Subscription[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    customer_id: '',
    plan_id: '',
    start_date: new Date().toISOString().split('T')[0],
    next_renewal: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0]
  });

  const loadData = async () => {
    try {
      const [subsData, custData, plansData] = await Promise.all([
        api.getSubscriptions(),
        api.getCustomers(),
        api.getPlans()
      ]);
      setSubs(subsData);
      setCustomers(custData);
      setPlans(plansData);
    } catch (err) {
      toast('Erro ao carregar dados', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenModal = (sub?: Subscription) => {
    if (sub) {
      setEditingId(sub.id);
      setFormData({
        customer_id: sub.customer_id,
        plan_id: sub.plan_id,
        start_date: sub.start_date,
        next_renewal: sub.next_renewal
      });
    } else {
      setEditingId(null);
      const today = new Date();
      const nextMonth = new Date(today);
      nextMonth.setDate(nextMonth.getDate() + 30);
      setFormData({ 
        customer_id: customers.length > 0 ? customers[0].id : '', 
        plan_id: plans.length > 0 ? plans[0].id : '', 
        start_date: today.toISOString().split('T')[0],
        next_renewal: nextMonth.toISOString().split('T')[0]
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customer_id || !formData.plan_id) {
       toast('Selecione um cliente e um plano.', 'error');
       return;
    }
    setSaving(true);
    try {
      if (editingId) {
        await api.updateSubscription(editingId, formData);
        toast('Assinatura atualizada com sucesso', 'success');
      } else {
        await api.createSubscription(formData);
        toast('Assinatura criada com sucesso', 'success');
      }
      setIsModalOpen(false);
      loadData();
    } catch (err: any) {
      toast(err.message || 'Erro ao salvar assinatura', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelSub = async (id: string) => {
    if (!confirm('Deseja cancelar esta assinatura? Ela não será faturada novamente.')) return;
    setLoading(true);
    try {
      await api.updateSubscription(id, { status: 'cancelled' });
      toast('Assinatura cancelada.', 'success');
      loadData();
    } catch {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja excluir definitivamente este registro? Os pagamentos associados poderão causar inconsistência.')) return;
    setLoading(true);
    try {
      await api.deleteSubscription(id);
      toast('Assinatura apagada.', 'success');
      loadData();
    } catch (err: any) {
      toast('Erro ao excluir', 'error');
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => 
    new Intl.DateTimeFormat('pt-BR').format(new Date(dateStr));

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const StatusBadge = ({ status }: { status: string }) => {
    switch (status) {
      case 'active':
        return <span className="inline-flex py-1 px-2 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[10px] font-bold uppercase">Ativa</span>;
      case 'expired':
        return <span className="inline-flex py-1 px-2 rounded bg-rose-500/10 text-rose-500 border border-rose-500/20 text-[10px] font-bold uppercase">Vencida</span>;
      case 'cancelled':
        return <span className="inline-flex py-1 px-2 rounded bg-slate-500/10 text-slate-400 border border-slate-500/20 text-[10px] font-bold uppercase">Cancelada</span>;
      default: return null;
    }
  };

  return (
    <Layout>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Assinaturas</h1>
          <p className="text-slate-400">Gerencie a recorrência dos seus clientes.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()} 
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nova Assinatura
        </button>
      </div>

      <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-950/50 text-slate-500 border-b border-slate-800">
              <tr>
                <th className="px-5 py-3 font-medium uppercase text-[10px] tracking-wider">Cliente</th>
                <th className="px-5 py-3 font-medium uppercase text-[10px] tracking-wider">Plano</th>
                <th className="px-5 py-3 font-medium uppercase text-[10px] tracking-wider">Início</th>
                <th className="px-5 py-3 font-medium uppercase text-[10px] tracking-wider">Próx. Vencimento</th>
                <th className="px-5 py-3 font-medium uppercase text-[10px] tracking-wider text-center">Status</th>
                <th className="px-5 py-3 font-medium uppercase text-[10px] tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                    <div className="flex justify-center"><div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div></div>
                  </td>
                </tr>
              ) : subs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">Nenhuma assinatura registrada.</td>
                </tr>
              ) : (
                subs.map((sub) => {
                  const cust = customers.find(c => c.id === sub.customer_id);
                  const plan = plans.find(p => p.id === sub.plan_id);

                  return (
                    <tr key={sub.id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-white">{cust?.name || 'Desconhecido'}</td>
                      <td className="px-6 py-4 text-slate-300">
                        {plan?.name || '...'} <span className="text-slate-500 text-xs ml-1">({formatCurrency(plan?.price || 0)})</span>
                      </td>
                      <td className="px-6 py-4 text-slate-400">{formatDate(sub.start_date)}</td>
                      <td className="px-6 py-4 text-slate-200 font-medium">
                        {formatDate(sub.next_renewal)}
                        {sub.status === 'expired' && <AlertCircle className="inline w-4 h-4 ml-2 text-rose-500" />}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <StatusBadge status={sub.status} />
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        {sub.status !== 'cancelled' && (
                          <button 
                            onClick={() => handleCancelSub(sub.id)} 
                            title="Cancelar Assinatura"
                            className="p-2 text-slate-400 hover:text-amber-500 transition-colors inline-block rounded-md hover:bg-slate-800"
                          >
                            <Ban className="w-4 h-4" />
                          </button>
                        )}
                        <button onClick={() => handleOpenModal(sub)} className="p-2 text-slate-400 hover:text-indigo-400 transition-colors inline-block rounded-md hover:bg-slate-800">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(sub.id)} className="p-2 text-slate-400 hover:text-rose-400 transition-colors inline-block rounded-md hover:bg-slate-800">
                          <Trash2 className="w-4 h-4" />
                        </button>
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
        title={editingId ? 'Editar Assinatura' : 'Nova Assinatura'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Cliente</label>
            <select 
              required
              value={formData.customer_id}
              onChange={e => setFormData({ ...formData, customer_id: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-indigo-500 transition-colors appearance-none"
            >
              <option value="" disabled>Selecione um cliente</option>
              {customers.filter(c => c.status === 'active' || c.id === formData.customer_id).map(c => (
                <option key={c.id} value={c.id}>{c.name} {c.status === 'inactive' ? '(Inativo)' : ''}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Plano</label>
            <select 
              required
              value={formData.plan_id}
              onChange={e => setFormData({ ...formData, plan_id: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-indigo-500 transition-colors appearance-none"
            >
              <option value="" disabled>Selecione um plano</option>
              {plans.filter(p => p.active || p.id === formData.plan_id).map(p => (
                <option key={p.id} value={p.id}>{p.name} - {formatCurrency(p.price)}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Data de Início</label>
              <input 
                required
                type="date" 
                value={formData.start_date}
                onChange={e => setFormData({ ...formData, start_date: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-indigo-500 transition-colors [color-scheme:dark]" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Próx. Vencimento</label>
              <input 
                required
                type="date" 
                value={formData.next_renewal}
                onChange={e => setFormData({ ...formData, next_renewal: e.target.value })}
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
              {saving ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </Modal>
    </Layout>
  );
}
