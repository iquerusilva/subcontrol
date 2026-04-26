import { Customer, Plan, Subscription, Payment } from './types';

// Delay helper to simulate network latency
const delay = () => new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 300));

// Generate a random ID
const genId = () => Math.random().toString(36).substring(2, 9);

const initializeSeedData = () => {
  if (typeof window === 'undefined') return;
  const hasData = localStorage.getItem('subcontrol_customers');
  if (hasData) return; // Already seeded

  const today = new Date();
  const pastDate = new Date(today);
  pastDate.setDate(pastDate.getDate() - 15);
  const futureDate = new Date(today);
  futureDate.setDate(futureDate.getDate() + 15);
  const expiredDate = new Date(today);
  expiredDate.setDate(expiredDate.getDate() - 2);

  const formatDate = (d: Date) => d.toISOString().split('T')[0];

  const customers: Customer[] = [
    { id: 'c1', name: 'Acme Corp', email: 'contact@acme.com', status: 'active', notes: 'Top client', created_at: new Date().toISOString() },
    { id: 'c2', name: 'Globex Inc', email: 'info@globex.net', status: 'active', notes: '', created_at: new Date().toISOString() },
    { id: 'c3', name: 'Soylent Corp', email: 'sales@soylent.co', status: 'inactive', notes: 'Churned last month', created_at: new Date().toISOString() },
  ];
  const plans: Plan[] = [
    { id: 'p1', name: 'Pro', price: 99.00, active: true, created_at: new Date().toISOString() },
    { id: 'p2', name: 'Enterprise', price: 299.00, active: true, created_at: new Date().toISOString() },
  ];
  const subscriptions: Subscription[] = [
    { id: 's1', customer_id: 'c1', plan_id: 'p2', start_date: formatDate(pastDate), next_renewal: formatDate(futureDate), status: 'active', created_at: new Date().toISOString() },
    { id: 's2', customer_id: 'c2', plan_id: 'p1', start_date: formatDate(pastDate), next_renewal: formatDate(expiredDate), status: 'expired', created_at: new Date().toISOString() },
    { id: 's3', customer_id: 'c3', plan_id: 'p1', start_date: formatDate(pastDate), next_renewal: formatDate(pastDate), status: 'cancelled', created_at: new Date().toISOString() },
  ];
  const payments: Payment[] = [
    { id: 'py1', subscription_id: 's1', amount: 299.00, paid_at: pastDate.toISOString() },
    { id: 'py2', subscription_id: 's2', amount: 99.00, paid_at: pastDate.toISOString() },
  ];

  localStorage.setItem('subcontrol_customers', JSON.stringify(customers));
  localStorage.setItem('subcontrol_plans', JSON.stringify(plans));
  localStorage.setItem('subcontrol_subscriptions', JSON.stringify(subscriptions));
  localStorage.setItem('subcontrol_payments', JSON.stringify(payments));
};

// Generic read/write
const readTable = <T>(key: string): T[] => {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(`subcontrol_${key}`);
  return raw ? JSON.parse(raw) : [];
};
const writeTable = <T>(key: string, data: T[]) => {
  if (typeof window !== 'undefined') localStorage.setItem(`subcontrol_${key}`, JSON.stringify(data));
};

// Data integrity hooks
const updateSubscriptionStatuses = (subs: Subscription[]): Subscription[] => {
  const todayStr = new Date().toISOString().split('T')[0];
  let changed = false;
  const updated = subs.map(sub => {
    if (sub.status === 'active' && sub.next_renewal < todayStr) {
      changed = true;
      return { ...sub, status: 'expired' as const };
    }
    return sub;
  });
  if (changed) writeTable('subscriptions', updated);
  return updated;
};

// ---------- CUSTOMERS ----------
export const getCustomers = async (): Promise<Customer[]> => {
  initializeSeedData();
  await delay();
  return readTable<Customer>('customers');
};

export const createCustomer = async (data: Omit<Customer, 'id' | 'created_at'>): Promise<Customer> => {
  await delay();
  const customers = readTable<Customer>('customers');
  const newCustomer: Customer = { ...data, id: genId(), created_at: new Date().toISOString() };
  writeTable('customers', [...customers, newCustomer]);
  return newCustomer;
};

export const updateCustomer = async (id: string, data: Partial<Omit<Customer, 'id' | 'created_at'>>): Promise<Customer> => {
  await delay();
  const customers = readTable<Customer>('customers');
  const index = customers.findIndex(c => c.id === id);
  if (index === -1) throw new Error('Customer not found');
  const updated = { ...customers[index], ...data };
  customers[index] = updated;
  writeTable('customers', customers);
  return updated;
};

