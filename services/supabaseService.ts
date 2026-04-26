import { supabase } from '../lib/supabaseClient';
import { Customer, Plan, Subscription, Payment } from './types';

// Helper to check for errors
const checkError = (error: any, context: string) => {
  if (error) {
    console.error(`Error in ${context}:`, error);
    throw new Error(error.message);
  }
};

// ---------- CUSTOMERS ----------
export const getCustomers = async (): Promise<Customer[]> => {
  const { data, error } = await supabase.from('customers').select('*').order('created_at', { ascending: false });
  checkError(error, 'getCustomers');
  return data as Customer[];
};

export const createCustomer = async (data: Omit<Customer, 'id' | 'created_at'>): Promise<Customer> => {
  const { data: newCustomer, error } = await supabase.from('customers').insert(data).select().single();
  checkError(error, 'createCustomer');
  return newCustomer as Customer;
};

export const updateCustomer = async (id: string, data: Partial<Omit<Customer, 'id' | 'created_at'>>): Promise<Customer> => {
  const { data: updatedCustomer, error } = await supabase.from('customers').update(data).eq('id', id).select().single();
  checkError(error, 'updateCustomer');
  return updatedCustomer as Customer;
};

export const deleteCustomer = async (id: string): Promise<void> => {
  // Supabase ON DELETE CASCADE handles related subscriptions if configured, otherwise we throw
  const { error } = await supabase.from('customers').delete().eq('id', id);
  checkError(error, 'deleteCustomer');
};

// ---------- PLANS ----------
export const getPlans = async (): Promise<Plan[]> => {
  const { data, error } = await supabase.from('plans').select('*').order('created_at', { ascending: false });
  checkError(error, 'getPlans');
  return data as Plan[];
};

export const createPlan = async (data: Omit<Plan, 'id' | 'created_at'>): Promise<Plan> => {
  const { data: newPlan, error } = await supabase.from('plans').insert(data).select().single();
  checkError(error, 'createPlan');
  return newPlan as Plan;
};

export const updatePlan = async (id: string, data: Partial<Omit<Plan, 'id' | 'created_at'>>): Promise<Plan> => {
  const { data: updatedPlan, error } = await supabase.from('plans').update(data).eq('id', id).select().single();
  checkError(error, 'updatePlan');
  return updatedPlan as Plan;
};

export const deletePlan = async (id: string): Promise<void> => {
  const { error } = await supabase.from('plans').delete().eq('id', id);
  checkError(error, 'deletePlan');
};

// ---------- SUBSCRIPTIONS ----------
export const getSubscriptions = async (): Promise<Subscription[]> => {
  // Update expired statuses first
  const todayStr = new Date().toISOString().split('T')[0];
  await supabase
    .from('subscriptions')
    .update({ status: 'expired' })
    .eq('status', 'active')
    .lt('next_renewal', todayStr);

  const { data, error } = await supabase.from('subscriptions').select('*').order('created_at', { ascending: false });
  checkError(error, 'getSubscriptions');
  return data as Subscription[];
};

export const createSubscription = async (data: Omit<Subscription, 'id' | 'created_at' | 'status'>): Promise<Subscription> => {
  const todayStr = new Date().toISOString().split('T')[0];
  const isExpired = data.next_renewal < todayStr;
  const status = isExpired ? 'expired' : 'active';

  const { data: newSub, error } = await supabase.from('subscriptions').insert({ ...data, status }).select().single();
  checkError(error, 'createSubscription');
  return newSub as Subscription;
};

export const updateSubscription = async (id: string, data: Partial<Omit<Subscription, 'id' | 'created_at'>>): Promise<Subscription> => {
  // We need to fetch it first to check business rules
  const { data: currentSub } = await supabase.from('subscriptions').select('*').eq('id', id).single();
  
  if (!currentSub) throw new Error('Subscription not found');

  let updatedData = { ...data };
  const todayStr = new Date().toISOString().split('T')[0];
  
  // Apply logic: if active and next_renewal is in the past, it's expired
  const next_renewal = updatedData.next_renewal || currentSub.next_renewal;
  const currentStatus = updatedData.status || currentSub.status;
  
  if (currentStatus === 'active' && next_renewal < todayStr) {
    updatedData.status = 'expired';
  }

  const { data: updatedSub, error } = await supabase.from('subscriptions').update(updatedData).eq('id', id).select().single();
  checkError(error, 'updateSubscription');
  return updatedSub as Subscription;
};

export const deleteSubscription = async (id: string): Promise<void> => {
  const { error } = await supabase.from('subscriptions').delete().eq('id', id);
  checkError(error, 'deleteSubscription');
};

// ---------- PAYMENTS ----------
export const getPayments = async (): Promise<Payment[]> => {
  const { data, error } = await supabase.from('payments').select('*').order('paid_at', { ascending: false });
  checkError(error, 'getPayments');
  return data as Payment[];
};

export const getPaymentsBySubscription = async (subId: string): Promise<Payment[]> => {
  const { data, error } = await supabase.from('payments').select('*').eq('subscription_id', subId).order('paid_at', { ascending: false });
  checkError(error, 'getPaymentsBySubscription');
  return data as Payment[];
};

export const createPayment = async (subscription_id: string, amount: number, paid_at: string): Promise<Payment> => {
  const { data: newPayment, error } = await supabase.from('payments').insert({ subscription_id, amount, paid_at }).select().single();
  checkError(error, 'createPayment');

  // Business logic: Update subscription +30 days
  const { data: sub } = await supabase.from('subscriptions').select('*').eq('id', subscription_id).single();
  
  if (sub) {
    let baseDate = new Date(sub.next_renewal);
    const today = new Date();
    if (baseDate < today) baseDate = today;
    
    baseDate.setDate(baseDate.getDate() + 30);
    const next_renewal = baseDate.toISOString().split('T')[0];

    await supabase.from('subscriptions').update({ status: 'active', next_renewal }).eq('id', subscription_id);
  }

  return newPayment as Payment;
};
