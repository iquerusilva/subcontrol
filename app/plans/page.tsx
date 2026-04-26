'use client';

import Layout from '@/components/Layout';
import { Modal } from '@/components/Modal';
import { api } from '@/services';
import { Plan } from '@/services/types';
import { toast } from '@/lib/toast';
import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';

export default function PlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    active: true
  });

  const loadPlans = async () => {
    try {
      const data = await api.getPlans();
      setPlans(data);
    } catch (err) {
      toast('Erro ao carregar planos', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlans();
  }, []);

  const handleOpenModal = (plan?: Plan) => {
    if (plan) {
      setEditingId(plan.id);
      setFormData({
        name: plan.name,
        price: plan.price,
        active: plan.active
      });
    } else {
      setEditingId(null);
      setFormData({ name: '', price: 0, active: true });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await api.updatePlan(editingId, formData);
        toast('Plano atualizado com sucesso', 'success');
      } else {
        await api.createPlan(formData);
        toast('Plano criado com sucesso', 'success');
      }
      setIsModalOpen(false);
      loadPlans();
    } catch (err: any) {
      toast(err.message || 'Erro ao salvar plano', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente excluir este plano?')) return;
    try {
      await api.deletePlan(id);
      toast('Plano excluído com sucesso', 'success');
      loadPlans();
    } catch (err: any) {
      toast(err.message || 'Erro ao excluir, verifique se há assinaturas associadas', 'error');
    }
  };

  const filtered = plans.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  return (
    <Layout>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Planos</h1>
          <p className="text-slate-400">Configure os planos disponíveis para venda.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()} 
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Novo Plano
        </button>
      </div>

      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-800 bg-slate-900/50">
          <div className="relative max-w-md">
            <Search className="w-5 h-5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input 
              type="text"
              placeholder="Buscar plano..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-950/50 text-slate-500 border-b border-slate-800">
              <tr>
                <th className="px-5 py-3 font-medium uppercase text-[10px] tracking-wider">Nome</th>
                <th className="px-5 py-3 font-medium uppercase text-[10px] tracking-wider">Valor Mensal</th>
                <th className="px-5 py-3 font-medium uppercase text-[10px] tracking-wider">Status</th>
                <th className="px-5 py-3 font-medium uppercase text-[10px] tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                    <div className="flex justify-center"><div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div></div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500">Nenhum plano encontrado.</td>
                </tr>
              ) : (
                filtered.map((plan) => (
                  <tr key={plan.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-white">{plan.name}</td>
                    <td className="px-6 py-4 text-slate-400 font-medium">{formatCurrency(plan.price)}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold ${
                        plan.active 
                          ? 'bg-emerald-500/10 text-emerald-500' 
                          : 'bg-slate-500/10 text-slate-400'
                      }`}>
                        {plan.active ? 'ATIVO' : 'INATIVO'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button onClick={() => handleOpenModal(plan)} className="p-2 text-slate-400 hover:text-indigo-400 transition-colors inline-block rounded-md hover:bg-slate-800">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(plan.id)} className="p-2 text-slate-400 hover:text-rose-400 transition-colors inline-block rounded-md hover:bg-slate-800">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => !saving && setIsModalOpen(false)} 
        title={editingId ? 'Editar Plano' : 'Novo Plano'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Nome do Plano</label>
            <input 
              required
              type="text" 
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors" 
              placeholder="Ex: Start, Pro, Enterprise"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Valor Mensal (R$)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">R$</span>
              <input 
                required
                type="number" 
                step="0.01"
                min="0"
                value={formData.price}
                onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-indigo-500 transition-colors" 
                placeholder="0.00"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 pt-2">
            <input 
              type="checkbox"
              id="plan-active"
              checked={formData.active}
              onChange={e => setFormData({ ...formData, active: e.target.checked })}
              className="w-4 h-4 rounded border-slate-800 bg-slate-950 text-indigo-600 focus:ring-indigo-500/50 focus:ring-offset-0 transition-colors"
            />
            <label htmlFor="plan-active" className="text-sm font-medium text-slate-300 select-none cursor-pointer">
              Plano está ativo e visível 
            </label>
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