export const deleteCustomer = async (id: string): Promise<void> => {
  await delay();
  // Ensure no active subscriptions
  const subs = readTable<Subscription>('subscriptions');
  if (subs.some(s => s.customer_id === id)) {
    throw new Error('Cannot delete customer with existing subscriptions');
  }
  const customers = readTable<Customer>('customers').filter(c => c.id !== id);
  writeTable('customers', customers);
};

// ---------- PLANS ----------
export const getPlans = async (): Promise<Plan[]> => {
  await delay();
  return readTable<Plan>('plans');
};

export const createPlan = async (data: Omit<Plan, 'id' | 'created_at'>): Promise<Plan> => {
  await delay();
  const plans = readTable<Plan>('plans');
  const newPlan: Plan = { ...data, id: genId(), created_at: new Date().toISOString() };
  writeTable('plans', [...plans, newPlan]);
  return newPlan;
};

export const updatePlan = async (id: string, data: Partial<Omit<Plan, 'id' | 'created_at'>>): Promise<Plan> => {
  await delay();
  const plans = readTable<Plan>('plans');
  const index = plans.findIndex(p => p.id === id);
  if (index === -1) throw new Error('Plan not found');
  const updated = { ...plans[index], ...data };
  plans[index] = updated;
  writeTable('plans', plans);
  return updated;
};

export const deletePlan = async (id: string): Promise<void> => {
  await delay();
  const subs = readTable<Subscription>('subscriptions');
  if (subs.some(s => s.plan_id === id)) {
    throw new Error('Cannot delete plan that is in use by subscriptions');
  }
  const plans = readTable<Plan>('plans').filter(p => p.id !== id);
  writeTable('plans', plans);
};

// ---------- SUBSCRIPTIONS ----------
export const getSubscriptions = async (): Promise<Subscription[]> => {
  await delay();
  let subs = readTable<Subscription>('subscriptions');
  return updateSubscriptionStatuses(subs);
};

export const createSubscription = async (data: Omit<Subscription, 'id' | 'created_at' | 'status'>): Promise<Subscription> => {
  await delay();
  const subs = readTable<Subscription>('subscriptions');
  const todayStr = new Date().toISOString().split('T')[0];
  const isExpired = data.next_renewal < todayStr;
  
  const newSub: Subscription = { 
    ...data, 
    id: genId(), 
    status: isExpired ? 'expired' : 'active',
    created_at: new Date().toISOString() 
  };
  writeTable('subscriptions', [...subs, newSub]);
  return newSub;
};

export const updateSubscription = async (id: string, data: Partial<Omit<Subscription, 'id' | 'created_at'>>): Promise<Subscription> => {
  await delay();
  const subs = readTable<Subscription>('subscriptions');
  const index = subs.findIndex(s => s.id === id);
  if (index === -1) throw new Error('Subscription not found');
  
  let updated = { ...subs[index], ...data };
  const todayStr = new Date().toISOString().split('T')[0];
  
  if (updated.status === 'active' && updated.next_renewal < todayStr) {
    updated.status = 'expired';
  }

  subs[index] = updated;
  writeTable('subscriptions', subs);
  return updated;
};

export const deleteSubscription = async (id: string): Promise<void> => {
  await delay();
  const subs = readTable<Subscription>('subscriptions').filter(s => s.id !== id);
  writeTable('subscriptions', subs);
};

// ---------- PAYMENTS ----------
export const getPayments = async (): Promise<Payment[]> => {
  await delay();
  return readTable<Payment>('payments');
};

export const getPaymentsBySubscription = async (subId: string): Promise<Payment[]> => {
  await delay();
  return readTable<Payment>('payments').filter(p => p.subscription_id === subId);
};

export const createPayment = async (subscription_id: string, amount: number, paid_at: string): Promise<Payment> => {
  await delay();
  const payments = readTable<Payment>('payments');
  const newPayment: Payment = { id: genId(), subscription_id, amount, paid_at };
  writeTable('payments', [...payments, newPayment]);

  // Update subscription +30 days
  const subs = readTable<Subscription>('subscriptions');
  const subIndex = subs.findIndex(s => s.id === subscription_id);
  if (subIndex > -1) {
    const sub = subs[subIndex];
    // Next renewal is +30 days from either current next_renewal or today (whichever is later)
    // Actually, simple rule: renew +30 days from today if expired, or +30 days from next renewal if active
    let baseDate = new Date(sub.next_renewal);
    const today = new Date();
    if (baseDate < today) baseDate = today;
    
    baseDate.setDate(baseDate.getDate() + 30);
    
    subs[subIndex] = {
      ...sub,
      status: 'active',
      next_renewal: baseDate.toISOString().split('T')[0]
    };
    writeTable('subscriptions', subs);
  }

  return newPayment;
};
